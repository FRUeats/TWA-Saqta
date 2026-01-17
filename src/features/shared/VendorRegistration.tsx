/**
 * VendorRegistration Component
 * 
 * Registration form for vendors (merchants)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useAuthStore } from '../../store/authStore';

const VendorRegistration = () => {
    const navigate = useNavigate();
    const { initData } = useTelegram();
    const { vendorRegister, isLoading } = useAuthStore();

    const [companyName, setCompanyName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!initData) {
            setError('Telegram data not available');
            return;
        }

        if (companyName.trim().length < 3) {
            setError('Company name must be at least 3 characters');
            return;
        }

        try {
            setError(null);
            await vendorRegister(initData, companyName.trim());

            // Check if vendor needs verification
            const user = useAuthStore.getState().user;
            if (user && !user.isVerified) {
                navigate('/vendor/pending');
            } else {
                navigate('/merchant');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-tg-bg flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="text-4xl mb-4">🏪</div>
                    <h1 className="text-2xl font-bold text-tg-text mb-2">
                        Vendor Registration
                    </h1>
                    <p className="text-tg-hint">
                        Join Saqta as a merchant and start selling surplus food
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="companyName"
                            className="block text-sm font-medium text-tg-text mb-2"
                        >
                            Company/Store Name *
                        </label>
                        <input
                            id="companyName"
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g., Coffee House Bishkek"
                            required
                            minLength={3}
                            className="w-full px-4 py-3 bg-tg-secondary-bg text-tg-text border border-tg-hint/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-tg-button"
                        />
                        <p className="text-xs text-tg-hint mt-1">
                            This will be displayed to customers
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-400 mb-2">
                            What happens next?
                        </h3>
                        <ul className="text-xs text-tg-hint space-y-1">
                            <li>✓ Your account will be created as a vendor</li>
                            <li>✓ Admin will verify your business</li>
                            <li>✓ Once verified, you can start creating offers</li>
                        </ul>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || companyName.trim().length < 3}
                        className="w-full bg-tg-button text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        {isLoading ? 'Registering...' : 'Register as Vendor'}
                    </button>

                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full text-tg-hint py-2 text-sm hover:text-tg-text transition-colors"
                    >
                        Continue as buyer instead
                    </button>
                </form>

                {/* Terms */}
                <p className="text-xs text-tg-hint text-center">
                    By registering, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default VendorRegistration;
