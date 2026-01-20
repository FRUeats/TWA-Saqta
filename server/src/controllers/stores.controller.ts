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
