/**
 * Onboarding - Welcome flow for new users
 * 
 * Shows: Language selection, How it works, Permissions
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useLanguageStore } from '../../store/languageStore';
import { languages, Language, translations } from '../../utils/i18n';
import Button from '../../components/Button';

const Onboarding = () => {
    const navigate = useNavigate();
    const { user, hapticFeedback } = useTelegram();
    const { language, setLanguage, completeOnboarding } = useLanguageStore();

    const [currentSlide, setCurrentSlide] = useState(0);
    const t = translations[language].onboarding;

    const slides = [
        // Slide 1: Welcome & Language
        {
            title: t.welcome,
            subtitle: t.subtitle,
            emoji: '🌍',
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-tg-text text-center mb-4">
                        {t.language}
                    </h3>
                    <div className="space-y-3">
                        {(Object.keys(languages) as Language[]).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    hapticFeedback('light');
                                    setLanguage(lang);
                                }}
                                className={`w-full p-4 rounded-xl border-2 transition-all ${language === lang
                                        ? 'border-tg-button bg-tg-button/10'
                                        : 'border-tg-hint/20 bg-tg-secondary'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{languages[lang].flag}</span>
                                    <span className="font-semibold text-tg-text">
                                        {languages[lang].name}
                                    </span>
                                    {language === lang && <span className="ml-auto text-tg-button">✓</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ),
        },

        // Slide 2: How it works
        {
            title: t.howItWorks,
            subtitle: '',
            emoji: '📱',
            content: (
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="text-4xl">1️⃣</div>
                        <div>
                            <h4 className="font-semibold text-tg-text mb-1">{t.step1Title}</h4>
                            <p className="text-sm text-tg-hint mb-2">{t.step1Description}</p>
                            <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-5xl">🛍️</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-4xl">2️⃣</div>
                        <div>
                            <h4 className="font-semibold text-tg-text mb-1">{t.step2Title}</h4>
                            <p className="text-sm text-tg-hint mb-2">{t.step2Description}</p>
                            <div className="w-full h-32 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-5xl">💰</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-4xl">3️⃣</div>
                        <div>
                            <h4 className="font-semibold text-tg-text mb-1">{t.step3Title}</h4>
                            <p className="text-sm text-tg-hint mb-2">{t.step3Description}</p>
                            <div className="w-full h-32 bg-gradient-to-br from-yellow-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-5xl">🎉</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        // Slide 3: Permissions
        {
            title: t.permissions,
            subtitle: t.permissionText,
            emoji: '🔐',
            content: (
                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">👤</span>
                            <div>
                                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                                    Telegram Profile
                                </h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Name and username for personalization
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📞</span>
                            <div>
                                <h4 className="font-semibold text-green-900 dark:text-green-200 mb-1">
                                    Phone Number (Optional)
                                </h4>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    For order confirmations and support
                                </p>
                            </div>
                        </div>
                    </div>

                    {user && (
                        <div className="bg-tg-secondary p-4 rounded-xl">
                            <h4 className="text-sm font-medium text-tg-hint mb-2">Your Info:</h4>
                            <p className="text-tg-text font-medium">{user.first_name} {user.last_name}</p>
                            {user.username && (
                                <p className="text-tg-hint text-sm">@{user.username}</p>
                            )}
                        </div>
                    )}
                </div>
            ),
        },
    ];

    const currentSlideData = slides[currentSlide];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            hapticFeedback('light');
            setCurrentSlide(currentSlide + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        hapticFeedback('success');
        completeOnboarding();
        navigate('/');
    };

    const handleSkip = () => {
        hapticFeedback('light');
        handleComplete();
    };

    return (
        <div className="min-h-screen bg-tg-bg flex flex-col">
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
                {/* Slide indicators */}
                <div className="flex gap-2">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all ${index === currentSlide
                                    ? 'w-8 bg-tg-button'
                                    : 'w-2 bg-tg-hint/30'
                                }`}
                        />
                    ))}
                </div>

                {/* Skip button */}
                {currentSlide < slides.length - 1 && (
                    <button
                        onClick={handleSkip}
                        className="text-tg-hint hover:text-tg-text transition-colors text-sm font-medium"
                    >
                        {t.skip}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
                <div className="w-full max-w-md">
                    {/* Emoji */}
                    <div className="text-8xl text-center mb-6">
                        {currentSlideData.emoji}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-tg-text text-center mb-2">
                        {currentSlideData.title}
                    </h1>

                    {/* Subtitle */}
                    {currentSlideData.subtitle && (
                        <p className="text-tg-hint text-center mb-8">
                            {currentSlideData.subtitle}
                        </p>
                    )}

                    {/* Slide content */}
                    <div className="mb-8">
                        {currentSlideData.content}
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-tg-bg border-t border-tg-hint/20 p-4">
                <Button
                    fullWidth
                    size="lg"
                    onClick={handleNext}
                >
                    {currentSlide === slides.length - 1 ? t.getStarted : t.next}
                </Button>
            </div>
        </div>
    );
};

export default Onboarding;
