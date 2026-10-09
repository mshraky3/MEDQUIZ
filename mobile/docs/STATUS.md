# SQB Android app: status (7 October 2026)

Rebuilt from scratch on Expo SDK 57 (the SDK 55 prototype it replaces had ten screens and no quiz resume,
study plan, lessons, payments or free library). Source of truth for behaviour: the website in `../my-react-app`.

## Feature parity with the website

| Website | App | Notes |
|---|---|---|
| Landing `/` | `welcome` | live stats from `/api/public/stats`, track choice, CTAs |
| Login, forgot password | yes | same OTP reset flow, same error messages |
| Signup: free / invite link `/signup/:token` / paid seat `/join/:token` | yes | OTP, track picker, terms; invite/seat links also open the app (https intent filters) |
| Google sign-in | **code done, hidden** | needs the owner's Android OAuth client: `docs/GOOGLE_SIGN_IN.md` |
| Home `/quizs` | Home tab | stats, collections, quick quiz, achievements, free-allowance banner, exam countdown |
| Custom quiz + final (mock) exam | Launcher | source, specialties, count, timer, study/exam mode, final exam per specialty |
| Quiz | `quiz` | study vs exam mode, timer (absolute deadline), autosave + resume, unanswered popup, report-an-error, finish/submit with retry |
| Analysis, wrong questions | Analysis, Review tabs | per-specialty and per-source accuracy, history, final exams, review cards, reset |
| Summaries (study path + lessons) | Summaries tab | the website's lesson HTML/CSS, highlighter/pen/eraser layer, checkpoints, progress sync |
| Account: subscription, exam date, streak, weekly goal | Account | server-computed countdown, first-run exam-date ask |
| Subscribe, payment callback | `subscribe`, `payment/callback` | Moyasar form in a WebView, offers from the server, `IN_APP_CHECKOUT` switch for Play |
| Groups (buy seats, invite links) | `groups` | plan cards, savings per seat, seat manager, copy/share links |
| Notifications | bell + `notifications` | list, unread count, CTA routing |
| Contact, suggestions, FAQ, About, Terms, Privacy, Refund | yes | the website's own copy |
| Guides, exam pages (`/exams/...`) | yes | same data module as the site |
| Free question library `/questions/...`, past papers, success stories | yes | same data files; the correct option and explanation are always visible, as on the site |
| Admin panel `/admin/*` | **not included** | deliberately; admins use the website |
| PWA install prompt, cookie banner, National Day banners | n/a | the offer has ended; prices always come from the server |

Arabic (RTL) and English (LTR) throughout; default follows the device language; exam content stays LTR.

## What was verified, and how

All of this ran against a **local copy of the real backend code** (frozen database snapshot, test accounts,
no live keys), with the app served as a web preview in a phone-sized viewport.

- `tsc` clean, lint clean, 90 unit tests, `expo-doctor` 21/21, `sync:check` in sync.
- Android **Hermes bundle exports** (`expo export --platform android`) and a local `expo prebuild` generates the
  expected manifest (https intent filters, storage/overlay permissions removed).
- Signed-out: welcome, login (wrong password message), signup (track picker, validation), forgot password,
  invalid invite and seat links.
- Signed-in, paid medical and nursing accounts, Arabic and English: home, launcher, quiz (exam mode), result,
  resume dialog ("3 of 10"), exit dialog, analysis, review, account, exam-date dialog (pick, save, clear),
  subscribe plan picker with offer maths, groups, notifications, contact, suggestions, FAQ, legal pages,
  guides, exams, free library (hub, specialty, question with pick-your-answer), past papers, success stories.
- Free tier: allowance banner, a full 10-question quiz and result, "unanswered backlog" and "allowance spent"
  screens with the student's real stats.
- A 1,180-question final exam: loads, countdown runs, unanswered popup counts correctly and jumps to the gap,
  all 1,180 answerable, result screen renders.
- Console clean across 25 routes (no React errors).

## Not verified (be honest about these)

- **Native build:** the first preview APK (EAS build `6d9d5d82-0a66-4f9d-8a59-eb657d2e03ff`, commit `c33b060`) compiled and finished on EAS, so the native modules (WebView, secure store, Google sign-in, updates) build. It predates the keyboard fix in `0185c46`, which is JS-only and arrives with the next build or an OTA update. The APK link is on the build page (<https://expo.dev/accounts/m_alshraky3/projects/sqb/builds/6d9d5d82-0a66-4f9d-8a59-eb657d2e03ff>) until 20 Oct 2026.
- **No real device or emulator.** This machine has no Android SDK. Everything above is the web build of the same
  code plus a successful native bundle; touch behaviour, the keyboard, the WebViews (lessons, checkout), the
  secure store and the Back button have not run on Android. The first thing to do with the preview APK is install
  it and run one quiz, one lesson, one login.
- **Payments:** the card form was never exercised (no Moyasar test key was used; live keys must never be).
  The page it builds, the callback parsing and the URL allow-list are unit-tested.
- **Google sign-in:** cannot run until the owner creates the Android OAuth client.
- **Google Play policy** on in-app card payment: owner decision, `docs/PLAY_STORE_PAYMENTS.md`.

## Findings in the existing backend/website (not changed)

1. **Large final exams cannot be saved.** `POST /final-quiz/submit` goes through `express.json()` with Express's
   100 KB default and inserts one row per question in a loop. A 1,180-question exam (the largest specialty) returns
   **413**; the website sends the same payload, so it fails there too. The app shows the result and a clear
   "could not save, retry" notice. Fix is server-side: raise the limit for that route and batch the insert.
2. `GET /session-validate` always reports `valid:false` because `logged_date` is a DATE column compared with a
   timestamp; the app validates sessions through the authenticated subscription endpoint instead.
3. The exam-date API serialises a DATE through `toISOString()`, so a backend running in a UTC+3 timezone shows
   the day before. Vercel runs in UTC, so production is fine; only a local backend on a Saudi laptop shows it.
4. The public library payload (`publicQuestions.json`: `bankTotal` and `collections`) still describes the bank as it was
   on 30 Aug 2026 (5,033 questions, 5 collections); the live bank has 13,036 (medical 7,871, nursing 2,105, dental 3,060 on
   9 Oct 2026). The landing copy no longer states a number. Regenerate the payload with `backend/scripts/exportPublicQuestions.js`
   (needs production DB access) and run `npm run sync:library` here; see `knowledge/SQB/11 Improvements backlog.md`.

## Decisions and progress on 7 Oct 2026 (after the first build)
- Google Android OAuth client created (see `GOOGLE_SIGN_IN.md`); the build must still be given the web client id.
- Play Store route chosen: sign-in only plus an optional website-subscribe button; research in `PLAY_STORE_PAYMENTS.md`.
- Wanted next: one-tap Google sign-in and passwordless email-code sign-in. The second needs a new backend endpoint and
  the owner's go-ahead (production deploy).

## Next steps

1. Install the preview APK on a phone and run the release checklist in `README.md`.
2. Owner: Android OAuth client for Google sign-in; decide the Play Store payment route.
3. Decide on the server-side fix for finding 1.
