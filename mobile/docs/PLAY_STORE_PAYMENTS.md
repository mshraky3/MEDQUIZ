# Card payments and the Google Play policy

**Decision needed from the owner before publishing on Google Play.** Nothing is blocked for sideloaded
or internal APKs.

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
