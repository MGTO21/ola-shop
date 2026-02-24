# 🚀 Deployment Instructions for Your VPS
## Server: 46.224.43.113

---

## ⚡ Quick Start (5 Commands)

### 1️⃣ Connect to Your VPS

Open **PowerShell** or **PuTTY** and run:

```bash
ssh root@46.224.43.113
```

**Password:** `fVxFbmvAVfdWNcmfVUhE`

---

### 2️⃣ Download & Run Deployment Script

Once connected, run these commands:

```bash
# Download the script
wget https://raw.githubusercontent.com/YOUR_REPO/deploy-to-vps.sh -O deploy.sh

# Make it executable
chmod +x deploy.sh

# Run it
./deploy.sh
```

**OR** if you don't have the script online, copy-paste this:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

---

### 3️⃣ Upload Your Application

From your **Windows machine**, upload the ZIP file:

```powershell
# Open PowerShell on Windows
scp C:\Users\hp\.gemini\antigravity\scratch\ola-shop-FINAL.zip root@46.224.43.113:/var/www/ola-shop/
```

**Password:** `fVxFbmvAVfdWNcmfVUhE`

---

### 4️⃣ Extract and Configure

Back on the VPS:

```bash
cd /var/www/ola-shop
unzip ola-shop-FINAL.zip

# View database credentials
cat /root/ola-credentials/database.txt

# Configure backend
cd /var/www/ola-shop/apps/storefront
npm install
npm run build

# Start with PM2
pm2 start npm --name "ola-shop" -- start
pm2 save
pm2 startup
```

---

### 5️⃣ Configure Nginx

```bash
nano /etc/nginx/sites-available/ola-shop
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name 46.224.43.113;

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

Save and exit (Ctrl+X, then Y, then Enter)

```bash
# Enable the site
ln -s /etc/nginx/sites-available/ola-shop /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## ✅ Test Your Site

Open your browser and visit:

```
http://46.224.43.113
```

You should see your Ola Shop! 🎉

---

## 🔐 If You Have a Domain

### Step 1: Point DNS to Your Server

In your domain registrar (GoDaddy, Namecheap, etc):

```
Type: A
Name: @
Value: 46.224.43.113
TTL: 3600
```

### Step 2: Update Nginx Configuration

```bash
nano /etc/nginx/sites-available/ola-shop
```

Change `server_name` from `46.224.43.113` to your domain:

```nginx
server_name yourdomain.com www.yourdomain.com;
```

### Step 3: Install SSL

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🆘 Troubleshooting

### Check if services are running:

```bash
# Check PM2
pm2 list

# Check Nginx
systemctl status nginx

# Check PostgreSQL
systemctl status postgresql

# Check Redis
systemctl status redis-server
```

### View logs:

```bash
# PM2 logs
pm2 logs

# Nginx error log
tail -f /var/log/nginx/error.log
```

### Restart everything:

```bash
pm2 restart all
systemctl restart nginx
```

---

## 📞 Quick Commands Reference

```bash
# Connect to VPS
ssh root@46.224.43.113

# View database credentials
cat /root/ola-credentials/database.txt

# Check PM2 apps
pm2 list

# View logs
pm2 logs

# Restart app
pm2 restart ola-shop

# Manual backup
/var/www/ola-shop/backups/backup.sh

# Check disk space
df -h

# Check memory
free -h
```

---

## 🎯 Your Server Details

- **IP:** 46.224.43.113
- **OS:** Ubuntu 24.04
- **Location:** Germany (Falkenstein)
- **RAM:** 4 GB
- **Storage:** 40 GB
- **Password:** fVxFbmvAVfdWNcmfVUhE

---

**Ready to deploy! Follow the steps above.** 🚀

**Need help? Just ask!** 💬
