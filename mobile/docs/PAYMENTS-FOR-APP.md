# Payments and the app (2026-10-28)

**Owner decision (28 Oct 2026):** the account is created on the WEBSITE; the app is used after you have an account;
payments go through the website (Moyasar, 0 % platform fee); one account works on both.
**Recommendation: keep the Play build consumption-only (sign-in and study), say in plain words that the subscription
is managed on the website, and never put a link, a price or a buy button in it.** Details and sources below.

## 1. Google Play, today (Play Console Help "Payments", answer 10281818, read 2026-10-28)
Verified from the page:
- Digital goods and subscriptions sold inside a Play app must use Google Play Billing.
- **"Google Play allows any app to be consumption-only"**: people may use content they bought elsewhere (the example is logging in to
  an app where the content was paid for externally), as long as the app sells nothing inside.
- Inside the app a developer **may not lead users to a payment method other than Play Billing**: no direct link to a page that could
  lead to another payment method, and no language that encourages purchasing outside the app.
- Allowed: links to administrative pages (account management, privacy policy, help) **that do not eventually lead to a prohibited
  payment method**. Consumption-only apps **may mention purchase options without direct links**; Google's own example is
  "Go to our website to upgrade your subscription to Premium".
- Outside the app (email, website, social, Telegram) you may tell users about any purchase option and any price.
- Alternative billing and external links exist only in a short list of markets: the page names India, South Korea, the EEA and the US
  (US external-content-links programme; UK/EEA billing choice from other Google pages seen in a search). **Saudi Arabia is not named anywhere I could read.**

NOT verified (say so, do not assume): the page is truncated, does not define "encourage", does not give a full country list, and I
could not read the policy's Sections 3, 8 and 9. Google plans to add markets, so re-read before each release. I could not confirm
how a reviewer treats a plain-text mention of "the website"; Google's own example says it is fine.

**What this means for the app (Play build):**

| Thing | Allowed? | In the build |
|---|---|---|
| Sign in, study, analytics for an account bought elsewhere | yes (consumption-only) | yes |
| Prices, plans, offers, group plans, card form | no | removed |
| "Subscribe" or "Upgrade" button, even one that opens the browser | no (leads to a payment method) | removed; replaced by "Account status" |
| Plain text "your subscription is managed on the website", no link | yes (Google's own example) | on the neutral screen |
| A clickable link to the site's `/account` or `/subscribe` | **not safe**: `/account` ends in a subscribe button, so it "eventually leads" to another payment method | **off**; the switch `EXPO_PUBLIC_WEBSITE_SUBSCRIBE_BUTTON` exists but must stay unset |
| Create an account in the app | allowed, but then Play's in-app account-deletion rule applies fully | the free sign-up now points generically to the website; invite and paid-seat links still open their screens (access bought elsewhere) |
| Telling people about prices on the website, Telegram, email | yes | unchanged |

## 2. What the app does now (implemented on branch `feat/tablet-and-payments`)
- After sign-in, and again when the status screen opens, the app reads the **same subscription answer as the website**
  (`GET /api/user-subscription/:id`, already merged into the session by `lib/auth.tsx`). `lib/subscriptionState.ts` maps it to
  `subscriber` (full access), `free` (N questions left) or `free_spent`.
- Where a buy button used to be (free-allowance banner, spent-allowance screen, locked lesson, locked summary step, paywall)
  the Play build shows **"Account status"**, which opens one neutral screen (`PlayAccessScreen`): the status sentence, and for a
  free account the line "your subscription is managed from your account on the website, contact us if you have a question".
  No price, no link, no currency (a unit test checks both languages).
- Sign-up in the Play build (`/signup`) shows "SQB accounts are created on the SQB website ... one account works on the website and in
  the app" with a Sign in button (`WebAccountScreen`).
- The website login card is outside the app: free to say anything there.
- Not changed: the legal and FAQ pages inside the app are copied from the website and still mention prices; the spent-allowance
  explanation still says "subscribe" in words. Both are text, not purchase paths; decide if you want a Play-only copy set.

## 3. If an iOS app is ever made (NOT enabled; `ios.supportsTablet` is only a config flag, no iOS build profile exists)
- **Apple Developer Program: 99 USD per year** (Apple's published price; not re-checked today). Required to put any app on the
  App Store, and TestFlight needs it too. Not started.
- Apple guideline text read today (developer.apple.com App Store Review Guidelines, first 100,000 characters):
  - 3.1.1: features, subscriptions and premium content unlocked inside the app must use in-app purchase.
  - 3.1.1(a): outside the US storefront, apps **may not include buttons, external links or calls to action** to other purchase methods
    unless Apple granted an entitlement; the US storefront is exempt.
  - 3.1.3(a) "Reader" apps: access to previously purchased content (magazines, newspapers, books, audio, music, video); may offer free-tier
    account creation and account management; an **informational** link to the developer's site for creating or managing an account needs the
    External Link Account entitlement outside the US. A question bank is not clearly in those categories: unverified.
  - 3.1.3(b) multiplatform services: allows access to what was bought on other platforms or the web **only if the same items are also
    available as in-app purchases** in the iOS app. That is the catch for SQB: an iOS app that only signs in is not safely covered.
  - Not stated on the page I read: the entitlement process, fees, and which regions count.
- So iOS would need either in-app purchase (Apple's commission; the rates were not read today) or a bet on a review exception.
  **Recommendation: no iOS until Android is live and earning, then decide with a fresh reading of the guidelines.**

## 4. Play Billing as the fallback (15 %)
Only if Play rejects the consumption-only build, or the owner wants in-app purchase for convenience. Fee for auto-renewing subscriptions
outside the programme markets: **15 %** (`PLAY_STORE_PAYMENTS.md`, Play service-fee page read 2026-10-07). On a 50 SAR month that is 7.5 SAR to
Google, and Moyasar is not used for those sales. It needs a new rail: the Play Billing library, server-side purchase-token verification, granting
months from a token, refund and chargeback handling, and a new native build. A large piece of work and a change in the money flow: it needs the
owner's explicit decision. One upside: Moyasar's foreign-card block does not apply to Play Billing.

## 5. Recommendation (one)
**Consumption-only Play build, as implemented: accounts and payment on the website, the app shows an account status and plain text, no link.**
Cost: 0 % fee, no new payment code to maintain. Risk: a reviewer could still object to the plain-text mention; the fallback is to drop that
sentence (one string in `src/i18n/appCopy.ts`) or move to Play Billing (section 4). Do not enable the website-button switch.
