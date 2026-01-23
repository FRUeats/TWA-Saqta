/**
 * Vendor Onboarding - First-time setup guide for new vendors
 * 
 * Shows step-by-step instructions to set up their store
 */

import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import Button from '../../components/Button';

const VendorOnboarding = () => {
    const navigate = useNavigate();
    const { hapticFeedback, user } = useTelegram();

    const handleStart = () => {
        hapticFeedback('medium');
        navigate('/merchant/settings');
    };

    return (
        <div className="min-h-screen bg-tg-bg flex flex-col items-center justify-center p-6 text-center">

            {/* Welcome Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-5xl shadow-xl mb-6 transform rotate-3">
                🏪
            </div>

            {/* Greeting */}
            <h1 className="text-2xl font-bold text-tg-text mb-2">
                Добро пожаловать, {user?.first_name}!
            </h1>
            <p className="text-tg-hint mb-8 leading-relaxed max-w-sm">
                Вы успешно подключены как вендор. Давайте настроим ваш магазин!
            </p>

            {/* Steps */}
            <div className="bg-tg-secondary p-5 rounded-xl w-full max-w-sm mb-6 text-left shadow-sm border border-tg-hint/10 space-y-4">
                <h3 className="font-semibold text-tg-text mb-3">Что нужно сделать:</h3>

                <div className="flex gap-3">
                    <span className="text-2xl">1️⃣</span>
                    <div>
                        <h4 className="font-semibold text-tg-text text-sm">Настроить магазин</h4>
                        <p className="text-xs text-tg-hint">Укажите адрес и контакты вашего заведения</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <span className="text-2xl">2️⃣</span>
                    <div>
                        <h4 className="font-semibold text-tg-text text-sm">Верифицировать адрес</h4>
                        <p className="text-xs text-tg-hint">Система найдет ваш магазин на карте</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <span className="text-2xl">3️⃣</span>
                    <div>
                        <h4 className="font-semibold text-tg-text text-sm">Создать первый оффер</h4>
                        <p className="text-xs text-tg-hint">Добавьте предложение для покупателей</p>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 w-full max-w-sm mb-6 text-left">
                <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-200 mb-2">
                    ℹ️ Важно знать
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• У каждого вендора может быть только одна точка</li>
                    <li>• Все заказы будут привязаны к вашему магазину</li>
                    <li>• Покупатели смогут найти вас на карте</li>
                    <li>• Вы сможете изменить данные позже</li>
                </ul>
            </div>

            {/* CTA */}
            <Button size="lg" onClick={handleStart}>
                Настроить магазин
            </Button>

            <p className="text-xs text-tg-hint mt-4">
                Это займет всего 2-3 минуты
            </p>
        </div>
    );
};

export default VendorOnboarding;
