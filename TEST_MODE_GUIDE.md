# Saqta TWA - Test Mode Guide

## 🧪 Current Features (Test Mode)

### For Users (Buyers):
1. **Browse Offers** - View all available surprise bags
2. **Add to Cart** - Click on an offer, add to cart
3. **Checkout** - Place order and get QR code **instantly**
4. **Show QR** - Show QR code to merchant at pickup
5. **Payment** - Pay at pickup (no prepayment needed)
6. **Map View** - See all stores on OpenStreetMap
7. **Profile** - View stats, order history

### For Vendors (Merchants):
1. **Dashboard** - View stats and active offers
2. **Create Offers** - Simple form with geocoding
3. **Store Settings** - Add location with auto-geocoding
4. **Scan QR** - Validate customer orders
5. **Orders** - View incoming orders

---

## 🔄 User Flow (Test Mode)

```
Browse Offers → Add to Cart → Checkout → Get QR Code → Pickup & Pay
```

### Detailed Steps:

1. **Customer opens app**
   - Sees list of offers from nearby stores
   - Can filter by location, price
   - Can view stores on map

2. **Customer selects an offer**
   - Sees details: price, pickup time, description
   - Clicks "Add to Cart"

3. **Customer goes to checkout**
   - Reviews order
   - Clicks "Place Order & Get QR Code"
   - **No payment needed!**

4. **Customer receives QR code**
   - Order ID generated
   - QR code shown immediately
   - Can view in "My Orders"

5. **Customer picks up**
   - Arrives at store during pickup window
   - Shows QR code to merchant
   - **Pays at pickup**
   - Receives food

6. **Merchant scans QR**
   - Opens "Scan QR" in dashboard
   - Scans customer's QR code
   - Marks order as completed

---

## 🗺️ Map Feature

**What it does:**
- Shows all vendors on OpenStreetMap
- Users can see nearby stores
- Click on marker → view store details

**For Vendors:**
- Go to Dashboard → Store Settings
- Enter address (e.g. "Chuy Ave 123, Bishkek")
- Click "Verify Address"
- System finds coordinates automatically (Nominatim geocoding)
- Save → store appears on map!

---

## 💡 Why Test Mode?

**Benefits:**
1. ✅ No payment gateway setup needed
2. ✅ Users can test the full flow
3. ✅ Reduces friction for initial testing
4. ✅ Easy to understand
5. ✅ Works offline (mock data)

**What happens in Test Mode:**
- Orders created immediately
- QR codes generated instantly
- Payment happens at pickup
- All data is mock (unless DB connected)

---

## 🚀 Ready for Production?

When ready to go live, you'll need to:

1. **Add real payment gateway** (integrated earlier but disabled for testing)
   - Options: MBank, Optima24, O!Dengi
   - Deep linking to bank apps
   - Webhooks for payment confirmation

2. **Connect to real database**
   - PostgreSQL on Render (already set up)
   - Remove mock data fallback
   - Enable Prisma queries

3. **Add moderation**
   - Vendor verification flow
   - Admin panel for approvals
   - Content moderation

4. **Performance optimization**
   - Enable caching
   - CDN for images
   - Database indexing

---

## 📱 Testing the App

### Local Testing:
```bash
# Frontend
npm run dev

# Backend
cd server
npm run dev
```

### Production Testing:
1. Open Telegram
2. Find your bot
3. Click Menu button
4. App loads from Vercel

### What to Test:

**User Flow:**
- [ ] Browse offers
- [ ] Add to cart (check cart icon shows count)
- [ ] View cart
- [ ] Go to checkout
- [ ] Place order
- [ ] QR code appears
- [ ] View in "My Orders"
- [ ] Check map shows stores

**Vendor Flow:**
- [ ] Switch to merchant role
- [ ] Create new offer
- [ ] View dashboard stats
- [ ] Update store settings
- [ ] Add location on map
- [ ] Scan QR code (use test QR)

---

## 🐛 Known Limitations (Test Mode)

1. **Cold Start Delay**
   - Render free tier sleeps after 15 min
   - First load can be slow (15-30 sec)
   - Solution: Use UptimeRobot or upgrade plan

2. **Mock Data**
   - Data resets on server restart
   - Orders not persisted (unless DB connected)
   - For testing only

3. **No Real Payments**
   - Payment happens at pickup
   - No online payment verification
   - To be added later

4. **Single Payment Method**
   - Cash only in test mode
   - Bank integrations disabled temporarily

---

## 🎯 Next Steps

1. **Test with users** - Get feedback on UX
2. **Collect analytics** - See what works/doesn't
3. **Fix bugs** - Based on user reports
4. **Add features** - Based on demand
5. **Integrate payments** - When ready for production

---

## 📞 Support

**Deployment Issues:**
- See `DEPLOYMENT_GUIDE.md`

**Feature Questions:**
- Check `README.md`

**Map Issues:**
- See `MAP_INFO.md`

**Everything else:**
- Create GitHub issue
- Contact @FRUeats

---

**Current Version:** Test Mode v1.0 (January 2026)
**Status:** ✅ Ready for user testing
**Payment:** 💵 At pickup only
