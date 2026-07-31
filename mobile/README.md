# SQB Mobile App

Mobile version of the SQB medical quiz platform, built with **Expo SDK 55** and **React Native**.

## Tech Stack

- **Expo SDK 55** with Expo Router (file-based routing)
- **React Native 0.83** + TypeScript (strict)
- **expo-secure-store** for session token storage
- **AsyncStorage** for user data and offline queue
- **Axios** for API communication

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout (AuthProvider, StatusBar)
│   ├── index.tsx           # Landing page
│   ├── login.tsx           # Login screen
│   ├── signup.tsx          # Signup screen
│   ├── quiz.tsx            # Quiz engine
│   ├── suggestions.tsx     # Suggestions form
│   ├── terms.tsx           # Terms of Use
│   ├── about.tsx           # About screen
│   ├── faq.tsx             # FAQ accordion
│   └── (tabs)/             # Tab navigator (protected)
│       ├── _layout.tsx     # Tab bar config
│       ├── quizs.tsx       # Quiz setup
│       ├── analysis.tsx    # Performance analytics
│       ├── wrong-questions.tsx  # Wrong questions review
│       └── contact.tsx     # Contact & support
├── src/
│   ├── components/ui/      # Reusable UI components
│   │   ├── Button.tsx      # 4 variants, 3 sizes, loading state
│   │   ├── Input.tsx       # Labels, errors, password toggle
│   │   ├── Card.tsx        # Dark themed card
│   │   ├── AlertBox.tsx    # Info/success/warning/error alerts
│   │   ├── LoadingScreen.tsx
│   │   ├── BottomSheet.tsx # Modal picker sheet
│   │   └── Badge.tsx       # Pill badge
│   ├── constants/
│   │   ├── theme.ts        # Colors, spacing, typography tokens
│   │   └── config.ts       # API URL, app name, session timeout
│   ├── contexts/
│   │   └── AuthContext.tsx  # Auth state management
│   └── utils/
│       ├── apiClient.ts    # Axios instance with auth interceptor
│       ├── storage.ts      # SecureStore + AsyncStorage helpers
│       ├── protectedApi.ts # Authenticated API calls with 401 redirect
│       └── errorTracking.ts # Error reporting with offline queue
├── assets/                 # App icons and splash screen
├── app.json                # Expo configuration
├── eas.json                # EAS Build profiles
├── tsconfig.json           # TypeScript config
└── package.json
```

## Prerequisites

- **Node.js** >= 18
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`
- **Expo account** logged in: `npx eas login`

## Getting Started

```bash
# Install dependencies
cd mobile
npm install

# Start development server
npx expo start

# Run on Android emulator
npx expo start --android

# Run on iOS simulator (macOS only)
npx expo start --ios
```

## Building

### Development Build (APK for testing)

```bash
npx eas build --profile development --platform android
```

### Preview Build (APK for internal distribution)

```bash
npx eas build --profile preview --platform android
```

### Production Build (AAB for Play Store)

```bash
npx eas build --profile production --platform android
```

## EAS Project Setup

If the project hasn't been linked to Expo yet:

```bash
npx eas init
```

This will populate the `projectId` in `app.json`.

## API

The app communicates with the backend at `https://medquiz.vercel.app`. Key endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/login` | Authenticate user |
| POST | `/api/register` | Create account |
| GET | `/api/questions` | Fetch quiz questions |
| POST | `/api/quiz-sessions` | Save quiz result |
| POST | `/api/question-attempts` | Save individual answers |
| POST | `/api/topic-analysis` | Update topic analytics |
| GET | `/api/analysis/*` | Fetch performance data |
| GET | `/api/wrong-questions` | Get wrong questions |
| POST | `/api/suggestions` | Submit user suggestions |

## Configuration

Edit `src/constants/config.ts` to change:
- `API_URL` — Backend server URL
- `SESSION_TIMEOUT_MINUTES` — Auto-logout timeout (default: 30)

Edit `src/constants/theme.ts` to customize colors, spacing, and typography.

## App Identity

- **Package**: `com.m_alshraky3.sqb`
- **Bundle ID**: `com.m_alshraky3.sqb`
- **Expo Slug**: `sqb`
- **Expo Owner**: `m_alshraky3`
