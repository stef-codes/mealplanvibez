"use client"

import { useState, useEffect } from "react"
import { View, ScrollView, StyleSheet, Alert } from "react-native"
import { Title, TextInput, Button, Card, Paragraph, Divider, Checkbox, FAB, List } from "react-native-paper"
import { router } from "expo-router"
import { theme } from "../../lib/theme"

interface ShoppingListItem {
  id: string
  name: string
  quantity: string
  unit: string
  category: string
  checked: boolean
  recipeIds: string[]
}

export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState("")
  const [newItemUnit, setNewItemUnit] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Initialize with sample items
    setShoppingList([
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
    ])
  }, [])

  // Group items by category
  const groupedItems = shoppingList.reduce(
    (groups, item) => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
      return groups
    },
    {} as Record<string, ShoppingListItem[]>,
  )

  // Add new item to list
  const addItem = () => {
    if (!newItemName.trim()) {
      Alert.alert("Error", "Please enter a name for the item.")
      return
    }

    const newItem: ShoppingListItem = {
      id: `manual-${Date.now()}`,
      name: newItemName.trim(),
      quantity: newItemQuantity || "1",
      unit: newItemUnit || "",
      category: "Other",
      checked: false,
      recipeIds: [],
    }

    setShoppingList([...shoppingList, newItem])
    setNewItemName("")
    setNewItemQuantity("")
    setNewItemUnit("")
    setShowAddForm(false)

    Alert.alert("Success", `${newItem.name} has been added to your shopping list.`)
  }

  // Toggle item checked state
  const toggleItemChecked = (id: string) => {
    setShoppingList(shoppingList.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  // Remove item from list
  const removeItem = (id: string) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id))
    Alert.alert("Success", "Item has been removed from your shopping list.")
  }

  // Clear all checked items
  const clearCheckedItems = () => {
    setShoppingList(shoppingList.filter((item) => !item.checked))
    Alert.alert("Success", "All checked items have been removed from your list.")
  }

  // Send to Instacart
  const sendToInstacart = async () => {
    Alert.alert("Info", "This would send your shopping list to Instacart in a real app.")
  }

  // Share list
  const shareList = () => {
    Alert.alert("Info", "This would share your shopping list in a real app.")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Shopping List</Title>
        <View style={styles.headerButtons}>
          <Button mode="outlined" onPress={clearCheckedItems} style={styles.headerButton}>
            Clear Checked
          </Button>
          <Button mode="outlined" onPress={sendToInstacart} style={styles.headerButton}>
            Send to Instacart
          </Button>
          <Button mode="outlined" onPress={shareList} style={styles.headerButton}>
            Share
          </Button>
        </View>
      </View>

      {showAddForm && (
        <Card style={styles.addFormCard}>
          <Card.Content>
            <Title style={styles.addFormTitle}>Add New Item</Title>
            <TextInput
              label="Item Name"
              value={newItemName}
              onChangeText={setNewItemName}
              mode="outlined"
              style={styles.input}
            />
            <View style={styles.quantityRow}>
              <TextInput
                label="Quantity"
                value={newItemQuantity}
                onChangeText={setNewItemQuantity}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.quantityInput]}
              />
              <TextInput
                label="Unit"
                value={newItemUnit}
                onChangeText={setNewItemUnit}
                mode="outlined"
                style={[styles.input, styles.unitInput]}
              />
            </View>
            <View style={styles.addFormButtons}>
              <Button mode="outlined" onPress={() => setShowAddForm(false)} style={styles.addFormButton}>
                Cancel
              </Button>
              <Button mode="contained" onPress={addItem} style={styles.addFormButton}>
                Add Item
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      <ScrollView style={styles.scrollView}>
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <Card key={category} style={styles.categoryCard}>
            <Card.Content>
              <Title style={styles.categoryTitle}>{category}</Title>
              {categoryItems.map((item, index) => (
                <View key={item.id}>
                  <List.Item
                    title={`${item.quantity} ${item.unit} ${item.name}`.trim()}
                    titleStyle={[styles.itemTitle, item.checked && styles.checkedItem]}
                    left={() => (
                      <Checkbox
                        status={item.checked ? "checked" : "unchecked"}
                        onPress={() => toggleItemChecked(item.id)}
                      />
                    )}
                    right={() => (
                      <Button mode="text" onPress={() => removeItem(item.id)} icon="delete" compact>
                        Remove
                      </Button>
                    )}
                  />
                  {index < categoryItems.length - 1 && <Divider />}
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB icon="plus" style={styles.fab} onPress={() => setShowAddForm(true)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  headerButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  addFormCard: {
    margin: 16,
    marginBottom: 8,
  },
  addFormTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  quantityRow: {
    flexDirection: "row",
    gap: 8,
  },
  quantityInput: {
    flex: 1,
  },
  unitInput: {
    flex: 1,
  },
  addFormButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  addFormButton: {
    minWidth: 100,
  },
  scrollView: {
    flex: 1,
  },
  categoryCard: {
    margin: 16,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: theme.colors.primary,
  },
  itemTitle: {
    fontSize: 16,
  },
  checkedItem: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
})
