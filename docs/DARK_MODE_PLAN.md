# SQB dark mode — plan and page-by-page status

> Branch `claude/dark-mode`, started 2026-10-17. Light stays the default and
> must look exactly as before; dark is an opt-in second theme.
> Companion files: `docs/DESIGN_MAP.md` (page map and design rules),
> `my-react-app/src/index.css` (semantic tokens, light + dark),
> `my-react-app/src/theme/` (switch, generated palette),
> `my-react-app/scripts/theme/` (the converter that produced the palette).

**Status legend** — `to do` · `done` (converted and checked in a headless
browser, light and dark, phone and desktop) · `needs the owner's eye`
(converted, but something about it can only be judged by a person, or it could
not be rendered here — the note says what).

---

## 1. How it works (short)

- `<html data-theme="light|dark">`. A tiny inline script in `index.html` sets it
  before the first paint from `localStorage["sqb_theme"]` (`light` / `dark` /
  `system`; anything else = light). `color-scheme` follows it, so native
  controls and scrollbars match.
- Semantic tokens in `index.css` (`--surface`, `--text-dark`, `--border-color`,
  …) get a hand-picked dark set under `:root[data-theme="dark"]`.
- Hardcoded colours were replaced by tokens whose **light value is the same
  colour** (`background: #dbeafe` → `var(--bg-dbeafe)`, light `#dbeafe`). The
  dark value depends on the colour's role (background / text / border /
  shadow / SVG shape). Generated into `src/theme/palette.css` by
  `scripts/theme/convert-css.mjs`.
- Colours that already work on navy — saturated brand fills (blue buttons),
  white text on them, dark scrims — stay literal on purpose.
- Brand/status tokens used as text (`color: var(--primary-color)`) became
  `var(--primary-ink, var(--primary-color))`: `--primary-ink` exists only in
  dark, so light resolves to exactly what it did.

## 2. Colour inventory (before)

Counted 2026-10-17 on `main` @ `ba5550a` with
`grep -oE '#[0-9a-fA-F]{3,8}\b'` / `rgba?\(` / `\b(white|black)\b`.

| Where | Hex | rgb()/rgba() | named | Notes |
|---|---:|---:|---:|---|
| 58 CSS files | 1,975 | 899 | 119 | the bulk; per-file table in §4 |
| Summary content (`summaries/content/*.js`) | 1,410 | 0 | — | inline SVG diagrams inside study material — **not edited**, shown on a light backing in dark |
| Admin JSX (`SuccessStoriesAdmin`, `QuestionReports`, `AdminGate`, `Admin`, `Growth`, `EngagementPanel`, `FunnelPanel`, `Behavior`) | 131 | — | — | inline styles + recharts props |
| `ADD/ui/chartTheme.js` | 12 | 1 | — | recharts palette, axis, grid, tooltip |
| `landing/HeroArt.jsx` | 11 | — | — | inline SVG illustration |
| Other JSX (`Question`, `Suggestions`, `Signup`, `ForgotPassword`, `Navbar`, `QuestionCard`, `SummariesPage`, `RequireAuth`) | 25 | — | — | inline styles |
| `index.html` | 6 | 1 | — | pre-hydration shell styles |

There was no `data-theme` or `prefers-color-scheme` hook anywhere before this
branch.

## 3. Pages, routes and surfaces

Priority groups follow the brief: quiz and payment first.

### 3.1 Quiz (group A)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/quiz/:n` question screen | `Quiz/QUIZ.jsx`, `Question.jsx` | `QUIZ.css` | to do | answers: correct / wrong / selected / flagged must stay distinct without colour |
| Quiz timer | `Question.jsx` | inline style | to do | |
| Result / review | `Quiz/Result.jsx` | `QUIZ.css` | to do | |
| Quiz complete | `QuizComplete.jsx` | `QuizComplete.css` | to do | |
| Report-a-question modal | `ReportModal.jsx` | `ReportModal.css` | to do | |
| Unanswered popup | `QUIZ.jsx` | `QUIZ.css` | to do | |
| Explanation panel | `common/ExplanationPanel.jsx` | `ExplanationPanel.css` | to do | |
| Allowance spent | `Quiz/AllowanceSpent.jsx` | `AllowanceSpent.css` | to do | |
| Quiz loading / error | `Loading.jsx`, `ErrorScreen.jsx` | `Loading.css`, `ErrorScreen.css` | to do | |
| `/quizs` hub | `quizs/QUIZS.jsx` | `QUIZS.css`, `QuizsHub.css`, `AchievementBadges.css` | to do | |
| `/quizs?view=custom` launcher + mock-exam modal | `QuizLauncher.jsx` | `QuizLauncher.css`, `QUIZS.css` | to do | |
| Congratulations popup | `common/CongratulationsPopup.jsx` | `CongratulationsPopup.css` | to do | |

### 3.2 Subscribe and payment (group B)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/subscribe` plans | `subscribe/Subscribe.jsx` | `Login.css`, `Subscribe.css` | to do | |
| Moyasar card form | Moyasar.js (CDN) | `moyasar.css` (theirs) | to do | third-party markup + CSS |
| `/payment/callback` | `PaymentCallback.jsx` | `Login.css`, `Subscribe.css` | to do | |
| `/groups` | `groups/GroupsPage.jsx` | `Login.css`, `GroupsPage.css` | to do | |
| National Day / Golden Months offer strips | `common/NationalDayOffer.jsx`, `GoldenMonths.jsx` | `NationalDayOffer.css` | to do | campaign palettes |

### 3.3 Results and analysis (group C)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/analysis` | `analysis/Analysis.jsx` + `BreakdownTable`, `QuizHistory`, `FinalExams`, `LastQuizSummary`, `QuestionAttemptsTable` | `Analysis.css`, `analysisPanels.css` | to do | accuracy ramp green/amber/red |
| `/wrong-questions` | `WrongQuestions.jsx` | `WrongQuestions.css`, `analysisPanels.css` | to do | |

### 3.4 Account and auth (group D)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/account` (+ exam date, streak, goal cards, theme choice) | `account/AccountPage.jsx` | `Login.css`, `AccountPage.css`, `HubCards.css`, `GoalCard.css` | to do | |
| `/login`, `/forgot-password` | `login/Login.jsx`, `ForgotPassword.jsx` | `Login.css` | to do | Google button is Google's own iframe |
| `/signup`, `/signup/:token`, `/join/:token` + track modal | `signup/Signup.jsx`, `common/TrackModal.jsx` | `Login.css`, `Signup.css`, `TrackModal.css` | to do | |

### 3.5 Study material (group E)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/summaries` hub, `/summaries/:slug` reader | `summaries/SummariesPage.jsx`, `PathCheckpoint`, `QuestionCard`, `SummaryAnnotation` | `Summaries.css` | to do | most hardcoded colours in the repo; content SVGs |

### 3.6 Public pages (group F)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/` landing (+ HeroArt, National Day / Golden Months sections, InstallShowcase) | `landing/Landing.jsx` | `Landing.css`, `InstallShowcase.css`, `NationalDaySection.css`, `GoldenMonthsSection.css` | to do | own topbar and tokens |
| `/questions`, `/questions/:specialty`, `/questions/:specialty/:slug` | `questions/*` | `PublicQuestions.css` | to do | |
| `/past-papers`, `/past-papers/:slug` | `pastPapers/*` | `PublicQuestions.css` | to do | |
| `/exams/*` (13 routes) | `exams/ExamPage.jsx` | `Guides.css`, `Exams.css` | to do | |
| `/guides` + 5 articles | `guides/*` | `Guides.css` | to do | |
| `/about`, `/privacy`, `/terms`, `/refund-policy` | `legal/*` | `Legal.css` | to do | |
| `/faq` | `legal/FAQ.jsx` | `FAQ.css` | to do | |
| `/contact` | `contact/Contact.jsx` | `Contact.css` | to do | |
| `/suggestions` | `suggestions/Suggestions.jsx` | `Suggestions.css` | to do | |
| `/success-stories` | `successStories/SuccessStories.jsx` | `SuccessStories.css` | to do | |

### 3.7 Global chrome, errors, overlays (group G)

| Surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| Navbar + user menu | `common/Navbar.jsx` | `Navbar.css`, `LanguageToggle.css` | to do | carries the theme toggle |
| Footer | `common/Footer.jsx` | `Footer.css` | to do | |
| Notification bell + panel | `NotificationBell.jsx` | `NotificationBell.css` | to do | |
| Free-allowance banner | `FreeAllowanceBanner.jsx` | `FreeAllowanceBanner.css` | to do | |
| Cookie consent (toast) | `CookieConsent.jsx` | `CookieConsent.css` | to do | |
| Install prompt | `InstallPrompt.jsx` | `InstallPrompt.css` | to do | |
| Spinner | `Spinner.jsx` | `Spinner.css` | to do | the one shared spinner |
| 404 / error boundary | `NotFound.jsx`, `ErrorBoundary.jsx` | `ErrorScreens.css` | to do | |

### 3.8 Admin (group H, English-only, owner-facing)

| Route | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| shell + nav | `AdminLayout.jsx` | `AdminLayout.css`, `Admin.css`, `ui/ui.css` | to do | carries the theme toggle |
| `/admin` | `Admin.jsx` | `Admin.css` | to do | recharts |
| `/admin/growth` | `Growth.jsx`, `FunnelPanel.jsx` | `Growth.css` | to do | recharts |
| `/admin/behavior` | `Behavior.jsx`, `EngagementPanel.jsx` | `Behavior.css`, `EngagementPanel.css` | to do | recharts + heatmap |
| `/admin/accounting` | `Accounting.jsx` | `Accounting.css` | to do | |
| `/admin/users`, `/admin/links` | `ADD.jsx`, `TempLinks.jsx` | `add.css` | to do | |
| `/admin/questions` | `ADDQ.jsx` | `addq.css` | to do | |
| `/admin/bank` | `Bank.jsx` | `Bank.css` | to do | |
| `/admin/reports` | `QuestionReports.jsx` | inline styles | to do | |
| `/admin/stories` | `SuccessStoriesAdmin.jsx` | inline styles | to do | |
| `/admin/email` | `AdminBroadcast.jsx` | `AdminBroadcast.css` | to do | |
| admin gate (sign-in) | `common/AdminGate.jsx` | inline styles | to do | |

## 4. Per-stylesheet colour counts (before)

| Stylesheet | hex | rgb() | named | lines |
|---|---:|---:|---:|---:|
| summaries/Summaries.css | 368 | 106 | 6 | 1316 |
| quizs/QuizsHub.css | 116 | 20 | 4 | 861 |
| Quiz/QUIZ.css | 93 | 15 | 2 | 917 |
| landing/Landing.css | 86 | 108 | 6 | 1723 |
| ADD/AdminBroadcast.css | 83 | 9 | 2 | 311 |
| ADD/add.css | 80 | 99 | 3 | 1431 |
| ADD/Admin.css | 80 | 82 | 13 | 1933 |
| analysis/analysisPanels.css | 78 | 2 | 8 | 565 |
| quizs/QuizLauncher.css | 67 | 13 | 2 | 564 |
| quizs/QUIZS.css | 66 | 38 | 9 | 810 |
| subscribe/Subscribe.css | 58 | 10 | 1 | 605 |
| common/InstallShowcase.css | 49 | 18 | 5 | 431 |
| analysis/WrongQuestions.css | 44 | 3 | 0 | 278 |
| quizs/GoalCard.css | 42 | 9 | 1 | 353 |
| groups/GroupsPage.css | 36 | 6 | 2 | 350 |
| contact/Contact.css | 33 | 33 | 4 | 650 |
| index.css | 32 | 12 | 7 | 656 |
| successStories/SuccessStories.css | 30 | 7 | 0 | 200 |
| suggestions/Suggestions.css | 29 | 29 | 4 | 432 |
| quizs/HubCards.css | 29 | 18 | 1 | 330 |
| login/Login.css | 25 | 33 | 8 | 747 |
| ADD/Accounting.css | 24 | 5 | 1 | 374 |
| Quiz/ReportModal.css | 23 | 1 | 0 | 206 |
| landing/GoldenMonthsSection.css | 22 | 8 | 1 | 286 |
| account/AccountPage.css | 22 | 4 | 0 | 216 |
| landing/NationalDaySection.css | 20 | 6 | 1 | 377 |
| common/ErrorScreens.css | 20 | 6 | 0 | 151 |
| common/InstallPrompt.css | 20 | 5 | 0 | 183 |
| ADD/Behavior.css | 20 | 13 | 6 | 400 |
| signup/Signup.css | 20 | 10 | 0 | 235 |
| common/TrackModal.css | 19 | 8 | 0 | 234 |
| ADD/Bank.css | 19 | 12 | 0 | 253 |
| analysis/Analysis.css | 17 | 8 | 0 | 626 |
| ADD/ui/ui.css | 17 | 4 | 1 | 132 |
| Quiz/QuizComplete.css | 15 | 9 | 0 | 173 |
| common/NotificationBell.css | 15 | 5 | 0 | 161 |
| ADD/AdminLayout.css | 15 | 19 | 3 | 258 |
| ADD/Growth.css | 14 | 2 | 0 | 133 |
| legal/FAQ.css | 14 | 10 | 1 | 252 |
| Quiz/AllowanceSpent.css | 13 | 4 | 0 | 156 |
| legal/Legal.css | 12 | 3 | 2 | 126 |
| common/Navbar.css | 12 | 29 | 3 | 597 |
| ADD/addq.css | 11 | 8 | 0 | 148 |
| Quiz/ErrorScreen.css | 11 | 1 | 0 | 123 |
| common/NationalDayOffer.css | 8 | 4 | 1 | 165 |
| common/ExplanationPanel.css | 8 | 3 | 1 | 121 |
| common/CookieConsent.css | 6 | 7 | 1 | 136 |
| common/FreeAllowanceBanner.css | 5 | 2 | 1 | 69 |
| common/Spinner.css | 5 | 1 | 0 | 88 |
| Quiz/Loading.css | 5 | 1 | 0 | 74 |
| questions/PublicQuestions.css | 5 | 0 | 2 | 502 |
| i18n/LanguageToggle.css | 4 | 9 | 1 | 73 |
| common/Footer.css | 4 | 5 | 0 | 142 |
| ADD/EngagementPanel.css | 4 | 3 | 0 | 168 |
| common/CongratulationsPopup.css | 1 | 7 | 0 | 225 |
| common/AchievementBadges.css | 1 | 3 | 1 | 91 |
| guides/Guides.css | 0 | 4 | 3 | 156 |
| exams/Exams.css | 0 | 0 | 1 | 62 |
| **Total** | **1,975** | **899** | **119** | |

## 5. Rules this work keeps

- Light is the default and unchanged; dark is opt-in (toggle, or "follow device").
- Panels stay opaque in dark too; no glass or blur on panels; finite animations;
  the one shared Spinner.
- Quiz answer states never rely on colour alone (icons/text stay).
- Brand is "SQB" only; exam names and question text are never translated;
  every new UI string has an Arabic and an English version; no hardcoded
  direction.
- No env, Vercel, migration, payment-logic, price or backend changes.
