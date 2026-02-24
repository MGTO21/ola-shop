# 🖼️ Upload Your Logo (Version 1.25)

## Quick Upload Method

**Step 1: Connect to your server**
```bash
ssh root@46.224.43.113
```
Password: `Abc996050@`

**Step 2: Create a backup (for rollback)**
```bash
mkdir -p /var/www/backups/v1.25
cp -r /var/www/apps/storefront/components /var/www/backups/v1.25/
echo "Backup created: $(date)" >> /var/www/CHANGELOG.txt
```

**Step 3: Upload the logo from your Windows computer**

Open a **NEW PowerShell window** (keep the SSH one open) and run:
```powershell
scp "C:\Users\hp\.gemini\antigravity\scratch\ola-shop-v2\logo.jpg" root@46.224.43.113:/var/www/apps/storefront/public/logo.jpg
```

**Step 4: Verify the upload**
In your SSH window, run:
```bash
ls -lh /var/www/apps/storefront/public/logo.jpg
```

You should see the file size (around 100-200KB).

**Step 5: Restart the storefront**
```bash
cd /var/www/apps/storefront
pm2 restart ola-storefront
```

**Step 6: Check your website**
Visit: http://46.224.43.113

You should now see your beautiful logo! 🎉

---

## Rollback (if something goes wrong)

If the logo doesn't show or breaks something:
```bash
cp -r /var/www/backups/v1.25/components/* /var/www/apps/storefront/components/
pm2 restart ola-storefront
```

---

## Version History
- **v1.25** - Added custom Ola Shop logo
- **v1.24** - Initial deployment with placeholder logo
