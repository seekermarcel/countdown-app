# Countdown App

A modern, minimalist countdown tracker built with React Native and Expo. Keep track of important dates and events with a beautiful dark-themed interface.

## Features

- 📅 Create and manage multiple countdowns
- 🌗 Dark mode interface for comfortable viewing
- ⏰ Real-time countdown updates showing days until target date
- 📝 Edit existing countdowns
- 🗑️ Delete individual countdowns or clear all at once
- 🔄 Sort countdowns by:
  - Days remaining (ascending)
  - Alphabetically (A-Z)
- 💾 Persistent storage - your countdowns are saved locally
- 📱 Modern, responsive UI with smooth animations

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher - required by React Native)
- [npm](https://www.npmjs.com/) (latest version recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/countdown-app.git
cd countdown-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Running the App

1. Start the development server:
```bash
npm start
# or
yarn start
```

2. Run on your preferred platform:
- Press `a` for Android
- Press `i` for iOS (requires macOS)
- Scan the QR code with the Expo Go app on your mobile device

## Building for Android

### Option 1: Local Build (Recommended)

1. Install Android Studio and set up the Android SDK
2. Set the ANDROID_HOME environment variable to your Android SDK location:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
```

3. Create a development build configuration:
```bash
npx expo prebuild
```

4. Navigate to the Android project directory:
```bash
cd android
```

5. Build the APK using Gradle:
```bash
# For debug APK:
./gradlew assembleDebug

# For release APK (requires signing configuration):
./gradlew assembleRelease
```

The APK files will be generated in:
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release.apk`

### Option 2: Using Docker

1. Build and run the Docker container:
```bash
# Build the Docker image
docker build -t expo-android-builder .

# Run the container and build the APK
docker run -v $(pwd):/app expo-android-builder /bin/bash -c "\
    npm install && \
    npx expo prebuild && \
    cd android && \
    ./gradlew assembleDebug" # notice debug APK just like in local build
```

The APK will be available in the same location as the local build.

Note: Make sure you have configured your app.json with the correct Android package name and version before building.

## Tech Stack

- React Native
- TypeScript
- Expo Router
- AsyncStorage for data persistence
- date-fns for date calculations
- Expo Vector Icons

## Project Structure

```
countdown-app/
├── app/                  # Main application screens
│   ├── index.tsx        # Home screen
│   ├── add.tsx          # Add/Edit countdown screen
│   └── _layout.tsx      # Navigation layout
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── dateUtils.ts     # Date manipulation functions
│   └── storage.ts       # AsyncStorage functions
└── assets/             # Images and icons
```

## Contributing

Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/) 