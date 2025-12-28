"use client"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {createClient} from "@/lib/supabase/client"
import {useRouter} from "next/navigation"
import {useState} from "react"
import {Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package} from "lucide-react"
import Image from "next/image"
import {cn} from "@/lib/utils"

interface CartItem {
    id: string
    product_id: string
    quantity: number
    products: {
        id: string
        name: string
        price: number
        image_urls: string []
        stock: number
    }
}

export default function CartContent({initialCartItems}: { initialCartItems: CartItem[] }) {
    const [cartItems, setCartItems] = useState(initialCartItems)
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const formatPrice = (value: number) =>
        new Intl.NumberFormat("fr-DZ", {
            style: "currency",
            currency: "DZD",
            minimumFractionDigits: 2,
        }).format(value)

    const subtotal = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0)
    const shippingCost = 0 // Livraison gratuite
    const total = subtotal + shippingCost

    const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(cartItemId)
            return
        }

        setIsLoading(cartItemId)
        try {
            const {error} = await supabase
                .from("cart_items")
                .update({quantity: newQuantity})
                .eq("id", cartItemId)

            if (error) throw error

            setCartItems(cartItems.map((item) =>
                item.id === cartItemId ? {...item, quantity: newQuantity} : item
            ))
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error)
            alert("Une erreur s'est produite. Veuillez réessayer.")
        } finally {
            setIsLoading(null)
        }
    }

    const handleRemoveItem = async (cartItemId: string) => {
        setIsLoading(cartItemId)
        try {
            const {error} = await supabase
                .from("cart_items")
                .delete()
                .eq("id", cartItemId)

            if (error) throw error

            setCartItems(cartItems.filter((item) => item.id !== cartItemId))
        } catch (error) {
            console.error("Erreur lors de la suppression:", error)
            alert("Une erreur s'est produite. Veuillez réessayer.")
        } finally {
            setIsLoading(null)
        }
    }

    const handleCheckout = () => {
        router.push("/checkout")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
                {/* Header */}
                <div className="mb-6 sm:mb-8 lg:mb-10">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Mon Panier
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        {cartItems.length} article{cartItems.length !== 1 ? "s" : ""} dans votre panier
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    /* Empty Cart State */
                    <Card className="border-0 shadow-xl">
                        <CardContent className="py-12 sm:py-16 lg:py-20">
                            <div className="text-center max-w-md mx-auto">
                                <div
                                    className="mb-6 inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                                    <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600"/>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                                    Votre panier est vide
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                                    Découvrez nos produits et ajoutez vos articles préférés
                                </p>
                                <Button
                                    onClick={() => router.push("/products")}
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    <ShoppingBag className="w-4 h-4 mr-2"/>
                                    Découvrir les produits
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-8 space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.id}
                                      className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Product Image */}
                                            <div
                                                className="relative w-full sm:w-32 h-40 sm:h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.products.image_urls?.[0] ? (
                                                    <Image
                                                        src={item.products.image_urls[0]}
                                                        alt={item.products.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 640px) 100vw, 128px"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Package className="w-12 h-12 text-gray-300"/>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2">
                                                        {item.products.name}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <p className="text-lg sm:text-xl font-bold text-primary">
                                                            {formatPrice(item.products.price)}
                                                        </p>
                                                        {item.products.stock <= 5 && (
                                                            <span
                                                                className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                                          Stock limité: {item.products.stock}
                                        </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Quantity Controls & Remove */}
                                                <div
                                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                            <Button
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                                disabled={isLoading === item.id}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-9 w-9 p-0 hover:bg-gray-100 rounded-none"
                                                            >
                                                                <Minus className="w-4 h-4"/>
                                                            </Button>
                                                            <span
                                                                className="px-4 py-1.5 text-sm font-semibold min-w-[3rem] text-center">
                                          {item.quantity}
                                        </span>
                                                            <Button
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                                disabled={isLoading === item.id || item.quantity >= item.products.stock}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-9 w-9 p-0 hover:bg-gray-100 rounded-none disabled:opacity-50"
                                                            >
                                                                <Plus className="w-4 h-4"/>
                                                            </Button>
                                                        </div>

                                                        <div className="text-sm text-gray-600">
                                                            Sous-total: <span className="font-semibold text-gray-900">
                                          {formatPrice(item.products.price * item.quantity)}
                                        </span>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        disabled={isLoading === item.id}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2"/>
                                                        Retirer
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4">
                            <Card className="border-0 shadow-xl sticky top-6">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-bold text-gray-900">
                                        Résumé de la commande
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3 pb-4 border-b border-gray-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Sous-total</span>
                                            <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Livraison</span>
                                            <span className="font-semibold text-emerald-600">Gratuite</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                                    </div>

                                    <Button
                                        onClick={handleCheckout}
                                        className="w-full h-12 text-base font-semibold"
                                        size="lg"
                                    >
                                        Procéder au paiement
                                        <ArrowRight className="w-5 h-5 ml-2"/>
                                    </Button>

                                    <div className="pt-4 space-y-2 text-xs text-gray-600">
                                        <p className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Paiement sécurisé
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Livraison gratuite partout en Algérie
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Garantie satisfaction
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}