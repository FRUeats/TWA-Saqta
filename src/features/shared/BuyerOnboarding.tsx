/**
 * Buyer Onboarding - Slider-based onboarding for new users
 * 
 * Shows process: Choose - Reserve - Pick up
 * Includes language selection and permissions request
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useLanguageStore } from '../../store/languageStore';
import { getTranslation, Language, languages } from '../../utils/i18n';
import Button from '../../components/Button';

const BuyerOnboarding = () => {
    const navigate = useNavigate();
    const { hapticFeedback, user, tg } = useTelegram();
    const { language, setLanguage, completeOnboarding } = useLanguageStore();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [phoneGranted, setPhoneGranted] = useState(false);
    const [usernameGranted, setUsernameGranted] = useState(false);

    const t = (key: string) => getTranslation(language, key);

    // Slides configuration
    const slides = [
        // Slide 0: Language Selection
        {
            type: 'language' as const,
            emoji: '🌍',
            title: t('onboarding.language'),
            subtitle: t('onboarding.languageSubtitle'),
        },
        // Slide 1: Welcome
        {
            type: 'welcome' as const,
            emoji: '🍱',
            title: t('onboarding.welcome'),
            subtitle: t('onboarding.subtitle'),
        },
        // Slide 2: Step 1 - Choose
        {
            type: 'step' as const,
            emoji: '🔍',
            title: t('onboarding.step1Title'),
            subtitle: t('onboarding.step1Description'),
            stepNumber: 1,
        },
        // Slide 3: Step 2 - Reserve
        {
            type: 'step' as const,
            emoji: '🛒',
            title: t('onboarding.step2Title'),
            subtitle: t('onboarding.step2Description'),
            stepNumber: 2,
        },
        // Slide 4: Step 3 - Pick up
        {
            type: 'step' as const,
            emoji: '📦',
            title: t('onboarding.step3Title'),
            subtitle: t('onboarding.step3Description'),
            stepNumber: 3,
        },
        // Slide 5: Permissions
        {
            type: 'permissions' as const,
            emoji: '🔐',
            title: t('onboarding.permissions'),
            subtitle: t('onboarding.permissionText'),
        },
    ];

    const totalSlides = slides.length;
    const isLastSlide = currentSlide === totalSlides - 1;

    const handleNext = () => {
        if (isLastSlide) {
            handleComplete();
        } else {
            hapticFeedback('light');
            setCurrentSlide((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        hapticFeedback('light');
        setCurrentSlide((prev) => Math.max(0, prev - 1));
    };

    const handleLanguageSelect = (lang: Language) => {
        hapticFeedback('light');
        setLanguage(lang);
        setTimeout(() => {
            setCurrentSlide(1); // Move to welcome slide
        }, 300);
    };

    const handleRequestPhone = () => {
        if (!tg) {
            // In dev mode, just mark as granted
            setPhoneGranted(true);
            hapticFeedback('success');
            return;
        }

        // Request phone number using Telegram WebApp
        tg.showPopup(
            {
                title: t('onboarding.requestPhoneTitle'),
                message: t('onboarding.requestPhoneMessage'),
                buttons: [
                    {
                        id: 'grant',
                        type: 'default',
                        text: t('onboarding.grant'),
                    },
                    {
                        id: 'cancel',
                        type: 'cancel',
                        text: t('onboarding.cancel'),
                    },
                ],
            },
            (buttonId) => {
                if (buttonId === 'grant') {
                    // In real Telegram WebApp, phone is usually available in initData
                    // For now, we'll mark as granted
                    setPhoneGranted(true);
                    hapticFeedback('success');
                }
            }
        );
    };

    const handleRequestUsername = () => {
        if (!tg) {
            setUsernameGranted(true);
            hapticFeedback('success');
            return;
        }

        // Username is usually available in user object
        if (user?.username) {
            setUsernameGranted(true);
            hapticFeedback('success');
        } else {
            tg.showAlert(t('onboarding.usernameNotAvailable'));
        }
    };

    const handleComplete = () => {
        hapticFeedback('success');
        completeOnboarding();
        localStorage.setItem('buyer-onboarding-completed', 'true');
        navigate('/');
    };

    const handleSkip = () => {
        hapticFeedback('light');
        completeOnboarding();
        localStorage.setItem('buyer-onboarding-completed', 'true');
        navigate('/');
    };

    const currentSlideData = slides[currentSlide];

    return (
        <div className="min-h-screen bg-tg-bg flex flex-col">
            {/* Progress Bar */}
            <div className="h-1 bg-tg-hint/20 w-full">
                <div
                    className="h-full bg-tg-button transition-all duration-300"
                    style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                />
            </div>

            {/* Slide Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                {/* Language Selection Slide */}
                {currentSlideData.type === 'language' && (
                    <div className="w-full max-w-sm text-center">
                        <div className="text-6xl mb-6">{currentSlideData.emoji}</div>
                        <h1 className="text-2xl font-bold text-tg-text mb-2">
                            {currentSlideData.title}
                        </h1>
                        <p className="text-tg-hint mb-8">{currentSlideData.subtitle}</p>

                        <div className="space-y-3">
                            {Object.entries(languages).map(([code, lang]) => (
                                <button
                                    key={code}
                                    onClick={() => handleLanguageSelect(code as Language)}
                                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                                        language === code
                                            ? 'border-tg-button bg-tg-button/10'
                                            : 'border-tg-hint/20 bg-tg-secondary hover:border-tg-button/50'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-2xl">{lang.flag}</span>
                                        <span className="font-semibold text-tg-text">{lang.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Welcome Slide */}
                {currentSlideData.type === 'welcome' && (
                    <div className="w-full max-w-sm text-center">
                        <div className="text-6xl mb-6 transform -rotate-3">{currentSlideData.emoji}</div>
                        <h1 className="text-3xl font-bold text-tg-text mb-2">
                            {currentSlideData.title}
                        </h1>
                        <p className="text-tg-hint mb-8 whitespace-pre-line">
                            {currentSlideData.subtitle.replace('{name}', user?.first_name || '')}
                        </p>
                    </div>
                )}

                {/* Step Slides */}
                {currentSlideData.type === 'step' && (
                    <div className="w-full max-w-sm text-center">
                        <div className="relative mb-8">
                            <div className="text-6xl mb-4">{currentSlideData.emoji}</div>
                            <div className="absolute -top-2 -right-2 w-12 h-12 bg-tg-button/20 rounded-full flex items-center justify-center text-xl font-bold text-tg-button">
                                {currentSlideData.stepNumber}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-tg-text mb-3">
                            {currentSlideData.title}
                        </h2>
                        <p className="text-tg-hint leading-relaxed">
                            {currentSlideData.subtitle}
                        </p>
                    </div>
                )}

                {/* Permissions Slide */}
                {currentSlideData.type === 'permissions' && (
                    <div className="w-full max-w-sm">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">{currentSlideData.emoji}</div>
                            <h2 className="text-2xl font-bold text-tg-text mb-2">
                                {currentSlideData.title}
                            </h2>
                            <p className="text-tg-hint">{currentSlideData.subtitle}</p>
                        </div>

                        <div className="space-y-3">
                            {/* Phone Permission */}
                            <div
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    phoneGranted
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-tg-hint/20 bg-tg-secondary'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📞</span>
                                        <div className="text-left">
                                            <div className="font-semibold text-tg-text text-sm">
                                                {t('onboarding.phonePermission')}
                                            </div>
                                            <div className="text-xs text-tg-hint">
                                                {t('onboarding.phonePermissionDesc')}
                                            </div>
                                        </div>
                                    </div>
                                    {phoneGranted ? (
                                        <span className="text-green-500 text-xl">✓</span>
                                    ) : (
                                        <button
                                            onClick={handleRequestPhone}
                                            className="px-4 py-2 bg-tg-button text-white rounded-lg text-sm font-medium"
                                        >
                                            {t('onboarding.grant')}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Username Permission */}
                            <div
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    usernameGranted
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-tg-hint/20 bg-tg-secondary'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">👤</span>
                                        <div className="text-left">
                                            <div className="font-semibold text-tg-text text-sm">
                                                {t('onboarding.usernamePermission')}
                                            </div>
                                            <div className="text-xs text-tg-hint">
                                                {t('onboarding.usernamePermissionDesc')}
                                            </div>
                                        </div>
                                    </div>
                                    {usernameGranted ? (
                                        <span className="text-green-500 text-xl">✓</span>
                                    ) : (
                                        <button
                                            onClick={handleRequestUsername}
                                            className="px-4 py-2 bg-tg-button text-white rounded-lg text-sm font-medium"
                                        >
                                            {t('onboarding.grant')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="p-6 space-y-3">
                <div className="flex gap-3">
                    {currentSlide > 0 && (
                        <Button
                            onClick={handleBack}
                            variant="outline"
                            className="flex-1"
                        >
                            {t('onboarding.back')}
                        </Button>
                    )}
                    <Button
                        onClick={handleNext}
                        className={currentSlide === 0 ? 'w-full' : 'flex-1'}
                        size="lg"
                    >
                        {isLastSlide ? t('onboarding.goToHome') : t('onboarding.next')}
                    </Button>
                </div>

                {!isLastSlide && (
                    <button
                        onClick={handleSkip}
                        className="w-full text-sm text-tg-hint hover:text-tg-text transition-colors"
                    >
                        {t('onboarding.skip')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BuyerOnboarding;
