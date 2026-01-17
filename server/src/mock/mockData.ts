// Mock data for local development without PostgreSQL

export const mockStores = [
    {
        id: 'store-1',
        name: 'Эко Пекарня',
        address: 'ул. Токтогула, 125, Бишкек',
        latitude: 42.8746,
        longitude: 74.5698,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
        description: 'Традиционная выпечка и хлеб',
        phone: '+996 555 123 456',
        merchantId: 'dev-user-123',
    },
    {
        id: 'store-2',
        name: 'Суши Мастер',
        address: 'пр. Чуй, 78, Бишкек',
        latitude: 42.8756,
        longitude: 74.5888,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        description: 'Свежие суши и роллы',
        phone: '+996 555 789 012',
        merchantId: 'dev-user-123',
    },
    {
        id: 'store-3',
        name: 'Фреш Маркет',
        address: 'ул. Исанова, 42, Бишкек',
        latitude: 42.8730,
        longitude: 74.6000,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
        description: 'Фрукты и овощи',
        phone: '+996 555 345 678',
        merchantId: 'dev-user-456',
    },
];

export const mockOffers = [
    {
        id: 'offer-1',
        storeId: 'store-1',
        store: mockStores[0],
        originalPrice: 500,
        discountedPrice: 250,
        quantity: 5,
        pickupStart: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2 hours
        pickupEnd: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),   // +5 hours
        description: 'Свежий хлеб, булочки и круассаны',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'offer-2',
        storeId: 'store-2',
        store: mockStores[1],
        originalPrice: 800,
        discountedPrice: 400,
        quantity: 3,
        pickupStart: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        pickupEnd: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        description: 'Микс из суши и роллов',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'offer-3',
        storeId: 'store-3',
        store: mockStores[2],
        originalPrice: 350,
        discountedPrice: 175,
        quantity: 10,
        pickupStart: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // +30 min
        pickupEnd: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        description: 'Фруктовый микс на сегодня',
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'offer-4',
        storeId: 'store-1',
        store: mockStores[0],
        originalPrice: 400,
        discountedPrice: 150,
        quantity: 8,
        pickupStart: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        pickupEnd: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        description: 'Выпечка дня: лепешки и самсы',
        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockOrders: any[] = [];

// Helper to generate QR codes
export function generateQRCode(): string {
    return `SAQTA-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// Add mock order
export function addMockOrder(order: any): any {
    const newOrder = {
        ...order,
        id: `order-${Date.now()}`,
        qrCode: generateQRCode(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockOrders.push(newOrder);
    return newOrder;
}

// Update mock offer quantity
export function updateOfferQuantity(offerId: string, change: number): boolean {
    const offer = mockOffers.find(o => o.id === offerId);
    if (offer && offer.quantity + change >= 0) {
        offer.quantity += change;
        return true;
    }
    return false;
}
