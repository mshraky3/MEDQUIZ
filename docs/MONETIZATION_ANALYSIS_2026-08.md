# SQB — Why We Aren't Getting Paid, and What To Do About It

**Date:** 2026-08-07
**Data source:** production database, direct queries (all figures below are measured, not estimated)
**Window:** 2026-05-09 (first account) → 2026-08-06 (last signup)

---

## 1. THE BOTTOM LINE FIRST

Since the paywall went live on 2026-07-12 (26 days), SQB has collected:

- **4 live payments × 99 SAR = 396 SAR gross / ~385 SAR net**
- One of those four (payment id 7, cardholder "Muhmod Alshraky", 2026-07-12 — the exact day
  enforcement went live) is almost certainly your own go-live test on a real card.
- **So: ~3 real paying customers, ~297 SAR, in 26 days.**

**The reason is not the price, and it is not the payment form.**

The reason is this single number:

> **Of 42 users who ever started a quiz, only 6 ever came back on a second day.**
> **26 of them did exactly one quiz session, ever.**
> **43 of 62 accounts logged in exactly once, ever.**

The typical SQB user's entire lifetime experience of the product is:
**one 10-question quiz, about 11 minutes, then gone forever.**

Nobody pays 99 SAR for something they used once for 11 minutes. No pricing change,
no landing page, and no payment-form tweak converts that user. The product is not
failing to sell — it is failing to be used a second time, and selling is downstream
of that.

---

## 2. THE FUNNEL, MEASURED

| Stage | Count | Drop |
|---|---|---|
| Unique emails that ever requested a signup OTP | 142 | — |
| Verified the OTP | 123 | −13% |
| Accounts existing today | 62 | (68 account IDs were deleted — see §6) |
| Ever ran a single quiz | 42 | −32% |
| Ran 2+ quiz sessions | **16** | **−62%** |
| Came back on a 2nd calendar day | **6** | **−63%** |
| Paid | 3 | −50% |

Between "tried the product once" (42) and "paid" (3) you lose **93%** — and
**86% of that loss happens before the user has ever seen a price.**

The two back-to-back ~60% drops — at *used it twice* and *came back tomorrow* — are
where all the money is. Everything else is a rounding error by comparison.

### Supporting behaviour numbers

- **Sessions per user:** 1 session → 26 users · 2 → 7 · 3–5 → 6 · 6–10 → 3 · (nobody above 10)
- **Logins per user:** 1 login → 43 users · 2–3 → 12 · 4–10 → 5 · 10+ → 2
- **Average session:** 13.5 questions, 10.7 minutes, 52.7% accuracy
- **Quiz length chosen:** 10 questions in 69 of 85 sessions. The 10-question quiz *is* the product as used.
- **Total questions answered by every user combined, in 3 months: ~1,150** — against a bank of **5,865**.
  The largest single user has answered 140. **Nobody has ever experienced the thing we are selling.**
- **Time from signup to first quiz:** median well under 20 minutes. People engage fast.
  They just never return.
- **Sessions are always finished:** 85 of 85 completed, 0 abandoned. When they're in, they're in.
  The quiz experience itself is not the leak.

That last pair matters: users sign up willingly, engage immediately, and complete what
they start. This is not a broken product. It is a product with **no second visit**.

---

## 3. WHY THEY DON'T COME BACK — THE SPECIFIC CAUSES

### 3.1 The 1-hour trial burns on a wall clock, not on usage

The trial starts at signup and expires 60 real-world minutes later, whether the user is
in the app or asleep. Median engaged time is ~11 minutes. So the standard experience is:

> Sign up at 11pm → do one 10-question quiz (11 min) → go to bed →
> 49 minutes evaporate untouched → next visit hits a paywall,
> having seen **10 of 5,865 questions (0.17% of the bank)**.

That user cannot evaluate a question bank, so they cannot buy one. The trial is not
failing to convert because it's free — it's failing because **it is far too short to
demonstrate value**, and most of it is wasted on a clock the user isn't watching.

### 3.2 82% of all accounts are currently locked out

51 of 62 accounts sit in `subscription_status = 'trial_pending'`.
In `paymentService.js:147`, that status returns `allowed: false`. Those users are
hard-blocked from `/api/questions`, `/quiz-sessions`, and the final quiz.

The trial only converts from `trial_pending` → `trial` at the user's **next login**
(`app.js:1132`). So the reset campaign that granted 51 people a fresh hour requires
each of them to come back and log in to claim it.

**`trial_reset_email_sent_at` is set on 51 accounts. Total trial grants claimed from
that campaign: effectively zero** — the only recent grants (accounts 287, 288, 289) are
brand-new signups from Aug 5–6, not reactivations.

> **A win-back email to 51 dormant users produced ~0 reactivations.**
> The dormant list is dead. Do not build a strategy on reviving it.

### 3.3 The exam-date feature — your best retention asset — is invisible

The schema has `exam_date` and `exam_reminder_stage`, and `lifecycleJobs.js` implements
a full 5-stage reminder sequence (30 / 14 / 7 / 3 / 1 days before the exam).

**0 of 62 accounts have set an exam date.** The entire feature has never fired once.

This is the highest-leverage unused thing in the codebase. An exam date is the one
piece of information that makes a study product feel personal *and* gives you a
legitimate, welcome reason to email someone five more times.

### 3.4 Two written marketing campaigns were never sent

`broadcast_campaigns` contains two campaigns created 2026-08-03, both still
`status = 'draft'`, with **112 recipient rows all still `pending`**. The copy is written.
It has been sitting unsent for four days.

### 3.5 We have no idea where any user comes from

- `login_history.country` and `.city` are **NULL for all 192 logins** (columns exist, never populated).
- There is **no UTM capture and no `document.referrer` capture anywhere** in the frontend.

Signups run 1–13/week with no attributable cause. **The moment you spend one riyal on
acquisition, you will have no way to tell whether it worked.**

---

## 4. WHO THE USERS ACTUALLY ARE

From the data, not from assumption:

| Dimension | Reality |
|---|---|
| Language | 54 Arabic / 8 English (87% Arabic) |
| Email | 54 Gmail, 4 Hotmail, rest scattered — consumer accounts, not institutional |
| Track | 56 medical / **6 nursing** |
| Device reach | Mobile 42 unique users vs Desktop 26 |
| Device volume | Desktop 115 logins vs Mobile 75 — **committed users move to desktop** |
| Peak hours (KSA) | 6–7pm (22 logins) and ~11am (16); real late-night tail — 41 logins between midnight and 5am |
| Topics practiced | Medicine (387 answered) > OB/GYN (281) > Pediatrics (163) > Surgery (73) |
| Accuracy | 52.7% average; the modal session lands in the 40–56% band |

**Read:** they discover on mobile and commit on desktop; they study at night and
mid-morning; and at ~53% accuracy **they are genuinely struggling**, which is exactly
the person who needs a question bank and knows it. The demand is real. The retention is not.

---

## 5. YOUR TWO PROPOSALS — MY HONEST OPINION

### 5.1 "Add a 1-month subscription for 50 SAR, renewed manually"

**Verdict: yes — but not as an addition. As the new default, with the annual repriced.**

**Why it's right:**

- 99 SAR/year asks a stranger who has answered 10 questions to commit for a full year
  to an unproven brand with no reviews. 50 SAR is a much smaller leap of faith.
- SMLE/SNLE candidates study in **bursts tied to an exam date**. Monthly matches the real
  shape of demand; most candidates need 1–3 months, not 12.
- More transactions = a learning signal. At 3 payments per 26 days you cannot learn
  anything. You need volume before any optimization is meaningful.
- **"Renewed manually" is already how the system works.** There is no auto-renew anywhere
  (Moyasar one-time payments; `computeNewExpiry` simply extends the date). This is not new
  work — it is the existing model.

**Four things you must handle, or this backfires:**

**(a) 50/month next to 99/year is broken pricing.** A rational buyer takes the year:
99 SAR for 12 months vs 600 SAR for the same span. **Nobody would ever buy month two.**
You'd be selling a 50 SAR one-off and calling it a subscription.

> **Recommended ladder: 50 SAR / month · 129 SAR / 3 months · 299 SAR / year.**
> Make the 3-month the visually recommended tier — it matches how people actually prepare
> for a licensing exam, and it's the one you want them to buy.
> If you keep 99 SAR/year, do **not** launch monthly — the two cannot coexist.

**(b) Your 14-day refund window becomes a 47% refund window.** The refund policy
(`i18n/copy/legal.js:159`) promises a full refund within 14 days of purchase. On an
annual plan that's 4% of the term. On a 30-day plan it's nearly half — someone can cram
for two weeks and get their money back. **Add a term-proportional clause before launching
monthly.** This is a legal-doc change, not just copy.

**(c) Churn becomes visible immediately, and it will look bad.** Annual plans hide churn
for a year. Monthly exposes month-2 renewal instantly, and given that only 6 of 42 users
ever returned on a second day, expect a harsh first number. That's information you need —
just don't panic at it.

**(d) Fees get slightly worse per riyal.** Moyasar fee = (pct × amount + 1 SAR) × 1.15.
That fixed ~1.15 SAR is 2.3% of a 50 SAR sale vs 1.2% of a 99 SAR sale. Twelve monthly
charges cost roughly 14 SAR/year more in fees than one annual charge. Not decisive, but real.

**Implementation notes — I checked the code, and one item is dangerous:**

| File | Issue |
|---|---|
| `backend/services/paymentService.js:322` (`verifyAndActivate`) | Rejects `payment.amount < expected` where expected is the single env price (9900). **A 50 SAR payment would be rejected as `amount_mismatch` — money taken by Moyasar, access not granted.** Must be plan-aware **first**. |
| `backend/services/paymentService.js:400` (`handleWebhookEvent`) | Same amount check, same bug, second code path. |
| `backend/services/paymentService.js:201` (`computeNewExpiry`) | Hardcodes `setFullYear(+1)`. Must read the plan. |
| `backend/services/paymentService.js:98` (`getPriceHalalas`) | Single env var `SUBSCRIPTION_PRICE_HALALAS`. Needs a plan table. |
| `my-react-app/src/components/subscribe/Subscribe.jsx:115` | Hardcodes `metadata: { plan: 'annual' }`. Good news: the `plan` metadata field already exists — make it the source of truth for term length. |
| `my-react-app/src/i18n/copy/support.js` | `period: '/ سنة'`, perks say "سنة كاملة", policy says "الاشتراك سنوي (سنة واحدة)" |
| `my-react-app/src/i18n/copy/landing.js` | Hero trust bar hardcodes "99 ريال للسنة كاملة بعد التجربة" |
| `backend/services/lifecycleJobs.js:92` | Expiry reminder fires at ≤7 days. Fine for 30 days, but add a 2-day and a day-of touch — with manual renewal, that email **is** your renewal mechanism. |

Roughly a day of careful work. **The amount-check in the two payment paths is the one
that must be right before anything goes live** — get it wrong and you will charge people
and not give them access.

---

### 5.2 "Close the free trial — no more free trials"

**Verdict: I disagree, and I want to be direct about why.**

The argument for killing it is that people take the free hour and never pay. That's true
on the surface — 8 trial grants, 1 conversion.

But look at what removing it actually does to the funnel:

```
TODAY:            landing → signup → 1 free hour → paywall → 99 SAR
WITHOUT TRIAL:    landing → signup → pay 99 SAR having seen nothing
```

You would be asking a stranger to pay for a question bank they have never opened, from a
brand with no reviews and no name recognition. **Your own landing page leads with
"ساعة وصول كامل مجاناً" — the free hour is currently the reason anyone signs up at all.**
41 people signed up in the last 26 days on that promise. Remove it and that number goes
toward zero, and 3 payers becomes 0–1.

**The data does not say the trial fails to convert. It says the trial is too short to
convert.** One hour, of which the median user spends 11 minutes and sees 0.17% of the
bank. And note the one conversion you did get — account 258 signed up, took the trial,
and paid two days later. **The trial worked for the one person who actually engaged with it.**

Also: the trial has only been firing correctly at signup for about three days
(6 `trial_started` events in the last 2 days vs 8 grants in all prior history).
**You would be killing a feature before it has produced a single week of clean data.**

#### What to do instead: change the trial's *shape*, not its existence

> **Replace the 1-hour clock with a 40-question quota, no expiry.**
> Plus one full summary deck. No countdown, no burn-while-you-sleep.

Why this is strictly better:

- Kills the wasted-hour problem that is silently destroying every trial today.
- **40 questions is enough to judge quality. 10 is not.**
- Creates an *earned* paywall moment: they hit question 41 mid-session, engaged, on a
  roll. **That is the highest-intent instant that will ever exist in your funnel.**
  Today's paywall fires at an arbitrary clock time, often when they aren't even in the app.
- **It manufactures multiple sessions by construction** — which is the exact metric that's
  broken (6/42 return). A quota pulls people back across days; a clock pushes them away.
- Cheap to build: `user_question_progress` and `user_question_attempts` already track
  per-user counts. The guard becomes a count check instead of a date check.
- Show the counter — "28 من 40 سؤالاً مجانياً". Scarcity you can see beats scarcity you forgot about.

Keep the anti-abuse design you already have: `trial_grants` binds to email with
`ON CONFLICT (email) DO NOTHING`, so a delete-and-resignup can't farm trials. That part is
built correctly — don't lose it.

#### If you still want to kill the trial entirely

It's your call and you know this market. But you must replace it with something that
de-risks the purchase, or signups collapse. In order of how much I'd trust them:

1. **A public demo — 20 real questions playable on the landing page with no account.**
   Costs nothing per visitor, converts browsers into believers, and is excellent for SEO.
2. **Make the money-back guarantee loud.** You already offer 14 days — nobody sees it,
   it's buried in a legal page. Put "استرجاع كامل خلال 14 يوماً، بدون أسئلة" directly on
   the subscribe button. This is a trial in disguise, with the money captured first.
3. **Price so low the risk is trivial** — which is partly what 50 SAR/month achieves.

Doing (1) + (2) + monthly pricing is a coherent no-trial strategy. **Removing the trial
and changing nothing else is not a strategy — it's just a smaller funnel.**

---

## 6. TWO URGENT PROBLEMS FOUND DURING THIS REVIEW

### 6.1 A paying customer's account was deleted

`payment_events` id 8 — **livemode, 99 SAR, 2026-07-14, metadata `account_id: "231"`,
cardholder "Mohanad Alrgaibah"** — has `account_id = NULL` because account 231 no longer
exists. The FK is `ON DELETE SET NULL`, so the payment row survived and the customer didn't.

**68 account IDs in the range 160–289 are missing** — deleted accounts. And the repo already
contains `backend/scripts/recoverDeletedPaidAccount.mjs`, so this has happened before.

Some cleanup script ate a customer who had paid four days earlier.

> **Fix:** in every delete script and the admin delete route, refuse to delete any account
> that has a `payment_events` row with `status = 'paid'`. Five lines. It protects real money.

### 6.2 Send the two draft campaigns

112 recipients, copy written, `status = 'draft'` since 2026-08-03. The one marketing lever
that was loaded has never been fired.

---

## 7. PRIORITY ORDER — WHAT ACTUALLY MOVES REVENUE

Note that pricing is **#4**, not #1. That ordering is the main conclusion of this report.

### P0 — Stop losing what you already have (this week)
1. Block deletion of accounts with paid payment events.
2. Send the two draft broadcast campaigns.

### P1 — Fix the return-visit problem (this is the whole game)
3. **Quota trial (40 questions, no clock) replacing the 1-hour clock.**
4. **Ask for the exam date during signup.** One field. It turns on a 5-stage reminder
   sequence that is already fully built and has never run. Highest-leverage unused asset
   in the codebase.
5. **Day-1 and Day-3 email to anyone who did exactly one quiz session:**
   *"You answered 10 questions and got 6 right — here are the 4 you missed, and 10 more
   like them."* You already store `user_question_attempts` and already built the
   wrong-questions page. **This email writes itself from data you have.**
   Right now that user gets nothing and never returns.

### P2 — Learn where users come from
6. Capture `document.referrer` + UTM params into `funnel_events.props` on first landing hit.
7. Populate `login_history.country` from the `x-vercel-ip-country` header (column already exists).

### P3 — Pricing
8. Monthly 50 SAR + repriced annual, per §5.1. **After P1** — pricing changes on a leaky
   funnel only change how little you collect.

### P4 — Acquisition (see §8)

---

## 8. HOW TO GET MORE OF THE RIGHT USERS

**Where to spend the effort, in order:**

**1. Lead with nursing.** You have 1,307 nursing questions and 6 summary decks live in
production — and only **6 nursing accounts**. SMLE prep is a crowded market; SNLE prep is
much less so. Nursing colleges have tight, reachable cohorts. **You are a small fish in the
medical pond and could be a big fish in the nursing pond.** Point acquisition there first.

**2. Sell to groups, not individuals.** The `temporary_signup_links` system already exists
(24 links created, almost all single-use). Turn it into a group offer: a class rep buys
10 seats at a discount. **One conversation → 10 payments.** At your scale, ten group deals
is a business; a hundred individual signups is not.

**3. Time the sell to the exam.** Candidates are most willing to pay **4–8 weeks out from
their test date**. A monthly plan plus a captured exam date lets you sell at exactly that
moment instead of at a random one. This is the payoff for P1 item #4.

**4. Telegram.** `telegram_users`, `telegram_quiz_sessions`, and `telegram_user_engagement`
tables exist and are **all empty**. Saudi medical and nursing exam prep lives in Telegram
and WhatsApp groups. A free daily-question bot is the cheapest top-of-funnel that exists
for this audience, and **the schema is already sitting there**.

---

## 9. THE REVENUE MATH, HONESTLY

**Current state:** ~47 signups/month → ~2–3 external payers/month at 99 SAR
≈ **300–350 SAR/month gross.** Signup→paid conversion ≈ 5–7%.

**If you only change pricing to 50 SAR/month:**
Even assuming the halved price *doubles* conversion (7% → 15%):
47 signups × 15% = 7 payers × 50 SAR = **350 SAR/month.**

> **Month 1 revenue is flat.** This is the most important sentence in the report.
> Monthly pricing alone does not increase revenue at this traffic level.

**What monthly actually buys you** is compounding, which annual does not:
if 7 new payers/month and ~50% renew, by month 6 you're at ~17 active × 50 =
**~850 SAR/month** — and you have 17 customers to learn from instead of 3.

**What actually multiplies revenue** is P1. If you move return-visitors from 6/42 to
20/42, conversion follows engagement, and you get roughly **3× on the same traffic** —
and *then* the pricing change multiplies on top of it.

> **At ~47 signups/month, no pricing scheme produces meaningful revenue.**
> **You need more people at the top of the funnel and more of them coming back.**
> **Price is a multiplier on a number that is currently too small.**

---

## 10. WHAT I'D DO IN THE NEXT 14 DAYS

| Day | Action |
|---|---|
| 1 | Block deletion of paid accounts. Send the two draft campaigns. |
| 2–3 | Add exam-date to signup. Turn on the reminder sequence that's already built. |
| 4–6 | Replace the 1-hour clock trial with a 40-question quota + visible counter. |
| 7 | Ship the "your 4 wrong answers" Day-1 email. |
| 8 | Add referrer/UTM capture and `x-vercel-ip-country`. |
| 9–11 | Plan support in the payment paths (**fix the amount check in both paths first**), then launch 50 / 129 / 299. Update the refund policy for short terms. |
| 12–14 | Nursing push: group offer via temp links, Telegram daily-question bot. |

---

### One caveat on all of the above

**These are small numbers.** 62 accounts, 85 sessions, 3 payers. Everything in §2–§4 is a
real measurement of what actually happened, but at this sample size any single new user
moves the percentages a lot. Treat the *direction* as solid — the return-visit collapse is
too large and too consistent to be noise — and treat any specific conversion rate as
provisional until you have more volume. Which is itself an argument for the changes in P1:
they generate the volume you need to make every later decision on real evidence instead of
on three data points.
