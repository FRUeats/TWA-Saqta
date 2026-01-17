/**
 * Merchant Orders
 * 
 * View and manage incoming orders
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTelegram } from '../../hooks/useTelegram';
import { ordersApi } from '../../api/orders';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

interface Order {
    id: string;
    offer: {
        store: {
            name: string;
        };
        discountedPrice: number;
        pickupStart: string;
        pickupEnd: string;
    };
    status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';
    qrCode: string;
    createdAt: string;
}

const MerchantOrders = () => {
    const navigate = useNavigate();
    const { hapticFeedback } = useTelegram();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // TODO: Filter by merchant's store
            const userId = 'dev-user';
            const allOrders = await ordersApi.getUserOrders(userId);
            setOrders(allOrders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteOrder = async (orderId: string) => {
        if (!confirm('Mark this order as completed?')) return;

        try {
            await ordersApi.complete(orderId);
            hapticFeedback('success');
            fetchOrders();
        } catch (error) {
            console.error('Failed to complete order:', error);
            alert('Failed to complete order');
        }
    };

    const getStatusBadge = (status: Order['status']) => {
        const variants = {
            PENDING: 'warning' as const,
            PAID: 'info' as const,
            COMPLETED: 'success' as const,
            CANCELLED: 'danger' as const,
        };

        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'pending') return order.status === 'PENDING';
        if (filter === 'completed') return order.status === 'COMPLETED';
        return true;
    });

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
            <div className="bg-tg-secondary px-4 py-4 sticky top-0 z-10 shadow-sm">
                <button
                    onClick={() => navigate('/merchant')}
                    className="text-tg-button mb-2"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-tg-text">🔔 Orders</h1>
                <p className="text-sm text-tg-hint">{filteredOrders.length} orders</p>
            </div>

            <div className="px-4 py-4">
                {/* Filter Pills */}
                <div className="flex gap-2 mb-4 overflow-x-auto">
                    {['all', 'pending', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => {
                                hapticFeedback('light');
                                setFilter(f as typeof filter);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === f
                                    ? 'bg-tg-button text-tg-button-text'
                                    : 'bg-tg-secondary text-tg-text'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* QR Scanner Button */}
                <button
                    onClick={() => navigate('/merchant/scan')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 mb-4 shadow active:scale-95 transition-transform"
                >
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">📱</span>
                        <span className="font-semibold">Scan QR Code</span>
                    </div>
                </button>

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="space-y-3">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-tg-secondary rounded-xl overflow-hidden">
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-tg-text">{order.offer.store.name}</h3>
                                            <p className="text-xs text-tg-hint">Order #{order.id.slice(0, 8)}</p>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="text-sm text-tg-hint">
                                            <div>Pickup: {formatTime(order.offer.pickupStart)} - {formatTime(order.offer.pickupEnd)}</div>
                                        </div>
                                        <div className="text-xl font-bold text-tg-button">{order.offer.discountedPrice} KGS</div>
                                    </div>

                                    {/* Expand icon */}
                                    <div className="flex justify-center mt-2">
                                        <svg
                                            className={`w-5 h-5 text-tg-hint transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Expanded QR Code */}
                                {expandedOrder === order.id && (
                                    <div className="border-t border-tg-hint/20 p-6 bg-tg-bg/50">
                                        <div className="text-center mb-4">
                                            <h4 className="font-semibold text-tg-text mb-2">Order QR Code</h4>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl flex items-center justify-center mb-4">
                                            <QRCodeSVG
                                                value={order.qrCode}
                                                size={160}
                                                level="H"
                                                includeMargin
                                            />
                                        </div>

                                        <div className="text-center mb-4">
                                            <p className="text-xs font-mono text-tg-hint">{order.qrCode}</p>
                                        </div>

                                        {order.status === 'PENDING' && (
                                            <Button
                                                fullWidth
                                                onClick={() => handleCompleteOrder(order.id)}
                                            >
                                                Mark as Completed
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-tg-hint">
                        <div className="text-6xl mb-4">📭</div>
                        <p>No {filter !== 'all' ? filter : ''} orders</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MerchantOrders;
