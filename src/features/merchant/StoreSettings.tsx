/**
 * Store Settings - Vendor Panel
 * 
 * Allows vendors to add/edit their store location
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { geocodeAddress } from '../../utils/geocoding';
import { storesApi } from '../../api/stores';
import Button from '../../components/Button';

const StoreSettings = () => {
    const navigate = useNavigate();
    const { hapticFeedback } = useTelegram();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        description: '',
    });

    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [geocoding, setGeocoding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddressLookup = async () => {
        if (!formData.address) {
            hapticFeedback('error');
            setError('Please enter an address');
            return;
        }

        setGeocoding(true);
        setError('');

        try {
            const result = await geocodeAddress(formData.address);

            if (result) {
                setCoordinates({ lat: result.lat, lng: result.lng });
                hapticFeedback('success');

                // Update address with the full formatted address
                setFormData(prev => ({ ...prev, address: result.displayName }));
            } else {
                setError('Address not found. Please try a different format.');
                hapticFeedback('error');
            }
        } catch (err) {
            setError('Failed to find address. Please try again.');
            hapticFeedback('error');
        } finally {
            setGeocoding(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!coordinates) {
            hapticFeedback('error');
            setError('Please verify your address first');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await storesApi.create({
                name: formData.name,
                address: formData.address,
                phone: formData.phone || '',
                description: formData.description || '',
                latitude: coordinates.lat,
                longitude: coordinates.lng,
            });

            hapticFeedback('success');
            alert('Store settings saved successfully! ✓');
            navigate('/merchant');
        } catch (err) {
            console.error('Failed to save store:', err);
            setError('Failed to save store settings');
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
                <h1 className="text-xl font-bold text-tg-text">Store Settings</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">

                {/* Store Name */}
                <div className="bg-tg-secondary p-4 rounded-xl">
                    <label className="block text-sm font-medium text-tg-hint mb-1">
                        Store Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Bishkek Bakery"
                        required
                        className="w-full bg-tg-bg text-tg-text p-3 rounded-lg outline-none border border-transparent focus:border-tg-button transition-colors"
                    />
                </div>

                {/* Address */}
                <div className="bg-tg-secondary p-4 rounded-xl">
                    <label className="block text-sm font-medium text-tg-hint mb-1">
                        Address *
                    </label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="e.g. Chuy Ave 123, Bishkek"
                        required
                        className="w-full bg-tg-bg text-tg-text p-3 rounded-lg outline-none border border-transparent focus:border-tg-button transition-colors mb-3"
                    />

                    <button
                        type="button"
                        onClick={handleAddressLookup}
                        disabled={geocoding || !formData.address}
                        className="w-full bg-tg-button/10 text-tg-button py-2 rounded-lg font-medium text-sm disabled:opacity-50"
                    >
                        {geocoding ? '🔍 Finding...' : '📍 Verify Address on Map'}
                    </button>

                    {coordinates && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                                ✓ Location verified: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Phone */}
                <div className="bg-tg-secondary p-4 rounded-xl">
                    <label className="block text-sm font-medium text-tg-hint mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+996 555 123 456"
                        className="w-full bg-tg-bg text-tg-text p-3 rounded-lg outline-none border border-transparent focus:border-tg-button transition-colors"
                    />
                </div>

                {/* Description */}
                <div className="bg-tg-secondary p-4 rounded-xl">
                    <label className="block text-sm font-medium text-tg-hint mb-1">
                        Description (Optional)
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Tell customers about your store..."
                        className="w-full bg-tg-bg text-tg-text p-3 rounded-lg outline-none border border-transparent focus:border-tg-button h-24 resize-none"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-200 mb-2">
                        📌 Why we need your location
                    </h4>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Customers can find you on the map</li>
                        <li>• Helps with nearby store recommendations</li>
                        <li>• All data is secure and private</li>
                    </ul>
                </div>
            </form>

            {/* Submit Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-tg-bg border-t border-tg-hint/10 p-4">
                <Button
                    fullWidth
                    size="lg"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!coordinates}
                >
                    Save Store Settings
                </Button>
            </div>
        </div>
    );
};

export default StoreSettings;
