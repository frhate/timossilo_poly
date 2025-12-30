import TelegramBot from 'node-telegram-bot-api'
        import { createClient } from "@/lib/supabase/server"

        let bot: TelegramBot | null = null

        export function getTelegramBot(): TelegramBot {
          if (!bot) {
            const token = process.env.TELEGRAM_BOT_TOKEN || '8556852994:AAFK5FHXEfx6LsZCPX1VoffZ7-IKFEwCSfY'
            bot = new TelegramBot(token, { polling: false })
          }
          return bot
        }

        export async function sendOrderNotification(
          chatId: string,
          orderDetails: {
            orderNumber: string
            customerName: string
            customerAddress: string
            customerPhone: string
            items: Array<{ name: string; quantity: number; price: number }>
            totalAmount: number
          }
        ) {
          const bot = getTelegramBot()

          const itemsList = orderDetails.items
            .map((item, index) =>
              `${index + 1}. ${item.name}\n   Quantité: ${item.quantity} × ${item.price.toFixed(2)} MAD`
            )
            .join('\n\n')

          const message = `
        🛍️ *Nouvelle Commande*
        
        📋 *Numéro de commande*: \`${orderDetails.orderNumber}\`
        
        👤 *Informations Client*
        Nom: ${orderDetails.customerName}
        Téléphone: ${orderDetails.customerPhone}
        Adresse: ${orderDetails.customerAddress}
        
        📦 *Produits commandés*
        ${itemsList}
        
        💰 *Montant Total*: ${orderDetails.totalAmount.toFixed(2)} MAD
        
        ✅ Commande enregistrée avec succès
          `.trim()

          await bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown'
          })
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