"use client"

import Image from "next/image"
import Link from "next/link"
import {useState} from "react"
import {useRouter} from "next/navigation"
import {createClient} from "@/lib/supabase/client"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {ShoppingCart, Check, Eye, Package} from "lucide-react"
import {cn} from "@/lib/utils"

interface Product {
    id: string
    name: string
    price: number
    image_urls: string []
    stock: number
}

export default function ProductCard({product}: { product: Product }) {
    const [isAdding, setIsAdding] = useState(false)
    const [isAdded, setIsAdded] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const formatPrice = (value: number) =>
        new Intl.NumberFormat("fr-DZ", {
            style: "currency",
            currency: "DZD",
            minimumFractionDigits: 2,
        }).format(value)

    const handleAddToCart = async () => {
        const {data: user} = await supabase.auth.getUser()

        if (!user.user) {
            router.push("/auth/login")
            return
        }

        if (product.stock === 0) return

        setIsAdding(true)
        try {
            // Vérifier si l'article existe déjà dans le panier
            const {data: existingItem, error: fetchError} = await supabase
                .from("cart_items")
                .select("id, quantity")
                .eq("user_id", user.user.id)
                .eq("product_id", product.id)
                .maybeSingle()

            if (fetchError) throw fetchError

            if (existingItem) {
                // Mettre à jour la quantité si l'article existe
                const newQuantity = existingItem.quantity + 1

                // Vérifier que la nouvelle quantité ne dépasse pas le stock
                if (newQuantity > product.stock) {
                    alert(`Stock insuffisant. Quantité maximale disponible: ${product.stock}`)
                    return
                }

                const {error: updateError} = await supabase
                    .from("cart_items")
                    .update({quantity: newQuantity})
                    .eq("id", existingItem.id)

                if (updateError) throw updateError
            } else {
                // Insérer un nouvel article
                const {error: insertError} = await supabase
                    .from("cart_items")
                    .insert({
                        user_id: user.user.id,
                        product_id: product.id,
                        quantity: 1,
                    })

                if (insertError) throw insertError
            }

            setIsAdded(true)
            setTimeout(() => setIsAdded(false), 2000)
        } catch (error: any) {
            console.error("Erreur lors de l'ajout au panier:", error)

            // Message d'erreur plus détaillé pour le débogage
            if (error?.code === '23505') {
                alert("Cet article est déjà dans votre panier.")
            } else {
                alert("Une erreur s'est produite. Veuillez réessayer.")
            }
        } finally {
            setIsAdding(false)
        }
    }
    const getStockStatus = () => {
        if (product.stock === 0) {
            return {
                label: "Rupture de stock",
                variant: "destructive" as const,
                bgClass: "bg-red-50",
                textClass: "text-red-700",
                badgeClass: "bg-red-100 text-red-800",
            }
        }
        if (product.stock <= 5) {
            return {
                label: `Dernières unités (${product.stock})`,
                variant: "warning" as const,
                bgClass: "bg-amber-50",
                textClass: "text-amber-700",
                badgeClass: "bg-amber-100 text-amber-800",
            }
        }
        return {
            label: "En stock",
            variant: "success" as const,
            bgClass: "bg-emerald-50",
            textClass: "text-emerald-700",
            badgeClass: "bg-emerald-100 text-emerald-800",
        }
    }

    const stockStatus = getStockStatus()
    const isOutOfStock = product.stock === 0

    return (
        <Card
            className="group h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50">
            {/* Image Container */}
<div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
{product.image_urls && product.image_urls.length > 0 ? (
    <Image
        src={product.image_urls[0]}
        alt={product.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
    />
) : (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
        <Package className="w-16 h-16 mb-3 opacity-30" strokeWidth={1.5}/>
        <span className="text-sm font-medium">Image non disponible</span>
    </div>
)}

                {/* Stock Badge */}
                <div className="absolute top-3 left-3">
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm",
                                stockStatus.badgeClass
                            )}
                        >
                          <span className={cn("w-2 h-2 rounded-full", stockStatus.textClass.replace("text-", "bg-"))}/>
                            {stockStatus.label}
                        </span>
                </div>

                {/* Hover Actions */}
                <div
                    className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-2">
                        <Link href={`/products/${product.id}`} className="flex-1">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full bg-white/95 hover:bg-white text-foreground shadow-lg"
                            >
                                <Eye className="w-4 h-4 mr-2"/>
                                Voir détails
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <CardContent className="flex-1 flex flex-col p-4 space-y-3">
                {/* Product Name */}
                <Link href={`/products/${product.id}`} className="group/link">
                    <h3 className="text-base font-semibold text-foreground line-clamp-2 leading-snug group-hover/link:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price & Stock Status */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3 mt-auto pt-2">
                    <div className="flex-1">
                        <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">
                            {formatPrice(product.price)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Prix TTC</p>
                    </div>


                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdding}
                    className={cn(
                        "w-full transition-all duration-200",
                        isAdded && "bg-emerald-600 hover:bg-emerald-700"
                    )}
                    size="default"
                >
                    {isAdded ? (
                        <>
                            <Check className="w-4 h-4 mr-2"/>
                            Ajouté au panier
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4 mr-2"/>
                            {isAdding ? "Ajout en cours..." : isOutOfStock ? "Rupture de stock" : "Ajouter au panier"}
                        </>
                    )}
                </Button>
            </CardContent>

            {/* Screen Reader Announcement */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {isAdded && `${product.name} a été ajouté au panier avec succès`}
            </div>
        </Card>
    )
}