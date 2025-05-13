"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { handleSupabaseOAuthRedirect } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function AuthRedirectHandler() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleRedirect = async () => {
      const session = await handleSupabaseOAuthRedirect()

      if (session) {
        toast({
          title: "Signed in successfully!",
          description: "Welcome to ChefItUp.",
        })

        // Check if this is a new user (first sign in)
        const isNewUser =
          session.user.app_metadata.provider === "google" && session.user.created_at === session.user.updated_at

        if (isNewUser) {
          router.push("/onboarding")
        } else {
          router.push("/recipes")
        }
      }
    }

    handleRedirect()
  }, [router, toast])

  return null
}
