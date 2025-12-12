import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import AccountDashboard from "@/components/account-dashboard"
import { redirect } from "next/navigation"

export default async function AccountPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("id", user.user.id).single()

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false })

  return (
    <div>
      <Navigation />
      <AccountDashboard user={user.user} userProfile={userProfile} orders={orders || []} />
    </div>
  )
}
