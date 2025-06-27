"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert } from "react-native"
import { Title, Button, Card, Paragraph, Checkbox, TextInput, FAB, List, Divider } from "react-native-paper"
import { theme } from "../../lib/theme"

interface ShoppingListItem {
  id: string
  name: string
  quantity: string
  unit: string
  category: string
  checked: boolean
}

export default function ShoppingListScreen() {
  const [items, setItems] = useState<ShoppingListItem[]>([
    {
      id: "1",
      name: "Penne pasta",
      quantity: "12",
      unit: "oz",
      category: "Pasta & Grains",
      checked: false,
    },
    {
      id: "2",
      name: "Asparagus",
      quantity: "1",
      unit: "bunch",
      category: "Produce",
      checked: false,
    },
    {
      id: "3",
      name: "Cherry tomatoes",
      quantity: "1",
      unit: "cup",
      category: "Produce",
      checked: false,
    },
    {
      id: "4",
      name: "Bell peppers",
      quantity: "2",
      unit: "",
      category: "Produce",
      checked: true,
    },
  ])

  const [newItemName, setNewItemName] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  // Group items by category
  const groupedItems = items.reduce(
    (groups, item) => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
      return groups
    },
    {} as Record<string, ShoppingListItem[]>,
  )

  const toggleItemChecked = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const removeItem = (id: string) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setItems((prev) => prev.filter((item) => item.id !== id))
        },
      },
    ])
  }

  const addItem = () => {
    if (!newItemName.trim()) {
      Alert.alert("Error", "Please enter an item name")
      return
    }

    const newItem: ShoppingListItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: newItemQuantity || "1",
      unit: "",
      category: "Other",
      checked: false,
    }

    setItems((prev) => [...prev, newItem])
    setNewItemName("")
    setNewItemQuantity("")
    setShowAddForm(false)
  }

  const clearCheckedItems = () => {
    const checkedCount = items.filter((item) => item.checked).length
    if (checkedCount === 0) {
      Alert.alert("Info", "No checked items to clear")
      return
    }

    Alert.alert("Clear Checked Items", `Remove ${checkedCount} checked items?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        onPress: () => {
          setItems((prev) => prev.filter((item) => !item.checked))
        },
      },
    ])
  }

  const sendToInstacart = () => {
    Alert.alert("Send to Instacart", "This will open Instacart with your shopping list.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send",
        onPress: () => {
          Alert.alert("Success", "Shopping list sent to Instacart!")
        },
      },
    ])
  }

  const checkedCount = items.filter((item) => item.checked).length
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0

  return (
    <View style={styles.container}>
      <Card style={styles.progressCard}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <Title>Shopping Progress</Title>
            <Paragraph>
              {checkedCount} of {items.length} items
            </Paragraph>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressActions}>
            <Button mode="outlined" onPress={clearCheckedItems} disabled={checkedCount === 0} icon="check">
              Clear Checked
            </Button>
            <Button mode="contained" onPress={sendToInstacart} icon="cart" style={styles.instacartButton}>
              Send to Instacart
            </Button>
          </View>
        </Card.Content>
      </Card>

      {showAddForm && (
        <Card style={styles.addForm}>
          <Card.Content>
            <Title>Add Item</Title>
            <TextInput label="Item name" value={newItemName} onChangeText={setNewItemName} style={styles.input} />
            <TextInput
              label="Quantity"
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
              style={styles.input}
            />
            <View style={styles.addFormActions}>
              <Button onPress={() => setShowAddForm(false)}>Cancel</Button>
              <Button mode="contained" onPress={addItem}>
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
  progressCard: {
    margin: 16,
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  instacartButton: {
    backgroundColor: theme.colors.primary,
  },
  addForm: {
    margin: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  addFormActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  categoryCard: {
    margin: 16,
    marginBottom: 8,
  },
  categoryTitle: {
    color: theme.colors.primary,
    marginBottom: 8,
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
