# 🚀 Quick Setup Guide - Ola Shop v2.0

## Step 1: Install Dependencies

### Install Node.js 20+
Download from: https://nodejs.org/

### Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop/

## Step 2: Start Database

```powershell
# Navigate to project
cd C:\Users\hp\.gemini\antigravity\scratch\ola-shop-v2

# Start PostgreSQL and Redis
docker-compose up -d

# Check if running
docker-compose ps
```

## Step 3: Setup Backend

```powershell
# Navigate to backend
cd backend\medusa-server

# Install dependencies
npm install

# Run migrations
npm run migrations

# Start backend
npm run dev
```

✅ Backend running at: http://localhost:9000  
✅ Admin UI at: http://localhost:7001

## Step 4: Setup Frontend

```powershell
# Open new terminal
cd C:\Users\hp\.gemini\antigravity\scratch\ola-shop-v2\apps\storefront

# Install dependencies
npm install

# Start frontend
npm run dev
```

✅ Frontend running at: http://localhost:3000

## Step 5: Access Admin

1. Go to http://localhost:7001
2. Create admin account
3. Start adding products!

## Step 6: View Storefront

1. Go to http://localhost:3000
2. Browse products
3. Test checkout flow

## 🎉 You're Done!

### Next Steps:
- Add products via admin
- Customize branding
- Configure payment methods
- Set up shipping options

### Need Help?
- Check README.md for detailed docs
- WhatsApp: +249 121 013 939
