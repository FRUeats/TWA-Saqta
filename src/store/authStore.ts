/**
 * Auth Store - Zustand
 * 
 * Manages authentication state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, User, AuthResponse } from '../api/auth.api';

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (initData: string) => Promise<void>;
    vendorRegister: (initData: string, companyName: string) => Promise<void>;
    checkAuth: (initData: string) => Promise<void>;
    logout: () => void;
    switchRole: (initData: string, role: 'BUYER' | 'MERCHANT', companyName?: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (initData: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response: AuthResponse = await authAPI.login(initData);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.error || 'Login failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            vendorRegister: async (initData: string, companyName: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response: AuthResponse = await authAPI.vendorRegister(initData, companyName);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.error || 'Registration failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            checkAuth: async (initData: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response: AuthResponse = await authAPI.getMe(initData);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: error.response?.data?.error || 'Auth check failed',
                    });
                }
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            switchRole: async (initData: string, role: 'BUYER' | 'MERCHANT', companyName?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response: AuthResponse = await authAPI.switchRole(initData, role, companyName);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.error || 'Role switch failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },
        }),
        {
            name: 'saqta-auth', // localStorage key
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
