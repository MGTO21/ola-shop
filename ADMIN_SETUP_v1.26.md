# 🎯 Admin Panel Setup Guide (v1.26)

## ✅ What We Fixed
- Phone number input now stays left-to-right (LTR) even in Arabic mode
- "+249" will always appear on the left side

---

## 🔐 Setting Up Admin Access

### Step 1: Connect to Your Server
```bash
ssh root@46.224.43.113
```
Password: `Abc996050@`

---

### Step 2: Create Admin User

```bash
cd /var/www/backend/medusa-server
npx medusa user -e admin@ola-shop.com -p Admin123456!
```

**Save these credentials:**
- Email: `admin@ola-shop.com`
- Password: `Admin123456!` (change this to your preferred password)

---

### Step 3: Configure Nginx for Admin Access

```bash
cat > /etc/nginx/sites-available/ola-shop << 'EOF'
server {
    listen 80;
    server_name _;

    # Storefront
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
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

    # Admin Panel
    location /admin {
        proxy_pass http://localhost:9000/app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Test and reload Nginx
nginx -t && systemctl reload nginx
```

---

### Step 4: Restart Services

```bash
pm2 restart all
pm2 save
```

---

## 🌐 Access Your Admin Panel

After completing the steps above, you can access the admin panel at:

**Option 1 (Recommended):**
- URL: `http://46.224.43.113/admin`

**Option 2 (Direct):**
- URL: `http://46.224.43.113:9000/app`

**Login with:**
- Email: `admin@ola-shop.com`
- Password: `Admin123456!` (or your chosen password)

---

## 📋 What You Can Do in Admin

1. **Products Management**
   - Add/Edit/Delete products
   - Upload product images
   - Set prices and inventory
   - Manage categories

2. **Orders Management**
   - View all orders
   - Update order status
   - Process refunds

3. **Customers**
   - View customer list
   - Manage customer accounts

4. **Settings**
   - Store settings
   - Payment methods
   - Shipping options
   - Tax configuration

---

## 🔄 Version 1.26 Changes

**Fixed:**
- ✅ Phone number input now displays correctly in Arabic mode
- ✅ "+249" stays on the left side (LTR forced)

**Added:**
- ✅ Admin panel access configuration
- ✅ Admin user creation guide

**Backup Location:**
- `/var/www/backups/v1.26/`

---

## 🛡️ Rollback (if needed)

```bash
ssh root@46.224.43.113
cp /var/www/backups/v1.26/components/layout/Header.tsx /var/www/apps/storefront/components/layout/Header.tsx
cp /var/www/backups/v1.26/app/login/page.tsx /var/www/apps/storefront/app/login/page.tsx
pm2 restart ola-storefront
```

---

## 🔐 Security Recommendations

1. **Change the default admin password** after first login
2. **Use a strong password** (at least 12 characters, mix of letters, numbers, symbols)
3. **Don't share admin credentials** with untrusted people
4. **Enable HTTPS** when you connect your domain (we'll do this next)

---

## 📞 Next Steps

1. ✅ Fix RTL phone display
2. ✅ Setup admin panel
3. ⏳ Upload logo (from previous session)
4. ⏳ Connect domain (ola-shop.com)
5. ⏳ Enable HTTPS/SSL
6. ⏳ Add products to your store
