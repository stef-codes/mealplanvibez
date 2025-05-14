"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { handleSupabaseOAuthRedirect } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AuthRedirectHandler() {
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Check if this is an OAuth callback
        const hasHashParams = window.location.hash && window.location.hash.includes("access_token")
        const hasErrorParams =
          new URLSearchParams(window.location.search).has("error") ||
          new URLSearchParams(window.location.hash.substring(1)).has("error")

        if (hasErrorParams) {
          // Extract error from URL
          const urlParams = new URLSearchParams(window.location.search)
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const errorMsg =
            urlParams.get("error_description") || hashParams.get("error_description") || "Authentication failed"
          throw new Error(errorMsg)
        }

        if (hasHashParams) {
          console.log("Processing OAuth callback...")
          const session = await handleSupabaseOAuthRedirect()

          if (session) {
            console.log("Session established:", session)
            toast({
              title: "Signed in successfully!",
              description: "Welcome to ChefItUp.",
            })

            // Check if this is a new user (first sign in)
            const isNewUser =
              session.user.app_metadata.provider === "google" &&
              new Date(session.user.created_at).getTime() === new Date(session.user.updated_at).getTime()

            if (isNewUser) {
              router.push("/onboarding")
            } else {
              router.push("/recipes")
            }
          } else {
            console.error("No session established after OAuth redirect")
            setError("Failed to establish a session. Please try again.")
          }
        }
      } catch (error) {
        console.error("Error handling OAuth redirect:", error)
        setError(error instanceof Error ? error.message : "Authentication failed")
      }
    }

    handleRedirect()
  }, [router, toast])

  if (error) {
    return (
      <div className="container max-w-md py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <button onClick={() => router.push("/login")} className="text-sm text-green-600 hover:underline">
            Return to login
          </button>
        </div>
      </div>
    )
  }

  return null
}
