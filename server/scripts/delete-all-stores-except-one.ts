/**
 * Delete All Stores Except One Script
 * 
 * Removes ALL stores from the database, keeping only the most recent one.
 * This is useful for testing/development when you want to start fresh.
 * 
 * ⚠️ WARNING: This will delete all stores except one!
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllStoresExceptOne() {
    console.log('🗑️  Starting deletion of all stores except one...\n');
    console.log('⚠️  WARNING: This will delete most of your stores!\n');

    try {
        // Get all stores ordered by creation date (newest first)
        const allStores = await prisma.store.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                merchant: {
                    select: {
                        id: true,
                        firstName: true,
                        companyName: true,
                    },
                },
            },
        });

        if (allStores.length === 0) {
            console.log('ℹ️  No stores found in database');
            return;
        }

        console.log(`Found ${allStores.length} stores total\n`);

        if (allStores.length === 1) {
            console.log('ℹ️  Only one store exists, nothing to delete');
            return;
        }

        // Keep the first (most recent) store
        const storeToKeep = allStores[0];
        const storesToDelete = allStores.slice(1);

        console.log(`✅ Keeping store: ${storeToKeep.id} (${storeToKeep.name})`);
        console.log(`   Merchant: ${storeToKeep.merchant.firstName} (${storeToKeep.merchant.id})\n`);

        console.log(`🗑️  Deleting ${storesToDelete.length} stores...\n`);

        let deletedCount = 0;
        for (const store of storesToDelete) {
            console.log(`   Deleting: ${store.id} - ${store.name} (Merchant: ${store.merchant.firstName})`);
            
            // Delete the store (cascade will handle related offers and orders)
            await prisma.store.delete({
                where: { id: store.id },
            });
            
            deletedCount++;
        }

        console.log(`\n✅ Deletion completed!`);
        console.log(`   📊 Kept: 1 store`);
        console.log(`   🗑️  Deleted: ${deletedCount} stores`);

        // Verify
        const remainingStores = await prisma.store.findMany();
        console.log(`\n✨ Verification: ${remainingStores.length} store(s) remaining in database`);

        if (remainingStores.length > 0) {
            const remaining = remainingStores[0];
            console.log(`   Store ID: ${remaining.id}`);
            console.log(`   Store Name: ${remaining.name}`);
            console.log(`   Merchant ID: ${remaining.merchantId}`);
        }
    } catch (error) {
        console.error('❌ Error during deletion:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
deleteAllStoresExceptOne()
    .then(() => {
        console.log('\n🎉 Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Script failed:', error);
        process.exit(1);
    });
