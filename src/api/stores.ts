import apiClient from './client';

export interface Store {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    image?: string;
    description?: string;
    phone?: string;
}

export const storesApi = {
    getAll: async (): Promise<Store[]> => {
        return apiClient('/api/stores', { method: 'GET' });
    },

    getById: async (id: string): Promise<Store> => {
        return apiClient(`/api/stores/${id}`, { method: 'GET' });
    },
};
