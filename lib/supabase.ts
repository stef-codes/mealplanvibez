import { createClient } from "@supabase/supabase-js"
import { isPreviewEnvironment } from "./data"

// Create a single supabase client for the browser
export const getSupabaseBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (isPreviewEnvironment()) {
    console.warn("Running in preview mode or missing Supabase credentials")
    throw new Error("Supabase client not available in preview mode")
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "implicit", // Try implicit flow which can be more reliable
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

// Handle OAuth redirects
export const handleSupabaseOAuthRedirect = async () => {
  if (typeof window === "undefined") return null

  try {
    const supabase = getSupabaseBrowserClient()

    // Log the current URL for debugging
    console.log("Current URL:", window.location.href)

    // Get the current session
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
      throw error
    }

    if (data?.session) {
      console.log("Session found:", data.session)
      return data.session
    }

    // If no session but we have a hash, try to exchange the token
    if (window.location.hash) {
      console.log("Hash found, attempting to set session from URL")
      const { data: hashData, error: hashError } = await supabase.auth.getUser()

      if (hashError) {
        console.error("Error getting user from hash:", hashError)
        throw hashError
      }

      if (hashData?.user) {
        console.log("User found from hash:", hashData.user)
        // Get the session again after setting from URL
        const { data: refreshedData } = await supabase.auth.getSession()
        return refreshedData.session
      }
    }

    return null
  } catch (error) {
    console.error("Error handling OAuth redirect:", error)
    return null
  }
}
