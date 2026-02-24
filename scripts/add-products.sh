#!/bin/bash

# Quick script to add 50 featured products to Medusa
# Run this on the VPS: bash add-products.sh

echo "🚀 Adding 50 Featured Products to Medusa..."
echo ""

cd /root/ola-shop-v2

# Install axios if not already installed
echo "📦 Installing dependencies..."
npm install axios --save

# Run the product addition script
echo ""
echo "📦 Adding products..."
node add-featured-products.js

echo ""
echo "✅ Done! Check the output above for results."
echo ""
echo "🔄 Now restart your storefront to see the products:"
echo "   cd apps/storefront"
echo "   npm run dev"
