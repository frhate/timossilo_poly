import TelegramBot from 'node-telegram-bot-api'
        import { createClient } from "@/lib/supabase/server"

        let bot: TelegramBot | null = null

export function getTelegramBot(): TelegramBot {
  if (!bot) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN environment variable is not set')
    }
    bot = new TelegramBot(token, { polling: false })
  }
  return bot
}

        function escapeHtml(value: string | number | null | undefined): string {
          return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        }

        function formatAmount(amount: number): string {
          return `${amount.toFixed(2)} DA`
        }

        export async function sendOrderNotification(
          chatId: string,
          orderDetails: {
            orderNumber: string
            customerName: string
            customerAddress: string
            customerCity?: string
            customerPhone: string
            items: Array<{ name: string; quantity: number; price: number }>
            totalAmount: number
          }
        ) {
          try {
            const bot = getTelegramBot()

            const itemsList = orderDetails.items
              .map((item, index) => {
                const lineTotal = item.price * item.quantity
                return [
                  `${index + 1}. <b>${escapeHtml(item.name)}</b>`,
                  `    ${item.quantity} × ${formatAmount(item.price)} = ${formatAmount(lineTotal)}`,
                ].join('\n')
              })
              .join('\n\n')

            const receivedAt = new Intl.DateTimeFormat('fr-FR', {
              dateStyle: 'short',
              timeStyle: 'short',
              timeZone: 'Africa/Algiers',
            }).format(new Date())

            const message = [
              '🛍️ <b>Nouvelle commande</b>',
              '',
              `<b>Référence :</b> <code>${escapeHtml(orderDetails.orderNumber)}</code>`,
              '',
              '━━━━━━━━━━━━━━━━━━━━',
              '',
              '<b>👤 Informations client</b>',
              `<b>Nom :</b> ${escapeHtml(orderDetails.customerName)}`,
              `<b>Téléphone :</b> ${escapeHtml(orderDetails.customerPhone)}`,
              `<b>Adresse :</b> ${escapeHtml(orderDetails.customerAddress)}`,
              ...(orderDetails.customerCity
                ? [`<b>Commune / Wilaya :</b> ${escapeHtml(orderDetails.customerCity)}`]
                : []),
              '',
              '<b>📦 Articles</b>',
              itemsList || 'Aucun article',
              '',
              '━━━━━━━━━━━━━━━━━━━━',
              '',
              `<b>💰 Total :</b> ${formatAmount(orderDetails.totalAmount)}`,
              '<b>💳 Paiement :</b> À la livraison',
              '',
              '✅ <i>Commande enregistrée avec succès.</i>',
              `<i>Reçue le ${receivedAt}</i>`,
            ].join('\n')

            console.log(`📤 Sending Telegram notification to chat ID: ${chatId}`)
            const result = await bot.sendMessage(chatId, message, {
              parse_mode: 'HTML'
            })
            console.log(`✅ Telegram notification sent successfully (message ID: ${result.message_id})`)

            return result
          } catch (error) {
            console.error('❌ Failed to send Telegram notification:', error)
            throw error
          }
        }

        // Clean up expired sessions from database
        export async function cleanupExpiredSessions(): Promise<void> {
          const supabase = await createClient()
          const now = new Date().toISOString()

          await supabase
            .from('confirmation_sessions')
            .delete()
            .lt('expires_at', now)
        }