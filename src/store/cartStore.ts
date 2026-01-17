/**
 * Cart Store - Zustand
 * 
 * Manages shopping cart state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    offerId: string;
    storeName: string;
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
    pickupStart: Date;
    pickupEnd: Date;
    image?: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (offerId: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                set((state) => {
                    // Check if item already exists
                    const existingItem = state.items.find((i) => i.offerId === item.offerId);

                    if (existingItem) {
                        // Increment quantity
                        return {
                            items: state.items.map((i) =>
                                i.offerId === item.offerId
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i
                            ),
                        };
                    }

                    // Add new item
                    return {
                        items: [...state.items, { ...item, quantity: 1 }],
                    };
                });
            },

            removeItem: (offerId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.offerId !== offerId),
                }));
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotalPrice: () => {
                const { items } = get();
                return items.reduce(
                    (total, item) => total + item.discountedPrice * item.quantity,
                    0
                );
            },

            getTotalItems: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'saqta-cart', // localStorage key
        }
    )
);
