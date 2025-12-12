"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "./status-badge"
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types/admin"
import { formatCurrency } from "@/lib/utils"

interface OrderRowProps {
  order: Order
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>
}

export function OrderRow({ order, onStatusChange }: OrderRowProps) {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3 font-semibold text-primary">{order.order_number}</td>
      <td className="p-3">{order.customer_name}</td>
      <td className="p-3 font-medium">{order.total_amount.toLocaleString('ar-DZ')} دج</td>
      <td className="p-3">
        <Select
          value={order.status}
          onValueChange={(value) => onStatusChange(order.id, value as OrderStatus)}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue>
              <StatusBadge status={order.status} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="p-3 text-muted-foreground">
        {new Date(order.created_at).toLocaleDateString("ar-DZ", {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </td>
      <td className="p-3 text-xs text-muted-foreground">
        {new Date(order.created_at).toLocaleTimeString("ar-DZ", {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </td>
    </tr>
  )
}

