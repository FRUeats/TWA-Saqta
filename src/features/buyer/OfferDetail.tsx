/**
 * OfferDetail Page
 * 
 * Detailed view of a surprise bag offer
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useCartStore } from '../../store/cartStore';
import { offersApi } from '../../api/offers';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

interface Offer {
    id: string;
    store: {
        name: string;
        address: string;
        image?: string;
        phone?: string;
    };
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
    pickupStart: Date;
    pickupEnd: Date;
    description?: string;
    image?: string;
}

const OfferDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showBackButton, hideBackButton, hideMainButton, hapticFeedback } = useTelegram();
    const { addItem } = useCartStore();

    const [offer, setOffer] = useState<Offer | null>(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchOffer();

        // Show back button
        showBackButton(() => {
            navigate('/');
        });

        return () => {
            hideBackButton();
            hideMainButton();
        };
    }, [id]);

    const fetchOffer = async () => {
        setLoading(true);
        try {
            const data = await offersApi.getById(id!);
            setOffer(data);
        } catch (error) {
            console.error('Failed to fetch offer:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!offer) return;

        setAdding(true);
        hapticFeedback('success');

        addItem({
            offerId: offer.id,
            storeName: offer.store.name,
            originalPrice: offer.originalPrice,
            discountedPrice: offer.discountedPrice,
            quantity: 1,
            pickupStart: offer.pickupStart,
            pickupEnd: offer.pickupEnd,
            image: offer.image,
        });

        setTimeout(() => {
            setAdding(false);
            navigate('/cart');
        }, 500);
    };

    const discountPercent = offer
        ? Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100)
        : 0;

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
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
                    <p className="text-tg-text text-lg mb-4">Offer not found</p>
                    <Button onClick={() => navigate('/')}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-tg-bg pb-24">
            {/* Image */}
            <div className="relative h-72 bg-gray-200">
                {offer.image ? (
                    <img
                        src={offer.image}
                        alt={offer.store.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tg-button/20 to-tg-button/5">
                        <svg className="w-24 h-24 text-tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                )}

                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    -{discountPercent}%
                </div>

                {offer.quantity <= 3 && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                        Only {offer.quantity} left!
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-4 py-6">
                {/* Store Name */}
                <h1 className="text-2xl font-bold text-tg-text mb-2">{offer.store.name}</h1>

                {/* Address */}
                <div className="flex items-start gap-2 text-tg-hint mb-4">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{offer.store.address}</span>
                </div>

                {/* Price */}
                <div className="bg-tg-secondary rounded-2xl p-4 mb-4">
                    <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-3xl font-bold text-tg-button">{offer.discountedPrice} KGS</span>
                        <span className="text-lg text-tg-hint line-through">{offer.originalPrice} KGS</span>
                    </div>
                    <p className="text-sm text-tg-hint">You save {offer.originalPrice - offer.discountedPrice} KGS</p>
                </div>

                {/* Pickup Time */}
                <div className="bg-tg-secondary rounded-2xl p-4 mb-4">
                    <h3 className="font-semibold text-tg-text mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pickup Time
                    </h3>
                    <p className="text-tg-text">
                        {formatTime(offer.pickupStart)} - {formatTime(offer.pickupEnd)}
                    </p>
                </div>

                {/* Description */}
                {offer.description && (
                    <div className="mb-4">
                        <h3 className="font-semibold text-tg-text mb-2">What's Inside</h3>
                        <p className="text-tg-hint leading-relaxed">{offer.description}</p>
                    </div>
                )}

                {/* Availability */}
                <div className="flex items-center gap-2 mb-6">
                    <Badge variant={offer.quantity > 5 ? 'success' : 'warning'}>
                        {offer.quantity} {offer.quantity === 1 ? 'bag' : 'bags'} available
                    </Badge>
                </div>

                {/* Contact */}
                {offer.store.phone && (
                    <div className="text-sm text-tg-hint mb-6">
                        Questions? Call {offer.store.phone}
                    </div>
                )}
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-tg-bg border-t border-tg-hint/20 p-4">
                <Button
                    fullWidth
                    size="lg"
                    onClick={handleAddToCart}
                    loading={adding}
                    disabled={offer.quantity === 0}
                >
                    {offer.quantity === 0 ? 'Sold Out' : 'Add to Cart'}
                </Button>
            </div>
        </div>
    );
};

export default OfferDetail;
