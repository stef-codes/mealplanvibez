import { NextResponse } from "next/server"
import { testInstacartConnection } from "@/lib/actions/instacart-actions"

export async function GET() {
  try {
    // Log environment variables for debugging (without exposing the full key)
    const apiKey = process.env.INSTACART_API_KEY
    console.log("API route - INSTACART_API_KEY exists:", !!apiKey)
    if (apiKey) {
      console.log("API route - INSTACART_API_KEY first few chars:", apiKey.substring(0, 3) + "...")
    }

    // Log all environment variables for debugging
    console.log(
      "API route - Available environment variables:",
      Object.keys(process.env).filter((key) => key.includes("INSTACART") || key.includes("API") || key.includes("KEY")),
    )

    // Test the connection
    const result = await testInstacartConnection()

    // Log the result
    console.log("API route - Test connection result:", {
      success: result.success,
      message: result.message,
      // Don't log the full debug object as it might contain sensitive info
    })

    return NextResponse.json(result)
  } catch (error) {
    // Log the full error
    console.error("API route - Error in test connection route:", error)

    // Prepare a detailed error response
    const errorResponse = {
      success: false,
      message: "An error occurred while testing the Instacart connection",
      error: {
        name: error instanceof Error ? error.name : "Unknown error type",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
      },
      environmentInfo: {
        nodeEnv: process.env.NODE_ENV,
        hasInstacartApiKey: !!process.env.INSTACART_API_KEY,
        availableEnvVars: Object.keys(process.env).filter(
          (key) => key.includes("INSTACART") || key.includes("API") || key.includes("KEY"),
        ),
      },
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
