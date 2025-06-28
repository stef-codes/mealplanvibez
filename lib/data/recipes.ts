export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: "easy" | "medium" | "hard"
  cuisineType: string
  dietaryRestrictions: string[]
  ingredients: Ingredient[]
  instructions: string[]
  nutritionInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
    glycemicIndex: number
  }
}

export interface Ingredient {
  id: string
  name: string
  quantity: string
  unit: string
  category: string
}

// Sample recipes data
export const sampleRecipes: Recipe[] = [
  {
    id: "recipe-1",
    title: "Vegetarian Pasta Primavera",
    description: "A light and fresh pasta dish loaded with spring vegetables.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Italian",
    dietaryRestrictions: ["vegetarian"],
    ingredients: [
      { id: "ing-1", name: "Penne pasta", quantity: "12", unit: "oz", category: "Pasta & Grains" },
      { id: "ing-2", name: "Asparagus", quantity: "1", unit: "bunch", category: "Produce" },
      { id: "ing-3", name: "Cherry tomatoes", quantity: "1", unit: "cup", category: "Produce" },
      { id: "ing-4", name: "Bell peppers", quantity: "2", unit: "", category: "Produce" },
      { id: "ing-5", name: "Zucchini", quantity: "1", unit: "medium", category: "Produce" },
    ],
    instructions: [
      "Bring a large pot of salted water to a boil. Add pasta and cook according to package directions.",
      "While pasta cooks, prepare the vegetables. Trim asparagus and cut into 1-inch pieces.",
      "Heat olive oil in a large skillet over medium-high heat. Add garlic and sauté for 30 seconds.",
      "Add vegetables and cook until tender-crisp, about 5-7 minutes.",
      "Drain pasta and toss with vegetables. Season with salt, pepper, and fresh herbs.",
    ],
    nutritionInfo: {
      calories: 380,
      protein: 12,
      carbs: 58,
      fat: 12,
      glycemicIndex: 50,
    },
  },
  {
    id: "recipe-2",
    title: "Chicken Fajita Bowl",
    description: "A colorful and flavorful bowl with grilled chicken, peppers, and rice.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "medium",
    cuisineType: "Mexican",
    dietaryRestrictions: ["gluten-free"],
    ingredients: [
      { id: "ing-1", name: "Chicken breast", quantity: "1.5", unit: "lbs", category: "Meat & Seafood" },
      { id: "ing-2", name: "Brown rice", quantity: "1", unit: "cup", category: "Pasta & Grains" },
      { id: "ing-3", name: "Bell peppers", quantity: "3", unit: "", category: "Produce" },
      { id: "ing-4", name: "Red onion", quantity: "1", unit: "large", category: "Produce" },
      { id: "ing-5", name: "Avocado", quantity: "1", unit: "large", category: "Produce" },
    ],
    instructions: [
      "Cook rice according to package directions.",
      "Season chicken with cumin, chili powder, and garlic powder.",
      "Grill chicken for 6-7 minutes per side until cooked through.",
      "Sauté peppers and onions until softened.",
      "Slice chicken and assemble bowls with rice, vegetables, and avocado.",
    ],
    nutritionInfo: {
      calories: 450,
      protein: 35,
      carbs: 45,
      fat: 15,
      glycemicIndex: 70,
    },
  },
]

export const getRecipes = async (filters?: {
  query?: string
  cuisineType?: string
  dietaryRestrictions?: string[]
  maxTime?: number
}): Promise<Recipe[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredRecipes = sampleRecipes

  if (filters?.query) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(filters.query!.toLowerCase()) ||
        recipe.description.toLowerCase().includes(filters.query!.toLowerCase()),
    )
  }

  if (filters?.cuisineType && filters.cuisineType !== "all") {
    filteredRecipes = filteredRecipes.filter((recipe) => recipe.cuisineType === filters.cuisineType)
  }

  if (filters?.dietaryRestrictions && filters.dietaryRestrictions.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      filters.dietaryRestrictions!.every((restriction) => recipe.dietaryRestrictions.includes(restriction)),
    )
  }

  if (filters?.maxTime) {
    filteredRecipes = filteredRecipes.filter((recipe) => recipe.prepTime + recipe.cookTime <= filters.maxTime!)
  }

  return filteredRecipes
}

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return sampleRecipes.find((recipe) => recipe.id === id) || null
}
