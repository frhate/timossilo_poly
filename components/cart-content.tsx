"use client"

import Image from "next/image"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {useEffect, useMemo, useState} from "react"
import {createClient} from "@/lib/supabase/client"
import {guestCart} from "@/lib/cart-storage"
import {Button} from "@/components/ui/button"
import {Skeleton} from "@/components/ui/skeleton"
import {
    AlertCircle,
    ArrowRight,
    CreditCard,
    Minus,
    Package,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Trash2,
    Truck,
    X,
} from "lucide-react"
import {cn} from "@/lib/utils"

interface CartItem {
    id: string
    product_id: string
    quantity: number
    products: {
        id: string
        name: string
        price: number
        image_urls: string[]
        stock: number
    }
}

interface ProductRow {
    id: string
    name: string
    price: number
    image_urls: string[]
    stock: number
}

export default function CartContent({initialCartItems, isGuest}: {
    initialCartItems: CartItem[] | null
    isGuest: boolean
}) {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems || [])
    const [pendingId, setPendingId] = useState<string | null>(null)
    const [isLoadingCart, setIsLoadingCart] = useState(isGuest)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = useMemo(() => createClient(), [])

    // Load guest cart from localStorage once the client is available.
    useEffect(() => {
        if (!isGuest) return

        let cancelled = false

        const loadGuestCart = async () => {
            const guestCartItems = guestCart.getItems()

            if (guestCartItems.length === 0) {
                if (!cancelled) {
                    setCartItems([])
                    setIsLoadingCart(false)
                }
                return
            }

            const productIds = guestCartItems.map((item) => item.productId)
            const {data: products} = await supabase
                .from("products")
                .select("id, name, price, image_urls, stock")
                .in("id", productIds)

            if (cancelled) return

            const rows = (products ?? []) as ProductRow[]

            const fullCartItems = guestCartItems
                .map((item) => {
                    const product = rows.find((candidate) => candidate.id === item.productId)
                    return {
                        id: item.productId,
                        product_id: item.productId,
                        quantity: item.quantity,
                        products: product!,
                    }
                })
                .filter((item) => Boolean(item.products))

            setCartItems(fullCartItems)
            setIsLoadingCart(false)
        }

        loadGuestCart()

        return () => {
            cancelled = true
        }
    }, [isGuest, supabase])

    const formatPrice = (value: number) =>
        new Intl.NumberFormat("fr-DZ", {maximumFractionDigits: 0}).format(value) + " د.ج"

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.products.price) * item.quantity,
        0,
    )
    const shippingCost = 0
    const total = subtotal + shippingCost

    const itemKey = (item: CartItem) => (isGuest ? item.product_id : item.id)

    const handleUpdateQuantity = async (item: CartItem, nextQuantity: number) => {
        const key = itemKey(item)
        const clamped = Math.min(Math.max(1, nextQuantity), item.products.stock)

        if (clamped === item.quantity || pendingId === key) return

        setPendingId(key)
        setError(null)

        const previousItems = cartItems
        setCartItems((items) =>
            items.map((candidate) =>
                itemKey(candidate) === key ? {...candidate, quantity: clamped} : candidate,
            ),
        )

        try {
            if (isGuest) {
                guestCart.updateQuantity(key, clamped)
            } else {
                const {error: updateError} = await supabase
                    .from("cart_items")
                    .update({quantity: clamped})
                    .eq("id", key)

                if (updateError) throw updateError
            }
        } catch (updateError) {
            console.error("Erreur lors de la mise à jour:", updateError)
            setCartItems(previousItems)
            setError("Impossible de mettre à jour la quantité. Veuillez réessayer.")
        } finally {
            setPendingId(null)
        }
    }

    const handleRemoveItem = async (item: CartItem) => {
        const key = itemKey(item)
        if (pendingId === key) return

        setPendingId(key)
        setError(null)

        const previousItems = cartItems
        setCartItems((items) => items.filter((candidate) => itemKey(candidate) !== key))

        try {
            if (isGuest) {
                guestCart.removeItem(key)
            } else {
                const {error: deleteError} = await supabase
                    .from("cart_items")
                    .delete()
                    .eq("id", key)

                if (deleteError) throw deleteError
            }
        } catch (deleteError) {
            console.error("Erreur lors de la suppression:", deleteError)
            setCartItems(previousItems)
            setError("Impossible de retirer ce produit. Veuillez réessayer.")
        } finally {
            setPendingId(null)
        }
    }

    const handleCheckout = () => {
        router.push("/checkout")
    }

    if (isLoadingCart) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
                    <div className="mb-8 space-y-2">
                        <Skeleton className="h-3 w-28"/>
                        <Skeleton className="h-9 w-48"/>
                        <Skeleton className="h-4 w-40"/>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-12">
                        <div className="space-y-3 lg:col-span-8">
                            {Array.from({length: 3}).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 rounded-3xl border border-border/60 bg-card p-3 sm:gap-4 sm:p-4"
                                >
                                    <Skeleton className="size-20 shrink-0 rounded-2xl sm:size-28"/>
                                    <div className="flex-1 space-y-3 py-1">
                                        <Skeleton className="h-4 w-3/4"/>
                                        <Skeleton className="h-3 w-24"/>
                                        <div className="flex items-center justify-between pt-3">
                                            <Skeleton className="h-9 w-28 rounded-full"/>
                                            <Skeleton className="h-4 w-20"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-4">
                            <div className="rounded-3xl border border-border/60 bg-card p-5">
                                <Skeleton className="h-5 w-24"/>
                                <div className="mt-5 space-y-3">
                                    <Skeleton className="h-4 w-full"/>
                                    <Skeleton className="h-4 w-full"/>
                                    <Skeleton className="h-8 w-full"/>
                                </div>
                                <Skeleton className="mt-5 h-12 w-full rounded-xl"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:pb-12">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Votre sélection
                        </p>
                        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                            Mon panier
                        </h1>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            {itemCount} article{itemCount !== 1 ? "s" : ""}
                            {itemCount > 0 && " · Paiement à la livraison"}
                        </p>
                    </div>

                    <Link
                        href="/products"
                        className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                    >
                        Continuer mes achats
                        <ArrowRight className="size-4"/>
                    </Link>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-4 flex items-start gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                    >
                        <AlertCircle className="mt-0.5 size-4 shrink-0"/>
                        <p className="flex-1">{error}</p>
                        <button
                            type="button"
                            onClick={() => setError(null)}
                            aria-label="Masquer le message"
                            className="flex size-5 items-center justify-center rounded-full transition-colors hover:bg-destructive/10"
                        >
                            <X className="size-3.5"/>
                        </button>
                    </div>
                )}

                {cartItems.length === 0 ? (
                    /* Empty cart */
                    <div className="rounded-3xl border border-border/60 bg-card px-6 py-16 text-center sm:py-20">
                        <span className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-foreground">
                            <ShoppingBag className="size-9" strokeWidth={1.5}/>
                        </span>
                        <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
                            Votre panier est vide
                        </h2>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            Ajoutez vos produits préférés et retrouvez-les ici. Livraison rapide,
                            paiement à la réception.
                        </p>

                        <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
                            <Link
                                href="/products"
                                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 sm:w-auto"
                            >
                                Découvrir les produits
                                <ArrowRight className="size-4"/>
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex h-11 w-full items-center justify-center rounded-xl px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:w-auto"
                            >
                                Retour à l&apos;accueil
                            </Link>
                        </div>

                        <ul className="mx-auto mt-10 grid max-w-lg gap-3 text-left sm:grid-cols-3">
                            <li className="flex items-center gap-2 rounded-2xl border border-border/50 bg-background/60 px-3 py-2.5 text-[11px] text-muted-foreground">
                                <Truck className="size-4 shrink-0"/>
                                Livraison 2 à 5 jours
                            </li>
                            <li className="flex items-center gap-2 rounded-2xl border border-border/50 bg-background/60 px-3 py-2.5 text-[11px] text-muted-foreground">
                                <CreditCard className="size-4 shrink-0"/>
                                Paiement à la réception
                            </li>
                            <li className="flex items-center gap-2 rounded-2xl border border-border/50 bg-background/60 px-3 py-2.5 text-[11px] text-muted-foreground">
                                <ShieldCheck className="size-4 shrink-0"/>
                                Produits garantis
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="grid items-start gap-6 lg:grid-cols-12">
                        {/* Items */}
                        <div className="space-y-3 lg:col-span-8">
                            {cartItems.map((item) => {
                                const key = itemKey(item)
                                const isPending = pendingId === key
                                const isOutOfStock = item.products.stock <= 0
                                const isLowStock = !isOutOfStock && item.products.stock <= 5
                                const canIncrease = item.quantity < item.products.stock

                                return (
                                    <article
                                        key={item.id}
                                        aria-busy={isPending}
                                        className={cn(
                                            "group flex gap-3 rounded-3xl border border-border/60 bg-card p-3 transition-all sm:gap-4 sm:p-4",
                                            "hover:border-border hover:shadow-[0_16px_32px_-24px_rgba(16,24,40,0.25)]",
                                            isPending && "opacity-60",
                                        )}
                                    >
                                        <Link
                                            href={`/products/${item.product_id}`}
                                            className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted/20 sm:size-28"
                                            aria-label={`Voir ${item.products.name}`}
                                        >
                                            {item.products.image_urls?.[0] ? (
                                                <Image
                                                    src={item.products.image_urls[0]}
                                                    alt={item.products.name}
                                                    fill
                                                    sizes="(max-width: 640px) 80px, 112px"
                                                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.04]"
                                                />
                                            ) : (
                                                <span className="flex h-full items-center justify-center">
                                                    <Package className="size-8 text-muted-foreground/40"/>
                                                </span>
                                            )}
                                        </Link>

                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/products/${item.product_id}`}
                                                        className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-primary sm:text-[15px]"
                                                    >
                                                        {item.products.name}
                                                    </Link>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {formatPrice(item.products.price)}
                                                        <span className="text-[11px]"> / unité</span>
                                                    </p>
                                                    {isLowStock && (
                                                        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                                            <span className="size-1.5 rounded-full bg-amber-500"/>
                                                            Plus que {item.products.stock}
                                                        </span>
                                                    )}
                                                    {isOutOfStock && (
                                                        <span className="mt-1.5 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
                                                            Rupture de stock
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(item)}
                                                    disabled={isPending}
                                                    aria-label={`Retirer ${item.products.name} du panier`}
                                                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                                >
                                                    <Trash2 className="size-4"/>
                                                </button>
                                            </div>

                                            <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                                                <div className="flex items-center rounded-full border border-border bg-background p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                        disabled={isPending}
                                                        aria-label="Diminuer la quantité"
                                                        className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Minus className="size-3.5"/>
                                                    </button>
                                                    <span className="min-w-8 text-center text-sm font-bold tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                        disabled={isPending || !canIncrease}
                                                        aria-label="Augmenter la quantité"
                                                        className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Plus className="size-3.5"/>
                                                    </button>
                                                </div>

                                                <p className="text-sm font-bold tabular-nums text-foreground sm:text-base">
                                                    {formatPrice(item.products.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}

                            <Link
                                href="/products"
                                className="inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowRight className="size-4 rotate-180"/>
                                Continuer mes achats
                            </Link>
                        </div>

                        {/* Summary */}
                        <aside className="lg:col-span-4">
                            <div className="space-y-3 lg:sticky lg:top-24">
                                <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
                                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                                        Résumé de la commande
                                    </h2>

                                    <dl className="mt-4 space-y-3 text-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <dt className="text-muted-foreground">
                                                Sous-total ({itemCount} article{itemCount !== 1 ? "s" : ""})
                                            </dt>
                                            <dd className="font-semibold tabular-nums text-foreground">
                                                {formatPrice(subtotal)}
                                            </dd>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <dt className="text-muted-foreground">Livraison</dt>
                                            <dd className="font-medium text-muted-foreground">
                                                Selon la wilaya
                                            </dd>
                                        </div>
                                    </dl>

                                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-border/60 pt-4">
                                        <span className="text-sm font-semibold text-foreground">Total</span>
                                        <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                        Les frais de livraison sont calculés à l&apos;étape suivante.
                                    </p>

                                    <Button
                                        onClick={handleCheckout}
                                        size="lg"
                                        className="mt-4 h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/20"
                                    >
                                        Passer la commande
                                        <ArrowRight className="size-4"/>
                                    </Button>

                                    <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                                        <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400"/>
                                        Aucun prépaiement — vous payez à la réception
                                    </p>
                                </div>

                                <ul className="space-y-2.5 rounded-3xl border border-border/60 bg-card/60 p-4 text-[11px] text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <Truck className="size-4 shrink-0"/>
                                        Livraison en 2 à 5 jours ouvrables
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CreditCard className="size-4 shrink-0"/>
                                        Paiement à la livraison partout en Algérie
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ShieldCheck className="size-4 shrink-0"/>
                                        Produits vérifiés avant expédition
                                    </li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}
            </div>

            {/* Mobile checkout bar */}
            {cartItems.length > 0 && (
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-muted-foreground">
                                Total ({itemCount} article{itemCount !== 1 ? "s" : ""})
                            </p>
                            <p className="text-lg font-bold leading-tight tabular-nums text-foreground">
                                {formatPrice(total)}
                            </p>
                        </div>
                        <Button
                            onClick={handleCheckout}
                            className="h-12 shrink-0 rounded-xl px-5 text-sm font-semibold"
                        >
                            Commander
                            <ArrowRight className="size-4"/>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
