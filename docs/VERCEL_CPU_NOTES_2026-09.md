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
