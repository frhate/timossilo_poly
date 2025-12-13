import TelegramBot from 'node-telegram-bot-api'
import {createClient} from "@/lib/supabase/client";

// Store active confirmation sessions
// In production, use Redis or a database instead

export async function createConfirmationSession(
  orderId: string,
  orderNumber: string,
  totalAmount: number,
  chatId: string
) {
  const supabase = await createClient()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  const { error } = await supabase.from('confirmation_sessions').insert({
    order_id: orderId,
    order_number: orderNumber,
    total_amount: totalAmount,
    chat_id: chatId,
    expires_at: expiresAt.toISOString()
  })

  if (error) throw error
}





// Initialize the bot
let bot: TelegramBot | null = null

export function getTelegramBot(): TelegramBot {
  if (!bot) {
    const token = process.env.TELEGRAM_BOT_TOKEN || '8556852994:AAFK5FHXEfx6LsZCPX1VoffZ7-IKFEwCSfY'
    bot = new TelegramBot(token, { polling: false })
  }
  return bot
}

export async function sendOrderConfirmationMessage(
  chatId: string,
  orderId: string,
  orderNumber: string,
  totalAmount: number,
  userId: string
): Promise<void> {
  const bot = getTelegramBot()

  const message = `
🛒 *Nouvelle Commande*

Numéro de commande: \`${orderNumber}\`
Montant total: *${totalAmount.toFixed(2)} DA*

Veuillez confirmer votre commande en cliquant sur le bouton ci-dessous.

⚠️ Cette demande expire dans 24 heures.
`

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '✅ Confirmer la commande',
          callback_data: `confirm_order_${orderId}`
        }
      ],
      [
        {
          text: '❌ Annuler la commande',
          callback_data: `cancel_order_${orderId}`
        }
      ]
    ]
  }

  // Store session for 24 hours
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)

  confirmationSessions.set(orderId, {
    orderId,
    userId,
    orderNumber,
    totalAmount,
    expiresAt
  })

  await bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  })
}

export async function sendConfirmationSuccessMessage(
  chatId: string,
  orderNumber: string
): Promise<void> {
  const bot = getTelegramBot()

  const message = `
✅ *Commande Confirmée*

Votre commande \`${orderNumber}\` a été confirmée avec succès !

Merci pour votre confiance. Nous traitons votre commande.
`

  await bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown'
  })
}

export async function sendAdminNotification(
  adminChatId: string,
  orderId: string,
  orderNumber: string,
  customerName: string,
  totalAmount: number
): Promise<void> {
  const bot = getTelegramBot()

  const message = `
🔔 *Nouvelle Commande Confirmée*

Numéro: \`${orderNumber}\`
Client: ${customerName}
Montant: *${totalAmount.toFixed(2)} DA*

Une nouvelle commande a été confirmée par le client.
`

  await bot.sendMessage(adminChatId, message, {
    parse_mode: 'Markdown'
  })
}

// Clean up expired sessions
export function cleanupExpiredSessions(): void {
  const now = new Date()
  for (const [orderId, session] of confirmationSessions.entries()) {
    if (session.expiresAt < now) {
      confirmationSessions.delete(orderId)
    }
  }
}

