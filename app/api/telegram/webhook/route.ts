import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  sendConfirmationSuccessMessage,
  sendAdminNotification,
  getTelegramBot
} from '@/lib/telegram/bot'

// This endpoint will handle Telegram webhook callbacks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle callback queries (button clicks)
    if (body.callback_query) {
      const callbackQuery = body.callback_query
      const data = callbackQuery.data as string
      const chatId = callbackQuery.message.chat.id.toString()
      const messageId = callbackQuery.message.message_id

      const bot = getTelegramBot()
      const supabase = await createClient()

      // Confirm order
      if (data.startsWith('confirm_order_')) {
        const orderId = data.replace('confirm_order_', '')

        // Check if session exists in database
        const { data: session, error: sessionError } = await supabase
          .from('confirmation_sessions')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (!session || sessionError) {
          await bot.answerCallbackQuery(callbackQuery.id, {
            text: '⚠️ Cette demande a expiré.',
            show_alert: true
          })
          return NextResponse.json({ ok: true })
        }

        // Check if session is expired
        if (new Date(session.expires_at) < new Date()) {
          await supabase
            .from('confirmation_sessions')
            .delete()
            .eq('order_id', orderId)

          await bot.answerCallbackQuery(callbackQuery.id, {
            text: '⚠️ Cette demande a expiré.',
            show_alert: true
          })
          return NextResponse.json({ ok: true })
        }

        // Update order status in database
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'confirmed',
            confirmed_at: new Date().toISOString()
          })
          .eq('id', orderId)

        if (error) {
          console.error('Failed to confirm order:', error)
          await bot.answerCallbackQuery(callbackQuery.id, {
            text: '❌ Erreur lors de la confirmation.',
            show_alert: true
          })
          return NextResponse.json({ ok: true })
        }

        // Get order details for admin notification
        const { data: orderData } = await supabase
          .from('orders')
          .select('customer_name')
          .eq('id', orderId)
          .single()

        // Send success message to customer
        await sendConfirmationSuccessMessage(chatId, session.order_number)

        // Edit the original message to remove buttons
        await bot.editMessageReplyMarkup(
          { inline_keyboard: [] },
          { chat_id: chatId, message_id: messageId }
        )

        // Notify the user
        await bot.answerCallbackQuery(callbackQuery.id, {
          text: '✅ Commande confirmée avec succès !',
        })

        // Send notification to admin
        const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID
        if (adminChatId) {
          await sendAdminNotification(
            adminChatId,
            orderId,
            session.order_number,
            orderData?.customer_name || 'N/A',
            session.total_amount
          )
        }

        // Clean up session from database
        await supabase
          .from('confirmation_sessions')
          .delete()
          .eq('order_id', orderId)
      }

      // Cancel order
      else if (data.startsWith('cancel_order_')) {
        const orderId = data.replace('cancel_order_', '')

        // Check if session exists in database
        const { data: session, error: sessionError } = await supabase
          .from('confirmation_sessions')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (!session || sessionError) {
          await bot.answerCallbackQuery(callbackQuery.id, {
            text: '⚠️ Cette demande a expiré.',
            show_alert: true
          })
          return NextResponse.json({ ok: true })
        }

        // Check if session is expired
        if (new Date(session.expires_at) < new Date()) {
          await supabase
            .from('confirmation_sessions')
            .delete()
            .eq('order_id', orderId)

          await bot.answerCallbackQuery(callbackQuery.id, {
            text: '⚠️ Cette demande a expiré.',
            show_alert: true
          })
          return NextResponse.json({ ok: true })
        }

        // Update order status to cancelled
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString()
          })
          .eq('id', orderId)

        if (error) {
          console.error('Failed to cancel order:', error)
          await bot.answerCallbackQuery(callbackQuery.id, {
            text: '❌ Erreur lors de l\'annulation.',
            show_alert: true
          })
          return NextResponse.json({ ok: true })
        }

        // Send cancellation message
        await bot.sendMessage(chatId, `❌ Commande \`${session.order_number}\` annulée.`, {
          parse_mode: 'Markdown'
        })

        // Edit the original message to remove buttons
        await bot.editMessageReplyMarkup(
          { inline_keyboard: [] },
          { chat_id: chatId, message_id: messageId }
        )

        await bot.answerCallbackQuery(callbackQuery.id, {
          text: 'Commande annulée.',
        })

        // Clean up session from database
        await supabase
          .from('confirmation_sessions')
          .delete()
          .eq('order_id', orderId)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}