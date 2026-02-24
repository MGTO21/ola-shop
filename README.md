# 🛍️ Ola Shop v2.0 - Next.js 15 + Medusa.js

Modern, scalable e-commerce platform built with Next.js 15 and Medusa.js.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 15)                   │
│  • Server Components for product pages (SEO)                │
│  • Client Components for interactivity (cart, filters)      │
│  • Edge Functions for personalization                       │
│  • Tailwind CSS + shadcn/ui for styling                     │
└───────────────┬─────────────────────────────────────────────┘
                │ (API calls)
┌───────────────▼─────────────────────────────────────────────┐
│                    Backend API (Medusa.js)                  │
│  • Product/catalog management                               │
│  • Cart & checkout logic                                    │
│  • Order processing                                         │
│  • Custom plugins for business logic                        │
└───────────────┬─────────────────────────────────────────────┘
                │ (Prisma queries)
┌───────────────▼─────────────────────────────────────────────┐
│                Database Layer                               │
│  • PostgreSQL (primary)                                     │
│  • Redis (caching, queues)                                 │
│  • Object storage (S3/Cloudflare R2 for images)            │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion
- **i18n:** next-intl (Arabic/English)

### Backend
- **Framework:** Medusa.js v2
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Storage:** Local (dev) / S3/R2 (prod)
- **Admin:** Medusa Admin UI

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd ola-shop-v2
```

### 2. Start Database Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 3. Setup Backend

```bash
cd backend/medusa-server

# Install dependencies
npm install

# Run database migrations
npm run migrations

# Seed initial data (optional)
npm run seed

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:9000**  
Admin UI will run on: **http://localhost:7001**

### 4. Setup Frontend

```bash
cd apps/storefront

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 📁 Project Structure

```
ola-shop-v2/
├── apps/
│   └── storefront/              # Next.js 15 Customer App
│       ├── app/                 # App Router pages
│       ├── components/          # React components
│       ├── lib/                 # Utilities & helpers
│       └── public/              # Static assets
│
├── backend/
│   └── medusa-server/           # Medusa.js Backend
│       ├── src/
│       │   ├── api/             # Custom API routes
│       │   ├── models/          # Custom models
│       │   ├── services/        # Custom services
│       │   └── plugins/         # Custom plugins
│       └── medusa-config.js
│
├── packages/                    # Shared packages
├── docker-compose.yml           # Local development
└── README.md
```

## 🎨 Features

### Customer Features
- ✅ Product browsing with filters
- ✅ Shopping cart
- ✅ Checkout flow
- ✅ Multi-language (AR/EN)
- ✅ Promotional banners (10 slots)
- ✅ Customer reviews
- ✅ Wishlist
- ✅ Mobile app download section
- ✅ Social media integration
- ✅ WhatsApp support

### Admin Features
- ✅ Product management
- ✅ Order processing
- ✅ Customer CRM
- ✅ Banner management
- ✅ Review management
- ✅ Analytics dashboard
- ✅ Inventory tracking

## 🔧 Development

### Frontend Development

```bash
cd apps/storefront

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Backend Development

```bash
cd backend/medusa-server

# Run dev server
npm run dev

# Build for production
npm run build

# Run migrations
npm run migrations

# Seed database
npm run seed
```

## 🌍 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medusa_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
```

## 📊 Database

### PostgreSQL Tables
- products
- variants
- orders
- customers
- cart
- regions
- shipping_options
- payment_sessions
- (+ custom tables for banners, reviews, etc.)

### Redis Usage
- Session storage
- Product catalog cache
- Job queues
- Rate limiting

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/storefront
vercel
```

### Backend (Railway/Render)
```bash
# Build
npm run build

# Start
npm start
```

### Database (Supabase/Neon)
- Create PostgreSQL database
- Update DATABASE_URL
- Run migrations

## 📈 Performance

### Expected Metrics
- **First Load:** < 1.5s
- **Lighthouse Score:** 95+
- **SEO Score:** 100
- **Core Web Vitals:** All green

## 🔒 Security

- HTTPS enforcement
- JWT authentication
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection
- Rate limiting

## 📝 Migration from v1.0

See [MIGRATION_PLAN_NEXTJS_MEDUSA.md](../ola_arc/MIGRATION_PLAN_NEXTJS_MEDUSA.md) for detailed migration steps.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- **Email:** support@ola-shop.com
- **WhatsApp:** +249 121 013 939
- **Documentation:** [Link to docs]

## 📄 License

Proprietary - Ola Shop © 2025

---

**Built with ❤️ for Ola Shop**
