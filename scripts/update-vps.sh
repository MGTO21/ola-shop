#!/bin/bash

# Ola Shop v2.0 - VPS Update & Sync Script
# Use this script after making significant changes to local code
# Server: 46.224.43.113

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔄 Starting Ola Shop v2.0 Update...${NC}"

# 0. Kill everything to free up the DB Pool
echo -e "${YELLOW}🛑 Stopping ALL services and refreshing database...${NC}"
pm2 stop all || echo "Nothing to stop"
sudo systemctl restart postgresql

echo -e "${YELLOW}⏳ Waiting for Database to be fully ready...${NC}"
for i in {1..15}; do
  if pg_isready -h localhost -p 5432; then
    echo -e "${GREEN}✅ Database is ready!${NC}"
    break
  fi
  sleep 2
done

# Determine what changed in the last push
CHANGES=$(git diff --name-only HEAD HEAD~1 || echo "all")

# 1. Update Backend & Run Migrations
if [[ $CHANGES == *"backend/"* ]] || [[ $CHANGES == *"all"* ]]; then
    echo -e "${YELLOW}⚙️ [1/3] Backend changes detected. Building...${NC}"
    cd backend/medusa-server
    rm -rf dist .medusa
    if [ ! -d "node_modules" ]; then npm install; fi
    NODE_OPTIONS=--max-old-space-size=4096 npm run build
    npx medusa db:migrate || echo "Migrations skipped."
    pm2 restart medusa-backend
    cd ../..
else
    echo -e "${GREEN}⏩ [1/3] No backend changes. Skipping build...${NC}"
fi

# 2. Update Storefront
if [[ $CHANGES == *"apps/storefront/"* ]] || [[ $CHANGES == *"all"* ]]; then
    echo -e "${YELLOW}🖥️ [2/3] Storefront changes detected. Building...${NC}"
    cd apps/storefront
    rm -rf .next
    if [ ! -d "node_modules" ]; then npm install; fi
    chmod -R +x node_modules/.bin
    NODE_OPTIONS=--max-old-space-size=4096 npm run build
    cd ../..
else
    echo -e "${GREEN}⏩ [2/3] No storefront changes. Skipping build...${NC}"
fi

# 3. Final Check & Verify
echo -e "${YELLOW}♻️ [3/3] Finalizing...${NC}"
pm2 start all || pm2 restart all
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}✅ Update Complete! Your VPS should now reflect all local changes.${NC}"
echo -e "${BLUE}🔗 Storefront: http://ola-shop.com${NC}"
echo -e "${BLUE}🔗 Admin: http://ola-shop.com/admin${NC}"
