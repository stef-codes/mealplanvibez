"use client"

import { useState, useEffect } from "react"
import { View, ScrollView, StyleSheet, Alert } from "react-native"
import { Title, TextInput, Button, Card, Paragraph, ActivityIndicator, Chip, IconButton } from "react-native-paper"
import { router } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { theme } from "../lib/theme"
import * as Speech from 'expo-speech'
import { Audio } from 'expo-av'
import { generateRecipe as generateRecipeAction, GeneratedRecipe as OpenAIGeneratedRecipe } from "../lib/actions/generate-recipe"

type GeneratedRecipe = OpenAIGeneratedRecipe

export default function GenerateRecipeScreen() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [error, setError] = useState<string | null>(null)

  const examplePrompts = [
    "A quick vegetarian pasta dish with seasonal vegetables",
    "Healthy chicken recipe under 30 minutes",
    "Vegan dessert with chocolate and berries",
    "Mediterranean fish dish with herbs",
  ]

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync()
      }
    }
  }, [recording])

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Required", "Microphone permission is required for voice input.");
        return;
      }

      setIsListening(true);
      setTranscribedText("");

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);

      setTimeout(() => {
        stopRecording();
      }, 5000);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert("Error", "Failed to start voice recording");
      setIsListening(false);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsListening(false);
      await recording.stopAndUnloadAsync();

      const mockTranscription = "A healthy vegetarian pasta dish with seasonal vegetables and low glycemic index";
      setTranscribedText(mockTranscription);
      setPrompt(mockTranscription);
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert("Error", "Failed to process voice input");
    } finally {
      setRecording(null);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert("Error", "Please enter a recipe description")
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedRecipe(null)
    try {
      const { recipe, error: apiError } = await generateRecipeAction(prompt)
      if (apiError) {
        setError(apiError)
        setGeneratedRecipe(null)
      } else if (recipe) {
        setGeneratedRecipe(recipe)
      } else {
        setError("No recipe generated. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate recipe. Please try again.")
      setGeneratedRecipe(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSpeechInput = () => {
    if (isListening) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const clearVoiceInput = () => {
    setTranscribedText("")
    setPrompt("")
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

          <View style={styles.voiceInputContainer}>
            <View style={styles.voiceInputHeader}>
              <Title style={styles.voiceInputTitle}>Voice Input</Title>
              {transcribedText && (
                <IconButton
                  icon="close"
                  size={20}
                  onPress={clearVoiceInput}
                  style={styles.clearButton}
                />
              )}
            </View>
            
            {transcribedText && (
              <Card style={styles.transcriptionCard}>
                <Card.Content>
                  <Paragraph style={styles.transcriptionText}>
                    "{transcribedText}"
                  </Paragraph>
                </Card.Content>
              </Card>
            )}

            <View style={styles.voiceButtonContainer}>
              <Button
                mode={isListening ? "contained" : "outlined"}
                onPress={handleSpeechInput}
                icon={isListening ? "stop" : "microphone"}
                style={[
                  styles.voiceButton,
                  isListening && styles.voiceButtonListening
                ]}
                textColor={isListening ? "white" : theme.colors.primary}
              >
                {isListening ? "Stop Recording" : "Start Voice Input"}
              </Button>
              
              {isListening && (
                <View style={styles.recordingIndicator}>
                  <ActivityIndicator size="small" color="red" />
                  <Paragraph style={styles.recordingText}>Listening...</Paragraph>
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputActions}>
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

      {error && (
        <Card style={styles.loadingCard}>
          <Card.Content>
            <Paragraph style={{ color: 'red', textAlign: 'center' }}>{error}</Paragraph>
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
                  • {ingredient.quantity} {ingredient.unit} {ingredient.name}
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
    backgroundColor: "white",
    marginBottom: 16,
  },
  voiceInputContainer: {
    marginBottom: 16,
  },
  voiceInputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  voiceInputTitle: {
    fontSize: 18,
  },
  clearButton: {
    margin: 0,
  },
  transcriptionCard: {
    backgroundColor: theme.colors.primaryContainer,
    marginBottom: 12,
  },
  transcriptionText: {
    fontStyle: "italic",
    color: theme.colors.primary,
  },
  voiceButtonContainer: {
    alignItems: "center",
  },
  voiceButton: {
    marginBottom: 8,
  },
  voiceButtonListening: {
    backgroundColor: "red",
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recordingText: {
    color: "red",
    fontWeight: "bold",
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
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
    gap: 8,
  },
  exampleChip: {
    marginBottom: 8,
  },
  loadingCard: {
    margin: 16,
    marginBottom: 8,
  },
  loadingContent: {
    alignItems: "center",
    padding: 32,
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
    paddingVertical: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  recipeMetaItem: {
    alignItems: "center",
  },
  recipeMetaText: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  listItem: {
    marginBottom: 8,
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    marginTop: 16,
  },
})
