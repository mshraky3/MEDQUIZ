# Account deletion for Google Play (design only, 2026-10-28)

**Status: NOT implemented on purpose.** The brief said to build the page and the in-app entry only if a delete-account endpoint already
existed. It does not, so this is the design. Deleting data is the risky part; nothing was written, deployed or deleted.

## What exists today
- `DELETE /users/:userId` in `backend/app.js` (about line 6000): **admin only** (`adminAuth`, the admin key). It deletes, in one transaction, the
  question attempts, quiz sessions, topic analysis, streaks and analysis rows, then the `accounts` row.
- It **refuses (409) any account with a paid `payment_events` row** ("Refund or archive it instead"). That rule is deliberate: a paying
  customer's account must never vanish by accident (account 231 history in the 2026-08 monetisation analysis).
- There is no student-facing delete, no "request deletion" form and no web page. The privacy policy (`legal.js`) only says data is kept
  "until you request account deletion", and tells people to ask.
- Rows other than those listed (notifications, goals, seen questions, success stories, reports, email logs, group seats, error logs, funnel events)
  are not touched by the admin delete: whoever builds the student endpoint must list every table that holds `account_id`/`user_id` first.

## What Play requires (the rule applies because the app lets people sign in with an account; it applies fully if sign-up is in the app)
1. The Data safety form must give a **web URL** where a user can ask for deletion of the account and its data.
2. The app should offer a **path inside the app** to start the request.
(Google Play Console Help, "Understanding Google Play's app account deletion requirements"; I did not re-read the page today, so check the current text
when filling the form.) A request flow (email or form) is accepted by Google as long as the URL is public, explains the steps and says what is deleted and
what is kept and for how long.

## Design (smallest safe version, no automatic deletion)
**A. Web page `/delete-account`** on the website (Arabic and English, same copy files as every page, no login needed to read it):
what happens, how to ask (email `alshraky3@gmail.com` from the address of the account, subject "Delete my SQB account"), that the owner replies within
a stated time, what is deleted (profile, quiz history, analysis, streaks, notes and progress) and what is kept (payment records for the legal/accounting
period, anonymised counts). Linked from the privacy policy, the footer and the Play Data safety form.
**B. In the app** (Account screen, Play and sideload builds): a row "Request account deletion" that opens the web page in the browser (this is an
administrative page, allowed in the Play build) or opens a pre-filled email. One string pair in `appCopy.ts`.
**C. Owner process** (manual, uses the existing admin endpoint): verify the request comes from the account's email, run the admin delete; if the
account has a paid row, do not delete: anonymise instead (the next step) and tell the person why.
**D. Later, only with an explicit yes:** a self-service endpoint `POST /api/account/delete-request` (requireSession) that records a request row and emails
the owner, and eventually `DELETE /api/account` (requireSession + password re-entry + email code) that reuses the admin deletion in a transaction. For paid
accounts: anonymise (blank email and name, keep the payment rows) instead of refusing. Needs a schema change (a request table), tests with PGlite and the
owner's review of the table list above.

## Decisions needed
1. Is a request page (A + B + C) acceptable for now? It satisfies Play without any automatic deletion.
2. What to do with paid accounts: refuse (today), or anonymise?
3. The retention period to state for payment records.
