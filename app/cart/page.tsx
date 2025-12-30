import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import CartContent from "@/components/cart-content"

export default async function CartPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  let cartItems = null
  let isGuest = !user.user

  if (user.user) {
    // Authenticated user - fetch cart from database
    const { data: dbCartItems } = await supabase
      .from("cart_items")
      .select("*, products(id, name, price, image_urls, stock)")
      .eq("user_id", user.user.id)

    cartItems = dbCartItems
  }
  // For guest users, cart will be loaded from localStorage on the client side

  return (
    <div>
      <Navigation />
      <CartContent initialCartItems={cartItems} isGuest={isGuest} />
    </div>
  )
}
