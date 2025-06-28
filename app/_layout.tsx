import { Stack } from "expo-router"
import { PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { AuthProvider } from "../lib/auth/AuthContext"
import { theme } from "../lib/theme"

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="recipe/[id]" options={{ title: "Recipe Details" }} />
            <Stack.Screen name="generate-recipe" options={{ title: "Generate Recipe" }} />
          </Stack>
          <StatusBar style="light" />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  )
}
