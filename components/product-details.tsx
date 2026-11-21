"use client"

import Image from "next/image"
import Link from "next/link"
import {useEffect, useMemo, useState} from "react"
import {useRouter} from "next/navigation"
import {createClient} from "@/lib/supabase/client"
import {Button} from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    ArrowRight,
    Check,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Eye,
    Minus,
    Package,
    Plus,
    RotateCcw,
    ShieldCheck,
    ShoppingCart,
    Truck,
} from "lucide-react"
import type {Session, AuthChangeEvent} from "@supabase/supabase-js"
import {guestCart} from "@/lib/cart-storage"
import {setAdvancedMatching, trackMetaEvent} from "@/lib/meta-pixel"
import {cn} from "@/lib/utils"

interface Product {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    image_urls: string []
    categories: { name: string; id: string; slug?: string | null }
    brands?: { name: string; slug?: string | null } | null
    slug?: string | null
}

const VISITOR_STORAGE_PREFIX = "timossilo_product_viewed_"

export default function ProductDetails({product}: { product: Product }) {
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const [isAdded, setIsAdded] = useState(false)
    const [isBuying, setIsBuying] = useState(false)
    const [session, setSession] = useState<Session | null>(null)
    const [visitorCount, setVisitorCount] = useState<number | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [descriptionExpanded, setDescriptionExpanded] = useState(false)
    const [cartError, setCartError] = useState<string | null>(null)

    const router = useRouter()
    const supabase = useMemo(() => createClient(), [])

    const images = product.image_urls?.filter(Boolean) ?? []
    const hasImages = images.length > 0
    const activeImageIndex = Math.min(currentImageIndex, Math.max(images.length - 1, 0))
    const hasMultipleImages = images.length > 1
    const isOutOfStock = product.stock <= 0
    const isBusy = isAdding || isBuying

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}: { data: { session: Session | null } }) => {
            setSession(session)
        })

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    // Meta Manual Advanced Matching for logged-in visitors.
    useEffect(() => {
        if (!session?.user?.email) return
        setAdvancedMatching({
            email: session.user.email,
            externalId: session.user.id,
        })
    }, [session?.user?.email, session?.user?.id])

    useEffect(() => {
        trackMetaEvent("ViewContent", {
            content_ids: [product.id],
            content_type: "product",
            content_name: product.name,
            content_category: product.categories?.name,
            value: product.price,
            currency: "DZD",
        })
    }, [product.id, product.name, product.price, product.categories?.name])

    useEffect(() => {
        const trackView = async () => {
            try {
                const storageKey = `${VISITOR_STORAGE_PREFIX}${product.id}`
                const alreadyTracked = typeof window !== "undefined" && window.localStorage.getItem(storageKey) === "1"

                if (!alreadyTracked) {
                    const {error} = await supabase.from("product_views").insert({
                        product_id: product.id,
                        user_id: session?.user?.id ?? null,
                        visitor_key: typeof window !== "undefined" ? window.localStorage.getItem("visitor_key") || null : null,
                    })

                    if (!error && typeof window !== "undefined") {
                        window.localStorage.setItem(storageKey, "1")
                    }
                }

                const {count} = await supabase
                    .from("product_views")
                    .select("id", {count: "exact", head: true})
                    .eq("product_id", product.id)

                setVisitorCount(count ?? 0)
            } catch (error) {
                console.error("Error tracking product view:", error)
            }
        }

        trackView()
    }, [product.id, session?.user?.id, supabase])

    useEffect(() => {
        if (!isAdded) return
        const timeout = window.setTimeout(() => setIsAdded(false), 2200)
        return () => window.clearTimeout(timeout)
    }, [isAdded])

    const formatPrice = (value: number) =>
        new Intl.NumberFormat("fr-DZ", {maximumFractionDigits: 0}).format(value) + " د.ج"

    const stockBadge = isOutOfStock
        ? {
            label: "Rupture de stock",
            className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300",
            dot: "bg-red-500",
        }
        : product.stock <= 5
            ? {
                label: `Plus que ${product.stock} en stock`,
                className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300",
                dot: "bg-amber-500",
            }
            : {
                label: "En stock",
                className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300",
                dot: "bg-emerald-500",
            }

    const subtotal = product.price * quantity
    const canIncrease = !isOutOfStock && quantity < product.stock
    const canDecrease = quantity > 1

    const persistToCart = async () => {
        if (isOutOfStock) return

        // Read the current session instead of relying on state that may not
        // have resolved yet, so a logged-in user never lands in the guest cart.
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

            const nextQuantity = Math.min((existingItem?.quantity ?? 0) + quantity, product.stock)

            if (existingItem) {
                const {error} = await supabase
                    .from("cart_items")
                    .update({quantity: nextQuantity})
                    .eq("id", existingItem.id)
                if (error) throw error
            } else {
                const {error} = await supabase
                    .from("cart_items")
                    .insert({
                        user_id: userId,
                        product_id: product.id,
                        quantity: nextQuantity,
                    })
                if (error) throw error
            }
            return
        }

        const existingItem = guestCart.getItems().find((item) => item.productId === product.id)
        const nextQuantity = Math.min((existingItem?.quantity ?? 0) + quantity, product.stock)
        guestCart.setItem(product.id, nextQuantity)
    }

    const trackAddToCart = () => {
        trackMetaEvent("AddToCart", {
            content_ids: [product.id],
            content_type: "product",
            content_name: product.name,
            content_category: product.categories?.name,
            value: product.price * quantity,
            currency: "DZD",
            contents: [
                {
                    id: product.id,
                    quantity,
                    item_price: product.price,
                },
            ],
        })
    }

    const handleAddToCart = async () => {
        if (isOutOfStock) return

        setIsAdding(true)
        setCartError(null)
        try {
            await persistToCart()
            trackAddToCart()
            setIsAdded(true)
        } catch (error) {
            console.error(error)
            setCartError("Impossible d'ajouter ce produit au panier. Veuillez réessayer.")
        } finally {
            setIsAdding(false)
        }
    }

    const handleBuyNow = async () => {
        if (isOutOfStock) return

        setIsBuying(true)
        setCartError(null)
        try {
            await persistToCart()
            trackAddToCart()
            router.push("/checkout")
        } catch (error) {
            console.error(error)
            setCartError("Une erreur est survenue. Veuillez réessayer.")
            setIsBuying(false)
        }
    }

    const goToPreviousImage = () => {
        if (!hasMultipleImages) return
        setCurrentImageIndex((index) => (index - 1 + images.length) % images.length)
    }

    const goToNextImage = () => {
        if (!hasMultipleImages) return
        setCurrentImageIndex((index) => (index + 1) % images.length)
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-7xl px-4 pb-28 pt-5 sm:px-6 lg:pb-16">
                {/* Breadcrumb */}
                <nav
                    aria-label="Fil d'Ariane"
                    className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
                >
                    <Link href="/" className="rounded-md px-1 py-0.5 transition-colors hover:text-foreground">
                        Accueil
                    </Link>
                    <ChevronRight className="size-3.5 shrink-0 opacity-60"/>
                    <Link
                        href={product.categories?.slug ? `/products?category=${product.categories.slug}` : "/products"}
                        className="rounded-md px-1 py-0.5 transition-colors hover:text-foreground"
                    >
                        {product.categories?.name}
                    </Link>
                    {product.brands?.name && (
                        <>
                            <ChevronRight className="size-3.5 shrink-0 opacity-60"/>
                            <Link
                                href={product.brands.slug ? `/products?brand=${product.brands.slug}` : "/products"}
                                className="rounded-md px-1 py-0.5 transition-colors hover:text-foreground"
                            >
                                {product.brands.name}
                            </Link>
                        </>
                    )}
                    <ChevronRight className="size-3.5 shrink-0 opacity-60"/>
                    <span className="max-w-[38ch] truncate font-medium text-foreground">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,470px)] lg:gap-12 xl:gap-16">
                    {/* Gallery */}
                    <div className="space-y-4 lg:sticky lg:top-24">
                        <div className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-muted/30">
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-primary/20 blur-3xl"
                            />
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-primary/10 blur-3xl"
                            />

                            <div className="relative aspect-square w-full">
                                {hasImages ? (
                                    <Image
                                        src={images[activeImageIndex] ?? "/placeholder.svg"}
                                        alt={`${product.name} - image ${activeImageIndex + 1}`}
                                        fill
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 55vw"
                                        className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.03] sm:p-10"
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                                        <Package className="size-16 opacity-30" strokeWidth={1.25}/>
                                        <span className="text-sm font-medium">Image non disponible</span>
                                    </div>
                                )}
                            </div>

                            {/* Badges */}
                            <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur",
                                        stockBadge.className,
                                    )}
                                >
                                    <span className={cn("size-1.5 rounded-full", stockBadge.dot)}/>
                                    {stockBadge.label}
                                </span>
                                {product.brands?.name && (
                                    <span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
                                        {product.brands.name}
                                    </span>
                                )}
                            </div>

                            {hasMultipleImages && (
                                <>
                                    <span className="absolute bottom-4 right-4 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium tabular-nums backdrop-blur">
                                        {activeImageIndex + 1} / {images.length}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={goToPreviousImage}
                                        aria-label="Image précédente"
                                        className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/85 shadow-sm backdrop-blur transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-11"
                                    >
                                        <ChevronLeft className="size-5"/>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goToNextImage}
                                        aria-label="Image suivante"
                                        className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/85 shadow-sm backdrop-blur transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-11"
                                    >
                                        <ChevronRight className="size-5"/>
                                    </button>
                                </>
                            )}
                        </div>

                        {hasMultipleImages && (
                            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {images.map((url, index) => (
                                    <button
                                        key={`${url}-${index}`}
                                        type="button"
                                        onClick={() => setCurrentImageIndex(index)}
                                        aria-label={`Voir l'image ${index + 1}`}
                                        aria-current={index === activeImageIndex}
                                        className={cn(
                                            "relative size-18 shrink-0 overflow-hidden rounded-2xl border-2 bg-muted/30 transition sm:size-20",
                                            index === activeImageIndex
                                                ? "border-primary ring-2 ring-primary/25"
                                                : "border-transparent opacity-60 hover:opacity-100",
                                        )}
                                    >
                                        <Image
                                            src={url}
                                            alt=""
                                            fill
                                            sizes="80px"
                                            className="object-contain p-2"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="space-y-7">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Link
                                    href={product.categories?.slug ? `/products?category=${product.categories.slug}` : "/products"}
                                    className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/25"
                                >
                                    {product.categories?.name}
                                </Link>
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                                        stockBadge.className,
                                    )}
                                >
                                    <span className={cn("size-1.5 rounded-full", stockBadge.dot)}/>
                                    {stockBadge.label}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.7rem]">
                                {product.name}
                            </h1>

                            <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                                <p className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                                    {formatPrice(product.price)}
                                </p>
                                <p className="pb-1 text-sm text-muted-foreground">Prix TTC</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1">
                                    <CreditCard className="size-3.5"/>
                                    Paiement à la livraison
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1">
                                    <Eye className="size-3.5"/>
                                    <span className="font-semibold tabular-nums text-foreground">
                                        {visitorCount === null ? "—" : visitorCount}
                                    </span>
                                    visite{visitorCount === 1 ? "" : "s"} sur ce produit
                                </span>
                            </div>
                        </div>

                        {product.description && (
                            <div className="space-y-2">
                                <p
                                    className={cn(
                                        "whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground",
                                        !descriptionExpanded && "line-clamp-4",
                                    )}
                                >
                                    {product.description}
                                </p>
                                {product.description.length > 180 && (
                                    <button
                                        type="button"
                                        onClick={() => setDescriptionExpanded((value) => !value)}
                                        className="text-sm font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 transition hover:opacity-80"
                                    >
                                        {descriptionExpanded ? "Voir moins" : "Voir plus"}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Purchase card */}
                        <div className="space-y-5 rounded-3xl border border-border/70 bg-card p-5 shadow-xl shadow-black/[0.04] sm:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm font-semibold text-foreground">Quantité</span>
                                <div className="flex items-center rounded-full border border-border bg-background p-1">
                                    <button
                                        type="button"
                                        onClick={() => canDecrease && setQuantity((value) => Math.max(1, value - 1))}
                                        disabled={!canDecrease}
                                        aria-label="Diminuer la quantité"
                                        className="flex size-9 items-center justify-center rounded-full transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Minus className="size-4"/>
                                    </button>
                                    <span className="min-w-10 text-center text-base font-bold tabular-nums">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => canIncrease && setQuantity((value) => Math.min(product.stock, value + 1))}
                                        disabled={!canIncrease}
                                        aria-label="Augmenter la quantité"
                                        className="flex size-9 items-center justify-center rounded-full transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Plus className="size-4"/>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
                                <span className="text-sm font-medium text-muted-foreground">Sous-total</span>
                                <span className="text-2xl font-bold tracking-tight text-foreground">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {cartError && (
                                    <p
                                        role="alert"
                                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300"
                                    >
                                        {cartError}
                                    </p>
                                )}
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock || isBusy}
                                    size="lg"
                                    className={cn(
                                        "h-14 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/20 transition-all",
                                        isAdded && "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-600",
                                    )}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check className="size-5"/>
                                            Ajouté au panier
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="size-5"/>
                                            {isAdding ? "Ajout en cours…" : isOutOfStock ? "Rupture de stock" : "Ajouter au panier"}
                                        </>
                                    )}
                                </Button>

                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handleBuyNow}
                                        disabled={isOutOfStock || isBusy}
                                        size="lg"
                                        variant="outline"
                                        className="h-12 flex-1 rounded-2xl text-base font-semibold"
                                    >
                                        {isBuying ? "Redirection…" : "Commander maintenant"}
                                        <ArrowRight className="size-4"/>
                                    </Button>
                                    {isAdded && (
                                        <Link
                                            href="/cart"
                                            className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-2xl px-4 text-sm font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 transition hover:opacity-80"
                                        >
                                            Voir le panier
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400"/>
                                Aucun prépaiement — vous payez à la réception
                            </div>
                        </div>

                        {/* Reassurance */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-border/60 bg-card/60 p-4 text-center">
                                <Truck className="mx-auto mb-2 size-5 text-foreground/80"/>
                                <p className="text-xs font-semibold text-foreground">Livraison 2 à 5 jours</p>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">Jours ouvrables</p>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-card/60 p-4 text-center">
                                <RotateCcw className="mx-auto mb-2 size-5 text-foreground/80"/>
                                <p className="text-xs font-semibold text-foreground">Retour sous 30 jours</p>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">Garantie remboursement</p>
                            </div>
                            <div className="col-span-2 rounded-2xl border border-border/60 bg-card/60 p-4 text-center sm:col-span-1">
                                <Package className="mx-auto mb-2 size-5 text-foreground/80"/>
                                <p className="text-xs font-semibold text-foreground">Produit original</p>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">Contrôlé avant envoi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <section className="mt-12 sm:mt-16">
                    <div className="rounded-3xl border border-border/70 bg-card p-2 sm:p-4">
                        <Accordion type="single" collapsible defaultValue="delivery">
                            <AccordionItem value="delivery" className="px-3 sm:px-4">
                                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                    Livraison & paiement
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        <li className="flex gap-2.5">
                                            <Truck className="mt-0.5 size-4 shrink-0 text-foreground/70"/>
                                            <span>Livraison estimée sous 2 à 5 jours ouvrables vers votre wilaya.</span>
                                        </li>
                                        <li className="flex gap-2.5">
                                            <CreditCard className="mt-0.5 size-4 shrink-0 text-foreground/70"/>
                                            <span>Paiement à la livraison : vous réglez uniquement à la réception de votre commande.</span>
                                        </li>
                                        <li className="flex gap-2.5">
                                            <Package className="mt-0.5 size-4 shrink-0 text-foreground/70"/>
                                            <span>Chaque commande est vérifiée et emballée avec soin avant expédition.</span>
                                        </li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="warranty" className="px-3 sm:px-4">
                                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                    Garantie & retours
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        <li className="flex gap-2.5">
                                            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-foreground/70"/>
                                            <span>Garantie de remboursement de 30 jours sur les produits éligibles.</span>
                                        </li>
                                        <li className="flex gap-2.5">
                                            <RotateCcw className="mt-0.5 size-4 shrink-0 text-foreground/70"/>
                                            <span>Un produit reçu endommagé ou non conforme peut être retourné ou échangé.</span>
                                        </li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>

                <div className="sr-only" aria-live="polite">
                    {isAdded ? `${product.name} ajouté au panier` : ""}
                </div>
            </div>

            {/* Mobile sticky purchase bar */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-muted-foreground">{product.name}</p>
                        <p className="text-lg font-bold leading-tight">{formatPrice(subtotal)}</p>
                    </div>
                    <Button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isBusy}
                        className={cn(
                            "h-12 shrink-0 rounded-2xl px-5 text-sm font-semibold",
                            isAdded && "bg-emerald-600 text-white hover:bg-emerald-600",
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
                    </Button>
                </div>
            </div>
        </div>
    )
}
