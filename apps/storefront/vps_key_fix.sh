#!/bin/bash
echo "🔍 Searching Database for valid API Key..."
# Try to find a valid key in the database
KEY=$(sudo -u postgres psql -d medusa-db -t -c "SELECT id FROM publishable_api_key WHERE revoked_at IS NULL LIMIT 1;" 2>/dev/null | xargs)
if [ -z "$KEY" ]; then
    KEY=$(sudo -u postgres psql -d medusa -t -c "SELECT id FROM publishable_api_key WHERE revoked_at IS NULL LIMIT 1;" 2>/dev/null | xargs)
fi

if [ -n "$KEY" ]; then
    echo "✅ FOUND VALID KEY: $KEY"
    echo "🛠️  Updating Storefront Code..."
    # Replace the old key with the new ID in the files
    sed -i "s/pk_[a-zA-Z0-9]*/$KEY/g" apps/storefront/lib/medusa.ts
    sed -i "s/pk_[a-zA-Z0-9]*/$KEY/g" apps/storefront/components/home/CategoryHeroSections.tsx
    
    echo "Compiling & Restarting..."
    cd apps/storefront
    npm run build
    pm2 restart storefront
    echo "🎉 FIXED! Please check Ola-Shop.com now."
else
    echo "❌ ERROR: No active API Key found in database. Please create one in Admin Panel."
fi
