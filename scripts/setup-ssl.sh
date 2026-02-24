#!/bin/bash

# SSL Setup Script using Let's Encrypt

set -e

echo "🔒 Setting up SSL with Let's Encrypt..."
echo ""

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    
    if [ -f /etc/redhat-release ]; then
        dnf install certbot python3-certbot-nginx -y
    elif [ -f /etc/debian_version ]; then
        apt install certbot python3-certbot-nginx -y
    fi
    
    echo "✓ Certbot installed"
fi

# Get domain and email
read -p "Enter your domain [ola-shop.com]: " DOMAIN
DOMAIN=${DOMAIN:-ola-shop.com}

read -p "Enter your email for SSL notifications: " EMAIL

# Get certificate
echo ""
echo "📜 Obtaining SSL certificate..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

if [ $? -eq 0 ]; then
    echo "✓ SSL certificate obtained and configured"
    
    # Test auto-renewal
    echo ""
    echo "🔄 Testing auto-renewal..."
    certbot renew --dry-run
    
    echo ""
    echo "=========================================="
    echo "✅ SSL Setup Complete!"
    echo "=========================================="
    echo ""
    echo "🔒 Your site is now secure:"
    echo "   https://$DOMAIN"
    echo ""
    echo "📅 Certificate will auto-renew before expiry"
    echo ""
else
    echo "❌ Failed to obtain SSL certificate"
    echo "Please check:"
    echo "  1. Domain DNS points to this server"
    echo "  2. Ports 80 and 443 are open"
    echo "  3. Nginx is running"
    exit 1
fi
