import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the current state from the request body
    const { enabled } = await request.json()

    // In a real app, this would update the environment variable
    // For this demo, we'll just return the new state

    return NextResponse.json({
      success: true,
      mockModeEnabled: enabled,
      message: enabled ? "Mock mode enabled" : "Mock mode disabled",
      note: "This is a simulated response. In a real app, this would update the environment variable.",
    })
  } catch (error) {
    console.error("Error toggling mock mode:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to toggle mock mode",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
