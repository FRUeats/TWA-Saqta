/**
 * Checkout Page
 * 
 * Order confirmation and QR code generation (Test Mode)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTelegram } from '../../hooks/useTelegram';
import { useCartStore } from '../../store/cartStore';
import { ordersApi } from '../../api/orders';
import Button from '../../components/Button';

const Checkout = () => {
    const navigate = useNavigate();
    const { user, hapticFeedback } = useTelegram();
    const { items, getTotalPrice, clearCart } = useCartStore();

    const [orderId, setOrderId] = useState<string | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const totalPrice = getTotalPrice();

    useEffect(() => {
        if (items.length === 0 && !orderId) {
            navigate('/');
        }
    }, [items, orderId]);

    const handlePlaceOrder = async () => {
        setLoading(true);
        hapticFeedback('success');

        try {
            const firstItem = items[0];
            const userId = user?.id?.toString() || 'dev-user-' + Date.now();

            const order = await ordersApi.create({
                userId,
                offerId: firstItem.offerId,
            });

            setOrderId(order.id);
            setQrCode(order.qrCode);
            clearCart();
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderId) {
        // Order Success Screen with QR Code
        return (
            <div className="min-h-screen bg-tg-bg flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    {/* Back button */}
                    <button
                        onClick={() => navigate('/')}
                        className="mb-4 text-tg-button flex items-center gap-2"
                    >
                        <span className="text-2xl">←</span>
                        <span>Back to Home</span>
                    </button>

                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold text-tg-text mb-2">Order Confirmed!</h2>
                        <p className="text-tg-hint">Show this QR code to the merchant at pickup</p>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-6 rounded-2xl mb-6 flex items-center justify-center">
                        <QRCodeSVG
                            value={qrCode || orderId}
                            size={220}
                            level="H"
                            includeMargin
                        />
                    </div>

                    {/* Order Info */}
                    <div className="bg-tg-secondary rounded-2xl p-4 mb-6">
                        <div className="text-sm text-tg-hint mb-2">Order ID</div>
                        <div className="font-mono text-lg text-tg-text mb-4">{orderId}</div>

                        <div className="text-sm text-tg-hint mb-2">Total</div>
                        <div className="text-2xl font-bold text-tg-button">{totalPrice} KGS</div>

                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                💡 <strong>Test Mode:</strong> Payment happens at pickup
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Button fullWidth onClick={() => navigate('/orders')}>
                            View My Orders
                        </Button>
                        <Button fullWidth variant="secondary" onClick={() => navigate('/')}>
                            Continue Shopping
                        </Button>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 p-4 bg-tg-secondary rounded-xl">
                        <h4 className="font-semibold text-tg-text mb-2">📱 Pickup Instructions</h4>
                        <ol className="text-sm text-tg-hint space-y-1 list-decimal list-inside">
                            <li>Arrive during the pickup time window</li>
                            <li>Show this QR code to the staff</li>
                            <li>Pay and collect your surprise bag</li>
                            <li>Enjoy your meal!</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    // Checkout Confirmation
    return (
        <div className="min-h-screen bg-tg-bg pb-24">
            {/* Header with back button */}
            <div className="bg-tg-secondary px-4 py-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
                <button
                    onClick={() => navigate('/cart')}
                    className="text-tg-button text-2xl"
                >
                    ←
                </button>
                <h1 className="text-xl font-bold text-tg-text">Confirm Your Order</h1>
            </div>

            <div className="px-4 py-6">
                {/* Order Items */}
                <div className="space-y-3 mb-6">
                    {items.map((item) => (
                        <div key={item.offerId} className="bg-tg-secondary rounded-xl p-4">
                            <div className="flex gap-3">
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.storeName}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-tg-text">{item.storeName}</h3>
                                    <p className="text-sm text-tg-hint">Qty: {item.quantity}</p>
                                    <p className="text-lg font-bold text-tg-button mt-1">
                                        {item.discountedPrice * item.quantity} KGS
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="bg-tg-secondary rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-tg-hint">Subtotal</span>
                        <span className="text-tg-text">{totalPrice} KGS</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-tg-hint">Service Fee</span>
                        <span className="text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-tg-hint/20 my-3"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-tg-text">Total</span>
                        <span className="text-2xl font-bold text-tg-button">{totalPrice} KGS</span>
                    </div>
                </div>

                {/* Test Mode Notice */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🧪</span>
                        <div>
                            <h4 className="font-bold text-yellow-900 dark:text-yellow-200 mb-1">
                                Test Mode Active
                            </h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Click "Place Order" to get your QR code. Payment happens at pickup - no prepayment needed for now.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-tg-hint text-center mb-6">
                    By placing this order, you agree to pick up during the specified time window.
                </p>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-tg-bg border-t border-tg-hint/20 p-4">
                <Button
                    fullWidth
                    size="lg"
                    onClick={handlePlaceOrder}
                    loading={loading}
                >
                    Place Order & Get QR Code
                </Button>
            </div>
        </div>
    );
};

export default Checkout;
