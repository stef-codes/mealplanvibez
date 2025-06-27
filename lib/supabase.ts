import { createClient } from "@supabase/supabase-js"
import Constants from "expo-constants"

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "your-supabase-url"
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || "your-supabase-anon-key"

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
