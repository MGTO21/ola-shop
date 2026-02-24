# 🎉 PERFECT! YOUR CPANEL HAS VPS SUPPORT!

## ✅ This Changes Everything!

Since your cPanel supports VPS, you can deploy the **FULL Next.js + Medusa.js stack** directly to your server!

---

## 🚀 VPS DEPLOYMENT PLAN

### What You Can Do Now:
1. ✅ **Deploy Full Next.js App** (not just static)
2. ✅ **Install PostgreSQL** on your VPS
3. ✅ **Install Redis** on your VPS
4. ✅ **Run Medusa.js Backend** on your VPS
5. ✅ **Everything on ONE server** (your cPanel VPS)

### Cost: **$0 extra** (you already have VPS)

---

## 📋 COMPLETE VPS DEPLOYMENT GUIDE

### Prerequisites Check:
- ✅ VPS with cPanel
- ✅ SSH/Root access
- ✅ At least 2GB RAM
- ✅ Ubuntu/CentOS/AlmaLinux

---

## 🔧 STEP-BY-STEP DEPLOYMENT

### STEP 1: SSH into Your VPS

```bash
# SSH into your server
ssh root@your-server-ip
# Or use cPanel Terminal
```

---

### STEP 2: Install Node.js 20+

```bash
# Remove old Node.js
yum remove nodejs -y  # For CentOS/AlmaLinux
# OR
apt remove nodejs -y  # For Ubuntu

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -  # CentOS/AlmaLinux
# OR
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -  # Ubuntu

# Install Node.js
yum install nodejs -y  # CentOS/AlmaLinux
# OR
apt install nodejs -y  # Ubuntu

# Verify
node --version  # Should show v20.x.x
npm --version
```

---

### STEP 3: Install PostgreSQL

```bash
# For CentOS/AlmaLinux
dnf install postgresql15-server postgresql15 -y
postgresql-15-setup initdb
systemctl enable postgresql-15
systemctl start postgresql-15

# For Ubuntu
apt install postgresql postgresql-contrib -y
systemctl enable postgresql
systemctl start postgresql

# Create database and user
sudo -u postgres psql
```

In PostgreSQL prompt:
```sql
CREATE DATABASE ola_shop_db;
CREATE USER ola_shop_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE ola_shop_db TO ola_shop_user;
\q
```

---

### STEP 4: Install Redis

```bash
# For CentOS/AlmaLinux
dnf install redis -y
systemctl enable redis
systemctl start redis

# For Ubuntu
apt install redis-server -y
systemctl enable redis-server
systemctl start redis-server

# Verify
redis-cli ping  # Should return "PONG"
```

---

### STEP 5: Install PM2 (Process Manager)

```bash
npm install -g pm2
```

---

### STEP 6: Upload Your Code

**Option A: Using Git (Recommended)**
```bash
# Install Git
yum install git -y  # CentOS/AlmaLinux
# OR
apt install git -y  # Ubuntu

# Clone your repository
cd /home/your-cpanel-user/
git clone https://github.com/your-username/ola-shop-v2.git
cd ola-shop-v2
```

**Option B: Using cPanel File Manager**
1. Compress your `ola-shop-v2` folder
2. Upload via cPanel File Manager
3. Extract to `/home/your-cpanel-user/`

---

### STEP 7: Deploy Backend

```bash
cd /home/your-cpanel-user/ola-shop-v2/backend/medusa-server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://ola_shop_user:your-secure-password@localhost:5432/ola_shop_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
STORE_CORS=https://ola-shop.com
ADMIN_CORS=https://ola-shop.com
MEDUSA_BACKEND_URL=https://ola-shop.com
EOF

# Run migrations
npm run migrations

# Start with PM2
pm2 start npm --name "medusa-backend" -- start
pm2 save
pm2 startup
```

Backend now running on: **http://localhost:9000**

---

### STEP 8: Deploy Frontend

```bash
cd /home/your-cpanel-user/ola-shop-v2/apps/storefront

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://ola-shop.com/api
NEXT_PUBLIC_SITE_URL=https://ola-shop.com
EOF

# Build
npm run build

# Start with PM2
pm2 start npm --name "ola-shop-frontend" -- start
pm2 save
```

Frontend now running on: **http://localhost:3000**

---

### STEP 9: Configure Nginx/Apache Reverse Proxy

**For Nginx:**
```bash
# Create Nginx config
cat > /etc/nginx/conf.d/ola-shop.conf << 'EOF'
# Frontend
server {
    listen 80;
    server_name ola-shop.com www.ola-shop.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Test and reload
nginx -t
systemctl reload nginx
```

**For Apache (cPanel usually uses this):**
```bash
# Create .htaccess in public_html
cat > /home/your-cpanel-user/public_html/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Proxy API requests to backend
    RewriteRule ^api/(.*)$ http://localhost:9000/$1 [P,L]
    
    # Proxy all other requests to frontend
    RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
EOF
```

---

### STEP 10: Enable SSL (Let's Encrypt)

```bash
# Install Certbot
dnf install certbot python3-certbot-nginx -y  # CentOS/AlmaLinux
# OR
apt install certbot python3-certbot-nginx -y  # Ubuntu

# Get SSL certificate
certbot --nginx -d ola-shop.com -d www.ola-shop.com

# Auto-renewal
certbot renew --dry-run
```

---

### STEP 11: Configure Firewall

```bash
# Open ports
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# Or for UFW (Ubuntu)
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload
```

---

## ✅ VERIFICATION

### Check Services
```bash
# Check PM2 processes
pm2 status

# Check PostgreSQL
systemctl status postgresql-15  # or postgresql

# Check Redis
systemctl status redis

# Check Nginx/Apache
systemctl status nginx  # or httpd
```

### Test Your Site
1. **Frontend:** https://ola-shop.com
2. **Backend API:** https://ola-shop.com/api/health
3. **Admin:** https://ola-shop.com/api/admin

---

## 🎨 WHAT YOUR HOMEPAGE LOOKS LIKE

I've generated a visual mockup of your Ola Shop homepage showing:
- ✅ Premium header with search, cart, wishlist
- ✅ Hero section with gradient background
- ✅ Colorful category cards
- ✅ Product grid with discounts
- ✅ Customer reviews
- ✅ Mobile app download section
- ✅ WhatsApp floating button

---

## 💰 TOTAL COST

**$0 extra!** (You already have VPS)

---

## 🔧 MAINTENANCE

### Daily Monitoring
```bash
# Check PM2 processes
pm2 monit

# View logs
pm2 logs medusa-backend
pm2 logs ola-shop-frontend
```

### Restart Services
```bash
# Restart backend
pm2 restart medusa-backend

# Restart frontend
pm2 restart ola-shop-frontend

# Restart all
pm2 restart all
```

### Update Code
```bash
cd /home/your-cpanel-user/ola-shop-v2
git pull
cd backend/medusa-server && npm install && pm2 restart medusa-backend
cd ../../apps/storefront && npm install && npm run build && pm2 restart ola-shop-frontend
```

---

## 🆘 TROUBLESHOOTING

### Frontend not loading
```bash
pm2 logs ola-shop-frontend --lines 100
pm2 restart ola-shop-frontend
```

### Backend errors
```bash
pm2 logs medusa-backend --lines 100
pm2 restart medusa-backend
```

### Database connection issues
```bash
sudo -u postgres psql
\l  # List databases
\du # List users
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
# Restart PM2
pm2 restart ola-shop-frontend
```

---

## 🎯 NEXT STEPS

1. **SSH into your VPS**
2. **Follow the steps above**
3. **Deploy in 30-45 minutes**
4. **Your site is live!** 🚀

**Need help with any step? Just ask!** 💬
