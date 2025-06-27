"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert } from "react-native"
import { Title, Button, Card, List, Switch, Divider, Avatar, Paragraph } from "react-native-paper"
import { useAuth } from "../../lib/auth/AuthContext"
import { router } from "expo-router"
import { theme } from "../../lib/theme"

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut()
            router.replace("/auth/login")
          } catch (error) {
            Alert.alert("Error", "Failed to sign out")
          }
        },
      },
    ])
  }

  const navigateToSettings = () => {
    Alert.alert("Info", "Settings screen would be implemented here")
  }

  const navigateToPreferences = () => {
    Alert.alert("Info", "Dietary preferences screen would be implemented here")
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Card style={styles.loginPrompt}>
          <Card.Content style={styles.loginPromptContent}>
            <Title>Not Signed In</Title>
            <Paragraph style={styles.loginPromptText}>
              Please sign in to view your profile and access personalized features.
            </Paragraph>
            <Button mode="contained" onPress={() => router.push("/auth/login")} style={styles.loginButton}>
              Sign In
            </Button>
          </Card.Content>
        </Card>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
            style={styles.avatar}
          />
          <Title style={styles.userName}>{user.user_metadata?.full_name || "User"}</Title>
          <Paragraph style={styles.userEmail}>{user.email}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.menuCard}>
        <Card.Content>
          <List.Item
            title="Dietary Preferences"
            description="Manage your dietary restrictions and preferences"
            left={() => <List.Icon icon="food-apple" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={navigateToPreferences}
          />
          <Divider />
          <List.Item
            title="Favorite Recipes"
            description="View your saved and favorite recipes"
            left={() => <List.Icon icon="heart" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => Alert.alert("Info", "Favorites screen would be implemented here")}
          />
          <Divider />
          <List.Item
            title="Meal History"
            description="View your past meal plans and recipes"
            left={() => <List.Icon icon="history" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => Alert.alert("Info", "Meal history screen would be implemented here")}
          />
        </Card.Content>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Settings</Title>
          <List.Item
            title="Push Notifications"
            description="Receive notifications about meal planning"
            left={() => <List.Icon icon="bell" />}
            right={() => <Switch value={notifications} onValueChange={setNotifications} />}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            description="Switch to dark theme"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
          />
          <Divider />
          <List.Item
            title="App Settings"
            description="General app preferences and settings"
            left={() => <List.Icon icon="cog" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={navigateToSettings}
          />
        </Card.Content>
      </Card>

      <Card style={styles.supportCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Support</Title>
          <List.Item
            title="Help & FAQ"
            description="Get help and find answers to common questions"
            left={() => <List.Icon icon="help-circle" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => Alert.alert("Info", "Help screen would be implemented here")}
          />
          <Divider />
          <List.Item
            title="Contact Support"
            description="Get in touch with our support team"
            left={() => <List.Icon icon="email" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => Alert.alert("Info", "Contact support would be implemented here")}
          />
          <Divider />
          <List.Item
            title="Rate the App"
            description="Rate ChefItUp on the App Store"
            left={() => <List.Icon icon="star" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => Alert.alert("Info", "App rating would be implemented here")}
          />
        </Card.Content>
      </Card>

      <Card style={styles.signOutCard}>
        <Card.Content>
          <Button mode="outlined" onPress={handleSignOut} style={styles.signOutButton} textColor="red">
            Sign Out
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Paragraph style={styles.version}>ChefItUp v1.0.0</Paragraph>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loginPrompt: {
    margin: 16,
  },
  loginPromptContent: {
    alignItems: "center",
    padding: 24,
  },
  loginPromptText: {
    textAlign: "center",
    marginVertical: 16,
    color: "gray",
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
  },
  profileCard: {
    margin: 16,
    marginBottom: 8,
  },
  profileContent: {
    alignItems: "center",
    padding: 24,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    color: "gray",
    fontSize: 16,
  },
  menuCard: {
    margin: 16,
    marginBottom: 8,
  },
  settingsCard: {
    margin: 16,
    marginBottom: 8,
  },
  supportCard: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: theme.colors.primary,
  },
  signOutCard: {
    margin: 16,
    marginBottom: 8,
  },
  signOutButton: {
    borderColor: "red",
  },
  footer: {
    alignItems: "center",
    padding: 24,
  },
  version: {
    color: "gray",
    fontSize: 12,
  },
})
