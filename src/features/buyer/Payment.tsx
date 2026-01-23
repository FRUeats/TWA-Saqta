/**
 * Payment Page
 * 
 * Select payment method (Kyrgyzstan banks) for order
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useLanguageStore } from '../../store/languageStore';
import { getTranslation } from '../../utils/i18n';
import { offersApi } from '../../api/offers';
import { ordersApi } from '../../api/orders';
import Button from '../../components/Button';

type PaymentMethod = 'cash' | 'optima' | 'demir' | 'o_bank' | 'mbank' | null;

interface Offer {
    id: string;
    store: {
        name: string;
        address: string;
    };
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
    pickupStart: Date;
    pickupEnd: Date;
    description?: string;
    image?: string;
}

// Kyrgyzstan banks with their deep links
const banks = {
    optima: {
        name: 'Optima Bank',
        icon: '🏦',
        deepLink: 'optimabank://payment', // Example deep link
        appStore: 'https://apps.apple.com/app/optima-bank',
        playStore: 'https://play.google.com/store/apps/details?id=com.optima.bank',
    },
    demir: {
        name: 'Demir Bank',
        icon: '🏦',
        deepLink: 'demirbank://payment',
        appStore: 'https://apps.apple.com/app/demir-bank',
        playStore: 'https://play.google.com/store/apps/details?id=com.demir.bank',
    },
    o_bank: {
        name: 'О! Банк',
        icon: '🏦',
        deepLink: 'obank://payment',
        appStore: 'https://apps.apple.com/app/o-bank',
        playStore: 'https://play.google.com/store/apps/details?id=com.obank',
    },
    mbank: {
        name: 'MBank',
        icon: '🏦',
        deepLink: 'mbank://payment',
        appStore: 'https://apps.apple.com/app/mbank',
        playStore: 'https://play.google.com/store/apps/details?id=com.mbank',
    },
};

const Payment = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, hapticFeedback, showBackButton, hideBackButton } = useTelegram();
    const { language } = useLanguageStore();
    const t = (key: string) => getTranslation(language, key);

    const [offer, setOffer] = useState<Offer | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchOffer();
        showBackButton(() => navigate(-1));
        return () => hideBackButton();
    }, [id]);

    const fetchOffer = async () => {
        setLoading(true);
        try {
            const data = await offersApi.getById(id!);
            setOffer(data);
        } catch (error) {
            console.error('Failed to fetch offer:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleBankSelect = (bank: PaymentMethod) => {
        hapticFeedback('light');
        setPaymentMethod(bank);
    };

    const handleOpenBankApp = (bankKey: keyof typeof banks) => {
        const bank = banks[bankKey];
        hapticFeedback('medium');

        // Try to open deep link
        const deepLink = bank.deepLink;
        window.location.href = deepLink;

        // Fallback: after a delay, show option to continue
        setTimeout(() => {
            if (confirm(t('payment.continueWithoutApp'))) {
                handleContinue();
            }
        }, 2000);
    };

    const handleContinue = async () => {
        if (!offer || !paymentMethod) return;

        setProcessing(true);
        hapticFeedback('success');

        try {
            const userId = user?.id?.toString() || 'dev-user-' + Date.now();

            // Create order
            const order = await ordersApi.create({
                userId,
                offerId: offer.id,
            });

            // Navigate to success page with order data
            navigate(`/order-success/${order.id}`, {
                state: {
                    orderId: order.id,
                    qrCode: order.qrCode,
                    total: offer.discountedPrice,
                },
            });
        } catch (error) {
            console.error('Failed to create order:', error);
            alert(t('payment.orderFailed'));
        } finally {
            setProcessing(false);
        }
    };

    const handleSkipPayment = () => {
        hapticFeedback('light');
        handleContinue();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-tg-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button"></div>
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-tg-bg px-4">
                <div className="text-center">
                    <p className="text-tg-text text-lg mb-4">{t('payment.offerNotFound')}</p>
                    <Button onClick={() => navigate('/')}>{t('payment.goBack')}</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-tg-bg pb-24">
            {/* Header */}
            <div className="bg-tg-secondary px-4 py-4 sticky top-0 z-10 shadow-sm">
                <h1 className="text-xl font-bold text-tg-text">{t('payment.selectPayment')}</h1>
            </div>

            <div className="px-4 py-6">
                {/* Offer Summary */}
                <div className="bg-tg-secondary rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-tg-text mb-3">{t('payment.orderSummary')}</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-tg-hint">{offer.store.name}</span>
                            <span className="text-tg-text font-medium">{offer.discountedPrice} KGS</span>
                        </div>
                        <div className="border-t border-tg-hint/20 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-tg-text">{t('payment.total')}</span>
                                <span className="text-2xl font-bold text-tg-button">{offer.discountedPrice} KGS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                    <h3 className="font-semibold text-tg-text mb-4 flex items-center gap-2">
                        <span>💳</span>
                        {t('payment.paymentMethods')}
                    </h3>

                    <div className="space-y-3">
                        {/* Cash */}
                        <button
                            onClick={() => handleBankSelect('cash')}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                paymentMethod === 'cash'
                                    ? 'border-tg-button bg-tg-button/10'
                                    : 'border-tg-hint/20 bg-tg-secondary hover:border-tg-button/50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">💵</span>
                                    <div>
                                        <div className="font-semibold text-tg-text">{t('payment.cash')}</div>
                                        <div className="text-xs text-tg-hint">{t('payment.cashDesc')}</div>
                                    </div>
                                </div>
                                {paymentMethod === 'cash' && (
                                    <span className="text-tg-button text-xl">✓</span>
                                )}
                            </div>
                        </button>

                        {/* Online Banks */}
                        {Object.entries(banks).map(([key, bank]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    handleBankSelect(key as PaymentMethod);
                                    // Try to open bank app
                                    handleOpenBankApp(key as keyof typeof banks);
                                }}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                    paymentMethod === key
                                        ? 'border-tg-button bg-tg-button/10'
                                        : 'border-tg-hint/20 bg-tg-secondary hover:border-tg-button/50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{bank.icon}</span>
                                        <div>
                                            <div className="font-semibold text-tg-text">{bank.name}</div>
                                            <div className="text-xs text-tg-hint">{t('payment.onlinePayment')}</div>
                                        </div>
                                    </div>
                                    {paymentMethod === key && (
                                        <span className="text-tg-button text-xl">✓</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 {t('payment.info')}
                    </p>
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-tg-bg border-t border-tg-hint/20 p-4">
                <div className="space-y-2">
                    <Button
                        fullWidth
                        size="lg"
                        onClick={handleContinue}
                        loading={processing}
                        disabled={!paymentMethod}
                    >
                        {t('payment.confirmPayment')}
                    </Button>
                    <button
                        onClick={handleSkipPayment}
                        className="w-full text-sm text-tg-hint hover:text-tg-text transition-colors text-center"
                    >
                        {t('payment.skipForNow')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
