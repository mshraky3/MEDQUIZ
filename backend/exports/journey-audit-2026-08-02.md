# User journey audit — 2026-08-02

Read-only report. Every query is a SELECT against production; nothing here writes.

## A0 — Cohort boundary (free era vs paid era)

| migration | applied_at |
| --- | --- |
| 001_grandfather_existing | 2026-06-24T06:51:20.524Z |
| 002_grandfather_all_current | 2026-06-29T08:36:34.828Z |

**Cutover (free era ends / paid era begins): 2026-06-24T06:51:20.524Z**
Every PRE/POST split below uses this timestamp against `accounts.created_at`.

grandfathered_at IS NOT NULL: 1 · notified of end-of-free-era: 21 · revoked+notified: 20

## A1 — Signup funnel (OTP)

Caveat: `signup_otps` has no `purpose` column — it is shared by signup AND password-reset codes, so "OTPs sent" below is not purely signup intent. Treat the verification rate as directional, not exact.

OTPs sent: 273 · marked used: 224 · used rate: 82.1%
Distinct emails requesting a code: 136 · avg sends/email: 2.01 · max: 12 · emails needing >1 send: 54 (39.7%) — a proxy for OTP-email deliverability pain.
Emails with a used code that match an account: 54 / 54 verified emails.
Accounts with email_verified = FALSE: 0.

## A2 — Login frequency and retention

Logins per account, PRE vs POST cutover:

| cohort | logins | accounts |
| --- | --- | --- |
| POST | 1 | 28 |
| POST | 2-3 | 6 |
| POST | 4-10 | 1 |
| POST | 11+ | 1 |
| PRE | 1 | 9 |
| PRE | 2-3 | 4 |
| PRE | 4-10 | 2 |
| PRE | 11+ | 1 |

POST cohort one-and-done rate (exactly 1 login ever, i.e. only the signup auto-login): 28 / 36 accounts (77.8%). Of those who ever logged in at all: 77.8%.

Retention — % of eligible accounts with a login at least N days after signup (cumulative "returned by day N"):

| cohort | day | eligible | retained | rate |
| --- | --- | --- | --- | --- |
| POST | 1 | 34 | 3 | 8.8% |
| POST | 3 | 31 | 2 | 6.5% |
| POST | 7 | 28 | 2 | 7.1% |
| POST | 14 | 13 | 1 | 7.7% |
| POST | 30 | 3 | 1 | 33.3% |
| PRE | 1 | 16 | 5 | 31.3% |
| PRE | 3 | 16 | 4 | 25% |
| PRE | 7 | 16 | 3 | 18.8% |
| PRE | 14 | 16 | 2 | 12.5% |
| PRE | 30 | 16 | 2 | 12.5% |

Median days between consecutive logins (users with 2+ logins): 0.0

Paywall effect, same-user basis (accounts that existed before the cutover, 16 accounts):
  30 days before cutover: 27 logins from 16 distinct users
  30 days after cutover:  6 logins from 2 distinct users
  Note: A6 gives the confounded all-users before/after view — read this row instead for the isolated paywall effect.

## A3 — The 1-hour trial

Trials granted: 28

Funnel:

| step | count | % of trials granted |
| --- | --- | --- |
| granted | 28 | 100% |
| logged in during the hour | 28 | 100% |
| started a quiz | 18 | 64.3% |
| completed a quiz | 18 | 64.3% |
| returned after expiry | 4 | 14.3% |
| paid | 1 | 3.6% |

Minutes of the 60-minute trial actually used — avg: 0.0 · median: 0.0

When payers paid, relative to trial expiry:

| timing | count |
| --- | --- |
| during_the_hour | 0 |
| lt_24h | 0 |
| lt_7d | 1 |
| gt_7d | 0 |

Conversion by questions answered during the trial hour (this decides whether the hour is too short):

| questions answered | trials | paid | conversion |
| --- | --- | --- | --- |
| 0 | 10 | 0 | 0% |
| 1-10 | 9 | 1 | 11.1% |
| 11-30 | 3 | 0 | 0% |
| 31+ | 6 | 0 | 0% |

Conversion by hour-of-day of the grant (Riyadh time) — tests whether the 1-hour wall clock is the wrong mechanism:

| hour | trials | paid | conversion |
| --- | --- | --- | --- |
| 00:00 | 4 | 0 | 0% |
| 01:00 | 3 | 1 | 33.3% |
| 02:00 | 2 | 0 | 0% |
| 03:00 | 2 | 0 | 0% |
| 05:00 | 1 | 0 | 0% |
| 07:00 | 1 | 0 | 0% |
| 10:00 | 1 | 0 | 0% |
| 12:00 | 2 | 0 | 0% |
| 14:00 | 2 | 0 | 0% |
| 16:00 | 1 | 0 | 0% |
| 17:00 | 2 | 0 | 0% |
| 19:00 | 1 | 0 | 0% |
| 20:00 | 1 | 0 | 0% |
| 21:00 | 1 | 0 | 0% |
| 22:00 | 2 | 0 | 0% |
| 23:00 | 2 | 0 | 0% |

Conversion by day-of-week of the grant (Riyadh time):

| day | trials | paid | conversion |
| --- | --- | --- | --- |
| Sunday | 3 | 0 | 0% |
| Monday | 3 | 0 | 0% |
| Tuesday | 3 | 0 | 0% |
| Wednesday | 5 | 0 | 0% |
| Thursday | 3 | 0 | 0% |
| Friday | 5 | 0 | 0% |
| Saturday | 6 | 1 | 16.7% |

## A4 — Post-payment behaviour and long-term value

Paying customers: 2
Never logged in after paying (refund risk — the 14-day refund window makes this time-sensitive): 1 (50%)

| email/username | paid_at |
| --- | --- |
| albaraa.instagram@gmail.com | 2026-07-15 |

Days since last login, payers:

| days since last login | payers |
| --- | --- |
| 0-7d | 0 |
| 8-30d | 2 |
| 31-90d | 0 |
| 90d+ | 0 |
| never | 0 |

Current-activity snapshot by cohort:

| cohort | accounts | active last 7d | active last 30d |
| --- | --- | --- | --- |
| GRANDFATHERED | 1 | 1 (100%) | 1 (100%) |
| OTHER | 22 | 0 (0%) | 6 (27.3%) |
| PAID | 2 | 0 (0%) | 2 (100%) |
| TRIAL_EXPIRED_UNCONVERTED | 27 | 9 (33.3%) | 27 (100%) |

Expiring soon (no auto-renew — every one of these is a manual re-sell): 7 days: 0 · 30 days: 0

Revenue (canonical ledger): gross 396.00 SAR · fees 11.15 SAR · refunded 0.00 SAR (0 refund(s)) · net 384.85 SAR · distinct payers: 2

## A5 — Engagement mix (page_engagement)

Caveat: `page_engagement` is lazily created on first write and only records logged-in users — it has no history before its first row and cannot see the landing page.

| track | cohort | section | seconds | views | distinct users |
| --- | --- | --- | --- | --- | --- |
| medical | POST | analytics | 111 | 16 | 2 |
| medical | POST | other | 367 | 28 | 4 |
| medical | POST | quizzes | 3306 | 51 | 4 |
| medical | POST | summaries | 1440 | 30 | 3 |
| nursing | POST | analytics | 133 | 13 | 3 |
| nursing | POST | other | 280 | 23 | 3 |
| nursing | POST | quizzes | 2632 | 58 | 3 |
| nursing | POST | summaries | 784 | 17 | 3 |

## A6 — Platform level, before vs after (confounded — read alongside A2's same-user comparison)

This view mixes the paywall effect with the free-era-revoke campaign and with seasonal/exam-window timing. It is directional context, not proof of the paywall's effect — use A2's same-user comparison for that.

| week | signups | active users | quiz sessions |
| --- | --- | --- | --- |
| 2026-05-03 | 1 | 1 | 0 |
| 2026-05-10 | 0 | 1 | 2 |
| 2026-05-17 | 0 | 1 | 4 |
| 2026-05-24 | 4 | 4 | 9 |
| 2026-05-31 | 7 | 9 | 12 |
| 2026-06-07 | 1 | 2 | 2 |
| 2026-06-14 | 3 | 4 | 5 |
| 2026-06-21 | 0 | 1 | 1 |
| 2026-06-28 | 4 | 5 | 3 |
| 2026-07-05 | 2 | 5 | 1 |
| 2026-07-12 | 7 | 10 | 5 |
| 2026-07-19 | 15 | 16 | 7 |
| 2026-07-26 | 8 | 13 | 23 |

## Cross-check — must match the live admin panel

These numbers must equal what `/admin/stats` and `/api/accounting/summary` show right now. If they don't, investigate before trusting either.

| metric | value |
| --- | --- |
| Net revenue (SAR) | 384.85 |
| Gross revenue (SAR) | 396.00 |
| Distinct payers | 2 |
| Total trials granted | 32 |
| Trial → paid | 1 |
| Trial conversion rate | 3.1% |
| Active subscribers | 2 |
| Trial active now | 0 |
| Trial expired, unconverted | 27 |
| Grandfathered | 1 |
| Total users | 56 |
| DAU | 3 |
| WAU | 13 |
| MAU | 40 |