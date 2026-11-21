"use client"

import Image from "next/image"
import Link from "next/link"
import {useMemo, useState} from "react"
import {createClient} from "@/lib/supabase/client"
import {Check, Package, ShoppingCart} from "lucide-react"
import {cn} from "@/lib/utils"
import {guestCart} from "@/lib/cart-storage"
import {trackMetaEvent} from "@/lib/meta-pixel"

interface Product {
    id: string
    name: string
    price: number
    image_urls: string[]
    stock: number
}

export default function ProductCard({product}: { product: Product }) {
    const [isAdding, setIsAdding] = useState(false)
    const [isAdded, setIsAdded] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = useMemo(() => createClient(), [])

    const image = product.image_urls?.find((url) => Boolean(url))
    const isOutOfStock = product.stock <= 0
    const isLowStock = !isOutOfStock && product.stock <= 5
    const href = `/products/${product.id}`

    const formatPrice = (value: number) =>
        new Intl.NumberFormat("fr-DZ", {maximumFractionDigits: 0}).format(value) + " د.ج"

    const handleAddToCart = async () => {
        if (isOutOfStock) return

        setIsAdding(true)
        setError(null)

        try {
            // Read the live session so a logged-in user never lands in the guest cart.
            const {data: authData} = await supabase.auth.getSession()
            const userId = authData.session?.user?.id

            if (userId) {
                const {data: existingItem, error: fetchError} = await supabase
                    .from("cart_items")
                    .select("id, quantity")
                    .eq("user_id", userId)
                    .eq("product_id", product.id)
                    .maybeSingle()

                if (fetchError) throw fetchError

                const nextQuantity = Math.min((existingItem?.quantity ?? 0) + 1, product.stock)

                if (existingItem) {
                    const {error: updateError} = await supabase
                        .from("cart_items")
                        .update({quantity: nextQuantity})
                        .eq("id", existingItem.id)
                    if (updateError) throw updateError
                } else {
                    const {error: insertError} = await supabase
                        .from("cart_items")
                        .insert({
                            user_id: userId,
                            product_id: product.id,
                            quantity: 1,
                        })
                    if (insertError) throw insertError
                }
            } else {
                const existingItem = guestCart.getItems().find((item) => item.productId === product.id)
                const nextQuantity = Math.min((existingItem?.quantity ?? 0) + 1, product.stock)
                guestCart.setItem(product.id, nextQuantity)
            }

            setIsAdded(true)
            window.setTimeout(() => setIsAdded(false), 2000)

            trackMetaEvent("AddToCart", {
                content_ids: [product.id],
                content_type: "product",
                content_name: product.name,
                value: product.price,
                currency: "DZD",
                contents: [
                    {
                        id: product.id,
                        quantity: 1,
                        item_price: product.price,
                    },
                ],
            })
        } catch (cartError) {
            console.error("Erreur lors de l'ajout au panier:", cartError)
            setError("Erreur, réessayez")
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <article
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card",
                "shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300",
                "hover:-translate-y-0.5 hover:border-border hover:shadow-[0_24px_48px_-28px_rgba(16,24,40,0.28)]",
            )}
        >
            <Link
                href={href}
                aria-label={`Voir ${product.name}`}
                className="relative block aspect-square overflow-hidden bg-muted/20"
            >
                {image ? (
                    <Image
                        src={image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 33vw, 25vw"
                        className={cn(
                            "object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.04]",
                            isOutOfStock && "opacity-50 grayscale",
                        )}
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Package className="size-10 opacity-30" strokeWidth={1.25}/>
                        <span className="text-[11px] font-medium">Image non disponible</span>
                    </div>
                )}

                {isOutOfStock && (
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-border/60 bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur">
                        Épuisé
                    </span>
                )}
                {isLowStock && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/95 px-2.5 py-1 text-[11px] font-semibold text-amber-700 backdrop-blur dark:border-amber-900/40 dark:bg-amber-950/80 dark:text-amber-300">
                        <span className="size-1.5 rounded-full bg-amber-500"/>
                        Derniers {product.stock}
                    </span>
                )}
            </Link>

            <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
                <Link
                    href={href}
                    className="line-clamp-2 min-h-[2.5rem] text-[13px] font-medium leading-snug text-foreground transition-colors hover:text-primary sm:text-sm"
                >
                    {product.name}
                </Link>

                <div className="mt-auto space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                        <p className="text-base font-bold tracking-tight tabular-nums text-foreground sm:text-[17px]">
                            {formatPrice(product.price)}
                        </p>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            TTC
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isAdding}
                        className={cn(
                            "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-[13px] font-semibold transition-all",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed",
                            isAdded
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-border/70 bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/10 disabled:opacity-50",
                        )}
                    >
                        {isAdded ? (
                            <>
                                <Check className="size-4"/>
                                Ajouté
                            </>
                        ) : isOutOfStock ? (
                            "Rupture de stock"
                        ) : (
                            <>
                                <ShoppingCart className="size-4"/>
                                {isAdding ? "Ajout…" : "Ajouter"}
                            </>
                        )}
                    </button>

                    {error && (
                        <p role="alert" className="text-center text-[11px] font-medium text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    )}
                </div>
            </div>

            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {isAdded && `${product.name} a été ajouté au panier`}
            </div>
        </article>
    )
}
