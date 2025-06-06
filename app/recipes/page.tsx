"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, Clock, AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getRecipes, type Recipe, isPreviewEnvironment } from "@/lib/data"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function RecipesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const queryFromUrl = searchParams.get("query")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchQuery, setSearchQuery] = useState(queryFromUrl || "")
  const [isLoading, setIsLoading] = useState(true)
  const [isAISearching, setIsAISearching] = useState(false)
  const [isAIAvailable, setIsAIAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    cuisineType: "",
    dietaryRestrictions: [] as string[],
    maxTime: 60,
  })

  // Check if AI search is available
  useEffect(() => {
    // This is just a client-side check - the actual availability is determined server-side
    setIsAIAvailable(process.env.NEXT_PUBLIC_AI_SEARCH_ENABLED === "true")
    console.log("AI search enabled check:", process.env.NEXT_PUBLIC_AI_SEARCH_ENABLED)
  }, [])

  // Execute search if query is provided in URL
  useEffect(() => {
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl)
      handleSearch(queryFromUrl)
    }
  }, [queryFromUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load recipes on mount
  useEffect(() => {
    const loadRecipes = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Add a small delay to prevent too many rapid requests during development
        if (process.env.NODE_ENV === "development") {
          await new Promise((resolve) => setTimeout(resolve, 300))
        }

        const fetchedRecipes = await getRecipes()
        setRecipes(fetchedRecipes)
      } catch (err) {
        console.error("Error loading recipes:", err)
        setError("Failed to load recipes. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (!queryFromUrl) {
      loadRecipes()
    }
  }, [queryFromUrl])

  // Apply user's dietary preferences if available
  useEffect(() => {
    if (user?.preferences.dietaryRestrictions && user.preferences.dietaryRestrictions.length > 0) {
      setFilters((prev) => ({
        ...prev,
        dietaryRestrictions: user.preferences.dietaryRestrictions,
      }))
    }
  }, [user])

  // Handle regular search with filters
  const handleRegularSearch = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const fetchedRecipes = await getRecipes({
        query: searchQuery,
        cuisineType: filters.cuisineType || undefined,
        dietaryRestrictions: filters.dietaryRestrictions.length > 0 ? filters.dietaryRestrictions : undefined,
        maxTime: filters.maxTime,
      })

      setRecipes(fetchedRecipes)
    } catch (err) {
      console.error("Error searching recipes:", err)
      setError("Failed to search recipes. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Generic search handler that decides whether to use AI or regular search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      handleRegularSearch()
      return
    }

    setIsAISearching(true)
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Search API error response:", errorText)
        throw new Error(`Search request failed with status ${response.status}`)
      }

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError)
        throw new Error("Invalid response from search API")
      }

      // Set the recipes from the response
      setRecipes(data.recipes || [])

      // Check if AI was used
      if (data.aiEnabled) {
        toast({
          title: "AI Search Results",
          description: `Found ${data.recipes?.length || 0} recipes matching your query.`,
        })
      } else {
        toast({
          title: "Search Results",
          description: data.message || `Found ${data.recipes?.length || 0} recipes using standard search.`,
        })
      }

      // Log any errors that were returned
      if (data.error) {
        console.warn("Search API returned an error:", data.error)
      }
    } catch (err) {
      console.error("Error with search:", err)
      setError("Search failed. Please try again or use the filters instead.")

      // Try to fall back to regular search
      try {
        await handleRegularSearch()
        toast({
          title: "Using standard search",
          description: "AI search failed. Using standard search instead.",
        })
      } catch (fallbackErr) {
        console.error("Fallback search also failed:", fallbackErr)
      }
    } finally {
      setIsLoading(false)
      setIsAISearching(false)
    }
  }

  // Handle search input
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      cuisineType: "",
      dietaryRestrictions: [],
      maxTime: 60,
    })
    setSearchQuery("")

    // Load all recipes
    const loadAllRecipes = async () => {
      setIsLoading(true)
      try {
        const fetchedRecipes = await getRecipes()
        setRecipes(fetchedRecipes)
      } catch (err) {
        console.error("Error loading recipes:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadAllRecipes()
  }

  // Cuisine type options
  const cuisineTypes = ["Italian", "Mexican", "Asian", "Mediterranean", "American", "Indian"]

  // Dietary restriction options
  const dietaryOptions = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "gluten-free", label: "Gluten-Free" },
    { id: "dairy-free", label: "Dairy-Free" },
    { id: "nut-free", label: "Nut-Free" },
    { id: "keto", label: "Keto" },
    { id: "paleo", label: "Paleo" },
  ]

  // Filter recipes based on current filters
  const filteredRecipes = recipes.filter((recipe) => {
    // Filter by cuisine type
    if (filters.cuisineType && filters.cuisineType !== "all" && recipe.cuisineType !== filters.cuisineType) {
      return false
    }

    // Filter by dietary restrictions
    if (filters.dietaryRestrictions.length > 0) {
      if (!filters.dietaryRestrictions.every((restriction) => recipe.dietaryRestrictions.includes(restriction))) {
        return false
      }
    }

    // Filter by max time
    if (recipe.prepTime + recipe.cookTime > filters.maxTime) {
      return false
    }

    return true
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Recipes</h1>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/recipes/generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Generate Recipe</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search recipes or ask a question..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              disabled={isLoading}
            >
              {isAISearching ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </Button>
          </form>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Recipes</SheetTitle>
                <SheetDescription>Narrow down recipes based on your preferences</SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <Label>Cuisine Type</Label>
                  <Select
                    value={filters.cuisineType}
                    onValueChange={(value) => setFilters({ ...filters, cuisineType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All cuisines" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All cuisines</SelectItem>
                      {cuisineTypes.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Dietary Restrictions</Label>
                  {dietaryOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={filters.dietaryRestrictions.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({
                              ...filters,
                              dietaryRestrictions: [...filters.dietaryRestrictions, option.id],
                            })
                          } else {
                            setFilters({
                              ...filters,
                              dietaryRestrictions: filters.dietaryRestrictions.filter((id) => id !== option.id),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={option.id} className="font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Maximum Total Time</Label>
                    <span className="text-sm text-muted-foreground">{filters.maxTime} minutes</span>
                  </div>
                  <Slider
                    value={[filters.maxTime]}
                    min={15}
                    max={120}
                    step={5}
                    onValueChange={(value) => setFilters({ ...filters, maxTime: value[0] })}
                  />
                </div>
              </div>

              <SheetFooter>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleRegularSearch()}>
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isPreviewEnvironment() && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Preview Mode</AlertTitle>
          <AlertDescription className="text-amber-700">
            Running in preview mode with sample recipe data. Connect to Supabase for real data.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-4 text-muted-foreground">Loading recipes...</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No recipes found</h2>
          <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{recipe.prepTime + recipe.cookTime} min</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
        <p className="text-muted-foreground text-sm flex-1">{recipe.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {recipe.dietaryRestrictions.map((restriction) => (
            <span key={restriction} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {restriction}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
          <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
