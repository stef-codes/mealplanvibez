import { type NextRequest, NextResponse } from "next/server"
import { searchRecipesWithAI } from "@/lib/actions/search-actions"
import { getRecipes } from "@/lib/data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query") || ""

  // Add debugging information
  console.log("Search API called with query:", query)
  console.log("OpenAI API key exists:", !!process.env.OPENAI_API_KEY)
  console.log("AI search enabled:", process.env.NEXT_PUBLIC_AI_SEARCH_ENABLED)

  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key is missing in API route. Falling back to regular search.")
      // Fall back to regular search
      const recipes = await getRecipes({ query })
      return NextResponse.json({
        recipes,
        aiEnabled: false,
        message: "Using regular search (OpenAI API key missing)",
      })
    }

    try {
      console.log("Attempting AI search with query:", query)
      const recipes = await searchRecipesWithAI(query)
      console.log("AI search successful, found", recipes.length, "recipes")
      return NextResponse.json({
        recipes,
        aiEnabled: true,
      })
    } catch (searchError) {
      console.error("AI search failed:", searchError)
      // Fall back to regular search
      const recipes = await getRecipes({ query })
      return NextResponse.json({
        recipes,
        aiEnabled: false,
        message: "AI search failed, using regular search instead",
        error: searchError instanceof Error ? searchError.message : "Unknown error",
      })
    }
  } catch (error) {
    console.error("Search API error:", error)

    // Final fallback - try regular search one more time
    try {
      const recipes = await getRecipes({ query })
      return NextResponse.json({
        recipes,
        aiEnabled: false,
        error: error instanceof Error ? error.message : "AI search failed, using regular search",
      })
    } catch (fallbackError) {
      return NextResponse.json(
        {
          error: "Failed to search recipes",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  }
}
