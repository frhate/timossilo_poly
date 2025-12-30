import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import CheckoutForm from "@/components/checkout-form"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  let cartItems = null
  let userProfile = null
  let userEmail = ""
  let isGuest = !user.user

  if (user.user) {
    // Authenticated user - fetch cart from database
    const { data: dbCartItems } = await supabase
      .from("cart_items")
      .select("*, products(id, name, price, stock)")
      .eq("user_id", user.user.id)

    cartItems = dbCartItems

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.user.id)
      .single()

    userProfile = profile
    userEmail = user.user.email ?? ""
  }
  // For guest users, cart will be loaded from localStorage on the client side

  return (
    <div>
      <Navigation />
      <CheckoutForm
        initialCartItems={cartItems}
        userProfile={userProfile}
        userEmail={userEmail}
        isGuest={isGuest}
      />
    </div>
  )
}
