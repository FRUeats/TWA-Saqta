/**
 * Merchant Dashboard
 * 
 * Main hub for merchants - stats, quick actions, offers, orders
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { offersApi } from '../../api/offers';
import Button from '../../components/Button';

const MerchantDashboard = () => {
    const navigate = useNavigate();
    const { user, hapticFeedback } = useTelegram();
    const [offers, setOffers] = useState<any[]>([]);
    const [stats, setStats] = useState({
        activeOffers: 0,
        pendingOrders: 0,
        todayRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

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

    return (
        <div className="min-h-screen bg-tg-bg pb-6">
            {/* Header */}
            <div className="bg-tg-secondary px-4 py-6">
                <h1 className="text-2xl font-bold text-tg-text mb-1">
                    🏪 Merchant Panel
                </h1>
                <p className="text-sm text-tg-hint">
                    Welcome, {user?.first_name || 'Merchant'}
                </p>
            </div>

            <div className="px-4 py-6 space-y-6">
                {/* Quick Offer Button */}
                <button
                    onClick={handleQuickOffer}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition-transform"
                >
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">➕</span>
                        <div className="text-left">
                            <div className="text-xl font-bold">Quick Offer</div>
                            <div className="text-sm opacity-90">Create in 2 clicks</div>
                        </div>
                    </div>
                </button>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-tg-secondary rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-tg-button">{stats.activeOffers}</div>
                        <div className="text-xs text-tg-hint mt-1">Active Offers</div>
                    </div>
                    <div className="bg-tg-secondary rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-orange-500">{stats.pendingOrders}</div>
                        <div className="text-xs text-tg-hint mt-1">New Orders</div>
                    </div>
                    <div className="bg-tg-secondary rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-500">{stats.todayRevenue}</div>
                        <div className="text-xs text-tg-hint mt-1">Today KGS</div>
                    </div>
                </div>

                {/* Active Offers */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-tg-text">📦 Active Offers</h2>
                        <button
                            onClick={() => navigate('/merchant/offers')}
                            className="text-sm text-tg-button"
                        >
                            View All →
                        </button>
                    </div>

                    {offers.length > 0 ? (
                        <div className="space-y-3">
                            {offers.map((offer) => (
                                <div key={offer.id} className="bg-tg-secondary rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-tg-text">{offer.store.name}</h3>
                                            <p className="text-sm text-tg-hint">
                                                {offer.originalPrice}₸ → {offer.discountedPrice}₸
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-tg-button">{offer.quantity}</span>
                                            <span className="text-xs text-tg-hint ml-1">bags</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/merchant/edit/${offer.id}`)}
                                            className="flex-1 bg-tg-button/10 text-tg-button py-2 rounded-lg text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOffer(offer.id)}
                                            className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-tg-hint">
                            No active offers yet
                        </div>
                    )}
                </div>

                {/* New Orders */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-tg-text">🔔 New Orders</h2>
                        <button
                            onClick={() => navigate('/merchant/orders')}
                            className="text-sm text-tg-button"
                        >
                            View All →
                        </button>
                    </div>

                    <div className="bg-tg-secondary rounded-xl p-4 text-center">
                        <p className="text-tg-hint mb-3">Check new orders</p>
                        <Button onClick={() => navigate('/merchant/orders')}>
                            View Orders
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MerchantDashboard;
