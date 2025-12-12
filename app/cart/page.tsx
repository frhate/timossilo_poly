import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import CartContent from "@/components/cart-content"
import { redirect } from "next/navigation"

export default async function CartPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    redirect("/auth/login")
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(id, name, price, image_url, stock)")
    .eq("user_id", user.user.id)

  return (
    <div>
      <Navigation />
      <CartContent initialCartItems={cartItems || []} />
    </div>
  )
}
