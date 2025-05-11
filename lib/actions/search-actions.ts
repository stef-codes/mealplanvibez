"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getRecipes, type Recipe } from "@/lib/data"

// Helper function to clean OpenAI response of markdown formatting
function cleanJsonResponse(text: string): string {
  // Remove markdown code block formatting if present
  let cleaned = text.trim()

  // Remove ```json and ``` markers
  if (cleaned.startsWith("```")) {
    // Find the first newline to skip the ```json line
    const firstNewline = cleaned.indexOf("\n")
    if (firstNewline !== -1) {
      cleaned = cleaned.substring(firstNewline + 1)
    }

    // Remove closing ```
    const lastBackticks = cleaned.lastIndexOf("```")
    if (lastBackticks !== -1) {
      cleaned = cleaned.substring(0, lastBackticks)
    }
  }

  return cleaned.trim()
}

export async function searchRecipesWithAI(query: string): Promise<Recipe[]> {
  try {
    // If the query is empty, return all recipes
    if (!query.trim()) {
      return getRecipes()
    }

    // Check if OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.warn("OpenAI API key is missing in server action. Falling back to regular search.")
      return getRecipes({ query })
    }

    console.log("Using OpenAI API for search with key:", openaiApiKey ? "Key exists" : "No key")

    // Get all recipes to search through
    const allRecipes = await getRecipes()

    try {
      // Use OpenAI to understand the query and extract search parameters
      const { text: rawSearchParamsText } = await generateText({
        model: openai("gpt-4o", { apiKey: openaiApiKey }),
        prompt: `
          I need to search for recipes based on this query: "${query}"
          
          Extract the following information from the query:
          1. Keywords (ingredients, dish types, etc.)
          2. Dietary restrictions (vegetarian, vegan, gluten-free, etc.)
          3. Cuisine type (Italian, Mexican, Asian, etc.)
          4. Maximum cooking time (in minutes)
          
          Format your response as a JSON object with these fields:
          {
            "keywords": ["keyword1", "keyword2"],
            "dietaryRestrictions": ["restriction1", "restriction2"],
            "cuisineType": "cuisine or null if not specified",
            "maxTime": number or null if not specified
          }
          
          IMPORTANT: Return ONLY the JSON object with no markdown formatting, no code blocks, and no additional text.
        `,
      })

      // Clean the response and parse the JSON
      const cleanedResponse = cleanJsonResponse(rawSearchParamsText)
      console.log("Cleaned OpenAI response:", cleanedResponse)

      let searchParams
      try {
        searchParams = JSON.parse(cleanedResponse)
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError)
        console.error("Raw response:", rawSearchParamsText)
        console.error("Cleaned response:", cleanedResponse)
        // Fall back to regular search if parsing fails
        return getRecipes({ query })
      }

      // Filter recipes based on the extracted parameters
      let filteredRecipes = allRecipes

      // Filter by keywords (search in title and description)
      if (searchParams.keywords && searchParams.keywords.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) => {
          const titleAndDesc = `${recipe.title.toLowerCase()} ${recipe.description.toLowerCase()}`
          return searchParams.keywords.some((keyword: string) => titleAndDesc.includes(keyword.toLowerCase()))
        })
      }

      // Filter by dietary restrictions
      if (searchParams.dietaryRestrictions && searchParams.dietaryRestrictions.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          searchParams.dietaryRestrictions.every((restriction: string) =>
            recipe.dietaryRestrictions.includes(restriction),
          ),
        )
      }

      // Filter by cuisine type
      if (searchParams.cuisineType && searchParams.cuisineType !== null) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.cuisineType.toLowerCase() === searchParams.cuisineType.toLowerCase(),
        )
      }

      // Filter by max time
      if (searchParams.maxTime && searchParams.maxTime !== null) {
        filteredRecipes = filteredRecipes.filter((recipe) => recipe.prepTime + recipe.cookTime <= searchParams.maxTime)
      }

      // If no recipes match the filters, return a subset of all recipes
      if (filteredRecipes.length === 0) {
        // Use OpenAI to find the most relevant recipes
        const { text: rawRelevantRecipesText } = await generateText({
          model: openai("gpt-4o", { apiKey: openaiApiKey }),
          prompt: `
            I'm looking for recipes based on this query: "${query}"
            
            Here are all the available recipes:
            ${JSON.stringify(
              allRecipes.map((r) => ({
                id: r.id,
                title: r.title,
                description: r.description,
                cuisineType: r.cuisineType,
                dietaryRestrictions: r.dietaryRestrictions,
                prepTime: r.prepTime,
                cookTime: r.cookTime,
              })),
            )}
            
            Return the IDs of the 5 most relevant recipes as a JSON array:
            ["recipe-id-1", "recipe-id-2", ...]
            
            IMPORTANT: Return ONLY the JSON array with no markdown formatting, no code blocks, and no additional text.
          `,
        })

        // Clean the response and parse the JSON
        const cleanedRelevantResponse = cleanJsonResponse(rawRelevantRecipesText)

        let relevantRecipeIds
        try {
          relevantRecipeIds = JSON.parse(cleanedRelevantResponse)
        } catch (parseError) {
          console.error("Error parsing OpenAI relevant recipes response:", parseError)
          // Return a subset of all recipes if parsing fails
          return allRecipes.slice(0, 5)
        }

        // Filter recipes by the relevant IDs
        filteredRecipes = allRecipes.filter((recipe) => relevantRecipeIds.includes(recipe.id))
      }

      return filteredRecipes
    } catch (aiError) {
      console.error("Error using OpenAI for search:", aiError)
      // Fall back to regular search if AI processing fails
      return getRecipes({ query })
    }
  } catch (error) {
    console.error("Error searching recipes with AI:", error)
    // Fall back to regular search if AI search fails
    return getRecipes({ query })
  }
}
