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

## Expo account and build info

_Merged in from the former `docs/EXPO_ACCOUNT_AND_BUILD_INFO.txt` (2026-09-20). The local path is `working projects\SQB\mobile`; the API it calls is `https://medquiz.vercel.app` and that URL must not change (it is compiled into installed apps)._

```
================================================================================
  EXPO ACCOUNT & EAS BUILD REFERENCE — SQB APP
================================================================================

EXPO ACCOUNT
------------
  Username   : m_alshraky3
  Account URL: https://expo.dev/accounts/m_alshraky3

PROJECT IDENTITY
----------------
  App Name        : SQB
  Slug            : sqb
  Owner           : m_alshraky3
  EAS Project ID  : e3168990-1c46-401f-b7ce-3f27354981b2
  Android Package : com.m_alshraky3.sqb
  iOS Bundle ID   : com.m_alshraky3.sqb
  Version         : 1.0.0
  Expo SDK        : ~55.0.8
  React Native    : 0.83.2

LOCAL PROJECT PATH
------------------
  C:\Users\muhmo\Desktop\CODE\working projects\SQB\mobile\

================================================================================
  HOW TO LOG IN (run once per machine)
================================================================================

  npx eas-cli login
  # Enter username: m_alshraky3
  # Enter your Expo account password when prompted

  -- OR using the old expo CLI --
  npx expo login -u m_alshraky3

  Verify login:
  npx eas whoami

================================================================================
  EAS BUILD PROFILES  (defined in mobile/eas.json)
================================================================================

  PROFILE       | PLATFORM | OUTPUT TYPE | DISTRIBUTION
  --------------|----------|-------------|-------------
  development   | Android  | APK         | internal (download link)
  preview       | Android  | APK         | internal (download link)
  production    | Android  | AAB         | Google Play store

================================================================================
  BUILD COMMANDS  (run from inside the mobile/ folder)
================================================================================

  cd C:\Users\muhmo\Desktop\CODE\working projects\SQB\mobile

  -- Build a downloadable APK (preview profile, recommended for testing) --
  npx eas build --platform android --profile preview

  -- Build a development APK (includes dev client) --
  npx eas build --platform android --profile development

  -- Build a production AAB (for Google Play) --
  npx eas build --platform android --profile production

  -- Build locally on this machine instead of EAS cloud --
  npx eas build --platform android --profile preview --local

  After a cloud build finishes, EAS prints a download URL.
  You can also view/download all builds at:
  https://expo.dev/accounts/m_alshraky3/projects/sqb/builds

================================================================================
  INSTALL EAS CLI (if not installed)
================================================================================

  npm install -g eas-cli
  # then verify:
  eas --version   # should be >= 5.0.0

================================================================================
  BACKEND (API used by the app)
================================================================================

  Production URL : https://medquiz.vercel.app
  Stack          : Express + PostgreSQL, session-based auth

================================================================================
  KEY CONFIG FILES
================================================================================

  mobile/app.json        — Expo config (name, slug, package IDs, EAS project ID)
  mobile/eas.json        — Build profiles (development / preview / production)
  mobile/package.json    — Dependencies & scripts
  mobile/src/constants/config.ts  — API base URL and app constants
  mobile/src/contexts/AuthContext.tsx — Auth logic

================================================================================
```
