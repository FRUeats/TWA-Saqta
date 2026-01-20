import { Request, Response } from 'express';
import { mockStores } from '../mock/mockData';

/**
 * Get all stores
 */
export const getAllStores = async (req: Request, res: Response) => {
    try {
        // In production, this would query prisma
        // const stores = await prisma.store.findMany();

        // For now, return mock data
        res.json(mockStores);
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

        // In production:
        // const store = await prisma.store.findUnique({ where: { id } });

        const store = mockStores.find(s => s.id === id);

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
 * Create or update store
 */
export const createOrUpdateStore = async (req: Request, res: Response) => {
    try {
        const { name, address, latitude, longitude, phone, description } = req.body;

        // Validation
        if (!name || !address || !latitude || !longitude) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // In production, you would:
        // const merchantId = req.user.id; // from auth middleware
        // const store = await prisma.store.upsert({
        //     where: { merchantId },
        //     create: { name, address, latitude, longitude, phone, description, merchantId },
        //     update: { name, address, latitude, longitude, phone, description },
        // });

        // For now, just return success
        const newStore = {
            id: 'store-' + Date.now(),
            name,
            address,
            latitude,
            longitude,
            phone,
            description,
            merchantId: 'dev-user-123',
        };

        console.log('Store created/updated:', newStore);

        res.json({
            success: true,
            message: 'Store settings saved successfully',
            store: newStore
        });
    } catch (error) {
        console.error('Error saving store:', error);
        res.status(500).json({ error: 'Failed to save store' });
    }
};
