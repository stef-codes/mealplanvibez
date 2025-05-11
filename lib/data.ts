// Function to determine if we're in a preview environment or if Supabase credentials are missing
export function isPreviewEnvironment() {
  // Check if Supabase credentials are missing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return true
  }

  // Check if we're in a Vercel preview deployment
  if (typeof process.env.VERCEL_ENV !== "undefined" && process.env.VERCEL_ENV === "preview") {
    return true
  }

  // Check if we're in a development environment
  if (process.env.NODE_ENV === "development") {
    // You can comment this line out if you want to use real data in development
    // return true
  }

  return false
}

// Recipe types
export type Ingredient = {
  id: string
  name: string
  quantity: string
  unit: string
  category: string
}

export type Recipe = {
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
  }
}

export type MealPlan = {
  id: string
  userId: string
  week: string // ISO date string for the start of the week
  days: {
    [key: string]: {
      // day of week
      breakfast?: PlannedMeal
      lunch?: PlannedMeal
      dinner?: PlannedMeal
    }
  }
}

export type PlannedMeal = {
  recipeId: string
  servings: number
}

export type ShoppingListItem = {
  id: string
  name: string
  quantity: string
  unit: string
  category: string
  checked: boolean
  recipeIds: string[] // to track which recipes this item is for
}

export type ShoppingList = {
  id: string
  userId: string
  week: string // ISO date string for the start of the week
  items: ShoppingListItem[]
}

// Sample data for initial app state
export const recipes: Recipe[] = [
  {
    id: "recipe-1",
    title: "Vegetarian Pasta Primavera",
    description: "A light and fresh pasta dish loaded with spring vegetables.",
    image: "/images/pasta-primavera.jpg",
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
      { id: "ing-6", name: "Olive oil", quantity: "2", unit: "tbsp", category: "Oils & Vinegars" },
      { id: "ing-7", name: "Garlic", quantity: "3", unit: "cloves", category: "Produce" },
      { id: "ing-8", name: "Parmesan cheese", quantity: "1/4", unit: "cup", category: "Dairy" },
      { id: "ing-9", name: "Fresh basil", quantity: "1/4", unit: "cup", category: "Produce" },
      { id: "ing-10", name: "Salt", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-11", name: "Black pepper", quantity: "1/2", unit: "tsp", category: "Spices" },
    ],
    instructions: [
      "Bring a large pot of salted water to a boil. Add pasta and cook according to package directions until al dente.",
      "While pasta cooks, prepare the vegetables. Trim asparagus and cut into 1-inch pieces. Halve cherry tomatoes. Dice bell peppers and zucchini.",
      "Heat olive oil in a large skillet over medium-high heat. Add garlic and sauté for 30 seconds until fragrant.",
      "Add bell peppers and cook for 2 minutes. Add asparagus and zucchini, cook for another 3-4 minutes until vegetables begin to soften.",
      "Add cherry tomatoes and cook for 1 minute more. Season with salt and pepper.",
      "Drain pasta, reserving 1/2 cup of pasta water. Add pasta to the skillet with vegetables.",
      "Add a splash of pasta water to create a light sauce. Toss to combine.",
      "Remove from heat and stir in fresh basil and Parmesan cheese. Serve immediately.",
    ],
    nutritionInfo: {
      calories: 380,
      protein: 12,
      carbs: 58,
      fat: 12,
    },
  },
  {
    id: "recipe-2",
    title: "Chicken Fajita Bowl",
    description: "A colorful and flavorful bowl with grilled chicken, peppers, and rice.",
    image: "/images/chicken-fajita.jpg",
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
      { id: "ing-6", name: "Lime", quantity: "1", unit: "", category: "Produce" },
      { id: "ing-7", name: "Cilantro", quantity: "1/4", unit: "cup", category: "Produce" },
      { id: "ing-8", name: "Cumin", quantity: "1", unit: "tbsp", category: "Spices" },
      { id: "ing-9", name: "Chili powder", quantity: "1", unit: "tbsp", category: "Spices" },
      { id: "ing-10", name: "Garlic powder", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-11", name: "Olive oil", quantity: "2", unit: "tbsp", category: "Oils & Vinegars" },
      { id: "ing-12", name: "Salt", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-13", name: "Black beans", quantity: "1", unit: "can", category: "Canned Goods" },
    ],
    instructions: [
      "Cook rice according to package directions.",
      "In a small bowl, mix cumin, chili powder, garlic powder, and salt.",
      "Slice chicken breast into strips and toss with half of the spice mixture and 1 tablespoon olive oil.",
      "Slice bell peppers and onion into strips.",
      "Heat a large skillet over medium-high heat. Add remaining olive oil.",
      "Cook chicken for 5-6 minutes until cooked through. Remove from skillet and set aside.",
      "In the same skillet, add peppers and onions. Cook for 5-7 minutes until softened and slightly charred.",
      "Sprinkle remaining spice mixture over vegetables and stir to combine.",
      "Drain and rinse black beans, then add to the skillet. Cook for 1-2 minutes to heat through.",
      "Slice avocado and lime.",
      "Assemble bowls: Start with rice, add chicken, vegetable and bean mixture, sliced avocado, and cilantro.",
      "Squeeze lime over the top and serve.",
    ],
    nutritionInfo: {
      calories: 450,
      protein: 35,
      carbs: 45,
      fat: 15,
    },
  },
  {
    id: "recipe-3",
    title: "Vegan Buddha Bowl",
    description: "A nourishing bowl packed with roasted vegetables, quinoa, and tahini dressing.",
    image: "/images/buddha-bowl.jpg",
    prepTime: 15,
    cookTime: 30,
    servings: 2,
    difficulty: "easy",
    cuisineType: "Mediterranean",
    dietaryRestrictions: ["vegan", "gluten-free", "dairy-free"],
    ingredients: [
      { id: "ing-1", name: "Quinoa", quantity: "1", unit: "cup", category: "Pasta & Grains" },
      { id: "ing-2", name: "Sweet potato", quantity: "1", unit: "large", category: "Produce" },
      { id: "ing-3", name: "Chickpeas", quantity: "1", unit: "can", category: "Canned Goods" },
      { id: "ing-4", name: "Kale", quantity: "2", unit: "cups", category: "Produce" },
      { id: "ing-5", name: "Tahini", quantity: "3", unit: "tbsp", category: "Condiments" },
      { id: "ing-6", name: "Lemon", quantity: "1", unit: "", category: "Produce" },
      { id: "ing-7", name: "Garlic", quantity: "1", unit: "clove", category: "Produce" },
      { id: "ing-8", name: "Olive oil", quantity: "2", unit: "tbsp", category: "Oils & Vinegars" },
      { id: "ing-9", name: "Cumin", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-10", name: "Paprika", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-11", name: "Salt", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-12", name: "Maple syrup", quantity: "1", unit: "tsp", category: "Condiments" },
      { id: "ing-13", name: "Avocado", quantity: "1", unit: "", category: "Produce" },
    ],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "Rinse quinoa and cook according to package directions.",
      "Peel and dice sweet potato into 1-inch cubes. Toss with 1 tablespoon olive oil, 1/2 teaspoon cumin, 1/2 teaspoon paprika, and 1/2 teaspoon salt.",
      "Spread sweet potatoes on a baking sheet and roast for 25-30 minutes until tender and slightly crispy.",
      "Drain and rinse chickpeas. Pat dry with a paper towel. Toss with remaining olive oil, cumin, and paprika.",
      "Add chickpeas to the baking sheet with sweet potatoes for the last 15 minutes of roasting.",
      "Wash and chop kale. Massage with a pinch of salt until slightly wilted.",
      "Make tahini dressing: Whisk together tahini, lemon juice, minced garlic, maple syrup, and 2-3 tablespoons water until smooth.",
      "Slice avocado.",
      "Assemble bowls: Start with quinoa, add roasted sweet potatoes, chickpeas, kale, and avocado.",
      "Drizzle with tahini dressing and serve.",
    ],
    nutritionInfo: {
      calories: 520,
      protein: 18,
      carbs: 65,
      fat: 22,
    },
  },
  {
    id: "recipe-4",
    title: "Mediterranean Salmon Bowl",
    description: "A protein-rich bowl featuring baked salmon, couscous, and Greek-inspired toppings.",
    image: "/images/salmon-bowl.jpg",
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: "medium",
    cuisineType: "Mediterranean",
    dietaryRestrictions: ["dairy-free"],
    ingredients: [
      { id: "ing-1", name: "Salmon fillet", quantity: "12", unit: "oz", category: "Meat & Seafood" },
      { id: "ing-2", name: "Couscous", quantity: "3/4", unit: "cup", category: "Pasta & Grains" },
      { id: "ing-3", name: "Cucumber", quantity: "1", unit: "medium", category: "Produce" },
      { id: "ing-4", name: "Cherry tomatoes", quantity: "1", unit: "cup", category: "Produce" },
      { id: "ing-5", name: "Red onion", quantity: "1/4", unit: "cup", category: "Produce" },
      { id: "ing-6", name: "Kalamata olives", quantity: "1/4", unit: "cup", category: "Canned Goods" },
      { id: "ing-7", name: "Lemon", quantity: "1", unit: "", category: "Produce" },
      { id: "ing-8", name: "Olive oil", quantity: "3", unit: "tbsp", category: "Oils & Vinegars" },
      { id: "ing-9", name: "Dried oregano", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-10", name: "Garlic powder", quantity: "1/2", unit: "tsp", category: "Spices" },
      { id: "ing-11", name: "Salt", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-12", name: "Black pepper", quantity: "1/2", unit: "tsp", category: "Spices" },
      { id: "ing-13", name: "Fresh parsley", quantity: "2", unit: "tbsp", category: "Produce" },
    ],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "Place salmon on a baking sheet lined with parchment paper. Drizzle with 1 tablespoon olive oil and season with salt, pepper, oregano, and garlic powder.",
      "Bake salmon for 12-15 minutes until it flakes easily with a fork.",
      "Meanwhile, bring 1 cup of water to a boil. Add couscous, stir, cover, and remove from heat. Let stand for 5 minutes, then fluff with a fork.",
      "Dice cucumber, halve cherry tomatoes, and thinly slice red onion.",
      "In a small bowl, whisk together remaining olive oil, lemon juice, salt, and pepper to make the dressing.",
      "In a medium bowl, combine cucumber, tomatoes, red onion, and olives. Toss with half of the dressing.",
      "Assemble bowls: Start with couscous, add vegetable mixture, and top with baked salmon.",
      "Drizzle with remaining dressing, sprinkle with fresh parsley, and serve with lemon wedges.",
    ],
    nutritionInfo: {
      calories: 480,
      protein: 32,
      carbs: 38,
      fat: 22,
    },
  },
  {
    id: "recipe-5",
    title: "Beef and Broccoli Stir Fry",
    description: "A quick and flavorful Asian-inspired stir fry with tender beef and crisp broccoli.",
    image: "/images/beef-broccoli.jpg",
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    cuisineType: "Asian",
    dietaryRestrictions: ["dairy-free"],
    ingredients: [
      { id: "ing-1", name: "Flank steak", quantity: "1", unit: "lb", category: "Meat & Seafood" },
      { id: "ing-2", name: "Broccoli florets", quantity: "4", unit: "cups", category: "Produce" },
      { id: "ing-3", name: "Jasmine rice", quantity: "1", unit: "cup", category: "Pasta & Grains" },
      { id: "ing-4", name: "Garlic", quantity: "3", unit: "cloves", category: "Produce" },
      { id: "ing-5", name: "Ginger", quantity: "1", unit: "tbsp", category: "Produce" },
      { id: "ing-6", name: "Soy sauce", quantity: "1/4", unit: "cup", category: "Condiments" },
      { id: "ing-7", name: "Oyster sauce", quantity: "2", unit: "tbsp", category: "Condiments" },
      { id: "ing-8", name: "Brown sugar", quantity: "1", unit: "tbsp", category: "Baking" },
      { id: "ing-9", name: "Sesame oil", quantity: "1", unit: "tbsp", category: "Oils & Vinegars" },
      { id: "ing-10", name: "Cornstarch", quantity: "1", unit: "tbsp", category: "Baking" },
      { id: "ing-11", name: "Vegetable oil", quantity: "2", unit: "tbsp", category: "Oils & Vinegars" },
      { id: "ing-12", name: "Green onions", quantity: "3", unit: "", category: "Produce" },
      { id: "ing-13", name: "Sesame seeds", quantity: "1", unit: "tbsp", category: "Baking" },
    ],
    instructions: [
      "Cook rice according to package directions.",
      "Slice beef against the grain into thin strips. Place in a bowl and toss with 1 tablespoon cornstarch.",
      "In a small bowl, whisk together soy sauce, oyster sauce, brown sugar, and sesame oil.",
      "Heat 1 tablespoon vegetable oil in a large wok or skillet over high heat.",
      "Add beef in a single layer and cook for 2-3 minutes until browned. Remove from wok and set aside.",
      "Add remaining oil to the wok. Add garlic and ginger, stir for 30 seconds until fragrant.",
      "Add broccoli and stir fry for 4-5 minutes until bright green and crisp-tender.",
      "Return beef to the wok. Pour sauce over and stir to combine.",
      "Cook for 1-2 minutes until sauce thickens and everything is well coated.",
      "Serve over rice, garnished with sliced green onions and sesame seeds.",
    ],
    nutritionInfo: {
      calories: 420,
      protein: 28,
      carbs: 42,
      fat: 16,
    },
  },
  {
    id: "recipe-6",
    title: "Spinach and Mushroom Frittata",
    description: "A versatile and protein-packed egg dish perfect for breakfast, brunch, or dinner.",
    image: "/images/spinach-frittata.jpg",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Italian",
    dietaryRestrictions: ["vegetarian", "gluten-free"],
    ingredients: [
      { id: "ing-1", name: "Eggs", quantity: "8", unit: "large", category: "Dairy & Eggs" },
      { id: "ing-2", name: "Milk", quantity: "1/4", unit: "cup", category: "Dairy & Eggs" },
      { id: "ing-3", name: "Mushrooms", quantity: "8", unit: "oz", category: "Produce" },
      { id: "ing-4", name: "Fresh spinach", quantity: "4", unit: "cups", category: "Produce" },
      { id: "ing-5", name: "Onion", quantity: "1/2", unit: "medium", category: "Produce" },
      { id: "ing-6", name: "Garlic", quantity: "2", unit: "cloves", category: "Produce" },
      { id: "ing-7", name: "Feta cheese", quantity: "1/2", unit: "cup", category: "Dairy & Eggs" },
      { id: "ing-8", name: "Olive oil", quantity: "2", unit: "tbsp", category: "Oils & Vinegars" },
      { id: "ing-9", name: "Salt", quantity: "1/2", unit: "tsp", category: "Spices" },
      { id: "ing-10", name: "Black pepper", quantity: "1/4", unit: "tsp", category: "Spices" },
      { id: "ing-11", name: "Red pepper flakes", quantity: "1/4", unit: "tsp", category: "Spices" },
      { id: "ing-12", name: "Fresh herbs (parsley or dill)", quantity: "2", unit: "tbsp", category: "Produce" },
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "In a large bowl, whisk together eggs, milk, salt, and pepper. Set aside.",
      "Heat olive oil in a 10-inch oven-safe skillet over medium heat.",
      "Add diced onion and cook until softened, about 3 minutes.",
      "Add sliced mushrooms and cook until they release their moisture and begin to brown, about 5 minutes.",
      "Add minced garlic and red pepper flakes, cook for 30 seconds until fragrant.",
      "Add spinach and cook until wilted, about 2 minutes.",
      "Spread vegetables evenly in the skillet. Pour egg mixture over the vegetables.",
      "Sprinkle crumbled feta cheese on top.",
      "Cook on stovetop for 2 minutes until edges begin to set.",
      "Transfer skillet to oven and bake for 15-18 minutes until eggs are set and top is lightly golden.",
      "Let cool for 5 minutes, then sprinkle with fresh herbs, slice, and serve.",
    ],
    nutritionInfo: {
      calories: 280,
      protein: 19,
      carbs: 8,
      fat: 20,
    },
  },
  {
    id: "recipe-7",
    title: "Lentil and Sweet Potato Curry",
    description: "A hearty and warming plant-based curry packed with protein and flavor.",
    image: "/images/lentil-curry.jpg",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "medium",
    cuisineType: "Indian",
    dietaryRestrictions: ["vegan", "gluten-free", "dairy-free"],
    ingredients: [
      { id: "ing-1", name: "Red lentils", quantity: "1", unit: "cup", category: "Pasta & Grains" },
      { id: "ing-2", name: "Sweet potatoes", quantity: "2", unit: "medium", category: "Produce" },
      { id: "ing-3", name: "Onion", quantity: "1", unit: "large", category: "Produce" },
      { id: "ing-4", name: "Garlic", quantity: "3", unit: "cloves", category: "Produce" },
      { id: "ing-5", name: "Ginger", quantity: "1", unit: "tbsp", category: "Produce" },
      { id: "ing-6", name: "Coconut milk", quantity: "1", unit: "can (14 oz)", category: "Canned Goods" },
      { id: "ing-7", name: "Vegetable broth", quantity: "2", unit: "cups", category: "Canned Goods" },
      { id: "ing-8", name: "Curry powder", quantity: "2", unit: "tbsp", category: "Spices" },
      { id: "ing-9", name: "Turmeric", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-10", name: "Cumin", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-11", name: "Coriander", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-12", name: "Olive oil", quantity: "2", unit: "tbsp", category: "Oils & Vinegars" },
      { id: "ing-13", name: "Salt", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-14", name: "Spinach", quantity: "2", unit: "cups", category: "Produce" },
      { id: "ing-15", name: "Fresh cilantro", quantity: "1/4", unit: "cup", category: "Produce" },
      { id: "ing-16", name: "Lime", quantity: "1", unit: "", category: "Produce" },
    ],
    instructions: [
      "Rinse lentils until water runs clear. Set aside.",
      "Peel and dice sweet potatoes into 1-inch cubes.",
      "Heat olive oil in a large pot over medium heat. Add diced onion and cook until softened, about 5 minutes.",
      "Add minced garlic and ginger, cook for 1 minute until fragrant.",
      "Add curry powder, turmeric, cumin, and coriander. Stir for 30 seconds to toast spices.",
      "Add sweet potatoes, lentils, vegetable broth, and coconut milk. Stir to combine.",
      "Bring to a boil, then reduce heat to low. Simmer, partially covered, for 20-25 minutes until lentils and sweet potatoes are tender.",
      "Add spinach and stir until wilted, about 2 minutes.",
      "Season with salt to taste.",
      "Serve garnished with fresh cilantro and lime wedges.",
    ],
    nutritionInfo: {
      calories: 380,
      protein: 14,
      carbs: 52,
      fat: 16,
    },
  },
  {
    id: "recipe-8",
    title: "Grilled Chicken Caesar Salad",
    description: "A classic salad with grilled chicken, crisp romaine, and homemade Caesar dressing.",
    image: "/images/caesar-salad.jpg",
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    difficulty: "easy",
    cuisineType: "American",
    dietaryRestrictions: [],
    ingredients: [
      { id: "ing-1", name: "Chicken breast", quantity: "12", unit: "oz", category: "Meat & Seafood" },
      { id: "ing-2", name: "Romaine lettuce", quantity: "1", unit: "large head", category: "Produce" },
      { id: "ing-3", name: "Parmesan cheese", quantity: "1/2", unit: "cup", category: "Dairy & Eggs" },
      { id: "ing-4", name: "Croutons", quantity: "1", unit: "cup", category: "Bakery" },
      { id: "ing-5", name: "Garlic", quantity: "2", unit: "cloves", category: "Produce" },
      { id: "ing-6", name: "Dijon mustard", quantity: "1", unit: "tsp", category: "Condiments" },
      { id: "ing-7", name: "Anchovy paste", quantity: "1", unit: "tsp", category: "Condiments" },
      { id: "ing-8", name: "Lemon juice", quantity: "2", unit: "tbsp", category: "Produce" },
      { id: "ing-9", name: "Egg yolk", quantity: "1", unit: "large", category: "Dairy & Eggs" },
      { id: "ing-10", name: "Olive oil", quantity: "1/3", unit: "cup", category: "Oils & Vinegars" },
      { id: "ing-11", name: "Salt", quantity: "1/2", unit: "tsp", category: "Spices" },
      { id: "ing-12", name: "Black pepper", quantity: "1/4", unit: "tsp", category: "Spices" },
      { id: "ing-13", name: "Italian seasoning", quantity: "1", unit: "tsp", category: "Spices" },
    ],
    instructions: [
      "Season chicken breasts with salt, pepper, and Italian seasoning.",
      "Grill chicken for 6-7 minutes per side until internal temperature reaches 165°F (74°C). Let rest for 5 minutes, then slice.",
      "For the dressing, mince garlic and add to a bowl with anchovy paste, Dijon mustard, lemon juice, and egg yolk.",
      "Slowly whisk in olive oil until emulsified. Season with salt and pepper.",
      "Wash and dry romaine lettuce. Tear into bite-sized pieces and place in a large bowl.",
      "Add dressing to lettuce and toss to coat.",
      "Add grated Parmesan cheese and croutons, toss lightly.",
      "Top with sliced grilled chicken and additional Parmesan cheese.",
      "Serve immediately.",
    ],
    nutritionInfo: {
      calories: 520,
      protein: 42,
      carbs: 14,
      fat: 34,
    },
  },
  {
    id: "recipe-9",
    title: "Black Bean and Quinoa Enchilada Bake",
    description: "A protein-rich Mexican-inspired casserole that's perfect for meal prep.",
    image: "/images/enchilada-bake.jpg",
    prepTime: 20,
    cookTime: 30,
    servings: 6,
    difficulty: "medium",
    cuisineType: "Mexican",
    dietaryRestrictions: ["vegetarian", "gluten-free"],
    ingredients: [
      { id: "ing-1", name: "Quinoa", quantity: "1", unit: "cup", category: "Pasta & Grains" },
      { id: "ing-2", name: "Black beans", quantity: "2", unit: "cans (15 oz each)", category: "Canned Goods" },
      { id: "ing-3", name: "Corn", quantity: "1", unit: "cup", category: "Produce" },
      { id: "ing-4", name: "Red bell pepper", quantity: "1", unit: "large", category: "Produce" },
      { id: "ing-5", name: "Onion", quantity: "1", unit: "medium", category: "Produce" },
      { id: "ing-6", name: "Enchilada sauce", quantity: "2", unit: "cups", category: "Canned Goods" },
      { id: "ing-7", name: "Chili powder", quantity: "1", unit: "tbsp", category: "Spices" },
      { id: "ing-8", name: "Cumin", quantity: "2", unit: "tsp", category: "Spices" },
      { id: "ing-9", name: "Garlic powder", quantity: "1", unit: "tsp", category: "Spices" },
      { id: "ing-10", name: "Shredded Mexican cheese", quantity: "1.5", unit: "cups", category: "Dairy & Eggs" },
      { id: "ing-11", name: "Green onions", quantity: "4", unit: "", category: "Produce" },
      { id: "ing-12", name: "Cilantro", quantity: "1/4", unit: "cup", category: "Produce" },
      { id: "ing-13", name: "Avocado", quantity: "1", unit: "large", category: "Produce" },
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Cook quinoa according to package directions.",
      "In a large bowl, combine cooked quinoa, drained and rinsed black beans, corn, diced bell pepper, and diced onion.",
      "Add 1 cup of enchilada sauce, chili powder, cumin, and garlic powder. Stir to combine.",
      "Spread half of the remaining enchilada sauce in the bottom of a 9x13 inch baking dish.",
      "Add the quinoa mixture to the baking dish and spread evenly.",
      "Pour the remaining enchilada sauce over the top and sprinkle with shredded cheese.",
      "Cover with foil and bake for 20 minutes. Remove foil and bake for an additional 10 minutes until cheese is bubbly.",
      "Let cool for 5 minutes before serving.",
      "Garnish with sliced green onions, chopped cilantro, and diced avocado.",
    ],
    nutritionInfo: {
      calories: 340,
      protein: 15,
      carbs: 48,
      fat: 12,
    },
  },
  {
    id: "recipe-10",
    title: "Honey Garlic Glazed Salmon",
    description: "A quick and flavorful salmon dish with a sticky sweet and savory glaze.",
    image: "/images/glazed-salmon.jpg",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Asian",
    dietaryRestrictions: ["gluten-free", "dairy-free"],
    ingredients: [
      { id: "ing-1", name: "Salmon fillets", quantity: "4", unit: "(6 oz each)", category: "Meat & Seafood" },
      { id: "ing-2", name: "Honey", quantity: "1/4", unit: "cup", category: "Condiments" },
      { id: "ing-3", name: "Soy sauce", quantity: "3", unit: "tbsp", category: "Condiments" },
      { id: "ing-4", name: "Garlic", quantity: "4", unit: "cloves", category: "Produce" },
      { id: "ing-5", name: "Lemon", quantity: "1", unit: "", category: "Produce" },
      { id: "ing-6", name: "Olive oil", quantity: "1", unit: "tbsp", category: "Oils & Vinegars" },
      { id: "ing-7", name: "Red pepper flakes", quantity: "1/4", unit: "tsp", category: "Spices" },
      { id: "ing-8", name: "Salt", quantity: "1/2", unit: "tsp", category: "Spices" },
      { id: "ing-9", name: "Black pepper", quantity: "1/4", unit: "tsp", category: "Spices" },
      { id: "ing-10", name: "Green onions", quantity: "3", unit: "", category: "Produce" },
      { id: "ing-11", name: "Sesame seeds", quantity: "1", unit: "tbsp", category: "Baking" },
    ],
    instructions: [
      "Pat salmon fillets dry with paper towels. Season with salt and pepper.",
      "In a small bowl, whisk together honey, soy sauce, minced garlic, lemon juice, and red pepper flakes.",
      "Heat olive oil in a large skillet over medium-high heat.",
      "Add salmon fillets skin-side down and cook for 4 minutes until skin is crispy.",
      "Flip salmon and cook for 2 minutes on the other side.",
      "Pour honey garlic sauce over the salmon. Cook for 1-2 minutes until sauce thickens and salmon is cooked through.",
      "Spoon sauce over salmon as it cooks.",
      "Remove from heat and garnish with sliced green onions and sesame seeds.",
      "Serve immediately with extra sauce drizzled over the top.",
    ],
    nutritionInfo: {
      calories: 380,
      protein: 34,
      carbs: 18,
      fat: 19,
    },
  },
]

// Sample meal plan for initial app state
export const sampleMealPlans: MealPlan[] = [
  {
    id: "meal-plan-1",
    userId: "user-1",
    week: "2023-05-01", // First day of the week
    days: {
      Monday: {
        breakfast: { recipeId: "recipe-6", servings: 2 }, // Spinach and Mushroom Frittata
        lunch: { recipeId: "recipe-3", servings: 1 }, // Vegan Buddha Bowl
        dinner: { recipeId: "recipe-1", servings: 4 }, // Vegetarian Pasta Primavera
      },
      Tuesday: {
        breakfast: { recipeId: "recipe-6", servings: 2 }, // Leftover Frittata
        lunch: { recipeId: "recipe-1", servings: 1 }, // Leftover from Monday
        dinner: { recipeId: "recipe-4", servings: 2 }, // Mediterranean Salmon Bowl
      },
      Wednesday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-1", servings: 1 }, // Leftover from Monday
        dinner: { recipeId: "recipe-2", servings: 4 }, // Chicken Fajita Bowl
      },
      Thursday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-2", servings: 1 }, // Leftover from Wednesday
        dinner: { recipeId: "recipe-5", servings: 4 }, // Beef and Broccoli Stir Fry
      },
      Friday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-2", servings: 1 }, // Leftover from Wednesday
        dinner: { recipeId: "recipe-10", servings: 4 }, // Honey Garlic Glazed Salmon
      },
      Saturday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-8", servings: 2 }, // Grilled Chicken Caesar Salad
        dinner: { recipeId: "recipe-9", servings: 6 }, // Black Bean and Quinoa Enchilada Bake
      },
      Sunday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-9", servings: 2 }, // Leftover Enchilada Bake
        dinner: { recipeId: "recipe-7", servings: 4 }, // Lentil and Sweet Potato Curry
      },
    },
  },
  {
    id: "meal-plan-2",
    userId: "user-1",
    week: "2023-05-08", // Week after the first plan
    days: {
      Monday: {
        breakfast: { recipeId: "recipe-6", servings: 4 }, // Spinach and Mushroom Frittata
        lunch: { recipeId: "recipe-8", servings: 2 }, // Grilled Chicken Caesar Salad
        dinner: { recipeId: "recipe-5", servings: 4 }, // Beef and Broccoli Stir Fry
      },
      Tuesday: {
        breakfast: { recipeId: "recipe-6", servings: 2 }, // Leftover Frittata
        lunch: { recipeId: "recipe-5", servings: 1 }, // Leftover from Monday
        dinner: { recipeId: "recipe-10", servings: 4 }, // Honey Garlic Glazed Salmon
      },
      Wednesday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-5", servings: 1 }, // Leftover from Monday
        dinner: { recipeId: "recipe-9", servings: 6 }, // Black Bean and Quinoa Enchilada Bake
      },
      Thursday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-9", servings: 1 }, // Leftover from Wednesday
        dinner: { recipeId: "recipe-4", servings: 2 }, // Mediterranean Salmon Bowl
      },
      Friday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-9", servings: 1 }, // Leftover from Wednesday
        dinner: { recipeId: "recipe-2", servings: 4 }, // Chicken Fajita Bowl
      },
      Saturday: {
        breakfast: undefined,
        lunch: undefined,
        dinner: { recipeId: "recipe-1", servings: 4 }, // Vegetarian Pasta Primavera
      },
      Sunday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-1", servings: 2 }, // Leftover Pasta
        dinner: { recipeId: "recipe-7", servings: 4 }, // Lentil and Sweet Potato Curry
      },
    },
  },
  {
    id: "meal-plan-3",
    userId: "user-2", // Different user
    week: "2023-05-01",
    days: {
      Monday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-3", servings: 2 }, // Vegan Buddha Bowl
        dinner: { recipeId: "recipe-7", servings: 4 }, // Lentil and Sweet Potato Curry
      },
      Tuesday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-7", servings: 1 }, // Leftover Curry
        dinner: { recipeId: "recipe-3", servings: 2 }, // Vegan Buddha Bowl
      },
      Wednesday: {
        breakfast: { recipeId: "recipe-6", servings: 4 }, // Spinach and Mushroom Frittata
        lunch: { recipeId: "recipe-7", servings: 1 }, // Leftover Curry
        dinner: { recipeId: "recipe-9", servings: 6 }, // Black Bean and Quinoa Enchilada Bake
      },
      Thursday: {
        breakfast: { recipeId: "recipe-6", servings: 2 }, // Leftover Frittata
        lunch: { recipeId: "recipe-9", servings: 1 }, // Leftover Enchilada Bake
        dinner: { recipeId: "recipe-1", servings: 4 }, // Vegetarian Pasta Primavera
      },
      Friday: {
        breakfast: { recipeId: "recipe-6", servings: 2 }, // Leftover Frittata
        lunch: { recipeId: "recipe-9", servings: 1 }, // Leftover Enchilada Bake
        dinner: { recipeId: "recipe-1", servings: 2 }, // Leftover Pasta
      },
      Saturday: {
        breakfast: undefined,
        lunch: undefined,
        dinner: undefined,
      },
      Sunday: {
        breakfast: undefined,
        lunch: undefined,
        dinner: undefined,
      },
    },
  },
  {
    id: "meal-plan-4",
    userId: "user-1",
    week: "2023-05-15", // Two weeks after the first plan
    days: {
      Monday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-8", servings: 2 }, // Grilled Chicken Caesar Salad
        dinner: { recipeId: "recipe-2", servings: 4 }, // Chicken Fajita Bowl
      },
      Tuesday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-2", servings: 1 }, // Leftover Fajita Bowl
        dinner: { recipeId: "recipe-10", servings: 4 }, // Honey Garlic Glazed Salmon
      },
      Wednesday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-2", servings: 1 }, // Leftover Fajita Bowl
        dinner: { recipeId: "recipe-5", servings: 4 }, // Beef and Broccoli Stir Fry
      },
      Thursday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-5", servings: 1 }, // Leftover Stir Fry
        dinner: { recipeId: "recipe-4", servings: 2 }, // Mediterranean Salmon Bowl
      },
      Friday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-5", servings: 1 }, // Leftover Stir Fry
        dinner: { recipeId: "recipe-8", servings: 2 }, // Grilled Chicken Caesar Salad
      },
      Saturday: {
        breakfast: undefined,
        lunch: undefined,
        dinner: { recipeId: "recipe-1", servings: 4 }, // Vegetarian Pasta Primavera
      },
      Sunday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-1", servings: 2 }, // Leftover Pasta
        dinner: undefined,
      },
    },
  },
  {
    id: "meal-plan-5",
    userId: "user-2",
    week: "2023-05-08", // Second week for user-2
    days: {
      Monday: {
        breakfast: undefined,
        lunch: undefined,
        dinner: { recipeId: "recipe-4", servings: 2 }, // Mediterranean Salmon Bowl
      },
      Tuesday: {
        breakfast: undefined,
        lunch: undefined,
        dinner: { recipeId: "recipe-10", servings: 4 }, // Honey Garlic Glazed Salmon
      },
      Wednesday: {
        breakfast: undefined,
        lunch: undefined,
        dinner: { recipeId: "recipe-8", servings: 2 }, // Grilled Chicken Caesar Salad
      },
      Thursday: {
        breakfast: undefined,
        lunch: undefined,
        dinner: { recipeId: "recipe-2", servings: 4 }, // Chicken Fajita Bowl
      },
      Friday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-2", servings: 1 }, // Leftover Fajita Bowl
        dinner: { recipeId: "recipe-5", servings: 4 }, // Beef and Broccoli Stir Fry
      },
      Saturday: {
        breakfast: undefined,
        lunch: { recipeId: "recipe-5", servings: 1 }, // Leftover Stir Fry
        dinner: undefined,
      },
      Sunday: {
        breakfast: undefined,
        lunch: undefined,
        dinner: undefined,
      },
    },
  },
]

// Update the getUserMealPlan function to prevent infinite refreshing
export async function getUserMealPlan(userId: string, weekStart: string) {
  // Find a meal plan that matches the user ID and week start
  const matchingMealPlan = sampleMealPlans.find((plan) => plan.userId === userId && plan.week === weekStart)

  // If no exact match, return the first meal plan for the user
  if (!matchingMealPlan) {
    const userMealPlan = sampleMealPlans.find((plan) => plan.userId === userId)
    return userMealPlan || sampleMealPlans[0]
  }

  return matchingMealPlan
}

export async function generateShoppingList(userId: string, mealPlanId: string) {
  // Create sample shopping list items
  const sampleItems: ShoppingListItem[] = [
    {
      id: "item-1",
      name: "Penne pasta",
      quantity: "12",
      unit: "oz",
      category: "Pasta & Grains",
      checked: false,
      recipeIds: ["recipe-1"],
    },
    {
      id: "item-2",
      name: "Asparagus",
      quantity: "1",
      unit: "bunch",
      category: "Produce",
      checked: false,
      recipeIds: ["recipe-1"],
    },
    {
      id: "item-3",
      name: "Cherry tomatoes",
      quantity: "1",
      unit: "cup",
      category: "Produce",
      checked: false,
      recipeIds: ["recipe-1"],
    },
    {
      id: "item-4",
      name: "Bell peppers",
      quantity: "2",
      unit: "",
      category: "Produce",
      checked: false,
      recipeIds: ["recipe-1"],
    },
    {
      id: "item-5",
      name: "Zucchini",
      quantity: "1",
      unit: "medium",
      category: "Produce",
      checked: false,
      recipeIds: ["recipe-1"],
    },
  ]

  return {
    id: "shopping-list-1",
    userId: userId || "user-1",
    week: "2023-05-01",
    items: sampleItems,
  }
}

export async function addRecipeToShoppingList(userId: string, recipeId: string, servings: number) {
  // In a real app, this would add the recipe ingredients to the user's shopping list in the database
  // For now, we'll just return a success message
  console.log(`Added recipe ${recipeId} with ${servings} servings to shopping list for user ${userId}`)
  return Promise.resolve({
    success: true,
    message: "Recipe ingredients added to shopping list",
  })
}

export async function addMealToPlan(
  userId: string,
  weekStart: string,
  day: string,
  mealType: string,
  recipeId: string,
  servings: number,
) {
  console.log("addMealToPlan", userId, weekStart, day, mealType, recipeId, servings)
  return Promise.resolve()
}

export async function removeMealFromPlan(userId: string, weekStart: string, day: string, mealType: string) {
  console.log("removeMealFromPlan", userId, weekStart, day, mealType)
  return Promise.resolve()
}

export async function getRecipes(filters?: {
  query?: string
  cuisineType?: string
  dietaryRestrictions?: string[]
  maxTime?: number
}): Promise<Recipe[]> {
  let filteredRecipes = recipes

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

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  return recipes.find((recipe) => recipe.id === id)
}
