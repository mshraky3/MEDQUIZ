# SQB Design Audit — 2026-08-25

Full-app review for design bugs, CSS conflicts, responsiveness problems, visual
errors and questionable design decisions — followed by the fixes.
Companion to `docs/DESIGN_MAP.md` (page-by-page map) and `docs/CSS_MAP.md`
(prior collision work).

**Scope** — all 40 routes in `src/main.jsx`, all 54 stylesheets (24,648 lines) and
79 components (19,278 lines).

**Method** — static analysis of the full CSS/JSX corpus, plus live in-browser
measurement of every public route at 340 / 375 / 800 / 1440px in Arabic (RTL, the
default) and English. Authed and admin routes were audited statically only: the
dev API points at a **hosted production database**, and this audit deliberately
did not sign in, create accounts, or write to it.

**Status: all 22 items resolved.** Verification for each is recorded inline.
`npm run build` passes with zero CSS warnings; `npm run lint` reports 0 errors.

---

## Results at a glance

| Measure | Before | After |
|---|---:|---:|
| Selectors defined in 2+ stylesheets | 113 | **29** |
| Conflicting rules across the three `/analysis` stylesheets | 44 | **0** |
| `@keyframes` names defined in more than one file | 5 names / 18 files | **0** |
| Animations referenced but never defined | 2 | **0** |
| Full-screen overlays rendering *under* the navbar | 6 | **0** |
| Raw app-level `z-index` values (not from the token ladder) | 16 | **0** |
| Page content hidden behind the fixed navbar | 1px, every breakpoint | **0** |
| Dark-theme text colours on light surfaces | 39 | **0** |
| Black-alpha shadows ≥ 0.25 | 29 | **0** |
| Admin theme tokens defined / drifted fallbacks | 0 / 71 | **5 / 0** |
| WCAG AA text-contrast failures (14 routes × 4 viewports, measured live) | 30+ | **0** |
| `transition: all` | 93 | **0** |
| Stylesheets animating with no reduced-motion guard | 19 | **0** |
| `!important` in the three `/analysis` stylesheets | 42 | **6** (documented) |
| Horizontal overflow on any public route | 0 | **0** |

---

## Severity A — structural CSS conflicts

### `[x]` A1 — 44 selectors collided with different values on `/analysis`

**Was:** `Analysis.jsx` renders seven sub-components on one page, so
`analysisShared.css`, `QuizHistory.css` and `FinalExams.css` are all live at
once. 49 selectors were defined in 2+ of them; **44 had genuinely different
values** — `.question-card` was `var(--bg-light)` (the same colour as the page,
so the card was invisible) in one file and a blurred tinted panel in another;
`.result-badge.correct` was **blue** in one definition and pale green in
another; `.pagination-btn` was an outlined ghost button in one and a solid blue
gradient in the other. The last-loaded file styled all three widgets.

`.question-card` / `.question-text` leaked further still — also defined unscoped
in `Quiz/QUIZ.css` and `ADD/Bank.css`, and rendered by 9 components across
`/quiz/:n`, `/analysis`, `/wrong-questions` and `/admin/bank`.

**Fixed:** every rule in `QuizHistory.css` and `FinalExams.css` is now scoped to
its component's own root (`:is(.quiz-history-container, .quiz-history-loading,
.quiz-history-error)` and `.final-exams-container`), and the `.question-*` family
in `QUIZ.css`, `Bank.css` and `analysisShared.css` is scoped to the page root
that renders it. Scoping adds one class uniformly, so each file's internal
cascade order is unchanged — only the cross-file reach is removed.

Also removed while in there: `analysisShared.css`'s `.stat-label` / `.stat-value`
(no component that imports the file renders either class — the real consumers are
`Progress.jsx` and `FinalExams.jsx`, each with its own definition), and the
orphaned `.modal-overlay` / `.modal-content` mobile overrides left behind by an
earlier partial removal, which were still reaching `index.css`'s global modal.

This completes the item `CSS_MAP.md` left open, which had measured 21 differences
between two of the files and never cross-checked the third.

**Verified:** three-way diff re-run → 0 shared selectors, 0 conflicts. Build clean.

### `[x]` A2 — six full-screen modals rendered *underneath* the fixed navbar

**Was:** `Navbar` is `position: fixed; z-index: 1030`, there are no portals, and
six full-viewport overlays sat at `z-index: 1000`: `.popup-overlay`
(login/signup/forgot-password/subscribe/payment-callback), four `/quizs` config
modals, `.unanswered-popup-overlay` on `/quiz/:n`, and the admin modal in
`add.css`. The dim backdrop did not cover the navbar and its links stayed
clickable through an supposedly-blocking modal.

**Fixed:** every overlay now takes `var(--z-modal-backdrop)`. The ladder in
`index.css` gained a `--z-banner` rung (1080) for the app-level banners mounted
outside the router, and the arbitrary values elsewhere (10000 ×2, 2000, 1200,
1100) were mapped onto it. The navbar's user dropdown, which sat at 1100 —
*above* `--z-modal` — turned out to live inside the navbar's own stacking
context, so its value never meant what it looked like; it is now a local `1`.

**Verified live** on `/login` at 375px and 1440px: overlay computes to 1040,
`document.elementFromPoint()` inside the navbar band returns the overlay.
Zero raw app-level `z-index` values remain in the codebase.

### `[x]` A3 — colliding `@keyframes` names silently swapped animations

**Was:** `@keyframes` is a flat global namespace with no specificity — the last
declaration of a name wins for every element using it, app-wide. `fadeIn` was
defined in 7 files with 4 different bodies; `pulse` in 4 (twice inside
`QUIZS.css` alone); `slideDown` in 3; plus `float` and `shimmer`.

The sharpest case was verified in the browser: `.navbar` uses
`animation: slideDown` for its entrance, and on `/analysis` `FinalExams.css`
loads after `Navbar.css` — so the navbar ran FinalExams' accordion animation
instead, computing `max-height: 0px; opacity: 0`. The bar collapsed and vanished
during its own entrance.

**Fixed:** every colliding name is namespaced to its owner (`nav-slide-down`,
`fe-accordion`, `qh-slide-down`, `login-fade-in`, `congrats-pulse`, …). Six
`@keyframes` blocks that nothing referenced anywhere were deleted. Two dangling
references were repaired: `QuizHistory.css` animated with `modalSlideIn`, which
was **defined nowhere in the repo** (so the modal had no entrance at all), and
`TrackModal.css` deliberately borrowed `scaleIn` from `Login.css` — both now own
their keyframes.

**Verified:** 0 names defined in more than one file, 0 undefined references,
0 cross-file references.

### `[x]` A4 — page-scoped tokens read by pages that don't define them

**Was:** `.landing-body`, `.login-body` and `.quiz-selection` each defined
`--card`, `--text`, `--border`, `--shadow`, `--glass`, `--pill-bg` locally with
different values, and nothing defined them globally. An unresolvable `var()`
does not fall back — it makes the whole declaration `unset` at computed-value
time, so a missing `--border` inside `border: 1px solid var(--border)` is *no
border*, and a missing `--card` is a transparent card. `/groups` and `/account`
import `Login.css` but render under their own roots; `.pill`, `.form-input` and
`.form-label` were defined by both `Login.css` and other stylesheets.

**Fixed:** two ways, deliberately.
1. `Login.css`'s four generic class names were renamed to `.login-pill`,
   `.login-input`, `.login-label`, `.login-field`, and the five consuming JSX
   files updated — so they can no longer collide with `index.css`, `add.css`,
   `Contact.css` or the landing page's own `.pill`.
2. `index.css` now defines global defaults for `--card`, `--text`, `--border`,
   `--shadow`, `--glass`, turning every page-scoped copy into a deliberate
   refinement rather than a load-bearing requirement.

**Verified live:** `/login`, `/signup` and `/forgot-password` render fully
styled with the new class names and zero stale generic classes; `.landing-body`
and `.login-body` still resolve their own local token values over the defaults.

---

## Severity B — visible visual defects

### `[x]` B1 — the auth card was darker than the page behind it

**Was** (computed live on `/login`): card background `rgba(0,0,0,0.04)` — a grey
wash *darker* than its own light backdrop — under a `0 25px 80px rgba(0,0,0,0.35)`
shadow. Inverted elevation, held together only by a heavy black halo, on
`/login`, `/signup`, `/forgot-password`, `/subscribe` and `/payment/callback`.

**Fixed:** `.login-body` now maps `--card` to `var(--surface)` and `--shadow` to
`var(--shadow-lg)`.
**Verified live:** card computes to `rgb(255,255,255)` with
`rgba(15,23,42,0.16) 0 14px 36px`.

### `[x]` B2 — 25 pale dark-theme accent colours on light surfaces

`.answer-label.correct` was `#4ade80` (~1.7:1 on white) in three files;
`.answer-text.wrong` `#fca5a5` on a red tint (~1.9:1); `.goalx-of` `#cbd5e1`
(~1.5:1, effectively invisible); plus the admin status badges and success states.

**Fixed:** 39 `color:` declarations remapped to the tokens that actually pass AA
on a light surface (`--secondary-dark`, `--error-color`, `--primary-dark`,
`--text-light`). Only `border-color` uses of those hexes remain, which is correct.

### `[x]` B3 — 29 black-alpha shadows across 16 files

`rgba(0,0,0,0.25…0.5)` produces a grey halo on a light background;
`Contact.css` and `Legal.css` already carried comments saying this was fixed
*there*, so the migration had been started and abandoned.

**Fixed:** 26 shadows re-inked to the app's slate (`rgba(15,23,42,…)`) with the
alpha scaled onto the design system's ramp, keeping each element's shadow
geometry so nothing shifts. 3 modal dimmers aligned to the canonical
`rgba(15,23,42,0.45)` from `index.css`. The only remaining matches are the two
historical notes in comments.

### `[x]` B4 — a global rule clamped question text to 300px and centred it

`analysisShared.css` had an unscoped
`.question-text { max-width: 300px; text-align: center }`. Every `.question-text`
its own components render is inside a `.question-card`, and the later
`.question-card .question-text` rule restored the width — so the rule did nothing
for its own page and existed only to leak onto every *other* page with a
`.question-text`, clamping quiz stems to 300px and centring them.

**Fixed:** removed. While there, the sibling `.questions-grid` was changed from
`minmax(420px, 1fr)` to `minmax(min(420px, 100%), 1fr)` — a bare minimum wider
than its container overflows rather than shrinking.

### `[x]` B5 — the admin theme's five tokens were never defined

`--admin-bg`, `--admin-surface`, `--admin-text`, `--admin-border`,
`--admin-muted` were read 71 times and **defined nowhere**, so every use rendered
from its own inline fallback — and the fallbacks had drifted: `--admin-muted`
appeared as `#64748b` ×26, `#94a3b8` ×2 and `#475569` ×1; `--admin-border` as
`#e2e8f0` ×15, `#f1f5f9` and `#cbd5e1`. Admin muted text rendered in three
different greys, borders in three more.

**Fixed:** all five defined on `.admin-page-wrapper` in `AdminLayout.css`, mapped
onto the global palette, and all 71 inline fallbacks stripped.

### `[x]` B6 — 1px of every page sat under the navbar, at every breakpoint

**Was** (measured): navbar rendered 57px against a 56px page offset at 375px,
65 vs 64 at 768px, and so on — because `.navbar`'s `min-height`, `.navbar-left`'s
`height` and `.page-with-navbar`'s `padding-top` were three hand-maintained
numbers and the bar also carries a 1px border. Worse, `Navbar.css` held **two
competing sets** of `padding-top` rules (56/52/48 and 64/56/52); the correct set
won only because it appeared later in the file, so reordering would have shifted
every page 8px under the bar.

**Fixed:** all three now derive from one `--navbar-h` token (72/64/56/52 by
breakpoint, plus landscape), with the page offset as
`calc(var(--navbar-h) + 1px)`. The stale duplicate block and the per-breakpoint
height overrides are gone.
**Verified live:** overlap is exactly 0 at 340, 375, 800 and 1440px.

---

## Severity C — accessibility & internationalisation

### `[x]` C1 — muted and accent text failed WCAG AA

Measured against real rendered backgrounds, the worst were `.groups-norenew` at
**2.94:1**, `.navbar-brand` at 3.62:1, `.link-primary` at 3.68:1, and the default
muted colour `--text-light` at 4.24–4.47:1 — a systemic near-miss on every page,
because `#64748b` clears 4.5:1 on white but not on this app's actual `--bg`.

**Fixed at the tokens, not case by case:**
- `--text-light` `#64748b` → `#5b6779` (5.08:1 on `--bg`, 5.74:1 on white), and
  201 hardcoded `color:` declarations pointed at the token so it propagates.
- `--accent` now resolves to `--primary-color` rather than `--accent-light` —
  it is read as a *text* colour in 21 places where `#3b82f6` measured 3.68:1.
  `--accent-light` remains available for the fills and focus borders that want it.
- `--secondary-dark` `#15803d` → `#166534`, for green text sitting on its own tint.
- Per-element: `.navbar-brand`, `.groups-pill`, `.groups-norenew`,
  `.suggestions-subtitle`, the ProductShowcase tags.

**Verified live: 0 contrast failures** across 14 public routes at 340 / 375 /
800 / 1440px, in both languages.

### `[x]` C2 — RTL breakage from physical CSS properties

Arabic/RTL is the **default** language, so these were wrong for most users:
`.section-title { text-align: right }` hardcoded, list indents via
`padding-left`, accent bars via `border-left`, gaps via `margin-right` /
`margin-left`, and `text-align: right` where `end` was meant.

**Fixed:** converted to `padding-inline-start`, `border-inline-start`,
`margin-inline-*` and `text-align: start|end`. `Contact.css`'s select chevron —
pinned to the right with matching right-hand padding, so in RTL the arrow
overlapped the text while the clearance sat on the empty side — now uses
`padding-inline-end` plus an explicit `[dir="rtl"]` override, and lost the
`#22d3ee` cyan from a retired palette.

Two follow-on findings, both removed rather than corrected:
- `Legal.css`'s `.bilingual-*` and `.contact-*` rules (81 lines) were **dead** —
  `LegalDoc.jsx` renders those pages from structured copy and emits only
  `h3/ul/li/p/strong/a`. They held 8 of the file's 14 `!important` and five
  hardcoded `text-align` values. `Legal.css` now has zero of either.
- `QUIZS.css`'s `.section-title` was rendered by nothing in `quizs/`. The only
  consumer of the bare class is `Progress.jsx` on `/analysis`, which has its own
  definition — so the rule's entire effect was to right-align and uppercase
  another page's headings for anyone who reached `/analysis` after `/quizs`.

Deliberately **not** changed: `QUIZ.css` and `Summaries.css` pin exam material
LTR on purpose, and both say so.

### `[x]` C3 — tap targets below the 44px minimum

The signup terms checkbox was **16×16** — the smallest target in the product, on
the control that gates account creation. The navbar back button was 34×34, the
brand 32×30, the language toggle 32px tall, the password reveal 32×32.

**Fixed:** the checkbox is 22px inside a 44px-minimum row; the navbar brand and
language toggle take `min-height: 44px`; the password toggle 44×44; and the
circular back button keeps its drawn size while an `::after` expands the hit area
to `max(100%, 44px)` — growing the button itself would have reflowed a 52px bar.
**Verified live** via `elementFromPoint` probing: all four measure 44×44 of
actual hit area at 340px width.

---

## Severity D — consistency & maintainability

### `[x]` D1 — `--container-*` tokens adopted by only 9 rules
Now 19. Every hardcoded `max-width` that already equalled a token's value
(480/620/860/1100) points at the token. *(Note: media features cannot take a
custom property, so `@media (max-width: 480px)` stays literal — see D2.)*

### `[x]` D2 — 24 different breakpoints
The standard scale (**480 / 768 / 1024**, carrying 70 of the app's media
queries) is now documented in `index.css`, together with the list of
component-specific reflow points and why several of them are legitimate — a
680px table and a 1400px dashboard do not reflow where a phone does. Forcing all
24 to three values would change layout at many widths on pages that cannot be
visually verified from here, so the convention is documented rather than imposed.

One correction to the original finding: the `min-width: 640px` / `max-width: 639px`
pair in `Summaries.css` is **not** drift — that is the correct way to write two
mutually exclusive ranges with no overlap at the boundary. It is left alone and
called out in the note.

### `[x]` D3 — `!important` wars in the analysis responsive rules
42 → 6. Each declaration was classified by whether any later rule with an
overlapping media range would beat it; the 38 that were provably redundant
(their reason for existing was the cross-file fight A1 ended) were removed.
The 6 that remain are load-bearing for a different reason: this file's media
blocks are not ordered broad-to-narrow — `@media (max-width: 768px)` sits *after*
the 480 and 360 blocks — so removing them would change what renders. That is
documented in place, with the reorder named as the real fix and why it needs
visual confirmation on a populated account first.

### `[x]` D4 — 19 stylesheets animated with no reduced-motion guard
One global block in `index.css` now covers all of them. It collapses durations
rather than setting `animation: none`, because killing an animation outright
leaves any element whose start state is `opacity: 0` — every fade-in-up in the
app — invisible forever.
**Verified:** the test browser reports `prefers-reduced-motion: reduce` and
computed durations collapse to 1e-05s.

### `[x]` D5 — 93 uses of `transition: all`
All 93 replaced with `transition-property: var(--transition-props)` plus explicit
duration and timing. The new token names the nine properties a hover/focus state
actually changes, so layout properties no longer tween.
*(A first pass used the `transition` shorthand with the comma-separated list —
which is wrong, because a comma in the shorthand starts a new transition and only
the last property would have received a duration. Caught and converted to
longhands; verified every rule has a declared duration and timing.)*

### `[x]` D6 — questionable interaction choices
- `.login-card:hover` lifted the entire login form 4px as the cursor crossed it — removed.
- `.login-form` was staggered 0.4s behind the card with `both` fill, so the fields were invisible for 400ms and unsettled for a full second on the sign-in path — now arrives with the card.
- `.question-card:hover` in a dense grid combined a 4px lift with a `0 20px 60px` 40%-alpha shadow that shoved a dark halo over neighbouring cards — now border and elevation only.
- `index.css`'s `.card:hover` promised "this whole surface is clickable" of every card — the lift is now opt-in via `a.card` / `button.card` / `.card--interactive`.

### `[x]` D7 — stale documentation
`DESIGN_UNIFICATION_SUMMARY.md` documented a retired palette (`#01b3d9`) and is
now marked **HISTORICAL** at the top, pointing at the three current documents.

### `[x]` D8 — minor cleanups
`.screen-title`'s duplicated `margin-bottom` / `font-weight` removed. And the
`QuestionReports.jsx` question turned out to be a real bug rather than a style
nit: `/admin/reports` was **the last page still painted in the retired dark
theme** — a `#0b1021` navy panel with `#e2e8f0` text, mounted inside the white
admin shell, built entirely from inline styles so no stylesheet existed to fix.
Its whole palette is remapped onto the light admin theme.

*(The remaining duplicate declaration, `.hero`'s doubled `min-height`, is
deliberate — a `vh` fallback under an `svh` progressive enhancement — and is
documented in place.)*

---

## Deliberately left open

Two things are recorded rather than done, both for the same reason — they change
what renders on pages this session could not open, and guessing is worse than
documenting:

1. **The `/analysis` media-block order** (see D3). Six `!important` declarations
   are holding it together. Reordering the blocks broad-to-narrow is the real
   fix and needs a populated account at each breakpoint to confirm.
2. **Visual confirmation of the authed and admin pages.** `/quizs`, `/quiz/:n`,
   `/analysis`, `/wrong-questions`, `/summaries`, `/account` and the ten admin
   routes were fixed from static analysis and verified by build, by
   selector-collision measurement, and by rendering their markup patterns in the
   browser — but not by looking at the real pages with real data, because the dev
   API is backed by the production database. **A1 and A3 in particular are worth
   a visual pass** on a real account before the next release.

29 cross-file selector collisions also remain (down from 113). They are all
within a single section — mostly `add.css`/`Admin.css`/`Bank.css`, which
`CSS_MAP.md` records as already reconciled where it mattered — plus a short tail
(`.btn`, `.loading-spinner`, `.retry-button`, `.restart-button`, `.quiz-result`)
that spans pages a user can reach in one session. Worth a follow-up pass; none of
them were in this audit's findings.

---

## What was already good

Preserved, and used as the model for the fixes:

- `src/index.css` is a genuinely well-built token layer with its reasoning
  written down. Most of the work above was "use what is already defined".
- **No horizontal overflow** on any public route at any viewport — before or
  after. Wide tables correctly scroll inside their own wrappers.
- The `100vh`-inside-`100vh` trap has been found and fixed app-wide, with the
  reasoning documented at each site.
- Landing's hero correctly uses `100svh` for mobile URL-bar behaviour.
- `Summaries.css` is the RTL reference implementation — logical properties,
  `unicode-bidi: isolate`, explicit `[dir=rtl]` handling.
- Self-hosted fonts with unicode-range splitting, a real Arabic face, and a
  raised Arabic line-height.
- A single canonical `Spinner`, a global `:focus-visible` ring, and route-level
  code splitting.

---

## Addendum — runtime error triage (not part of the design audit)

A production `500` on `POST /quiz-sessions` (2026-08-25 10:52, user 338, a
10-question nursing quiz) was reported separately and triaged in the same
session. It is recorded here because the trail is otherwise easy to lose.

**Root cause: not determined, and deliberately not guessed at.** The commit
before this one (`698ba07`) had already guarded the post-INSERT bookkeeping, so
the failure is the session INSERT itself. Ruled out from the repo: the
`check_valid_quiz_source` CHECK (all five bank sources are in the list), the
`source VARCHAR(50)` limit, and the numeric column types against the reported
payload. Not verifiable without the live schema or the server log, and this
session did not query the production database.

**Why nobody could tell.** Two gaps, both now closed:

1. `logger.error` logged only `error.stack`. A node-postgres error carries
   `code`, `constraint`, `column`, `detail`, `table` and `routine` as own
   properties, none of which appear in the stack — so a check-constraint
   violation logged with no constraint name, and `value too long for type
   character varying(50)` logged with no column name. It now prints them.
2. The handler catches its own error and answers 500 directly, so it never
   reached the global error middleware and `notifyBackendError` was never
   called. There was no server-side alert at all; the only reason this surfaced
   was the browser reporting the opaque 500 through `/error-report`, which by
   definition cannot see the cause. It now alerts — with the transient-connection
   filter the last pass introduced, so this cannot re-feed the alert flood — and
   logs the submitted payload alongside the derived `source`.

**Fixed regardless of cause.** Three things were wrong independently of which
error it was:

- The INSERT had no retry, against the failure mode this codebase already names
  as its routine transient fault (Neon recycling pooled connections — ~58 of the
  ~105 alerts the last pass triaged). It now retries once, and it is not a blind
  retry: a connection can die *after* the INSERT commits, so on a transient error
  it looks for the row first and only re-inserts if it genuinely is not there.
- `QUIZ.jsx` called `setDataSent(true)` **before** the POST, using it as the
  don't-submit-twice latch. So the first failure was permanent: the catch logged
  to console, `dataSent` stayed true, and the effect's own guard meant the
  finished quiz could never be sent again. The student saw a normal results
  screen for a quiz the server never recorded. The latch is now a ref;
  `dataSent` means "the server acknowledged this", nothing weaker.
- The session POST had no retry of its own, while the *derived* attempt and
  topic-analysis calls beside it did. It now retries three times with backoff,
  skipping 4xx (a refusal, not a flaky call), and tells the server when it is
  retrying so a submission that already landed is recognised rather than written
  twice. The same guard was added to `/final-quiz/submit`, which the same client
  helper submits — without it, a retried mock exam would have become a second
  result in the student's history.

Verified with 23 unit tests over both retry paths (happy path, transient drop
that did not land, transient drop that DID land, hard fault, 4xx, exhaustion).

### The systemic version — now closed

The survey found **141 places that answer a request with a 500, and 3 that told
anyone.** Rewriting 138 response bodies would have risked changing what clients
receive, so the fix hooks the *response* instead: `alertOn5xx`
(`backend/utils/observability.js`), mounted before every router, fires exactly
one alert for any 5xx — from a handler's own `res.status(500)`, from a route
file, or from Express itself. That covers all 141 sites and every handler
written in future, without touching a single response shape.

Supporting changes:

- **`logger` and `isTransientConnectionError` moved into one shared module.**
  They were defined in `app.js` while `routes/*.js` used bare `console.error`,
  so route-level database failures logged without the Postgres
  code/constraint/column too. All 15 route and middleware files now use the
  shared logger — a logging-only change; no response was touched.
- **`logger.error` records the Error into an `AsyncLocalStorage` request
  context**, so the alert carries the real cause (constraint name, column) and
  not just the handler's client-facing message.
- **The global error handler no longer notifies.** Its comment claimed "Send
  error notification for 500+ errors"; the code mailed for *every* error that
  reached it, deliberate 4xx included — `PaymentDisabledError`, "Payment not
  found.", any throw with an explicit 4xx status. Those are refusals, not
  faults, and each one spent a slot from the shared 12/hour budget. `alertOn5xx`
  fires only on >= 500.

### Why widening alerting does not re-create the flood

The premise "if there are no errors there will be no flood" does not hold on its
own: the majority of the last flood was Neon recycling pooled connections, which
is infrastructure behaviour, not a bug anyone can fix. The classification is what
prevents it, and it is now four-deep:

1. Transient connection faults are logged and never mailed.
2. In-memory: 20/hour per process, 5-minute cooldown per key.
3. Database-backed (survives cold starts, spans instances): one mail per
   distinct `errorType_endpoint_status` per hour, global ceiling 12/hour.
4. The mail gateway's `idempotencyKey` collapses same-key repeats within an hour.

**Two real holes in that were found and closed while checking it:**

- **The database-backed throttle failed OPEN.** It stores its counters in
  Postgres, so when Postgres is what is broken the throttle query fails too —
  and it then sent every alert. That was survivable when 3 places could alert;
  with all 141 reporting it is the exact flood scenario. It now falls back to a
  tight per-process budget (3/hour) instead of unlimited.
- **The throttle never ensured its own table existed.** `rate_limit_hits` was
  created lazily by `middleware/rateLimit.js` on the first request to a
  rate-limited route, so on a fresh database the first errors could bypass
  throttling entirely. `configureAlertThrottle` now ensures it at boot.

Measured on a real Express app with the middleware in place:

| Scenario | Failing requests | Emails |
|---|---:|---:|
| One endpoint failing repeatedly | 200 | **1** |
| Broad outage across 40 endpoints | 1,000 | **12** (the global ceiling) |
| Database down — throttle unreachable too | 1,000 | **3** (degraded budget) |

18 tests cover it: 13 on the interceptor (2xx/4xx do not alert, 500 alerts once
with its pg fields, a 500 with no Error still alerts, transient faults are not
mailed, a thrown error alerts once rather than twice via the global handler, a
deliberate 4xx throw does not alert) and 5 on the flood behaviour above.

### Bug hunt alongside it

Scanned for the classic 500 sources; the backend came out clean:

| Checked | Result |
|---|---|
| `.rows[0].x` dereferenced with no emptiness guard | 37 flagged, **all false positives** — aggregates, `INSERT … RETURNING`, or guarded just outside the scan window |
| Pool clients acquired without a `finally { release() }` | 11 acquisitions, **all released correctly** |
| `JSON.parse` with no try/catch | **0** |
| `parseInt`/`Number` from a request reaching a query unvalidated (the `NaN` → `invalid input syntax for type integer` 500) | **0** |
| `process.on('unhandledRejection')` / `uncaughtException` | already correct — transient filtered, does not exit on rejection |

The one real defect found by the sweep was the global error handler mailing on
deliberate 4xx, described above.