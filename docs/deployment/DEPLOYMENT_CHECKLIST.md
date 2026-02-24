# 🚀 DEPLOYMENT CHECKLIST - Ola Shop v2.0

## ✅ Pre-Deployment Checklist

### 1. Code & Configuration
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Seed data imported
- [ ] API endpoints tested
- [ ] Frontend builds successfully
- [ ] Backend builds successfully
- [ ] No console errors
- [ ] No TypeScript errors

### 2. Content
- [ ] Products added (minimum 20)
- [ ] Product images uploaded
- [ ] Product descriptions written
- [ ] Categories configured
- [ ] Promotional banners created
- [ ] Customer reviews added
- [ ] About Us page complete
- [ ] Contact information correct

### 3. Functionality
- [ ] Product search works
- [ ] Filters work correctly
- [ ] Cart functionality tested
- [ ] Checkout flow tested
- [ ] Order creation works
- [ ] Language switching works (AR/EN)
- [ ] Mobile responsive
- [ ] WhatsApp integration works

### 4. Performance
- [ ] Images optimized
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals green
- [ ] Page load < 2 seconds
- [ ] No memory leaks

### 5. SEO
- [ ] Meta tags added
- [ ] Open Graph tags added
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Structured data added
- [ ] Alt text on images

### 6. Security
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] SQL injection prevented

---

## 🌐 Deployment Steps

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd apps/storefront
vercel --prod
```

**Environment Variables in Vercel:**
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_SITE_URL=https://ola-shop.com
```

#### Backend to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select `backend/medusa-server` directory
6. Add environment variables:
   ```
   DATABASE_URL=<railway-postgres-url>
   REDIS_URL=<railway-redis-url>
   JWT_SECRET=<generate-random>
   COOKIE_SECRET=<generate-random>
   STORE_CORS=https://ola-shop.com
   ADMIN_CORS=https://admin.ola-shop.com
   ```
7. Deploy!

---

### Option 2: All-in-One VPS (DigitalOcean/Linode)

#### 1. Create Droplet
- Ubuntu 22.04 LTS
- 2GB RAM minimum
- $12/month

#### 2. Initial Setup
```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Redis
apt install -y redis-server

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2
```

#### 3. Setup Database
```bash
# Create database
sudo -u postgres psql
CREATE DATABASE medusa_db;
CREATE USER medusa_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE medusa_db TO medusa_user;
\q
```

#### 4. Deploy Backend
```bash
# Clone repository
git clone <your-repo>
cd ola-shop-v2/backend/medusa-server

# Install dependencies
npm install

# Set environment variables
nano .env
# (Add production values)

# Run migrations
npm run migrations

# Start with PM2
pm2 start npm --name "medusa-backend" -- start
pm2 save
pm2 startup
```

#### 5. Deploy Frontend
```bash
cd ../../apps/storefront

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "ola-shop-frontend" -- start
pm2 save
```

#### 6. Configure Nginx
```bash
nano /etc/nginx/sites-available/ola-shop
```

```nginx
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
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend
server {
    listen 80;
    server_name api.ola-shop.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/ola-shop /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 7. Setup SSL (Let's Encrypt)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d ola-shop.com -d www.ola-shop.com
certbot --nginx -d api.ola-shop.com
```

---

## 🔧 Post-Deployment

### 1. DNS Configuration
Point your domain to server:
```
A Record: @ → your-server-ip
A Record: www → your-server-ip
A Record: api → your-server-ip
```

### 2. Monitoring Setup
```bash
# Install monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Monitor
pm2 monit
```

### 3. Backup Setup
```bash
# Database backup script
nano /root/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U medusa_user medusa_db > $BACKUP_DIR/db_$DATE.sql
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
chmod +x /root/backup-db.sh
crontab -e
# Add: 0 2 * * * /root/backup-db.sh
```

### 4. Performance Optimization
```bash
# Enable Redis persistence
nano /etc/redis/redis.conf
# Set: save 900 1
systemctl restart redis

# Optimize PostgreSQL
nano /etc/postgresql/14/main/postgresql.conf
# Adjust: shared_buffers, effective_cache_size
systemctl restart postgresql
```

---

## 📊 Monitoring & Maintenance

### Daily Tasks
- [ ] Check error logs
- [ ] Monitor server resources
- [ ] Review order queue
- [ ] Respond to customer inquiries

### Weekly Tasks
- [ ] Review analytics
- [ ] Update product inventory
- [ ] Check backup integrity
- [ ] Security updates

### Monthly Tasks
- [ ] Full system backup
- [ ] Performance audit
- [ ] SEO review
- [ ] Update dependencies

---

## 🆘 Troubleshooting

### Frontend not loading
```bash
pm2 logs ola-shop-frontend
pm2 restart ola-shop-frontend
```

### Backend errors
```bash
pm2 logs medusa-backend
pm2 restart medusa-backend
```

### Database connection issues
```bash
sudo -u postgres psql
\l  # List databases
\du # List users
```

### Nginx errors
```bash
nginx -t
systemctl status nginx
tail -f /var/log/nginx/error.log
```

---

## 🎉 Launch Day Checklist

- [ ] Final testing on production
- [ ] Announce on social media
- [ ] Send WhatsApp broadcast
- [ ] Email newsletter
- [ ] Monitor for first hour
- [ ] Celebrate! 🎊

---

**Good luck with your launch!** 🚀
