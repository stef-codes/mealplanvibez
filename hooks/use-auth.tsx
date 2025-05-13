"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

// Define user type
export type User = {
  id: string
  name: string
  email: string
  preferences: {
    householdSize: number
    dietaryRestrictions: string[]
    instacartConnected: boolean
  }
}

// Define auth context type
type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserPreferences: (preferences: Partial<User["preferences"]>) => Promise<void>
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Create a stable reference to Supabase client
  const supabase = useMemo(() => {
    try {
      return getSupabaseBrowserClient()
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      return null
    }
  }, [])

  // Check for existing session on mount
  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      if (!supabase) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user && isMounted) {
          // Get user profile
          let { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          // If no profile exists (e.g., first Google sign-in), create one
          if (!profile) {
            const userData = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
              email: session.user.email,
            }

            await supabase.from("profiles").upsert(userData)
            profile = userData
          }

          // Get user preferences
          const { data: preferences } = await supabase
            .from("user_preferences")
            .select("*")
            .eq("user_id", session.user.id)
            .single()

          // If no preferences exist, create default ones
          if (!preferences) {
            await supabase.from("user_preferences").upsert({
              user_id: session.user.id,
              household_size: 1,
              instacart_connected: false,
            })
          }

          // Get user dietary restrictions
          const { data: dietaryRestrictions } = await supabase
            .from("user_dietary_restrictions")
            .select("restriction_id")
            .eq("user_id", session.user.id)

          // Get restriction names
          let restrictions: string[] = []
          if (dietaryRestrictions && dietaryRestrictions.length > 0) {
            const restrictionIds = dietaryRestrictions.map((item: any) => item.restriction_id)
            const { data: restrictionData } = await supabase
              .from("dietary_restrictions")
              .select("name")
              .in("id", restrictionIds)

            restrictions = restrictionData?.map((item: any) => item.name) || []
          }

          if (isMounted) {
            setUser({
              id: session.user.id,
              name: profile?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
              email: session.user.email || "",
              preferences: {
                householdSize: preferences?.household_size || 1,
                dietaryRestrictions: restrictions,
                instacartConnected: preferences?.instacart_connected || false,
              },
            })
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchUser()

    // Set up auth state change listener
    let authListener: { subscription: { unsubscribe: () => void } } | null = null

    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Refresh user data
          fetchUser()
        } else if (event === "SIGNED_OUT") {
          if (isMounted) {
            setUser(null)
          }
        }
      })

      authListener = data
    }

    return () => {
      isMounted = false
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabase])

  // Sign in function
  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) throw new Error("Supabase client not available")

      setIsLoading(true)
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // User data will be set by the auth state change listener
      } catch (error) {
        console.error("Sign in error:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [supabase],
  )

  // Sign up function
  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      if (!supabase) throw new Error("Supabase client not available")

      setIsLoading(true)
      try {
        // Create auth user with email confirmation disabled for testing
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            data: {
              full_name: name,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          // Create profile
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: name,
          })

          // Create user preferences
          await supabase.from("user_preferences").upsert({
            user_id: data.user.id,
            household_size: 1,
            instacart_connected: false,
          })

          // For testing purposes, we'll set the user immediately
          // In production, the user would need to confirm their email
          setUser({
            id: data.user.id,
            name: name,
            email: data.user.email || "",
            preferences: {
              householdSize: 1,
              dietaryRestrictions: [],
              instacartConnected: false,
            },
          })
        }

        // User data will be set by the auth state change listener
      } catch (error: any) {
        console.error("Sign up error:", error)
        throw new Error(error.message || "Error creating account")
      } finally {
        setIsLoading(false)
      }
    },
    [supabase],
  )

  // Sign out function
  const signOut = useCallback(async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }, [supabase, router])

  // Update user preferences
  const updateUserPreferences = useCallback(
    async (preferences: Partial<User["preferences"]>) => {
      if (!supabase || !user) return

      try {
        // Update user_preferences table
        if (preferences.householdSize !== undefined || preferences.instacartConnected !== undefined) {
          await supabase.from("user_preferences").upsert({
            user_id: user.id,
            household_size: preferences.householdSize ?? user.preferences.householdSize,
            instacart_connected: preferences.instacartConnected ?? user.preferences.instacartConnected,
          })
        }

        // Update dietary restrictions
        if (preferences.dietaryRestrictions !== undefined) {
          // First, get all restriction IDs
          const { data: restrictionData } = await supabase
            .from("dietary_restrictions")
            .select("id, name")
            .in("name", preferences.dietaryRestrictions)

          if (restrictionData) {
            // Delete existing restrictions
            await supabase.from("user_dietary_restrictions").delete().eq("user_id", user.id)

            // Insert new restrictions
            const restrictionInserts = restrictionData.map((restriction) => ({
              user_id: user.id,
              restriction_id: restriction.id,
            }))

            if (restrictionInserts.length > 0) {
              await supabase.from("user_dietary_restrictions").insert(restrictionInserts)
            }
          }
        }

        // Update local state
        setUser({
          ...user,
          preferences: {
            ...user.preferences,
            ...preferences,
          },
        })
      } catch (error) {
        console.error("Update preferences error:", error)
        throw error
      }
    },
    [supabase, user],
  )

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateUserPreferences,
    }),
    [user, isLoading, signIn, signUp, signOut, updateUserPreferences],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
