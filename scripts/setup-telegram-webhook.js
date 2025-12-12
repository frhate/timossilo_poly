#!/usr/bin/env node

/**
 * Script to set up the Telegram webhook
 * Usage: node scripts/setup-telegram-webhook.js <your-domain.com>
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8556852994:AAFK5FHXEfx6LsZCPX1VoffZ7-IKFEwCSfY';

async function setupWebhook(domain) {
  if (!domain) {
    console.error('❌ Please provide your domain as an argument');
    console.log('Usage: node scripts/setup-telegram-webhook.js <your-domain.com>');
    process.exit(1);
  }

  const webhookUrl = `https://${domain}/api/telegram/webhook`;

  console.log(`🚀 Setting up webhook for: ${webhookUrl}`);

  try {
    // Delete existing webhook first
    const deleteResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`
    );
    const deleteData = await deleteResponse.json();

    if (!deleteData.ok) {
      console.warn('⚠️  Warning: Could not delete existing webhook');
    } else {
      console.log('✅ Existing webhook deleted');
    }

    // Set new webhook
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['callback_query'],
        }),
      }
    );

    const data = await response.json();

    if (data.ok) {
      console.log('✅ Webhook set successfully!');
      console.log(`📍 Webhook URL: ${webhookUrl}`);

      // Get webhook info
      const infoResponse = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
      );
      const infoData = await infoResponse.json();

      console.log('\n📊 Webhook Info:');
      console.log(JSON.stringify(infoData.result, null, 2));
    } else {
      console.error('❌ Failed to set webhook');
      console.error(data);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error setting webhook:', error);
    process.exit(1);
  }
}

// Get domain from command line arguments
const domain = process.argv[2];
setupWebhook(domain);

