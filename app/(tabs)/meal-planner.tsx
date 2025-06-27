"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert } from "react-native"
import { Title, Button, Card, Paragraph, FAB } from "react-native-paper"
import { format, startOfWeek, addDays } from "date-fns"
import { theme } from "../../lib/theme"

interface MealPlan {
  [key: string]: {
    breakfast?: { recipeId: string; recipeName: string; servings: number }
    lunch?: { recipeId: string; recipeName: string; servings: number }
    dinner?: { recipeId: string; recipeName: string; servings: number }
  }
}

export default function MealPlannerScreen() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()))
  const [mealPlan, setMealPlan] = useState<MealPlan>({})
  const [loading, setLoading] = useState(false)

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeek, i)
    return {
      date,
      dayName: format(date, "EEEE"),
      dayShort: format(date, "EEE"),
      dayOfMonth: format(date, "d"),
    }
  })

  const mealTypes = ["breakfast", "lunch", "dinner"]

  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7))
  }

  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7))
  }

  const addMealToPlan = (day: string, mealType: string) => {
    Alert.alert("Add Meal", `Add a meal for ${day} ${mealType}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Add Recipe",
        onPress: () => {
          // Navigate to recipe selection
          Alert.alert("Info", "Recipe selection will be implemented")
        },
      },
    ])
  }

  const removeMeal = (day: string, mealType: string) => {
    Alert.alert("Remove Meal", `Remove ${mealType} for ${day}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setMealPlan((prev) => ({
            ...prev,
            [day]: {
              ...prev[day],
              [mealType]: undefined,
            },
          }))
        },
      },
    ])
  }

  const generateShoppingList = () => {
    Alert.alert("Generate Shopping List", "Create a shopping list from your meal plan?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Generate",
        onPress: () => {
          Alert.alert("Success", "Shopping list generated!")
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.weekNavigation}>
          <Button onPress={goToPreviousWeek} icon="chevron-left">
            Previous
          </Button>
          <Title style={styles.weekTitle}>
            {format(currentWeek, "MMM d")} - {format(addDays(currentWeek, 6), "MMM d, yyyy")}
          </Title>
          <Button onPress={goToNextWeek} icon="chevron-right">
            Next
          </Button>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {mealTypes.map((mealType) => (
          <Card key={mealType} style={styles.mealTypeCard}>
            <Card.Content>
              <Title style={styles.mealTypeTitle}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Title>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.daysContainer}>
                  {daysOfWeek.map((day) => {
                    const meal = mealPlan[day.dayName]?.[mealType]

                    return (
                      <Card key={`${day.dayName}-${mealType}`} style={styles.dayCard}>
                        <Card.Content style={styles.dayCardContent}>
                          <View style={styles.dayHeader}>
                            <Paragraph style={styles.dayName}>{day.dayShort}</Paragraph>
                            <Paragraph style={styles.dayNumber}>{day.dayOfMonth}</Paragraph>
                          </View>

                          {meal ? (
                            <View style={styles.mealContent}>
                              <Paragraph style={styles.recipeName} numberOfLines={2}>
                                {meal.recipeName}
                              </Paragraph>
                              <Paragraph style={styles.servings}>{meal.servings} servings</Paragraph>
                              <Button
                                mode="text"
                                onPress={() => removeMeal(day.dayName, mealType)}
                                style={styles.removeButton}
                              >
                                Remove
                              </Button>
                            </View>
                          ) : (
                            <View style={styles.emptyMeal}>
                              <Button
                                mode="outlined"
                                onPress={() => addMealToPlan(day.dayName, mealType)}
                                style={styles.addButton}
                                icon="plus"
                              >
                                Add
                              </Button>
                            </View>
                          )}
                        </Card.Content>
                      </Card>
                    )
                  })}
                </View>
              </ScrollView>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB icon="cart" label="Generate Shopping List" style={styles.fab} onPress={generateShoppingList} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    elevation: 2,
  },
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weekTitle: {
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  mealTypeCard: {
    margin: 16,
    marginBottom: 8,
  },
  mealTypeTitle: {
    marginBottom: 16,
    color: theme.colors.primary,
  },
  daysContainer: {
    flexDirection: "row",
  },
  dayCard: {
    width: 150,
    marginRight: 12,
    minHeight: 120,
  },
  dayCardContent: {
    padding: 12,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dayName: {
    fontWeight: "bold",
  },
  dayNumber: {
    color: "gray",
  },
  mealContent: {
    flex: 1,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  servings: {
    fontSize: 12,
    color: "gray",
    marginBottom: 8,
  },
  removeButton: {
    alignSelf: "flex-start",
  },
  emptyMeal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    borderStyle: "dashed",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
})
