"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createOrderWithTelegramConfirmation, createGuestOrder, getUserTelegramChatId } from "@/lib/actions/orders"
import { guestCart } from "@/lib/cart-storage"
import LocationSelect, { type LocationSelection } from "@/components/location-select"
import Link from "next/link"

  interface CartItem {
    id: string
    product_id: string
    quantity: number
    products: {
      id: string
      name: string
      price: number
      stock: number
    }
  }

  interface UserProfile {
    id?: string
    full_name: string
    phone: string
    address: string
    city: string
    zip_code: string
  }


  export default function CheckoutForm({
    initialCartItems,
    userProfile,
    userEmail,
    isGuest,
  }: {
    initialCartItems: CartItem[] | null
    userProfile: UserProfile | null
    userEmail: string
    isGuest: boolean
  }) {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems || [])
    const [email, setEmail] = useState(userEmail)
    const [fullName, setFullName] = useState(userProfile?.full_name || "")
    const [phone, setPhone] = useState(userProfile?.phone || "")
    const [address, setAddress] = useState(userProfile?.address || "")
    const [location, setLocation] = useState<LocationSelection | null>(null)
    const [notes, setNotes] = useState("")
    const [formError, setFormError] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [isLoading, setIsLoading] = useState(isGuest)
    const router = useRouter()
    const supabase = createClient()

    // Load guest cart from localStorage
    useEffect(() => {
      if (isGuest) {
        const loadGuestCart = async () => {
          const guestCartItems = guestCart.getItems()

          if (guestCartItems.length === 0) {
            router.push("/cart")
            return
          }

          // Fetch product details for guest cart items
          const productIds = guestCartItems.map(item => item.productId)
          const { data: products } = await supabase
            .from("products")
            .select("id, name, price, stock")
            .in("id", productIds)

          if (products) {
            const fullCartItems = guestCartItems.map(item => {
              const product = products.find((p: any) => p.id === item.productId)
              return {
                id: item.productId, // Use productId as temporary cart item id for guest
                product_id: item.productId,
                quantity: item.quantity,
                products: product!
              }
            }).filter(item => item.products) // Filter out any products that weren't found

            setCartItems(fullCartItems)
          }
          setIsLoading(false)
        }

        loadGuestCart()
      }
    }, [isGuest, router, supabase])

    const total = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0)

const handleSubmitOrder = async (e: React.FormEvent) => {
      e.preventDefault()
      setFormError("")

      if (!location) {
        setFormError("Veuillez sélectionner votre wilaya et votre commune.")
        return
      }

      const cleanPhone = phone.replace(/[\s.-]/g, "")
      if (!/^0\d{8,9}$/.test(cleanPhone)) {
        setFormError("Veuillez saisir un numéro de téléphone valide (ex: 0550123456).")
        return
      }

      const customerCity = `${location.communeName}, ${location.wilayaName}`
      const customerZip = location.postCode || null

      setIsProcessing(true)

      try {
        const orderNumber = `ORD-${Date.now()}`

        if (isGuest) {
          // Guest checkout
          if (!email) {
            throw new Error("Email is required for guest checkout")
          }

          // Create guest order
          const { orderId } = await createGuestOrder({
            guestEmail: email,
            orderNumber,
            totalAmount: total,
            customerName: fullName,
            customerPhone: phone,
            customerAddress: address,
            customerCity,
            customerZip,
            notes: notes || null,
            items: cartItems.map((item) => ({
              productId: item.products.id,
              quantity: item.quantity,
              price: item.products.price,
            })),
          })

          // Clear guest cart from localStorage
          guestCart.clear()

          router.push(`/order-success/${orderId}`)
        } else {
          // Authenticated user checkout
          const { data: user } = await supabase.auth.getUser()
          if (!user.user) throw new Error("Not authenticated")

          // Get user's Telegram chat ID if exists
          const telegramChatId = await getUserTelegramChatId(user.user.id)

          // Create order with Telegram confirmation
          const { orderId } = await createOrderWithTelegramConfirmation({
            userId: user.user.id,
            orderNumber,
            totalAmount: total,
            customerName: fullName,
            customerPhone: phone,
            customerAddress: address,
            customerCity,
            customerZip,
            notes: notes || null,
            items: cartItems.map((item) => ({
              productId: item.products.id,
              quantity: item.quantity,
              price: item.products.price,
            })),
            telegramChatId: telegramChatId || undefined,
          })

          // Update or insert user profile
          const profileData = {
            id: user.user.id,
            full_name: fullName,
            phone,
            address,
            city: customerCity,
            zip_code: customerZip,
          }

          const { error: profileError } = await supabase
            .from("user_profiles")
            .upsert(profileData, { onConflict: 'id' })

          if (profileError) {
            console.error("Profile update error:", profileError)
            // Don't throw - profile update is not critical
          }

          // Clear cart
          const { error: cartError } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.user.id)

          if (cartError) {
            console.error("Cart clear error:", cartError)
            // Don't throw - cart clear is not critical
          }

          router.push(`/order-success/${orderId}`)
        }
      } catch (error) {
        console.error("Order submission failed:", error)
        alert(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.")
      } finally {
        setIsProcessing(false)
      }
    }

    if (isLoading) {
      return (
        <div className="container px-4 sm:px-6 py-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-lg text-gray-600">Chargement...</p>
          </div>
        </div>
      )
    }

    if (cartItems.length === 0) {
      return (
        <div className="container px-4 sm:px-6 py-8 max-w-7xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg text-gray-600 mb-4">Votre panier est vide</p>
              <Button onClick={() => router.push("/products")}>
                Continuer vos achats
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
    return (
      <div className="container px-4 sm:px-6 py-4 sm:py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Informations de Livraison</CardTitle>
                {isGuest && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Commander en tant qu'invité. Vous pouvez{" "}
                    <Link href="/auth/sign-up" className="text-primary hover:underline">
                      créer un compte
                    </Link>{" "}
                    pour suivre vos commandes facilement.
                  </p>
                )}
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <form onSubmit={handleSubmitOrder} className="space-y-4 sm:space-y-6">
                  {isGuest && (
                    <div>
                      <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="votre@email.com"
                        className="mt-1.5 h-10 sm:h-11"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Nous vous enverrons la confirmation de commande à cet email
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-sm sm:text-base">Nom Complet *</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="mt-1.5 h-10 sm:h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm sm:text-base">Numéro de Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="05 50 12 34 56"
                        className="mt-1.5 h-10 sm:h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm sm:text-base">Adresse *</Label>
                    <Input
                      id="address"
                      autoComplete="street-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Rue, numéro, quartier, point de repère..."
                      className="mt-1.5 h-10 sm:h-11"
                    />
                  </div>

                  <LocationSelect
                    value={location}
                    onChange={setLocation}
                    defaultCity={userProfile?.city}
                    defaultZip={userProfile?.zip_code}
                    disabled={isProcessing}
                  />

                  <p className="text-xs text-muted-foreground">
                    Livraison disponible dans toutes les wilayas. Le code postal est rempli
                    automatiquement selon la commune choisie.
                  </p>

                  <div>
                    <Label htmlFor="notes" className="text-sm sm:text-base">Notes Additionnelles</Label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 border rounded mt-1.5 text-sm sm:text-base min-h-[80px]"
                      rows={3}
                      placeholder="Toutes notes supplémentaires..."
                    />
                  </div>

                  {formError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                      {formError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 sm:h-12 text-base sm:text-lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Traitement en cours..." : "Confirmer la Commande"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 lg:order-2">
            <Card className="lg:sticky lg:top-24">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Résumé de la Commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="max-h-60 sm:max-h-80 overflow-y-auto space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs sm:text-sm border-b pb-2 gap-2">
                      <span className="truncate">
                        {item.products.name} × {item.quantity}
                      </span>
                      <span className="font-medium whitespace-nowrap">{item.products.price * item.quantity} DA</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span className="font-medium">{total} DA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison:</span>
                    <span className="font-medium text-green-600">Selon l'emplacement</span>
                  </div>
                  <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{total} DA</span>
                  </div>
                </div>

                <div className="border-t pt-4 text-xs sm:text-sm space-y-1">
                  <p className="font-semibold">Livraison à</p>
                  {location ? (
                    <>
                      <p className="font-medium">
                        {location.communeName}, {location.wilayaName}
                      </p>
                      {location.postCode && (
                        <p className="text-muted-foreground">
                          Code postal: {location.postCode}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      Sélectionnez votre wilaya et votre commune
                    </p>
                  )}
                  {address && <p className="text-muted-foreground">{address}</p>}
                </div>

                <div className="bg-blue-50 p-3 sm:p-4 rounded text-xs sm:text-sm">
                  <p className="font-semibold mb-1">Méthode de Paiement:</p>
                  <p>Paiement à la Livraison (COD)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }