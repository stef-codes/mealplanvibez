const { getDefaultConfig } = require("expo/metro-config")
const path = require("path")

const config = getDefaultConfig(path.resolve(process.cwd()))

// Add support for Expo Router
config.resolver.platforms = ["ios", "android", "native", "web"]

// Add web support
config.resolver.alias = {
  "react-native$": "react-native-web",
}

// Add web-specific configuration
config.resolver.sourceExts = [...config.resolver.sourceExts, "web.js", "web.ts", "web.tsx"]

// Add fallbacks for Node.js modules in web
config.resolver.fallback = {
  ...config.resolver.fallback,
  "path": false,
  "fs": false,
  "crypto": false,
  "stream": false,
  "util": false,
  "buffer": false,
  "process": false,
}

module.exports = config
