/**
 * Role Switcher Component
 * 
 * Switch between Buyer and Merchant modes
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

const RoleSwitcher = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hapticFeedback } = useTelegram();

    const isMerchantMode = location.pathname.startsWith('/merchant');

    const switchRole = () => {
        hapticFeedback('medium');
        if (isMerchantMode) {
            navigate('/');
        } else {
            navigate('/merchant');
        }
    };

    return (
        <button
            onClick={switchRole}
            className="fixed bottom-20 right-4 z-50 bg-tg-button text-tg-button-text rounded-full p-4 shadow-lg active:scale-95 transition-all"
            aria-label={isMerchantMode ? 'Switch to Buyer' : 'Switch to Merchant'}
        >
            <div className="flex items-center gap-2">
                {isMerchantMode ? (
                    <>
                        <span className="text-xl">🛍</span>
                        <span className="font-semibold text-sm">Buyer</span>
                    </>
                ) : (
                    <>
                        <span className="text-xl">🏪</span>
                        <span className="font-semibold text-sm">Merchant</span>
                    </>
                )}
            </div>
        </button>
    );
};

export default RoleSwitcher;
