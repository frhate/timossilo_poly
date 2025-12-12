import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import AdminDashboard from "@/components/admin-dashboard"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    redirect("/auth/login")
  }

  // Check if user is admin (you can add an is_admin field to user_profiles)
  // For now, we'll allow access to anyone who's authenticated
  // In production, implement proper role-based access control

  const { data: categories } = await supabase.from("categories").select("*").order("created_at", { ascending: false })

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name_ar)")
    .order("created_at", { ascending: false })

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <Navigation />
      <AdminDashboard
        initialCategories={categories || []}
        initialProducts={products || []}
        initialOrders={orders || []}
      />
    </div>
  )
}
