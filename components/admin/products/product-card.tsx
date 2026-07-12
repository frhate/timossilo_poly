"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Package } from "lucide-react"
import { type Product } from "@/lib/types/admin"
import { cn } from "@/lib/utils"

interface ProductCardProps {
    product: Product
    onEdit: (product: Product) => void
    onDelete: (id: string) => void
}

function formatPrice(value: number) {
    return new Intl.NumberFormat("fr-DZ", {
        style: "currency",
        currency: "DZD",
        maximumFractionDigits: 0,
    }).format(value)
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    const stock = product.stock ?? 0
    const stockVariant =
        stock === 0
            ? "bg-destructive/10 text-destructive"
            : stock <= 10
                ? "bg-amber-500/10 text-amber-600"
                : "bg-emerald-500/10 text-emerald-600"

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg">
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
                {product.image_urls?.[0] ? (
                    <Image
                        src={product.image_urls[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Package className="h-10 w-10 opacity-30" />
                    </div>
                )}
                <Badge className={cn("absolute left-2 top-2 text-[11px]", stockVariant)}>
                    {stock === 0 ? "Rupture" : `${stock} en stock`}
                </Badge>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-3">
                <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                        {product.name}
                    </h3>
                </div>
                <p className="text-base font-bold text-primary">{formatPrice(product.price)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    {product.brands?.name || "N/A"}
                    {product.categories?.name ? ` · ${product.categories.name}` : ""}
                </p>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onEdit(product)}
                    >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Modifier
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete(product.id)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

