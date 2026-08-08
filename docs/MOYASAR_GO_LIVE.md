# Moyasar Go‑Live Runbook (SQB / SMLE Question Bank)

> **⚠ Historical — the go-live it describes happened on 2026-07-12.** Prices and
> the single-plan model below are out of date: the ladder is now 50 / 129 / 300
> SAR plus two group plans, and `SUBSCRIPTION_PRICE_HALALAS` no longer exists.
> **For anything you need to do on Moyasar today, read `MOYASAR_CHECKLIST.txt`
> in the repo root.** This file is kept for the compliance-review and
> domain/webhook setup steps, which have not changed.

How to take the implemented Moyasar integration from local code to a **publicly
reachable, fully testable** site that passes Moyasar's compliance review, then
flip to **live** payments.

- **Frontend (site):** `https://www.smle-question-bank.com` (Vercel, SPA)
- **Backend (API):** `https://medquiz.vercel.app` (Vercel, Express serverless)
- **Legal entity:** شركة دار الخبرة التجارية — CR **7040567922** (docs in `payment-data/`)
- **Plan (superseded):** at the time, a single annual subscription of 99 SAR

---

## 0. The big picture (answers to the key questions)

**Does the site need to be live, or is staging enough?**
Moyasar reviews a **publicly accessible HTTPS** site and tests the **real payment
flow**. localhost will NOT work (they can't reach it, and webhooks require a
public HTTPS URL). A public staging URL is technically acceptable, but the
simplest path is your existing production domain. **Run the review in TEST mode**
(test keys) on the public site — the flow is fully exercisable with test cards and
no real money moves. Switch to **live keys only after Moyasar approves.**

**What Moyasar checks (compliance):** business identity + CR, a clear description
of what you sell, **price in SAR shown before payment**, **refund/cancellation
policy reachable before paying**, privacy policy, terms, and a working
**contact** channel — plus a functional pay → 3‑DS → redirect → result flow.

---

## 1. Environment variables (Vercel → backend project → Settings → Environment Variables)

These already exist on the live backend (DB etc.). **Add / confirm** the payment
ones. Do **not** commit secrets.

| Variable | Value | Notes |
|---|---|---|
| `PAYMENT_ENFORCEMENT_ENABLED` | `true` | master switch |
| `SUBSCRIPTION_PRICE_HALALAS` | `9900` | 99 SAR |
| `SUBSCRIPTION_CURRENCY` | `SAR` | |
| `MOYASAR_PUBLISHABLE_KEY` | `pk_test_…` (then `pk_live_…`) | safe to expose |
| `MOYASAR_SECRET_KEY` | `sk_test_…` (then `sk_live_…`) | **server‑only**, reveal via the 👁 icon in the dashboard |
| `MOYASAR_WEBHOOK_SECRET` | a long random string you invent | must equal the webhook **Secret Token** (step 3) |
| `ADMIN_KEY` | a long random string you invent | **required** — locks every admin endpoint (`/admin/*`, `/get_all_users`, question editing, temp links, …). Without it, the admin panel returns 503 in production. Enter this same key once on the admin pages' gate screen. |
| `CRON_SECRET` | random string (recommended) | Vercel sends it on cron calls; blocks strangers from triggering cron endpoints |

Optional fee-estimate tuning for the bi-daily subscriptions PDF report
(used only when Moyasar doesn't include an exact `fee` on a payment):

| Variable | Default | Meaning |
|---|---|---|
| `MOYASAR_MADA_FEE_PERCENT` | `1.0` | mada fee % |
| `MOYASAR_CARD_FEE_PERCENT` | `2.75` | Visa/Mastercard fee % |
| `MOYASAR_FEE_VAT_PERCENT` | `15` | VAT applied on the fee |

Keep the existing `DBHOST/DBPORT/DBNAME/DBUSER/DBPASSWORD`, `APIKEY`, `R2_*`.

> **Subscriptions PDF report:** every 2 days the backend emails
> `alshraky3@gmail.com` a PDF of all new paid subscriptions (name, amount,
> Moyasar fee, net). It rides on the existing daily 9:00 cron
> (`/api/cron/daily-emails`) and only sends when the last report is ≥ 47 h old.
> Manual trigger for testing (needs the admin key):
> `GET /api/email-test/subscription-report?days=2` with header `x-admin-key: <ADMIN_KEY>`.

> The schema (subscription columns + `payment_events` + one‑time grandfathering)
> **auto‑applies on backend boot** — no manual SQL step. Watch the deploy logs for
> `Payment/subscription schema ensured`.

---

## 2. Deploy

The API base now **auto‑detects** (localhost → local API, any other host →
`medquiz.vercel.app`), so there is no manual URL toggle to remember.

Deploy the **same way the current live site is deployed** (Git push if the Vercel
projects are connected to the repo, otherwise Vercel CLI):

```bash
# Backend  (from backend/)
vercel --prod

# Frontend (from my-react-app/)
vercel --prod
```

After deploy, smoke‑test the API:

```bash
curl https://medquiz.vercel.app/api/payment/config
# expect: {"enabled":true,"currency":"SAR","priceHalalas":9900,"publishableKey":"pk_…"}
```

---

## 3. Register the webhook (dashboard → Settings → Webhooks → Add webhook)

- **Webhook Endpoint URL:** `https://medquiz.vercel.app/api/payment/webhook`
- **Secret Token:** the exact same string you set for `MOYASAR_WEBHOOK_SECRET`
- **HTTP Method:** `POST`
- **Payment Events:** at minimum **`PAYMENT_PAID`** (also fine to enable
  `PAYMENT_FAILED`, `PAYMENT_REFUNDED` for your records)

The backend authenticates each call by comparing the payload's `secret_token` to
`MOYASAR_WEBHOOK_SECRET`, returns `2xx` immediately, then activates the
subscription. (The webhook is the authoritative path; the post‑payment redirect
`/verify` is the instant‑UX path. Both are idempotent.)

---

## 4. Test the full flow on the public site (test mode)

1. Open `https://www.smle-question-bank.com`.
2. **Create a brand‑new account** (a fresh email — existing accounts are
   grandfathered and bypass the paywall).
3. Log in → you're redirected to **`/subscribe`** showing **99 ريال / سنة** and
   the Moyasar card form, with Terms + Refund links shown before paying.
4. Pay with a **test card** — Visa `4111 1111 1111 1111` (or Mada
   `4201320111111010`), any future expiry, any CVC; complete the 3‑DS test page.
5. Moyasar redirects to **`/payment/callback`** → backend verifies with the secret
   key → subscription activated → you land in `/quizs`.
6. Confirm in the dashboard (Payments) the test payment shows **paid**, and in
   **Webhooks Attempts** that the `payment_paid` call returned 2xx.

To re‑test the paywall, use another fresh email (a paid account is active for a year).

---

## 5. Submit for activation ("Go Live")

1. Dashboard → **Go Live / Activation form**; upload CR, IBAN letter, and license
   (in `payment-data/`).
2. Make sure the public site shows: pricing in SAR, Refund Policy, Privacy, Terms,
   Contact, and the working payment flow (above).
3. Wait for review (typically **2–5 business days**).

## 6. Flip to live (after approval)

1. Swap `MOYASAR_PUBLISHABLE_KEY`/`MOYASAR_SECRET_KEY` to the `pk_live_…`/`sk_live_…`
   values in Vercel; redeploy the backend.
2. Add a **second webhook** for the live environment (same URL) with its own
   Secret Token, and update `MOYASAR_WEBHOOK_SECRET`.
3. Do one **real** low‑value end‑to‑end purchase to confirm, then refund it from
   the dashboard if desired.

---

## 7. Apple Pay (dashboard → Settings → Apple Pay - Domains)

The frontend form already requests `applepay` (`Subscribe.jsx` → `methods` +
`apple_pay`). The button only appears in **Safari on an Apple device** with a
card in Wallet — it will never show in Chrome/Windows. What's left is a
one‑time domain registration per environment:

1. **Add Domain** → enter exactly `www.smle-question-bank.com`
   — bare hostname only: no `https://`, no path, no trailing slash
   ("Invalid hostname" means one of those snuck in).
2. Click **Domain Association** → download the
   `apple-developer-merchantid-domain-association` file (keep it
   **extension‑less** — do not let Windows add `.txt`).
3. Put it in the frontend at
   `my-react-app/public/.well-known/apple-developer-merchantid-domain-association`
   and deploy. It must then be reachable at
   `https://www.smle-question-bank.com/.well-known/apple-developer-merchantid-domain-association`
   (the SPA rewrite in `vercel.json` doesn't intercept static files, same as
   `robots.txt`).
4. Back in the dashboard: **Validate** (Moyasar checks the file exists), then
   **Register** (Apple verifies the domain).
5. Domains are **per environment** — do this in the environment matching your
   keys (Test toggle for `pk_test_…`, Live for `pk_live_…`; the file is the
   same, register the domain in both).

Notes: mada cards work inside Apple Pay (already in `supported_networks`).
Apple Pay payments skip 3‑DS, and the form still redirects to
`/payment/callback`, so the existing verify/webhook flow is unchanged.

---

## Pre‑submission checklist

**Technical**
- [ ] `ADMIN_KEY` set in Vercel; `/get_all_users` and `/admin/stats` return **401** without the key (they were public before!)
- [ ] Admin pages (`/admin`, `/ADD_ACCOUNT`, `/Bank`, `/ADDQ`, `/TEMP_LINKS`, `/question-reports`) show the key gate and work after entering the key
- [x] `SUBSCRIPTION_PRICE_HALALAS` matches the advertised price — decided **99 SAR (`9900`)** on 2026-07-12; site text (Landing/Terms/Refund) updated to 99 SAR
- [ ] Test the report: `GET /api/email-test/subscription-report` (with `x-admin-key`) → PDF arrives at alshraky3@gmail.com
- [ ] Backend deployed; `GET /api/payment/config` returns `enabled:true` + a `pk_…` key
- [ ] Deploy logs show `Payment/subscription schema ensured`
- [ ] Webhook registered (HTTPS, POST, `PAYMENT_PAID`); Secret Token == `MOYASAR_WEBHOOK_SECRET`
- [ ] New account → `/subscribe` → test card → `/payment/callback` → access granted
- [ ] Dashboard shows the test payment `paid` and webhook attempt `2xx`
- [ ] Existing users still have access (grandfathered); admin‑created accounts exempt

**UI / UX**
- [ ] Price (99 SAR / year) shown clearly **before** payment
- [ ] Refund/cancellation policy + Terms linked **on the checkout page**
- [ ] Success and failure both handled with clear Arabic messaging
- [ ] "Processed securely by Moyasar; card details not stored" shown

**Legal / business**
- [ ] Terms, Privacy, Refund Policy pages live and accurate (99 SAR, present tense)
- [ ] Contact channel works (email / WhatsApp)
- [ ] Legal entity + CR (شركة دار الخبرة التجارية, 7040567922) visible
- [ ] Activation form submitted with CR + IBAN letter + license

**Sources:** [Moyasar FAQ](https://moyasar.com/en/resources/faqs/) ·
[Webhook Reference](https://docs.moyasar.com/api/other/webhooks/webhook-reference/) ·
[Create Webhook](https://docs.moyasar.com/api/other/webhooks/create-webhook/) ·
[Test Cards](https://docs.moyasar.com/guides/card-payments/test-cards) ·
[Basic Integration](https://docs.moyasar.com/guides/card-payments/basic-integration/)
