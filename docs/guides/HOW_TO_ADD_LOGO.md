# 🎨 HOW TO ADD YOUR OLA SHOP LOGO

## 📁 Logo Files Needed

You need to provide your logo in these formats:

### 1. **Main Logo** (Required)
- **File:** `logo.png` or `logo.svg`
- **Size:** 200x60px (or similar ratio)
- **Background:** Transparent
- **Format:** PNG or SVG (SVG preferred)

### 2. **Logo Icon/Favicon** (Required)
- **File:** `logo-icon.png`
- **Size:** 512x512px (square)
- **Background:** Transparent
- **Format:** PNG

### 3. **Favicon** (Required)
- **File:** `favicon.ico`
- **Size:** 32x32px
- **Format:** ICO

---

## 📂 WHERE TO PUT LOGO FILES

### For Next.js App:

```
ola-shop-v2/
└── apps/
    └── storefront/
        └── public/
            ├── logo.svg          ← Main logo (SVG preferred)
            ├── logo.png          ← Main logo (PNG fallback)
            ├── logo-icon.png     ← Square icon
            └── favicon.ico       ← Browser favicon
```

---

## 🔧 HOW TO ADD YOUR LOGO

### Option 1: Using cPanel File Manager

1. **Login to cPanel**
2. **Go to File Manager**
3. **Navigate to:**
   ```
   /home/your-user/ola-shop-v2/apps/storefront/public/
   ```
4. **Upload your logo files:**
   - `logo.svg` (or `logo.png`)
   - `logo-icon.png`
   - `favicon.ico`

### Option 2: Using SCP (from your PC)

```powershell
# From your PC
cd C:\Users\hp\Desktop  # Where your logo files are

# Upload to VPS
scp logo.svg root@your-server-ip:/home/your-user/ola-shop-v2/apps/storefront/public/
scp logo-icon.png root@your-server-ip:/home/your-user/ola-shop-v2/apps/storefront/public/
scp favicon.ico root@your-server-ip:/home/your-user/ola-shop-v2/apps/storefront/public/
```

### Option 3: Using Git

```bash
# Add logo files to your repository
git add apps/storefront/public/logo.svg
git add apps/storefront/public/logo-icon.png
git add apps/storefront/public/favicon.ico
git commit -m "Add Ola Shop logo"
git push

# Then pull on your VPS
ssh root@your-server-ip
cd /home/your-user/ola-shop-v2
git pull
```

---

## 🎨 LOGO SPECIFICATIONS

### Main Logo (logo.svg or logo.png)

**Recommended Dimensions:**
- Width: 180-220px
- Height: 50-70px
- Aspect Ratio: ~3:1

**Design Guidelines:**
- ✅ Include "Ola Shop" text
- ✅ Include Arabic text "متجر العلا" (optional)
- ✅ Use brand colors (Maroon #880E4F)
- ✅ Transparent background
- ✅ High resolution (2x for retina displays)

### Logo Icon (logo-icon.png)

**Dimensions:**
- 512x512px (square)
- Can be scaled down automatically

**Design Guidelines:**
- ✅ Just the "O" or icon part
- ✅ No text (or minimal)
- ✅ Works at small sizes
- ✅ Transparent background

---

## 🔄 AFTER ADDING LOGO

### If Using Static Build:
```bash
# Rebuild frontend
cd apps/storefront
npm run build

# Re-upload to cPanel
# (Logo will be included in build)
```

### If Using VPS Deployment:
```bash
# Restart frontend
pm2 restart ola-shop-frontend

# Logo will be automatically available
```

---

## 🎨 TEMPORARY PLACEHOLDER

I've created a temporary placeholder logo for you. The code currently uses:

**In Header.tsx:**
```tsx
<div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
  O
</div>
```

**To use your real logo, update to:**
```tsx
<Image 
  src="/logo.svg" 
  alt="Ola Shop" 
  width={180} 
  height={60}
  priority
/>
```

---

## 📝 QUICK LOGO CHECKLIST

Before uploading, make sure:

- [ ] Logo has transparent background
- [ ] Logo is high resolution (2x for retina)
- [ ] Logo works on white background
- [ ] Logo works on dark background
- [ ] File size is optimized (< 100KB)
- [ ] SVG format (preferred) or PNG
- [ ] Favicon is 32x32px ICO format
- [ ] Icon is 512x512px PNG

---

## 🎨 NEED A LOGO?

If you don't have a logo yet, you can:

### Option 1: Use the Placeholder
The current circular "O" design works well temporarily

### Option 2: Create One
Use these free tools:
- **Canva:** https://canva.com
- **Figma:** https://figma.com
- **Logo Maker:** https://logomaker.com

### Option 3: Hire a Designer
- **Fiverr:** $5-50
- **99designs:** $299+
- **Upwork:** $50-500

---

## 💡 LOGO DESIGN TIPS

### Colors to Use:
- Primary: Maroon (#880E4F)
- Secondary: Teal (#00838F)
- Accent: Orange (#EF6C00)
- Purple: (#7B1FA2)

### Fonts to Use:
- Playfair Display (serif, elegant)
- Poppins (sans-serif, modern)
- Cairo (Arabic text)

### Style:
- Premium, elegant
- Beauty/cosmetics industry
- Modern but timeless
- Works in Arabic and English

---

## 🚀 AFTER YOU HAVE YOUR LOGO

1. **Save logo files in the formats above**
2. **Upload to `/apps/storefront/public/`**
3. **Rebuild/restart the app**
4. **Your logo will appear automatically!**

---

## 📞 NEED HELP?

If you have your logo but need help:
1. Upload it to the project
2. Tell me the filename
3. I'll update the code to use it!

**Support:** +249 121 013 939 (WhatsApp)
