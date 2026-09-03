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
| S1-06 | Write six Arabic SMLE logistics pages | **done** — `ddf8169`, `/exams/smle/*` in both languages |
| S1-07 | Do the same six pages for SNLE | **done** — `ddf8169`, `/exams/snle/*` in both languages |
| S1-08 | Declare and prerender English | **done** — `c53f843`, full `/en` tree |
| S1-09 | Add FAQPage structured data | **done** — `2db6e98` |
| S1-10 | Put a weekly indexing check on the calendar | **done** — `docs/SEO_WEEKLY_CHECK.md`, needs running weekly |

**Why S1-06/07 were skipped at first**, kept here because the reasoning still
applies to anything like them. They need exam facts — question count, scoring,
pass mark — and the sources contradicted each other while scfhs.org.sa could not
be reached to settle it. Publishing wrong exam logistics to candidates is worse
than publishing nothing, so they waited for the official guide rather than for a
better guess.

**Both are now done** (`ddf8169`). scfhs.org.sa turned out to be reachable, so
both official guides were read end to end and the pages were written from them:

- SNLE — <https://scfhs.org.sa/sites/default/files/2025-09/SNLE%20Applicant%20Guide%20.pdf>
- SMLE 2026 — <https://scfhs.org.sa/sites/default/files/2026-05/Saudi%20Medical%20Licensure%20Examination%20(SMLE)%20Blueprint_2026_0.pdf>

The facts that could not be settled before are in `docs/SNLE_BLUEPRINT_AUDIT.md`.
Note the two exams do **not** share a pass mark: SNLE is 500 on the 200–800
scale, SMLE is 560.

**What shipped: `/exams`, thirteen pages, both languages.**

| Path | Covers |
|---|---|
| `/exams` | both exams side by side, and what differs |
| `/exams/format` | 200 questions, 2 x 100, 120 min each, pilot items, timing |
| `/exams/test-day` | arrival, ID, security, what is provided, what is a violation |
| `/exams/{smle,snle}` | one hub each, six short answers linking down |
| `/exams/{smle,snle}/blueprint` | content areas and weights |
| `/exams/{smle,snle}/passing-score` | the mark, the scale, how it was set, results |
| `/exams/{smle,snle}/eligibility` | who may sit, e-application, Prometric, windows |
| `/exams/{smle,snle}/attempts` | four a year, what spends one, improving after a pass |

Three decisions worth knowing about, because they will look like omissions
otherwise:

1. **`format` and `test-day` are shared, not one per exam.** The two guides
   describe them in identical terms, so a per-exam version would be the same
   page at two URLs — thin content, not two rankings. Each exam hub links to
   both, so each exam still presents six topics.
2. **The SMLE blueprint page publishes no percentage per content area.** The
   medical guide gives item counts per topic and no domain weights, so any
   percentage would be our inference. Inferring exam facts is what got these
   tasks skipped in the first place. The page says so and links the official
   table.
3. **`/guides/snle-blueprint` was folded into `/exams/snle`.** It was written
   days earlier as one comprehensive page because this structure did not exist
   yet; keeping both would have put two of our own pages in front of the same
   query. The guides hub keeps a card pointing at the new section. Nothing had
   been deployed, so no URL was lost.

## Sprint 2 — convert the traffic you already have (weeks 3–6)

17 people used all 40 free questions and 1 subscribed. 38 opened checkout and 3
clicked pay. These fix the moment where intent is highest and the experience is
weakest.

| ID | Task | Status |
|----|------|--------|
| S2-01 | Charge the free allowance on answer, not on serve | **done** — `90f8b34` |
| S2-02 | Show their own results before showing the price | **done** — `a8dfa5d` |
| S2-03 | Ship a no-account demo at `/demo` | **done** — `74a1fba` |
| S2-04 | Make Google Sign-In the primary signup path | **done** — `775f2ef` |
| S2-05 | Ask for the exam date at first run, not in settings | **done** — `98083e4` |
| S2-06 | Fix summary progress recording zero rows | **done** — `d4a4fa5` |
| S2-07 | Add a day-1 "here are the four you missed" email | **done** — `1a0e616` |

Sprint 2 is complete. Two things were found and fixed while working through it
that were not on the list: answer explanations were rendering their raw
markdown on all 240 published question pages (`33762fe`), and the day-1 email
had been going out saying "The the Saudi Medical Licensing Exam".

**Watch after deploy:** free-to-paid conversion (S2-01 changes when people meet
the paywall), signup conversion (S2-04 changes what the form looks like),
`demo_start` / `demo_complete` events, and exam-date coverage — the target for
S2-05 was 60% of new accounts, from 18 of 116 today.

## Sprint 3 — make it safe to pay you (weeks 4–7)

Both competitors that outrank you carry testimonials in their top navigation.
You have none, and you are asking for up to 300 SAR.

| ID | Task | Status |
|----|------|--------|
| S3-01 | Collect five real testimonials | **not started** — 3 power users with 17/21/38 sessions to ask |
| S3-02 | Build a success-stories page and ask for submissions in-app | **done, empty** — `4eeacb7` + admin screen `HEAD`; waiting on S3-01 for content |
| S3-03 | Put the 14-day refund promise on the pay button | **done** — `08d2710` (3 days monthly / 14 otherwise, per the policy) |
| S3-04 | Show live counts pulled from the database | **done** — `35ea502` |
| S3-05 | Name the people behind the question bank | **not started** — also an E-E-A-T signal for Sprint 1 |

**Blocked on you, not on code:**

- **S3-01** — the page, the submission form and the in-app ask are built and
  empty. Five real quotes is what makes them worth anything. Your three power
  users have 17, 21 and 38 sessions; email them personally.
- **S3-05** — author bylines need the real names and credentials of whoever
  writes and reviews the explanations. I will not invent those.

**Two policy questions this raised:**

1. The refund policy does not mention group plans at all (section 1 lists
   "monthly, 4-month, and annual"). Group checkout therefore shows the
   guarantee without a day count. Adding "including group plans" to the
   4-month line in section 2 would fix it.
2. ~~The success-stories review queue has endpoints but no admin screen.~~
   Done — /admin/stories. Note that approving does not publish: run
   `node scripts/exportSuccessStories.js --apply` in backend/, commit the JSON,
   and deploy.

## Sprint 4 — channels and the nursing bet (weeks 5–9)

| ID | Task | Status |
|----|------|--------|
| S4-01 | Check the nursing track against the official SNLE blueprint | **done** — `docs/SNLE_BLUEPRINT_AUDIT.md`; all four sections out of band, management & leadership is 0% (figures corrected in `HEAD` — the first pass de-duplicated rows the database actually holds) |
| S4-02 | Lead acquisition with nursing | **done (code)** — `0e42235`, `/guides/snle-blueprint` in both languages |
| S4-03 | Sell the group plans directly instead of waiting to be found | **done (code)** — `45e6d36`; the outbound selling is still yours |
| S4-04 | Decide about Telegram — commit or stop | **needs your decision** — evidence below, nothing changed yet |
| S4-05 | Treat AI search as a real channel | **done** — `b3d14dc`, llms.txt + a `channel` on every landing_view |
| S4-06 | Reactivate the 51 dormant trial accounts — once | **ready to send** — `663044a`; never run, start with the dry run |

**S4-02 — what shipped, and what did not.** The nursing track had no public page
of its own: five SMLE guides, an SMLE past-paper hub, an SMLE guides kicker.
`/guides/snle-blueprint` is the first, written from the official SCFHS applicant
guide and citing the edition it read. It does not claim we cover the blueprint —
because `docs/SNLE_BLUEPRINT_AUDIT.md` says we do not. What it is not: nursing is
still absent from the landing hero, the past-paper hub is still SMLE-first, and
the Telegram channel posts medical questions only (see S4-04).

**S4-03 — the missing number.** The plan cards said "SAR 60 per account" and
never what those five people would otherwise pay: SAR 129 each for the same four
months. The comparison now renders from the server's own plan data. That is the
whole code contribution; nobody is going to find `/groups` on their own, and
selling it means going to batch reps and study groups, which is not something
code does.

**S4-06 — before you send.** Run the dry run first. It writes no rows and no
schema, exports the target list to `backend/exports/`, and tells you how many
free questions those accounts still hold:

```bash
node scripts/reactivateDormantAccounts.js
```

Then `--preview` (one sample to you), then `--apply`. A week later, `--report`.
Accounts that already spent all 40 are excluded — `runTrialEndedJob` owns them.

### S4-04 — the Telegram decision

Nothing here has been changed. The facts, so the call can be made on them:

- The channel posts up to **3 medical questions a day**, driven by
  `.github/workflows/cron.yml` at 07:00, 13:00 and 18:00 UTC. Free.
- Exposure is bounded per window, not for ever. The 90-day dedupe window caps it
  at **270 distinct questions in any 90 days**, and each post is deleted after 10
  days — but the window then reopens and selection is random, so over a year
  roughly **900 distinct medical questions** appear publicly, about a third of
  the 2,928 in that track. (Coupon-collector estimate: 1,095 posts drawn from
  2,928 with a 90-day exclusion. Nobody has counted the real figure; the table
  `telegram_sent_questions` holds it.) Each is visible for ten days, so the bank
  is not sitting on Telegram — but "nothing is being given away" was too strong.
- **Nursing is never posted.** `pickChannelQuestion` is hardcoded to the medical
  track. The track that converts several times better has no presence at all on
  the one channel that exists.
- The maintenance surface is real: ~640 lines of services plus routes, an admin
  page and three tables, which produced a bug this month (`a03f781`).
- Result after the site started linking it: 2 subscribers, 2 visits.

**The recommendation: stop the schedule, keep the code and the channel.** Not
because it costs money — it does not — but because three posts a day into a room
of two is not an experiment, it is a habit, and it cannot produce a signal either
way. The channel also has no reason to exist for a student: everything it posts
is already free on `/questions` and `/demo`. Stopping is deleting three cron
lines and is reversible in a minute.

**If you would rather commit**, the two things that would actually change the
number are: post nursing questions (one-line change, and it is the audience that
converts), and give the channel something the website does not have — a daily
question with the explanation *discussed*, or the weekly weak-topic digest that
already exists as a DM. Promotion alone will not fix a channel with nothing on it
that a student cannot get for free elsewhere.

**Found while working through Sprint 4, not on the list:** the Arabic
`/refund-policy` page told crawlers "the service is currently free and takes no
payments" — it has not been free since June, and the page it describes has
carried a real 3/14-day refund window all along. Fixed in `b3d14dc`.

## Sprint 5 — pricing, deliberately last (October, not before)

July sold 4× at one 99 SAR annual price. August sold 3× across 129/50/50 on 60%
more signups, with the annual at 300 SAR and annual sales stopped. That proves
nothing on its own — but you cannot read a pricing signal through a funnel this
leaky, which is what Sprints 2 and 3 are for.

| ID | Task | Status |
|----|------|--------|
| S5-01 | Re-test the annual anchor once you have 30+ customers | **still blocked on customers** — the test can't run, so the measurement it needs was built instead |
| S5-02 | Build the renewal sequence monthly plans need | **done** — `80bb34d`, three rungs either side of the expiry |
| S5-03 | Make the refund policy term-proportional | **already done** — the policy has scaled with the term since June; the backlog line was stale |

**S5-01 — blocked on customers, not on code, but not left alone.**

The gate is real: 6 paying accounts against the 30 this row asks for, and
Sprints 2–4 have just changed the funnel underneath. A price read taken now
would mostly be reading those changes.

What could not wait is the measurement. A price test cannot be reconstructed
afterwards, because the losing half of it leaves no trace: a payment records
what somebody paid, and nothing anywhere recorded what the people who did not
pay had been quoted. Prices come from environment variables, which keep no
history — change `PLAN_ANNUAL_PRICE_HALALAS` and the old number is simply gone,
along with the date it changed. So the exposure is now recorded at the moment
it happens, and the arms of the next test start filling from this commit
forward. There is nothing before it.

Three things were wrong on the way there:

- **Three events were being thrown away.** `POST /api/funnel` answers 204 to any
  name not on its whitelist, which is right for an open endpoint and invisible
  from the browser. `subscribe_plan_select` had been dropped since the five-plan
  ladder shipped, and both demo events since the demo did — each added in a
  commit that never touched the whitelist. A test now fails the build when the
  React source emits a name the server will not store.
- **No client event was ever attributed to an account.** The route has always
  verified a username and session token the way the engagement beacon does, but
  `trackFunnel` never sent them, so `account_id` was NULL on every row the
  browser wrote — and the join to `payment_events` that `analytics.js` describes
  in its own header did not exist. It does now, which matters most on
  `/subscribe`, where everyone is logged in and an anon id dies with a cleared
  browser or a payment finished on a second device.
- **Conversion was never readable per plan.** `funnelSnapshot` groups by event
  name and ignores `props` entirely, so even the plan id already on
  `subscribe_pay_click` could not be reached from any admin screen.

`scripts/priceTestReport.js` is the reader: exposures grouped by the ladder
each person saw, followed through pick → card → payment, with money taken from
`payment_events` rather than from a beacon adblock can drop. It refuses to name
a winner below 30 buyers, it excludes anyone shown two different ladders, and
it decides on revenue per thousand exposures rather than conversion — a cheaper
price that converts better can still earn less, which is the entire question the
anchor asks. It is read-only and has not been run; there is nothing yet to read.

One limitation worth stating before anyone quotes a number off it: the arms run
in sequence, not side by side. Nothing here can show two prices at once, so a
comparison also contains every other thing that changed between the two dates.
The script says so in its own output when it detects it.

**S5-02 — what the sequence is.** Nothing auto-renews, by design and by
promise, so every expiry is a manual re-sell. There was one email, fired once
when a subscription came within seven days of ending, and then silence — which
meant the moment with the most evidence behind it, the student opening a locked
question bank, was the moment nothing was said.

| Rung | When | What it says |
|---|---|---|
| 1 | 7 days left | why there is no automatic charge, and what lapsing costs |
| 2 | the day before | the same fact without the explanation in the way |
| 3 | 3 days after | their own record of the term, and the door left open |

It stops at three. A fourth is arguing with someone who has decided.

Two things worth knowing:

- **The stage resets on every activation.** `renewal_reminder_stage` tracks the
  current term, not the account. Without the reset in `verifyAndActivate` and
  `grantSubscription`, a renewing customer would be reminded once and never
  again — there is a test named after exactly that failure.
- **Refunded customers are excluded.** A full refund sets the status and pushes
  the expiry to `NOW()`, which drops the account straight into this window. They
  would have been told three days later what they achieved with the term and
  invited to buy it again. Found while reading the refund path, not in testing.

**S5-03 was already true.** The refund policy has scaled its window with the
plan term since June — three days on monthly, fourteen on the longer plans, with
the reasoning written into the document. The backlog line was stale, not
outstanding. What is still open from Sprint 3 is that the policy never names
group plans, so a group buyer sees the guarantee with no day count.

---

## Also shipped alongside Sprint 1

Honesty and trust fixes that were not numbered tasks but blocked everything else
(`aa57b44`): removed the false "hundreds of students passed" claim, disabled ad
code that never served, removed the "we show ads" line from the cookie banner,
and fixed the Google Sign-In button's language and placement.
