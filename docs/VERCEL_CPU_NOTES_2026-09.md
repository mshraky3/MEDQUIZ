# Vercel Active CPU — what was cut and why (September 2026)

The Vercel Hobby team was at 75% of its 4-hour monthly **Fluid Active CPU**
(3h02m over 30 days, `medquiz` = 64% of it). When the limit is passed, every
project on the team pauses. Measured on the `medquiz` function on 2026-09-20:
~22 ms of CPU per request, ~5% cold starts, and everything is one route
(`/app.js`), so the dashboard cannot split it further.

None of this touches pricing, the National Day offer, or any user-visible
behavior — see [NATIONAL_DAY_OFFER_2026-09.md](NATIONAL_DAY_OFFER_2026-09.md)
for that; the two changes share no files.

## What changed

| Change | Why | Where |
|---|---|---|
| `google-auth-library`, `@aws-sdk/client-s3`, `pdfkit`, `nodemailer`, `sharp` are imported on first use instead of at the top | Loading them cost ~640 ms of CPU on **every cold start** (measured: 220 / 171 / 126 / 62 / 62 ms) although most requests never use them | `app.js` (`getGoogleOAuthClient`), `services/r2Service.js`, `services/mailer.js`, `services/invoiceService.js`, `services/subscriptionReportService.js`, `services/telegramImageService.js` |
| `GET /api/public/stats` is cached by Vercel's CDN (`s-maxage=900`) | Every landing-page visitor called it and ran the function; the in-memory cache only helped a warm instance. `Access-Control-Allow-Origin: *` so one cached copy serves both www and the bare domain | `app.js` |
| Engagement ping every 5 min instead of 2 | Each ping is an invocation per open tab. Section change and tab-hide still flush immediately; the server clamps a report at 30 min so nothing is lost | `my-react-app/src/utils/engagement.js` |
| Summary page images: `private, max-age=86400` instead of `private, no-store` | A revisit re-streamed the image from R2 through the function. `private` still stops CDNs/proxies storing it | `routes/summaries.js` |

## Deliberately not changed
- The hourly GitHub Actions crons — about 1% of invocations.
- `compression()` — unclear whether Vercel already compresses these responses; needs a measurement on an authenticated request first.

## How to verify
- Vercel → Usage → Fluid Active CPU: expect the daily figure to fall from ~6 min/day. Give it 3–7 days.
- `curl -sI https://medquiz.vercel.app/api/public/stats` → `Cache-Control: public, s-maxage=900…` and, on a repeat call, `X-Vercel-Cache: HIT`.
- Google sign-in, an invoice PDF, an email send and a summary page still work (the lazy imports are the only risk).

## To revert
`git revert` the commit "Cut Vercel CPU: lazy-load heavy libraries…". No data or schema changed.

---

## October 2026: the cuts were outgrown — Fluid compute turned off

**What happened.** By 2026-10-04 the team was at **3h23m of 4h** (rolling 30
days; Hobby has no billing cycle). Per-request cost had not changed (~22 ms),
but traffic doubled in a month (23k → 49k function calls a week: HR's new
school year, the SQB campaign), so the September cuts were eaten by growth.
The last 7 days ran at exactly the 8 min/day budget.

**The fix (2026-10-04, owner approved).** Functions **without** Fluid compute are
not counted in Active CPU; Hobby bills them against a separate **Function
Duration** quota (100 GB-h). `portfolio-api` proved it (0 s Active CPU). So:

| Change | Where | Commit / setting |
|---|---|---|
| Fluid compute **off**, Default Max Duration **60 s** (the non-Fluid Hobby default would be 10 s) | Vercel `medquiz` → Settings → Functions (also `hr-management`, `email-services`) | dashboard, redeployed 19:25 UTC |
| CORS preflights from `www.` / bare `smle-question-bank.com` asking only for `authorization`, `content-type`, `x-admin-key` are answered by the CDN (204 + CORS headers), so no function runs. They were ~40% of invocations | `backend/vercel.json` (two `OPTIONS` routes before the catch-all) | `aef34b1` |
| `cors({ maxAge: 7200 })` for every other preflight | `backend/app.js` | `aef34b1` |
| `compression({ level: 1 })` (several times cheaper than 6, ~10-15% larger) | `backend/app.js` | `aef34b1` |
| Admin users list (60 s) / stats (120 s) polling skips hidden tabs, refreshes once when shown | `my-react-app/src/components/ADD/ADD.jsx`, `ADD/ui/useAdminData.js` | `aef34b1` |
| Cron routes stop starting new sends after 45 s (`CRON_BUDGET_MS`) instead of being killed at 60 s; the next run continues (every job stamps per recipient) | `backend/utils/cronBudget.js`, `routes/email-campaigns.js`, `routes/telegram.js`, `services/lifecycleJobs.js`, `services/telegramJobs.js` | `16ee91a` |

**Not done on purpose:** CDN-caching `/api/payment/config` (deliberately
`no-store`, next to pricing code).

**What it costs users:** more cold starts (16% vs ~7% overnight; ~1 s each,
mostly the first load after a quiet period). Warm requests are as fast as before.

**Rules that follow from it**
- Every request must finish within **60 s**. Long loops (crons, imports) must
  check `cronDeadline()` before each unit of work.
- If the SPA starts sending a new request header, add it to both `OPTIONS`
  routes in `backend/vercel.json` (`has` regex and `Access-Control-Allow-Headers`);
  otherwise its preflights just fall through to the app (still works, costs calls).

**Verify / watch:** Vercel → Usage → **Duration** (estimate 15-40 GB-h per 30
days; act above ~60); Fluid Active CPU should stay ~0 for `medquiz`. Preflight:
`curl -si -X OPTIONS https://medquiz.vercel.app/api/notifications -H "Origin: https://www.smle-question-bank.com" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: authorization"`
→ `204` with `Access-Control-Max-Age: 7200` and no `X-Vercel-Cache` header.

**To revert:** Settings → Functions → Fluid Compute → Enabled → Redeploy (keep
the 60 s max duration or set it back to 300). Code: `git revert 16ee91a aef34b1`.

Full plan, options compared (Pro, second account, AWS Lambda, Cloud Run, Azure
for Students, Heroku Student, Oracle, Cloudflare, Render, Koyeb) and Phase 2
(an off-Vercel standby behind a `medquiz.vercel.app` external rewrite):
`knowledge/Workspace/Vercel CPU plan 2026-10.md` in the working-projects folder.
