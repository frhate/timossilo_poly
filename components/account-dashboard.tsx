"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import TelegramLinkCard from "@/components/telegram-link-card"

interface UserProfile {
  id: string
  full_name: string
  phone: string
  address: string
  city: string
  zip_code: string
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
}

export default function AccountDashboard({
  user,
  userProfile,
  orders,
}: {
  user: any
  userProfile: UserProfile | null
  orders: Order[]
}) {
  const [fullName, setFullName] = useState(userProfile?.full_name || "")
  const [phone, setPhone] = useState(userProfile?.phone || "")
  const [address, setAddress] = useState(userProfile?.address || "")
  const [city, setCity] = useState(userProfile?.city || "")
  const [zipCode, setZipCode] = useState(userProfile?.zip_code || "")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (userProfile?.id) {
        await supabase
          .from("user_profiles")
          .update({
            full_name: fullName,
            phone,
            address,
            city,
            zip_code: zipCode,
          })
          .eq("id", user.id)
      } else {
        await supabase.from("user_profiles").insert({
          id: user.id,
          full_name: fullName,
          phone,
          address,
          city,
          zip_code: zipCode,
        })
      }

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: "En Attente",
      confirmed: "Confirmé",
      processing: "En Traitement",
      shipped: "Expédié",
      delivered: "Livré",
      cancelled: "Annulé",
    }
    return labels[status] || status
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Compte</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profil Personnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Adresse Email</p>
                <p className="font-semibold break-all">{user.email}</p>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nom Complet</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Numéro de Téléphone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Code Postal</Label>
                    <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={isSaving}>
                      {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setIsEditing(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  {userProfile && (
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">Nom:</span> {userProfile.full_name || "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Téléphone:</span> {userProfile.phone || "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Adresse:</span> {userProfile.address || "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Ville:</span> {userProfile.city || "—"}
                      </p>
                    </div>
                  )}
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                    Modifier les Données
                  </Button>
                </>
              )}

              <Button onClick={handleLogout} variant="destructive" className="w-full">
                Se Déconnecter
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Orders Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mes Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">Vous n'avez pas encore passé de commandes</p>
                  <Link href="/products">
                    <Button>Commencer mes Achats</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("ar-DZ")}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">{order.total_amount} DA</span>
                        <Link href={`/order-success/${order.id}`}>
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
