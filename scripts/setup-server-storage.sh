#!/bin/bash

# Server Image Storage Setup Script
# This script automates the setup of server-based image storage
# Usage: sudo bash setup-server-storage.sh

set -e

echo "=========================================="
echo "Server Image Storage Setup"
echo "=========================================="

# Configuration
BASE_UPLOAD_PATH="/var/www/uploads/products"
WEB_USER="www-data"
DOMAIN="timossilo-polymobile.com"

echo ""
echo "Step 1: Creating upload directories..."
mkdir -p "$BASE_UPLOAD_PATH"
echo "✓ Created $BASE_UPLOAD_PATH"

echo ""
echo "Step 2: Setting directory ownership..."
chown -R $WEB_USER:$WEB_USER /var/www/uploads
echo "✓ Set ownership to $WEB_USER"

echo ""
echo "Step 3: Setting directory permissions..."
chmod -R 755 /var/www/uploads
chmod -R 775 "$BASE_UPLOAD_PATH"
echo "✓ Set permissions (755 for uploads, 775 for products)"

echo ""
echo "Step 4: Verifying directory structure..."
ls -la /var/www/uploads/
echo "✓ Directory structure verified"

echo ""
echo "Step 5: Nginx configuration test..."
if nginx -t 2>/dev/null; then
    echo "✓ Nginx configuration is valid"
else
    echo "⚠ Please manually verify Nginx configuration"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Add the following to your Nginx config:"
echo ""
echo "   location /uploads/products/ {"
echo "       alias /var/www/uploads/products/;"
echo "       expires 30d;"
echo "       add_header Cache-Control \"public, immutable\";"
echo "   }"
echo ""
echo "2. Reload Nginx:"
echo "   sudo systemctl reload nginx"
echo ""
echo "3. Update your .env.local file with:"
echo "   BASE_UPLOAD_PATH=$BASE_UPLOAD_PATH"
echo "   PUBLIC_BASE_URL=https://$DOMAIN/uploads/products"
echo ""
echo "4. Test upload by going to admin panel and uploading an image"
echo ""
echo "=========================================="
