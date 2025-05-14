"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function AuthDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({
    loading: true,
    error: null,
    session: null,
    user: null,
    supabaseUrl: null,
    redirectUrl: null,
    urlInfo: null,
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        const { data: userData, error: userError } = await supabase.auth.getUser()

        setDebugInfo({
          loading: false,
          error: sessionError || userError || null,
          session: sessionData?.session || null,
          user: userData?.user || null,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          redirectUrl: window.location.origin,
          urlInfo: {
            href: window.location.href,
            origin: window.location.origin,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
          },
        })
      } catch (error) {
        setDebugInfo({
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
          session: null,
          user: null,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          redirectUrl: window.location.origin,
          urlInfo: {
            href: window.location.href,
            origin: window.location.origin,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
          },
        })
      }
    }

    checkAuth()
  }, [])

  const testGoogleSignIn = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/debug`,
        },
      })

      if (error) throw error
      console.log("OAuth response:", data)
    } catch (error) {
      console.error("Test sign in error:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Auth Debugging</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current authentication state and session information</CardDescription>
          </CardHeader>
          <CardContent>
            {debugInfo.loading ? (
              <div>Loading authentication information...</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Authentication Status:</h3>
                  <p>{debugInfo.user ? "Authenticated" : "Not authenticated"}</p>
                </div>

                {debugInfo.error && (
                  <div>
                    <h3 className="font-medium text-red-500">Error:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                      {JSON.stringify(debugInfo.error, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <h3 className="font-medium">URL Information:</h3>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo.urlInfo, null, 2)}
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium">Configuration:</h3>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(
                      {
                        supabaseUrl: debugInfo.supabaseUrl,
                        redirectUrl: debugInfo.redirectUrl,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>

                {debugInfo.user && (
                  <div>
                    <h3 className="font-medium">User Information:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                      {JSON.stringify(debugInfo.user, null, 2)}
                    </pre>
                  </div>
                )}

                {debugInfo.session && (
                  <div>
                    <h3 className="font-medium">Session Information:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                      {JSON.stringify(
                        {
                          ...debugInfo.session,
                          access_token: debugInfo.session.access_token ? "[REDACTED]" : null,
                          refresh_token: debugInfo.session.refresh_token ? "[REDACTED]" : null,
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Authentication</CardTitle>
            <CardDescription>Test Google sign-in with debug information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testGoogleSignIn}>Test Google Sign In</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
