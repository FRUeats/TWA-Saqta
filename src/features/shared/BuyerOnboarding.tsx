/**
 * Buyer Onboarding - First-time guide for new users
 * 
 * Shows how to use the app, find deals, and make orders
 */

import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import Button from '../../components/Button';

const BuyerOnboarding = () => {
    const navigate = useNavigate();
    const { hapticFeedback, user } = useTelegram();

    const handleGetStarted = () => {
        hapticFeedback('medium');
        // Mark onboarding as completed (you can use localStorage or API)
        localStorage.setItem('buyer-onboarding-completed', 'true');
        navigate('/');
    };

    const handleSkip = () => {
        hapticFeedback('light');
        localStorage.setItem('buyer-onboarding-completed', 'true');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-tg-bg flex flex-col items-center justify-center p-6">
            {/* Welcome Section */}
            <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-5xl shadow-xl mb-6 transform -rotate-3">
                    🍱
                </div>
                
                <h1 className="text-3xl font-bold text-tg-text mb-2">
                    Добро пожаловать в Saqta!
                </h1>
                <p className="text-tg-hint leading-relaxed max-w-sm">
                    Привет, {user?.first_name}! 👋<br />
                    Мы поможем вам найти вкусные сюрпризы со скидкой
                </p>
            </div>

            {/* Steps */}
            <div className="bg-tg-secondary p-6 rounded-xl w-full max-w-sm mb-6 text-left shadow-sm border border-tg-hint/10 space-y-5">
                <h3 className="font-semibold text-tg-text mb-4 text-center">Как это работает:</h3>

                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-tg-button/20 rounded-full flex items-center justify-center text-lg font-bold text-tg-button">
                        1
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-tg-text text-sm mb-1">Найдите предложения</h4>
                        <p className="text-xs text-tg-hint leading-relaxed">
                            Просматривайте доступные сюрприз-боксы от местных ресторанов и кафе
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-tg-button/20 rounded-full flex items-center justify-center text-lg font-bold text-tg-button">
                        2
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-tg-text text-sm mb-1">Забронируйте и оплатите</h4>
                        <p className="text-xs text-tg-hint leading-relaxed">
                            Выберите понравившееся предложение и забронируйте его. Оплата при получении
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-tg-button/20 rounded-full flex items-center justify-center text-lg font-bold text-tg-button">
                        3
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-tg-text text-sm mb-1">Заберите заказ</h4>
                        <p className="text-xs text-tg-hint leading-relaxed">
                            Приходите в указанное время и покажите QR-код для получения заказа
                        </p>
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 w-full max-w-sm mb-6 text-left border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-sm text-green-900 dark:text-green-200 mb-3 flex items-center gap-2">
                    <span>✨</span> Преимущества
                </h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-2">
                    <li className="flex items-start gap-2">
                        <span>💰</span>
                        <span>Экономия до 50% на качественной еде</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span>🌍</span>
                        <span>Помогаем бороться с пищевыми отходами</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span>📍</span>
                        <span>Находите предложения рядом с вами</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span>🎁</span>
                        <span>Сюрприз-боксы с разнообразной едой</span>
                    </li>
                </ul>
            </div>

            {/* CTA Buttons */}
            <div className="w-full max-w-sm space-y-3">
                <Button size="lg" onClick={handleGetStarted} className="w-full">
                    Начать покупки
                </Button>
                <button
                    onClick={handleSkip}
                    className="w-full text-sm text-tg-hint hover:text-tg-text transition-colors"
                >
                    Пропустить
                </button>
            </div>

            <p className="text-xs text-tg-hint mt-4 text-center">
                Вы всегда можете вернуться к этому руководству в профиле
            </p>
        </div>
    );
};

export default BuyerOnboarding;
