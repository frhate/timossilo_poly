#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

async function testTelegramNotification() {
  console.log('🧪 Testing Telegram Notification...\n');

  if (!BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN environment variable is not set');
    console.log('Please check your .env.local file');
    process.exit(1);
  }

  if (!ADMIN_CHAT_ID) {
    console.error('❌ TELEGRAM_ADMIN_CHAT_ID environment variable is not set');
    console.log('Please check your .env.local file');
    process.exit(1);
  }

  console.log('✅ Environment variables found:');
  console.log(`   Bot Token: ${BOT_TOKEN.substring(0, 10)}...`);
  console.log(`   Admin Chat ID: ${ADMIN_CHAT_ID}\n`);

  try {
    const bot = new TelegramBot(BOT_TOKEN, { polling: false });

    // Test message
    const testMessage = `
🧪 *Test Notification*

This is a test notification from Timossilo Poly.

📋 *Test Order*: TEST-${Date.now()}
👤 *Customer*: Test Customer
📞 *Phone*: +212 6 12 34 56 78
📍 *Address*: 123 Test Street, Casablanca

✅ If you see this message, your Telegram integration is working!
    `.trim();

    console.log('📤 Sending test message...');
    await bot.sendMessage(ADMIN_CHAT_ID, testMessage, {
      parse_mode: 'Markdown'
    });

    console.log('✅ Test message sent successfully!');
    console.log('\n🎉 Your Telegram notification system is working correctly!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send test message:', error);
    console.error('\nPossible issues:');
    console.error('1. Invalid bot token');
    console.error('2. Invalid chat ID');
    console.error('3. Bot not started by the user (send /start to the bot first)');
    console.error('4. Network connectivity issues');
    process.exit(1);
  }
}

testTelegramNotification();

