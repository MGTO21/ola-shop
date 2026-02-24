#!/bin/bash

# Nginx Configuration Script for Ola Shop v2.0

set -e

echo "🔧 Configuring Nginx for Ola Shop..."
echo ""

# Get domain
read -p "Enter your domain [ola-shop.com]: " DOMAIN
DOMAIN=${DOMAIN:-ola-shop.com}

# Create Nginx config
cat > /etc/nginx/conf.d/ola-shop.conf << EOF
# Ola Shop - Frontend & Backend Configuration

# Redirect www to non-www
server {
    listen 80;
    server_name www.$DOMAIN;
    return 301 http://$DOMAIN\$request_uri;
}

# Main server block
server {
    listen 80;
    server_name $DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/ola-shop-access.log;
    error_log /var/log/nginx/ola-shop-error.log;

    # Backend API Uploads (Port 9001)
    location /api/uploads/ {
        proxy_pass http://localhost:9001/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }


    # Admin dashboard
    location /admin {
        proxy_pass http://localhost:9000/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "✓ Nginx configuration created"

# Test configuration
echo ""
echo "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✓ Configuration is valid"
    
    # Reload Nginx
    echo ""
    read -p "Reload Nginx now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        systemctl reload nginx
        echo "✓ Nginx reloaded"
    fi
else
    echo "❌ Configuration has errors"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Nginx Configuration Complete!"
echo "=========================================="
echo ""
echo "🌐 Your site should now be accessible at:"
echo "   http://$DOMAIN"
echo ""
echo "🔒 Next step: Enable SSL"
echo "   Run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
