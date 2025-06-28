"use client"

import { useState } from "react"
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native"
import { Title, TextInput, Button, Card, Paragraph, Divider } from "react-native-paper"
import { router } from "expo-router"
import { useAuth } from "../lib/auth/AuthContext"
import { theme } from "../lib/theme"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
      Alert.alert("Success", "Logged in successfully!")
      router.replace("/(tabs)")
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      router.replace("/(tabs)")
    } catch (error: any) {
      Alert.alert("Google Sign In Failed", error.message)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>Log in</Title>
            <Paragraph style={styles.subtitle}>Enter your credentials to access your account</Paragraph>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>

            <Divider style={styles.divider} />

            <Button
              mode="outlined"
              onPress={handleGoogleSignIn}
              style={styles.googleButton}
              icon="google"
            >
              Continue with Google
            </Button>

            <View style={styles.forgotPassword}>
              <Button mode="text" onPress={() => Alert.alert("Info", "Forgot password feature would be implemented here")}>
                Forgot password?
              </Button>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.signupPrompt}>
          <Paragraph style={styles.signupText}>
            Don't have an account?{" "}
            <Button mode="text" onPress={() => router.push("/signup")} textColor={theme.colors.primary}>
              Sign up
            </Button>
          </Paragraph>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    color: "gray",
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: theme.colors.primary,
  },
  divider: {
    marginVertical: 24,
  },
  googleButton: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignItems: "center",
  },
  signupPrompt: {
    alignItems: "center",
  },
  signupText: {
    textAlign: "center",
  },
}) 