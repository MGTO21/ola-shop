# VPS Backend Fix Guide

## Problem
401 Unauthorized errors when trying to login/signup from localhost storefront.

## Root Causes
1. **CORS not configured** - Backend rejects requests from `localhost:3001`
2. **Auth module might need verification**
3. **Publishable key might not be active**

## Quick Fix Commands

### Step 1: Connect to VPS
```powershell
ssh root@46.224.43.113
# Password: Abc996050@
```

### Step 2: Navigate to backend
```bash
cd /var/www/backend/medusa-server
```

### Step 3: Check current .env CORS settings
```bash
cat .env | grep CORS
```

### Step 4: Update CORS to allow localhost
```bash
# Edit .env file
nano .env

# Add/Update these lines:
STORE_CORS=http://localhost:3001,http://localhost:3000,http://46.224.43.113
ADMIN_CORS=http://localhost:7001,http://localhost:9000,http://46.224.43.113:9000
AUTH_CORS=http://localhost:3001,http://localhost:3000,http://46.224.43.113

# Save: Ctrl+O, Enter, Ctrl+X
```

### Step 5: Verify medusa-config.js has auth module
```bash
cat medusa-config.js | grep -A 10 "auth"
```

Should see:
```javascript
{
  resolve: "@medusajs/auth",
  options: {
    providers: [{
      resolve: "@medusajs/auth-emailpass",
      id: "emailpass"
    }]
  }
}
```

### Step 6: Restart Medusa backend
```bash
pm2 restart ola-medusa
# Or if process name is different:
pm2 list  # Check the actual name
pm2 restart <process-name>
```

### Step 7: Verify backend is running
```bash
pm2 logs ola-medusa --lines 50
# Check for any errors
```

### Step 8: Test from browser
Open `http://46.224.43.113:9000/health` - should return `{"status":"ok"}`

## Alternative: Quick One-Liner Fix
```bash
ssh root@46.224.43.113 "cd /var/www/backend/medusa-server && echo 'STORE_CORS=http://localhost:3001,http://localhost:3000,http://46.224.43.113' >> .env && echo 'ADMIN_CORS=http://localhost:7001,http://localhost:9000,http://46.224.43.113:9000' >> .env && echo 'AUTH_CORS=http://localhost:3001,http://localhost:3000,http://46.224.43.113' >> .env && pm2 restart ola-medusa"
```

## Verification
After restarting:
1. Try signup at `http://localhost:3001/whatsapp-signup`
2. Fill form and submit
3. Check console - should NOT see 401 errors anymore
4. Should redirect to `/account` after successful registration

## If Still Not Working
Check if the publishable key is active in Medusa Admin:
1. Go to `http://46.224.43.113:9000/app`
2. Login to admin
3. Settings → API Keys → Publishable Keys
4. Verify `pk_a70a9d62...` is **Active** and has **Default Sales Channel**
