# SQB

Arabic exam-prep platform for the Saudi licensing exams, serving two student
populations from one deployment:

| Track | Exam | Specialties |
| --- | --- | --- |
| `medical` | SMLE | Medicine, Surgery, Pediatrics, OB/GYN |
| `nursing` | SNLE | Fundamentals, Med-Surg, Maternal & Newborn, Pediatric, Mental Health, Pharmacology |

Landing, auth, payment and layout are shared. Everything that is *learning
content* — questions, summaries, and every analytics number derived from them —
is strictly segregated by track. An account carries exactly one track, chosen at
signup and changeable only by an admin.

## Layout

```
backend/          Express API (ESM). Postgres + Moyasar payments + Resend email.
  app.js            Routes, schema bootstrap, question/quiz endpoints.
  config/tracks.js  SOURCE OF TRUTH for tracks and specialty keys.
  content/          Authored summary HTML imported by app.js at startup.
  routes/ services/ middleware/
  scripts/          One-off maintenance/import scripts (run manually).
my-react-app/     Vite + React SPA (the website).
  src/utils/tracks.js  Client mirror of backend/config/tracks.js — keep in sync.
  src/seo/          Per-route metadata + prerender HTML.
mobile/           Expo wrapper app.
docs/             Operational notes (email, payments, handoff, SEO).
scripts/          Repo-level helper scripts.
source-material/  Bulk exam source PDFs/JSON (content/, JSON/, summarys/,
                  new questions/, nursing/). Untracked — see .gitignore.
notes/            Stray local notes / credentials / diagnostic dumps.
                  Untracked — see .gitignore.
backups/          Local DB/data restore points. Untracked.
payment-data/     Business/ID documents. Untracked.
assets/           Design assets not yet wired into the app.
```

Bulk exam source material (`source-material/`, `Q/`) and anything containing
credentials or business documents (`notes/`, `payment-data/`, `backups/`) are
deliberately untracked — see `.gitignore`.

## Running locally

```bash
npm install --prefix backend && npm install --prefix my-react-app
```

Backend (needs `backend/.env` with the Postgres credentials):

```bash
npm run dev --prefix backend
```

Web (auto-detects `http://localhost:3000` for the API when served from
localhost — see `my-react-app/src/global.js`):

```bash
npm run dev --prefix my-react-app
```

`.claude/launch.json` defines both as preview targets (`web`, `api`).

## Adding a track or specialty

Add it to **both** `backend/config/tracks.js` and
`my-react-app/src/utils/tracks.js` using the same key strings — the specialty
`key` is the literal `questions.question_type` value stored in the database. No
query in the app hardcodes a specialty list, so nothing else needs to change.
