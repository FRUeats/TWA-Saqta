// Internationalization (i18n) translations
// Supported languages: English, Russian, Kyrgyz

export type Language = 'en' | 'ru' | 'ky';

export const languages = {
    en: { name: 'English', flag: '🇬🇧' },
    ru: { name: 'Русский', flag: '🇷🇺' },
    ky: { name: 'Кыргызча', flag: '🇰🇬' },
};

export const translations = {
    en: {
        // Onboarding
        onboarding: {
            welcome: 'Welcome to Saqta!',
            subtitle: 'Save food, save money',
            language: 'Choose your language',
            howItWorks: 'How it works',
            step1: 'Browse surprise bags from local stores',
            step2: 'Buy at discounted prices',
            step3: 'Pick up and enjoy!',
            permissions: 'Permissions',
            permissionText: 'We need access to your Telegram data to create your account',
            getStarted: 'Get Started',
            next: 'Next',
            skip: 'Skip',
        },
        // Home
        home: {
            title: 'Saqta',
            greeting: 'Hi',
            allOffers: 'All Offers',
            nearby: 'Nearby',
            lowPrice: 'Low Price',
        },
        // Profile
        profile: {
            profile: 'Profile',
            language: 'Language',
            orderHistory: 'Order History',
            support: 'Support',
            becomePartner: 'Become a Partner',
            merchantDashboard: 'Merchant Dashboard',
            moneySaved: 'Money Saved',
            bagsSaved: 'Bags Saved',
        },
        // Cart & Checkout
        cart: {
            cart: 'Cart',
            empty: 'Your cart is empty',
            total: 'Total',
            checkout: 'Checkout',
        },
        checkout: {
            confirm: 'Confirm Your Order',
            placeOrder: 'Place Order & Get QR Code',
            orderConfirmed: 'Order Confirmed!',
            showQR: 'Show this QR code to the merchant at pickup',
            pickupInstructions: 'Pickup Instructions',
        },
    },

    ru: {
        onboarding: {
            welcome: 'Добро пожаловать в Saqta!',
            subtitle: 'Спасай еду, экономь деньги',
            language: 'Выберите язык',
            howItWorks: 'Как это работает',
            step1: 'Находи боксы-сюрпризы от местных магазинов',
            step2: 'Покупай со скидкой',
            step3: 'Забирай и наслаждайся!',
            permissions: 'Разрешения',
            permissionText: 'Нам нужен доступ к вашим данным Telegram для создания аккаунта',
            getStarted: 'Начать',
            next: 'Далее',
            skip: 'Пропустить',
        },
        home: {
            title: 'Saqta',
            greeting: 'Привет',
            allOffers: 'Все предложения',
            nearby: 'Рядом',
            lowPrice: 'Низкая цена',
        },
        profile: {
            profile: 'Профиль',
            language: 'Язык',
            orderHistory: 'История заказов',
            support: 'Поддержка',
            becomePartner: 'Стать партнёром',
            merchantDashboard: 'Панель продавца',
            moneySaved: 'Сэкономлено',
            bagsSaved: 'Спасено боксов',
        },
        cart: {
            cart: 'Корзина',
            empty: 'Корзина пуста',
            total: 'Итого',
            checkout: 'Оформить',
        },
        checkout: {
            confirm: 'Подтвердите заказ',
            placeOrder: 'Оформить и получить QR',
            orderConfirmed: 'Заказ подтверждён!',
            showQR: 'Покажите этот QR код продавцу при получении',
            pickupInstructions: 'Инструкция по получению',
        },
    },

    ky: {
        onboarding: {
            welcome: 'Saqta\'га кош келиңиз!',
            subtitle: 'Тамак-ашты сактаңыз, акча үнөмдөңүз',
            language: 'Тилди тандаңыз',
            howItWorks: 'Кантип иштейт',
            step1: 'Жергиликтүү дүкөндөрдөн сюрприз-баксыларды табыңыз',
            step2: 'Арзан баада сатып алыңыз',
            step3: 'Алып, ырахат алыңыз!',
            permissions: 'Уруксаттар',
            permissionText: 'Аккаунтуңузду түзүү үчүн Telegram маалыматыңызга кирүү керек',
            getStarted: 'Баштоо',
            next: 'Кийинки',
            skip: 'Өткөрүп жиберүү',
        },
        home: {
            title: 'Saqta',
            greeting: 'Салам',
            allOffers: 'Бардык сунуштар',
            nearby: 'Жакынкы',
            lowPrice: 'Арзан баа',
        },
        profile: {
            profile: 'Профиль',
            language: 'Тил',
            orderHistory: 'Буйрутмалар тарыхы',
            support: 'Колдоо',
            becomePartner: 'Өнөктөш болуу',
            merchantDashboard: 'Сатуучу панели',
            moneySaved: 'Үнөмдөлдү',
            bagsSaved: 'Сакталган баксылар',
        },
        cart: {
            cart: 'Себет',
            empty: 'Себетиңиз бош',
            total: 'Жалпы',
            checkout: 'Төлөө',
        },
        checkout: {
            confirm: 'Буйрутманы ырастаңыз',
            placeOrder: 'Буйрутма берүү жана QR алуу',
            orderConfirmed: 'Буйрутма ырасталды!',
            showQR: 'Бул QR кодду сатуучуга көрсөтүңүз',
            pickupInstructions: 'Алуу боюнча нускамалар',
        },
    },
};

export const getTranslation = (lang: Language, key: string): string => {
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
};
