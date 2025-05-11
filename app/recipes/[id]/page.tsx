"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Users, ChefHat, Heart, Share2, Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getRecipeById } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [recipe, setRecipe] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [servings, setServings] = useState(4)
  const [isFavorite, setIsFavorite] = useState(false)

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeData = await getRecipeById(params.id)
        if (recipeData) {
          setRecipe(recipeData)
          setServings(recipeData.servings || 4)
        }
      } catch (error) {
        console.error("Error fetching recipe:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

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
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
        <p className="mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/recipes")}>Back to Recipes</Button>
      </div>
    )
  }

  const handleAddToMealPlan = () => {
    router.push(`/meal-planner?recipeId=${recipe.id}`)
    toast({
      title: "Ready to add to meal plan",
      description: "Select a day and meal time to add this recipe.",
    })
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

  const increaseServings = () => {
    if (servings < 12) {
      setServings(servings + 1)
    }
  }

  const decreaseServings = () => {
    if (servings > 1) {
      setServings(servings - 1)
    }
  }

  // Calculate adjusted ingredient quantities
  const getAdjustedQuantity = (quantity: string) => {
    const originalQuantity = Number.parseFloat(quantity)
    const ratio = servings / recipe.servings
    return (originalQuantity * ratio).toFixed(1).replace(/\.0$/, "")
  }

  // Ensure arrays exist before mapping
  const dietaryRestrictions = recipe.dietaryRestrictions || []
  const ingredients = recipe.ingredients || []
  const instructions = recipe.instructions || []

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recipe Image and Info */}
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-lg overflow-hidden mb-6">
            <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="w-full h-full object-cover" />
          </div>

          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

          <p className="text-muted-foreground mb-6">{recipe.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Time</p>
                <p className="text-sm text-muted-foreground">{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</p>
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
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Servings</p>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={decreaseServings}
                    disabled={servings <= 1}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease</span>
                  </Button>
                  <span className="mx-2 text-sm">{servings}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={increaseServings}
                    disabled={servings >= 12}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {dietaryRestrictions.map((restriction: string) => (
              <span key={restriction} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
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
                {ingredients.map((ingredient: any) => (
                  <li key={ingredient.id} className="flex items-start gap-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-800 flex-shrink-0 mt-0.5">
                      <span className="text-xs">•</span>
                    </div>
                    <span>
                      {getAdjustedQuantity(ingredient.quantity)} {ingredient.unit} {ingredient.name}
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
                {instructions.map((instruction: string, index: number) => (
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
                <NutritionCard
                  label="Calories"
                  value={Math.round((recipe.nutritionInfo?.calories || 0) * (servings / (recipe.servings || 1)))}
                  unit="kcal"
                />
                <NutritionCard
                  label="Protein"
                  value={Math.round((recipe.nutritionInfo?.protein || 0) * (servings / (recipe.servings || 1)))}
                  unit="g"
                />
                <NutritionCard
                  label="Carbs"
                  value={Math.round((recipe.nutritionInfo?.carbs || 0) * (servings / (recipe.servings || 1)))}
                  unit="g"
                />
                <NutritionCard
                  label="Fat"
                  value={Math.round((recipe.nutritionInfo?.fat || 0) * (servings / (recipe.servings || 1)))}
                  unit="g"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Nutrition values are approximate and adjusted based on the selected number of servings.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">You might also like</h3>
              <div className="space-y-4">
                {/* This would be populated with actual related recipes */}
                <RelatedRecipeCard
                  id="recipe-2"
                  title="Chicken Fajita Bowl"
                  image="/placeholder.svg?height=80&width=120"
                  time={45}
                />
                <RelatedRecipeCard
                  id="recipe-3"
                  title="Vegan Buddha Bowl"
                  image="/placeholder.svg?height=80&width=120"
                  time={45}
                />
                <RelatedRecipeCard
                  id="recipe-5"
                  title="Mediterranean Salmon Bowl"
                  image="/placeholder.svg?height=80&width=120"
                  time={35}
                />
              </div>
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

function RelatedRecipeCard({ id, title, image, time }: { id: string; title: string; image: string; time: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
        <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-sm line-clamp-2">{title}</h4>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{time} min</span>
        </div>
      </div>
    </div>
  )
}
