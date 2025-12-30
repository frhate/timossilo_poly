"use client"

import Image from "next/image"
import Link from "next/link"
import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
import {createClient} from "@/lib/supabase/client"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {ShoppingCart, Check, ChevronLeft, Package, Truck, Shield} from "lucide-react"
import type {Session, AuthChangeEvent} from "@supabase/supabase-js"
import {guestCart} from "@/lib/cart-storage"

interface Product {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    image_urls: string []
    categories: { name: string; id: string }
}

export default function ProductDetails({product}: { product: Product }) {
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const [isAdded, setIsAdded] = useState(false)
    const [session, setSession] = useState<Session | null>(null)
    const router = useRouter()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const supabase = createClient()

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
    }, [])

    const formatPrice = (value: number) =>
        new Intl.NumberFormat("fr-DZ", {maximumFractionDigits: 0}).format(value) + " د.ج"

    const handleAddToCart = async () => {
        if (product.stock === 0) return

        setIsAdding(true)
        try {
            if (session?.user) {
                // Authenticated user - add to database
                const {error} = await supabase.from("cart_items").upsert(
                    {
                        user_id: session.user.id,
                        product_id: product.id,
                        quantity,
                    },
                    {
                        onConflict: "user_id,product_id",
                    }
                )
                if (error) throw error
            } else {
                // Guest user - add to localStorage
                const existingItems = guestCart.getItems()
                const existingItem = existingItems.find(item => item.productId === product.id)
                const newQuantity = existingItem ? existingItem.quantity + quantity : quantity
                guestCart.setItem(product.id, newQuantity)
            }

            setIsAdded(true)
            setTimeout(() => setIsAdded(false), 1600)
            setTimeout(() => router.push("/cart"), 900)
        } catch (e) {
            console.error(e)
        } finally {
            setIsAdding(false)
        }
    }

    const canIncrease = quantity < product.stock
    const canDecrease = quantity > 1

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4"/>
                        Retour aux produits
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">{product.categories.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Image Section */}
                    <div className="space-y-4">
                        <Card className="overflow-hidden border-2 shadow-lg">
                            <div
                                className="relative w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
                                <Image
                                    src={product.image_urls[currentImageIndex] ?? "/placeholder.svg"}
                                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-contain p-4 pointer-events-none"
                                    priority
                                />

                                {/* Navigation Arrows */}
                                {product.image_urls.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentImageIndex(i => (i - 1 + product.image_urls.length) % product.image_urls.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                                            aria-label="Image précédente"
                                        >
                                            <ChevronLeft className="w-5 h-5"/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentImageIndex(i => (i + 1) % product.image_urls.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                                            aria-label="Image suivante"
                                        >
                                            <ChevronLeft className="w-5 h-5 rotate-180"/>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Navigation */}
                            {product.image_urls.length > 1 && (
                                <div className="flex gap-2 p-4 overflow-x-auto">
                                    {product.image_urls.map((url, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                idx === currentImageIndex ? "border-primary scale-105" : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                        >
                                            <Image
                                                src={url ?? "/placeholder.svg"}
                                                alt={`Aperçu ${idx + 1}`}
                                                fill
                                                sizes="80px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="text-center p-4 hover:shadow-md transition-shadow">
                                <Truck className="w-6 h-6 mx-auto mb-2 text-primary"/>
                                <p className="text-xs font-medium">Livraison rapide</p>
                            </Card>
                            <Card className="text-center p-4 hover:shadow-md transition-shadow">
                                <Shield className="w-6 h-6 mx-auto mb-2 text-primary"/>
                                <p className="text-xs font-medium">Paiement sécurisé</p>
                            </Card>
                            <Card className="text-center p-4 hover:shadow-md transition-shadow">
                                <Package className="w-6 h-6 mx-auto mb-2 text-primary"/>
                                <p className="text-xs font-medium">Garantie qualité</p>
                            </Card>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <Badge variant="secondary" className="mb-3">
                                {product.categories.name}
                            </Badge>
                            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold text-primary">
                      {formatPrice(product.price)}
                    </span>
                                <Badge
                                    variant={product.stock > 0 ? "default" : "destructive"}
                                    className="text-sm"
                                >
                                    {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
                                </Badge>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <Card className="border-l-4 border-l-primary">
                                <CardHeader>
                                    <CardTitle className="text-lg">Description du produit</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {product.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quantity & Add to Cart */}
                        <Card className="shadow-lg">
                            <CardContent className="pt-6 space-y-6">
                                {/* Quantity Selector */}
                                <div>
                                    <label className="text-sm font-semibold mb-3 block">
                                        Quantité
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border-2 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => canDecrease && setQuantity(q => Math.max(1, q - 1))}
                                                disabled={!canDecrease}
                                                className="h-12 w-12 flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                                                aria-label="Diminuer la quantité"
                                            >
                                                −
                                            </button>

                                            <div
                                                className="min-w-[80px] h-12 flex items-center justify-center text-xl font-bold border-x-2">
                                                {quantity}
                                            </div>

                                            <button
                                                onClick={() => canIncrease && setQuantity(q => Math.min(product.stock, q + 1))}
                                                disabled={!canIncrease}
                                                className="h-12 w-12 flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                                                aria-label="Augmenter la quantité"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            {product.stock > 0 ? `Maximum : ${product.stock}` : "Aucun stock disponible"}
                                        </div>
                                    </div>
                                </div>

                                {/* Subtotal */}
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <span className="font-semibold">Sous-total</span>
                                    <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.price * quantity)}
                      </span>
                                </div>

                                {/* Add to Cart Button */}
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || isAdding || isAdded}
                                    size="lg"
                                    className="w-full h-14 text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all"
                                    aria-pressed={isAdded}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check className="w-6 h-6"/>
                                            Ajouté au panier
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-6 h-6"/>
                                            {isAdding ? "Ajout en cours..." : "Ajouter au panier"}
                                        </>
                                    )}
                                </Button>

                                {/* Shipping Info */}
                                <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4"/>
                                        <span>Livraison estimée : 2 à 5 jours ouvrables</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4"/>
                                        <span>Garantie de remboursement de 30 jours</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="sr-only" aria-live="polite">
                    {isAdded ? `${product.name} ajouté au panier` : ""}
                </div>
            </div>
        </div>
    )
}