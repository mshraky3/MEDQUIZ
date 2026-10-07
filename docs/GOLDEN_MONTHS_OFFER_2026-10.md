# Golden Months offer — October–November 2026 (record + revert guide)

Owner decision 2026-10-07: during the exam season a **four-month purchase is credited five months**. **No price changes**
(monthly 50, four-month 129, annual 299, groups 250 / 299 stay exactly as they are). Campaign plan, calendar and channels:
`marketing/golden-months/PLAN.md` (working-projects root).

## What it does
| Plan | Paid | Credited during the window |
|---|---|---|
| `four_month` | 129 SAR | **5 months** |
| `monthly`, `annual`, `group_3`, `group_5` | unchanged | unchanged (no bonus) |

Window (Riyadh time): **Tue 13 Oct 2026 00:00 → Sun 8 Nov 2026 23:59:59**. Judged by the payment's **creation time**
(`created_at` from Moyasar), with a 6-hour grace after the deadline, so money taken in time always gets its month.

## Code map
- `backend/services/goldenMonths.js` — the single source: window, `bonusMonths: { four_month: 1 }`, `bonusMonthsFor(planId, atMs)`
  (what is credited), `displayBonusMonths` / `getGoldenInfo` (what visitors see, no grace). Pure module, no imports.
  Env overrides read once at boot: `GOLDEN_MONTHS_STARTS_AT`, `GOLDEN_MONTHS_ENDS_AT` (ISO with `+03:00`; junk falls back to the default,
  never to "forever"). Redeploy after changing them; a past `ENDS_AT` closes the offer at once.
- `paymentService.js` — `computeNewExpiry(current, plan, atMs)` adds the bonus (exported now); `activateSubscriptionFromPayment`
  passes `paymentInstantMs(payment)`; `listPlansForDisplay` adds `bonusMonths` to the plan while live. **Price, `effectivePriceHalalas`,
  `minAcceptableHalalas` and verification are untouched** (a mutation-checked test pins this). Admin grants pass no plan id, so get no bonus.
- `routes/payment.js` — `/api/payment/config` returns `goldenMonths` (null when off), separate from `offer` (the price offer).
- `accountingService.settleEvent` adds `createdAtMs`; `invoiceService` states the months credited (5 / "خمسة أشهر") on the PDF and email.
- Front end (campaign code, removable — see top of `i18n/copy/goldenMonths.js`): `GoldenStrip` on the landing page (only when the
  National Day offer is not showing), `GoldenBanner` + "+1 month free" badge + "/ 5 months" + "26 SAR/mo" on `/subscribe`.
  Landing and National Day share one `/config` request (`loadPublicConfig` in `utils/nationalDay.js`).
- Tests: `backend/services/goldenMonths.test.js` (window, grace, plan coverage, price untouched, real activation path with a fake db,
  receipts, env override).

## Not covered (known)
- The **Android app** shows its own plan copy and is not updated; buyers get the bonus server-side regardless, but the app does not
  advertise it.
- Group plans get no bonus (their per-seat price is already the lowest).
- Refund windows are unchanged (3 days monthly, 14 days longer plans), counted from payment.

## Revert / end early
The offer ends by itself on 8 Nov. To end early: set `GOLDEN_MONTHS_ENDS_AT` to a past instant on the Vercel `medquiz` project and redeploy.
To remove the code afterwards: delete `goldenMonths.js` + test, the three call sites in `paymentService.js` / `routes/payment.js` /
`accountingService.js` / `invoiceService.js`, and the front-end files listed above. Subscriptions already credited keep their months.

## Heads-up found while building
`NATIONAL_DAY_OFFER.endsAtMs` has **no default end date in code**; it is closed only by the Vercel env var
`NATIONAL_DAY_OFFER_ENDS_AT=2026-10-01T23:59:59+03:00`. If that variable is ever removed, the 96 / 196 prices come back. Not changed here.
