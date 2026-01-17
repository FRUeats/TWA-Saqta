/**
 * Offer Templates
 * 
 * Pre-defined templates for quick offer creation
 */

export interface OfferTemplate {
    id: string;
    name: string;
    icon: string;
    originalPrice: number;
    discountedPrice: number;
    defaultQuantity: number;
    description: string;
    image?: string;
}

export const offerTemplates: OfferTemplate[] = [
    {
        id: 'pastries',
        name: 'Pastries & Bread',
        icon: '🥐',
        originalPrice: 500,
        discountedPrice: 200,
        defaultQuantity: 5,
        description: 'Fresh pastries and bread from today',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    },
    {
        id: 'sushi',
        name: 'Sushi & Asian',
        icon: '🍱',
        originalPrice: 800,
        discountedPrice: 300,
        defaultQuantity: 3,
        description: 'Delicious sushi and Asian cuisine',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    },
    {
        id: 'salads',
        name: 'Salads & Healthy',
        icon: '🥗',
        originalPrice: 400,
        discountedPrice: 150,
        defaultQuantity: 8,
        description: 'Fresh salads and healthy meals',
    },
    {
        id: 'coffee',
        name: 'Coffee & Snacks',
        icon: '☕',
        originalPrice: 350,
        discountedPrice: 140,
        defaultQuantity: 10,
        description: 'Coffee, sandwiches, and snacks',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    },
    {
        id: 'custom',
        name: 'Custom Offer',
        icon: '✏️',
        originalPrice: 500,
        discountedPrice: 200,
        defaultQuantity: 5,
        description: 'Create your own offer',
    },
];

export const timePresets = [
    { label: 'Today 18:00-20:00', hours: [18, 20], offset: 0 },
    { label: 'Today 19:00-21:00', hours: [19, 21], offset: 0 },
    { label: 'Tomorrow 17:00-19:00', hours: [17, 19], offset: 1 },
    { label: 'Tomorrow 18:00-20:00', hours: [18, 20], offset: 1 },
];

export function getPresetTime(preset: typeof timePresets[0]) {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() + preset.offset);
    startDate.setHours(preset.hours[0], 0, 0, 0);

    const endDate = new Date(now);
    endDate.setDate(now.getDate() + preset.offset);
    endDate.setHours(preset.hours[1], 0, 0, 0);

    return { start: startDate, end: endDate };
}
