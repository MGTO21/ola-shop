#!/bin/bash

###############################################################################
# Ola Shop v2.0 - Deployment Script
# Server: 46.224.43.113 (Ubuntu 24.04)
# Date: December 3, 2025
###############################################################################

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Ola Shop v2.0 - Deployment Starting...            ║${NC}"
echo -e "${GREEN}║         Server: 46.224.43.113                              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Update system
echo -e "${BLUE}[1/10] Updating system...${NC}"
apt update && apt upgrade -y

# Install essential tools
echo -e "${BLUE}[2/10] Installing essential tools...${NC}"
apt install -y curl wget git build-essential ufw fail2ban unzip

# Configure firewall
echo -e "${BLUE}[3/10] Configuring firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Install Node.js 20 LTS
echo -e "${BLUE}[4/10] Installing Node.js 20 LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
echo -e "${BLUE}[5/10] Installing PM2...${NC}"
npm install -g pm2

# Install PostgreSQL
echo -e "${BLUE}[6/10] Installing PostgreSQL...${NC}"
apt install -y postgresql postgresql-contrib

# Create database
echo -e "${BLUE}[7/10] Creating database...${NC}"
DB_PASSWORD=$(openssl rand -base64 32)
sudo -u postgres psql << EOF
CREATE DATABASE ola_shop;
CREATE USER ola_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE ola_shop TO ola_user;
ALTER DATABASE ola_shop OWNER TO ola_user;
\q
EOF

# Install Redis
echo -e "${BLUE}[8/10] Installing Redis...${NC}"
apt install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# Install Nginx
echo -e "${BLUE}[9/10] Installing Nginx...${NC}"
apt install -y nginx
systemctl enable nginx
systemctl start nginx

# Install Certbot
echo -e "${BLUE}[10/10] Installing Certbot for SSL...${NC}"
apt install -y certbot python3-certbot-nginx

# Create directories
mkdir -p /var/www/ola-shop/{backend,frontend,logs,backups}

# Save credentials
mkdir -p /root/ola-credentials
cat > /root/ola-credentials/database.txt << EOF
Database Name: ola_shop
Database User: ola_user
Database Password: $DB_PASSWORD
Database Host: localhost
Database Port: 5432

Connection String:
postgresql://ola_user:$DB_PASSWORD@localhost:5432/ola_shop
EOF

# Create backup script
cat > /var/www/ola-shop/backups/backup.sh << 'BACKUP_SCRIPT'
#!/bin/bash
BACKUP_DIR=/var/www/ola-shop/backups
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump ola_shop > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql
ls -t $BACKUP_DIR/db_backup_*.sql.gz | tail -n +8 | xargs rm -f
echo "Backup completed: db_backup_$DATE.sql.gz"
BACKUP_SCRIPT
chmod +x /var/www/ola-shop/backups/backup.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/ola-shop/backups/backup.sh") | crontab -

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Installation Complete! ✓                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Server IP: 46.224.43.113${NC}"
echo -e "${YELLOW}Node.js: $(node -v)${NC}"
echo -e "${YELLOW}Database credentials saved to: /root/ola-credentials/database.txt${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Upload your application files to /var/www/ola-shop/"
echo "2. Configure environment files"
echo "3. Start your applications with PM2"
echo "4. Configure Nginx for your domain"
echo "5. Install SSL certificate"
echo ""
echo -e "${GREEN}Ready for deployment! 🚀${NC}"
