# Account deletion (self-service): design and open questions

Status: **design only, nothing implemented, no code and no database change in this PR.**
Written 2026-10-30. Google Play needs account deletion before the Android app can go public
(a web URL for the Data safety form plus a path in the app).

I stopped at the design because the handoff said to stop when a decision is needed, and five of
the decisions below are the owner's (money, law and abuse), not mine. Everything else is ready
to build the moment they are answered.

## QUESTIONS FOR THE OWNER (answer these, then I implement)

1. **Paid accounts: anonymise instead of delete?** Today `DELETE /users/:userId` (admin) refuses with 409 any
   account with a paid `payment_events` row, and `project-rules/SQB.md` says "never delete an account that has a
   paid row". The handoff asks to keep payment rows without personal data. Proposal: a student who ever paid is
   **anonymised, not deleted** (the `accounts` row stays as an empty shell, so every payment row, report and money
   number keeps working); a student who never paid is **deleted** with the existing admin code path.
   Is relaxing the rule that way OK?
2. **What must the payment rows keep, and for how long?** `payment_events.raw_payload` is the raw Moyasar
   JSON and I cannot see its real shape from the repo (no database here). Proposal: keep `gateway_ref`, `amount_halalas`,
   `currency`, `status`, `livemode`, `event_type`, `received_at` and the plan id; remove everything that identifies
   a person in `raw_payload` (payer name, e-mail, card holder, card last digits, IP, anything under `metadata` except the plan). Needs
   your accountant to confirm what ZATCA/VAT records require, and a **retention period to print on the public page**
   (I will not invent a number; your accountant knows it).
3. **Free-allowance abuse.** The free tier is 40 questions for life. If deleting frees the e-mail address, the same
   person can sign up again and get 40 more. Options: (a) accept it, (b) keep a one-way hash of the e-mail
   (a "tombstone", no readable address) so a re-signup does not get a fresh allowance, (c) block deletion for free accounts
   that spent their allowance. (b) is the usual answer but a hash of an e-mail is still personal data under the PDPL:
   lawyer's call. `trial_grants.email` (legacy 1-hour trial table, read only by reports) is already an e-mail kept after deletion.
4. **Group plans and unused paid time.** Deleting a group **owner** cascades to the group and its seats
   (`subscription_groups.owner_account_id ON DELETE CASCADE`), so other students would lose access. Proposal: refuse (409,
   clear message) while the account owns a group with claimed seats or has paid time left, and tell the person to contact
   support (refund policy then applies). Deleting never refunds automatically. OK?
5. **Wording of the promise.** The public page must say exactly what is kept (payment records, how long, why) and that
   copies outside our database (Vercel logs, Moyasar, the e-mail gateway) are not touched by the button. Needs your
   (or your lawyer's) read; the Saudi PDPL paragraph that is in the copy PR already promises "destroy on request".

Also: there is an older design on branch `feat/account-deletion` (`mobile/docs/ACCOUNT-DELETION.md`, 28 Oct, not on main) that proposes a
manual request page only (e-mail the owner). This design is the self-service version; it keeps that page as the Play URL.
Whichever you pick, the two docs should be merged into one.

## What exists today (read from the code)

- `DELETE /users/:userId` (`backend/app.js`, admin key only): refuses accounts with a paid row, then in one transaction deletes
  `user_question_attempts`, `user_quiz_sessions`, `user_topic_analysis`, `user_streaks`, `user_analysis`, then the `accounts` row. It relies on
  foreign keys (`ON DELETE CASCADE` / `SET NULL`) for everything else, and I could not check those keys on the live database (no access).
- Sign-in is by e-mail; a password is optional (Google sign-in accounts have `password` NULL and a `google_id`). Passwords are stored
  lowercased in plaintext (known, owner's decision; not touched here).
- E-mail codes already exist: `POST /send-otp` with a `purpose` (`signup`, `reset`), 6 digits, 5 tries, 5 sends per 15 minutes, table `signup_otps`.
- `requireSession` identifies the logged-in student from the token; `requireOwnUser` exists for `:userId` routes.

### Inventory of personal data (from the DDL in the repo)

| Table | Link | On account deletion today | Proposed |
|---|---|---|---|
| `accounts` | itself: `username`, `email`, `password`, `google_id`, exam date, plan fields, mail stamps | deleted (admin path) | non-payers: delete; payers: anonymise (blank `username`/`email` to `deleted-<id>@deleted.invalid`, NULL password and `google_id`, `email_opt_out = true`, access ended) |
| `user_question_attempts`, `user_quiz_sessions`, `user_topic_analysis`, `user_streaks`, `user_analysis` | `user_id` | deleted | deleted (same list, also for payers) |
| `final_review_sessions`, `final_quiz_attempts` | `user_id` / `session_id` | not in the admin list; FK unknown (DDL not in repo) | delete explicitly |
| `user_question_progress`, `user_achievements`, `user_goals`, `user_notifications`, `summary_progress`, `login_history` (IP, user agent), `temp_link_accounts`, `success_stories` (public name and quote) | `user_id`, FK `ON DELETE CASCADE` | cascade | delete explicitly (do not rely on the FK) |
| `subscription_groups` (owner) / `group_seats` (claimed by) | `ON DELETE CASCADE` / `SET NULL` | cascade / null | see question 4 |
| `payment_events` | `account_id` `ON DELETE SET NULL`; `raw_payload` JSON | account refused if paid | keep rows, scrub the JSON (question 2) |
| `funnel_events` | `account_id` `SET NULL`, `anon_id` | nulled | null `account_id`; `props` JSON must be checked for e-mail |
| `trial_grants` | `email` (kept on purpose) | kept | question 3 |
| `question_reports` (`user_id`, `user_email`, no FK), `suggestions`, `broadcast_recipients`, `signup_otps`, `telegram_users` | e-mail or id, no FK | untouched | blank the e-mail / delete rows for that e-mail |
| Outside the database | Vercel and gateway logs, Moyasar, Resend, Telegram | n/a | cannot be deleted by the button; say so on the page |

The exact column lists of tables created outside the repo (`accounts`, `user_*`, `final_*`) are not in the code base; the implementation step
starts with a read-only query of `information_schema` on Supabase by the owner (or a dry-run mode that only counts rows) before any DELETE is written.

## Design

**Re-authentication (no new login system).** The student must prove it is them *and* that they mean it:
1. `POST /api/account/delete/code` (`requireSession`): e-mails a 6-digit code (reuses the OTP table, purpose `delete_account`, same throttles).
2. `DELETE /api/account` (`requireSession`): body `{ code, password? , confirm: "DELETE" }`. Password accounts must also send the current password;
   Google-only accounts rely on the code. Wrong code or password: 401, nothing happens. Admin accounts and `is_admin_created` accounts: refused (an admin removes them).

**Deletion transaction.** One transaction on one client (same pattern as the admin route): refuse per questions 1 and 4, delete the personal rows
in the table above, delete or anonymise the `accounts` row, scrub `payment_events.raw_payload` for that account, write one audit row, COMMIT.
Reuse: extract the body of the admin route into `services/accountDeletionService.js` so the admin route and the new route call the same function
(admin keeps its 409 for paid accounts unless question 1 is answered yes). Session tokens die with the row; for anonymised accounts the session is cleared.
Idempotent: a second call finds nothing and answers 200/404 without error.

**Web.** A public page `/delete-account` (Arabic and English, in `i18n/copy/`, linked from the footer and the privacy policy, one new sentence on the privacy
page) that says what is deleted, what is kept and for how long (from question 2), how to do it logged in (Account page, "Delete my account": warning, code, confirm),
and how to ask by e-mail if you cannot log in (support address). This is the URL for the Play Data safety form. The Android app gets one row in Account that opens
this page in the browser (allowed in the Play build, it is not a purchase); the in-app flow can follow later. **Needs the answers to 1, 2, 3 and 5 before the text is final.**

**Tests (backend, node:test).** The deletion service against a fake client (statement order, rollback on error, paid vs non-paid branch, group owner refusal,
idempotency, admin refusal), the OTP gate (wrong/expired code, no password, wrong password, Google account), and a PGlite run of the real SQL if PGlite is available.

## Database changes (plain list)

If you answer as proposed: **one additive column** `accounts.deleted_at TIMESTAMPTZ NULL` and **one small table** `account_deletions`
(`id`, `account_id` (no FK), `requested_at`, `completed_at`, `method` ('self' | 'admin'), `anonymised boolean`; no e-mail, no name), both created by `ensureSchema()`
with a `SCHEMA_BOOTSTRAP_VERSION` bump (never in a request handler). If you pick question 3(b): a `deleted_email_hashes` table (`hash`, `deleted_at`). **No existing column is dropped or changed.**

## Risk

Irreversible data deletion on the live Supabase database, which has no automatic backups: take a `pg_dump` first, ship behind an env flag
(`ACCOUNT_DELETION_ENABLED`, off by default), and test with a throw-away account before telling anyone. Deleting money rows is never part of this.
