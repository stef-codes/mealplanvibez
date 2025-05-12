import { type NextRequest, NextResponse } from "next/server"
import { generateRecipe } from "@/lib/actions/generate-recipe"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key is missing",
          debug: {
            apiKeyExists: false,
            env: Object.keys(process.env).filter((key) => key.includes("OPENAI") || key.includes("API")),
          },
        },
        { status: 500 },
      )
    }

    console.log("API route: Generating recipe with prompt:", prompt)
    console.log("API route: OpenAI API key exists:", !!process.env.OPENAI_API_KEY)

    const result = await generateRecipe(prompt)

    if (!result.recipe) {
      return NextResponse.json(
        {
          error: result.error || "Failed to generate recipe",
          debug: result.debug,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ recipe: result.recipe })
  } catch (error) {
    console.error("Error in generate recipe API:", error)
    return NextResponse.json(
      {
        error: "Failed to generate recipe",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
