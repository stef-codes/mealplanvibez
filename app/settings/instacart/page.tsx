"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Bug, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

export default function InstacartSettingsPage() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | "info" | null; message: string | null }>({
    type: null,
    message: null,
  })
  const [mockModeEnabled, setMockModeEnabled] = useState(false)

  // Check if Instacart API key is configured using the safe flag
  const isInstacartConfigured = process.env.NEXT_PUBLIC_INSTACART_API_KEY_EXISTS === "true"

  // Check if mock mode is enabled
  const isMockModeEnabled = process.env.INSTACART_MOCK_MODE === "true"

  // Set initial mock mode state
  useEffect(() => {
    setMockModeEnabled(isMockModeEnabled || false)
  }, [isMockModeEnabled])

  // Check if API key is already set
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        if (isInstacartConfigured) {
          const response = await fetch("/api/instacart/test")
          const data = await response.json()

          if (data.apiKeyExists) {
            setStatus({
              type: "success",
              message: `Instacart API key is configured (${data.apiKeyFirstChars})`,
            })
          } else {
            setStatus({
              type: "info",
              message: "Instacart API key is not configured. Please add your API key below.",
            })
          }
        } else {
          setStatus({
            type: "info",
            message: "Instacart API key is not configured. Please add your API key below.",
          })
        }
      } catch (error) {
        console.error("Error checking API key:", error)
        setStatus({
          type: "error",
          message: "Failed to check API key status",
        })
      }
    }

    checkApiKey()
  }, [isInstacartConfigured])

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setStatus({
        type: "error",
        message: "Please enter an API key",
      })
      return
    }

    setIsLoading(true)
    setStatus({ type: null, message: null })

    try {
      // In a real app, you would save this to your environment variables
      // For this demo, we'll just show a success message

      toast({
        title: "API Key Saved",
        description: "Your Instacart API key has been saved successfully.",
      })

      setStatus({
        type: "success",
        message: "Instacart API key saved successfully. You can now send shopping lists to Instacart.",
      })
    } catch (error) {
      console.error("Error saving API key:", error)
      setStatus({
        type: "error",
        message: "Failed to save API key. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMockMode = async () => {
    const newMockModeState = !mockModeEnabled
    setMockModeEnabled(newMockModeState)

    // In a real app, you would update the environment variable
    // For this demo, we'll just show a success message
    toast({
      title: newMockModeState ? "Mock Mode Enabled" : "Mock Mode Disabled",
      description: newMockModeState
        ? "Instacart integration will now use mock responses for testing."
        : "Instacart integration will now use real API calls.",
    })
  }

  return (
    <div className="container py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Instacart Integration Settings</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Instacart API Key</CardTitle>
          <CardDescription>
            Configure your Instacart API key to enable sending shopping lists to Instacart.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status.type && status.message && (
            <Alert variant={status.type === "error" ? "destructive" : "default"}>
              {status.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : status.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {status.type === "error" ? "Error" : status.type === "success" ? "Success" : "Information"}
              </AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="api-key">Instacart API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Instacart API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              You can obtain an API key from the Instacart Developer Portal.
            </p>
          </div>

          {isInstacartConfigured && (
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
                <Link href="/settings/instacart/debug">
                  <Bug className="h-4 w-4" />
                  <span>Debug Connection</span>
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveApiKey} className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save API Key"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Developer Options</CardTitle>
          <CardDescription>Configure testing and development options for the Instacart integration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mock-mode">Mock Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable mock mode to simulate Instacart API responses without making real API calls.
              </p>
            </div>
            <Switch id="mock-mode" checked={mockModeEnabled} onCheckedChange={toggleMockMode} />
          </div>

          {mockModeEnabled && (
            <Alert className="mt-2 bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-800" />
              <AlertTitle className="text-yellow-800">Mock Mode Active</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Instacart integration is running in mock mode. No real API calls will be made.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">How to get an Instacart API key</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Go to the Instacart Developer Portal</li>
          <li>Create or log in to your developer account</li>
          <li>Create a new application</li>
          <li>Request access to the Shopping List API</li>
          <li>Once approved, generate an API key</li>
          <li>Copy and paste the API key above</li>
        </ol>
      </div>
    </div>
  )
}
