/**
 * Home Page - Browse Available Offers
 * 
 * Main buyer interface showing all available surprise bags
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { offersApi } from '../../api/offers';
import OfferCard from '../../components/OfferCard';

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

const Home = () => {
    const navigate = useNavigate();
    const { user, hapticFeedback } = useTelegram();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'nearby' | 'lowPrice'>('all');

    // Fetch offers from API
    useEffect(() => {
        fetchOffers();
    }, [filter]);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const data = await offersApi.getAll();
            setOffers(data);
        } catch (error) {
            console.error('Failed to fetch offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilter: typeof filter) => {
        hapticFeedback('light');
        setFilter(newFilter);
    };

    return (
        <div className="min-h-screen bg-tg-bg pb-20">
            {/* Header */}
            <div className="bg-tg-secondary sticky top-0 z-10 shadow-sm">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-tg-text">
                                Saqta
                            </h1>
                            <p className="text-sm text-tg-hint">
                                Hi, {user?.first_name || 'Guest'} 👋
                            </p>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    hapticFeedback('light');
                                    navigate('/map');
                                }}
                                className="p-2 rounded-full hover:bg-tg-bg transition-colors"
                                aria-label="Map View"
                            >
                                <svg
                                    className="w-6 h-6 text-tg-text"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={() => {
                                    hapticFeedback('light');
                                    navigate('/cart');
                                }}
                                className="p-2 rounded-full hover:bg-tg-bg transition-colors relative"
                                aria-label="Cart"
                            >
                                <svg
                                    className="w-6 h-6 text-tg-text"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {/* Badge for cart items (if any) */}
                                {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span> */}
                            </button>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <FilterPill
                            active={filter === 'all'}
                            onClick={() => handleFilterChange('all')}
                            label="All Offers"
                        />
                        <FilterPill
                            active={filter === 'nearby'}
                            onClick={() => handleFilterChange('nearby')}
                            label="Nearby"
                            icon="📍"
                        />
                        <FilterPill
                            active={filter === 'lowPrice'}
                            onClick={() => handleFilterChange('lowPrice')}
                            label="Low Price"
                            icon="💰"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-6">
                {loading ? (
                    // Loading State
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-tg-secondary rounded-2xl overflow-hidden animate-pulse"
                            >
                                <div className="h-48 bg-gray-300" />
                                <div className="p-4 space-y-3">
                                    <div className="h-5 bg-gray-300 rounded w-2/3" />
                                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                                    <div className="h-6 bg-gray-300 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : offers.length > 0 ? (
                    // Offers Grid
                    <div className="grid grid-cols-1 gap-4">
                        {offers.map((offer) => (
                            <OfferCard key={offer.id} offer={offer} />
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🍱</div>
                        <h3 className="text-xl font-semibold text-tg-text mb-2">
                            No offers available
                        </h3>
                        <p className="text-tg-hint">
                            Check back later for new surprise bags!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Filter Pill Component
interface FilterPillProps {
    active: boolean;
    onClick: () => void;
    label: string;
    icon?: string;
}

const FilterPill: React.FC<FilterPillProps> = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={`
      px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all
      ${active
                ? 'bg-tg-button text-tg-button-text shadow-md scale-105'
                : 'bg-tg-bg text-tg-text hover:bg-tg-hint/10'
            }
    `}
    >
        {icon && <span className="mr-1">{icon}</span>}
        {label}
    </button>
);

export default Home;
