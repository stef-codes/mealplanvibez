"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ExternalLink, AlertCircle, Settings, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { sendToInstacart } from "@/lib/actions/instacart-actions"
import type { ShoppingListItem } from "@/lib/data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface InstacartIntegrationProps {
  shoppingList: ShoppingListItem[]
  listTitle?: string
}

export function InstacartIntegration({
  shoppingList,
  listTitle = "ChefItUp Shopping List",
}: InstacartIntegrationProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [instacartUrl, setInstacartUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMockResponse, setIsMockResponse] = useState(false)

  // Check if Instacart API key is configured using the safe flag
  const isInstacartConfigured = process.env.NEXT_PUBLIC_INSTACART_API_KEY_EXISTS === "true"

  // Check if mock mode is enabled
  const isMockModeEnabled = process.env.INSTACART_MOCK_MODE === "true"

  const handleSendToInstacart = async () => {
    if (!isInstacartConfigured && !isMockModeEnabled) {
      setIsDialogOpen(true)
      setError("Instacart API key is not configured")
      return
    }

    if (shoppingList.length === 0) {
      toast({
        title: "Empty shopping list",
        description: "Please add items to your shopping list first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setIsMockResponse(false)

    try {
      toast({
        title: "Sending to Instacart",
        description: "Your shopping list is being transferred to Instacart.",
      })

      // Filter out checked items if needed
      const itemsToSend = shoppingList.filter((item) => !item.checked)

      const result = await sendToInstacart(itemsToSend, listTitle)

      console.log("Instacart API response:", result)

      // Check if this is a mock response
      if (result.mock) {
        setIsMockResponse(true)
      }

      if (result.success && result.url) {
        setInstacartUrl(result.url)
        setIsDialogOpen(true)

        toast({
          title: result.mock ? "List sent to Instacart (Mock Mode)" : "List sent to Instacart",
          description: "Your shopping list has been added to your Instacart cart.",
        })
      } else {
        console.error("API returned error:", result.error, "Debug:", result.debug)
        throw new Error(result.error || "Failed to send to Instacart")
      }
    } catch (error) {
      console.error("Error sending to Instacart:", error)

      // Extract more detailed error information if available
      let errorMessage = "Failed to send to Instacart"
      if (error instanceof Error) {
        errorMessage = error.message
      }

      // Check for debug information
      if (typeof error === "object" && error !== null && "debug" in error) {
        console.error("Debug information:", error.debug)
      }

      setError(errorMessage)
      setIsDialogOpen(true)

      toast({
        title: "Error sending to Instacart",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openInstacartUrl = () => {
    if (instacartUrl) {
      window.open(instacartUrl, "_blank")
      setIsDialogOpen(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleSendToInstacart}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          disabled={isLoading || shoppingList.length === 0}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>Send to Instacart</span>
            </>
          )}
        </Button>

        {isMockModeEnabled && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Mock Mode
          </Badge>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {!isInstacartConfigured && !isMockModeEnabled ? (
            <>
              <DialogHeader>
                <DialogTitle>Instacart Integration Not Configured</DialogTitle>
                <DialogDescription>
                  The Instacart integration has not been set up yet. You need to configure your Instacart API key.
                </DialogDescription>
              </DialogHeader>

              <Alert variant="warning" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration Required</AlertTitle>
                <AlertDescription>Please go to the settings page to configure your Instacart API key.</AlertDescription>
              </Alert>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/settings/instacart">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Instacart
                  </Link>
                </Button>
              </DialogFooter>
            </>
          ) : error ? (
            <>
              <DialogHeader>
                <DialogTitle>Error Sending to Instacart</DialogTitle>
                <DialogDescription>There was a problem sending your shopping list to Instacart.</DialogDescription>
              </DialogHeader>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/settings/instacart/debug">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Troubleshoot
                  </Link>
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>
                  Shopping List Sent to Instacart
                  {isMockResponse && (
                    <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-800 border-yellow-200">
                      Mock Mode
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>Your shopping list has been successfully sent to Instacart.</DialogDescription>
              </DialogHeader>

              {isMockResponse && (
                <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-800" />
                  <AlertTitle className="text-yellow-800">Mock Mode Active</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    This is a simulated response. No actual data was sent to Instacart.
                  </AlertDescription>
                </Alert>
              )}

              <p className="py-4">Click the button below to open Instacart and view your shopping list.</p>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={openInstacartUrl} className="bg-green-600 hover:bg-green-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Instacart
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
