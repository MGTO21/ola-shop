# 👶 Complete Beginner's Guide - Deploy Ola Shop
## No Technical Knowledge Required!

---

## 🎯 What We're Going to Do

We will connect to your server (like connecting to another computer) and install your shop. It's like installing an app, but on a remote computer.

---

## 📋 Step 1: Open PowerShell (Windows Built-in App)

### What is PowerShell?
PowerShell is a program that comes with Windows. It lets you type commands to control your computer or connect to servers.

### How to Open It:

1. **Click the Start button** (Windows logo at bottom-left of screen)
2. **Type:** `PowerShell`
3. **Click:** "Windows PowerShell" (the blue icon)

![How to open PowerShell](open_powershell_guide_1764780826765.png)

**You'll see a blue window with white text - that's PowerShell!**

---

## 📋 Step 2: Connect to Your Server

### Copy This Command:

```
ssh root@46.224.43.113
```

### What to Do:

1. **Right-click** in the PowerShell window
2. **Click "Paste"** (or press Ctrl+V)
3. **Press Enter**

### What Will Happen:

You'll see a message asking:
```
Are you sure you want to continue connecting (yes/no)?
```

**Type:** `yes` and press Enter

### Then It Will Ask for Password:

**Type this password:** `fVxFbmvAVfdWNcmfVUhE`

**IMPORTANT:** When you type the password, you won't see anything on screen - that's normal! Just type it and press Enter.

### Success!

If it worked, you'll see something like:
```
root@server:~#
```

**Congratulations! You're now connected to your server!** 🎉

---

## 📋 Step 3: Install Everything Automatically

Now we'll run ONE command that installs everything you need.

### Copy This ENTIRE Block:

```bash
apt update && apt upgrade -y && apt install -y curl wget git build-essential ufw fail2ban unzip && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs && npm install -g pm2 && apt install -y postgresql postgresql-contrib redis-server nginx certbot python3-certbot-nginx && systemctl enable redis-server nginx && systemctl start redis-server nginx && ufw default deny incoming && ufw default allow outgoing && ufw allow ssh && ufw allow http && ufw allow https && ufw --force enable && mkdir -p /var/www/ola-shop && echo "Installation complete!"
```

### What to Do:

1. **Copy the entire command above** (Ctrl+C)
2. **Right-click in PowerShell** and click "Paste"
3. **Press Enter**

### What Will Happen:

You'll see lots of text scrolling. This is normal! It's installing:
- Node.js (to run your shop)
- PostgreSQL (database)
- Redis (for speed)
- Nginx (web server)
- Security tools

**This will take 5-10 minutes. Don't close the window!**

When it's done, you'll see: `Installation complete!`

---

## 📋 Step 4: Create the Database

### Copy and Paste This:

```bash
sudo -u postgres psql -c "CREATE DATABASE ola_shop;"
sudo -u postgres psql -c "CREATE USER ola_user WITH ENCRYPTED PASSWORD 'OlaShop2025!';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ola_shop TO ola_user;"
echo "Database created!"
```

**Press Enter**

You should see: `Database created!`

---

## 📋 Step 5: Upload Your Shop Files

### On Your Windows Computer:

1. **Open File Explorer** (the folder icon)
2. **Navigate to:** `C:\Users\hp\.gemini\antigravity\scratch\`
3. **Find the file:** `ola-shop-FINAL.zip`

### Upload to Server:

**Open a NEW PowerShell window** (keep the old one open!)

In the new window, type:

```powershell
scp C:\Users\hp\.gemini\antigravity\scratch\ola-shop-FINAL.zip root@46.224.43.113:/var/www/ola-shop/
```

**Press Enter**

**Type password:** `fVxFbmvAVfdWNcmfVUhE`

You'll see a progress bar. Wait for it to finish.

---

## 📋 Step 6: Extract and Setup

### Go Back to Your FIRST PowerShell Window

(The one connected to the server)

### Copy and Paste These Commands ONE BY ONE:

```bash
cd /var/www/ola-shop
```
Press Enter, then:

```bash
unzip ola-shop-FINAL.zip
```
Press Enter, then:

```bash
cd ola-shop-v2/apps/storefront
```
Press Enter, then:

```bash
npm install
```
Press Enter (this takes 2-3 minutes)

Then:

```bash
npm run build
```
Press Enter (this takes 3-5 minutes)

---

## 📋 Step 7: Start Your Shop!

### Copy and Paste:

```bash
pm2 start npm --name "ola-shop" -- start
pm2 save
pm2 startup
```

**Press Enter after each line**

---

## 📋 Step 8: Configure Web Server

### Copy and Paste This:

```bash
cat > /etc/nginx/sites-available/ola-shop << 'EOF'
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
EOF
```

Press Enter, then:

```bash
ln -s /etc/nginx/sites-available/ola-shop /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🎉 Step 9: TEST YOUR SHOP!

### Open Your Web Browser

**Type this in the address bar:**

```
http://46.224.43.113
```

**Press Enter**

### You Should See Your Ola Shop! 🎊

---

## 🆘 If Something Goes Wrong

### Check if Everything is Running:

```bash
pm2 list
```

You should see "ola-shop" with status "online"

### Check Nginx:

```bash
systemctl status nginx
```

Should say "active (running)"

### View Logs:

```bash
pm2 logs
```

This shows what's happening

---

## 📞 Need Help?

If you see any errors or it doesn't work:

1. **Take a screenshot** of the error
2. **Tell me what step you're on**
3. **I'll help you fix it!**

---

## ✅ Summary of What You Did

1. ✅ Opened PowerShell
2. ✅ Connected to your server
3. ✅ Installed all required software
4. ✅ Created a database
5. ✅ Uploaded your shop files
6. ✅ Installed and built your shop
7. ✅ Started your shop
8. ✅ Configured the web server
9. ✅ Tested your shop in browser

**Your shop is now LIVE at: http://46.224.43.113** 🚀

---

## 🎯 Next Steps (Optional)

### If You Have a Domain Name:

1. Point your domain to: `46.224.43.113`
2. Update Nginx configuration with your domain
3. Install SSL certificate (HTTPS)

**I can help you with this when you're ready!**

---

**Start with Step 1 and go slowly. Take your time!** 😊
