# 🚀 Гайд по деплою Saqta на Render + Vercel

## ⚡️ Почему приложение долго грузится?

**Причины:**
1. **Cold Start на Render** - бесплатный план Render усыпляет сервер после 15 минут неактивности
2. **Database Connection** - подключение к PostgreSQL может занимать время
3. **Vercel Cold Start** - первый запрос может быть медленным

**Решения:**
- ✅ Использовать Mock данные (уже реализовано)
- ✅ Оптимизировать bundle size
- ⏳ Upgrade на платный план Render (нет cold starts)

---

## 📦 Текущая архитектура

```
Frontend (Vercel)         Backend (Render)          Database (Render)
    ↓                           ↓                         ↓
React/Vite               Node.js/Express            PostgreSQL
   |                            |                         |
   |------------------------→ API ←-----------------------|
        VITE_API_URL        (mock fallback)
```

---

## 🔧 Шаг 1: Деплой Backend на Render

### 1.1 Создайте Web Service

1. Зайдите на [render.com](https://render.com)
2. **New** → **Web Service**
3. Подключите GitHub репозиторий `FRUeats/TWA-Saqta`

### 1.2 Настройте Build Settings

```yaml
Name: saqta-backend
Environment: Node
Root Directory: server
Build Command: npm install && npm run build
Start Command: npm start
```

### 1.3 Environment Variables

Добавьте в Render Dashboard:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=<your_postgres_url>  # Необязательно, работает и без БД
TELEGRAM_BOT_TOKEN=<your_bot_token>
FRONTEND_URL=https://your-app.vercel.app
```

### 1.4 Получите URL backend

После деплоя вы получите URL типа:
```
https://saqta-backend.onrender.com
```

**Сохраните его!** Он понадобится для Vercel.

---

## 🌐 Шаг 2: Деплой Frontend на Vercel

### 2.1 Подключите репозиторий

1. Зайдите на [vercel.com](https://vercel.com)
2. **Add New** → **Project**
3. Import `FRUeats/TWA-Saqta`

### 2.2 Project Settings

```yaml
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.3 Environment Variables

Добавьте в Vercel Dashboard:

```env
VITE_API_URL=https://saqta-backend.onrender.com/api
```

⚠️ **Важно:** `VITE_` префикс обязателен!

### 2.4 Deploy

Нажмите **Deploy** и получите URL:
```
https://saqta-twa.vercel.app
```

---

## 🔗 Шаг 3: Свяжите Frontend и Backend

### 3.1 Обновите CORS на Backend

В `server/src/index.ts`:
```typescript
app.use(cors({
    origin: 'https://saqta-twa.vercel.app',  // Ваш Vercel URL
    credentials: true
}));
```

### 3.2 Обновите FRONTEND_URL в Render

В Render Dashboard → Environment Variables:
```
FRONTEND_URL=https://saqta-twa.vercel.app
```

### 3.3 Redeploy

- Render: автоматически задеплоится при push в GitHub
- Vercel: тоже автоматически

---

## 🤖 Шаг 4: Настройте Telegram Bot

### 4.1 Обновите Web App URL

Через BotFather:
```
/mybots → Выберите бота → Bot Settings → Menu Button
→ Edit menu button URL
```

Вставьте:
```
https://saqta-twa.vercel.app
```

### 4.2 Проверьте работу

Откройте бота в Telegram и нажмите кнопку меню внизу.

---

## ⚡ Оптимизация производительности

### Option 1: Быстрый старт (Mock данные)

**Плюсы:**
- ✅ Мгновенная загрузка
- ✅ Работает без БД
- ✅ Бесплатно

**Недостатки:**
- ⚠️ Данные не сохраняются

**Как включить:**
Уже включено по умолчанию! Если БД недоступна, сервер использует mock данные.

### Option 2: Платный план Render ($7/мес)

**Плюсы:**
- ✅ Нет cold starts
- ✅ Always online
- ✅ Faster response

**Как обновить:**
Render Dashboard → Upgrade Plan → Starter ($7/month)

### Option 3: Keep-Alive Service (бесплатно)

Создайте cron job, который пингует ваш сервер каждые 10 минут:

**UptimeRobot** (бесплатно):
1. Зарегистрируйтесь на [uptimerobot.com](https://uptimerobot.com)
2. Add Monitor → HTTP(s)
3. URL: `https://saqta-backend.onrender.com/health`
4. Monitoring Interval: 5 minutes

---

## 🐛 Troubleshooting

### Ошибка: "Cannot connect to backend"

**Проверьте:**
```bash
# 1. Backend работает?
curl https://saqta-backend.onrender.com/health

# 2. VITE_API_URL правильный?
# В Vercel: Settings → Environment Variables

# 3. CORS настроен?
# В server/src/index.ts
```

### Ошибка: "Module not found"

**Решение:**
Добавьте `.js` к импортам в TypeScript файлах:
```typescript
// ❌ Неправильно
import { mockStores } from '../mock/mockData';

// ✅ Правильно
import { mockStores } from '../mock/mockData.js';
```

### Slow Loading (15-30 секунд)

**Это Cold Start на Render.**

**Временное решение:**
- Используйте UptimeRobot (см. выше)

**Постоянное решение:**
- Upgrade на Render Starter ($7/мес)

---

## 📊 Мониторинг

### Render Logs

```
Dashboard → Your Service → Logs
```

### Vercel Logs

```
Project → Deployments → View Function Logs
```

### Health Check

```bash
# Backend
curl https://saqta-backend.onrender.com/health

# Stores
curl https://saqta-backend.onrender.com/api/stores

# Offers
curl https://saqta-backend.onrender.com/api/offers
```

---

## 🔄 Обновление кода

### Auto-deploy включен по умолчанию

```bash
# Локально
git add .
git commit -m "your changes"
git push

# Render и Vercel автоматически задеплоят
```

### Manual Deploy

**Render:**
- Dashboard → Manual Deploy → Deploy latest commit

**Vercel:**
- Project → Deployments → Redeploy

---

## 💡 Рекомендации

### Для разработки:
✅ Используйте mock данные (быстро)

### Для production:
1. ✅ Настройте PostgreSQL на Render
2. ✅ Используйте UptimeRobot для keep-alive
3. ⏳ Рассмотрите платный план при росте пользователей

### Для максимальной скорости:
- Vercel Pro ($20/мес) - улучшенный edge network
- Render Starter ($7/мес) - no cold starts
- Cloudflare CDN - бесплатный кэш статики

---

## 📞 Поддержка

Если что-то не работает:

1. Проверьте логи в Render/Vercel
2. Проверьте Environment Variables
3. Убедитесь что CORS настроен
4. Проверьте /health endpoint

**Успехов с деплоем! 🚀**
