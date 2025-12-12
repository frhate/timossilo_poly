import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import CheckoutForm from "@/components/checkout-form"
import { redirect } from "next/navigation"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    redirect("/auth/login")
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(id, name, price, stock)")
    .eq("user_id", user.user.id)

  const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("id", user.user.id).single()

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart")
  }

return (
  <div>
    <Navigation />
    <CheckoutForm cartItems={cartItems} userProfile={userProfile} userEmail={user.user.email ?? ""} />
  </div>
)
}
