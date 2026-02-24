#!/bin/bash
cd /root/ola-shop-v2/backend/medusa-server
export NODE_ENV=production
export PORT=9000
echo "Starting Medusa on Port 9000..."
npm start

