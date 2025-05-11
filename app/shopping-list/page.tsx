"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, ShoppingCart, Trash2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { isPreviewEnvironment, generateShoppingList, type ShoppingListItem } from "@/lib/data"

// Add this import at the top
import { useSearchParams } from "next/navigation"

export default function ShoppingListPage() {
  const { toast } = useToast()
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState("")
  const [newItemUnit, setNewItemUnit] = useState("")

  // Add this after the other useState declarations
  const searchParams = useSearchParams()
  const recipeId = searchParams.get("recipeId")
  const recipeServings = searchParams.get("servings")

  // Update the useEffect that loads the shopping list
  useEffect(() => {
    const loadShoppingList = async () => {
      try {
        // In a real app, this would fetch from an API
        const generatedList = await generateShoppingList("user-1", "meal-plan-1")

        // If we have a recipeId in the URL, it means we just added a recipe to the shopping list
        if (recipeId) {
          toast({
            title: "Recipe ingredients added",
            description: "The ingredients have been added to your shopping list.",
          })
        }

        // Initialize with some sample items if the list is empty
        if (!generatedList.items || generatedList.items.length === 0) {
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
        } else {
          setShoppingList(generatedList.items)
        }
      } catch (error) {
        console.error("Error loading shopping list:", error)
        // Provide fallback data
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
      }
    }

    loadShoppingList()
  }, [toast, recipeId, recipeServings])

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
  const addItem = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newItemName.trim()) {
      toast({
        title: "Item name required",
        description: "Please enter a name for the item.",
        variant: "destructive",
      })
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

    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your shopping list.`,
    })
  }

  // Toggle item checked state
  const toggleItemChecked = (id: string) => {
    setShoppingList(shoppingList.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  // Remove item from list
  const removeItem = (id: string) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id))

    toast({
      title: "Item removed",
      description: "Item has been removed from your shopping list.",
    })
  }

  // Clear all checked items
  const clearCheckedItems = () => {
    setShoppingList(shoppingList.filter((item) => !item.checked))

    toast({
      title: "Checked items cleared",
      description: "All checked items have been removed from your list.",
    })
  }

  // Send to Instacart
  const sendToInstacart = () => {
    toast({
      title: "Sending to Instacart",
      description: "Your shopping list is being transferred to Instacart.",
    })

    // Simulate API call delay
    setTimeout(() => {
      toast({
        title: "List sent to Instacart",
        description: "Your shopping list has been added to your Instacart cart.",
      })
    }, 1500)
  }

  // Share list
  const shareList = () => {
    navigator.clipboard.writeText(
      "ChefItUp Shopping List:\n\n" +
        Object.entries(groupedItems)
          .map(
            ([category, items]) =>
              `${category}:\n${items.map((item) => `- ${item.quantity} ${item.unit} ${item.name}`).join("\n")}`,
          )
          .join("\n\n"),
    )

    toast({
      title: "List copied to clipboard",
      description: "Your shopping list has been copied and is ready to share.",
    })
  }

  // Calculate progress
  const checkedCount = shoppingList.filter((item) => item.checked).length
  const progress = shoppingList.length > 0 ? Math.round((checkedCount / shoppingList.length) * 100) : 0

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Shopping List</h1>
          <p className="text-muted-foreground mt-1">Based on your meal plan for the week</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={shareList}>
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>

          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700" onClick={sendToInstacart}>
            <ShoppingCart className="h-4 w-4" />
            <span>Send to Instacart</span>
          </Button>
        </div>
      </div>

      {isPreviewEnvironment() && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <p className="text-amber-800">
            <strong>Preview Mode:</strong> Using sample shopping list data. Connect to Supabase for real data.
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            {checkedCount} of {shoppingList.length} items checked
          </span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-medium mb-4">Add Item</h2>
        <form onSubmit={addItem} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="item-name" className="sr-only">
              Item Name
            </Label>
            <Input
              id="item-name"
              placeholder="Item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-24">
            <Label htmlFor="item-quantity" className="sr-only">
              Quantity
            </Label>
            <Input
              id="item-quantity"
              placeholder="Qty"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-24">
            <Label htmlFor="item-unit" className="sr-only">
              Unit
            </Label>
            <Input
              id="item-unit"
              placeholder="Unit"
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
            />
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Add
          </Button>
        </form>
      </div>

      {/* Shopping List */}
      <div className="space-y-6">
        {Object.entries(groupedItems).length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your shopping list is empty</h2>
            <p className="text-muted-foreground mb-6">Add items manually or generate a list from your meal plan</p>
          </div>
        ) : (
          <>
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-lg font-medium mb-2">{category}</h2>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        item.checked ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => toggleItemChecked(item.id)}
                        />
                        <Label
                          htmlFor={item.id}
                          className={`font-medium ${item.checked ? "line-through text-muted-foreground" : ""}`}
                        >
                          {item.quantity} {item.unit} {item.name}
                        </Label>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={clearCheckedItems}
                disabled={checkedCount === 0}
              >
                <Check className="h-4 w-4" />
                <span>Clear Checked Items</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
