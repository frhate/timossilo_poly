"use server"

import { createClient } from "@/lib/supabase/server"
import { sendOrderConfirmationMessage } from "@/lib/telegram/bot"

export async function createOrderWithTelegramConfirmation(orderData: {
  userId: string
  orderNumber: string
  totalAmount: number
  customerName: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerZip: string | null
  notes: string | null
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  telegramChatId?: string
}) {
  const supabase = await createClient()

  try {
    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.userId,
        order_number: orderData.orderNumber,
        total_amount: orderData.totalAmount,
        status: "pending",
        payment_method: "cod",
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        customer_city: orderData.customerCity,
        customer_zip: orderData.customerZip,
        notes: orderData.notes,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order insert error:", orderError)
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    if (!order) {
      throw new Error("Order was not created")
    }

    // Insert order items
    const orderItemsData = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData)

    if (itemsError) {
      console.error("Order items insert error:", itemsError)
      throw new Error(`Failed to create order items: ${itemsError.message}`)
    }

    // If Telegram chat ID is provided, send confirmation message
    if (orderData.telegramChatId) {
      try {
        await sendOrderConfirmationMessage(
          orderData.telegramChatId,
          order.id,
          orderData.orderNumber,
          orderData.totalAmount,
          orderData.userId
        )
      } catch (telegramError) {
        console.error("Failed to send Telegram message:", telegramError)
        // Don't fail the order if Telegram message fails
      }
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Order creation failed:", error)
    throw error
  }
}

export async function getUserTelegramChatId(userId: string): Promise<string | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_profiles")
    .select("telegram_chat_id")
    .eq("id", userId)
    .single()

  if (error || !data) {
    return null
  }

  return data.telegram_chat_id
}

