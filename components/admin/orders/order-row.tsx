"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "./status-badge"
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types/admin"
import { Eye } from "lucide-react"

interface OrderRowProps {
  order: Order
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>
  onViewDetails: (order: Order) => void
}

export function OrderRow({ order, onStatusChange, onViewDetails }: OrderRowProps) {
  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-semibold text-primary">
        #{order.id.slice(0, 8)}
      </TableCell>
      <TableCell>{order.customer_phone}</TableCell>
      <TableCell className="font-medium">
        {order.total_amount.toLocaleString('ar-DZ')} دج
      </TableCell>
      <TableCell>
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
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(order.created_at).toLocaleDateString("ar-DZ", {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {new Date(order.created_at).toLocaleTimeString("ar-DZ", {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(order)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Détails
        </Button>
      </TableCell>
    </TableRow>
  )
}