# Deployment Guide

## 🚀 Quick Deploy to Production

Follow these steps to deploy Saqta MVP to production.

---

## Prerequisites

✅ GitHub account
✅ Code pushed to GitHub repository
✅ Telegram bot token from BotFather

---

## Step 1: Deploy Backend (Railway) - 5 minutes

### 1.1 Create Account
1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `TWA-Saqta` repository
4. Railway will start deploying

### 1.3 Add PostgreSQL Database
1. In your project, click "New"
2. Select "Database" → "PostgreSQL"
3. Wait for provision (~30 seconds)

### 1.4 Configure Backend Service
1. Click on your web service
2. Go to "Settings"
3. Set "Root Directory" to `server`
4. Go to "Variables" tab
5. Add environment variables:

```
DATABASE_URL (copy from PostgreSQL service)
NODE_ENV=production
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
FRONTEND_URL=https://your-app.vercel.app (добавим позже)
PORT=3001
```

6. Click "Deploy" (if not auto-deployed)

### 1.5 Get Backend URL
1. Go to "Settings" → "Networking"
2. Click "Generate Domain"
3. Copy URL (e.g., `https://saqta-api.up.railway.app`)
4. Save it for later ✅

---

## Step 2: Deploy Frontend (Vercel) - 3 minutes

### 2.1 Create Account
1. Go to https://vercel.com
2. Click "Sign Up" → Continue with GitHub
3. Authorize Vercel

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Click "Import" next to `TWA-Saqta`
3. Configure build settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 2.3 Add Environment Variable
1. Expand "Environment Variables"
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend.up.railway.app/api` (Railway URL from Step 1.5)
3. Click "Deploy"

### 2.4 Get Frontend URL
1. Wait for deployment (~2 minutes)
2. Click on your deployment
3. Copy Production URL (e.g., `https://twa-saqta.vercel.app`)
4. Save it ✅

---

## Step 3: Update Backend with Frontend URL - 1 minute

### 3.1 Add Frontend URL to Railway
1. Go back to Railway
2. Open your backend service
3. Go to "Variables"
4. Update `FRONTEND_URL` to your Vercel URL
5. Service will redeploy automatically

---

## Step 4: Update Telegram Bot - 2 minutes

### 4.1 Update BotFather
1. Open [@BotFather](https://t.me/BotFather) in Telegram
2. Send `/deleteapp` → Select your bot → Delete old app
3. Send `/newapp` → Select your bot
4. Fill in:
   - **Title:** Saqta
   - **Description:** Food surplus marketplace
   - **Photo:** `/empty`
   - **Demo GIF:** `/empty`
   - **Web App URL:** `https://your-app.vercel.app` (Vercel URL from Step 2.4)
   - **Short name:** `saqta`

### 4.2 Get Bot Link
BotFather will give you a link like:
```
https://t.me/your_bot/saqta
```

Save this link! ✅

---

## Step 5: Test! 🎉

### 5.1 Open in Telegram
1. Click the link from BotFather
2. WebApp should load from Vercel
3. Test buyer flow:
   - View offers
   - Add to cart
   - Create order
   - See QR code

### 5.2 Test Merchant Panel
1. Navigate to `/merchant`
2. Create quick offer
3. View orders

---

## ✅ Checklist

- [ ] Railway account created
- [ ] PostgreSQL database added
- [ ] Backend deployed to Railway
- [ ] Backend URL copied
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL copied
- [ ] Environment variables set
- [ ] BotFather updated with new URL
- [ ] App tested in Telegram

---

## 🐛 Troubleshooting

### Frontend doesn't load
- Check Vercel deployment logs
- Verify build succeeded
- Check `VITE_API_URL` is set correctly

### Backend API errors
- Check Railway logs
- Verify `DATABASE_URL` is set
- Run migrations: `railway run npx prisma migrate deploy`

### CORS errors
- Verify `FRONTEND_URL` in Railway matches Vercel URL exactly
- Restart backend service

### Database not connecting
- Check `DATABASE_URL` in Railway variables
- Make sure PostgreSQL service is running

---

## 🎯 You're Live!

Congratulations! 🎉 Your Saqta MVP is now live on production!

**Links:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.up.railway.app`
- Telegram Bot: `https://t.me/your_bot/saqta`

---

## 📊 Monitoring

### Check Logs

**Vercel:**
Dashboard → Project → Deployments → View Function Logs

**Railway:**
Dashboard → Service → Deployments → View Logs

### Database

**Railway:**
Dashboard → PostgreSQL → Data → Query database

---

## 🔄 Deploy Updates

### Frontend
```bash
git add .
git commit -m "Update frontend"
git push
```
Vercel auto-deploys! ✅

### Backend
```bash
git add .
git commit -m "Update backend"
git push
```
Railway auto-deploys! ✅

### Database Migrations
```bash
# Update schema in server/prisma/schema.prisma
# Then:
railway run npx prisma migrate deploy
```

---

**Need help?** Check [deployment-plan.md](file:///Users/aidin/.gemini/antigravity/brain/747c9b42-443a-4b00-aae3-f5ebe94cf3ac/deployment-plan.md) for detailed explanation.
