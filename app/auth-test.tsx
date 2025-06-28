"use client"

import { useState } from "react"
import { View, StyleSheet, Alert } from "react-native"
import { Title, TextInput, Button, Card, Paragraph } from "react-native-paper"
import { useAuth } from "../lib/auth/AuthContext"
import { supabase } from "../lib/supabase"

export default function AuthTestScreen() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [name, setName] = useState("Test User")
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, signOut, user, session } = useAuth()

  const testSupabaseConnection = async () => {
    try {
      console.log("🔍 Testing Supabase connection...")
      const { data, error } = await supabase.from('_dummy_table').select('*').limit(1)
      if (error) {
        console.log("❌ Supabase connection test failed:", error.message)
        Alert.alert("Connection Test", `Failed: ${error.message}`)
      } else {
        console.log("✅ Supabase connection successful")
        Alert.alert("Connection Test", "Success! Supabase is connected.")
      }
    } catch (error) {
      console.error("❌ Connection test error:", error)
      Alert.alert("Connection Test", `Error: ${error}`)
    }
  }

  const testGoogleOAuth = async () => {
    try {
      console.log("🔍 Testing Google OAuth configuration...")
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "chefitup://auth/callback",
        },
      })
      
      if (error) {
        console.log("❌ Google OAuth test failed:", error.message)
        if (error.message.includes("provider is not enabled")) {
          Alert.alert(
            "Google OAuth Not Configured", 
            "To enable Google OAuth:\n\n1. Go to Supabase Dashboard\n2. Authentication > Providers\n3. Enable Google provider\n4. Add Google OAuth credentials\n5. Set redirect URL to: chefitup://auth/callback"
          )
        } else {
          Alert.alert("Google OAuth Test", `Failed: ${error.message}`)
        }
      } else {
        console.log("✅ Google OAuth configured successfully")
        Alert.alert("Google OAuth Test", "Success! Google OAuth is properly configured.")
      }
    } catch (error) {
      console.error("❌ Google OAuth test error:", error)
      Alert.alert("Google OAuth Test", `Error: ${error}`)
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    try {
      await signUp(name, email, password)
      Alert.alert("Success", "Account created successfully!")
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await signIn(email, password)
      Alert.alert("Success", "Logged in successfully!")
    } catch (error: any) {
      Alert.alert("Login Failed", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      Alert.alert("Success", "Logged out successfully!")
    } catch (error: any) {
      Alert.alert("Logout Failed", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Authentication Test</Title>
          
          <Paragraph style={styles.status}>
            User: {user ? user.email : "Not logged in"}
          </Paragraph>
          <Paragraph style={styles.status}>
            Session: {session ? "Active" : "None"}
          </Paragraph>

          <Button 
            mode="outlined" 
            onPress={testSupabaseConnection}
            style={styles.button}
          >
            Test Supabase Connection
          </Button>

          <Button 
            mode="outlined" 
            onPress={testGoogleOAuth}
            style={styles.button}
          >
            Test Google OAuth
          </Button>

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

          <Button
            mode="contained"
            onPress={handleSignUp}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Test Sign Up
          </Button>

          <Button
            mode="contained"
            onPress={handleSignIn}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Test Sign In
          </Button>

          <Button
            mode="outlined"
            onPress={handleSignOut}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Test Sign Out
          </Button>
        </Card.Content>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginTop: 50,
  },
  status: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
}) 