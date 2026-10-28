# SQB on Google Play: launch checklist (2026-10-28)

Status words: **done** (in the repo or verified), **needed** (work for Claude/dev), **owner clicks** (only the owner can do it:
Play Console, Google Cloud, Vercel). "Not verified" means I could not confirm it from a public page or from a run.
Nothing below was run on a real phone, and no build, upload or deploy was done. Same Play developer account as Mahfazati
(personal account `m_alshraky`, created 2026-09-26): see `mahfazati/docs/release/PLAY-STORE.md` and `TESTERS.md`.

## 0. The plan in one paragraph
Build the **sign-in-only** app (decided 2026-10-07), put it in a **closed test** with 12+ testers for 14 days, apply for
**production**, then publish. The website login page gets a card (hidden until two links exist) that sends people to the
tester programme and to the download. Payment stays on the website (Moyasar, 0 % Google fee). Mahfazati took about
3.5 weeks from "sent for review" (26 Sep) to live (20 Oct), including one rejection of a permissions form: plan on a month.

## 1. Closed testing rule
| Item | Value | Status |
|---|---|---|
| Testers and days | **At least 12 testers opted in for 14 days in a row**, then "Apply for production" on the app's Dashboard (applies to personal accounts created after 13 Nov 2023). Source: Google Play Console Help answer 14151465 (read 2026-10-28) and how Mahfazati went. | verified |
| Does it apply to each app? | Google's page says "a closed test for their app" and does not say whether a second app needs its own test. Assume **yes** (plan 12 testers, 14 days for SQB too). | not verified |
| If a tester opts out and back in | the 14 days must be consecutive again | verified (Google page) |
| How testers get in | Only people on the tester list can opt in: an **email list** (Mahfazati did this by hand, one Gmail at a time) or a **Google Group**. For an open web card use a **Google Group set to "anyone can join"** and attach it to the closed track, otherwise every tester must be added by hand. List size limits | not verified |
| Get 15 to 20 | some forget or uninstall (Mahfazati lesson) | advice |
| Track | Test and release > Testing > Closed testing; Saudi Arabia (plus other countries if wanted) | owner clicks |

**The two card links, meaning:** `VITE_ANDROID_TESTER_URL` = the Google Group join page (or, with manual emails, a
page that tells people to send their Gmail); `VITE_ANDROID_DOWNLOAD_URL` = the closed-test opt-in link
`https://play.google.com/apps/testing/com.m_alshraky3.sqb` during the test, switched to the store link
`https://play.google.com/store/apps/details?id=com.m_alshraky3.sqb` after the public release.

## 2. Requirements
| Requirement | Answer / action | Status |
|---|---|---|
| App created in Play Console | name below, default language Arabic, App, Free, package `com.m_alshraky3.sqb` | owner clicks |
| Privacy policy URL | `https://www.smle-question-bank.com/privacy` (exists on the site and in the app, Arabic and English). Re-read it: it talks about "website" and "cookies"; add one sentence about the Android app and Google sign-in | needed (small copy change in `legal.js`) |
| Account deletion | **GAP.** Play requires, for apps with sign-up: a deletion path inside the app AND a web URL for the Data safety form. Today the privacy policy only says "request deletion" and the repo has no self-service deletion; a paid account can never be deleted by rule. Minimum: a web page `/delete-account` stating how to ask (email `alshraky3@gmail.com`, what is deleted, that payment records are kept for the legal period) plus an in-app row that opens it. A Play form note may say paid-record retention | needed (decision: a request page is enough; self-service delete is optional) |
| Data safety | see section 3 | owner clicks (answers ready) |
| Content rating (IARC) | Category: education/reference app. Violence, sex, language, drugs, gambling: No. User-generated content / user interaction: No. Location: No. Digital purchases: No (the Play build has no purchase flow). Expect a low rating (3+ or similar). Mahfazati rated 3+ | owner clicks |
| Target audience | 18 and over (avoids the Families policy; privacy policy says not for under 13) | owner clicks |
| Ads | No ads in the app | owner clicks |
| App access | **Everything is behind a login: Play needs a reviewer test account.** Create one test account (free or comped) and paste its login into App content > App access. Never write it in a doc or the repo | owner clicks (create the account first) |
| Financial features declaration | none (the Play build has no payment) | owner clicks |
| Health apps declaration | the app is exam preparation for medical licensing, not diagnosis or treatment. Answer per the form's current options (a "medical reference and education" style category may exist: not verified). Mahfazati answered "none" | owner clicks |
| Government / news app | No / No | owner clicks |
| Target API level | New apps and updates must target **Android 16 (API 36)** from 31 Aug 2026 (Google Play Console Help, read 2026-10-28). Expo SDK 57 / React Native 0.86 ships `targetSdk = 36` (read from `node_modules/react-native/gradle/libs.versions.toml`). The real value is shown in the Play Console after the first upload | done in code, confirm after upload |
| App signing | Use **Play App Signing** (default). EAS signs the upload with its keystore ("Build Credentials 8Dgee3dP59"); Google re-signs for users | owner clicks |
| **Play SHA-1 for Google sign-in** | **Required.** Store-installed builds are signed by Google's key, not EAS's. In Play Console open the app's *App signing* page and copy the **App signing key certificate SHA-1**, then in Google Cloud (project `oAOUTH`, id `oaouth-433913`) create a second **Android** OAuth client: package `com.m_alshraky3.sqb`, that SHA-1. Without it Google sign-in fails with developer error code 10 for Play installs (see `GOOGLE_SIGN_IN.md`). Also check the OAuth consent screen is "In production" (not verified) | owner clicks |
| Web client id in the build | `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` now set in `eas.json` for `preview`, `play-preview`, `production` (public id, from `GOOGLE_SIGN_IN.md`) | done |
| Permissions | Local `expo prebuild` (2026-10-28, then deleted) gave: `INTERNET`, `VIBRATE`; `READ/WRITE_EXTERNAL_STORAGE` and `SYSTEM_ALERT_WINDOW` removed. Libraries may merge `ACCESS_NETWORK_STATE` at build time. No SMS, location, camera, contacts, microphone or notification-permission declaration. Check the merged list in Play Console (App bundle explorer) after the first upload | done, confirm after upload |
| Store listing text | section 4 | needed (owner approves) |
| Icon 512 x 512 | `assets/icon.png` is 1024 x 1024 RGBA: export 512 x 512 PNG (32-bit, under 1 MB) | needed |
| Feature graphic 1024 x 500 | none exists (Mahfazati's is in `mahfazati/docs/release/store/` as a model) | needed |
| Phone screenshots (2 to 8) | none taken (the app never ran on a phone). Take from the first device build: welcome, home, launcher, a quiz question, result, analysis, a lesson, account. Mind: the Play build shows no prices | needed (after the phone test) |
| Mahfazati-style first upload | the first AAB is uploaded by hand in Play Console (the API cannot create the first release); `eas submit` would also need a Google service-account key, not set up | owner clicks |

## 3. Data safety answers (draft, matches what the app does today)
The app talks only to `https://medquiz.vercel.app` (the SQB API). No ads SDK, no third-party analytics SDK in `package.json`.
Google Sign-In is Google's own SDK. Funnel events go to SQB's own `/api/funnel`.
- Collects or shares user data: **Yes** (collected; not sold; not shared with third parties for advertising).
- Encrypted in transit: **Yes** (HTTPS). Deletion request: **Yes** (use the web URL from section 2).
- Data types, all "collected", purpose "App functionality" (and "Account management"), not shared:
  - **Personal info: Name, Email address** (registration), user IDs.
  - **App activity:** quiz answers, performance and progress, in-app actions (study analytics, funnel events).
  - **App info and performance:** crash/error reports sent to `/api/error-report` if the app sends them (verify before filling).
  - **Device or other IDs:** not collected by the app itself; the server logs IP and device type at sign-in (privacy policy section 2): declare "Device or other IDs" as collected to be safe.
  - Phone / WhatsApp number only if the user types it in the contact form (optional): declare "Phone number", optional.
  - **Financial info: none** in the Play build (card data is entered only on the website, handled by Moyasar).
- Data is not required for any purpose other than the features above. Keep this file, the Data safety form and
  `legal.js` in step if the app starts sending anything new.

## 4. Store listing drafts (owner approves; brand is "SQB"; no prices, no question counts, no "every question explained", no reward wording)
- **Name (max 30):** `SQB: SMLE & SNLE Practice` (25) / Arabic `SQB: بنك أسئلة SMLE وSNLE` (25)
- **Short description (max 80):**
  - EN: `Practise SMLE, SNLE and SDLE questions with timed quizzes, lessons and analysis.` (80)
  - AR: `تدرّب على أسئلة SMLE وSNLE وSDLE بنظام الاختبار والدروس وتحليل أدائك.` (69)
- **Full description EN:**
  > SQB is a question bank for the Saudi licensing exams: SMLE (medicine), SNLE (nursing) and SDLE (dentistry).
  > Sign in with your SQB account and practise on your phone.
  > - Custom quizzes by source and specialty, in study mode or timed exam mode
  > - Final mock exams per specialty
  > - Study summaries with a highlighter and pen, and a study path
  > - Performance analysis by specialty and source, a mistakes review, streaks, weekly goal and an exam countdown
  > - Arabic and English, right-to-left supported
  > - A free allowance of questions to try before anything else
  > Sign in with your email or your Google account. Your account and subscription are managed with SQB on the website.
  > SQB is an educational tool and is not affiliated with SCFHS or Prometric.
- **Full description AR:**
  > SQB بنك أسئلة لاختبارات الرخصة المهنية في السعودية: SMLE للطب وSNLE للتمريض وSDLE لطب الأسنان.
  > سجّل الدخول بحساب SQB وتدرّب من جوالك.
  > - اختبارات مخصصة حسب المصدر والتخصص، بوضع المذاكرة أو وضع الاختبار المؤقت
  > - اختبارات نهائية تجريبية لكل تخصص
  > - ملخصات للمذاكرة مع قلم تحديد وقلم رسم، ومسار دراسة
  > - تحليل الأداء حسب التخصص والمصدر، ومراجعة الأخطاء، والمتابعة اليومية، والهدف الأسبوعي، والعدّ التنازلي لموعد اختبارك
  > - عربي وإنجليزي مع دعم كامل للاتجاه من اليمين إلى اليسار
  > - عدد مجاني من الأسئلة لتجرّب قبل أي شيء
  > سجّل الدخول بالبريد الإلكتروني أو بحساب Google. تتم إدارة حسابك واشتراكك مع SQB على الموقع الإلكتروني.
  > SQB أداة تعليمية وليست تابعة للهيئة السعودية للتخصصات الصحية ولا لبرومترك.
  Check before pasting: the site says "10 free questions" for new accounts and "40" for old ones, so the text says "a free allowance", no number.
  Wording "managed ... on the website" is the one soft spot for Play's payments policy (see section 6); delete that sentence
  if Play objects.
- **Category:** Education. **Contact email:** `alshraky3@gmail.com`. **Website:** `https://www.smle-question-bank.com`.
- **Do not** put in the listing: prices, "free month", "reward", "rate us", competitor names, "official".

## 5. Build readiness (what is done in the branch `feat/play-launch`)
Worktree `C:\Users\muhmo\sqb-play-launch` (local commits only, nothing pushed; the main checkout was not touched).
| Check | Result |
|---|---|
| Sign-in-only mode | **Was not built** (the notes said "next session"). Built now: `EXPO_PUBLIC_STORE_MODE=play` (`src/config.ts`). In that build: `/subscribe` and `/groups` show a neutral screen (`PlayAccessScreen`); the welcome page loses the pricing, comparison and "why subscribe" sections, the price chips and the group plan card; Account, More menu, footer, free-allowance banner and every paywall CTA lose their buy buttons; the card form is off. |
| Website button switch | `EXPO_PUBLIC_WEBSITE_SUBSCRIBE_BUTTON=true` (Play build only, **off** in `eas.json`): the neutral screen then offers "Open my account on the website" (opens `/account`) and re-reads the subscription when the student returns. |
| Google web client id | wired in `eas.json` (`preview`, `play-preview`, `production`) |
| EAS profiles | `play-preview` is new: an APK (installable, no store needed) with the Play mode on, for the first phone test. `preview` keeps the full app. `production` = the Play AAB, `EXPO_PUBLIC_STORE_MODE=play` |
| `npm run typecheck`, `npm run lint`, `npm test` | clean; 93 tests pass (90 before + 3 for the switches) |
| `npx expo export --platform android` with the Play env | Hermes bundle builds |
| `npm run sync:check` | reports "20 file(s) differ" in this Windows worktree because git's CRLF conversion makes the working copies differ from the check's LF expectation (the same check, unchanged by this work, compares them byte for byte). Not a content drift; run it in a clean LF checkout or CI to confirm |
| Browser preview (web build of the Play mode, no backend) | welcome page shows no prices, no Moyasar, no "subscribe" text. **Not rendered in a browser:** `/subscribe` and `/groups` after sign-in (needs a signed-in session against a local backend, which was not available) |
| Real phone | **nothing was run on a phone or emulator** |
| Known leftovers in the Play build | legal and FAQ pages (copied from the website) still contain prices and "Moyasar"; the paywall text of a spent allowance still says "subscribe" without a button. Copy is synced from the site, so changing it means a conditional copy set. Decide if a reviewer would care; the buying paths themselves are gone |

### Exact commands (owner runs them, or says go)
```
cd "C:\Users\muhmo\Desktop\CODE\Projects\working projects\SQB\mobile"   # after the branch is merged to main
npm ci
npm run typecheck && npm run lint && npm test
# 1) First phone test (APK, free, no store): Play mode + Google button
npx eas-cli@latest build -p android --profile play-preview
# 2) Play upload (AAB, versionCode auto-increments on EAS):
npx eas-cli@latest build -p android --profile production
```
Cost on the **EAS free plan: no cash cost.** A build uses one of the free plan's monthly builds and waits in the
low-priority queue (minutes to hours). The exact monthly build quota is not stated in the repo notes: check
expo.dev > Billing before the second build. `EAS_NO_VCS` must stay unset. Builds read the committed state, so the
branch must be merged to `main` (or the build run from the worktree after committing).
Owner steps for the first test: open the build page, install the APK (allow unknown sources, or pause Play Protect as with
Mahfazati), run the release checklist in `README.md` (login, one quiz, one lesson), then the Google button.
Old build `6d9d5d82...` link expired 2026-10-20; the new APK replaces it.

## 6. Policy risk: the free-month card (checked 2026-10-28)
What Google's current text says (Play Console Help, "User Ratings, Reviews, and Installs", answer 9898684, read today):
it prohibits manipulation of ratings, reviews and install counts; offering rewards for ratings or reviews is not allowed;
it prohibits incentivising users to install *other* apps as an app's main function; it does not address rewarding people
for installing or using your own app. Google's 2017 blog post says incentivised installs are a violation when used to
manipulate placement, and a legitimate acquisition channel otherwise (old source, read for context only).
- **Clear red lines:** a reward tied to a rating or review ("rate us 5 stars for a free month"); a reward for an install
  that is meant to lift the install count and ranking; anything that says "install to get X" in the Play listing or
  inside the app.
- **Gray area:** "Download the Android app and get a free month" on the *website*. It is an incentivised install, outside
  Play. Google does not forbid it in the text I read, but it is exactly the pattern its install-manipulation rule looks at,
  especially while the app has 12 to 20 installs and is applying for production. Not verified how strictly it is enforced.
- **Also:** a free month is paid access given in a sign-in-only app: that is fine for the payments policy (no purchase happens in the app).
- **Risk if it goes wrong:** removal of the app or a warning on the developer account that also holds Mahfazati.
- **Recommended wording** (built into the card): a tester programme asking for feedback ("we are testing the app and need
  your feedback"), never "install to get a reward", never a rating or review, no countdown pressure. The free-month line is a
  separate, optional string, shown only when `VITE_ANDROID_FREE_MONTH=true` and phrased as a month for signing in, once per
  account. **Safest variant:** keep the card without the free-month line during the closed test (testers come for the product),
  and give the free month afterwards as a thank-you to the people who actually sent feedback (support email or a form), by
  the existing admin grant, not on install. Second-safest: make the month available to every free account that asks (not
  install-gated), announced on the site and Telegram, not on the Play listing.
- Never ask testers to review the app on Play, and never reward the 12 closed-test testers differently for staying opted in
  (that is a thank-you at most, after the 14 days, not a condition).

## 7. What the owner must click (Play Console, Google Cloud, Vercel)
1. Play Console: create the app `com.m_alshraky3.sqb` (Arabic default, Free); fill App content (section 2/3); store listing (section 4); upload the privacy and deletion URLs.
2. Create a Google Group "SQB testers" (anyone can join, or manual emails), then Closed testing > create track/release > add the group (or emails) > copy the **opt-in link**. Upload the AAB by hand to the closed track (first upload is manual).
3. Reviewer test account: create it, paste into App access.
4. Google Cloud: second Android OAuth client with Play's App signing SHA-1 (section 2).
5. After 12 testers x 14 days: Dashboard > Apply for production (answer the test questions: who tested, feedback, what changed).
6. Vercel project `medquiz-react` (SPA): set `VITE_ANDROID_TESTER_URL` and `VITE_ANDROID_DOWNLOAD_URL` (and `VITE_ANDROID_FREE_MONTH` only if decided), then redeploy. The card appears only when both links are valid https links.

## 8. Decisions needed from the owner
1. **Card wording and the free month** (section 6): safest variant, or the free-month line on the card?
2. **Free-month design** (`FREE-MONTH-DESIGN.md`): turn on `APP_FREE_MONTH_ENABLED`, wait, or use admin grants after feedback?
3. **D14 email-code login** (new backend endpoint, security-sensitive, production deploy): still waiting for his yes; not built.
4. **Account deletion page** and the privacy-policy sentence for the app (section 2).
5. Whether the "open my account on the website" button stays off in the Play build (it is off).
6. Should the Play build be released in Saudi Arabia only (Mahfazati was)?

## 9. Ship steps (all need the owner's yes: push to `main` deploys Vercel)
1. Review the branch `feat/play-launch` (4 local commits). 2. Fast-forward it to `origin/main` via the worktree flow in
`project-rules/SQB.md`: `git fetch`, check it is still based on `origin/main`, push `feat/play-launch:main` (fast-forward only).
That deploys the website card (hidden until the two links exist) and the backend route (404 until `APP_FREE_MONTH_ENABLED=true`).
3. Run section 5 builds. 4. Set the two `VITE_` links on Vercel when the opt-in link exists, redeploy the SPA.
Rollback for the website card: unset the two variables and redeploy (or Vercel Instant Rollback).
