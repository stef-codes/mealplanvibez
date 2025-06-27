"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, RefreshCw, Settings, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function InstacartDebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if Instacart API key is configured using the safe flag
  const isInstacartConfigured = process.env.NEXT_PUBLIC_INSTACART_API_KEY_EXISTS === "true"

  // Check if mock mode is enabled
  const isMockModeEnabled = process.env.INSTACART_MOCK_MODE === "true"

  const testConnection = async () => {
    setIsLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const response = await fetch("/api/instacart/test-connection")
      const data = await response.json()

      setTestResult(data)

      if (!data.success) {
        setError(data.message || "Unknown error testing connection")
      }
    } catch (err) {
      console.error("Error testing connection:", err)
      setError(err instanceof Error ? err.message : "Failed to test connection")
      setTestResult({ success: false, error: String(err) })
    } finally {
      setIsLoading(false)
    }
  }

  // Run the test on page load
  useEffect(() => {
    if (isInstacartConfigured || isMockModeEnabled) {
      testConnection()
    }
  }, [isInstacartConfigured, isMockModeEnabled])

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Instacart Integration Debug</h1>

        {isMockModeEnabled && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Mock Mode Active
          </Badge>
        )}
      </div>

      {!isInstacartConfigured && !isMockModeEnabled && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Instacart API Key Not Configured</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>
              The Instacart API key is not configured. You need to set up your API key before you can use the Instacart
              integration.
            </p>
            <Button asChild className="w-fit mt-2 bg-green-600 hover:bg-green-700">
              <Link href="/settings/instacart">
                <Settings className="h-4 w-4 mr-2" />
                Configure Instacart
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isMockModeEnabled && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-800" />
          <AlertTitle className="text-yellow-800">Mock Mode Active</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Instacart integration is running in mock mode. Test results will be simulated and no real API calls will be
            made.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connection Test</CardTitle>
          <CardDescription>Test the connection to the Instacart API</CardDescription>
        </CardHeader>
        <CardContent>
          {!isInstacartConfigured && !isMockModeEnabled ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Key Required</AlertTitle>
              <AlertDescription>
                You need to configure your Instacart API key before you can test the connection.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3">Testing connection...</span>
            </div>
          ) : testResult ? (
            <div className="space-y-4">
              <Alert variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{testResult.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>
                  {testResult.message}
                  {testResult.mock && " (Mock Mode)"}
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="text-sm font-medium mb-2">Debug Information:</h3>
                <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto max-h-60">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button
            onClick={testConnection}
            disabled={isLoading || (!isInstacartConfigured && !isMockModeEnabled)}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Test Connection</span>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Information</CardTitle>
          <CardDescription>Information about your environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Node Environment:</span> {process.env.NODE_ENV}
            </div>
            <div>
              <span className="font-medium">Instacart API Key:</span>{" "}
              {isInstacartConfigured ? "Configured" : "Not configured"}
            </div>
            <div>
              <span className="font-medium">Mock Mode:</span> {isMockModeEnabled ? "Enabled" : "Disabled"}
            </div>
            <div>
              <span className="font-medium">Browser:</span>{" "}
              {typeof window !== "undefined" ? window.navigator.userAgent : "Server"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
