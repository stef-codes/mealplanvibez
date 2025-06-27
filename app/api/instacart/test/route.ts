import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the Instacart API key is set
    const apiKey = process.env.INSTACART_API_KEY

    return NextResponse.json({
      apiKeyExists: !!apiKey,
      apiKeyFirstChars: apiKey ? `${apiKey.substring(0, 3)}...` : null,
      env: process.env.NODE_ENV,
      mockModeEnabled: process.env.INSTACART_MOCK_MODE === "true",
      serverTime: new Date().toISOString(),
      vercelEnv: process.env.VERCEL_ENV || "not set",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error checking Instacart API key",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
