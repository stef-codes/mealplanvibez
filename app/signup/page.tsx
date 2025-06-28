"use client"

import { useState } from "react"
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native"
import { Title, TextInput, Button, Card, Paragraph, Divider } from "react-native-paper"
import { router } from "expo-router"
import { useAuth } from "../../lib/auth/AuthContext"
import { theme } from "../../lib/theme"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters")
      return
    }

    setLoading(true)
    try {
      await signUp(name, email, password)
      Alert.alert("Success", "Account created successfully!")
      router.push("/onboarding")
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "There was a problem creating your account")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      router.push("/onboarding")
    } catch (error: any) {
      Alert.alert("Google Sign In Failed", error.message)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>Create an account</Title>
            <Paragraph style={styles.subtitle}>Enter your information to create a ChefItUp account</Paragraph>

            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
            />

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

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleSignup}
              loading={loading}
              disabled={loading}
              style={styles.signupButton}
            >
              {loading ? "Creating account..." : "Create Account"}
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
          </Card.Content>
        </Card>

        <View style={styles.loginPrompt}>
          <Paragraph style={styles.loginText}>
            Already have an account?{" "}
            <Button mode="text" onPress={() => router.push("/login")} textColor={theme.colors.primary}>
              Log in
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
  signupButton: {
    marginTop: 8,
    backgroundColor: theme.colors.primary,
  },
  divider: {
    marginVertical: 24,
  },
  googleButton: {
    marginBottom: 16,
  },
  loginPrompt: {
    alignItems: "center",
  },
  loginText: {
    textAlign: "center",
  },
})
