/**
 * Create Offer (Quick Offer)
 * 
 * Fast offer creation with templates and smart defaults
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { offersApi } from '../../api/offers';
import { offerTemplates, timePresets, getPresetTime, type OfferTemplate } from '../../utils/offerTemplates';
import Button from '../../components/Button';

const CreateOffer = () => {
    const navigate = useNavigate();
    const { hapticFeedback } = useTelegram();

    const [selectedTemplate, setSelectedTemplate] = useState<OfferTemplate>(offerTemplates[0]);
    const [quantity, setQuantity] = useState(selectedTemplate.defaultQuantity);
    const [selectedTimePreset, setSelectedTimePreset] = useState(timePresets[0]);
    const [loading, setLoading] = useState(false);

    const discountPercent = Math.round(
        ((selectedTemplate.originalPrice - selectedTemplate.discountedPrice) / selectedTemplate.originalPrice) * 100
    );

    const handleTemplateChange = (template: OfferTemplate) => {
        hapticFeedback('light');
        setSelectedTemplate(template);
        setQuantity(template.defaultQuantity);
    };

    const handleQuickQuantity = (qty: number) => {
        hapticFeedback('light');
        setQuantity(qty);
    };

    const handleCreateOffer = async () => {
        setLoading(true);
        hapticFeedback('medium');

        try {
            const { start, end } = getPresetTime(selectedTimePreset);

            // TODO: Use actual store ID from authenticated merchant
            const storeId = 'store1'; // Mock for now

            await offersApi.create({
                storeId,
                originalPrice: selectedTemplate.originalPrice,
                discountedPrice: selectedTemplate.discountedPrice,
                quantity,
                pickupStart: start.toISOString(),
                pickupEnd: end.toISOString(),
                description: selectedTemplate.description,
                image: selectedTemplate.image,
            });

            hapticFeedback('success');
            navigate('/merchant');
        } catch (error) {
            console.error('Failed to create offer:', error);
            alert('Failed to create offer. Please try again.');
            hapticFeedback('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-tg-bg pb-24">
            {/* Header */}
            <div className="bg-tg-secondary px-4 py-4 sticky top-0 z-10 shadow-sm">
                <button
                    onClick={() => navigate('/merchant')}
                    className="text-tg-button mb-2"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-tg-text">✨ Quick Offer</h1>
                <p className="text-sm text-tg-hint">Create offer in 2 clicks</p>
            </div>

            <div className="px-4 py-6 space-y-6">
                {/* Template Selection */}
                <div>
                    <label className="block text-sm font-semibold text-tg-text mb-3">
                        📋 Select Template
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {offerTemplates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => handleTemplateChange(template)}
                                className={`p-4 rounded-xl border-2 transition-all ${selectedTemplate.id === template.id
                                        ? 'border-tg-button bg-tg-button/10 scale-105'
                                        : 'border-tg-hint/20 bg-tg-secondary'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{template.icon}</div>
                                <div className="text-sm font-medium text-tg-text">{template.name}</div>
                                <div className="text-xs text-tg-hint mt-1">
                                    {template.originalPrice}→{template.discountedPrice}₸
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Auto-filled Prices */}
                <div className="bg-tg-secondary rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-tg-text">💰 Pricing</span>
                        <span className="text-sm font-bold text-green-500">-{discountPercent}%</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-tg-hint">Original Price:</span>
                            <span className="font-semibold text-tg-text">{selectedTemplate.originalPrice} KGS</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-tg-hint">Discount Price:</span>
                            <span className="font-semibold text-tg-button">{selectedTemplate.discountedPrice} KGS</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-tg-hint">You save:</span>
                            <span className="font-semibold text-green-500">
                                {selectedTemplate.originalPrice - selectedTemplate.discountedPrice} KGS
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-semibold text-tg-text mb-3">
                        📦 Quantity (bags available)
                    </label>

                    {/* Quick buttons */}
                    <div className="flex items-center gap-2 mb-3">
                        {[3, 5, 8, 10].map((qty) => (
                            <button
                                key={qty}
                                onClick={() => handleQuickQuantity(qty)}
                                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${quantity === qty
                                        ? 'bg-tg-button text-tg-button-text scale-105'
                                        : 'bg-tg-secondary text-tg-text'
                                    }`}
                            >
                                {qty}
                            </button>
                        ))}
                    </div>

                    {/* Custom input */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 rounded-xl bg-tg-secondary text-tg-text text-xl font-bold"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="flex-1 text-center text-2xl font-bold bg-tg-secondary text-tg-text rounded-xl py-3 border-none outline-none"
                            min="1"
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 rounded-xl bg-tg-secondary text-tg-text text-xl font-bold"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Time Preset */}
                <div>
                    <label className="block text-sm font-semibold text-tg-text mb-3">
                        ⏰ Pickup Time
                    </label>
                    <div className="space-y-2">
                        {timePresets.map((preset, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    hapticFeedback('light');
                                    setSelectedTimePreset(preset);
                                }}
                                className={`w-full p-4 rounded-xl text-left transition-all ${selectedTimePreset === preset
                                        ? 'bg-tg-button text-tg-button-text'
                                        : 'bg-tg-secondary text-tg-text'
                                    }`}
                            >
                                <div className="font-semibold">{preset.label}</div>
                                <div className="text-sm opacity-80">
                                    {preset.hours[0]}:00 - {preset.hours[1]}:00
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description Preview */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <div className="text-sm font-semibold text-tg-text mb-2">📝 Description</div>
                    <div className="text-sm text-tg-hint">{selectedTemplate.description}</div>
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-tg-bg border-t border-tg-hint/20 p-4">
                <Button
                    fullWidth
                    size="lg"
                    onClick={handleCreateOffer}
                    loading={loading}
                >
                    ✅ Create Offer
                </Button>
            </div>
        </div>
    );
};

export default CreateOffer;
