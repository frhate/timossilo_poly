"use client"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { OrderTable } from "./orders/order-table"
import { type Order, type OrderStatus } from "@/lib/types/admin"
import { useToast } from "@/hooks/use-toast"

interface AdminOrdersProps {
  initialOrders: Order[]
}

export default function AdminOrders({ initialOrders }: AdminOrdersProps) {
  const [orders, setOrders] = useState(initialOrders)
  const supabase = createClient()
  const { toast } = useToast()

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId)

      if (error) throw error

      setOrders(orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ))

      toast({
        title: "Succès",
        description: "Statut de la commande mis à jour avec succès",
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour du statut de la commande",
        variant: "destructive",
      })
    }
  }

  return <OrderTable orders={orders} onStatusChange={handleUpdateStatus} />
}