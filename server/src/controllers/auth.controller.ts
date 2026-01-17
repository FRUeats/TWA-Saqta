import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate Telegram WebApp initData
 * Returns the parsed user data if valid, null if invalid
 */
function validateTelegramInitData(initData: string, botToken: string): any {
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');

        if (!hash) {
            console.error('No hash in initData');
            return null;
        }

        // Remove hash from params
        urlParams.delete('hash');

        // Create data check string (sorted alphabetically)
        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        // Generate secret key
        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest();

        // Calculate hash
        const calculatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        // Compare hashes
        if (calculatedHash !== hash) {
            console.error('Hash mismatch');
            return null;
        }

        // Check auth_date (must be within 1 hour)
        const authDate = urlParams.get('auth_date');
        if (authDate) {
            const authTimestamp = parseInt(authDate);
            const now = Math.floor(Date.now() / 1000);
            const oneHour = 60 * 60;

            if (now - authTimestamp > oneHour) {
                console.error('initData too old');
                return null;
            }
        }

        // Parse user data
        const userParam = urlParams.get('user');
        if (!userParam) {
            console.error('No user in initData');
            return null;
        }

        return JSON.parse(userParam);
    } catch (error) {
        console.error('Error validating initData:', error);
        return null;
    }
}

// ============================================
// CONTROLLERS
// ============================================

/**
 * POST /api/auth/login
 * Login/Register as BUYER
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { initData } = req.body;

        if (!initData) {
            return res.status(400).json({ error: 'initData is required' });
        }

        // Validate Telegram data
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            return res.status(500).json({ error: 'Bot token not configured' });
        }

        const telegramUser = validateTelegramInitData(initData, botToken);
        if (!telegramUser) {
            return res.status(401).json({ error: 'Invalid Telegram data' });
        }

        // Create or update user
        const user = await prisma.user.upsert({
            where: { id: telegramUser.id.toString() },
            update: {
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name || null,
                username: telegramUser.username || null,
                lastLoginAt: new Date(),
            },
            create: {
                id: telegramUser.id.toString(),
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name || null,
                username: telegramUser.username || null,
                role: 'BUYER',
                lastLoginAt: new Date(),
            },
        });

        // Check if blocked
        if (user.isBlocked) {
            return res.status(403).json({ error: 'Account is blocked' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                isVerified: user.isVerified,
                companyName: user.companyName,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/auth/vendor/register
 * Register as MERCHANT
 */
export const vendorRegister = async (req: Request, res: Response) => {
    try {
        const { initData, companyName } = req.body;

        if (!initData || !companyName) {
            return res.status(400).json({
                error: 'initData and companyName are required'
            });
        }

        // Validate company name
        if (companyName.trim().length < 3) {
            return res.status(400).json({
                error: 'Company name must be at least 3 characters'
            });
        }

        // Validate Telegram data
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            return res.status(500).json({ error: 'Bot token not configured' });
        }

        const telegramUser = validateTelegramInitData(initData, botToken);
        if (!telegramUser) {
            return res.status(401).json({ error: 'Invalid Telegram data' });
        }

        // Check if user already exists with different role
        const existingUser = await prisma.user.findUnique({
            where: { id: telegramUser.id.toString() },
        });

        if (existingUser && existingUser.role === 'MERCHANT') {
            return res.status(400).json({
                error: 'User is already registered as merchant'
            });
        }

        // Create or update user as MERCHANT
        const user = await prisma.user.upsert({
            where: { id: telegramUser.id.toString() },
            update: {
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name || null,
                username: telegramUser.username || null,
                role: 'MERCHANT',
                companyName: companyName.trim(),
                lastLoginAt: new Date(),
            },
            create: {
                id: telegramUser.id.toString(),
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name || null,
                username: telegramUser.username || null,
                role: 'MERCHANT',
                companyName: companyName.trim(),
                isVerified: false, // Requires admin verification
                lastLoginAt: new Date(),
            },
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                isVerified: user.isVerified,
                companyName: user.companyName,
            },
            message: user.isVerified
                ? 'Registration successful'
                : 'Registration successful. Awaiting admin verification.',
        });
    } catch (error) {
        console.error('Vendor registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/auth/me
 * Get current user info
 */
export const getMe = async (req: Request, res: Response) => {
    try {
        const { initData } = req.query;

        if (!initData || typeof initData !== 'string') {
            return res.status(400).json({ error: 'initData is required' });
        }

        // Validate Telegram data
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            return res.status(500).json({ error: 'Bot token not configured' });
        }

        const telegramUser = validateTelegramInitData(initData, botToken);
        if (!telegramUser) {
            return res.status(401).json({ error: 'Invalid Telegram data' });
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: telegramUser.id.toString() },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ error: 'Account is blocked' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                isVerified: user.isVerified,
                companyName: user.companyName,
            },
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * PUT /api/auth/role
 * Switch user role (for development/testing only)
 */
export const switchRole = async (req: Request, res: Response) => {
    try {
        // Only allow in development
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ error: 'Not available in production' });
        }

        const { initData, role, companyName } = req.body;

        if (!initData || !role) {
            return res.status(400).json({ error: 'initData and role are required' });
        }

        if (role === 'MERCHANT' && !companyName) {
            return res.status(400).json({
                error: 'companyName required for MERCHANT role'
            });
        }

        // Validate Telegram data
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            return res.status(500).json({ error: 'Bot token not configured' });
        }

        const telegramUser = validateTelegramInitData(initData, botToken);
        if (!telegramUser) {
            return res.status(401).json({ error: 'Invalid Telegram data' });
        }

        // Update user role
        const user = await prisma.user.update({
            where: { id: telegramUser.id.toString() },
            data: {
                role,
                companyName: role === 'MERCHANT' ? companyName : null,
                isVerified: role === 'MERCHANT' ? true : false, // Auto-verify in dev
            },
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                isVerified: user.isVerified,
                companyName: user.companyName,
            },
        });
    } catch (error) {
        console.error('Switch role error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
