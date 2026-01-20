/**
 * Create Offer (Merchant)
 * 
 * Simple form to creating a surprise bag offer.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { offersApi } from '../../api/offers';
import Button from '../../components/Button';

const CreateOffer = () => {
    const navigate = useNavigate();
    const { hapticFeedback } = useTelegram();

    // Form Stats
    const [name, setName] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState('');
    const [quantity, setQuantity] = useState(3);
    const [description, setDescription] = useState('');

    // Time Setup (Simple presets for MVP)
    const [timeWindow, setTimeWindow] = useState('today_evening');
    const [loading, setLoading] = useState(false);

    // Calculate discount percentage
    const orig = parseFloat(originalPrice) || 0;
    const disc = parseFloat(discountedPrice) || 0;
    const discountPercent = orig > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;

    const handleCreateOffer = async () => {
        if (!name || !originalPrice || !discountedPrice) {
            hapticFeedback('error');
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        hapticFeedback('medium');

        try {
            // Determine dates based on simple selection
            const now = new Date();
            let start = new Date(now);
            let end = new Date(now);

            if (timeWindow === 'today_evening') {
                start.setHours(18, 0, 0, 0); // 6 PM
                end.setHours(21, 0, 0, 0);   // 9 PM
                // If it's already past 9 PM, maybe warn or move to tomorrow? 
                // For MVP we assume merchant knows what they are doing.
            } else if (timeWindow === 'tomorrow_evening') {
                start.setDate(now.getDate() + 1);
                start.setHours(18, 0, 0, 0);
                end.setDate(now.getDate() + 1);
                end.setHours(21, 0, 0, 0);
            } else {
                // Lunch
                start.setDate(now.getDate() + 1);
                start.setHours(12, 0, 0, 0);
                end.setDate(now.getDate() + 1);
                end.setHours(15, 0, 0, 0);
            }

            const storeId = 'store1'; // Mock for now

            await offersApi.create({
                storeId,
                description: description || name, // Fallback if no desc
                // We might need to add a 'name' field to API if it doesn't exist, 
                // or just append it to description.
                // Assuming the API strictly follows the MVP schema which might not have 'name' separate from description.
                // Let's use name as description prefix for now.
                originalPrice: parseFloat(originalPrice),
                discountedPrice: parseFloat(discountedPrice),
                quantity,
                pickupStart: start.toISOString(),
                pickupEnd: end.toISOString(),
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', // Default placeholder
            });

            hapticFeedback('success');
            navigate('/merchant');
        } catch (error) {
            console.error('Failed to create offer:', error);
            alert('Error creating offer');
            hapticFeedback('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-tg-bg pb-24">
            {/* Header */}
            <div className="bg-tg-secondary px-4 py-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
                <button
                    onClick={() => navigate('/merchant')}
                    className="text-tg-button text-2xl"
                >
                    ←
                </button>
                <h1 className="text-xl font-bold text-tg-text">New Offer</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* 1. What are we selling? */}
                <div className="bg-tg-secondary p-4 rounded-xl">
                    <label className="block text-sm font-medium text-tg-hint mb-1">Offer Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mixed Pastries Bag"
                        className="w-full bg-tg-bg text-tg-text p-3 rounded-lg outline-none border border-transparent focus:border-tg-button transition-colors"
                    />

                    <label className="block text-sm font-medium text-tg-hint mt-3 mb-1">Description (Optional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Contents may include..."
                        className="w-full bg-tg-bg text-tg-text p-3 rounded-lg outline-none border border-transparent focus:border-tg-button h-20 resize-none"
                    />
                </div>

                {/* 2. Price */}
                <div className="bg-tg-secondary p-4 rounded-xl">
                    <h3 className="text-sm font-bold text-tg-text mb-3 flex justify-between">
                        <span>Pricing</span>
                        {discountPercent > 0 && <span className="text-green-500">-{discountPercent}%</span>}
                    </h3>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-tg-hint block mb-1">Original (KGS)</label>
                            <input
                                type="number"
                                value={originalPrice}
                                onChange={(e) => setOriginalPrice(e.target.value)}
                                placeholder="500"
                                className="w-full bg-tg-bg text-tg-text p-3 rounded-lg font-bold"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-tg-hint block mb-1">Discounted (KGS)</label>
                            <input
                                type="number"
                                value={discountedPrice}
                                onChange={(e) => setDiscountedPrice(e.target.value)}
                                placeholder="200"
                                className="w-full bg-tg-bg text-tg-button p-3 rounded-lg font-bold"
                            />
                        </div>
                    </div>
                    {orig > 0 && disc > 0 && (
                        <div className="mt-2 text-xs text-green-600 font-medium">
                            Customer saves {orig - disc} KGS!
                        </div>
                    )}
                </div>

                {/* 3. Quantity */}
                <div className="bg-tg-secondary p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-medium text-tg-text">Quantity (Bags)</label>
                        <span className="text-2xl font-bold text-tg-button">{quantity}</span>
                    </div>
                    <div className="flex gap-2">
                        {[1, 3, 5, 10].map(q => (
                            <button
                                key={q}
                                onClick={() => setQuantity(q)}
                                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${quantity === q ? 'bg-tg-button text-white' : 'bg-tg-bg text-tg-text'
                                    }`}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Time */}
                <div className="bg-tg-secondary p-4 rounded-xl">
                    <label className="block text-sm font-medium text-tg-text mb-3">Pickup Time</label>
                    <div className="space-y-2">
                        <label className="flex items-center justify-between p-3 bg-tg-bg rounded-lg cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">🌙</span>
                                <div>
                                    <div className="font-medium text-tg-text">Tonight</div>
                                    <div className="text-xs text-tg-hint">18:00 - 21:00</div>
                                </div>
                            </div>
                            <input
                                type="radio"
                                name="time"
                                checked={timeWindow === 'today_evening'}
                                onChange={() => setTimeWindow('today_evening')}
                                className="w-5 h-5 text-tg-button"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-tg-bg rounded-lg cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">☀️</span>
                                <div>
                                    <div className="font-medium text-tg-text">Tomorrow Lunch</div>
                                    <div className="text-xs text-tg-hint">12:00 - 15:00</div>
                                </div>
                            </div>
                            <input
                                type="radio"
                                name="time"
                                checked={timeWindow === 'tomorrow_lunch'}
                                onChange={() => setTimeWindow('tomorrow_lunch')}
                                className="w-5 h-5 text-tg-button"
                            />
                        </label>
                    </div>
                </div>

            </div>

            {/* Submit Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-tg-bg border-t border-tg-hint/10 p-4">
                <Button fullWidth size="lg" onClick={handleCreateOffer} loading={loading}>
                    Publish Offer
                </Button>
            </div>
        </div>
    );
};

export default CreateOffer;
