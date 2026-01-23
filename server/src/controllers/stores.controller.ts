import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { storeSchema } from '../utils/validation.js';

const prisma = new PrismaClient();

/**
 * Get all stores
 */
export const getAllStores = async (req: Request, res: Response) => {
    try {
        const stores = await prisma.store.findMany({
            include: {
                merchant: {
                    select: {
                        id: true,
                        firstName: true,
                        companyName: true,
                    },
                },
            },
        });

        res.json(stores);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
};

/**
 * Get store by ID
 */
export const getStoreById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const store = await prisma.store.findUnique({
            where: { id },
            include: {
                merchant: {
                    select: {
                        id: true,
                        firstName: true,
                        companyName: true,
                    },
                },
            },
        });

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.json(store);
    } catch (error) {
        console.error('Error fetching store:', error);
        res.status(500).json({ error: 'Failed to fetch store' });
    }
};

/**
 * Create or update store (ONE per merchant)
 * This uses UPSERT to ensure one store per vendor
 */
export const createOrUpdateStore = async (req: Request, res: Response) => {
    try {
        // Validate input using Zod
        const validationResult = storeSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.issues.map((e: any) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            });
        }

        const { name, address, latitude, longitude, phone, description } = validationResult.data;

        // TODO: Get merchantId from auth middleware when ready
        // For now, use a dev merchant ID
        const merchantId = req.body.merchantId || 'dev-merchant-123';

        // UPSERT: Create if doesn't exist, update if exists
        // This enforces ONE store per merchant (merchantId is @unique)
        const store = await prisma.store.upsert({
            where: { merchantId }, // Uses unique constraint
            create: {
                name,
                address,
                latitude,
                longitude,
                phone,
                description,
                merchantId,
            },
            update: {
                name,
                address,
                latitude,
                longitude,
                phone,
                description,
            },
        });

        console.log('Store created/updated:', store);

        res.json({
            success: true,
            message: 'Store settings saved (ONE store per merchant)',
            store,
        });
    } catch (error) {
        console.error('Error saving store:', error);
        res.status(500).json({ error: 'Failed to save store' });
    }
};

/**
 * Get vendor's store (for checking if they have one)
 */
export const getVendorStore = async (req: Request, res: Response) => {
    try {
        // TODO: Get merchantId from auth middleware
        const merchantId = req.params.merchantId || 'dev-merchant-123';

        const store = await prisma.store.findUnique({
            where: { merchantId },
        });

        if (!store) {
            return res.status(404).json({ error: 'No store found for this vendor' });
        }

        res.json(store);
    } catch (error) {
        console.error('Error fetching vendor store:', error);
        res.status(500).json({ error: 'Failed to fetch vendor store' });
    }
};
