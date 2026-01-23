/**
 * Order Success Page
 * 
 * Shows QR code and order confirmation
 * Auto-closes after 7 seconds with countdown
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTelegram } from '../../hooks/useTelegram';
import { useLanguageStore } from '../../store/languageStore';
import { getTranslation } from '../../utils/i18n';
import Button from '../../components/Button';

const OrderSuccess = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { hapticFeedback } = useTelegram();
    const { language } = useLanguageStore();
    const t = (key: string) => getTranslation(language, key);

    const [countdown, setCountdown] = useState(7);
    const [orderData, setOrderData] = useState<{
        orderId: string;
        qrCode: string;
        total: number;
    } | null>(null);

    useEffect(() => {
        // Get order data from location state or fetch if needed
        if (location.state) {
            setOrderData(location.state as any);
        }

        // Start countdown
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleAutoClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleAutoClose = () => {
        hapticFeedback('success');
        navigate('/orders');
    };

    const handleClose = () => {
        hapticFeedback('light');
        navigate('/orders');
    };

    if (!orderData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-tg-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button"></div>
            </div>
        );
    }

    const progress = ((7 - countdown) / 7) * 100;

    return (
        <div className="min-h-screen bg-tg-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Countdown Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-tg-hint">{t('orderSuccess.autoClose')}</span>
                        <span className="text-sm font-bold text-tg-button">{countdown}s</span>
                    </div>
                    <div className="h-2 bg-tg-hint/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-tg-button transition-all duration-1000 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Success Icon */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-5xl">✅</span>
                    </div>
                    <h2 className="text-2xl font-bold text-tg-text mb-2">
                        {t('orderSuccess.title')}
                    </h2>
                    <p className="text-tg-hint">{t('orderSuccess.subtitle')}</p>
                </div>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                    <QRCodeSVG
                        value={orderData.qrCode || orderData.orderId}
                        size={220}
                        level="H"
                        includeMargin
                    />
                </div>

                {/* Order Info */}
                <div className="bg-tg-secondary rounded-2xl p-4 mb-6">
                    <div className="space-y-3">
                        <div>
                            <div className="text-sm text-tg-hint mb-1">{t('orderSuccess.orderId')}</div>
                            <div className="font-mono text-lg text-tg-text">{orderData.orderId}</div>
                        </div>
                        <div className="border-t border-tg-hint/20 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-tg-hint">{t('orderSuccess.total')}</span>
                                <span className="text-2xl font-bold text-tg-button">{orderData.total} KGS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        📱 {t('orderSuccess.instructions')}
                    </h4>
                    <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                        <li>{t('orderSuccess.step1')}</li>
                        <li>{t('orderSuccess.step2')}</li>
                        <li>{t('orderSuccess.step3')}</li>
                    </ol>
                </div>

                {/* Manual Close Button */}
                <Button fullWidth onClick={handleClose} variant="secondary">
                    {t('orderSuccess.viewOrders')}
                </Button>
            </div>
        </div>
    );
};

export default OrderSuccess;
