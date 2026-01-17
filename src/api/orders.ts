/**
 * Orders API
 */

import apiClient from './client';

export const ordersApi = {
    // Create new order
    create: async (data: { userId: string; offerId: string; notes?: string }) => {
        return apiClient('/orders', {
            method: 'POST',
            body: data,
        });
    },

    // Get user's orders
    getUserOrders: async (userId: string) => {
        return apiClient(`/orders/user/${userId}`);
    },

    // Get single order
    getById: async (id: string) => {
        return apiClient(`/orders/${id}`);
    },

    // Complete order (merchant)
    complete: async (id: string) => {
        return apiClient(`/orders/${id}/complete`, {
            method: 'PUT',
        });
    },

    // Validate QR code
    validateQR: async (qrCode: string) => {
        return apiClient(`/orders/qr/${qrCode}`);
    },
};
