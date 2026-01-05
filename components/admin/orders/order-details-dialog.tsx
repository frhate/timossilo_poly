"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {type Order} from "@/lib/types/admin"
import {formatCurrency} from "@/lib/utils"

interface OrderDetailsDialogProps {
    order: Order | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({order, open, onOpenChange}: OrderDetailsDialogProps) {
    if (!order) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Détails de la commande #{order.id.slice(0, 8)}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Informations client</h3>
                        <p className="text-sm"><span className="font-medium">Téléphone:</span> {order.customer_phone}</p>
                        <p className="text-sm"><span className="font-medium">Adresse:</span> {order.customer_address}</p>
                        <p className="text-sm"><span className="font-medium">City:</span> {order.customer_city}</p>
                        <p className="text-sm"><span className="font-medium">Zip:</span> {order.customer_zip}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Produits commandés</h3>
                        <div className="space-y-3">
                            {order.order_items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 border rounded-lg p-3">
                                    {item.products.image_urls?.[0] && (
                                        <img
                                            src={item.products.image_urls[0]}
                                            alt={item.products.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium">{item.products.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Quantité: {item.quantity} × {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        {formatCurrency(item.quantity * item.price)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-3 border-t">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>{formatCurrency(order.total_amount)}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}