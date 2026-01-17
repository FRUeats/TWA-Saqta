/**
 * VendorPending Component
 * 
 * Shown to vendors awaiting admin verification
 */

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTelegram } from '../../hooks/useTelegram';

const VendorPending = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { initData } = useTelegram();
    const { checkAuth } = useAuthStore();

    const handleCheckStatus = async () => {
        if (!initData) return;

        try {
            await checkAuth(initData);
            const updatedUser = useAuthStore.getState().user;

            if (updatedUser?.isVerified) {
                navigate('/merchant');
            }
        } catch (error) {
            console.error('Failed to check status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-tg-bg flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Icon */}
                <div className="text-6xl">⏳</div>

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold text-tg-text mb-2">
                        Verification Pending
                    </h1>
                    <p className="text-tg-hint">
                        Your vendor account is awaiting admin approval
                    </p>
                </div>

                {/* Company Info */}
                {user && (
                    <div className="bg-tg-secondary-bg rounded-lg p-4 border border-tg-hint/20">
                        <p className="text-sm text-tg-hint mb-1">Company Name</p>
                        <p className="text-lg font-semibold text-tg-text">
                            {user.companyName}
                        </p>
                    </div>
                )}

                {/* Status */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-yellow-400 mb-2">
                        What's happening?
                    </h3>
                    <ul className="text-sm text-tg-hint space-y-2 text-left">
                        <li>📝 Our admin team is reviewing your application</li>
                        <li>⏱️ This usually takes 1-2 business days</li>
                        <li>📧 You'll be notified once approved</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleCheckStatus}
                        className="w-full bg-tg-button text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Check Verification Status
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full border border-tg-hint/20 text-tg-text py-3 rounded-lg font-semibold hover:bg-tg-secondary-bg transition-colors"
                    >
                        Browse as Buyer
                    </button>
                </div>

                {/* Support */}
                <p className="text-xs text-tg-hint">
                    Need help? Contact{' '}
                    <a href="mailto:support@saqta.kg" className="text-tg-button underline">
                        support@saqta.kg
                    </a>
                </p>
            </div>
        </div>
    );
};

export default VendorPending;
