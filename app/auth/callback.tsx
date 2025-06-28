"use client"

import { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { ActivityIndicator, Title, Paragraph } from "react-native-paper"
import { useLocalSearchParams, router } from "expo-router"
import { supabase } from "../../lib/supabase"
import { theme } from "../../lib/theme"

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("🔄 Processing OAuth callback...")
        
        // Get the session from the URL parameters
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("❌ Error getting session:", error)
          router.replace("/login")
          return
        }

        if (data.session) {
          console.log("✅ OAuth callback successful, user authenticated")
          router.replace("/(tabs)")
        } else {
          console.log("❌ No session found after OAuth")
          router.replace("/login")
        }
      } catch (error) {
        console.error("❌ OAuth callback error:", error)
        router.replace("/login")
      }
    }

    handleAuthCallback()
  }, [params])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Title style={styles.title}>Completing Sign In...</Title>
      <Paragraph style={styles.subtitle}>
        Please wait while we complete your authentication.
      </Paragraph>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
  },
}) 