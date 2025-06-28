# ChefItUp Mobile App

A React Native Expo app for meal planning, recipe discovery, and grocery shopping integration.

## Features

- 🍳 Recipe discovery and search
- 📅 Weekly meal planning
- 🛒 Shopping list generation
- 🤖 AI-powered recipe generation
- 👤 User profiles and preferences
- 🔐 Authentication with Supabase
- 📱 Cross-platform (iOS & Android)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI
- EAS CLI (for building and deployment)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
   \`\`\`
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

   **To get your Supabase credentials:**
   1. Go to [supabase.com](https://supabase.com) and create a new project
   2. Once your project is created, go to Settings > API
   3. Copy the "Project URL" and "anon public" key
   4. Paste them in your `.env` file

   **Enable Google OAuth (optional):**
   1. In your Supabase dashboard, go to Authentication > Providers
   2. Enable Google provider
   3. Add your Google OAuth credentials (Client ID and Client Secret)
   4. Set the redirect URL to: `chefitup://auth/callback`

4. Start the development server:
   \`\`\`bash
   npx expo start
   \`\`\`

### Building for Production

#### Android

1. Build the APK/AAB:
   \`\`\`bash
   eas build --platform android
   \`\`\`

2. Submit to Google Play Store:
   \`\`\`bash
   eas submit --platform android
   \`\`\`

#### iOS

1. Build the IPA:
   \`\`\`bash
   eas build --platform ios
   \`\`\`

2. Submit to App Store:
   \`\`\`bash
   eas submit --platform ios
   \`\`\`

## Project Structure

\`\`\`
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication screens
│   └── _layout.tsx        # Root layout
├── lib/                   # Utilities and services
│   ├── auth/              # Authentication context
│   ├── data/              # Data models and API calls
│   └── theme.ts           # App theme configuration
├── assets/                # Images and static assets
└── app.json              # Expo configuration
\`\`\`

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build service
- **React Native Paper**: Material Design components
- **Supabase**: Backend as a Service (authentication, database)
- **Expo Router**: File-based navigation
- **TypeScript**: Type safety and better development experience

## Deployment

### Google Play Store

1. Create a Google Play Console account
2. Generate a service account key for automated uploads
3. Configure `eas.json` with your service account details
4. Build and submit using EAS CLI

### Apple App Store

1. Create an Apple Developer account
2. Set up App Store Connect
3. Configure `eas.json` with your Apple ID and team details
4. Build and submit using EAS CLI

## Environment Variables

The app requires the following environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## License

This project is licensed under the MIT License.
