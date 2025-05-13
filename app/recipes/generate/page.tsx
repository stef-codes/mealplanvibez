"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { SpeechInput } from "@/components/speech-input"
import type { GeneratedRecipe } from "@/lib/actions/generate-recipe"

export default function GenerateRecipePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null)

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value)
  }

  const handleSpeechInput = (text: string) => {
    setPrompt(text)
    toast({
      title: "Speech captured",
      description: "Your spoken description has been added to the input field.",
    })
  }

  const testOpenAIConnection = async () => {
    setIsGenerating(true)
    setError(null)
    setDebugInfo(null)

    try {
      const response = await fetch("/api/test-openai-object/route")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "OpenAI connection successful",
          description: "The connection to OpenAI is working properly.",
        })
        setDebugInfo(data)
      } else {
        setError(`OpenAI connection test failed: ${data.error || "Unknown error"}`)
        setDebugInfo(data)
      }
    } catch (err) {
      console.error("Error testing OpenAI connection:", err)
      setError(`Error testing OpenAI connection: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      setError("Please enter a description for the recipe you want to generate")
      return
    }

    setIsGenerating(true)
    setError(null)
    setDebugInfo(null)

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.recipe) {
        throw new Error("No recipe was generated")
      }

      setGeneratedRecipe(data.recipe)
      toast({
        title: "Recipe generated!",
        description: "Your custom recipe has been created.",
      })
    } catch (err) {
      console.error("Error generating recipe:", err)
      setError(err instanceof Error ? err.message : "Failed to generate recipe")

      // Try to extract debug info if available
      if (err instanceof Error && (err as any).cause?.debug) {
        setDebugInfo((err as any).cause.debug)
      }

      toast({
        title: "Generation failed",
        description: "There was a problem generating your recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleViewRecipe = () => {
    // In a real app, you would save the recipe to your database first
    // For now, we'll just store it in session storage and redirect
    if (generatedRecipe) {
      sessionStorage.setItem("generatedRecipe", JSON.stringify(generatedRecipe))
      router.push("/recipes/generated")
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Generate a Custom Recipe</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Recipe</CardTitle>
              <CardDescription>
                Tell us what kind of recipe you want to create. Type or speak your description!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="E.g., A healthy vegetarian pasta dish with mushrooms and spinach"
                      value={prompt}
                      onChange={handlePromptChange}
                      className="h-24"
                    />
                  </div>

                  <SpeechInput onTextCaptured={handleSpeechInput} className="mt-2" />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {debugInfo && (
                  <Alert className="bg-gray-50">
                    <AlertTitle>Debug Information</AlertTitle>
                    <AlertDescription>
                      <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Generate Recipe</span>
                      </>
                    )}
                  </Button>

                  <Button type="button" variant="outline" onClick={testOpenAIConnection} disabled={isGenerating}>
                    Test API
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Example prompts:</h3>
            <ul className="space-y-2">
              <li
                className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setPrompt(
                    "A quick and easy breakfast recipe that's high in protein and takes less than 15 minutes to make",
                  )
                }
              >
                A quick and easy breakfast recipe that's high in protein and takes less than 15 minutes to make
              </li>
              <li
                className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                onClick={() => setPrompt("A vegan dessert with chocolate and berries that's low in sugar")}
              >
                A vegan dessert with chocolate and berries that's low in sugar
              </li>
              <li
                className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                onClick={() => setPrompt("A Mediterranean-inspired fish dish with lemon and herbs")}
              >
                A Mediterranean-inspired fish dish with lemon and herbs
              </li>
            </ul>
          </div>
        </div>

        <div>
          {generatedRecipe ? (
            <Card>
              <CardHeader>
                <CardTitle>{generatedRecipe.title}</CardTitle>
                <CardDescription>{generatedRecipe.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {generatedRecipe.difficulty}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {generatedRecipe.cuisineType}
                  </span>
                  {generatedRecipe.dietaryRestrictions.map((restriction, index) => (
                    <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {restriction}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground">Prep Time</p>
                    <p className="font-medium">{generatedRecipe.prepTime} min</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground">Cook Time</p>
                    <p className="font-medium">{generatedRecipe.cookTime} min</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground">Servings</p>
                    <p className="font-medium">{generatedRecipe.servings}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Ingredients:</h3>
                  <ul className="space-y-1">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm">
                        {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Instructions:</h3>
                  <ol className="space-y-1 list-decimal list-inside">
                    {generatedRecipe.instructions.map((step, index) => (
                      <li key={index} className="text-sm">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleViewRecipe}>
                  View Full Recipe
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
              <div>
                <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Your generated recipe will appear here</h3>
                <p className="text-muted-foreground">
                  Describe what you're looking for and our AI will create a custom recipe just for you
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
