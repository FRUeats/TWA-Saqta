# Saqta - Food Surplus Marketplace for Kyrgyzstan

**Mission**: Connect local merchants with customers to sell surplus food at discounted prices, reducing food waste while providing affordable meals.

A Telegram WebApp (TWA) MVP built as an alternative to TooGoodToGo, tailored for the Kyrgyz market.

> 🇷🇺 **Русская документация**:
> - 📖 [Полная инструкция по запуску](./ЗАПУСК.md)
> - ⚡ [Быстрый старт через GitHub](./БЫСТРЫЙ_СТАРТ.md)
> - 🎯 [Сравнение вариантов запуска](./ВАРИАНТЫ_ЗАПУСКА.md)

---

## 🎯 Overview

Saqta enables restaurants, cafes, and food retailers to sell "Surprise Bags" (mystery boxes of surplus food) at significant discounts. Customers discover deals nearby, reserve bags, and pay on pickup using local payment methods or QR codes.

### Key Features
- 🍱 **For Buyers**: Browse nearby deals, view surprise bags on a map, reserve & pay, pick up with QR codes
- 🏪 **For Merchants**: Create and manage offers, scan customer QR codes for order validation
- 📱 **Telegram-Native**: Fully integrated with Telegram for authentication, theming, and UI components

---

## 🛠 Tech Stack

### Frontend
- **React** (Vite) - Fast, modern build tooling
- **Tailwind CSS** - Utility-first styling with Telegram theme integration
- **Headless UI** - Accessible, unstyled UI primitives
- **Zustand** - Lightweight state management
- **@twa-dev/sdk** - Telegram WebApp SDK integration
- **React Router** - Client-side routing

### Backend
- **Node.js** (Express) or **Next.js API Routes**
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Relational database for users, stores, and orders

### Payments & Features
- Local payment gateway integration (mocked for MVP)
- QR code generation for order validation
- Geolocation services for proximity-based search

---

## 📁 Project Architecture

```
/TWA-Saqta
├── /src
│   ├── /components          # Atomic UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── ...
│   │
│   ├── /features            # Business logic modules
│   │   ├── /buyer
│   │   │   ├── Home.tsx           # Browse offers
│   │   │   ├── Map.tsx            # Location-based view
│   │   │   └── Cart.tsx           # Shopping cart
│   │   │
│   │   ├── /merchant
│   │   │   ├── Dashboard.tsx      # Merchant panel
│   │   │   ├── CreateOffer.tsx    # Add new surprise bags
│   │   │   └── QRScanner.tsx      # Validate customer orders
│   │   │
│   │   └── /shared
│   │       ├── Auth.tsx           # Telegram auth flow
│   │       └── Profile.tsx        # User profile
│   │
│   ├── /hooks               # Custom React hooks
│   │   ├── useTelegram.ts         # Telegram SDK wrapper
│   │   ├── useLocation.ts         # Geolocation utilities
│   │   └── ...
│   │
│   ├── /store               # Zustand state stores
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── offersStore.ts
│   │
│   ├── /api                 # Backend API clients
│   │   ├── axios.config.ts
│   │   ├── auth.api.ts
│   │   ├── offers.api.ts
│   │   └── orders.api.ts
│   │
│   ├── App.tsx              # Main application with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles + Telegram theme vars
│
├── /server                  # Backend (if using standalone Express)
│   ├── /prisma
│   │   └── schema.prisma          # Database schema
│   │
│   ├── /controllers
│   │   ├── auth.controller.ts
│   │   ├── store.controller.ts
│   │   ├── offer.controller.ts
│   │   └── order.controller.ts
│   │
│   ├── /routes
│   │   └── index.ts
│   │
│   └── server.ts            # Express server
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🗄 Data Models

### User
```prisma
model User {
  id        String   @id // Telegram User ID
  firstName String
  lastName  String?
  username  String?
  role      Role     @default(BUYER)
  orders    Order[]
  createdAt DateTime @default(now())
}

enum Role {
  BUYER
  MERCHANT
  ADMIN
}
```

### Store
```prisma
model Store {
  id        String   @id @default(cuid())
  name      String
  address   String
  latitude  Float
  longitude Float
  image     String?
  merchantId String
  offers    Offer[]
  createdAt DateTime @default(now())
}
```

### Offer (Surprise Bag)
```prisma
model Offer {
  id          String   @id @default(cuid())
  storeId     String
  store       Store    @relation(fields: [storeId], references: [id])
  originalPrice Float
  discountedPrice Float
  quantity    Int
  pickupStart DateTime
  pickupEnd   DateTime
  orders      Order[]
  createdAt   DateTime @default(now())
}
```

### Order
```prisma
model Order {
  id        String      @id @default(cuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  offerId   String
  offer     Offer       @relation(fields: [offerId], references: [id])
  status    OrderStatus @default(PENDING)
  qrCode    String      @unique
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  PAID
  COMPLETED
  CANCELLED
}
```

---

## 🔧 Key Implementation Details

### 1. Telegram WebApp Initialization
```typescript
// On app load, validate Telegram user data
const initData = window.Telegram.WebApp.initData;
// Send to backend for validation and user creation/auth
```

### 2. Theme Synchronization
```css
/* index.css - Use Telegram CSS variables */
:root {
  --bg-color: var(--tg-theme-bg-color, #ffffff);
  --text-color: var(--tg-theme-text-color, #000000);
  --button-color: var(--tg-theme-button-color, #3390ec);
  /* ... */
}
```

### 3. MainButton Integration
```typescript
// Show Telegram's native MainButton during checkout
Telegram.WebApp.MainButton.setText('Complete Order');
Telegram.WebApp.MainButton.onClick(handleCheckout);
Telegram.WebApp.MainButton.show();
```

### 4. QR Code Scanning (Merchant)
```typescript
Telegram.WebApp.showScanQrPopup({
  text: 'Scan customer QR code to validate order'
}, (data) => {
  // Validate order on backend
  validateOrder(data);
});
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Telegram Bot Token (for WebApp configuration)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Backend Setup (if using Express)
```bash
cd server
npm install
npm run dev
```

---

## 📦 Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npx prisma studio` - Open Prisma database GUI
- `npx prisma migrate dev` - Run database migrations

---

## 🎨 Design System

### Color Palette
- **Primary**: Telegram blue (#3390ec) - inherited from theme
- **Success**: Green for completed orders
- **Warning**: Yellow for limited availability
- **Danger**: Red for cancellations

### Typography
- Use Telegram's native fonts via CSS variables
- Headings: Bold, clear hierarchy
- Body: Optimized for mobile readability

---

## 🔐 Security

- ✅ Validate `initData` hash on backend using Bot Token
- ✅ Sanitize all user inputs (Prisma helps prevent SQL injection)
- ✅ Implement CORS properly for TWA domain
- ✅ Use HTTPS in production

---

## 📱 Deployment

### Hosting Frontend
- Deploy to Vercel, Netlify, or Cloudflare Pages
- Set TWA URL in BotFather settings

### Hosting Backend
- Railway, Render, or Fly.io for Node.js
- Ensure PostgreSQL is accessible

### Telegram Configuration
1. Create bot via @BotFather
2. Set WebApp URL: `/setmenubutton`
3. Configure payment provider (future iteration)

---

## 🛣 Roadmap

### MVP (Current)
- [x] Basic buyer flow (browse, reserve, pay)
- [x] Merchant dashboard (create offers, validate orders)
- [x] Telegram authentication
- [x] QR code generation and scanning

### Post-MVP
- [ ] Real payment gateway integration (local providers)
- [ ] Push notifications for new deals
- [ ] Ratings & reviews system
- [ ] Multi-language support (Russian/Kyrgyz)
- [ ] Analytics dashboard for merchants

---

## 📄 License

MIT License - Feel free to use this project as a foundation for similar initiatives.

---

## 🤝 Contributing

This is an MVP project. Contributions welcome after initial launch!

---

**Built with ❤️ for reducing food waste in Kyrgyzstan**
