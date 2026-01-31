#!/bin/bash

# Cloudinary to Server Storage Migration Script
# This script helps migrate existing images from Cloudinary to server storage
#
# Prerequisites:
# - curl installed
# - jq installed (for JSON parsing)
# - Cloudinary API credentials
#
# Usage: bash migrate-cloudinary-to-server.sh <cloud_name> <api_key> <api_secret>

set -e

CLOUD_NAME=$1
API_KEY=$2
API_SECRET=$3
UPLOAD_DIR="/var/www/uploads/products"

if [ -z "$CLOUD_NAME" ] || [ -z "$API_KEY" ] || [ -z "$API_SECRET" ]; then
    echo "Usage: bash migrate-cloudinary-to-server.sh <cloud_name> <api_key> <api_secret>"
    echo ""
    echo "Get your credentials from Cloudinary Dashboard:"
    echo "1. Visit https://cloudinary.com/console"
    echo "2. Copy your Cloud Name from the dashboard"
    echo "3. Go to Settings → API Keys"
    echo "4. Copy your API Key and API Secret"
    exit 1
fi

echo "=========================================="
echo "Cloudinary to Server Storage Migration"
echo "=========================================="
echo ""
echo "Cloud Name: $CLOUD_NAME"
echo "Upload Directory: $UPLOAD_DIR"
echo ""
echo "Note: This is a helper script. For production migration:"
echo "1. Use Cloudinary's bulk export feature"
echo "2. Download all images locally"
echo "3. Organize by product ID"
echo "4. Use rsync to upload to server"
echo ""
echo "Example workflow:"
echo ""
echo "  # On your local machine:"
echo "  mkdir -p ~/cloudinary-backup"
echo "  cd ~/cloudinary-backup"
echo "  # Use Cloudinary's API to list all resources"
echo "  curl -u \$API_KEY:\$API_SECRET \\"
echo "    'https://api.cloudinary.com/v1_1/\$CLOUD_NAME/resources/image?max_results=500' \\"
echo "    | jq '.resources[].url' -r > urls.txt"
echo ""
echo "  # Download all images"
echo "  cat urls.txt | xargs -P 10 wget"
echo ""
echo "  # Organize by product ID"
echo "  for img in *.jpg; do"
echo "    mkdir -p \"products/\$PRODUCT_ID\""
echo "    mv \"\$img\" \"products/\$PRODUCT_ID/\""
echo "  done"
echo ""
echo "  # Upload to server"
echo "  rsync -avz products/ user@server:/var/www/uploads/products/"
echo ""
echo "=========================================="

echo ""
echo "For detailed migration instructions, see:"
echo "- SERVER_STORAGE_GUIDE.md (Database Migration section)"
echo "- https://cloudinary.com/documentation/upload_widget#migration"
