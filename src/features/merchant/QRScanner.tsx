/**
 * QR Scanner
 * 
 * Scan customer QR codes to validate orders
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { ordersApi } from '../../api/orders';
import Button from '../../components/Button';

const QRScanner = () => {
    const navigate = useNavigate();
    const { showScanQrPopup, hapticFeedback } = useTelegram();
    const [validatedOrder, setValidatedOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleScan = () => {
        hapticFeedback('medium');

        showScanQrPopup((qrText) => {
            if (qrText) {
                validateQRCode(qrText);
            }
        });
    };

    const validateQRCode = async (qrCode: string) => {
        setLoading(true);
        setError(null);

        try {
            const order = await ordersApi.validateQR(qrCode);
            hapticFeedback('success');
            setValidatedOrder(order);
        } catch (error) {
            console.error('Invalid QR code:', error);
            setError('Invalid QR code or order not found');
            hapticFeedback('error');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteOrder = async () => {
        if (!validatedOrder) return;

        try {
            await ordersApi.complete(validatedOrder.id);
            hapticFeedback('success');
            navigate('/merchant/orders');
        } catch (error) {
            console.error('Failed to complete order:', error);
            alert('Failed to complete order');
        }
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    if (validatedOrder) {
        // Success - Show order details
        return (
            <div className="min-h-screen bg-tg-bg flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold text-tg-text mb-2">Valid Order!</h2>
                        <p className="text-tg-hint">Customer can pick up their order</p>
                    </div>

                    <div className="bg-tg-secondary rounded-2xl p-6 mb-6">
                        <div className="text-sm text-tg-hint mb-2">Order ID</div>
                        <div className="font-mono text-sm text-tg-text mb-4">
                            #{validatedOrder.id.slice(0, 12)}
                        </div>

                        <div className="text-sm text-tg-hint mb-2">Product</div>
                        <div className="text-lg font-semibold text-tg-text mb-4">
                            {validatedOrder.offer.store.name}
                        </div>

                        <div className="text-sm text-tg-hint mb-2">Price</div>
                        <div className="text-2xl font-bold text-tg-button mb-4">
                            {validatedOrder.offer.discountedPrice} KGS
                        </div>

                        <div className="text-sm text-tg-hint mb-2">Pickup Time</div>
                        <div className="text-tg-text">
                            {formatTime(validatedOrder.offer.pickupStart)} - {formatTime(validatedOrder.offer.pickupEnd)}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            fullWidth
                            size="lg"
                            onClick={handleCompleteOrder}
                        >
                            ✅ Mark as Completed
                        </Button>
                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={() => {
                                setValidatedOrder(null);
                                setError(null);
                            }}
                        >
                            Scan Another
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Scanner Interface
    return (
        <div className="min-h-screen bg-tg-bg">
            {/* Header */}
            <div className="bg-tg-secondary px-4 py-4">
                <button
                    onClick={() => navigate('/merchant/orders')}
                    className="text-tg-button mb-2"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-tg-text">📱 Scan QR Code</h1>
                <p className="text-sm text-tg-hint">Validate customer orders</p>
            </div>

            <div className="px-4 py-12 flex flex-col items-center justify-center">
                <div className="w-full max-w-md">
                    {/* Scanner Icon */}
                    <div className="mb-8 text-center">
                        <div className="w-48 h-48 mx-auto bg-tg-secondary rounded-3xl flex items-center justify-center mb-4">
                            <svg className="w-32 h-32 text-tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-tg-text mb-2">Ready to Scan</h3>
                        <p className="text-sm text-tg-hint">
                            Ask customer to show their QR code
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <span className="text-xl">❌</span>
                                <span className="font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Scan Button */}
                    <Button
                        fullWidth
                        size="lg"
                        onClick={handleScan}
                        loading={loading}
                    >
                        📷 Open Scanner
                    </Button>

                    {/* Instructions */}
                    <div className="mt-8 p-4 bg-tg-secondary rounded-xl">
                        <h4 className="font-semibold text-tg-text mb-2">📋 Instructions</h4>
                        <ol className="text-sm text-tg-hint space-y-1 list-decimal list-inside">
                            <li>Click "Open Scanner" button</li>
                            <li>Point camera at customer's QR code</li>
                            <li>Order will be validated automatically</li>
                            <li>Mark as completed after handoff</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
