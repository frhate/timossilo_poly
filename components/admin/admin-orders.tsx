"use client"

      import { createClient } from "@/lib/supabase/client"
      import { useState } from "react"
      import { OrderTable } from "./orders/order-table"
      import { type Order, type OrderStatus } from "@/lib/types/admin"
      import { useToast } from "@/hooks/use-toast"
import { OrderDetailsDialog } from "./orders/order-details-dialog"

      interface AdminOrdersProps {
        initialOrders: Order[]
      }

      export default function AdminOrders({ initialOrders }: AdminOrdersProps) {
        const [orders, setOrders] = useState(initialOrders)
          const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
          const [detailsOpen, setDetailsOpen] = useState(false)

          const handleViewDetails = (order: Order) => {
              setSelectedOrder(order)
              setDetailsOpen(true)
          }

          const supabase = createClient()
        const { toast } = useToast()

        const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
          try {
            const { error } = await supabase
              .from("orders")
              .update({ status: newStatus })
              .eq('id', orderId)

            if (error) throw error

            setOrders(orders.map((order: Order) =>
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


          return (
              <>
                  <OrderTable
                      orders={orders}
                      onStatusChange={handleUpdateStatus}
                      onViewDetails={handleViewDetails}
                  />
                  <OrderDetailsDialog
                      order={selectedOrder}
                      open={detailsOpen}
                      onOpenChange={setDetailsOpen}
                  />
              </>
          )
      }