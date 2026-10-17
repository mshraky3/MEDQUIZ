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
  `var(--primary-color-ink, var(--primary-color))`: `--primary-color-ink` exists only in
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
| `/quiz/:n` question screen | `Quiz/QUIZ.jsx`, `Question.jsx` | `QUIZ.css` | done | answers: correct / wrong / selected / flagged must stay distinct without colour; ✓/✗ icons + text on correct/wrong; chosen answer = bold + border + tint |
| Quiz timer | `Question.jsx` | inline style | done | inline colours now `var(--timer-*-ink, <old>)`; brighter twins in dark |
| Result / review | `Quiz/Result.jsx` | `QUIZ.css` | done |  |
| Quiz complete | `QuizComplete.jsx` | `QuizComplete.css` | done | "section finished" state checked |
| Report-a-question modal | `ReportModal.jsx` | `ReportModal.css` | done |  |
| Unanswered popup | `QUIZ.jsx` | `QUIZ.css` | needs the owner's eye | converted, but only reachable when a timed quiz runs out, so not rendered here |
| Explanation panel | `common/ExplanationPanel.jsx` | `ExplanationPanel.css` | done |  |
| Allowance spent | `Quiz/AllowanceSpent.jsx` | `AllowanceSpent.css` | done | 402 paywall state checked |
| Quiz loading / error | `Loading.jsx`, `ErrorScreen.jsx` | `Loading.css`, `ErrorScreen.css` | done | load-error state checked |
| `/quizs` hub | `quizs/QUIZS.jsx` | `QUIZS.css`, `QuizsHub.css`, `AchievementBadges.css` | done |  |
| `/quizs?view=custom` launcher + mock-exam modal | `QuizLauncher.jsx` | `QuizLauncher.css`, `QUIZS.css` | done | mock-exam modal keeps its coral design in both themes |
| Congratulations popup | `common/CongratulationsPopup.jsx` | `CongratulationsPopup.css` | done |  |

### 3.2 Subscribe and payment (group B)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/subscribe` plans | `subscribe/Subscribe.jsx` | `Login.css`, `Subscribe.css` | done |  |
| Moyasar card form | Moyasar.js (CDN) | `moyasar.css` (theirs) | needs the owner's eye | third-party markup + CSS; Moyasar's CDN is blocked here, so the real form never rendered. In dark it sits in a white frame with light text tokens; check it on the running branch |
| `/payment/callback` | `PaymentCallback.jsx` | `Login.css`, `Subscribe.css` | done | failed and success states checked |
| `/groups` | `groups/GroupsPage.jsx` | `Login.css`, `GroupsPage.css` | done | "undefined" in screenshots is fake data |
| National Day / Golden Months offer strips | `common/NationalDayOffer.jsx`, `GoldenMonths.jsx` | `NationalDayOffer.css` | done | campaign palettes; strip/banner unchanged (green/gold bands read on navy) |

### 3.3 Results and analysis (group C)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/analysis` | `analysis/Analysis.jsx` + `BreakdownTable`, `QuizHistory`, `FinalExams`, `LastQuizSummary`, `QuestionAttemptsTable` | `Analysis.css`, `analysisPanels.css` | done | accuracy ramp green/amber/red |
| `/wrong-questions` | `WrongQuestions.jsx` | `WrongQuestions.css`, `analysisPanels.css` | done |  |

### 3.4 Account and auth (group D)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/account` (+ exam date, streak, goal cards, theme choice) | `account/AccountPage.jsx` | `Login.css`, `AccountPage.css`, `HubCards.css`, `GoalCard.css` | done | exam-date popup was white in dark (undefined `--card-bg`); fixed |
| `/login`, `/forgot-password` | `login/Login.jsx`, `ForgotPassword.jsx` | `Login.css` | needs the owner's eye | Google button is Google's own iframe; page done; the Google sign-in button is Google's iframe and was not loaded here |
| `/signup`, `/signup/:token`, `/join/:token` + track modal | `signup/Signup.jsx`, `common/TrackModal.jsx` | `Login.css`, `Signup.css`, `TrackModal.css` | done | invite variants share the same styles; not rendered separately |

### 3.5 Study material (group E)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/summaries` hub, `/summaries/:slug` reader | `summaries/SummariesPage.jsx`, `PathCheckpoint`, `QuestionCard`, `SummaryAnnotation` | `Summaries.css` | needs the owner's eye | most hardcoded colours in the repo; content SVGs; done; deck diagrams stay as drawn on a light backing (a taste call: recolouring study material was ruled out) |

### 3.6 Public pages (group F)

| Route / surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| `/` landing (+ HeroArt, National Day / Golden Months sections, InstallShowcase) | `landing/Landing.jsx` | `Landing.css`, `InstallShowcase.css`, `NationalDaySection.css`, `GoldenMonthsSection.css` | needs the owner's eye | own topbar and tokens; done; first impression page, worth a look. Offer sections: identical to main, white cards kept |
| `/questions`, `/questions/:specialty`, `/questions/:specialty/:slug` | `questions/*` | `PublicQuestions.css` | done | single question page shares the specialty styles |
| `/past-papers`, `/past-papers/:slug` | `pastPapers/*` | `PublicQuestions.css` | done |  |
| `/exams/*` (13 routes) | `exams/ExamPage.jsx` | `Guides.css`, `Exams.css` | done | one component, one stylesheet |
| `/guides` + 5 articles | `guides/*` | `Guides.css` | done |  |
| `/about`, `/privacy`, `/terms`, `/refund-policy` | `legal/*` | `Legal.css` | done |  |
| `/faq` | `legal/FAQ.jsx` | `FAQ.css` | done |  |
| `/contact` | `contact/Contact.jsx` | `Contact.css` | done |  |
| `/suggestions` | `suggestions/Suggestions.jsx` | `Suggestions.css` | done |  |
| `/success-stories` | `successStories/SuccessStories.jsx` | `SuccessStories.css` | done |  |

### 3.7 Global chrome, errors, overlays (group G)

| Surface | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| Navbar + user menu | `common/Navbar.jsx` | `Navbar.css`, `LanguageToggle.css` | done | carries the theme toggle |
| Footer | `common/Footer.jsx` | `Footer.css` | done |  |
| Notification bell + panel | `NotificationBell.jsx` | `NotificationBell.css` | done |  |
| Free-allowance banner | `FreeAllowanceBanner.jsx` | `FreeAllowanceBanner.css` | done | orange band in both themes; its white pill stays white |
| Cookie consent (toast) | `CookieConsent.jsx` | `CookieConsent.css` | done |  |
| Install prompt | `InstallPrompt.jsx` | `InstallPrompt.css` | needs the owner's eye | converted; only appears on a real install event, not rendered here |
| Spinner | `Spinner.jsx` | `Spinner.css` | done | the one shared spinner |
| 404 / error boundary | `NotFound.jsx`, `ErrorBoundary.jsx` | `ErrorScreens.css` | done |  |

### 3.8 Admin (group H, English-only, owner-facing)

| Route | Component | Stylesheets | Status | Notes |
|---|---|---|---|---|
| shell + nav | `AdminLayout.jsx` | `AdminLayout.css`, `Admin.css`, `ui/ui.css` | done | carries the theme toggle |
| `/admin` | `Admin.jsx` | `Admin.css` | done | recharts |
| `/admin/growth` | `Growth.jsx`, `FunnelPanel.jsx` | `Growth.css` | done | recharts; axis/grid/tooltip themed via ui.css + tokens |
| `/admin/behavior` | `Behavior.jsx`, `EngagementPanel.jsx` | `Behavior.css`, `EngagementPanel.css` | done | recharts + heatmap |
| `/admin/accounting` | `Accounting.jsx` | `Accounting.css` | done |  |
| `/admin/users`, `/admin/links` | `ADD.jsx`, `TempLinks.jsx` | `add.css` | done |  |
| `/admin/questions` | `ADDQ.jsx` | `addq.css` | done |  |
| `/admin/bank` | `Bank.jsx` | `Bank.css` | done |  |
| `/admin/reports` | `QuestionReports.jsx` | inline styles | done | status pill tint was built by string concatenation; given an explicit tint |
| `/admin/stories` | `SuccessStoriesAdmin.jsx` | inline styles | done |  |
| `/admin/email` | `AdminBroadcast.jsx` | `AdminBroadcast.css` | done |  |
| admin gate (sign-in) | `common/AdminGate.jsx` | inline styles | done | already a dark design in both themes; unchanged |

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

## 6. Results (2026-10-17)

**Status:** every page and surface above is `done` or `needs the owner's eye`.
None is left `to do`.

**Colours after.** In the 58 stylesheets: 1,012 uses of generated palette
tokens (327 tokens, `src/theme/palette.css`) plus 154 brand/status colours
used as text, now wrapped as `var(--X-ink, var(--X))`. What is still a literal
is deliberate: 874 colours that already work on navy (saturated brand fills
and the white text on them, dark scrims, coloured glows, campaign palettes)
and 523 `var()` fallbacks that never render; plus 17 left literal on purpose
(the two campaign sections and the allowance banner's white pill, which keep
their look in both themes). In JSX, 95 inline-style colours (admin reports,
success stories, suggestion status chips, chart tooltip, forgot-password, quiz
timer, summaries answer verdict) read the same tokens. The 1,410 colours inside summary-content SVGs are
study material and were not edited.

**Light is unchanged — checked three ways:**

1. **Pixels.** Every page, `main` vs this branch, light theme, phone and
   desktop, identical demo data and frozen clock, with the new toggle hidden:
   84 of 90 screenshots pixel-identical. Of the other 6: `/login` (phone)
   differs from `main` against itself as well (render noise); the other five
   show 0 computed-style differences (below), and their pixel differences are
   rasterisation noise (≤ 1 colour step in a gradient, a shadow's edge). Two
   real regressions this check caught — an admin status pill that lost its
   tint, and a 1/255 alpha shift — were fixed.
2. **Computed styles.** Every element's colour, background, borders, shadow,
   outline, fill, stroke and opacity on all 39 routes, `main` vs branch, light:
   **0 differences**. (The same tool reports 297 differences on `/quizs` when the
   branch is in dark, so it does see changes.)
3. **Palette test.** `src/theme/palette.test.js` checks that every generated
   token's light value is the colour its name carries.

**Dark checks.**

- An audit of every page at both widths: no near-white panels left where they
  are not meant to be; and no text below WCAG AA that is not already below AA
  in light (dark: 93 such spots, light: 822; each dark one is pre-existing in
  light — e.g. white text on the Telegram blue or on light per-section accents
  in the summaries hub).
- Screens reviewed by eye, phone and desktop, including full-length phone
  scrolls of the long pages; screenshots in `docs/dark-mode-screenshots/`.
- The switch, in a real browser: default light; toggle → dark; saved;
  survives reload; set before first paint; bad stored value → light; "follow
  device" follows the device live and on reload; Arabic and English labels;
  toggle present on the app navbar, the landing topbar and the admin navbar.

**Repo checks.** `npm test`: 21/21 pass (9 new theme-helper tests, 3 palette
tests). `npm run build`: passes, prerenders 582 routes, and the prerendered
HTML carries the no-flash script. `npm run lint`: 0 errors; warnings 25 on
`main`, 25 here. No line-ending changes (the 34 CRLF files stay CRLF); no
file had more than a fifth of its lines touched.

## 7. What the owner should check by hand

1. **The Moyasar card form on `/subscribe`, in dark.** Its CDN was blocked
   here, so it never rendered. Expected: Moyasar's light form inside a white
   frame. If it looks wrong, the frame is `.mysr-host` in `Subscribe.css`.
2. **Google sign-in button** on `/login` and `/signup`, in dark (Google's own
   iframe, not loaded here).
3. **Landing page** in dark, top to bottom — the first thing a visitor sees.
4. **Summaries reader**: the deck diagrams on their light backing.
5. **A real quiz** in dark: choose, check, finish, review — and let a timed
   quiz run out once to see the unanswered-questions popup.
6. **The install prompt** (only appears on a real "add to home screen" event).
7. **Admin** in dark, with real numbers in the charts.

## 8. Rule text for `project-rules/SQB.md`

That file is not in this repository, so it could not be edited here. Suggested
replacement for the light-only rule:

> **Themes.** Light is the default and the reference design, and must keep
> rendering exactly as designed. Dark is supported as an opt-in second theme
> (toggle in the navbars; Light / Dark / Follow device on `/account`; stored in
> `localStorage["sqb_theme"]`, applied before first paint). All colour goes
> through tokens: semantic tokens in `src/index.css` have a dark set under
> `:root[data-theme="dark"]`; do not add literal colours for panels, borders or
> body text, and do not add to the generated `src/theme/palette.css` by hand.
> In both themes: panels stay opaque, no glass or blur on panels, finite
> animations, one shared Spinner, quiz answer states never rely on colour
> alone, AA text contrast, no hardcoded text direction, every UI string in
> Arabic and English, user-facing brand only "SQB", exam names and question
> text never translated. Things drawn for a white page (study diagrams, the
> Moyasar form, campaign offer cards) keep their colours on a light backing in
> dark rather than being recoloured.
