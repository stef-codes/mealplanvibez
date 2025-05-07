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

  return createClient(supabaseUrl, supabaseAnonKey)
}
