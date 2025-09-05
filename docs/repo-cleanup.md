# Repository Cleanup Documentation

## What was removed

During the repository cleanup process, the following files and artifacts were removed from version control:

### Build Artifacts Removed
- `android/app/src/main/assets/index.android.bundle` - React Native JavaScript bundle built for Android
- Any other JavaScript bundles that may have been committed accidentally

### Files and Patterns Now Ignored
The `.gitignore` file has been updated to comprehensively ignore typical transient files and build artifacts for React Native projects:

- **Platform-specific files:**
  - `.DS_Store` (macOS)
  - `Thumbs.db` (Windows)
  - Various other system files

- **Build artifacts:**
  - `node_modules/` - npm/yarn dependencies
  - `ios/Pods/` - CocoaPods dependencies
  - `android/app/build/` - Android build outputs
  - `android/.gradle/` - Gradle cache
  - `build/`, `dist/`, `tmp/` - General build directories
  - `coverage/` - Test coverage reports
  - `*.apk`, `*.aab`, `*.ipa` - Mobile app packages

- **Development environment files:**
  - `.idea/` - IntelliJ/Android Studio settings
  - `.vscode/` - VS Code settings
  - `.history/` - Local history files
  - Various IDE temp files

- **Log files:**
  - `*.log` - All log files
  - npm/yarn debug logs

## Important Files Preserved

The following files that might seem like they should be ignored have been intentionally preserved:

- `android/app/debug.keystore` - Debug signing keystore for Android development
- `android/app/google-services.json` - Firebase/Google Services configuration
- `.bundle/config` - Bundler configuration for Ruby dependencies
- `my-release-key.jks` - Release keystore (if needed for releases)

## How to Reinstall Dependencies

After cloning this repository or switching branches, you'll need to reinstall dependencies:

### Node.js Dependencies
```bash
npm install
# or if using yarn
yarn install
```

### iOS Dependencies (macOS only)
```bash
cd ios
pod install
cd ..
```

### Ruby Dependencies (for Fastlane, etc.)
```bash
bundle install
```

## Building the Project

### Android
```bash
npx react-native run-android
```

### iOS (macOS only)
```bash
npx react-native run-ios
```

## Running Tests
```bash
npm test
# or
yarn test
```

## Linting
```bash
npm run lint
# or
yarn lint
```

## Notes

- The `.gitignore` file is now comprehensive and should catch most build artifacts and development files automatically
- If you need to track a specific file that's being ignored, you can force-add it with `git add -f <filename>`
- Environment files (`.env`) are ignored by default - copy `.env.example` if it exists, or create your own `.env` with the required environment variables
- This cleanup helps reduce repository size and prevents accidental commits of build artifacts or sensitive information