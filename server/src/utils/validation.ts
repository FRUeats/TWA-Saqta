/**
 * Validation schemas using Zod
 */

import { z, ZodIssue } from 'zod';

// Store validation
export const storeSchema = z.object({
    name: z.string().min(2, 'Store name must be at least 2 characters').max(100),
    address: z.string().min(5, 'Address must be at least 5 characters').max(200),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    phone: z.string().optional(),
    description: z.string().max(500).optional(),
});

// Offer validation
export const offerSchema = z.object({
    storeId: z.string().min(1, 'Store ID is required'),
    originalPrice: z.number().positive('Price must be positive'),
    discountedPrice: z.number().positive('Discounted price must be positive'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    pickupStart: z.string().datetime(),
    pickupEnd: z.string().datetime(),
    description: z.string().max(500).optional(),
    image: z.string().url().optional().or(z.literal('')),
});

// Order validation
export const orderSchema = z.object({
    offerId: z.string().min(1, 'Offer ID is required'),
    userId: z.string().min(1, 'User ID is required').optional(), // Optional if comes from auth middleware
    notes: z.string().max(500).optional(),
});

// Auth validation
export const authSchema = z.object({
    initData: z.string().min(1, 'initData is required'),
});

export const vendorRegisterSchema = z.object({
    initData: z.string().min(1, 'initData is required'),
    companyName: z.string().min(3, 'Company name must be at least 3 characters').max(100),
});

// Validation middleware helper
export function validate<T>(schema: z.ZodSchema<T>) {
    return (req: any, res: any, next: any) => {
        try {
            const validated = schema.parse(req.body);
            req.validated = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues.map((e: ZodIssue) => ({
                        path: e.path.join('.'),
                        message: e.message,
                    })),
                });
            }
            next(error);
        }
    };
}
