import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { mockOffers, mockOrders, addMockOrder, updateOfferQuantity, generateQRCode } from '../mock/mockData.js';
import { orderSchema } from '../utils/validation.js';

const prisma = new PrismaClient();

// In-memory storage for mock orders
let dynamicMockOrders: any[] = [...mockOrders];

// POST /api/orders - Create new order
export const createOrder = async (req: Request, res: Response) => {
    try {
        // Validate input using Zod
        const validationResult = orderSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.issues.map((e: any) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            });
        }

        const { offerId, notes } = validationResult.data;
        const userId = req.body.userId; // userId might come from auth middleware

        // Check if offer is still available
        const offer = await prisma.offer.findUnique({
            where: { id: offerId },
        });

        if (!offer || !offer.isActive || offer.quantity <= 0) {
            return res.status(400).json({ error: 'Offer not available' });
        }

        // Generate unique QR code
        const qrCode = `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

        // Create order and decrement offer quantity in transaction
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    offerId,
                    notes,
                    qrCode,
                    status: 'PENDING',
                },
                include: {
                    offer: {
                        include: {
                            store: true,
                        },
                    },
                },
            });

            // Decrement quantity
            await tx.offer.update({
                where: { id: offerId },
                data: { quantity: { decrement: 1 } },
            });

            return newOrder;
        });

        res.status(201).json(order);
    } catch (error) {
        // Fallback to mock mode
        const { userId, offerId, notes } = req.body;

        // Find mock offer
        const offer = mockOffers.find(o => o.id === offerId && o.isActive);
        if (!offer || offer.quantity <= 0) {
            return res.status(400).json({ error: 'Offer not available' });
        }

        // Decrement quantity
        updateOfferQuantity(offerId, -1);

        const newOrder = {
            id: `order-${Date.now()}`,
            userId,
            offerId,
            notes,
            qrCode: generateQRCode(),
            status: 'PENDING',
            offer: offer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: null,
        };

        dynamicMockOrders.push(newOrder);
        console.log('📦 Created mock order (DB unavailable):', newOrder.id);
        res.status(201).json(newOrder);
    }
};

// GET /api/orders/user/:userId - Get user's orders
export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                offer: {
                    include: {
                        store: {
                            select: {
                                name: true,
                                address: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(orders);
    } catch (error) {
        // Fallback to mock data
        const { userId } = req.params;
        const userOrders = dynamicMockOrders.filter(o => o.userId === userId);
        console.log('📦 Using mock data for user orders (DB unavailable)');
        res.json(userOrders);
    }
};

// GET /api/orders/:id - Get single order
export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                offer: {
                    include: {
                        store: true,
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        // Fallback to mock data
        const { id } = req.params;
        const order = dynamicMockOrders.find(o => o.id === id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        console.log('📦 Using mock data for order (DB unavailable)');
        res.json(order);
    }
};

// PUT /api/orders/:id/complete - Mark order as completed
export const completeOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
            },
        });

        res.json(order);
    } catch (error) {
        // Fallback to mock mode
        const { id } = req.params;
        const index = dynamicMockOrders.findIndex(o => o.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }
        dynamicMockOrders[index] = {
            ...dynamicMockOrders[index],
            status: 'COMPLETED',
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        console.log('📦 Completed mock order (DB unavailable)');
        res.json(dynamicMockOrders[index]);
    }
};

// GET /api/orders/qr/:qrCode - Validate QR code
export const validateQRCode = async (req: Request, res: Response) => {
    try {
        const { qrCode } = req.params;

        const order = await prisma.order.findUnique({
            where: { qrCode },
            include: {
                offer: {
                    include: {
                        store: true,
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!order) {
            return res.status(404).json({ error: 'Invalid QR code' });
        }

        res.json(order);
    } catch (error) {
        // Fallback to mock data
        const { qrCode } = req.params;
        const order = dynamicMockOrders.find(o => o.qrCode === qrCode);
        if (!order) {
            return res.status(404).json({ error: 'Invalid QR code' });
        }
        console.log('📦 Validated mock QR code (DB unavailable)');
        res.json(order);
    }
};

// GET /api/orders/store/:storeId - Get orders for a store (merchant)
export const getStoreOrders = async (req: Request, res: Response) => {
    try {
        const { storeId } = req.params;

        const orders = await prisma.order.findMany({
            where: {
                offer: {
                    storeId: storeId,
                },
            },
            include: {
                offer: {
                    include: {
                        store: {
                            select: {
                                name: true,
                                address: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(orders);
    } catch (error) {
        // Fallback to mock data
        const { storeId } = req.params;
        const storeOrders = dynamicMockOrders.filter(o => o.offer?.storeId === storeId);
        console.log('📦 Using mock data for store orders (DB unavailable)');
        res.json(storeOrders);
    }
};
