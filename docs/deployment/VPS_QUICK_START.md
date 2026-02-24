# 🚀 QUICK START - VPS DEPLOYMENT

## ✅ Since Your cPanel Has VPS Support

You can deploy **EVERYTHING** to your server for **$0 extra cost**!

---

## 📋 DEPLOYMENT CHECKLIST

### Phase 1: Server Setup (15 min)
```bash
# SSH into your VPS
ssh root@your-server-ip

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install nodejs -y
node --version  # Verify v20+

# Install PostgreSQL
dnf install postgresql15-server -y
postgresql-15-setup initdb
systemctl start postgresql-15

# Install Redis
dnf install redis -y
systemctl start redis

# Install PM2
npm install -g pm2
```

### Phase 2: Database Setup (5 min)
```bash
# Create database
sudo -u postgres psql
```
```sql
CREATE DATABASE ola_shop_db;
CREATE USER ola_shop_user WITH PASSWORD 'SecurePass123!';
GRANT ALL PRIVILEGES ON DATABASE ola_shop_db TO ola_shop_user;
\q
```

### Phase 3: Upload Code (10 min)
```bash
# Option A: Git
cd /home/your-user/
git clone <your-repo-url> ola-shop-v2

# Option B: Upload via cPanel File Manager
# Then extract to /home/your-user/ola-shop-v2
```

### Phase 4: Deploy Backend (10 min)
```bash
cd /home/your-user/ola-shop-v2/backend/medusa-server

# Install
npm install

# Configure
cat > .env << EOF
DATABASE_URL=postgresql://ola_shop_user:SecurePass123!@localhost:5432/ola_shop_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
STORE_CORS=https://ola-shop.com
ADMIN_CORS=https://ola-shop.com
EOF

# Migrate & Start
npm run migrations
pm2 start npm --name "medusa" -- start
pm2 save
```

### Phase 5: Deploy Frontend (10 min)
```bash
cd /home/your-user/ola-shop-v2/apps/storefront

# Install
npm install

# Configure
cat > .env.local << EOF
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://ola-shop.com/api
NEXT_PUBLIC_SITE_URL=https://ola-shop.com
EOF

# Build & Start
npm run build
pm2 start npm --name "frontend" -- start
pm2 save
```

### Phase 6: Configure Proxy (5 min)
```bash
# For Apache (cPanel default)
cat > /home/your-user/public_html/.htaccess << 'EOF'
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass /api http://localhost:9000
    ProxyPassReverse /api http://localhost:9000
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</IfModule>
EOF
```

### Phase 7: Enable SSL (5 min)
```bash
# Use cPanel AutoSSL or Let's Encrypt
certbot --apache -d ola-shop.com -d www.ola-shop.com
```

---

## ✅ DONE!

**Your site is now live at:** https://ola-shop.com

**Admin dashboard:** https://ola-shop.com/api/admin

---

## 🎯 TOTAL TIME: 60 minutes
## 💰 TOTAL COST: $0 (using your VPS)

---

## 📞 NEED HELP?

**Check:** [VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md) for detailed instructions

**Support:** +249 121 013 939 (WhatsApp)
