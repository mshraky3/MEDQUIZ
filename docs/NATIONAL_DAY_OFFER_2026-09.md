# National Day offer — September 2026 (record + revert guide)

The 96th Saudi National Day is 23 September 2026. This file is the record of what
the offer changed, **what the prices were before it**, and how to end or remove
it without archaeology. Read this first if you are asked to "put it back".

## 1. The original prices — the base ladder

These are the normal prices. **The offer never edits them**: they are `PLANS` in
[`backend/services/paymentService.js`](../backend/services/paymentService.js),
untouched, and they come back on their own the moment the offer ends.

| Plan id | Term | Original price (SAR) | Halalas in `PLANS` | Other |
|---|---|---|---|---|
| `monthly` | 1 month | **50** | 5000 | never part of the offer |
| `four_month` | 4 months | **129** | 12900 | has its own compare-at of 200 (`PLAN_4MONTH_COMPARE_HALALAS`), shown as a struck-through old price outside the offer |
| `annual` | 12 months | **300** | 30000 | |
| `group_3` | 3 accounts, 4 months | **250** | 25000 | 83 SAR per account |
| `group_5` | 5 accounts, 4 months | **299** | 29900 | 60 SAR per account |

Environment overrides that set these in production, if any exist: `PLAN_MONTHLY_PRICE_HALALAS`,
`PLAN_4MONTH_PRICE_HALALAS`, `PLAN_4MONTH_COMPARE_HALALAS`, `PLAN_ANNUAL_PRICE_HALALAS`,
`PLAN_GROUP3_PRICE_HALALAS`, `PLAN_GROUP5_PRICE_HALALAS`. **Do not lower these for
the offer** — they are the base the offer sits on.

Static copy that states the base prices and is **deliberately unchanged**
(it is what shows when no offer is live): `i18n/copy/landing.js` (price card, group
tiers, compare table, "من 50 ريالاً شهرياً"), `i18n/copy/faq.js`, `i18n/copy/legal.js`
(Terms §9), `seo/siteMetadata.js` (/groups description), `mobile/app/terms.tsx`.

## 2. The offer

| Plan | Base | Offer |
|---|---|---|
| `four_month` | 129 | **96** |
| `annual` | 300 | **196** |
| `group_3` | 250 | **196** (65 per account) |
| `group_5` | 299 | **296** (59 per account) |
| `monthly` | 50 | 50 — no offer |

**The monthly plan** is shown, untouched, in its own row inside the landing
section, with the line "four months for less than the price of two" (96 vs
2 × 50 = 100). The line is only drawn while that comparison is true. This was
chosen over discounting monthly (see the discussion of cannibalising the 4-month
plan): the monthly price is the yardstick the offer is measured against.

Group prices were the assistant's suggestion of the 96 / 196 / 296 pattern
(1 / 3 / 5 accounts) and are open to change. `group_5` moves only 3 SAR, so the
pages show its new price with no struck-through "was".

Offer ID `national_day_96`. Prices, window and overrides live in one block,
`NATIONAL_DAY_OFFER`, in `paymentService.js`.

## 3. Current state: NO END DATE

The owner has not fixed an end date; they will provide it. Until then
`endsAtMs` is `null` and the offer is **open-ended**: it stays on, the pages show
"limited time" and no countdown or date, and nothing closes it. That is the
requested behavior — and the risk. **A forgotten open-ended offer silently replaces
the base price**, so the first thing to do when the owner names a date is set it.

## 4. When the end date arrives

Either (pick one):

1. **Vercel, backend project** → Environment Variables →
   `NATIONAL_DAY_OFFER_ENDS_AT = 2026-09-30T23:59:59+03:00` (ISO instant, keep the
   `+03:00` Riyadh offset), then redeploy. Same variable with a **past** instant
   ends the offer immediately.
2. Or edit `endsAtMs` in `NATIONAL_DAY_OFFER` (replace `isoInstant(process.env…)`
   with `Date.parse('2026-09-30T23:59:59+03:00')`) and push.

Then, with no other change, the pages show a live countdown and the date, and at
the deadline they go back to the base ladder by themselves.

**What the server does at the deadline:** quotes base prices from the next request.
A checkout opened before the deadline still pays the offer price — an offer-priced
payment *created* up to 6 hours after the deadline is accepted (judged by the
payment's own `created_at`), so a customer charged 96 at 23:58 is activated, not
refused. After 6 hours the offer price is refused again (`amount_mismatch`).

## 5. Reverting

**A. End the offer, keep the code** (the normal case): set `NATIONAL_DAY_OFFER_ENDS_AT`
to a past instant (§4). Prices return to §1. The front-end pieces then render
nothing. Nothing else to do; this is safe to leave in place.

**B. Remove the campaign code** (optional cleanup). Delete:
- `my-react-app/src/i18n/copy/nationalDay.js`
- `my-react-app/src/utils/nationalDay.js`
- `my-react-app/src/components/common/NationalDayOffer.{jsx,css}`
- `my-react-app/src/components/landing/NationalDaySection.{jsx,css}`

and remove the offer wiring (grep `NationalDay|nd-|ndOffer|has-nd|--nd-bar-h`) from
`Landing.jsx`, `Landing.css` (the `@property --nd-bar-h` block, `.has-nd`, the
`var(--nd-bar-h…)` in `.landing-topbar` and `.hero`), `Subscribe.jsx`,
`GroupsPage.jsx` and `GroupsPage.css` (`.groups-plan-was`). Server side: `NATIONAL_DAY_OFFER`
and its helpers in `paymentService.js`, the `offer` field in `routes/payment.js` and
`routes/groups.js`, and the offer tests. **Keep** the two verification lines only
if the offer code stays; if you remove the offer, restore them to
`Number(payment.amount) < plan.priceHalalas`.

Left in on purpose, evergreen (mention "special prices for limited periods", no
dates, no numbers): one sentence in the FAQ price answer and one bullet in Terms §9.
Keep or delete; they are harmless.

## 6. Where everything is

| What | Where |
|---|---|
| Offer window, prices, verification floor | `backend/services/paymentService.js` (`NATIONAL_DAY_OFFER`, `minAcceptableHalalas`) |
| Offer sent to the browser | `GET /api/payment/config`, `GET /api/groups/mine` (`offer` + offer-priced `plans`) |
| Tests (incl. the two "doors into activation") | `backend/services/paymentService.test.js` |
| Landing strip + section | `common/NationalDayOffer.*`, `landing/NationalDaySection.*` |
| Checkout / groups banner | `Subscribe.jsx`, `GroupsPage.jsx` |
| Owner-only runbook (git-ignored) | `MOYASAR_CHECKLIST.txt`, last section |

Moyasar's dashboard needs no change: it holds no prices. The amount is sent per
payment from our checkout and verified by our server.
