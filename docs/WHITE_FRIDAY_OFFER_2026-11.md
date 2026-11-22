# White Friday offer, 27 Nov to 1 Dec 2026

Decided 2026-11-22 (owner: nothing below 100 SAR; group plans sell nothing).

## The offer
| Plan | Base | White Friday |
|---|---|---|
| Monthly | 50 | 50 (never discounted) |
| 4 months | 129 | **109** |
| Annual | 299 | **199** |
| Group 3 / 5 | 250 / 299 | not offered, and hidden from buying pages |

Window (Riyadh time): Fri 27 Nov 2026 00:00 to Tue 1 Dec 2026 23:59:59. A payment created before the end is honoured until 6 hours after it (existing grace).

## How it is switched on: environment only, no payment-code change
The offer block is the existing `NATIONAL_DAY_OFFER` in `backend/services/paymentService.js` (kept under that name, id `national_day_96`). The ends-at variable on Vercel is currently `2026-10-01T23:59:59+03:00`, which is why no offer is live. On the Vercel `medquiz` project set, then redeploy (read once at boot):

```
NATIONAL_DAY_OFFER_STARTS_AT=2026-11-27T00:00:00+03:00
NATIONAL_DAY_OFFER_ENDS_AT=2026-12-01T23:59:59+03:00
NATIONAL_DAY_4MONTH_PRICE_HALALAS=10900
NATIONAL_DAY_ANNUAL_PRICE_HALALAS=19900
NATIONAL_DAY_GROUP3_PRICE_HALALAS=25000
NATIONAL_DAY_GROUP5_PRICE_HALALAS=29900
```
The two group values equal the base prices on purpose: an offer price that is not lower than the base is ignored, so groups are not offered. Do not touch `PLAN_*`.

Checked locally by simulating these values: before 27 Nov 00:00 nothing is live; on 28 Nov 4-month = 10900 and annual = 19900 (group plans at base); on 2 Dec 01:00 the display is back to base but the verify floor still accepts 10900 (grace); at 2 Dec 06:00 it is base again.

## Code in this change
Wording only: `my-react-app/src/i18n/copy/nationalDay.js` (and its synced copy in `mobile/`) now says "White Friday / الجمعة البيضاء" instead of National Day. `SHOW_GROUP_PLANS = false` in `my-react-app/src/config/features.js` hides the landing group card, the footer link and the /subscribe cross-link; `/groups` still works for existing group owners.

## Switch off early or revert
Set `NATIONAL_DAY_OFFER_ENDS_AT` to any past instant and redeploy. To restore the group advertising set `SHOW_GROUP_PLANS = true`.

## Stop rule (written before the offer)
Fewer than 2 payments in the window, or a clear dip the week after: price cuts do not create demand here; do not discount again.
