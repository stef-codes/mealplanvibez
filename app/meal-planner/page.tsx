"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { format, startOfWeek, addDays } from "date-fns"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import {
  getRecipes,
  getRecipeById,
  getUserMealPlan,
  addMealToPlan,
  removeMealFromPlan,
  generateShoppingList,
} from "@/lib/data"

// Meal types
const MEAL_TYPES = ["breakfast", "lunch", "dinner"]

export default function MealPlannerPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: isAuthLoading } = useAuth()

  // Get recipe ID from URL if present
  const recipeIdFromUrl = searchParams.get("recipeId")

  // State for the current week
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    return startOfWeek(new Date(), { weekStartsOn: 1 }) // Start on Monday
  })

  // State for the meal plan
  const [mealPlan, setMealPlan] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false)

  // State for recipes
  const [recipes, setRecipes] = useState<any[]>([])

  // State for the add meal dialog
  const [isAddMealDialogOpen, setIsAddMealDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [selectedMealType, setSelectedMealType] = useState<string>("")
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("")
  const [servings, setServings] = useState<number>(2)

  // State to hold fetched recipes for each meal slot
  const [mealRecipes, setMealRecipes] = useState<{ [key: string]: any }>({})

  // Load recipes only once
  useEffect(() => {
    let isMounted = true

    const loadRecipes = async () => {
      try {
        const recipesData = await getRecipes()
        if (isMounted) {
          setRecipes(recipesData)
        }
      } catch (error) {
        console.error("Error loading recipes:", error)
        if (isMounted) {
          toast({
            title: "Error loading recipes",
            description: "There was a problem loading recipes. Please try again.",
            variant: "destructive",
          })
        }
      }
    }

    loadRecipes()

    return () => {
      isMounted = false
    }
  }, [toast])

  // Load meal plan when week changes or user changes
  useEffect(() => {
    // Skip if auth is still loading or we don't have a user
    if (isAuthLoading || !user) {
      return
    }

    // Skip if we've already loaded data and nothing has changed
    if (hasLoadedInitialData && !currentWeekStart) {
      return
    }

    let isMounted = true

    const loadMealPlan = async () => {
      setIsLoading(true)
      try {
        const weekStartStr = format(currentWeekStart, "yyyy-MM-dd")
        const mealPlanData = await getUserMealPlan(user.id, weekStartStr)

        if (!isMounted) return

        setMealPlan(mealPlanData)
        setHasLoadedInitialData(true)

        // Fetch recipes for each meal in the plan
        if (mealPlanData?.days) {
          const recipePromises: { [key: string]: Promise<any> } = {}
          const recipeIds = new Set<string>()

          // Process each day and meal type
          Object.entries(mealPlanData.days).forEach(([dayName, meals]: [string, any]) => {
            if (!meals) return

            Object.entries(meals).forEach(([mealType, meal]: [string, any]) => {
              if (meal?.recipeId) {
                const key = `${dayName}-${mealType}`
                recipeIds.add(meal.recipeId)
                recipePromises[key] = getRecipeById(meal.recipeId)
              }
            })
          })

          // Only proceed if we have promises to resolve
          if (Object.keys(recipePromises).length > 0) {
            // Resolve all promises and update state
            const resolvedRecipes = await Promise.all(Object.values(recipePromises))

            if (!isMounted) return

            const recipeMap: { [key: string]: any } = {}
            let i = 0
            Object.keys(recipePromises).forEach((key) => {
              recipeMap[key] = resolvedRecipes[i++]
            })
            setMealRecipes(recipeMap)
          }
        }
      } catch (error) {
        console.error("Error loading meal plan:", error)
        if (isMounted) {
          toast({
            title: "Error loading meal plan",
            description: "There was a problem loading your meal plan. Please try again.",
            variant: "destructive",
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMealPlan()

    return () => {
      isMounted = false
    }
  }, [currentWeekStart, user?.id, isAuthLoading, toast, hasLoadedInitialData])

  // Handle recipe from URL - only run once
  useEffect(() => {
    if (!recipeIdFromUrl || isAddMealDialogOpen) return

    let isMounted = true

    const loadRecipe = async () => {
      try {
        const recipe = await getRecipeById(recipeIdFromUrl)
        if (recipe && isMounted) {
          setSelectedRecipeId(recipeIdFromUrl)
          setServings(recipe.servings)
          setIsAddMealDialogOpen(true)
        }
      } catch (error) {
        console.error("Error loading recipe:", error)
      }
    }

    loadRecipe()

    return () => {
      isMounted = false
    }
  }, [recipeIdFromUrl, isAddMealDialogOpen])

  // Generate days of the week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i)
    return {
      date,
      dayName: format(date, "EEEE"),
      dayShort: format(date, "EEE"),
      dayOfMonth: format(date, "d"),
    }
  })

  // Navigate to previous week
  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekStart((prev) => addDays(prev, -7))
  }, [])

  // Navigate to next week
  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => addDays(prev, 7))
  }, [])

  // Open add meal dialog
  const openAddMealDialog = useCallback((day: string, mealType: string) => {
    setSelectedDay(day)
    setSelectedMealType(mealType)
    setIsAddMealDialogOpen(true)
  }, [])

  // Add meal to plan
  const addMealToPlanHandler = useCallback(async () => {
    if (!user || !selectedDay || !selectedMealType || !selectedRecipeId) {
      toast({
        title: "Missing information",
        description: "Please select a day, meal type, and recipe.",
        variant: "destructive",
      })
      return
    }

    try {
      const weekStartStr = format(currentWeekStart, "yyyy-MM-dd")
      await addMealToPlan(user.id, weekStartStr, selectedDay, selectedMealType, selectedRecipeId, servings)

      // Close dialog first to prevent any state update issues
      setIsAddMealDialogOpen(false)

      // Clear URL parameter if needed
      if (recipeIdFromUrl) {
        router.replace("/meal-planner", { scroll: false })
      }

      // Show success message
      toast({
        title: "Meal added",
        description: `Added to your meal plan for ${selectedDay} ${selectedMealType}.`,
      })

      // Refresh meal plan data
      setIsLoading(true)
      try {
        const updatedMealPlan = await getUserMealPlan(user.id, weekStartStr)
        setMealPlan(updatedMealPlan)

        // Fetch recipes for each meal in the plan
        if (updatedMealPlan?.days) {
          const recipePromises: { [key: string]: Promise<any> } = {}

          Object.entries(updatedMealPlan.days).forEach(([dayName, meals]: [string, any]) => {
            if (!meals) return

            Object.entries(meals).forEach(([mealType, meal]: [string, any]) => {
              if (meal?.recipeId) {
                const key = `${dayName}-${mealType}`
                recipePromises[key] = getRecipeById(meal.recipeId)
              }
            })
          })

          // Only proceed if we have promises to resolve
          if (Object.keys(recipePromises).length > 0) {
            const resolvedRecipes = await Promise.all(Object.values(recipePromises))
            const recipeMap: { [key: string]: any } = {}
            let i = 0
            Object.keys(recipePromises).forEach((key) => {
              recipeMap[key] = resolvedRecipes[i++]
            })
            setMealRecipes(recipeMap)
          }
        }
      } catch (error) {
        console.error("Error refreshing meal plan:", error)
      } finally {
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error adding meal to plan:", error)
      toast({
        title: "Error adding meal",
        description: "There was a problem adding the meal to your plan. Please try again.",
        variant: "destructive",
      })
    }
  }, [
    user,
    selectedDay,
    selectedMealType,
    selectedRecipeId,
    servings,
    currentWeekStart,
    recipeIdFromUrl,
    router,
    toast,
  ])

  // Remove meal from plan
  const removeMealHandler = useCallback(
    async (day: string, mealType: string) => {
      if (!user) return

      try {
        const weekStartStr = format(currentWeekStart, "yyyy-MM-dd")
        await removeMealFromPlan(user.id, weekStartStr, day, mealType)

        // Show success message
        toast({
          title: "Meal removed",
          description: `Removed from your meal plan for ${day} ${mealType}.`,
        })

        // Update local state immediately for better UX
        setMealPlan((prevMealPlan: any) => {
          if (!prevMealPlan || !prevMealPlan.days || !prevMealPlan.days[day]) {
            return prevMealPlan
          }

          const updatedDays = { ...prevMealPlan.days }
          const updatedDay = { ...updatedDays[day] }

          // Remove the meal
          delete updatedDay[mealType]
          updatedDays[day] = updatedDay

          return {
            ...prevMealPlan,
            days: updatedDays,
          }
        })

        // Also remove from mealRecipes
        setMealRecipes((prevRecipes) => {
          const updatedRecipes = { ...prevRecipes }
          delete updatedRecipes[`${day}-${mealType}`]
          return updatedRecipes
        })
      } catch (error) {
        console.error("Error removing meal:", error)
        toast({
          title: "Error removing meal",
          description: "There was a problem removing the meal from your plan. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user, currentWeekStart, toast],
  )

  // Generate shopping list
  const generateShoppingListHandler = useCallback(async () => {
    if (!user || !mealPlan) return

    try {
      await generateShoppingList(user.id, mealPlan.id)

      router.push("/shopping-list")
      toast({
        title: "Shopping list generated",
        description: "Your shopping list has been created based on your meal plan.",
      })
    } catch (error) {
      console.error("Error generating shopping list:", error)
      toast({
        title: "Error generating shopping list",
        description: "There was a problem creating your shopping list. Please try again.",
        variant: "destructive",
      })
    }
  }, [user, mealPlan, router, toast])

  // Show loading state while auth is being determined
  if (isAuthLoading) {
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
        <p className="mt-4">Loading your account...</p>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in</h1>
        <p className="mb-6">You need to be logged in to view and manage your meal plan.</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <a href="/login">Log In</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Meal Planner</h1>

        <Button
          onClick={generateShoppingListHandler}
          className="bg-green-600 hover:bg-green-700"
          disabled={isLoading || !mealPlan}
        >
          Generate Shopping List
        </Button>
      </div>

      {/* Week Navigation */}
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
        <Button variant="ghost" size="sm" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <h2 className="text-base font-medium">
          {format(currentWeekStart, "MMMM d")} - {format(addDays(currentWeekStart, 6), "MMMM d, yyyy")}
        </h2>

        <Button variant="ghost" size="sm" onClick={goToNextWeek}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-4">Loading your meal plan...</p>
        </div>
      ) : (
        /* Simplified Meal Planner */
        <div className="space-y-6">
          {MEAL_TYPES.map((mealType) => (
            <div key={mealType} className="space-y-2">
              <h3 className="text-lg font-medium capitalize">{mealType}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                {daysOfWeek.map((day) => {
                  const meal = mealPlan?.days?.[day.dayName]?.[mealType]
                  const mealKey = `${day.dayName}-${mealType}`
                  const recipe = mealRecipes[mealKey]

                  return (
                    <Card key={`${day.dayName}-${mealType}`} className="overflow-hidden">
                      <div className="bg-gray-100 px-3 py-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{day.dayShort}</span>
                          <span className="text-sm text-gray-500">{day.dayOfMonth}</span>
                        </div>
                      </div>
                      <CardContent className="p-3 min-h-[80px] flex items-center justify-center">
                        {meal && recipe ? (
                          <div className="w-full relative">
                            <div className="pr-6">
                              <p className="font-medium text-sm line-clamp-2">{recipe.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {meal.servings} {meal.servings === 1 ? "serving" : "servings"}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0 h-6 w-6 rounded-full"
                              onClick={() => removeMealHandler(day.dayName, mealType)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto py-1 px-2 text-muted-foreground"
                            onClick={() => openAddMealDialog(day.dayName, mealType)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            <span className="text-xs">Add</span>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Meal Dialog */}
      <Dialog open={isAddMealDialogOpen} onOpenChange={setIsAddMealDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add to Meal Plan</DialogTitle>
            <DialogDescription>Select a recipe for your meal plan</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.dayName} value={day.dayName}>
                        {day.dayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal-type">Meal</Label>
                <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                  <SelectTrigger id="meal-type">
                    <SelectValue placeholder="Select meal" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="capitalize">{type}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipe">Recipe</Label>
              <Select
                value={selectedRecipeId}
                onValueChange={(value) => {
                  setSelectedRecipeId(value)
                  const recipe = recipes.find((r) => r.id === value)
                  if (recipe) {
                    setServings(recipe.servings)
                  }
                }}
              >
                <SelectTrigger id="recipe">
                  <SelectValue placeholder="Select recipe" />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                max="12"
                value={servings}
                onChange={(e) => setServings(Number.parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMealDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addMealToPlanHandler} className="bg-green-600 hover:bg-green-700">
              Add to Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
