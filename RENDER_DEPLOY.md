# 🚀 Деплой Backend на Render

## Быстрая инструкция для Render (вместо Railway)

### 1. Создание сервиса на Render

1. Зайдите на https://render.com
2. Войдите через GitHub
3. Нажмите "New" → "Web Service"
4. Подключите репозиторий `TWA-Saqta`

### 2. Настройка Build & Deploy

**Build Command:**
```bash
cd server && npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
cd server && npx prisma migrate deploy && node dist/index.js
```

**Root Directory:**
```
server
```

### 3. Переменные окружения

Добавьте в Render Dashboard → Environment:

```env
DATABASE_URL=postgresql://... (из PostgreSQL сервиса)
PORT=3001
NODE_ENV=production
TELEGRAM_BOT_TOKEN=ваш_токен_бота
ALLOWED_ORIGINS=https://ваш-проект.vercel.app
```

### 4. PostgreSQL Database

1. В Render Dashboard → "New" → "PostgreSQL"
2. Создайте базу данных
3. Скопируйте `Internal Database URL`
4. Используйте его как `DATABASE_URL`

### 5. Автоматический деплой

Render автоматически деплоит при каждом push в `main` branch.

---

## 🔄 Обновление после изменений

После того как вы запушили код в GitHub:

1. Render автоматически обнаружит изменения
2. Начнется процесс сборки
3. Деплой произойдет автоматически

**Или вручную:**
- Render Dashboard → Manual Deploy → Deploy latest commit

---

## ✅ Проверка после деплоя

1. Health check: `GET https://ваш-сервис.onrender.com/health`
2. Проверьте логи в Render Dashboard
3. Убедитесь, что CORS настроен правильно (`ALLOWED_ORIGINS`)
