#!/bin/bash

# Ola Shop v2.0 - VPS Deployment Script
# This script automates the deployment to your VPS

set -e  # Exit on error

echo "🚀 Ola Shop v2.0 - VPS Deployment Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 This script will:${NC}"
echo "  1. Install Node.js 20"
echo "  2. Install PostgreSQL 15"
echo "  3. Install Redis"
echo "  4. Install PM2"
echo "  5. Setup database"
echo "  6. Deploy backend"
echo "  7. Deploy frontend"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Detect OS
if [ -f /etc/redhat-release ]; then
    OS="rhel"
    PKG_MANAGER="dnf"
elif [ -f /etc/debian_version ]; then
    OS="debian"
    PKG_MANAGER="apt"
else
    echo -e "${RED}❌ Unsupported OS${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔧 Step 1: Installing Node.js 20...${NC}"

if [ "$OS" = "rhel" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    $PKG_MANAGER install nodejs -y
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    $PKG_MANAGER install nodejs -y
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"

echo ""
echo -e "${YELLOW}🔧 Step 2: Installing PostgreSQL 15...${NC}"

if [ "$OS" = "rhel" ]; then
    $PKG_MANAGER install postgresql15-server postgresql15 -y
    /usr/pgsql-15/bin/postgresql-15-setup initdb
    systemctl enable postgresql-15
    systemctl start postgresql-15
else
    $PKG_MANAGER install postgresql postgresql-contrib -y
    systemctl enable postgresql
    systemctl start postgresql
fi

echo -e "${GREEN}✓ PostgreSQL installed${NC}"

echo ""
echo -e "${YELLOW}🔧 Step 3: Installing Redis...${NC}"

if [ "$OS" = "rhel" ]; then
    $PKG_MANAGER install redis -y
    systemctl enable redis
    systemctl start redis
else
    $PKG_MANAGER install redis-server -y
    systemctl enable redis-server
    systemctl start redis-server
fi

echo -e "${GREEN}✓ Redis installed${NC}"

echo ""
echo -e "${YELLOW}🔧 Step 4: Installing PM2...${NC}"

npm install -g pm2
echo -e "${GREEN}✓ PM2 installed${NC}"

echo ""
echo -e "${YELLOW}🔧 Step 5: Setting up database...${NC}"

# Get database credentials
read -p "Enter database name [ola_shop_db]: " DB_NAME
DB_NAME=${DB_NAME:-ola_shop_db}

read -p "Enter database user [ola_shop_user]: " DB_USER
DB_USER=${DB_USER:-ola_shop_user}

read -sp "Enter database password: " DB_PASS
echo

# Create database
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER DATABASE $DB_NAME OWNER TO $DB_USER;"

echo -e "${GREEN}✓ Database configured${NC}"

echo ""
echo -e "${YELLOW}🔧 Step 6: Deploying backend...${NC}"

# Get project directory
read -p "Enter project directory [/home/$(logname)/ola-shop-v2]: " PROJECT_DIR
PROJECT_DIR=${PROJECT_DIR:-/home/$(logname)/ola-shop-v2}

if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Project directory not found: $PROJECT_DIR${NC}"
    echo "Please upload your code first!"
    exit 1
fi

cd $PROJECT_DIR/backend/medusa-server

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Generate secrets
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)

# Get domain
read -p "Enter your domain [ola-shop.com]: " DOMAIN
DOMAIN=${DOMAIN:-ola-shop.com}

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
REDIS_URL=redis://localhost:6379
JWT_SECRET=$JWT_SECRET
COOKIE_SECRET=$COOKIE_SECRET
STORE_CORS=https://$DOMAIN,http://$DOMAIN
ADMIN_CORS=https://$DOMAIN,http://$DOMAIN
MEDUSA_BACKEND_URL=https://$DOMAIN
EOF

echo -e "${GREEN}✓ Backend configured${NC}"

# Run migrations
echo "Running database migrations..."
npm run migrations

# Start backend with PM2
pm2 delete medusa-backend 2>/dev/null || true
pm2 start npm --name "medusa-backend" -- start
pm2 save

echo -e "${GREEN}✓ Backend deployed and running on port 9000${NC}"

echo ""
echo -e "${YELLOW}🔧 Step 7: Deploying frontend...${NC}"

cd $PROJECT_DIR/apps/storefront

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://$DOMAIN/api
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
EOF

# Build
echo "Building frontend..."
npm run build

# Start frontend with PM2
pm2 delete ola-shop-frontend 2>/dev/null || true
pm2 start npm --name "ola-shop-frontend" -- start
pm2 save

echo -e "${GREEN}✓ Frontend deployed and running on port 3000${NC}"

# Setup PM2 startup
pm2 startup | tail -n 1 | bash

echo ""
echo "=========================================="
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo "=========================================="
echo ""
echo "📊 Services Status:"
pm2 status
echo ""
echo "🌐 Next Steps:"
echo "  1. Configure your web server (Nginx/Apache) to proxy:"
echo "     - Frontend: http://localhost:3000"
echo "     - Backend: http://localhost:9000"
echo ""
echo "  2. Enable SSL certificate for https://$DOMAIN"
echo ""
echo "  3. Access your site:"
echo "     - Frontend: https://$DOMAIN"
echo "     - Admin: https://$DOMAIN/api/admin"
echo ""
echo "📚 Documentation:"
echo "  - VPS_DEPLOYMENT_GUIDE.md"
echo "  - VPS_QUICK_START.md"
echo ""
echo "🔧 Useful Commands:"
echo "  - View logs: pm2 logs"
echo "  - Restart: pm2 restart all"
echo "  - Monitor: pm2 monit"
echo ""
echo "💬 Support: +249 121 013 939 (WhatsApp)"
echo ""
