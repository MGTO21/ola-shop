# 🔧 Version 1.26 - Fix RTL Phone Number & Setup Admin

## Issue
When the site is in Arabic (RTL mode), the phone number "+249" appears on the right side of the input field instead of staying on the left.

## Solution
We need to force the phone input to always display left-to-right (LTR), even when the page is in RTL mode.

---

## Step 1: Create Backup

```bash
ssh root@46.224.43.113
mkdir -p /var/www/backups/v1.26
cp -r /var/www/apps/storefront/components /var/www/backups/v1.26/
echo "v1.26 - Fix RTL phone display + Admin setup: $(date)" >> /var/www/CHANGELOG.txt
```

---

## Step 2: Fix the Phone Input Component

Find the phone input component and add `dir="ltr"` to force left-to-right display:

```bash
# First, let's find where the phone input is
cd /var/www/apps/storefront
grep -r "WhatsApp Number" app/
```

Once we find it, we'll add the `dir="ltr"` attribute to the input field.

---

## Step 3: Setup Admin Panel

### A. Access Medusa Admin

The admin panel should be accessible at:
- **URL:** http://46.224.43.113:9000/app
- **Or:** http://46.224.43.113/api/admin

### B. Create Admin User

```bash
ssh root@46.224.43.113
cd /var/www/backend/medusa-server
npx medusa user -e admin@ola-shop.com -p YourSecurePassword123
```

Replace `YourSecurePassword123` with a strong password.

### C. Configure Nginx for Admin Access

Add admin route to Nginx config:

```bash
cat >> /etc/nginx/sites-available/ola-shop << 'EOF'

    location /admin {
        proxy_pass http://localhost:9000/app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
EOF

nginx -t && systemctl reload nginx
```

---

## Step 4: Restart Services

```bash
pm2 restart all
```

---

## Rollback (if needed)

```bash
cp -r /var/www/backups/v1.26/components/* /var/www/apps/storefront/components/
pm2 restart ola-storefront
```

---

## Admin Credentials (Save These!)

- **Email:** admin@ola-shop.com
- **Password:** [Your chosen password]
- **URL:** http://46.224.43.113/admin
- **Alternative:** http://46.224.43.113:9000/app
