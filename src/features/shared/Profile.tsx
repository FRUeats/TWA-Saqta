// Placeholder for Profile page
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useAuthStore } from '../../store/authStore';

const Profile = () => {
    const navigate = useNavigate();
    const { user, hapticFeedback } = useTelegram();
    const { logout } = useAuthStore();

    // Get initials for avatar
    const getInitials = () => {
        if (!user) return '??';
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    };

    const handleVendorClick = () => {
        hapticFeedback('medium');
        navigate('/vendor/register');
    };

    const handleDashboardClick = () => {
        hapticFeedback('light');
        navigate('/merchant');
    };

    if (!user) return null;

    // Is the user already a merchant?
    // Note: In a real app we would check role from authStore, not just telegram user
    const { user: authUser } = useAuthStore();
    const isMerchant = authUser?.role === 'MERCHANT';

    return (
        <div className="min-h-screen bg-tg-bg pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-tg-button/20 to-tg-bg p-6 pt-10 text-center relative overflow-hidden">
                <div className="relative z-10">
                    {/* Avatar */}
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-tg-button to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4 border-4 border-tg-bg">
                        {(user as any).photo_url ? (
                            <img src={(user as any).photo_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            getInitials()
                        )}
                    </div>

                    {/* Name */}
                    <h2 className="text-2xl font-bold text-tg-text">
                        {user.first_name} {user.last_name}
                    </h2>
                    <p className="text-tg-hint text-sm">@{user.username || 'username'}</p>

                    {/* Role Badge */}
                    <div className="mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isMerchant
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                            {isMerchant ? 'Vending Partner' : 'Food Saver'}
                        </span>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] bg-tg-button/5 rounded-full blur-3xl -z-0"></div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-4">
                {/* Vendor Action Card */}
                {!isMerchant ? (
                    <div
                        onClick={handleVendorClick}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg cursor-pointer transform transition-transform active:scale-[0.98]"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold">Become a Seller</h3>
                            <span className="text-2xl">💼</span>
                        </div>
                        <p className="text-white/80 text-sm mb-4">
                            Have surplus food? Join Saqta and turn waste into revenue.
                        </p>
                        <div className="bg-white/20 inline-block px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                            Register Business →
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={handleDashboardClick}
                        className="bg-gradient-to-r from-tg-button to-green-500 rounded-2xl p-5 text-white shadow-lg cursor-pointer transform transition-transform active:scale-[0.98]"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold">Vendor Dashboard</h3>
                            <span className="text-2xl">📊</span>
                        </div>
                        <p className="text-white/80 text-sm mb-4">
                            Manage your offers and scan QR codes.
                        </p>
                        <div className="bg-white/20 inline-block px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                            Open Dashboard →
                        </div>
                    </div>
                )}

                {/* Settings Group */}
                <div className="bg-tg-secondary rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-tg-hint/10 flex items-center justify-between cursor-pointer hover:bg-tg-bg/50">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🌍</span>
                            <span className="text-tg-text">Language</span>
                        </div>
                        <span className="text-tg-hint text-sm">English ›</span>
                    </div>

                    <div className="p-4 border-b border-tg-hint/10 flex items-center justify-between cursor-pointer hover:bg-tg-bg/50">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🔔</span>
                            <span className="text-tg-text">Notifications</span>
                        </div>
                        <div className="w-10 h-6 bg-tg-button rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>

                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-tg-bg/50">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">❓</span>
                            <span className="text-tg-text">Help & Support</span>
                        </div>
                        <span className="text-tg-hint text-sm">›</span>
                    </div>
                </div>

                {/* Version */}
                <div className="text-center text-xs text-tg-hint mt-8">
                    Saqta App v1.0.0
                    <br />
                    Made with 💚 for food
                </div>
            </div>
        </div>
    );
};

export default Profile;
