# Metics Mobile

React Native mobile application for Metics.

## Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd metics-mobile
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Configure Firebase (Android)
Copy the example file and replace with your Firebase configuration:
```bash
cp android/app/google-services.json.example android/app/google-services.json
```
Then update `google-services.json` with your actual Firebase credentials from the [Firebase Console](https://console.firebase.google.com/).

### 4. Configure Release Keystore (for release builds)
Generate your own release keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.jks -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 5. iOS Dependencies (macOS only)
```bash
cd ios
pod install
cd ..
```

### 6. Ruby Dependencies (optional, for Fastlane)
```bash
bundle install
```

## Running the App

### Start Metro Bundler
```bash
npm start
```

### Android
```bash
npm run android
```

### iOS (macOS only)
```bash
npm run ios
```

## Development

### Linting
```bash
npm run lint
```

## Project Structure

```
├── App.tsx              # Main application entry
├── src/
│   ├── api/            # API integration
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── screens/        # App screens
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── android/            # Android native code
├── ios/                # iOS native code
└── assets/             # Images and static assets
```

## Environment Variables

Create a `.env` file in the root directory with required environment variables. See `.env.example` for reference (if available).

## Important Notes

- **Do not commit** sensitive files like `google-services.json` or keystores
- The `.gitignore` is configured to exclude these files automatically
- Each developer must configure their own Firebase credentials locally
