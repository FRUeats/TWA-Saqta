/**
 * OfferCard Component
 * 
 * Displays a surprise bag offer with image, pricing, and availability
 */

import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

interface Offer {
    id: string;
    store: {
        name: string;
        address: string;
        image?: string;
    };
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
    pickupStart: Date;
    pickupEnd: Date;
    description?: string;
    image?: string;
}

interface OfferCardProps {
    offer: Offer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
    const navigate = useNavigate();
    const { hapticFeedback } = useTelegram();

    // Calculate discount percentage
    const discountPercent = Math.round(
        ((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100
    );

    // Format time range
    const formatTimeRange = (start: Date, end: Date) => {
        const startTime = new Date(start).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        const endTime = new Date(end).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        return `${startTime} - ${endTime}`;
    };

    // Check if low stock
    const isLowStock = offer.quantity <= 3;

    const handleClick = () => {
        hapticFeedback('light');
        navigate(`/offer/${offer.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-tg-secondary rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
        >
            {/* Image Section */}
            <div className="relative h-48 bg-gray-200">
                {offer.image || offer.store.image ? (
                    <img
                        src={offer.image || offer.store.image}
                        alt={offer.store.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tg-button/20 to-tg-button/5">
                        <svg
                            className="w-16 h-16 text-tg-hint"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    </div>
                )}

                {/* Discount Badge */}
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                    -{discountPercent}%
                </div>

                {/* Low Stock Badge */}
                {isLowStock && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold text-xs shadow-lg">
                        Only {offer.quantity} left!
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Store Name */}
                <h3 className="text-lg font-bold text-tg-text mb-1 truncate">
                    {offer.store.name}
                </h3>

                {/* Address */}
                <p className="text-sm text-tg-hint mb-3 flex items-center gap-1 truncate">
                    <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <span className="truncate">{offer.store.address}</span>
                </p>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-tg-button">
                        {offer.discountedPrice} KGS
                    </span>
                    <span className="text-sm text-tg-hint line-through">
                        {offer.originalPrice} KGS
                    </span>
                </div>

                {/* Pickup Time */}
                <div className="flex items-center gap-2 text-sm text-tg-text bg-tg-bg rounded-lg px-3 py-2">
                    <svg
                        className="w-4 h-4 text-tg-hint"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="font-medium">Pickup:</span>
                    <span className="text-tg-hint">
                        {formatTimeRange(offer.pickupStart, offer.pickupEnd)}
                    </span>
                </div>

                {/* Description (if available) */}
                {offer.description && (
                    <p className="text-sm text-tg-hint mt-2 line-clamp-2">
                        {offer.description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default OfferCard;
