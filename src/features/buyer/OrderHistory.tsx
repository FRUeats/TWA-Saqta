/**
 * Order History Page
 * 
 * View all user orders with QR codes
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

const OrderHistory = () => {
    const navigate = useNavigate();
    const { user } = useTelegram();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const userId = user?.id?.toString() || 'dev-user';
            const data = await ordersApi.getUserOrders(userId);
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: Order['status']) => {
        const variants = {
            PENDING: 'warning' as const,
            PAID: 'info' as const,
            COMPLETED: 'success' as const,
            CANCELLED: 'danger' as const,
        };

        const labels = {
            PENDING: 'Pending',
            PAID: 'Paid',
            COMPLETED: 'Completed',
            CANCELLED: 'Cancelled',
        };

        return <Badge variant={variants[status]}>{labels[status]}</Badge>;
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-tg-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-tg-bg px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-xl font-semibold text-tg-text mb-2">No orders yet</h2>
                    <p className="text-tg-hint mb-6">Start saving food by ordering surprise bags!</p>
                    <Button onClick={() => navigate('/')}>Browse Offers</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-tg-bg pb-6">
            {/* Header */}
            <div className="bg-tg-secondary sticky top-0 z-10 px-4 py-4 shadow-sm">
                <h1 className="text-2xl font-bold text-tg-text">My Orders</h1>
                <p className="text-sm text-tg-hint">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
            </div>

            {/* Orders List */}
            <div className="px-4 py-4 space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-tg-secondary rounded-2xl overflow-hidden">
                        {/* Order Header */}
                        <div
                            className="p-4 cursor-pointer"
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-tg-text mb-1">{order.offer.store.name}</h3>
                                    <p className="text-xs text-tg-hint">Order #{order.id.slice(0, 8)}</p>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-tg-hint">
                                    <div>Pickup: {formatTime(new Date(order.offer.pickupStart))} - {formatTime(new Date(order.offer.pickupEnd))}</div>
                                    <div className="text-xs mt-1">{formatDate(new Date(order.createdAt))}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-tg-button">{order.offer.discountedPrice} KGS</div>
                                </div>
                            </div>

                            {/* Expand Icon */}
                            <div className="flex justify-center mt-3">
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
                                    <h4 className="font-semibold text-tg-text mb-2">Pickup QR Code</h4>
                                    <p className="text-sm text-tg-hint">Show this to the merchant</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl flex items-center justify-center mb-4">
                                    <QRCodeSVG
                                        value={order.qrCode}
                                        size={180}
                                        level="H"
                                        includeMargin
                                    />
                                </div>

                                <div className="text-center">
                                    <p className="text-xs font-mono text-tg-hint">{order.qrCode}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
