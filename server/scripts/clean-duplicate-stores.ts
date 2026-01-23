/**
 * Clean Duplicate Stores Script
 * 
 * Removes all stores except one per merchant (keeps the most recent one)
 * This enforces the "one store per vendor" rule
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDuplicateStores() {
    console.log('🧹 Starting cleanup of duplicate stores...\n');

    try {
        // Get all merchants who have stores
        const merchantsWithStores = await prisma.user.findMany({
            where: {
                role: 'MERCHANT',
                store: {
                    isNot: null,
                },
            },
            include: {
                store: true,
            },
        });

        console.log(`Found ${merchantsWithStores.length} merchants with stores\n`);

        let deletedCount = 0;
        let keptCount = 0;

        for (const merchant of merchantsWithStores) {
            if (!merchant.store) continue;

            // Get all stores for this merchant (should be only one due to unique constraint, but check anyway)
            const allStores = await prisma.store.findMany({
                where: {
                    merchantId: merchant.id,
                },
                orderBy: {
                    createdAt: 'desc', // Most recent first
                },
            });

            if (allStores.length > 1) {
                console.log(`⚠️  Merchant ${merchant.id} (${merchant.firstName}) has ${allStores.length} stores`);

                // Keep the most recent one, delete the rest
                const storeToKeep = allStores[0];
                const storesToDelete = allStores.slice(1);

                for (const store of storesToDelete) {
                    console.log(`   🗑️  Deleting store: ${store.id} (${store.name})`);
                    await prisma.store.delete({
                        where: { id: store.id },
                    });
                    deletedCount++;
                }

                console.log(`   ✅ Kept store: ${storeToKeep.id} (${storeToKeep.name})\n`);
                keptCount++;
            } else {
                keptCount++;
            }
        }

        console.log('\n✅ Cleanup completed!');
        console.log(`   📊 Kept: ${keptCount} stores`);
        console.log(`   🗑️  Deleted: ${deletedCount} duplicate stores`);

        // Final verification
        const merchantsWithMultipleStores = await prisma.user.findMany({
            where: {
                role: 'MERCHANT',
            },
            include: {
                store: true,
            },
        });

        const violations = merchantsWithMultipleStores.filter(
            (m) => m.store === null || (m.store && m.store.merchantId !== m.id)
        );

        if (violations.length > 0) {
            console.log(`\n⚠️  Warning: Found ${violations.length} potential data integrity issues`);
        } else {
            console.log('\n✨ All merchants now have exactly one store (or none)');
        }
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
cleanDuplicateStores()
    .then(() => {
        console.log('\n🎉 Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Script failed:', error);
        process.exit(1);
    });
