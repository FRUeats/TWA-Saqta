/**
 * Offers API
 */

import apiClient from './client';

export const offersApi = {
    // Get all active offers
    getAll: async () => {
        return apiClient('/offers');
    },

    // Get single offer by ID
    getById: async (id: string) => {
        return apiClient(`/offers/${id}`);
    },

    // Create new offer (merchant)
    create: async (data: any) => {
        return apiClient('/offers', {
            method: 'POST',
            body: data,
        });
    },

    // Update offer (merchant)
    update: async (id: string, data: any) => {
        return apiClient(`/offers/${id}`, {
            method: 'PUT',
            body: data,
        });
    },

    // Delete offer (merchant)
    delete: async (id: string) => {
        return apiClient(`/offers/${id}`, {
            method: 'DELETE',
        });
    },
};
