import { createClient } from "@/lib/supabase/server"

/**
 * Check if the current user has admin role
 * @returns true if user has admin role (role = true), false otherwise
 */
export async function isUserAdmin(): Promise<boolean> {
  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()

  console.log("[isUserAdmin] User data:", { userId: user?.user?.id, userError })

  if (!user.user) {
    console.log("[isUserAdmin] No user found")
    return false
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.user.id)
    .single()

  console.log("[isUserAdmin] Profile query result:", { profile, error: error?.message })

  if (error || !profile) {
    console.log("[isUserAdmin] Error or no profile found:", error?.message)
    return false
  }

  console.log("[isUserAdmin] Role value:", profile.role, "Type:", typeof profile.role)
  return profile.role === true
}

/**
 * Get the current user's profile including role
 */
export async function getUserProfile() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.user.id)
    .single()

  if (error || !profile) {
    return null
  }

  return profile
}

