export default {
  expo: {
    name: "ChefItUp",
    slug: "chefitup-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.chefitup.mobile"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.chefitup.mobile"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    scheme: "chefitup",
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "your-project-id-here"
      },
      // Add your Supabase credentials here
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "your-supabase-url",
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-anon-key"
    }
  }
} 