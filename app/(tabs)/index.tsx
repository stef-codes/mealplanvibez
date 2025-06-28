"use client"

import { useState, useEffect } from "react"
import { View, ScrollView, StyleSheet, RefreshControl, Alert } from "react-native"
import { Searchbar, Card, Title, Paragraph, Button, Chip, ActivityIndicator, FAB } from "react-native-paper"
import { router } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { getRecipes, type Recipe } from "../../lib/data/recipes"
import { theme } from "../../lib/theme"

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const loadRecipes = async (query?: string) => {
    try {
      setLoading(true)
      const fetchedRecipes = await getRecipes({ query })
      setRecipes(fetchedRecipes)
    } catch (error) {
      Alert.alert("Error", "Failed to load recipes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  const handleSearch = () => {
    loadRecipes(searchQuery)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadRecipes(searchQuery)
    setRefreshing(false)
  }

  const navigateToRecipe = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`)
  }

  const navigateToGenerate = () => {
    router.push("/generate-recipe")
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search recipes..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchbar}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {recipes.map((recipe) => (
          <Card key={recipe.id} style={styles.card} onPress={() => navigateToRecipe(recipe.id)}>
            <Card.Cover source={{ uri: recipe.image }} />
            <Card.Content>
              <Title>{recipe.title}</Title>
              <Paragraph numberOfLines={2}>{recipe.description}</Paragraph>

              <View style={styles.metaInfo}>
                <View style={styles.timeInfo}>
                  <MaterialIcons name="access-time" size={16} color="gray" />
                  <Paragraph style={styles.timeText}>{recipe.prepTime + recipe.cookTime} min</Paragraph>
                </View>
                <View style={styles.servingsInfo}>
                  <MaterialIcons name="people" size={16} color="gray" />
                  <Paragraph style={styles.servingsText}>{recipe.servings} servings</Paragraph>
                </View>
                <View style={styles.giInfo}>
                  <MaterialIcons name="monitor-heart" size={16} color="gray" />
                  <Paragraph style={styles.giText}>GI: {recipe.nutritionInfo.glycemicIndex}</Paragraph>
                </View>
              </View>

              <View style={styles.chips}>
                {recipe.dietaryRestrictions.map((restriction) => (
                  <Chip key={restriction} style={styles.chip} compact>
                    {restriction}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB icon="magic-staff" label="Generate Recipe" style={styles.fab} onPress={navigateToGenerate} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchbar: {
    margin: 16,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 8,
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  timeText: {
    marginLeft: 4,
    fontSize: 12,
  },
  servingsInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  servingsText: {
    marginLeft: 4,
    fontSize: 12,
  },
  giInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  giText: {
    marginLeft: 4,
    fontSize: 12,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
})
