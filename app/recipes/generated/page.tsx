"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Users, ChefHat, Heart, Share2, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import type { GeneratedRecipe } from "@/lib/actions/generate-recipe"

export default function GeneratedRecipePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // Get the generated recipe from session storage
    const storedRecipe = sessionStorage.getItem("generatedRecipe")

    if (storedRecipe) {
      try {
        const parsedRecipe = JSON.parse(storedRecipe)
        setRecipe(parsedRecipe)
      } catch (error) {
        console.error("Error parsing stored recipe:", error)
      }
    }

    setIsLoading(false)
  }, [])

  const handleAddToMealPlan = () => {
    // In a real app, you would save the recipe to your database first
    toast({
      title: "Recipe saved",
      description: "This recipe has been saved to your collection.",
    })

    router.push(`/meal-planner`)
  }

  const handleAddToShoppingList = () => {
    toast({
      title: "Added to shopping list",
      description: "Ingredients have been added to your shopping list.",
    })

    router.push("/shopping-list")
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "This recipe has been removed from your favorites."
        : "This recipe has been added to your favorites.",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Recipe link has been copied to clipboard.",
    })
  }

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <p className="mt-4">Loading recipe...</p>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertTitle>Recipe not found</AlertTitle>
          <AlertDescription>
            The generated recipe could not be found. Please go back and generate a new recipe.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button onClick={() => router.push("/recipes/generate")}>Generate New Recipe</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recipe Image and Info */}
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-gray-100 flex items-center justify-center">
            <div className="text-center p-8">
              <ChefHat className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-xl font-medium">AI Generated Recipe</h2>
              <p className="text-muted-foreground mt-2">This is a custom recipe created just for you</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

          <p className="text-muted-foreground mb-6">{recipe.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Time</p>
                <p className="text-sm text-muted-foreground">{recipe.prepTime + recipe.cookTime} min</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Difficulty</p>
                <p className="text-sm text-muted-foreground capitalize">{recipe.difficulty}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Servings</p>
                <p className="text-sm text-muted-foreground">{recipe.servings}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {recipe.dietaryRestrictions.map((restriction, index) => (
              <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {restriction}
              </span>
            ))}
            {recipe.cuisineType && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{recipe.cuisineType}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Button variant="outline" className="flex items-center gap-2" onClick={toggleFavorite}>
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              <span>{isFavorite ? "Favorited" : "Favorite"}</span>
            </Button>

            <Button variant="outline" className="flex items-center gap-2" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>

            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700" onClick={handleAddToMealPlan}>
              <Plus className="h-4 w-4" />
              <span>Add to Meal Plan</span>
            </Button>
          </div>

          <Tabs defaultValue="ingredients">
            <TabsList className="mb-4">
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="space-y-4">
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-800 flex-shrink-0 mt-0.5">
                      <span className="text-xs">•</span>
                    </div>
                    <span>
                      {ingredient.quantity} {ingredient.unit} {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-700"
                onClick={handleAddToShoppingList}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add Ingredients to Shopping List</span>
              </Button>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4">
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-800 flex-shrink-0 mt-0.5">
                      <span className="text-xs">{index + 1}</span>
                    </div>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <NutritionCard label="Calories" value={recipe.nutritionInfo.calories} unit="kcal" />
                <NutritionCard label="Protein" value={recipe.nutritionInfo.protein} unit="g" />
                <NutritionCard label="Carbs" value={recipe.nutritionInfo.carbs} unit="g" />
                <NutritionCard label="Fat" value={recipe.nutritionInfo.fat} unit="g" />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Nutrition values are approximate and based on the entire recipe.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">About AI Generated Recipes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This recipe was created by AI based on your specifications. You can save it to your collection, add it
                to your meal plan, or generate a new recipe.
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => router.push("/recipes/generate")}
              >
                Generate Another Recipe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NutritionCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">
        {value}
        <span className="text-sm font-normal ml-1">{unit}</span>
      </p>
    </div>
  )
}
