/**
 * Cart Page
 * 
 * Shopping cart with checkout functionality
 */

import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useCartStore } from '../../store/cartStore';
import Button from '../../components/Button';
import { useEffect } from 'react';

const Cart = () => {
    const navigate = useNavigate();
    const { showBackButton, hideBackButton, showMainButton, hideMainButton, hapticFeedback } = useTelegram();
    const { items, removeItem, getTotalPrice, getTotalItems } = useCartStore();

    const totalPrice = getTotalPrice();
    const totalItems = getTotalItems();

    useEffect(() => {
        showBackButton(() => {
            navigate('/');
        });

        if (items.length > 0) {
            showMainButton(`Checkout (${totalPrice} KGS)`, handleCheckout);
        }

        return () => {
            hideBackButton();
            hideMainButton();
        };
    }, [items, totalPrice]);

    const handleCheckout = () => {
        hapticFeedback('success');
        // TODO: Navigate to checkout/order confirmation
        navigate('/checkout');
    };

    const handleRemoveItem = (offerId: string) => {
        hapticFeedback('light');
        removeItem(offerId);
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-tg-bg px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-xl font-semibold text-tg-text mb-2">Your cart is empty</h2>
                    <p className="text-tg-hint mb-6">Add some delicious surprise bags first!</p>
                    <Button onClick={() => navigate('/')}>Browse Offers</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-tg-bg pb-32">
            {/* Header */}
            <div className="bg-tg-secondary sticky top-0 z-10 px-4 py-4 shadow-sm">
                <h1 className="text-2xl font-bold text-tg-text">Cart</h1>
                <p className="text-sm text-tg-hint">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>

            {/* Cart Items */}
            <div className="px-4 py-4 space-y-4">
                {items.map((item) => (
                    <div key={item.offerId} className="bg-tg-secondary rounded-2xl overflow-hidden">
                        <div className="flex gap-4 p-4">
                            {/* Image */}
                            {item.image && (
                                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
                                    <img src={item.image} alt={item.storeName} className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-tg-text mb-1 truncate">{item.storeName}</h3>

                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-lg font-bold text-tg-button">{item.discountedPrice} KGS</span>
                                    <span className="text-sm text-tg-hint line-through">{item.originalPrice} KGS</span>
                                </div>

                                <div className="text-xs text-tg-hint mb-2">
                                    Pickup: {formatTime(item.pickupStart)} - {formatTime(item.pickupEnd)}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-tg-hint">Qty: {item.quantity}</span>
                                </div>
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => handleRemoveItem(item.offerId)}
                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                aria-label="Remove item"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>

                        {/* Subtotal */}
                        {item.quantity > 1 && (
                            <div className="px-4 py-2 bg-tg-bg/50 text-right text-sm text-tg-hint">
                                Subtotal: {item.discountedPrice * item.quantity} KGS
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Summary (Fixed Bottom) */}
            <div className="fixed bottom-0 left-0 right-0 bg-tg-secondary border-t border-tg-hint/20 p-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-tg-text">Total</span>
                    <span className="text-2xl font-bold text-tg-button">{totalPrice} KGS</span>
                </div>

                <Button fullWidth size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                </Button>
            </div>
        </div>
    );
};

export default Cart;
