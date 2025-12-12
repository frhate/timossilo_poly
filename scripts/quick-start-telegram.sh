#!/bin/bash

# Telegram Bot Quick Start Script
# This script helps you set up the Telegram bot integration

echo "🚀 Telegram Bot Setup - Quick Start"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from .env.telegram.example...${NC}"
    cp .env.telegram.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
else
    echo -e "${GREEN}✅ .env.local found${NC}"
fi

# Check if TELEGRAM_BOT_TOKEN is set
if ! grep -q "TELEGRAM_BOT_TOKEN" .env.local; then
    echo -e "${YELLOW}⚠️  Adding TELEGRAM_BOT_TOKEN to .env.local${NC}"
    echo "" >> .env.local
    echo "# Telegram Bot Configuration" >> .env.local
    echo "TELEGRAM_BOT_TOKEN=8556852994:AAFK5FHXEfx6LsZCPX1VoffZ7-IKFEwCSfY" >> .env.local
    echo "TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id" >> .env.local
    echo -e "${GREEN}✅ Added Telegram configuration${NC}"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Get your Admin Chat ID:"
echo "   a. Open Telegram and search for your bot"
echo "   b. Send any message to your bot"
echo "   c. Visit: https://api.telegram.org/bot8556852994:AAFK5FHXEfx6LsZCPX1VoffZ7-IKFEwCSfY/getUpdates"
echo "   d. Copy the 'chat.id' value"
echo "   e. Update TELEGRAM_ADMIN_CHAT_ID in .env.local"
echo ""
echo "2. Run Database Migration:"
echo "   a. Go to your Supabase Dashboard > SQL Editor"
echo "   b. Run the SQL from: scripts/add-telegram-fields.sql"
echo ""
echo "3. Deploy your application to production"
echo ""
echo "4. Set up webhook (after deployment):"
echo "   node scripts/setup-telegram-webhook.js your-domain.com"
echo ""
echo "5. Test the integration:"
echo "   a. Go to /account and link your Telegram account"
echo "   b. Place a test order"
echo "   c. Check Telegram for confirmation message"
echo ""
echo -e "${GREEN}✅ Setup script complete!${NC}"
echo ""
echo "For detailed instructions, see: TELEGRAM_IMPLEMENTATION.md"

