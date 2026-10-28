# One free month for the Android app (design, 2026-10-28)

**State: implemented on branch `feat/play-launch`, OFF by default, not deployed.** Nothing happens until the
server variable `APP_FREE_MONTH_ENABLED` is exactly `true`. Needs the owner's yes on the wording first
(see "Policy" in `PLAY-LAUNCH-CHECKLIST.md`).

## How accounts get paid time today (read from the code)
| Way | Where | Notes |
|---|---|---|
| Moyasar payment | `activateSubscriptionFromPayment` | sets `subscription_status='active'`, `subscription_expiry_date`; audit row `status='paid'` |
| Admin grant | `grantSubscriptionMonths` (`paymentService.js`) | stacks months, sets `is_admin_created=TRUE`, audit row `event_type='admin_grant'`, `status='granted'` (invisible to every money query) |
| Temp-link / admin-created accounts | `app.js` (`DEFAULT_INVITE_MONTHS`) | timed, same flag |
| Golden Months | `goldenMonths.js` | bonus month on the 4-month plan, until 8 Nov 2026 |
| Free tier | `allowanceFor` | 10 answered questions for life (40 for older accounts), never locks the account |
| Trial / coupons | none (the timed trial was retired 2026-08-08; no coupon code exists) | |

## The design (least invasive)
Reuse the admin-grant mechanism. New files only: `backend/services/appFreeMonth.js`,
`backend/routes/appFreeMonth.js`, one `app.use('/api/app', requireSession, ...)` line in `app.js`, tests in
`backend/services/appFreeMonth.test.js`. **No schema change, no `PLANS`, no `PLAN_*`, no price touched.**

- The Android app, right after a real sign-in (not on session restore), sends `POST /api/app/free-month`
  with `{ platform: 'android-app' }` (`mobile/src/lib/auth.tsx`). It ignores every answer and every failure.
- The server answers 404 while the feature is off. When on, in ONE transaction with the account row locked
  (`FOR UPDATE`, so two requests cannot both grant) it grants one month if ALL hold:
  verified email, never redeemed, never paid (`status='paid'` row), not grandfathered, no admin/seat grant,
  no live subscription.
- It writes `payment_events` row `event_type='app_free_month'`, `gateway='app'`, `gateway_ref='app_free_month_<id>'`,
  `amount_halalas=0`, `status='granted'`. That row is also the "already redeemed" memory. Never `paid`, so
  `adminMetricsService` / accounting never count it as revenue.
- When the month ends, the account falls back to the normal free tier (`admin_grant_expired` -> free allowance).

## Abuse limits, honestly
- One per account, enforced by the locked transaction and the audit row. Not for payers or past payers.
- Free signup already needs an email code and refuses throwaway domains, so a new account costs a real mailbox.
- **The platform marker is not proof of an install.** Anyone can send `platform:'android-app'` with curl. So the
  true limit is "one per verified account", the same as the free signup itself. The strong version is Google's
  Play Integrity API (the app sends an integrity token, the server verifies it with a Google API key). Not built:
  it needs a Google Cloud setup and the owner. Worth it only if farming of fake accounts is seen.
- Kill switch: unset `APP_FREE_MONTH_ENABLED` (a Vercel env change + redeploy; the variable is read at each request,
  but Vercel applies env changes on redeploy).

## What it costs
- Cash: **0** (no payment gateway or Google fee is involved).
- Lost revenue: only if the redeemer would have bought the monthly plan (50 SAR incl. VAT) in that month. Payers are
  excluded, and the notes say about 1 in 29 free users who used their whole allowance paid (`knowledge/SQB/04`), so the
  expected loss per redeemer is a few riyals; the worst case is 50 SAR per redeemer.
- Redeemers, an ASSUMPTION (no data): 12 to 20 during the closed test, then perhaps 30 to 100 in the first two
  months after the public release. Worst case 100 x 50 = 5,000 SAR notional, expected well under 500 SAR.
- Upside: a paid-access month fires the existing renewal reminder emails near its end, which is a conversion nudge.

## Ship steps (needs the owner's yes: production deploy)
1. Decide the wording and whether the free month exists at all (checklist, "Policy").
2. Push the branch to `main` through the normal worktree flow (never a force push).
3. On Vercel `medquiz` set `APP_FREE_MONTH_ENABLED=true`, redeploy. Do NOT touch any `PLAN_*` variable.
4. Check with one test account on the Android build: sign in, see paid access on the account screen, sign in again
   (no second month), see the `payment_events` row in the admin view.
5. For the website card set `VITE_ANDROID_FREE_MONTH=true` on `medquiz-react` only when step 3 is live.
