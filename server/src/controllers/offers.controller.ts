import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { mockOffers, mockStores } from '../mock/mockData.js';
import { offerSchema } from '../utils/validation.js';

const prisma = new PrismaClient();
const USE_MOCK = process.env.USE_MOCK === 'true' || process.env.NODE_ENV === 'development';

// In-memory storage for new offers created in mock mode
let dynamicMockOffers = [...mockOffers];

// GET /api/offers - List all active offers
export const getAllOffers = async (req: Request, res: Response) => {
    try {
        // Try database first
        const offers = await prisma.offer.findMany({
            where: { isActive: true },
            include: {
                store: {
                    select: {
                        name: true,
                        address: true,
                        image: true,
                        phone: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(offers);
    } catch (error) {
        // Fallback to mock data
        console.log('📦 Using mock data for offers (DB unavailable)');
        res.json(dynamicMockOffers.filter(o => o.isActive));
    }
};

// GET /api/offers/:id - Get single offer
export const getOfferById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const offer = await prisma.offer.findUnique({
            where: { id },
            include: {
                store: {
                    select: {
                        name: true,
                        address: true,
                        image: true,
                        phone: true,
                    },
                },
            },
        });

        if (!offer || !offer.isActive) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        res.json(offer);
    } catch (error) {
        // Fallback to mock data
        const { id } = req.params;
        const offer = dynamicMockOffers.find(o => o.id === id && o.isActive);
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        console.log('📦 Using mock data for offer detail (DB unavailable)');
        res.json(offer);
    }
};

// POST /api/offers - Create new offer (merchant only)
export const createOffer = async (req: Request, res: Response) => {
    try {
        // Validate input using Zod
        const validationResult = offerSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            });
        }

        const {
            storeId,
            originalPrice,
            discountedPrice,
            quantity,
            pickupStart,
            pickupEnd,
            description,
            image,
        } = validationResult.data;

        const offer = await prisma.offer.create({
            data: {
                storeId,
                originalPrice: parseFloat(originalPrice),
                discountedPrice: parseFloat(discountedPrice),
                quantity: parseInt(quantity),
                pickupStart: new Date(pickupStart),
                pickupEnd: new Date(pickupEnd),
                description,
                image,
            },
            include: {
                store: {
                    select: {
                        name: true,
                        address: true,
                    },
                },
            },
        });

        res.status(201).json(offer);
    } catch (error) {
        // Fallback to mock mode
        const {
            storeId,
            originalPrice,
            discountedPrice,
            quantity,
            pickupStart,
            pickupEnd,
            description,
            image,
        } = req.body;

        // Use default store if storeId not matching
        const store = mockStores.find(s => s.id === storeId) || mockStores[0];

        const newOffer = {
            id: `offer-${Date.now()}`,
            storeId: store.id,
            store: store,
            originalPrice: parseFloat(originalPrice),
            discountedPrice: parseFloat(discountedPrice),
            quantity: parseInt(quantity),
            pickupStart: new Date(pickupStart).toISOString(),
            pickupEnd: new Date(pickupEnd).toISOString(),
            description: description || 'Surprise bag',
            image: image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        dynamicMockOffers.unshift(newOffer);
        console.log('📦 Created mock offer (DB unavailable):', newOffer.id);
        res.status(201).json(newOffer);
    }
};

// PUT /api/offers/:id - Update offer (merchant only)
export const updateOffer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const offer = await prisma.offer.update({
            where: { id },
            data: updates,
        });

        res.json(offer);
    } catch (error) {
        // Fallback to mock mode
        const { id } = req.params;
        const index = dynamicMockOffers.findIndex(o => o.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        dynamicMockOffers[index] = { ...dynamicMockOffers[index], ...req.body, updatedAt: new Date().toISOString() };
        console.log('📦 Updated mock offer (DB unavailable)');
        res.json(dynamicMockOffers[index]);
    }
};

// DELETE /api/offers/:id - Delete offer (soft delete)
export const deleteOffer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const offer = await prisma.offer.update({
            where: { id },
            data: { isActive: false },
        });

        res.json({ message: 'Offer deleted successfully', offer });
    } catch (error) {
        // Fallback to mock mode
        const { id } = req.params;
        const index = dynamicMockOffers.findIndex(o => o.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        dynamicMockOffers[index].isActive = false;
        console.log('📦 Deleted mock offer (DB unavailable)');
        res.json({ message: 'Offer deleted successfully', offer: dynamicMockOffers[index] });
    }
};
