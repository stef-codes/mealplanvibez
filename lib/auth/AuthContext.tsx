"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../supabase"
import type { Session, User } from "@supabase/supabase-js"
import * as SecureStore from "expo-secure-store"
import * as WebBrowser from "expo-web-browser"

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Complete the auth session
WebBrowser.maybeCompleteAuthSession()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Store session in secure store
      if (session) {
        await SecureStore.setItemAsync("session", JSON.stringify(session))
      } else {
        await SecureStore.deleteItemAsync("session")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log("🔐 Attempting sign in with email:", email)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        console.error("❌ Sign in error:", error)
        throw error
      }
      console.log("✅ Sign in successful")
    } catch (error) {
      console.error("❌ Sign in failed:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    console.log("📝 Attempting sign up with email:", email, "name:", name)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })
      if (error) {
        console.error("❌ Sign up error:", error)
        throw error
      }
      console.log("✅ Sign up successful")
    } catch (error) {
      console.error("❌ Sign up failed:", error)
      throw error
    }
  }

  const signOut = async () => {
    console.log("🚪 Attempting sign out")
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("❌ Sign out error:", error)
        throw error
      }
      console.log("✅ Sign out successful")
    } catch (error) {
      console.error("❌ Sign out failed:", error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    console.log("🔍 Attempting Google sign in")
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "chefitup://auth/callback",
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) {
        console.error("❌ Google sign in error:", error)
        
        // Provide specific guidance for common errors
        if (error.message.includes("provider is not enabled")) {
          alert("Google OAuth is not configured in your Supabase project.\n\nTo enable it:\n1. Go to your Supabase dashboard\n2. Navigate to Authentication > Providers\n3. Enable Google provider\n4. Add your Google OAuth credentials\n5. Set redirect URL to: chefitup://auth/callback")
        } else {
          alert(`Google sign in failed: ${error.message}`)
        }
        
        throw error
      }
      console.log("✅ Google sign in initiated", data)
      
      // If we have a URL, open it in the browser
      if (data?.url) {
        console.log("🔗 Opening OAuth URL in browser:", data.url)
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          "chefitup://auth/callback"
        )
        
        console.log("🌐 Browser result:", result)
        
        if (result.type === "success") {
          console.log("✅ OAuth completed successfully")
          // The session should be automatically updated by Supabase
        } else if (result.type === "cancel") {
          console.log("❌ OAuth cancelled by user")
        } else {
          console.log("❌ OAuth failed:", result)
        }
      } else {
        console.error("❌ No OAuth URL received")
        throw new Error("No OAuth URL received from Supabase")
      }
    } catch (error) {
      console.error("❌ Google sign in failed:", error)
      // Don't throw here since we already handled the error above
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
