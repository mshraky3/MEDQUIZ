# Google Sign-In in the Android app

**State:** the code is finished and shipped, but the button is **hidden** until the owner does the
three steps below. Nothing else in the app depends on it (email + password works without it).

## Why it needs the owner

The website signs in with Google Identity Services using one **web** OAuth client. A native Android
app cannot reuse that client by itself: Google only issues tokens to an Android app that has its own
**Android** OAuth client registered with the app's package name and the SHA-1 of the key it is signed with.
Only the owner can create that in the Google Cloud project that already holds the website's client
(the project named "oAOUTH").

## What the app does (already implemented)

1. The button calls Google's native account chooser (`@react-native-google-signin/google-signin`).
2. Google returns an **ID token minted for the web client id** (`webClientId`), the same audience the
   backend checks (`GOOGLE_CLIENT_ID` in `POST /api/auth/google`). The backend needed no change.
3. The app posts `{ credential, mode, track }` to `/api/auth/google`, exactly like the website, and
   handles the same answers: a session, `showTerms` (new account: terms dialog), `needsTrackSelection`,
   and `404 noAccount` on the login screen ("no account linked to that Google account").

Files: `src/features/auth/GoogleButton.tsx`, call sites in `LoginScreen.tsx` and `SignupScreen.tsx`.

## Steps for the owner

1. **Google Cloud console** -> the project that holds the website's Google client -> *APIs & Services* ->
   *Credentials* -> *Create credentials* -> *OAuth client ID* -> type **Android**.
   - Package name: `com.m_alshraky3.sqb`
   - SHA-1: the signing key of the build you install. For EAS builds run
     `npx eas-cli credentials -p android` and copy the **SHA1 Fingerprint** of the keystore EAS holds.
     If the app is later published on Google Play with *Play App Signing*, also add the **App signing key
     certificate** SHA-1 from Play Console -> *Setup* -> *App signing* (a second Android client, or add it
     to the same one).
2. Copy the **web** client id (the one the website already uses, ends in `.apps.googleusercontent.com`;
   it is the `GOOGLE_CLIENT_ID` already set on the backend). It is a public identifier, not a secret.
3. Give it to the build as an environment variable and rebuild:
   - in `mobile/eas.json`, under the profile (`preview`/`production`), add
     `"env": { "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID": "<web client id>" }`, or set it as an EAS environment variable;
   - `npx eas-cli build -p android --profile preview`.

The button appears on the login and signup screens once the variable is present (and only on Android).
Test it with an account that is **not** yet in the app: sign up with Google, accept the terms, finish a quiz.

## If it fails on a device

| Symptom | Cause |
|---|---|
| Account chooser closes immediately with a developer error (code 10) | the Android client's package or SHA-1 does not match the build that is installed |
| "Could not sign in with Google" after choosing an account | the web client id in the build is not the one the backend verifies (`GOOGLE_CLIENT_ID`) |
| Nothing happens / button missing | `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` was not set when the build was made (it is inlined at build time) |

Google-created accounts have **no password**. Until the button is live they can still use the app through
*Forgot password* (the OTP flow sets one).
