# 🚀 VPS DEPLOYMENT - STEP BY STEP GUIDE

## 📋 PREPARATION (Do This First)

### 1. Upload Your Code to VPS

**Option A: Using Git (Recommended)**
```bash
# SSH into your VPS
ssh root@your-server-ip

# Install Git
dnf install git -y  # CentOS/AlmaLinux
# OR
apt install git -y  # Ubuntu

# Clone repository
cd /home/your-cpanel-user/
git clone https://github.com/your-username/ola-shop-v2.git
```

**Option B: Using cPanel File Manager**
1. Compress `ola-shop-v2` folder on your PC
2. Login to cPanel
3. Go to File Manager
4. Upload ZIP to `/home/your-cpanel-user/`
5. Extract the ZIP file

**Option C: Using SCP (from your PC)**
```powershell
# From your PC (PowerShell)
cd C:\Users\hp\.gemini\antigravity\scratch
scp -r ola-shop-v2 root@your-server-ip:/home/your-cpanel-user/
```

---

## 🎯 AUTOMATED DEPLOYMENT (EASIEST)

### Step 1: Upload Deployment Scripts

Upload these files to your VPS:
- `deploy-vps.sh`
- `configure-nginx.sh`
- `setup-ssl.sh`

```bash
# Make scripts executable
chmod +x deploy-vps.sh configure-nginx.sh setup-ssl.sh
```

### Step 2: Run Deployment Script

```bash
# Run as root
sudo ./deploy-vps.sh
```

**The script will:**
1. ✅ Install Node.js 20
2. ✅ Install PostgreSQL 15
3. ✅ Install Redis
4. ✅ Install PM2
5. ✅ Setup database
6. ✅ Deploy backend
7. ✅ Deploy frontend
8. ✅ Start all services

**Time:** 15-20 minutes

### Step 3: Configure Nginx

```bash
sudo ./configure-nginx.sh
```

### Step 4: Setup SSL

```bash
sudo ./setup-ssl.sh
```

### Step 5: Done! ✅

Visit: **https://ola-shop.com**

---

## 🔧 MANUAL DEPLOYMENT (Step by Step)

If you prefer to do it manually, follow these steps:

### Step 1: Install Node.js 20

```bash
# For CentOS/AlmaLinux
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install nodejs -y

# For Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install nodejs -y

# Verify
node --version  # Should show v20.x.x
```

### Step 2: Install PostgreSQL

```bash
# For CentOS/AlmaLinux
dnf install postgresql15-server postgresql15 -y
/usr/pgsql-15/bin/postgresql-15-setup initdb
systemctl enable postgresql-15
systemctl start postgresql-15

# For Ubuntu
apt install postgresql postgresql-contrib -y
systemctl enable postgresql
systemctl start postgresql
```

### Step 3: Create Database

```bash
sudo -u postgres psql
```

In PostgreSQL prompt:
```sql
CREATE DATABASE ola_shop_db;
CREATE USER ola_shop_user WITH PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE ola_shop_db TO ola_shop_user;
ALTER DATABASE ola_shop_db OWNER TO ola_shop_user;
\q
```

### Step 4: Install Redis

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

### Step 5: Install PM2

```bash
npm install -g pm2
```

### Step 6: Deploy Backend

```bash
cd /home/your-cpanel-user/ola-shop-v2/backend/medusa-server

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
DATABASE_URL=postgresql://ola_shop_user:YourSecurePassword123!@localhost:5432/ola_shop_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-random-jwt-secret-here-make-it-long
COOKIE_SECRET=your-random-cookie-secret-here-make-it-long
STORE_CORS=https://ola-shop.com,http://ola-shop.com
ADMIN_CORS=https://ola-shop.com,http://ola-shop.com
MEDUSA_BACKEND_URL=https://ola-shop.com
EOF

# Run migrations
npm run migrations

# Start with PM2
pm2 start npm --name "medusa-backend" -- start
pm2 save
pm2 startup
```

### Step 7: Deploy Frontend

```bash
cd /home/your-cpanel-user/ola-shop-v2/apps/storefront

# Install dependencies
npm install

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://ola-shop.com/api
NEXT_PUBLIC_SITE_URL=https://ola-shop.com
EOF

# Build
npm run build

# Start with PM2
pm2 start npm --name "ola-shop-frontend" -- start
pm2 save
```

### Step 8: Configure Nginx

```bash
# Create Nginx config
nano /etc/nginx/conf.d/ola-shop.conf
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name ola-shop.com www.ola-shop.com;

    location /api {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test and reload
nginx -t
systemctl reload nginx
```

### Step 9: Setup SSL

```bash
# Install Certbot
dnf install certbot python3-certbot-nginx -y  # CentOS/AlmaLinux
# OR
apt install certbot python3-certbot-nginx -y  # Ubuntu

# Get certificate
certbot --nginx -d ola-shop.com -d www.ola-shop.com

# Test auto-renewal
certbot renew --dry-run
```

### Step 10: Configure Firewall

```bash
# For firewalld (CentOS/AlmaLinux)
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# For UFW (Ubuntu)
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

# Check Nginx
systemctl status nginx
```

### Test Your Site
1. **Frontend:** https://ola-shop.com
2. **Backend API:** https://ola-shop.com/api/health
3. **Admin:** https://ola-shop.com/api/admin

---

## 🔧 POST-DEPLOYMENT

### Create Admin User
1. Go to: https://ola-shop.com/api/admin
2. Create your admin account
3. Login and start adding products!

### Monitor Services
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs

# View specific service logs
pm2 logs medusa-backend
pm2 logs ola-shop-frontend
```

---

## 🆘 TROUBLESHOOTING

### Services not starting
```bash
pm2 restart all
pm2 logs
```

### Database connection errors
```bash
# Check PostgreSQL is running
systemctl status postgresql-15

# Check connection
psql -U ola_shop_user -d ola_shop_db -h localhost
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
# Restart PM2
pm2 restart ola-shop-frontend
```

### Nginx errors
```bash
# Check configuration
nginx -t

# View error logs
tail -f /var/log/nginx/error.log
```

---

## 📊 TOTAL TIME & COST

**Automated Deployment:** 20 minutes
**Manual Deployment:** 60 minutes
**Cost:** $0 (using your VPS)

---

## 🎉 SUCCESS!

Your Ola Shop v2.0 is now live at:
- **Frontend:** https://ola-shop.com
- **Admin:** https://ola-shop.com/api/admin

**Next Steps:**
1. ✅ Create admin account
2. ✅ Add products
3. ✅ Customize branding
4. ✅ Test checkout flow
5. ✅ Launch! 🚀
