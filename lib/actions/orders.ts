"use server"

    import { createClient } from "@/lib/supabase/server"
    import { sendOrderNotification } from "@/lib/telegram/bot"

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

        // Fetch product details for the notification
        const { data: orderItemsWithProducts } = await supabase
          .from("order_items")
          .select("*, products(name)")
          .eq("order_id", order.id)

        const items = orderItemsWithProducts?.map(item => ({
          name: item.products.name,
          quantity: item.quantity,
          price: item.price
        })) || []

        // Send Telegram notification using customer phone as chat ID
        try {
          await sendOrderNotification(orderData.customerPhone, {
            orderNumber: orderData.orderNumber,
            customerName: orderData.customerName,
            customerAddress: orderData.customerAddress,
            customerPhone: orderData.customerPhone,
            items,
            totalAmount: orderData.totalAmount
          })
        } catch (telegramError) {
          console.error("Failed to send Telegram message:", telegramError)
          // Don't fail the order if Telegram message fails
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

    export async function createGuestOrder(orderData: {
      guestEmail: string
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
    }) {
      const supabase = await createClient()

      try {
        // Insert guest order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            guest_email: orderData.guestEmail,
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
          console.error("Guest order insert error:", orderError)
          throw new Error(`Failed to create guest order: ${orderError.message}`)
        }

        if (!order) {
          throw new Error("Guest order was not created")
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
          console.error("Guest order items insert error:", itemsError)
          throw new Error(`Failed to create guest order items: ${itemsError.message}`)
        }

        // Fetch product details for the notification
        const { data: orderItemsWithProducts } = await supabase
          .from("order_items")
          .select("*, products(name)")
          .eq("order_id", order.id)

        const items = orderItemsWithProducts?.map(item => ({
          name: item.products.name,
          quantity: item.quantity,
          price: item.price
        })) || []

        // Send Telegram notification to admin
        try {
          const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID
          if (adminChatId) {
            await sendOrderNotification(adminChatId, {
              orderNumber: orderData.orderNumber,
              customerName: orderData.customerName,
              customerAddress: orderData.customerAddress,
              customerPhone: orderData.customerPhone,
              items,
              totalAmount: orderData.totalAmount
            })
          } else {
            console.warn("TELEGRAM_ADMIN_CHAT_ID not configured, skipping notification")
          }
        } catch (telegramError) {
          console.error("Failed to send Telegram message:", telegramError)
          // Don't fail the order if Telegram message fails
        }

        return { success: true, orderId: order.id }
      } catch (error) {
        console.error("Guest order creation failed:", error)
        throw error
      }
    }