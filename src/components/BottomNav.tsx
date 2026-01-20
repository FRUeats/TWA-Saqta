import { useNavigate, useLocation } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hapticFeedback } = useTelegram();

    const tabs = [
        {
            id: 'home',
            label: 'Home',
            icon: '🏠',
            path: '/',
        },
        {
            id: 'map',
            label: 'Map',
            icon: '🗺️',
            path: '/map',
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: '📦',
            path: '/orders',
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: '👤',
            path: '/profile',
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-tg-secondary border-t border-tg-hint/10 pb-safe pt-2 px-4 z-40">
            <div className="flex justify-around items-center">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (!isActive) {
                                    hapticFeedback('light');
                                    navigate(tab.path);
                                }
                            }}
                            className={`flex flex-col items-center justify-center p-2 w-16 transition-all ${isActive ? 'text-tg-button scale-110' : 'text-tg-hint'
                                }`}
                        >
                            <span className="text-2xl mb-1">{tab.icon}</span>
                            <span className="text-[10px] font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
