# CSS Map

## Architecture

Plain global CSS, one stylesheet per component, imported directly from its `.jsx`
file (`import './Foo.css'`). No CSS Modules, no Tailwind, no styled-components,
no PostCSS/Sass — `package.json` carries zero styling dependencies. Vite injects
each imported stylesheet's chunk when the component that imports it first loads,
and **never removes it on route change** — once loaded, a stylesheet's rules stay
live in the document for the rest of the SPA session, regardless of which page is
currently showing.

This has one direct consequence worth internalizing before touching any of these
files: **two components that define the same class name are only ever safe if
both definitions are identical, or if the two components never render at the
same time on any page a user can reach without a full reload.** Two different
values for the same selector, loaded in the same session, resolve by
document order — which is chunk load order, not import order in the source —
so the "winner" can differ between users depending on what they clicked before
landing on the page in question. That is the shape of every bug fixed below.

Shared tokens live only in `src/index.css` (`:root` — colors, `--shadow-*`,
`--radius-*`, fonts, `--text-*`, `--space-*`, transitions, z-index, and as of
this pass `--container-*` / `--page-pad-*` / `--dir-sign`). Page-scoped token
overrides exist on a few root classes — `.login-body`, `.landing-body`,
`.quiz-selection` — each redefining `--border`, `--card`, `--shadow`,
`--accent-strong` locally; consumers outside those roots (e.g. `.btn.primary`,
used by `/groups` and `/account` via a shared import of `Login.css`) carry
literal fallbacks specifically so an unresolved page-scoped var doesn't render
an invisible control.

## Fixed this pass

### `ADD/add.css` ⟷ `ADD/Admin.css`

`ADD.jsx` and `TempLinks.jsx` are the only components that import **both**
files, so any class both define is a live, load-order-dependent collision on
`/admin/users` and `/admin/links`. Resolved by checking, for every shared
top-level selector, which file's consuming component actually renders that
class name (`className="..."` search across every admin `.jsx`, word-boundary
matched so `admin-chart-card` doesn't count as a hit for `chart-card`):

| Class | Verdict | Fix |
|---|---|---|
| `.chart-card` (+ `h3`/`:hover`/`.wide`) | Dead in both — no `.jsx` anywhere renders it (`ChartCard.jsx`, the real shared component, renders `.admin-chart-card`) | Deleted from both files |
| `.stat-icon`, `.stat-info` | Dead in both | Deleted from both files |
| `.login-time`, `.suspicious-badge` | Only `Admin.jsx` renders these; `add.css`'s copies were unused by `add.css`'s own consumers | Deleted `add.css`'s copies |
| `.stat-label`, `.no-data`, `.suspicious-stats` | Only `ADD.jsx`/`TempLinks.jsx` render these; `Admin.css`'s copies were unused by `Admin.css`'s own real consumers (`Admin.jsx`, `Growth.jsx`, `Behavior.jsx`) | Deleted `Admin.css`'s copies. `.no-data` shared a selector with `.loading-message`, which `TempLinks.jsx` *does* use from `Admin.css` — split the rule rather than deleting it whole |
| `.status` (bare, + `.active`/`.inactive`) | Both real, both rendered by `TempLinks.jsx` (the only consumer of either) — but `Admin.css`'s colour pair (`#4ade80`/`#f87171` on 30%-alpha green/red) is the same dark-theme-leftover pattern already fixed in `Login.css`'s `.alert-box.error`: a light/bright pair meant for a dark background, rendering on TempLinks' white page | Deleted `Admin.css`'s copy; kept `add.css`'s light-theme-correct pastel pair (`#155724`/`#721c24` on `#d4edda`/`#f8d7da`) |
| `.status-badge` (+ `.active`/`.inactive`) | Genuinely two different intended widgets: `Admin.jsx`'s suggestion-status pill (structural only, colours via inline `style`) vs. `ADD.jsx`'s user-active pill (needs the `.active`/`.inactive` colour modifiers, which only ever existed in `add.css`) | Renamed `ADD.jsx`'s to `.user-status-badge`; `Admin.jsx`'s `.status-badge` in `Admin.css` is untouched |
| `.admin-page-wrapper`, `.form-group` | Byte-identical in both files | Left as-is — harmless, not a bug |
| `.admin-header` (+ `h1`/`p`) | **Not actually a collision** — `add.css`'s copy is nested inside `@media (max-width: 768px)` as a mobile refinement of `Admin.css`'s base rule (which `TempLinks.jsx` needs for its `<h1>`/`<p>` children), not a competing base definition | Left both — they're complementary |

Verified against a live database: `/admin/users`'s `.user-status-badge` renders
the intended pill; `/admin`'s `.status-badge` still renders the intended
suggestion-pill (structural rule unchanged); `/admin/links`'s `.status.inactive`
now renders the readable pastel pair (confirmed `rgb(248,215,218)` bg /
`rgb(114,28,36)` text, not the translucent dark-theme pair) and its `.admin-header`
still centers with the 40px `<h1>`.

### `login/Login.css` — the `.form-group`/`.form-label` margin bleed

`index.css` also defines `.form-group { margin-bottom: var(--space-4) }` and
`.form-label { margin-bottom: var(--space-2) }`; `Login.css`'s own versions
never reset `margin-bottom`, so the real gap between two login fields was
16px of inherited margin **plus** `.login-form`'s own 14px flex gap — 30px
that neither file stated. Fixed by making the value explicit in `Login.css`
rather than removing it (it's the spacing the redesigned page already reads
correctly at): `.form-group { margin-bottom: var(--space-4) }` now appears in
`Login.css` itself, so the total no longer depends on which file's rule the
browser happens to have loaded.

`ADD/add.css` and `ADD/Admin.css`'s own `.form-group` rules already stated
`margin-bottom: 20px` explicitly in both — not a case of this bug, and
identical between the two files besides.

## Documented, not yet fixed

### `analysis/FinalExams.css` ⟷ `analysis/QuizHistory.css`

`Analysis.jsx` renders both `<QuizHistory>` and `<FinalExams>` on the same
`/analysis` page (as sibling `CollapsibleSection`s — collapsed by default, but
both components' CSS is loaded regardless of which section is expanded), so
this is the same class of live collision as `add.css`/`Admin.css` above, at
larger scale: **35 top-level class names are defined in both files**, of which
**21 have genuinely different rule bodies**:

```
.question-actions   .question-card      .question-content   .question-meta
.question-text      .see-more-button    .type-badge          .detail-item
.detail-label        .detail-value       .pagination-btn      .pagination-info
.retry-button        .session-header     .session-info        .session-date
.session-actions     .session-details    .session-expanded-content
.view-details-btn   .question-number
```

8 more collide but are byte-identical (harmless): `.answer-label`, `.answer-row`,
`.answer-text`, `.answers-section`, `.question-header`, `.questions-grid`,
`.result-badge`, `.question-card-inner`. `analysisShared.css` (imported by
several other analysis sub-components rendered on the same page —
`OverallStats.jsx`, `WrongQuestions.jsx`, `TopicAnalysisTable.jsx`,
`QuestionAttemptsTable.jsx`, `LastQuizSummary.jsx`) overlaps both files by a
further 21–22 classes each, not yet cross-checked for value differences.

**Why this wasn't fixed in this pass:** confirming the correct outcome for each
of the 21 differing rules needs the same treatment given to
`add.css`/`Admin.css` — which file's consuming component (`FinalExams.jsx` vs
`QuizHistory.jsx`) actually renders each class, whether the difference is a
real bug (unreadable colour, wrong size) or an intentional per-widget
variation — but verifying the result requires a signed-in account with real
quiz **and** final-exam session history, in both languages (the site defaults
to Arabic/RTL) and at mobile width, which wasn't available in this session
without fabricating data. Fixing it blind, without visual confirmation on data
this rich, risks trading a known, scoped bug for an unknown, unscoped one.

**Recommended fix**, once someone can verify against a populated account:
prefix each file's colliding selectors with that file's own section root
(e.g. `FinalExams.css`'s copies of the 21 under a `.final-exam-` or similar
namespace already local to `FinalExams.jsx`'s markup) rather than picking a
single winner per class — the two components are independently-authored
similar-shaped widgets (session list → expandable detail), not a shared
design-system piece, so there's no reason either one's rule should apply to
the other's markup at all.

## Inventory (not investigated)

A repo-wide scan found **91 class names defined in two or more of the 52
stylesheets under `src/`** at the time of this pass. Most are either the
`add.css`/`Admin.css` and `FinalExams.css`/`QuizHistory.css` sets above, or
single-word utility-ish names (`.status`, `.no-data`, `.stat-label`,
`.submit-button`, `.stats-grid`) defined once per unrelated page and never
loaded together — harmless by construction, since the pages that define them
never appear in the same session's DOM at once... except that stylesheets
never unload, so "never loaded together" is only true for a visitor who never
navigates to both pages in one session. None of the remaining pairs were
checked individually for whether their consuming pages can realistically be
visited in the same session; run the same three-step process used above
(list collisions → check real `.jsx` consumers per file → diff rule bodies for
consumers that overlap) before assuming any of them are safe.
