import {createClient} from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import AdminDashboard from "@/components/admin-dashboard"
import {redirect} from "next/navigation"
import {isUserAdmin} from "@/lib/actions/auth"

export default async function AdminPage() {
    const supabase = await createClient()

    const {data: user} = await supabase.auth.getUser()

    if (!user.user) {
        redirect("/auth/login")
    }

    // Check if user is admin (role = true in user_profiles table)
    const isAdmin = await isUserAdmin()

    if (!isAdmin) {
        redirect("/")
    }

    const {data: categories} = await supabase.from("categories").select("*").order("created_at", {ascending: false})

    const {data: products} = await supabase
        .from("products")
        .select("*, categories(name_ar)")
        .order("created_at", {ascending: false})

    const {data: orders} = await supabase
        .from("orders")
        .select(`
      *,
      order_items (
        id,
        product_id,
        quantity,
        price,
        products (
          name,
          image_urls
        )
      )
    `)
        .order('created_at', {ascending: false})
    return (
        <div>
            <Navigation/>
            <AdminDashboard
                initialCategories={categories || []}
                initialProducts={products || []}
                initialOrders={orders || []}
            />
        </div>
    )
}
