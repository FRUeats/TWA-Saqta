/**
 * Vendor Registration (Contact)
 * 
 * Tells users how to become a vendor
 */

import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import Button from '../../components/Button';

const VendorRegistration = () => {
    const navigate = useNavigate();
    const { hapticFeedback } = useTelegram();

    const handleApply = () => {
        hapticFeedback('medium');
        // Open official support or website
        window.open('https://t.me/SaqtaSupport', '_blank');
    };

    return (
        <div className="min-h-screen bg-tg-bg flex flex-col items-center justify-center p-6 text-center">

            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center text-5xl shadow-xl mb-6 transform rotate-3">
                🤝
            </div>

            <h1 className="text-2xl font-bold text-tg-text mb-3">Partner with Saqta</h1>

            <p className="text-tg-hint mb-8 leading-relaxed max-w-sm">
                We are looking for bakeries, cafes, and restaurants who want to reduce food waste and earn extra revenue.
            </p>

            <div className="bg-tg-secondary p-5 rounded-xl w-full max-w-sm mb-6 text-left shadow-sm border border-tg-hint/10">
                <h3 className="font-semibold text-tg-text mb-3">Why join us?</h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-tg-text">
                        <span className="text-green-500">✓</span>
                        Earn from surplus food
                    </li>
                    <li className="flex gap-3 text-sm text-tg-text">
                        <span className="text-green-500">✓</span>
                        New customers visiting your store
                    </li>
                    <li className="flex gap-3 text-sm text-tg-text">
                        <span className="text-green-500">✓</span>
                        Help the planet
                    </li>
                </ul>
            </div>

            <p className="text-xs text-tg-hint mb-4">
                Applications are moderated manually.
            </p>

            <Button size="lg" onClick={handleApply}>
                Write to Manager
            </Button>

            <button
                onClick={() => navigate('/')}
                className="mt-6 text-tg-button text-sm font-medium"
            >
                Back to Home
            </button>
        </div>
    );
};

export default VendorRegistration;
