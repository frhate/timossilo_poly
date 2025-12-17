import { NextRequest, NextResponse } from 'next/server'
  import { createClient } from '@/lib/supabase/server'
  import {
    sendConfirmationSuccessMessage,
    sendAdminNotification,
    getTelegramBot
  } from '@/lib/telegram/bot'

  export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
      console.log('📨 Webhook received:', JSON.stringify(body, null, 2))

      // Handle callback queries (button clicks)
      if (body.callback_query) {
        const callbackQuery = body.callback_query
        const data = callbackQuery.data as string
        const chatId = callbackQuery.message.chat.id.toString()
        const messageId = callbackQuery.message.message_id

        console.log('🔘 Button clicked:', data)

        const bot = getTelegramBot()
        const supabase = await createClient()

        // Confirm order
        if (data.startsWith('confirm_order_')) {
          const orderId = data.replace('confirm_order_', '')
          console.log('✅ Confirming order:', orderId)

          try {
            // Check if session exists in database
            const { data: session, error: sessionError } = await supabase
              .from('confirmation_sessions')
              .select('*')
              .eq('order_id', orderId)
              .single()

            console.log('Session:', session, 'Error:', sessionError)

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
            const { error: updateError } = await supabase
              .from('orders')
              .update({
                status: 'confirmed',
                confirmed_at: new Date().toISOString()
              })
              .eq('id', orderId)

            if (updateError) {
              console.error('❌ Failed to confirm order:', updateError)
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

            // **IMPORTANT: Answer callback query first to stop loading spinner**
            await bot.answerCallbackQuery(callbackQuery.id, {
              text: '✅ Commande confirmée avec succès !',
            })

            // Send success message to customer
            await sendConfirmationSuccessMessage(chatId, session.order_number)

            // Edit the original message to remove buttons
            await bot.editMessageReplyMarkup(
              { inline_keyboard: [] },
              { chat_id: chatId, message_id: messageId }
            )

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

            console.log('✅ Order confirmed successfully:', orderId)
          } catch (confirmError) {
            console.error('❌ Error in confirm flow:', confirmError)
            await bot.answerCallbackQuery(callbackQuery.id, {
              text: '❌ Erreur lors de la confirmation.',
              show_alert: true
            })
          }
        }

        // Cancel order
        else if (data.startsWith('cancel_order_')) {
          const orderId = data.replace('cancel_order_', '')
          console.log('❌ Cancelling order:', orderId)

          try {
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
            const { error: cancelError } = await supabase
              .from('orders')
              .update({
                status: 'cancelled',
                cancelled_at: new Date().toISOString()
              })
              .eq('id', orderId)

            if (cancelError) {
              console.error('❌ Failed to cancel order:', cancelError)
              await bot.answerCallbackQuery(callbackQuery.id, {
                text: '❌ Erreur lors de l\'annulation.',
                show_alert: true
              })
              return NextResponse.json({ ok: true })
            }

            // **IMPORTANT: Answer callback query first**
            await bot.answerCallbackQuery(callbackQuery.id, {
              text: 'Commande annulée.',
            })

            // Send cancellation message
            await bot.sendMessage(chatId, `❌ Commande \`${session.order_number}\` annulée.`, {
              parse_mode: 'Markdown'
            })

            // Edit the original message to remove buttons
            await bot.editMessageReplyMarkup(
              { inline_keyboard: [] },
              { chat_id: chatId, message_id: messageId }
            )

            // Clean up session from database
            await supabase
              .from('confirmation_sessions')
              .delete()
              .eq('order_id', orderId)

            console.log('✅ Order cancelled successfully:', orderId)
          } catch (cancelError) {
            console.error('❌ Error in cancel flow:', cancelError)
            await bot.answerCallbackQuery(callbackQuery.id, {
              text: '❌ Erreur lors de l\'annulation.',
              show_alert: true
            })
          }
        }
      }

      return NextResponse.json({ ok: true })
    } catch (error) {
      console.error('❌ Telegram webhook error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }