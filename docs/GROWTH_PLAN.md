# Growth plan — backlog and status

Diagnosis and full reasoning live in the plan artifact; this file is the working
backlog, so that "what is done and what is not" survives outside a chat window.

**Update the Status column when you finish something.** A task is `done` only
when its "Done when" is actually true, not when the code is written.

Baseline when this was written (2026-08-30): 5 pages indexed, 271 URLs in the
sitemap, 7 URLs had ever earned an impression. 116 accounts, 6 paying. 17
accounts had spent all 40 free questions and 1 of them subscribed.

---

## Sprint 1 — be findable (weeks 1–4)

Nothing else in this plan matters if nobody arrives.

| ID | Task | Status |
|----|------|--------|
| S1-01 | Prerender the real guide bodies | **done** — `f065909` |
| S1-02 | Link the guides from the landing page and every footer | **done** — `f065909` |
| S1-03 | Request indexing for the 7 discovered-but-unindexed URLs | **not started** — manual, in Search Console |
| S1-04 | Publish 200–400 questions as public pages | **done** — `f065909`, 240 questions at `/questions` |
| S1-05 | Build a past-papers hub | **done** — `1d1ae3a` |
| S1-06 | Write six Arabic SMLE logistics pages | **skipped by decision** — see note below |
| S1-07 | Do the same six pages for SNLE | **skipped by decision** — see note below |
| S1-08 | Declare and prerender English | **done** — `c53f843`, full `/en` tree |
| S1-09 | Add FAQPage structured data | **done** — `2db6e98` |
| S1-10 | Put a weekly indexing check on the calendar | **done** — `docs/SEO_WEEKLY_CHECK.md`, needs running weekly |

**Why S1-06/07 were skipped.** They need exam facts — question count, scoring,
pass mark — and the sources contradicted each other while scfhs.org.sa could not
be reached to settle it. Publishing wrong exam logistics to candidates is worse
than publishing nothing. Revisit only with the official SCFHS applicant guide
open. This leaves real ranking ground to competitors, knowingly.

## Sprint 2 — convert the traffic you already have (weeks 3–6)

17 people used all 40 free questions and 1 subscribed. 38 opened checkout and 3
clicked pay. These fix the moment where intent is highest and the experience is
weakest.

| ID | Task | Status |
|----|------|--------|
| S2-01 | Charge the free allowance on answer, not on serve | **done** — `90f8b34` |
| S2-02 | Show their own results before showing the price | **not started** |
| S2-03 | Ship a no-account demo at `/demo` | **not started** |
| S2-04 | Make Google Sign-In the primary signup path | **done** — `775f2ef` |
| S2-05 | Ask for the exam date at first run, not in settings | **not started** |
| S2-06 | Fix summary progress recording zero rows | **not started** |
| S2-07 | Add a day-1 "here are the four you missed" email | **not started** |

- **S2-02** — Question 41 is the highest-intent instant in the funnel and it
  currently renders a price list. Accuracy by specialty, weakest topic and wrong
  answers are all already computed. Lead with their numbers, put plans below.
- **S2-03** — 120 people chose a track, 42 requested a code: 78 walked at the
  form. They wanted to see questions, not open an account. Indexable, so it
  doubles as Sprint 1 work.
- **S2-05** — 18 of 116 accounts have an exam date. The five-stage reminder
  sequence in `lifecycleJobs.js` is fully built and only fires for those 18.
- **S2-06** — 44 users, 868 minutes in summaries, `summary_progress` empty. A
  popular feature that cannot be measured, personalised or emailed about.
- **S2-07** — 34 accounts ran exactly one session and stopped. Every attempt is
  stored and the wrong-questions page exists; this email writes itself. Goes in
  `backend/services/lifecycleJobs.js` beside the comeback job.

## Sprint 3 — make it safe to pay you (weeks 4–7)

Both competitors that outrank you carry testimonials in their top navigation.
You have none, and you are asking for up to 300 SAR.

| ID | Task | Status |
|----|------|--------|
| S3-01 | Collect five real testimonials | **not started** — 3 power users with 17/21/38 sessions to ask |
| S3-02 | Build a success-stories page and ask for submissions in-app | **not started** |
| S3-03 | Put the 14-day refund promise on the pay button | **not started** — already written, buried in `i18n/copy/legal.js` |
| S3-04 | Show live counts pulled from the database | **not started** |
| S3-05 | Name the people behind the question bank | **not started** — also an E-E-A-T signal for Sprint 1 |

## Sprint 4 — channels and the nursing bet (weeks 5–9)

| ID | Task | Status |
|----|------|--------|
| S4-01 | Check the nursing track against the official SNLE blueprint | **not started** — possible uncovered 10% (management & leadership) |
| S4-02 | Lead acquisition with nursing | **not started** — 26 nursing accounts, but 3 of 6 payers are nursing |
| S4-03 | Sell the group plans directly instead of waiting to be found | **not started** — built, verified, zero seats sold |
| S4-04 | Decide about Telegram — commit or stop | **not started** — everything built, 2 subscribers and 2 visits to show |
| S4-05 | Treat AI search as a real channel | **not started** — 18 visits from ChatGPT/Perplexity, more than Bing |
| S4-06 | Reactivate the 51 dormant trial accounts — once | **not started** — send once, measure, let it go |

## Sprint 5 — pricing, deliberately last (October, not before)

July sold 4× at one 99 SAR annual price. August sold 3× across 129/50/50 on 60%
more signups, with the annual at 300 SAR and annual sales stopped. That proves
nothing on its own — but you cannot read a pricing signal through a funnel this
leaky, which is what Sprints 2 and 3 are for.

| ID | Task | Status |
|----|------|--------|
| S5-01 | Re-test the annual anchor once you have 30+ customers | **blocked** — needs a stable baseline |
| S5-02 | Build the renewal sequence monthly plans need | **not started** |
| S5-03 | Make the refund policy term-proportional | **not started** |

---

## Also shipped alongside Sprint 1

Honesty and trust fixes that were not numbered tasks but blocked everything else
(`aa57b44`): removed the false "hundreds of students passed" claim, disabled ad
code that never served, removed the "we show ads" line from the cookie banner,
and fixed the Google Sign-In button's language and placement.
