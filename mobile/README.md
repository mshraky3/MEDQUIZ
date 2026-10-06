# SQB for Android

The native Android app for **SQB**, the Saudi licensing-exam question bank (SMLE / SNLE).
It is the website, rebuilt with Expo: same account, same API (`https://medquiz.vercel.app`),
same questions, same Arabic and English copy. A student can start a quiz on the site and
finish it in the app, and the analytics, wrong-question list, streak and subscription follow them.

Status, verification log and the list of known gaps: [`docs/STATUS.md`](docs/STATUS.md).

## Stack

| | |
|---|---|
| Expo SDK 57, React Native 0.86 (New Architecture), React 19, TypeScript (strict) | `expo-router` file routes in `src/app`, typed routes |
| Session | bearer token in `expo-secure-store`, profile in AsyncStorage; the API client is a fetch port of the website's axios interceptors (`src/lib/api.ts`) |
| Language | app-controlled direction (not Android's RTL flip): Arabic RTL / English LTR, exam content always LTR |
| Lessons | the website's own HTML, CSS and annotation canvas, rendered in a `react-native-webview` |
| Payments | Moyasar's hosted form inside a WebView (`src/features/subscribe`), switchable off for a Play Store build |
| Updates | `expo-updates` (OTA), runtime version = app version |

## Run it

```bash
cd mobile
npm install
npx expo start            # Expo Go is not enough for Google sign-in; use a dev/preview build
npx expo start --web      # browser preview of the same code (handy for layout work)
```

By default the app talks to production. To try it against a local backend:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000 npx expo start
```

The real backend `.env` holds live credentials: point a local backend at a sanitised copy, never the real one.

## Checks (run before every push)

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # expo lint
npm test              # vitest: quiz payloads, checkout helpers, copy parity, library, routes
npm run sync:check    # the copied website data/copy still matches the website
npx expo-doctor
npx expo export --platform android   # proves the Hermes bundle builds
```

## Where things live

```
src/app/            routes (thin: each file re-exports a screen)
src/features/       one folder per area: auth, hub, quiz, analysis, summaries, account,
                    subscribe, support, docs, library, common
src/ui/             design-system components (Text, Layout, Controls, Feedback, DatePicker)
src/lib/            api client, auth, storage, tracks, stats, formatting, route mapping
src/i18n/           language context, app-only strings (appCopy.ts) and the copied website copy
src/theme/          colours, spacing, fonts (values from the website's index.css)
scripts/            sync scripts (below)
docs/               STATUS, GOOGLE_SIGN_IN, PLAY_STORE_PAYMENTS
```

### Data copied from the website

Nothing here is retyped: the website stays the source of truth and the app copies it.

| Command | Copies | From |
|---|---|---|
| `npm run sync:copy` | the Arabic/English copy dictionaries (`src/i18n/copy`) | `my-react-app/src/i18n/copy` |
| `npm run sync:summaries` | lesson content, path metadata, lesson CSS | `my-react-app/src/components/Summaries` |
| `npm run sync:library` | free-question library, past-paper grouping, success stories | `my-react-app/src/seo` |
| `npm run gen:icons` | icon glyphs | the website's icon set |

After the website changes, run the matching command, then `npm run sync:check` and commit the result.
`npm test` fails if any copy file has a key in one language and not the other.

## Building (EAS)

Account `m_alshraky3` (free plan), project id `e3168990-1c46-401f-b7ce-3f27354981b2`,
package `com.m_alshraky3.sqb`, slug `sqb`. Builds are listed at
<https://expo.dev/accounts/m_alshraky3/projects/sqb/builds>.

```bash
npx eas-cli login                                      # once per machine
npx eas-cli build -p android --profile preview         # installable APK (internal link)
npx eas-cli build -p android --profile production      # AAB for Google Play (auto-increments versionCode)
npx eas-cli update --channel production --message "…"  # OTA JS update, same runtime version only
```

| Profile | Output | Channel |
|---|---|---|
| `development` | dev-client APK | development |
| `preview` | APK | preview |
| `production` | AAB | production |

Each cloud build uses the free plan's monthly quota. Anything that changes native code
(a new native module, a permission, `app.json` plugins) needs a new build; JS-only changes
can go out as an OTA update.

Do not change `API_URL` away from `https://medquiz.vercel.app`: it is compiled into every installed app.

## Release checklist

1. `npm run typecheck && npm run lint && npm test && npm run sync:check`
2. Bump `version` in `app.json` if native code changed (a new version means a new OTA runtime).
3. Decide the payment build: a Play Store build sets `EXPO_PUBLIC_IN_APP_CHECKOUT=false` ([`docs/PLAY_STORE_PAYMENTS.md`](docs/PLAY_STORE_PAYMENTS.md)).
4. Google sign-in: set `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` only after the Android OAuth client exists ([`docs/GOOGLE_SIGN_IN.md`](docs/GOOGLE_SIGN_IN.md)).
5. Build, install the APK on a real phone, sign in, run one quiz end to end.

## Rules that matter here

- The brand is always written **SQB** in user-facing text.
- Exam names and question text are never translated.
- Every user-facing string has an Arabic and an English version in the same place; never hard-code a language or a `dir`.
- The app never sends email; the API does, through the central email gateway.
- Never commit credentials, keystores (`*.jks`) or `google-services.json`.
