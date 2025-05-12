"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the recipe schema
const recipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  prepTime: z.number(),
  cookTime: z.number(),
  servings: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  cuisineType: z.string(),
  dietaryRestrictions: z.array(z.string()),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      unit: z.string(),
    }),
  ),
  instructions: z.array(z.string()),
  nutritionInfo: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
})

export type GeneratedRecipe = z.infer<typeof recipeSchema>

export async function generateRecipe(prompt: string): Promise<{
  recipe: GeneratedRecipe | null
  error?: string
  debug?: any
}> {
  try {
    // Check if OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.warn("OpenAI API key is missing. Cannot generate recipe.")
      return {
        recipe: null,
        error: "OpenAI API key is missing",
        debug: { apiKeyExists: false },
      }
    }

    console.log("Generating recipe with prompt:", prompt)
    console.log("OpenAI API key exists:", !!openaiApiKey)

    try {
      // Use generateObject instead of generateText for structured output
      const { object } = await generateObject({
        model: openai("gpt-4o", { apiKey: openaiApiKey }),
        schema: recipeSchema,
        prompt: `
          Generate a detailed recipe based on this request: "${prompt}"
          
          The recipe should include:
          - A creative title
          - A brief description
          - Preparation time in minutes
          - Cooking time in minutes
          - Number of servings
          - Difficulty level (easy, medium, or hard)
          - Cuisine type
          - Dietary restrictions (e.g., vegetarian, vegan, gluten-free, etc.)
          - A list of ingredients with quantities and units
          - Step-by-step instructions
          - Nutrition information (calories, protein, carbs, fat)
        `,
        temperature: 0.7,
        maxTokens: 2000,
      })

      // Add a unique ID to the recipe
      const generatedRecipe = {
        ...object,
        id: `generated-${Date.now()}`,
        image: "/images/pasta-primavera.jpg", // Default image
      }

      console.log("Successfully generated recipe:", generatedRecipe.title)
      return { recipe: generatedRecipe }
    } catch (apiError: any) {
      console.error("OpenAI API error:", apiError)
      return {
        recipe: null,
        error: `OpenAI API error: ${apiError.message || "Unknown error"}`,
        debug: {
          apiError: apiError.message,
          apiKeyExists: !!openaiApiKey,
          apiKeyFirstChars: openaiApiKey ? `${openaiApiKey.substring(0, 3)}...` : null,
        },
      }
    }
  } catch (error: any) {
    console.error("Error generating recipe:", error)
    return {
      recipe: null,
      error: `Error generating recipe: ${error.message || "Unknown error"}`,
      debug: { error: error.message },
    }
  }
}
