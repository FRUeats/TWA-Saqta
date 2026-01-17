/**
 * Auth API Client
 * 
 * Handles authentication requests to backend
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
    id: string;
    firstName: string;
    lastName?: string;
    username?: string;
    role: 'BUYER' | 'MERCHANT' | 'ADMIN';
    isVerified: boolean;
    isBlocked?: boolean;
    companyName?: string;
}

export interface AuthResponse {
    success: boolean;
    user: User;
    message?: string;
}

export const authAPI = {
    /**
     * Login/Register as BUYER
     */
    login: async (initData: string): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
            initData,
        });
        return response.data;
    },

    /**
     * Register as VENDOR
     */
    vendorRegister: async (initData: string, companyName: string): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/vendor/register`, {
            initData,
            companyName,
        });
        return response.data;
    },

    /**
     * Get current user info
     */
    getMe: async (initData: string): Promise<AuthResponse> => {
        const response = await axios.get<AuthResponse>(`${API_URL}/auth/me`, {
            params: { initData },
        });
        return response.data;
    },

    /**
     * Switch role (development only)
     */
    switchRole: async (
        initData: string,
        role: 'BUYER' | 'MERCHANT',
        companyName?: string
    ): Promise<AuthResponse> => {
        const response = await axios.put<AuthResponse>(`${API_URL}/auth/role`, {
            initData,
            role,
            companyName,
        });
        return response.data;
    },
};
