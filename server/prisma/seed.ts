import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create a test merchant user
    const merchant = await prisma.user.upsert({
        where: { id: '123456789' }, // Mock Telegram ID
        update: {},
        create: {
            id: '123456789',
            firstName: 'Test',
            lastName: 'Merchant',
            username: 'testmerchant',
            role: 'MERCHANT',
        },
    });

    console.log('✅ Created merchant:', merchant.firstName);

    // Create stores
    const store1 = await prisma.store.upsert({
        where: { id: 'store1' },
        update: {},
        create: {
            id: 'store1',
            name: 'Coffee House',
            address: 'Chui Ave 123, Bishkek',
            latitude: 42.8746,
            longitude: 74.5698,
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
            phone: '+996 555 123 456',
            description: 'Cozy coffee shop with fresh pastries',
            merchantId: merchant.id,
        },
    });

    const store2 = await prisma.store.upsert({
        where: { id: 'store2' },
        update: {},
        create: {
            id: 'store2',
            name: 'Asian Bistro',
            address: 'Manas Ave 45, Bishkek',
            latitude: 42.8756,
            longitude: 74.5708,
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
            phone: '+996 555 234 567',
            description: 'Authentic Asian cuisine',
            merchantId: merchant.id,
        },
    });

    const store3 = await prisma.store.upsert({
        where: { id: 'store3' },
        update: {},
        create: {
            id: 'store3',
            name: 'Bakery Delight',
            address: 'Erkindik Blvd 78, Bishkek',
            latitude: 42.8766,
            longitude: 74.5718,
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
            phone: '+996 555 345 678',
            description: 'Fresh bread and pastries daily',
            merchantId: merchant.id,
        },
    });

    console.log('✅ Created 3 stores');

    // Create offers
    const now = new Date();
    const oneHour = 60 * 60 * 1000;
    const twoHours = 2 * oneHour;

    await prisma.offer.create({
        data: {
            storeId: store1.id,
            originalPrice: 500,
            discountedPrice: 200,
            quantity: 5,
            pickupStart: new Date(now.getTime() + oneHour),
            pickupEnd: new Date(now.getTime() + twoHours),
            description: 'Fresh pastries and sandwiches from today',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        },
    });

    await prisma.offer.create({
        data: {
            storeId: store2.id,
            originalPrice: 800,
            discountedPrice: 300,
            quantity: 3,
            pickupStart: new Date(now.getTime() + oneHour / 2),
            pickupEnd: new Date(now.getTime() + oneHour * 1.5),
            description: 'Delicious Asian cuisine surprise bag',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        },
    });

    await prisma.offer.create({
        data: {
            storeId: store3.id,
            originalPrice: 350,
            discountedPrice: 150,
            quantity: 8,
            pickupStart: new Date(now.getTime() + oneHour * 1.5),
            pickupEnd: new Date(now.getTime() + oneHour * 2.5),
            description: 'Bread and pastries from today',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
        },
    });

    await prisma.offer.create({
        data: {
            storeId: store1.id,
            originalPrice: 450,
            discountedPrice: 180,
            quantity: 12,
            pickupStart: new Date(now.getTime() + oneHour),
            pickupEnd: new Date(now.getTime() + twoHours),
            description: 'Coffee and snacks bundle',
        },
    });

    console.log('✅ Created 4 offers');
    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
