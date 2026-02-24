#!/bin/bash

###############################################################################
# Ola Shop v2.0 - Auto Installation Script
# For Ubuntu 22.04 LTS
# This script will install everything needed for your e-commerce platform
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run as root. Run as a regular user with sudo privileges."
    exit 1
fi

print_info "Starting Ola Shop v2.0 Installation..."
echo ""

###############################################################################
# PHASE 1: System Update & Basic Security
###############################################################################

print_info "PHASE 1: System Update & Security Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Update system
print_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated"

# Install essential tools
print_info "Installing essential tools..."
sudo apt install -y curl wget git build-essential ufw fail2ban
print_success "Essential tools installed"

# Configure UFW Firewall
print_info "Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw --force enable
print_success "Firewall configured"

###############################################################################
# PHASE 2: Install Node.js
###############################################################################

print_info "PHASE 2: Installing Node.js"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install Node.js 20 LTS
print_info "Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
print_success "Node.js $(node -v) installed"
print_success "npm $(npm -v) installed"

# Install PM2
print_info "Installing PM2..."
sudo npm install -g pm2
pm2 startup systemd -u $USER --hp $HOME
print_success "PM2 installed"

###############################################################################
# PHASE 3: Install PostgreSQL
###############################################################################

print_info "PHASE 3: Installing PostgreSQL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install PostgreSQL
print_info "Installing PostgreSQL 15..."
sudo apt install -y postgresql postgresql-contrib
print_success "PostgreSQL installed"

# Generate random password for database
DB_PASSWORD=$(openssl rand -base64 32)

# Create database and user
print_info "Creating database and user..."
sudo -u postgres psql << EOF
CREATE DATABASE ola_shop;
CREATE USER ola_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE ola_shop TO ola_user;
ALTER DATABASE ola_shop OWNER TO ola_user;
\q
EOF
print_success "Database 'ola_shop' created"
print_success "User 'ola_user' created"

# Save credentials
mkdir -p ~/ola-shop-credentials
cat > ~/ola-shop-credentials/database.txt << EOF
Database Name: ola_shop
Database User: ola_user
Database Password: $DB_PASSWORD
Database Host: localhost
Database Port: 5432

Connection String:
postgresql://ola_user:$DB_PASSWORD@localhost:5432/ola_shop
EOF
print_success "Database credentials saved to ~/ola-shop-credentials/database.txt"

###############################################################################
# PHASE 4: Install Redis
###############################################################################

print_info "PHASE 4: Installing Redis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install Redis
print_info "Installing Redis..."
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
print_success "Redis installed and running"

###############################################################################
# PHASE 5: Install Nginx
###############################################################################

print_info "PHASE 5: Installing Nginx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install Nginx
print_info "Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
print_success "Nginx installed and running"

###############################################################################
# PHASE 6: Install Certbot for SSL
###############################################################################

print_info "PHASE 6: Installing Certbot"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install Certbot
print_info "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx
print_success "Certbot installed"

###############################################################################
# PHASE 7: Create Project Directories
###############################################################################

print_info "PHASE 7: Creating Project Structure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create directories
print_info "Creating project directories..."
mkdir -p ~/ola-shop/{backend,frontend,logs,backups}
print_success "Project directories created"

###############################################################################
# PHASE 8: Setup Environment Files
###############################################################################

print_info "PHASE 8: Creating Environment Templates"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backend .env template
cat > ~/ola-shop/backend/.env.template << 'EOF'
# Database
DATABASE_URL=postgresql://ola_user:YOUR_DB_PASSWORD@localhost:5432/ola_shop

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=9000
NODE_ENV=production

# JWT Secret (generate a strong random string)
JWT_SECRET=YOUR_JWT_SECRET_HERE

# Cookie Secret (generate a strong random string)
COOKIE_SECRET=YOUR_COOKIE_SECRET_HERE

# Admin
ADMIN_EMAIL=admin@ola-shop.com
ADMIN_PASSWORD=CHANGE_THIS_PASSWORD

# Store
STORE_CORS=https://ola-shop.com,https://www.ola-shop.com
EOF

# Frontend .env template
cat > ~/ola-shop/frontend/.env.template << 'EOF'
# API URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.ola-shop.com

# Site URL
NEXT_PUBLIC_SITE_URL=https://ola-shop.com

# Environment
NODE_ENV=production
EOF

print_success "Environment templates created"

###############################################################################
# PHASE 9: Create Deployment Scripts
###############################################################################

print_info "PHASE 9: Creating Helper Scripts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backup script
cat > ~/ola-shop/backups/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=~/ola-shop/backups
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump ola_shop > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql
# Keep only last 7 backups
ls -t $BACKUP_DIR/db_backup_*.sql.gz | tail -n +8 | xargs rm -f
echo "Backup completed: db_backup_$DATE.sql.gz"
EOF
chmod +x ~/ola-shop/backups/backup.sh
print_success "Backup script created"

# Status check script
cat > ~/ola-shop/status.sh << 'EOF'
#!/bin/bash
echo "=== Ola Shop Status ==="
echo ""
echo "PostgreSQL:"
sudo systemctl status postgresql --no-pager | grep Active
echo ""
echo "Redis:"
sudo systemctl status redis-server --no-pager | grep Active
echo ""
echo "Nginx:"
sudo systemctl status nginx --no-pager | grep Active
echo ""
echo "PM2 Processes:"
pm2 list
echo ""
echo "Disk Usage:"
df -h | grep -E '^/dev/'
echo ""
echo "Memory Usage:"
free -h
EOF
chmod +x ~/ola-shop/status.sh
print_success "Status script created"

###############################################################################
# PHASE 10: Setup Cron Jobs
###############################################################################

print_info "PHASE 10: Setting up Automated Tasks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Add daily backup to cron
(crontab -l 2>/dev/null; echo "0 2 * * * ~/ola-shop/backups/backup.sh") | crontab -
print_success "Daily backup scheduled (2 AM)"

###############################################################################
# INSTALLATION COMPLETE
###############################################################################

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "Installation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_info "What was installed:"
echo "  ✓ Node.js $(node -v)"
echo "  ✓ npm $(npm -v)"
echo "  ✓ PM2 (Process Manager)"
echo "  ✓ PostgreSQL (Database)"
echo "  ✓ Redis (Cache)"
echo "  ✓ Nginx (Web Server)"
echo "  ✓ Certbot (SSL)"
echo "  ✓ UFW Firewall"
echo ""

print_info "Important Files:"
echo "  📁 Project Directory: ~/ola-shop/"
echo "  🔐 Database Credentials: ~/ola-shop-credentials/database.txt"
echo "  📝 Backend .env Template: ~/ola-shop/backend/.env.template"
echo "  📝 Frontend .env Template: ~/ola-shop/frontend/.env.template"
echo "  🔧 Status Script: ~/ola-shop/status.sh"
echo "  💾 Backup Script: ~/ola-shop/backups/backup.sh"
echo ""

print_warning "NEXT STEPS:"
echo ""
echo "1. View your database credentials:"
echo "   cat ~/ola-shop-credentials/database.txt"
echo ""
echo "2. Upload your application code to:"
echo "   Backend:  ~/ola-shop/backend/"
echo "   Frontend: ~/ola-shop/frontend/"
echo ""
echo "3. Configure environment files:"
echo "   cp ~/ola-shop/backend/.env.template ~/ola-shop/backend/.env"
echo "   cp ~/ola-shop/frontend/.env.template ~/ola-shop/frontend/.env"
echo "   nano ~/ola-shop/backend/.env  # Edit with your values"
echo ""
echo "4. Install dependencies and start services:"
echo "   cd ~/ola-shop/backend && npm install"
echo "   cd ~/ola-shop/frontend && npm install && npm run build"
echo ""
echo "5. Setup Nginx for your domain:"
echo "   sudo nano /etc/nginx/sites-available/ola-shop"
echo ""
echo "6. Get SSL certificate:"
echo "   sudo certbot --nginx -d ola-shop.com -d www.ola-shop.com"
echo ""

print_info "Check system status anytime:"
echo "   ~/ola-shop/status.sh"
echo ""

print_success "Server is ready for deployment! 🚀"
echo ""
