"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert } from "react-native"
import { Title, TextInput, Button, Card, Paragraph, ActivityIndicator, Chip } from "react-native-paper"
import { router } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { theme } from "../lib/theme"

interface GeneratedRecipe {
  title: string
  description: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: string
  ingredients: string[]
  instructions: string[]
}

export default function GenerateRecipeScreen() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null)
  const [isListening, setIsListening] = useState(false)

  const examplePrompts = [
    "A quick vegetarian pasta dish with seasonal vegetables",
    "Healthy chicken recipe under 30 minutes",
    "Vegan dessert with chocolate and berries",
    "Mediterranean fish dish with herbs",
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert("Error", "Please enter a recipe description")
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock generated recipe
      const mockRecipe: GeneratedRecipe = {
        title: "AI-Generated Recipe",
        description: `A delicious recipe based on: ${prompt}`,
        prepTime: 15,
        cookTime: 25,
        servings: 4,
        difficulty: "medium",
        ingredients: [
          "2 cups main ingredient",
          "1 cup supporting ingredient",
          "2 tbsp seasoning",
          "1 tsp spices",
          "Salt and pepper to taste",
        ],
        instructions: [
          "Prepare all ingredients according to the recipe requirements.",
          "Heat oil in a large pan over medium heat.",
          "Add main ingredients and cook until tender.",
          "Season with spices and herbs.",
          "Serve hot and enjoy!",
        ],
      }

      setGeneratedRecipe(mockRecipe)
    } catch (error) {
      Alert.alert("Error", "Failed to generate recipe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSpeechInput = () => {
    Alert.alert("Voice Input", "Voice input feature would be implemented here using expo-speech or similar library.", [
      { text: "OK" },
    ])
  }

  const saveRecipe = () => {
    if (!generatedRecipe) return

    Alert.alert("Recipe Saved", "Your generated recipe has been saved to your collection!", [
      { text: "OK", onPress: () => router.back() },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.inputCard}>
        <Card.Content>
          <Title>Describe Your Recipe</Title>
          <Paragraph style={styles.subtitle}>Tell us what kind of recipe you want to create</Paragraph>

          <TextInput
            label="Recipe description"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="e.g., A healthy vegetarian pasta dish with seasonal vegetables"
          />

          <View style={styles.inputActions}>
            <Button mode="outlined" onPress={handleSpeechInput} icon="microphone" style={styles.speechButton}>
              Voice Input
            </Button>
            <Button
              mode="contained"
              onPress={handleGenerate}
              loading={loading}
              disabled={loading || !prompt.trim()}
              style={styles.generateButton}
            >
              Generate Recipe
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.examplesCard}>
        <Card.Content>
          <Title>Example Prompts</Title>
          <View style={styles.exampleChips}>
            {examplePrompts.map((example, index) => (
              <Chip key={index} onPress={() => setPrompt(example)} style={styles.exampleChip}>
                {example}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      {loading && (
        <Card style={styles.loadingCard}>
          <Card.Content style={styles.loadingContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Paragraph style={styles.loadingText}>Generating your custom recipe...</Paragraph>
          </Card.Content>
        </Card>
      )}

      {generatedRecipe && (
        <Card style={styles.recipeCard}>
          <Card.Content>
            <Title>{generatedRecipe.title}</Title>
            <Paragraph style={styles.recipeDescription}>{generatedRecipe.description}</Paragraph>

            <View style={styles.recipeMetaContainer}>
              <View style={styles.recipeMetaItem}>
                <MaterialIcons name="access-time" size={16} color={theme.colors.primary} />
                <Paragraph style={styles.recipeMetaText}>
                  {generatedRecipe.prepTime + generatedRecipe.cookTime} min
                </Paragraph>
              </View>
              <View style={styles.recipeMetaItem}>
                <MaterialIcons name="people" size={16} color={theme.colors.primary} />
                <Paragraph style={styles.recipeMetaText}>{generatedRecipe.servings} servings</Paragraph>
              </View>
              <View style={styles.recipeMetaItem}>
                <MaterialIcons name="restaurant" size={16} color={theme.colors.primary} />
                <Paragraph style={styles.recipeMetaText}>{generatedRecipe.difficulty}</Paragraph>
              </View>
            </View>

            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Ingredients</Title>
              {generatedRecipe.ingredients.map((ingredient, index) => (
                <Paragraph key={index} style={styles.listItem}>
                  • {ingredient}
                </Paragraph>
              ))}
            </View>

            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Instructions</Title>
              {generatedRecipe.instructions.map((instruction, index) => (
                <Paragraph key={index} style={styles.listItem}>
                  {index + 1}. {instruction}
                </Paragraph>
              ))}
            </View>

            <Button mode="contained" onPress={saveRecipe} style={styles.saveButton} icon="content-save">
              Save Recipe
            </Button>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  inputCard: {
    margin: 16,
    marginBottom: 8,
  },
  subtitle: {
    color: "gray",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  speechButton: {
    flex: 1,
  },
  generateButton: {
    flex: 2,
    backgroundColor: theme.colors.primary,
  },
  examplesCard: {
    margin: 16,
    marginBottom: 8,
  },
  exampleChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  exampleChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  loadingCard: {
    margin: 16,
    marginBottom: 8,
  },
  loadingContent: {
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    textAlign: "center",
  },
  recipeCard: {
    margin: 16,
    marginBottom: 8,
  },
  recipeDescription: {
    color: "gray",
    marginBottom: 16,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  recipeMetaItem: {
    alignItems: "center",
  },
  recipeMetaText: {
    marginTop: 4,
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: theme.colors.primary,
  },
  listItem: {
    marginBottom: 8,
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
})
