"use client"

import { useState, useEffect } from "react"
import { View, ScrollView, StyleSheet, Image, Alert } from "react-native"
import { Title, Paragraph, Button, Chip, ActivityIndicator, Card, List, Divider } from "react-native-paper"
import { useLocalSearchParams, router } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { getRecipeById, type Recipe } from "../../lib/data/recipes"
import { theme } from "../../lib/theme"

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [servings, setServings] = useState(4)

  useEffect(() => {
    if (id) {
      loadRecipe(id)
    }
  }, [id])

  const loadRecipe = async (recipeId: string) => {
    try {
      const fetchedRecipe = await getRecipeById(recipeId)
      if (fetchedRecipe) {
        setRecipe(fetchedRecipe)
        setServings(fetchedRecipe.servings)
      } else {
        Alert.alert("Error", "Recipe not found")
        router.back()
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load recipe")
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const addToMealPlan = () => {
    Alert.alert("Add to Meal Plan", "This recipe will be added to your meal plan.", [
      { text: "Cancel", style: "cancel" },
      { text: "Add", onPress: () => router.push("/meal-planner") },
    ])
  }

  const addToShoppingList = () => {
    Alert.alert("Add to Shopping List", "Ingredients will be added to your shopping list.", [
      { text: "Cancel", style: "cancel" },
      { text: "Add", onPress: () => router.push("/shopping-list") },
    ])
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Paragraph>Recipe not found</Paragraph>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />

      <View style={styles.content}>
        <Title style={styles.title}>{recipe.title}</Title>
        <Paragraph style={styles.description}>{recipe.description}</Paragraph>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <MaterialIcons name="access-time" size={20} color={theme.colors.primary} />
            <Paragraph style={styles.metaText}>{recipe.prepTime + recipe.cookTime} min</Paragraph>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="people" size={20} color={theme.colors.primary} />
            <Paragraph style={styles.metaText}>{servings} servings</Paragraph>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="restaurant" size={20} color={theme.colors.primary} />
            <Paragraph style={styles.metaText}>{recipe.difficulty}</Paragraph>
          </View>
        </View>

        <View style={styles.chips}>
          {recipe.dietaryRestrictions.map((restriction) => (
            <Chip key={restriction} style={styles.chip}>
              {restriction}
            </Chip>
          ))}
          <Chip style={styles.chip}>{recipe.cuisineType}</Chip>
        </View>

        <View style={styles.actions}>
          <Button mode="contained" onPress={addToMealPlan} style={styles.actionButton} icon="calendar-plus">
            Add to Meal Plan
          </Button>
          <Button mode="outlined" onPress={addToShoppingList} style={styles.actionButton} icon="cart-plus">
            Add to Shopping List
          </Button>
        </View>

        <Card style={styles.section}>
          <Card.Content>
            <Title>Ingredients</Title>
            {recipe.ingredients.map((ingredient, index) => (
              <List.Item
                key={ingredient.id}
                title={`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                left={() => (
                  <View style={styles.ingredientNumber}>
                    <Paragraph style={styles.ingredientNumberText}>{index + 1}</Paragraph>
                  </View>
                )}
              />
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Title>Instructions</Title>
            {recipe.instructions.map((instruction, index) => (
              <View key={index}>
                <List.Item
                  title={instruction}
                  left={() => (
                    <View style={styles.stepNumber}>
                      <Paragraph style={styles.stepNumberText}>{index + 1}</Paragraph>
                    </View>
                  )}
                />
                {index < recipe.instructions.length - 1 && <Divider />}
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Title>Nutrition Information</Title>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Paragraph style={styles.nutritionValue}>{recipe.nutritionInfo.calories}</Paragraph>
                <Paragraph style={styles.nutritionLabel}>Calories</Paragraph>
              </View>
              <View style={styles.nutritionItem}>
                <Paragraph style={styles.nutritionValue}>{recipe.nutritionInfo.protein}g</Paragraph>
                <Paragraph style={styles.nutritionLabel}>Protein</Paragraph>
              </View>
              <View style={styles.nutritionItem}>
                <Paragraph style={styles.nutritionValue}>{recipe.nutritionInfo.carbs}g</Paragraph>
                <Paragraph style={styles.nutritionLabel}>Carbs</Paragraph>
              </View>
              <View style={styles.nutritionItem}>
                <Paragraph style={styles.nutritionValue}>{recipe.nutritionInfo.fat}g</Paragraph>
                <Paragraph style={styles.nutritionLabel}>Fat</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "gray",
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  metaItem: {
    alignItems: "center",
  },
  metaText: {
    marginTop: 4,
    fontSize: 12,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  section: {
    marginBottom: 16,
  },
  ingredientNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  ingredientNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  nutritionGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  nutritionLabel: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
})
