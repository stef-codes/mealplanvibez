import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Simple schema for testing
const testSchema = z.object({
  message: z.string(),
  items: z.array(z.string()),
  count: z.number(),
})

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key is missing",
          envVars: Object.keys(process.env).filter(
            (key) => key.includes("OPENAI") || key.includes("API") || key.includes("KEY"),
          ),
        },
        { status: 500 },
      )
    }

    try {
      const { object } = await generateObject({
        model: openai("gpt-4o", { apiKey: process.env.OPENAI_API_KEY }),
        schema: testSchema,
        prompt: "Generate a test message with 3 random items and a count of 42",
      })

      return NextResponse.json({
        success: true,
        object,
        apiKeyExists: true,
        apiKeyFirstChars: process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 3)}...` : null,
      })
    } catch (apiError: any) {
      return NextResponse.json(
        {
          error: "OpenAI API call failed",
          message: apiError.message,
          stack: apiError.stack,
          apiKeyExists: !!process.env.OPENAI_API_KEY,
          apiKeyFirstChars: process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 3)}...` : null,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("OpenAI API test failed:", error)
    return NextResponse.json(
      {
        error: "OpenAI API test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
