/**
 * Merchant Dashboard
 * 
 * Main hub for merchants - stats, quick actions, offers, orders
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useAuthStore } from '../../store/authStore';
import { offersApi } from '../../api/offers';
import { storesApi } from '../../api/stores';
import VendorOnboarding from './VendorOnboarding';


const MerchantDashboard = () => {
    const navigate = useNavigate();
    const { user, hapticFeedback } = useTelegram();
    const { user: authUser } = useAuthStore();
    const [offers, setOffers] = useState<any[]>([]);
    const [stats, setStats] = useState({
        activeOffers: 0,
        pendingOrders: 0,
        todayRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [hasStore, setHasStore] = useState<boolean | null>(null); // null = checking

    useEffect(() => {
        checkStoreAndFetchData();
    }, [authUser]);

    const checkStoreAndFetchData = async () => {
        setLoading(true);
        try {
            // Check if THIS vendor has a store configured
            if (authUser?.id) {
                const store = await storesApi.getVendorStore(authUser.id);
                setHasStore(!!store);

                if (store) {
                    // Only fetch offers if store exists
                    await fetchData();
                }
            } else {
                // No auth user - treat as no store
                setHasStore(false);
            }
        } catch (error: any) {
            console.error('Failed to check store:', error);
            // 404 means no store found for this vendor
            if (error.response?.status === 404) {
                setHasStore(false);
            } else {
                // Other errors - also treat as no store
                setHasStore(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch merchant's offers
            const allOffers = await offersApi.getAll();
            // TODO: Filter by merchant's store when auth is ready
            setOffers(allOffers.slice(0, 3)); // Show first 3

            setStats({
                activeOffers: allOffers.length,
                pendingOrders: 2, // Mock for now
                todayRevenue: 1200, // Mock for now
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickOffer = () => {
        hapticFeedback('medium');
        navigate('/merchant/create');
    };

    const handleDeleteOffer = async (id: string) => {
        if (!confirm('Delete this offer?')) return;

        try {
            await offersApi.delete(id);
            hapticFeedback('success');
            fetchData();
        } catch (error) {
            console.error('Failed to delete offer:', error);
            alert('Failed to delete offer');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-tg-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button"></div>
            </div>
        );
    }

    // Show onboarding if vendor has no store
    if (hasStore === false) {
        return <VendorOnboarding />;
    }

    return (
        <div className="min-h-screen bg-tg-bg pb-6">
            {/* Header */}
            <div className="bg-tg-secondary px-4 py-6 shadow-sm mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-tg-text">
                            Vendor Panel
                        </h1>
                        <p className="text-xs text-tg-hint uppercase tracking-wider font-semibold">
                            {user?.first_name ? `${user.first_name}'s Store` : 'My Store'}
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-tg-button/10 rounded-full flex items-center justify-center text-tg-button font-bold">
                        🏪
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-6">

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-tg-secondary rounded-xl p-4 text-center border border-tg-hint/5">
                        <div className="text-2xl font-bold text-tg-button">{stats.activeOffers}</div>
                        <div className="text-[10px] uppercase text-tg-hint mt-1 font-bold">Active</div>
                    </div>
                    <div className="bg-tg-secondary rounded-xl p-4 text-center border border-tg-hint/5">
                        <div className="text-2xl font-bold text-orange-500">{stats.pendingOrders}</div>
                        <div className="text-[10px] uppercase text-tg-hint mt-1 font-bold">Orders</div>
                    </div>
                    <div className="bg-tg-secondary rounded-xl p-4 text-center border border-tg-hint/5">
                        <div className="text-2xl font-bold text-green-500">{stats.todayRevenue}</div>
                        <div className="text-[10px] uppercase text-tg-hint mt-1 font-bold">Revenue</div>
                    </div>
                </div>

                {/* Main Action */}
                <button
                    onClick={handleQuickOffer}
                    className="w-full bg-tg-button text-white rounded-xl p-4 shadow-lg active:scale-[0.99] transition-transform flex items-center justify-center gap-3"
                >
                    <span className="text-2xl font-bold">+</span>
                    <span className="font-bold">Create New Offer</span>
                </button>

                {/* Active Offers */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-sm font-bold text-tg-text uppercase tracking-wide">Active Offers</h2>
                        <button
                            onClick={() => navigate('/merchant/offers')}
                            className="text-xs text-tg-button font-medium"
                        >
                            View All
                        </button>
                    </div>

                    {offers.length > 0 ? (
                        <div className="space-y-3">
                            {offers.map((offer) => (
                                <div key={offer.id} className="bg-tg-secondary rounded-xl p-4 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-tg-text line-clamp-1">{offer.store.name}</h3>
                                            <p className="text-xs text-tg-hint mt-1">
                                                {offer.originalPrice} → <span className="text-green-500 font-bold">{offer.discountedPrice} KGS</span>
                                            </p>
                                        </div>
                                        <div className="bg-tg-bg px-2 py-1 rounded text-xs font-mono font-bold">
                                            x{offer.quantity}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/merchant/edit/${offer.id}`)}
                                            className="flex-1 bg-tg-bg/50 text-tg-text py-2 rounded-lg text-xs font-medium hover:bg-tg-bg"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOffer(offer.id)}
                                            className="w-10 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center text-sm"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-tg-hint bg-tg-secondary rounded-xl border border-dashed border-tg-hint/20">
                            No active offers
                        </div>
                    )}
                </div>

                {/* Menu */}
                <div className="bg-tg-secondary rounded-xl overflow-hidden">
                    <button
                        onClick={() => navigate('/merchant/orders')}
                        className="w-full p-4 flex items-center justify-between hover:bg-tg-bg/50 border-b border-tg-hint/5"
                    >
                        <span className="font-medium text-tg-text">🔔 Incoming Orders</span>
                        <span className="text-tg-hint">›</span>
                    </button>
                    <button
                        onClick={() => navigate('/merchant/scan')}
                        className="w-full p-4 flex items-center justify-between hover:bg-tg-bg/50 border-b border-tg-hint/5"
                    >
                        <span className="font-medium text-tg-text">📷 Scan QR Code</span>
                        <span className="text-tg-hint">›</span>
                    </button>
                    <button
                        onClick={() => navigate('/merchant/settings')}
                        className="w-full p-4 flex items-center justify-between hover:bg-tg-bg/50"
                    >
                        <span className="font-medium text-tg-text">⚙️ Store Settings</span>
                        <span className="text-tg-hint">›</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MerchantDashboard;
