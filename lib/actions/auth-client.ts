import { createClient } from "@/lib/supabase/client"

/**
 * Check if the current user has admin role (client-side)
 * @returns true if user has admin role (role = true), false otherwise
 */
export async function isUserAdminClient(): Promise<boolean> {
  const supabase = createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()

  console.log("[isUserAdminClient] User data:", { userId: user?.user?.id, userError })

  if (!user.user) {
    console.log("[isUserAdminClient] No user found")
    return false
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.user.id)
    .single()

  console.log("[isUserAdminClient] Profile query result:", { profile, error: error?.message })

  if (error || !profile) {
    console.log("[isUserAdminClient] Error or no profile found:", error?.message)
    return false
  }

  console.log("[isUserAdminClient] Role value:", profile.role, "Type:", typeof profile.role)
  return profile.role === true
}

