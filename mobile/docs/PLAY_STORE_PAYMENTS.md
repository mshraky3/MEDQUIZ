# Card payments and the Google Play policy

**Decision (owner, 7 Oct 2026): the Play Store build is SIGN-IN ONLY**, with an optional "subscribe on the
website" button. Nothing is blocked for sideloaded or internal APKs. The build mode itself is **not built yet**
(see "To build" at the end).

## Research (Google's own pages, checked 7 Oct 2026)
- Payments policy: apps selling digital goods or subscriptions on Play must use Google Play Billing. Exemptions:
  physical goods, some services, and "reader" apps (books, news, audio, video) that only let people log in to
  content bought elsewhere. Inside the app, developers generally may not lead users to other payment methods;
  outside the app (email, website, social) they may freely tell users about alternatives.
- Alternative billing and "link to your website" programmes exist only in the US, UK, EEA (plus Australia, Japan,
  India and South Korea with their own rules). **Saudi Arabia is not listed**, so the standard rule applies.
  Google says it will add markets through 2027: re-check before shipping.
- Fees outside those markets: **15 % on auto-renewing subscriptions** (and 15 % on the first USD 1 M of other sales).
  In the US/UK/EEA it is 10 % + 5 % billing fee.
- Sources: support.google.com/googleplay/android-developer/answer/10281818 (Payments policy), .../answer/112622
  (service fees), android-developers.googleblog.com/2026/06/play-expanded-billing.html.

## Options compared
| Option | Fees to Google | Effort | Play review risk |
|---|---|---|---|
| **A. Sign-in only** (chosen): no prices or buy screens in the app; people subscribe on the website with Moyasar | 0 % | small (hide screens in one build mode) | low to medium: SQB is not a reader app, so "login to content bought elsewhere" is allowed in practice but not explicitly for question banks |
| B. Google Play Billing | 15 % | large (new rail, server verification, granting months) | none |
| C. Skip Play, share the APK | 0 % | none | none, but users must allow unknown sources |

The "subscribe on the website" button inside the app is the part Google's wording discourages most. It is the owner's
choice to include it; make it a separate switch so it can be removed in one line if review objects. Fallback if
Play rejects the app: option B.

## The issue

The website sells subscriptions through Moyasar (card form). The app mirrors that: the plan picker and
Moyasar's hosted card form run inside the app (`src/features/subscribe`). Google Play's payments policy
requires apps distributed on Play to use **Google Play Billing** for digital goods and subscriptions sold
inside the app. An in-app card form for a digital subscription can get an app rejected or removed.
This is a store-policy question, not a technical one; the policy and its exemptions change, so read the
current text before deciding.

## What is built

A single switch, `IN_APP_CHECKOUT_ENABLED` (`src/config.ts`), read from `EXPO_PUBLIC_IN_APP_CHECKOUT`:

| Value | Behaviour |
|---|---|
| unset / anything but `false` | full in-app checkout (plan picker + Moyasar form). Use for the preview APK and any non-Play distribution. |
| `false` | the plan picker still shows prices, but instead of the card form the screen says plans are bought on the website and offers an *Open the subscription page* button. When the student comes back, the app re-reads their subscription (it refreshes whenever the app returns to the foreground) and unlocks immediately. |

Set it per build profile in `eas.json`:

```json
"production": { "env": { "EXPO_PUBLIC_IN_APP_CHECKOUT": "false" } }
```

## Options

1. **Play build without in-app checkout** (the switch above). Safe for review, slightly more friction.
2. **Do not publish on Play**; distribute the APK from the website/Telegram. Full checkout, no Play review.
3. **Implement Play Billing.** A different payment rail with its own fees and a new backend path to grant
   months from a Play purchase token. Large piece of work; not started, and it changes the money flow,
   so it needs an explicit decision.

## Apple Pay

Not offered in the app: Apple Pay does not exist in Android WebViews. The form shows card (Visa, Mastercard, mada) only.

## Testing payments safely

Never use live Moyasar keys in a test. With a `pk_test_...` key the screen shows a test-mode banner and
Moyasar's published test card works. The checkout page, callback handling and the redirect allow-list
are covered by unit tests (`src/__tests__/checkout.test.ts`); the card form itself can only be exercised
on a device with Moyasar's test key.

## To build (not started)
1. A store mode build flag (e.g. `EXPO_PUBLIC_STORE_MODE=play`): hide plan prices, offers, `groups` buying and the
   in-app upgrade prompts; keep login, signup (free tier) and everything for subscribers.
2. A separate flag for the "subscribe on the website" button (opens the site's subscribe page in the browser; the app
   already re-reads the subscription when the student comes back).
3. Easier sign-in for that build: Google one-tap (client created, see `GOOGLE_SIGN_IN.md`) and email-code login with
   no password. The code login needs a NEW backend endpoint (the current OTP only resets a password); it deploys to
   production and is security-sensitive, so it needs the owner's explicit go.
