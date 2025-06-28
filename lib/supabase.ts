import { createClient } from "@supabase/supabase-js"
import Constants from "expo-constants"

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "your-supabase-url"
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || "your-supabase-anon-key"

// Debug logging
console.log("Supabase URL:", supabaseUrl)
console.log("Supabase Anon Key:", supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : "Not set")

// Check if we have valid credentials
if (supabaseUrl === "your-supabase-url" || supabaseAnonKey === "your-supabase-anon-key") {
  console.warn("⚠️ Supabase credentials not configured! Please set up your .env file with:")
  console.warn("EXPO_PUBLIC_SUPABASE_URL=your_actual_supabase_url")
  console.warn("EXPO_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: async (key: string) => {
        const { getItemAsync } = await import("expo-secure-store")
        return await getItemAsync(key)
      },
      setItem: async (key: string, value: string) => {
        const { setItemAsync } = await import("expo-secure-store")
        await setItemAsync(key, value)
      },
      removeItem: async (key: string) => {
        const { deleteItemAsync } = await import("expo-secure-store")
        await deleteItemAsync(key)
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
