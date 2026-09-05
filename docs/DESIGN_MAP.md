# SQB Design Map

> **What this is.** A page-by-page map of every screen in the SQB web app: what
> renders it, which stylesheets it pulls in, what its layout contract is, and
> which known design defects live on it. Written to be the first file a new
> session reads before touching any UI.
>
> **Companion files**
> - `docs/DESIGN_AUDIT_2026-08-25.md` — the defect register: what was wrong, what was changed, how each fix was verified.
> - `docs/CSS_MAP.md` — deep-dive on cross-stylesheet class collisions and the fixes already applied.
> - `docs/DESIGN_UNIFICATION_SUMMARY.md` — **historical only** (so marked at the top of the file). Describes a retired palette (`#01b3d9`); do not take colour values from it.
>
> **Last verified:** 2026-08-25, against `main` @ `0af01c1`, dev server on `:5188`.
> Public routes were measured live in-browser; authed and admin routes were audited
> statically (their API is backed by a hosted production database that this audit
> deliberately did not touch).
>
> **All 22 audit items are fixed.** The per-page **Defects** lines in §2 now read
> as history rather than as an open list — they are kept because they say what
> each page's failure mode *was*, which is the fastest way to recognise it coming
> back. See `DESIGN_AUDIT_2026-08-25.md` for what each item was and how it was
> verified.

---

## 1. How styling works here

Plain global CSS. One stylesheet per component, imported from its `.jsx`
(`import './Foo.css'`). No CSS Modules, no Tailwind, no preprocessor —
`package.json` carries zero styling dependencies.

Three consequences of that. They caused most of the defects in the audit
register, so each one now names the guard rail that keeps it from recurring:

1. **Stylesheets never unload.** Vite injects a component's CSS when its chunk
   first loads and leaves it in the document for the rest of the SPA session.
   Two files defining the same class name resolve by *document order*, which is
   *chunk load order* — so the winner can differ depending on what the user
   clicked first.
   **Mitigation now in place:** `QuizHistory.css` and `FinalExams.css` are scoped
   to their component roots, all ten admin stylesheets to `.admin-page-wrapper`,
   and the `.question-*` family to the page root that renders it. Cross-file
   collisions went from 113 to 29. *Keep new rules inside that scheme.*
2. **`@keyframes` names are a flat global namespace with no specificity.** The
   last-declared definition of a name wins for every element using it, app-wide.
   **Every keyframe is now prefixed with its owner** (`nav-`, `login-`, `qs-`,
   `fe-`, `qh-`, `an-`, `congrats-`, `sug-`), no name is defined twice, and no
   file references another file's keyframe. Grep the name before adding one.
3. **Page-scoped design tokens exist.** `.landing-body`, `.login-body` and
   `.quiz-selection` each locally redefine `--card`, `--text`, `--border`,
   `--shadow`. An unresolvable `var()` makes the whole declaration `unset` at
   computed-value time — that is *no border*, not a default border.
   **`index.css` now defines global defaults** for those names, so a page-scoped
   copy is a refinement rather than a load-bearing requirement.

### Token source of truth — `src/index.css`

| Group | Tokens | Adoption |
|---|---|---|
| Motion | `--transition-props` (the 9 properties a hover/focus state changes), `--transition-fast/normal/slow`, and one global `prefers-reduced-motion` block | Good — `transition: all` is gone (was 93 uses) |
| App bar | `--navbar-h` (72 / 64 / 56 / 52 by breakpoint) | Drives `.navbar`, `.navbar-left` and `.page-with-navbar` together |
| Colour | `--primary-color` `#2563eb`, `--primary-dark` `#1d4ed8`, `--primary-light` / `--accent-light` `#3b82f6`, `--secondary-color` `#16a34a`, `--secondary-dark` `#166534`, `--accent` → `--primary-color` | Partial — ~1,900 hardcoded hexes remain, but every one that failed contrast is gone |
| Text | `--text-dark` `#0f1e3d`, `--text-medium` `#475569`, `--text-light` / `--muted` `#5b6779` | Good — retoned for AA on `--bg`; 201 hardcoded colours now read the tokens |
| Surface | `--bg` `#eef2fb`, `--surface` `#ffffff`, `--surface-2` `#f5f8fd`, `--surface-tint` `#e1eafb`, plus global `--card` / `--text` / `--border` / `--shadow` / `--glass` defaults | Good |
| Elevation | `--shadow-sm/md/lg` (max `rgba(15,23,42,0.16)`) | Good — all 29 black-alpha shadows re-inked to slate |
| Radius | `--radius-sm` 8 / `md` 12 / `lg` 16 / `xl` 24 | Partial |
| Type scale | `--text-xs` … `--text-5xl`, responsive at 768 / 480 | Good |
| Spacing | `--space-1` … `--space-20` | Good |
| Containers | `--container-card` 480 / `-form` 620 / `-page` 860 / `-wide` 1100 | 19 uses. *(A media feature cannot take a custom property, so `@media` widths stay literal.)* |
| Accuracy ramp | `--accuracy-high/mid/low` (+ `-bg`) | 12 uses; the pale dark-theme greens/reds they were meant to replace are gone |
| Z-index | `--z-navbar` 1030, `--z-modal-backdrop` 1040, `--z-modal` 1050, `--z-banner` 1080 | Good — every app-level overlay takes a token; zero raw values |
| Focus | `--focus-ring`, plus a global `:focus-visible` fallback | Good |
| Direction | `--dir-sign` (1 / -1 under `[dir=rtl]`) | Barely used — logical properties cover almost every case; see §3 |

### Typography & direction

- Latin: **Inter** (self-hosted via `@fontsource`, weights 400–900).
- Arabic: **Cairo**, swapped in by `html[lang="ar"] { --font-family-primary: … }`.
- Arabic body line-height is raised to 1.85 (vs 1.6 Latin).
- `dir` is driven by `LanguageProvider` on `<html>`. **Arabic / RTL is the default.**
- The admin section pins LTR via `AdminShell` regardless of site language.

### Breakpoints

The standard scale is **480 / 768 / 1024**. Those three carry 70 of the app's
media queries and are what the navbar, the type scale and `--navbar-h` switch on.
Use them unless a component has a real reason not to.

The other widths in use (380, 400, 520, 560, 600, 680, 720, 800, 860, 880, 900,
1050, 1200, 1400) are component-specific reflow points — the width at which that
one card, table or grid actually runs out of room, and several are legitimate.
The full list and the reasoning sit in `index.css` above the responsive section.
A `min-width: 640px` / `max-width: 639px` pair is **not** drift; that is how you
write two mutually exclusive ranges.

### Shell

`Layout.jsx` wraps every route **except** `/` (landing has its own shell).

```
.page-with-navbar          padding-top = navbar height; min-height:100vh; flex column
├── <Navbar/>              position:fixed; z-index:1030
├── {page}                 flex:1
└── <Footer/>              margin-top:auto   (skipped when hideFooter)
```

All three derive from **one token**, `--navbar-h`, set per breakpoint in
`index.css`:

```css
.navbar          { min-height: var(--navbar-h) }
.navbar-left     { height:     var(--navbar-h) }
.page-with-navbar{ padding-top: calc(var(--navbar-h) + 1px) }  /* +1 = border-bottom */
```

Change the token, never the three rules.

| Viewport | `--navbar-h` | Rendered height | `padding-top` | Overlap |
|---|---|---|---|---|
| default | 72px | 73px | 73px | **0** |
| <= 768px | 64px | 65px | 65px | **0** |
| <= 480px | 56px | 57px | 57px | **0** |
| <= 360px | 52px | 53px | 53px | **0** |
| <= 768 landscape | 56px | 57px | 57px | **0** |

`hideFooter` routes: `/login`, `/signup`, `/signup/:token`, `/join/:token`,
`/subscribe`, `/payment/callback`.

---

## 2. Page inventory

Legend — **Tier:** `pub` public · `auth` signed-in · `admin` admin-only.
CSS is listed in load order. `+shell` = `index.css` + `Navbar.css` + `Footer.css` always present.

### 2.1 Marketing & entry

#### `/` — Landing

- **Tier** pub · **Component** `landing/Landing.jsx` (eager, LCP route) via `App.jsx`
- **CSS** `Landing.css` (~1800) · `InstallShowcase.css` (431) · `Footer.css`
- **Shell** its own — *not* `Layout`. Own topbar + `<Footer/>` in a `min-height:100vh` flex column.
- **Root** `.landing-body` — defines 18 local tokens (`--card`, `--text`, `--pill`, `--border`, `--shadow`, `--accent-*` …)
- **Layout** full-bleed `.hero` at `calc(100svh - 64px)` (svh deliberate — avoids the mobile URL-bar overflow trap), then `.landing-shell` sections capped at 1280px with staggered `nth-of-type` entrance animations.
- **Sections** hero (+ `HeroArt` SVG, `ExamCountdown`) → tracks → explain sample → compare table → value (why-subscribe points, then a `.pricing-cards` row of two equal-weight peer cards — individual `.price-card` and `.price-card-group` — replacing the old subdued group-plan band) → flow → news → `InstallShowcase` → CTA band. The product-tour (`ProductShowcase`) and the standalone "cost of waiting" section were removed 2026-09 — a free account already lets visitors try the real product, and cost-of-waiting duplicated the pricing section's first point verbatim.
- **Responsive** 1024 / 860 / 768 / 600 / 560. The compare table scrolls inside `.compare-scroll` (`min-width:680px`, 560 on mobile) — correctly contained.
- **Verified** no horizontal overflow at 375 / 768 / 1280.
- **Defects** `B2` (pale text on the `ps-*` showcase) — resolved by removing `ProductShowcase` entirely. `D5` (no reduced-motion guard on the section stagger), `A4` (latent — `.pill` is also defined in `Login.css`)

#### `/login` · `/forgot-password`

- **Tier** pub (`hideFooter` on `/login`) · **Component** `login/Login.jsx`, `login/ForgotPassword.jsx`
- **CSS** `Login.css` (749) +shell
- **Root** `.login-body` → `.login-wrapper` (max 480px) → `.login-card`
- **Layout** vertically-centred card; `min-height:100%` + `flex:1` (deliberately *not* 100vh — it sits inside `.page-with-navbar`).
- **Own breakpoints** 640 / 400 — out of step with the 768 / 480 site standard.
- **Defects** **`A2` (Terms/error popup renders under the navbar — verified live)**, **`B1` (card is darker than its own background, plus a 0.35-black 80px shadow — verified live)**, `D1` (32px password toggle, 23px links), `D5` (7 keyframes; a 0.4s staggered form entrance delays interaction), `D6` (`.login-card:hover` lifts the whole form 4px)

#### `/signup` · `/signup/:token` · `/join/:token`

- **Tier** pub, `hideFooter` · **Component** `signup/Signup.jsx`
- **CSS** `Login.css` → `Signup.css` (216) · `TrackModal.css` +shell
- **Root** `.login-body` → `.login-wrapper.signup-wide` (600px) → `.login-card.signup-short`
- **Notes** `/signup/:token` = free admin invite; `/join/:token` = purchased group seat. The track picker is a modal (`TrackModal.css`, z 1050 — above the navbar, correct).
- **Defects** `A2`, `B1`, **`D1` (the terms checkbox is 16×16 — the smallest tap target in the app, on a required control)**

#### `/subscribe` · `/payment/callback`

- **Tier** auth, `hideFooter` · **Component** `subscribe/Subscribe.jsx`, `subscribe/PaymentCallback.jsx`
- **CSS** `Login.css` → `Subscribe.css` (427) +shell
- **Root** `.login-body` → `.login-card.subscribe-card`, `max-width: var(--container-card)`
- **Own breakpoints** 640 / 380
- **Defects** `A2`, `B1`

#### `/groups`

- **Tier** pub (dual-mode: price page for guests, seat manager for owners) · **Component** `groups/GroupsPage.jsx`
- **CSS** `Login.css` → `GroupsPage.css` (325) +shell
- **Root** `.groups-page` — **imports `Login.css` but does not use `.login-body`**, so every `Login.css` rule reading `--card` / `--text` / `--border` / `--shadow` is unresolvable here (see **A4**; currently latent, because this page uses its own `groups-*` classes)
- **Container** `var(--container-page, 860px)` · breakpoint 520
- **Defects** `A4` (latent), `C1` (`.groups-norenew` green at **2.94:1** — the worst contrast measured in the app)

#### `/account`

- **Tier** auth · **Component** `account/AccountPage.jsx` + `quizs/ExamDateCard`, `quizs/StreakCard`, `quizs/GoalCard` (moved here 2026-09, unchanged from their `/quizs` selves)
- **CSS** `Login.css` → `AccountPage.css` (~220) → `quizs/HubCards.css`, `quizs/GoalCard.css` +shell
- **Root** `.account-page` — same `Login.css`-without-`.login-body` situation as `/groups`
- **Container** `var(--container-form, 620px)` · breakpoint 480
- **Sections** Account & subscription (now headed, matching the free-tier card below it) → free-tier meter (if applicable) → Study plan (the three relocated cards) → Actions (Subscribe/Renew, Group, Contact us, Back to quizzes)
- **Defects** `A4` (latent)

### 2.2 Content & legal

#### `/about` · `/privacy` · `/terms` · `/refund-policy`

- **Tier** pub · **Component** `legal/LegalDoc.jsx` wrapper + per-page content
- **CSS** `Legal.css` (201) +shell · **Root** `.legal-page` · **Container** `var(--container-page, 860px)`
- **Structure** bilingual — `.bilingual-ar` (RTL, 1rem, dark) stacked over `.bilingual-en` (LTR, 0.875rem, muted)
- **Defects** `C2` (`.legal-section ul { padding-left }` puts the list indent on the wrong side in RTL; `.contact-*` hardcode `text-align:right`, which reads wrong in English), `D4` (14 `!important`)

#### `/faq`

- **Tier** pub · **Component** `legal/FAQ.jsx` · **CSS** `FAQ.css` (236) +shell
- **Root** `.faq-page` · **Container** `var(--container-wide, 1100px)` · breakpoint 768
- **Defects** `C1` (`.navbar-brand` at 3.62:1), `D1` (`.faq-back` 71×28)

#### `/guides` + 5 article routes

- **Tier** pub · **Component** `guides/GuidesHub.jsx`, `guides/GuideArticle.jsx` + 5 content files
- **CSS** `Guides.css` (156) +shell · **Container** `var(--container-page, 860px)` · breakpoint 768
- **Routes** `/guides/how-to-use-a-question-bank`, `/smle-study-plan`, `/wrong-questions-method`, `/smle-vs-prometric-differences`, `/smle-high-yield-topics`
- **Defects** `B3` (0.3-alpha black card shadow), `D1` (`.guide-cta` 124×29)

#### `/contact`

- **Tier** pub · **Component** `contact/Contact.jsx` · **CSS** `Contact.css` (638) +shell
- **Root** `.contact-container` · **Container** `var(--container-form, 620px)` · breakpoints 768 / 480
- **Notes** carries the clearest comments in the repo about the 100vh-inside-100vh trap — use it as the reference for that pattern.
- **Defects** `C1` (`.info-link` at 4.32:1), `C2` (the select arrow is pinned with `background-position: right` + `padding-right`, so it collides with the text in RTL)

#### `/suggestions`

- **Tier** pub · **Component** `suggestions/Suggestions.jsx` · **CSS** `Suggestions.css` (420) +shell
- **Container** `var(--container-form, 620px)` · breakpoint 600
- **Defects** `C1` (`.category-btn`, `.priority-text` at 4.39:1), `C2` (`.char-counter { text-align:right }`), `D2` (undefined `--priority-color`, fallback-only)

#### `*` — 404

- **Component** `common/NotFound.jsx` · **CSS** `ErrorScreens.css` (151) · **Root** `.errscreen` (shared with `ErrorBoundary`)
- **Defects** `D1` (link row at 26px tall)

### 2.3 Core app (signed-in)

#### `/quizs` — quiz hub

- **Component** `quizs/QUIZS.jsx` + `QuizLauncher`. The exam-date/streak/goal
  cards (`ExamDateCard`, `StreakCard`, `GoalCard`) moved to `/account`
  (2026-09) — they're personal study-plan settings, not part of the hub's own
  job, and duplicated navigation weight right above the panel that matters.
- **CSS** `QUIZS.css` (~920, down from ~1650) · `QuizsHub.css` (hub) ·
  `QuizLauncher.css` (launcher) +shell. `GoalCard.css` / `HubCards.css` no
  longer load here — see `/account`. `QUIZS.css` now holds only what the two
  views share: the `.quiz-selection` root tokens, the bank-empty state and the
  mock-exam modals.
- **Root** `.quiz-selection` (+ `.hubx`) — defines local `--card`, `--card-hover`, `--text`, `--accent-strong`, `--border`, `--shadow`
- **Layout** hub sections (greeting + stat rail, study-loop journey, specialty
  ledger, Telegram strip) capped at 1400px; launcher's four full-screen config
  modals (type / source / timer / question-count)
- **2026-09 hub rebuild** the four specialty ring cards became a row ledger.
  The rings drew *accuracy*, which reads as completion — 8 of 765 obstetrics
  questions answered correctly rendered a full "100%" circle. Rows now carry a
  ten-block coverage meter (discrete blocks because real early coverage is ~1%,
  which a continuous bar draws as an invisible sliver), the raw `answered / pool`
  counts, and accuracy as a labelled number that only takes a good/bad colour
  above `MIN_ACCURACY_SAMPLE` answers. "Weakest specialty" likewise needs a real
  sample now; below it the least-covered specialty is suggested instead. The KPI
  tile strip moved onto the header as a stat rail (plus a questions-remaining
  figure), the Telegram CTA moved out of that grid into its own strip, and the
  journey's three per-step colours (green/blue/purple) collapsed to one accent.
- **Breakpoints** 1024 / 800 / 768 / 600 / 480 / 360
- **Defects** ~~`A2` (all four modals sit at z-index 1000)~~ — **resolved**,
  verified 2026-09: modals read `var(--z-modal-backdrop)`. ~~`A3` (`pulse`
  defined twice; `fadeIn` conflicts)~~ — **resolved**, verified 2026-09: this
  file's keyframes are namespaced `qs-*` with no duplicates. `C2`
  (`.section-title { text-align:right }` hardcoded; `.final-quiz-description
  { border-left }`), `D5` (no reduced-motion guard) remain unverified since
  the 2026-08-25 audit.
- **2026-09 launcher rebuild** `?view=custom` was five surfaces for one
  decision — mode panel, source panel, quick-start button, a row of size
  buttons, then three stacked full-screen modals (specialties → count →
  timer). It is a single form now (`.ql-*`, `QuizLauncher.css`): five chip
  rows, all visible and changeable at once, and a footer that states the quiz
  the button will start. Only the mock-exam modal survives, because it is a
  different activity with its own question-count lookup. Source chips carry
  `completedPct` (from `GET /api/track-content-status`) plus a standing note
  that questions don't repeat until a source is finished. Dropping the three
  modals took ~710 lines of now-dead rules out of `QUIZS.css` and 12 dead keys
  out of `quiz.js`'s launcher block.

#### `/quiz/:numQuestions` — quiz runner

- **Component** `Quiz/QUIZ.jsx` + `Question`, `Result`, `QuizComplete`, `Loading`, `ErrorScreen`, `ReportModal`
- **CSS** `QUIZ.css` (925) · `Loading.css` · `ErrorScreen.css` · `ReportModal.css` · `QuizComplete.css` · `ExplanationPanel.css` · `CongratulationsPopup.css` +shell
- **Layout** timer → `.question-card` (white, 18px radius) → `.options` → nav. The stem and options are pinned `direction:ltr` — exam material always reads LTR regardless of site language. **This is intentional; do not "fix" it.**
- **Breakpoints** 768 / 600 / 480 / 360
- **Defects** **`A1` (`.question-card` / `.question-text` are unscoped here and also defined by 4 other stylesheets)**, `A2` (`.unanswered-popup-overlay` at z 1000), `C2` (`.restart-button { margin-left }`), `D5`

#### `/analysis` — the worst-affected page

- **Component** `analysis/Analysis.jsx` composing **7** sub-components
- **CSS loaded together** `Analysis.css` (343) · `analysisShared.css` (1954) · `QuizHistory.css` (805) · `Progress.css` (397) · `FinalExams.css` (741) +shell
- **Sub-components** `TopicAnalysisTable`, `QuestionAttemptsTable`, `LastQuizSummary` (→ `analysisShared.css`), plus `QuizHistory`, `Progress`, `FinalExams` (own files). `OverallStats` moved to its own `OverallStats.css` (2026-09) — it no longer imports `analysisShared.css` at all, so its cards stopped inheriting that file's dark-glassmorphism styling (near-black translucent fills + blur, tuned for a dark backdrop) that was rendering as washed-out smudges on this page's opaque white shell. Scoped rather than fixed in place, since `.question-card` / `.answer-text.correct` / `.answer-text.wrong` are still legitimately used elsewhere on this page (and on `/wrong-questions`) for real right/wrong indication.
- **Structure** collapsible `.an-drill` sections. A sub-component's CSS loads whether or not its section is expanded.
- **Defects** **`A1` — 49 selectors are defined in 2+ of these three stylesheets, and 44 of them have genuinely different values.** Also `A3` (the `slideDown` collision breaks the navbar's own entrance animation — verified), `B2` (`#4ade80` / `#fca5a5` / `#93c5fd` answer colours), `B4` (`.question-text { max-width:300px; text-align:center }` applied globally), `D4` (32 `!important` in `analysisShared.css`, including `!important` wars across three files' media queries)

#### `/wrong-questions`

- **Component** `analysis/WrongQuestions.jsx` · **CSS** `analysisShared.css` +shell
- **Root** `.wq-*` classes, but it renders `.question-card` / `.question-text` / `.answer-row`
- **Defects** `A1`, `B2`, `B4`

#### `/summaries` · `/summaries/:slug`

- **Component** `summaries/SummariesPage.jsx` + `PathCheckpoint`, `QuestionCard`, `SummaryAnnotation`
- **CSS** `Summaries.css` (1321 — **290 hardcoded hexes, the most in the repo**) +shell
- **Roots** `.summaries-hub` (hub, 1100px) · `.path` (learning-path rail) · `.summary-panel` (full-screen study modal, z 2000)
- **Notes** the best RTL handling in the codebase — uses `border-inline-start`, `unicode-bidi: isolate`, and an explicit `.summaries-hub[dir=rtl]` block. **Use this file as the RTL reference.**
- **Breakpoints** 860 / 768 / 720 / 640 / 639 / 480
- **Defects** `B3` (token adherence), `D3` (6 breakpoints, including the redundant 639/640 pair)

### 2.4 Admin

All admin routes are wrapped by `AdminShell` (pins LTR + English) → `AdminGate` → `AdminLayout`.

- **Shared CSS** `AdminLayout.css` (232) · `Admin.css` (1914) · `ui/ui.css` (125)
- **Shell root** `.admin-page-wrapper` → `.admin-container` (max 1600px); the admin navbar is `z-index: 1000`
- **Theme** driven by five tokens — `--admin-bg`, `--admin-surface`, `--admin-text`, `--admin-border`, `--admin-muted` — that are **never defined anywhere**. All 71 uses render from their inline fallback. See **B5**.

| Route | Component | Extra CSS | Notes |
|---|---|---|---|
| `/admin` | `Admin.jsx` | `Admin.css` | hub + suggestion queue |
| `/admin/growth` | `Growth.jsx` | `Growth.css`, `FunnelPanel` | recharts |
| `/admin/behavior` | `Behavior.jsx` | `Behavior.css`, `EngagementPanel.css` | heatmap |
| `/admin/accounting` | `Accounting.jsx` | `Accounting.css` | `.acc-table` scrolls in its own wrapper — correct |
| `/admin/users` | `ADD.jsx` | `add.css` (1408) | biggest admin screen; uses `.form-input` |
| `/admin/questions` | `ADDQ.jsx` | `addq.css` | |
| `/admin/bank` | `Bank.jsx` | `Bank.css` | renders `.question-card` / `.question-text` → **`A1`** |
| `/admin/reports` | `QuestionReports.jsx` | *(none of its own)* | inherits admin shell styling only |
| `/admin/links` | `TempLinks.jsx` | `add.css` | |
| `/admin/email` | `AdminBroadcast.jsx` | `AdminBroadcast.css` | |

Legacy redirects: `/ADD_ACCOUNT`, `/ADDQ`, `/Bank`, `/TEMP_LINKS`, `/question-reports`.

**Admin defects** `A2` (`add.css`'s `.modal-overlay` at z 1000 ties with the admin navbar), `B5` (undefined theme tokens with drifted fallbacks), `B2` (`#4ade80` status text on pale green)

### 2.5 Global chrome

| Component | CSS | z-index | Notes |
|---|---|---|---|
| `Navbar` | `Navbar.css` (621) | **1030** | fixed; `.user-menu-dropdown` is a local `z-index: 1` (it lives inside the navbar's own stacking context, so a local value is correct — this table previously said 1100/above `--z-modal`, which was stale against the A2 fix already recorded in `DESIGN_AUDIT_2026-08-25.md`). Authed nav-links are just "My Wrong Questions" (2026-09) — Home/Analytics/Study Material/Contact were removed as duplicates of the brand link, the hub's own journey cards, and the footer. The dropdown's "My group" link is now conditional on actually owning a group (`GET /api/groups/mine`), fetched once on mount. |
| `Footer` | `Footer.css` (142) | — | `margin-top:auto`; 1100px cap; breakpoint 640 |
| `CookieConsent` | `CookieConsent.css` | **10000** | mounted at the app root, outside the router |
| `CongratulationsPopup` | `CongratulationsPopup.css` | **10000** | |
| `InstallPrompt` | `InstallPrompt.css` | 1200 | |
| `TrackModal` | `TrackModal.css` | 1050 | correct — above the navbar |
| `NotificationBell` | `NotificationBell.css` | — | |
| `FreeAllowanceBanner` | `FreeAllowanceBanner.css` | — | injected by `RequireAuth` above every authed page |
| `Spinner` | `Spinner.css` | — | the one canonical spinner |
| `ErrorBoundary` / `NotFound` | `ErrorScreens.css` | — | share `.errscreen` |

**The z-index ladder** (`index.css`) — every `position: fixed` overlay must take
its value from here, never a raw number:

dropdown 1000 · sticky 1020 · navbar/fixed 1030 · modal-backdrop 1040 ·
modal 1050 · popover 1060 · tooltip 1070 · **banner 1080** (app-level banners
mounted outside the router — cookie consent, install prompt — which gate the
whole app and so intentionally outrank an open modal).

Anything needing to sit between two rungs gets a named rung here, not an offset.

---

## 3. Keeping this file current

When you change UI, update the affected page block here in the same commit.
Specifically re-check this file when you:

- add or remove a route in `src/main.jsx` → update §2
- add a stylesheet, or a cross-page `import '…css'` → update that page's **CSS** line
- change `.navbar` / `.navbar-left` height → update the §1 shell table
- add a `z-index` → check it against the §2.5 ladder
- add a `@keyframes` → grep the name first; the namespace is global
- define a token on a page root → note it in the page block, and check §1
- fix an audit item → strike it here **and** in `DESIGN_AUDIT_2026-08-25.md`

And four invariants that are now load-bearing — breaking one silently reopens a
whole class of bug:

- **Scoped stylesheets stay scoped.** `QuizHistory.css`, `FinalExams.css` and
  every file under `components/ADD/` carry a banner saying so. A new rule added
  without the root prefix goes back to competing with the rest of the app.
- **Keyframe names stay prefixed.** `@keyframes` has no specificity; the last
  definition of a name wins everywhere. Grep before naming one.
- **`--navbar-h` is the only place the bar's height is written.** Three rules
  read it. Editing any of them directly reintroduces the drift it replaced.
- **`z-index` comes from the ladder in `index.css`.** A raw number is how six
  modals ended up underneath the navbar.
