// Profile Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { getTranslation, Language, languages } from '../../utils/i18n';

const Profile = () => {
    const navigate = useNavigate();
    const { user, hapticFeedback, tg } = useTelegram();
    const { user: authUser } = useAuthStore();
    const { language, setLanguage } = useLanguageStore();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    const t = (key: string) => getTranslation(language, key);

    // Stats (Mocked for now, but in real app calculate from OrderHistory)
    const stats = {
        ordersCount: 12,
        moneySaved: 4500,
        boxesSaved: 12,
    };

    // Get initials for avatar
    const getInitials = () => {
        if (!user) return '??';
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    };

    const isMerchant = authUser?.role === 'MERCHANT';

    return (
        <div className="min-h-screen bg-tg-bg">
            {/* Header */}
            <div className="bg-tg-secondary p-6 pt-10 text-center rounded-b-3xl shadow-sm mb-6">
                {/* Avatar */}
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4 border-4 border-tg-bg">
                    {(user as any)?.photo_url ? (
                        <img src={(user as any).photo_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        getInitials()
                    )}
                </div>

                {/* Name & Phone */}
                <h2 className="text-2xl font-bold text-tg-text mb-1">
                    {user?.first_name} {user?.last_name}
                </h2>
                {/* Telegram doesn't always provide phone number to WebApps for privacy, but if we had it: */}
                {authUser?.username && <p className="text-tg-hint text-sm">@{authUser.username}</p>}

                {isMerchant && (
                    <div className="mt-2">
                        <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                            Vendor Account
                        </span>
                    </div>
                )}
            </div>

            {/* Impact Stats */}
            <div className="px-4 mb-6">
                <h3 className="text-lg font-bold text-tg-text mb-3 px-2">My Impact 🌍</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
                        <div className="text-3xl mb-1">💰</div>
                        <div className="text-2xl font-bold">{stats.moneySaved} <u>s</u></div>
                        <div className="text-xs opacity-90">Money Saved</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-4 text-white shadow-lg">
                        <div className="text-3xl mb-1">🎁</div>
                        <div className="text-2xl font-bold">{stats.boxesSaved}</div>
                        <div className="text-xs opacity-90">Bags Rescued</div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="px-4 space-y-3">
                <div className="bg-tg-secondary rounded-xl overflow-hidden">
                    <button
                        onClick={() => { hapticFeedback('light'); navigate('/orders'); }}
                        className="w-full p-4 flex items-center justify-between hover:bg-tg-bg/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📜</span>
                            <span className="font-medium text-tg-text">Order History</span>
                        </div>
                        <span className="text-tg-hint">›</span>
                    </button>

                    <div className="h-[1px] bg-tg-bg w-full"></div>

                    <button
                        onClick={() => { hapticFeedback('light'); /* TODO: Support page */ }}
                        className="w-full p-4 flex items-center justify-between hover:bg-tg-bg/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">💬</span>
                            <span className="font-medium text-tg-text">Support</span>
                        </div>
                        <span className="text-tg-hint">›</span>
                    </button>
                </div>

                {/* Language Selector */}
                <div className="bg-tg-secondary rounded-xl overflow-hidden mb-3">
                    <button
                        onClick={() => {
                            hapticFeedback('light');
                            setShowLanguageSelector(!showLanguageSelector);
                        }}
                        className="w-full p-4 flex items-center justify-between hover:bg-tg-bg/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🌍</span>
                            <span className="font-medium text-tg-text">{t('profile.language')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-tg-hint">{languages[language].flag} {languages[language].name}</span>
                            <span className="text-tg-hint">{showLanguageSelector ? '▲' : '▼'}</span>
                        </div>
                    </button>

                    {showLanguageSelector && (
                        <div className="border-t border-tg-bg/50 p-3 space-y-2">
                            {Object.entries(languages).map(([code, lang]) => (
                                <button
                                    key={code}
                                    onClick={() => {
                                        hapticFeedback('light');
                                        setLanguage(code as Language);
                                        setShowLanguageSelector(false);
                                    }}
                                    className={`w-full p-3 rounded-lg text-left transition-all ${
                                        language === code
                                            ? 'bg-tg-button/20 border-2 border-tg-button'
                                            : 'bg-tg-bg/50 hover:bg-tg-bg'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{lang.flag}</span>
                                        <span className="font-medium text-tg-text">{lang.name}</span>
                                        {language === code && (
                                            <span className="ml-auto text-tg-button">✓</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Vendor Area Link (Only if not merchant, show 'Become Partner') */}
                {!isMerchant ? (
                    <div className="space-y-3 mt-6">
                        <button
                            onClick={() => navigate('/vendor/register')}
                            className="w-full bg-tg-secondary p-4 rounded-xl flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl group-hover:scale-110 transition-transform">💼</span>
                                <div className="text-left">
                                    <div className="font-medium text-tg-text">{t('profile.becomePartner')}</div>
                                    <div className="text-xs text-tg-hint">{t('profile.becomePartnerSubtitle')}</div>
                                </div>
                            </div>
                            <span className="text-tg-button text-sm font-medium">Apply</span>
                        </button>

                        {/* Contact Manager Button */}
                        <button
                            onClick={() => {
                                hapticFeedback('medium');
                                // Open Telegram chat with @saqtapp_bot
                                if (tg) {
                                    window.open('https://t.me/saqtapp_bot', '_blank');
                                } else {
                                    // Fallback for dev mode
                                    window.open('https://t.me/saqtapp_bot', '_blank');
                                }
                            }}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl flex items-center justify-between shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">💬</span>
                                <span className="font-semibold">{t('profile.contactManager')}</span>
                            </div>
                            <span className="text-white/90">›</span>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/merchant')}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-xl flex items-center justify-between mt-6 shadow-md"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🏪</span>
                            <div className="text-left">
                                <div className="font-bold">Merchant Dashboard</div>
                                <div className="text-xs opacity-80">Manage your store</div>
                            </div>
                        </div>
                        <span className="text-white text-sm font-medium">Open ›</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;
