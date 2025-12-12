import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { CheckCircle2, Package, MapPin, CreditCard, Phone, User } from "lucide-react"

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, price))")
    .eq("id", id)
    .single()


  if (!order) {
    return (
      <div>
        <Navigation />
        <div className="container px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Commande introuvable</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navigation />
      <div className="container px-4 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Commande Confirmée !
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Merci pour votre commande. Nous avons bien reçu votre demande et nous la traiterons dans les plus brefs délais.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Order Number Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Numéro de Commande</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">{order.order_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                  En attente
                </span>
                <span className="text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Order Details Card */}
          <Card>
            <CardHeader className="px-4 sm:px-6 py-4">
              <h2 className="text-lg sm:text-xl font-semibold">Détails de Livraison</h2>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nom</p>
                    <p className="text-sm sm:text-base font-medium">{order.customer_name}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                    <p className="text-sm sm:text-base font-medium">{order.customer_phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-gray-100 rounded-lg h-fit">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Adresse de Livraison</p>
                  <p className="text-sm sm:text-base font-medium">
                    {order.customer_address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_city}{order.customer_zip && `, ${order.customer_zip}`}
                  </p>
                </div>
              </div>

              {order.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Items Card */}
          <Card>
            <CardHeader className="px-4 sm:px-6 py-4">
              <h2 className="text-lg sm:text-xl font-semibold">Produits Commandés</h2>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
              <div className="space-y-3">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-medium text-gray-900">{item.products.name_ar}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-semibold">{item.price * item.quantity} DA</p>
                      <p className="text-xs text-muted-foreground">{item.price} DA / unité</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium">{order.total_amount} DA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frais de livraison</span>
                  <span className="font-medium text-green-600">Gratuit</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span>{order.total_amount} DA</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 bg-blue-50 p-3 sm:p-4 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-blue-900">Paiement à la Livraison</p>
                  <p className="text-xs text-blue-700">Vous payerez en espèces à la réception de votre commande</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/products" className="flex-1">
            <Button variant="outline" className="w-full h-11 sm:h-12 text-sm sm:text-base">
              Continuer mes Achats
            </Button>
          </Link>
          <Link href="/account" className="flex-1">
            <Button className="w-full h-11 sm:h-12 text-sm sm:text-base">
              Voir mes Commandes
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Un email de confirmation sera envoyé à votre adresse. Pour toute question, contactez notre service client.
          </p>
        </div>
      </div>
    </div>
  )
}