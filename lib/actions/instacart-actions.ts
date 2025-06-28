import type { ShoppingListItem } from "../data/recipes"

// Define types for Instacart API
type InstacartLineItem = {
  name: string
  quantity: number
  unit: string
  display_text?: string
  line_item_measurements?: Array<{
    quantity: number
    unit: string
  }>
  filters?: {
    brand_filters?: string[]
    health_filters?: string[]
  }
}

type InstacartPayload = {
  title: string
  image_url?: string
  link_type: string
  expires_in: number
  instructions?: string[]
  line_items: InstacartLineItem[]
  landing_page_configuration?: {
    partner_linkback_url?: string
    enable_pantry_items?: boolean
  }
}

// Check if we should use mock mode
const shouldUseMockMode = process.env.EXPO_PUBLIC_INSTACART_MOCK_MODE === "true" || !process.env.EXPO_PUBLIC_INSTACART_API_KEY

// Mock function to simulate Instacart API response
const mockInstacartResponse = (items: ShoppingListItem[], title: string) => {
  console.log("MOCK MODE: Simulating Instacart API response")

  // Create a mock URL that would open a new tab with a simulated Instacart cart
  const mockUrl = `https://www.instacart.com/store/mock-cart?title=${encodeURIComponent(title)}&items=${encodeURIComponent(
    items.map((item) => `${item.quantity} ${item.unit} ${item.name}`).join(","),
  )}`

  return {
    success: true,
    data: {
      url: mockUrl,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    url: mockUrl,
    mock: true,
  }
}

export async function sendToInstacart(
  items: ShoppingListItem[],
  title = "ChefItUp Shopping List",
): Promise<{ success: boolean; data?: any; error?: string; url?: string; debug?: any; mock?: boolean }> {
  try {
    // Check if we should use mock mode
    if (shouldUseMockMode) {
      console.log("Using mock mode for Instacart API")
      return mockInstacartResponse(items, title)
    }

    // Format shopping list items for Instacart
    const lineItems: InstacartLineItem[] = items.map((item) => {
      // Convert quantity to number if possible
      let quantity = 1
      if (item.quantity) {
        const parsedQuantity = Number.parseFloat(item.quantity)
        if (!isNaN(parsedQuantity)) {
          quantity = parsedQuantity
        }
      }

      return {
        name: item.name,
        quantity: quantity,
        unit: item.unit || "",
        display_text: `${item.quantity || "1"} ${item.unit || ""} ${item.name}`.trim(),
      }
    })

    // Create the payload
    const payload: InstacartPayload = {
      title,
      link_type: "shopping_list", // Changed from "SHOPPING_LIST" to "shopping_list" (lowercase)
      expires_in: 7, // 7 days (Instacart API expects days, not seconds)
      line_items: lineItems,
      landing_page_configuration: {
        partner_linkback_url: typeof window !== "undefined" ? window.location.origin : "",
        enable_pantry_items: true,
      },
    }

    console.log("Sending to Instacart:", JSON.stringify(payload, null, 2))

    // Get the API key from server-side environment variable
    const apiKey = process.env.EXPO_PUBLIC_INSTACART_API_KEY
    if (!apiKey) {
      throw new Error("Instacart API key is not configured")
    }

    // Make the API call
    const response = await fetch("https://connect.dev.instacart.tools/idp/v1/products/products_link", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Instacart API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data,
      url: data.url || null,
    }
  } catch (error) {
    console.error("Error sending to Instacart:", error)

    // Provide more detailed error information
    let errorMessage = "Unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message

      // Log the full error stack for debugging
      console.error("Full error stack:", error.stack)
    }

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage = "Network error: Unable to connect to Instacart API"
    }

    return {
      success: false,
      error: errorMessage,
      debug: {
        hasApiKey: !!process.env.EXPO_PUBLIC_INSTACART_API_KEY,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorDetails: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
      },
    }
  }
}

export async function testInstacartConnection(): Promise<{
  success: boolean
  message: string
  debug?: any
  mock?: boolean
}> {
  try {
    console.log("Testing Instacart connection...")

    // Check if we should use mock mode
    if (shouldUseMockMode) {
      console.log("Using mock mode for Instacart API test")
      return {
        success: true,
        message: "Successfully connected to Instacart API (Mock Mode)",
        mock: true,
        debug: {
          mockMode: true,
          environment: process.env.NODE_ENV,
        },
      }
    }

    // Check if API key exists
    const apiKey = process.env.EXPO_PUBLIC_INSTACART_API_KEY
    console.log("EXPO_PUBLIC_INSTACART_API_KEY exists:", !!apiKey)

    if (!apiKey) {
      console.log("No API key found in environment variables")
      return {
        success: false,
        message: "Instacart API key is missing",
        debug: {
          environment: process.env.NODE_ENV,
          availableEnvVars: Object.keys(process.env).filter(
            (key) => key.includes("INSTACART") || key.includes("API") || key.includes("KEY"),
          ),
        },
      }
    }

    console.log("API key found, first few chars:", apiKey.substring(0, 3) + "...")

    // Test the API connection
    const response = await fetch("https://connect.dev.instacart.tools/idp/v1/products/products_link", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        title: "Test Connection",
        link_type: "shopping_list",
        expires_in: 1,
        line_items: [
          {
            name: "Test Item",
            quantity: 1,
            unit: "piece",
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Instacart API test failed (${response.status}): ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      message: "Successfully connected to Instacart API",
      debug: {
        responseStatus: response.status,
        responseData: data,
        environment: process.env.NODE_ENV,
      },
    }
  } catch (error) {
    console.error("Error testing Instacart connection:", error)

    let errorMessage = "Unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: `Failed to connect to Instacart API: ${errorMessage}`,
      debug: {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorDetails: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
        environment: process.env.NODE_ENV,
      },
    }
  }
}

export async function toggleMockMode(): Promise<{ success: boolean; message: string; mockMode: boolean }> {
  try {
    // In a real implementation, you might want to store this in a database or secure storage
    // For now, we'll just return the current state
    const currentMockMode = shouldUseMockMode

    return {
      success: true,
      message: `Mock mode is currently ${currentMockMode ? "enabled" : "disabled"}`,
      mockMode: currentMockMode,
    }
  } catch (error) {
    console.error("Error toggling mock mode:", error)
    return {
      success: false,
      message: "Failed to toggle mock mode",
      mockMode: shouldUseMockMode,
    }
  }
}
