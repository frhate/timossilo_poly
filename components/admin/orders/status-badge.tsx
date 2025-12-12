import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/lib/types/admin"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(ORDER_STATUS_COLORS[status], "font-medium", className)}
    >
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  )
}

