import { Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { theme } from "../../lib/theme"
import { IconButton, Menu, Divider, TouchableRipple } from "react-native-paper"
import { useState } from "react"
import { router } from "expo-router"
import { Text, View } from "react-native"

export default function TabLayout() {
  const [menuVisible, setMenuVisible] = useState(false)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  const menuItems = [
    {
      title: "Browse Recipes",
      onPress: () => {
        closeMenu()
        router.push("/(tabs)")
      }
    },
    {
      title: "Generate Recipe",
      onPress: () => {
        closeMenu()
        router.push("/generate-recipe")
      }
    },
    {
      title: "Diabetes Resources",
      onPress: () => {
        closeMenu()
        // Could link to diabetes education content
        router.push("/landing")
      }
    },
    {
      title: "Settings",
      onPress: () => {
        closeMenu()
        // Could link to settings page
        router.push("/(tabs)/profile")
      }
    },
    {
      title: "Help & Support",
      onPress: () => {
        closeMenu()
        // Could link to help page
        router.push("/landing")
      }
    }
  ]

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitle: () => (
          <TouchableRipple onPress={() => router.push("/landing")}>
            <Text style={{ 
              color: "white", 
              fontSize: 20, 
              fontWeight: "bold"
            }}>
              Home
            </Text>
          </TouchableRipple>
        ),
        headerRight: () => (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="menu"
                iconColor="white"
                size={24}
                onPress={openMenu}
              />
            }
          >
            {menuItems.map((item, index) => (
              <Menu.Item
                key={index}
                onPress={item.onPress}
                title={item.title}
              />
            ))}
            <Divider />
            <Menu.Item
              onPress={() => {
                closeMenu()
                // Could add logout functionality here
                router.push("/landing")
              }}
              title="Logout"
            />
          </Menu>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ChefItUp",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="restaurant" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meal-planner"
        options={{
          title: "Meal Planner",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="calendar-today" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shopping-list"
        options={{
          title: "Shopping List",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="local-grocery-store" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="account-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
