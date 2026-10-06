import Constants from 'expo-constants';

/**
 * The API the website talks to. This URL is compiled into installed apps and
 * hard-coded in the website, cron.yml and the Moyasar/Telegram webhooks:
 * never change it. EXPO_PUBLIC_API_URL exists only so a local backend can be
 * tested from a dev build (it is inlined at bundle time, not read at runtime).
 */
const PRODUCTION_API_URL = 'https://medquiz.vercel.app';

const fromConfig = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl;

export const API_URL: string = (process.env.EXPO_PUBLIC_API_URL || fromConfig || PRODUCTION_API_URL).replace(/\/+$/, '');

/** The website (shared links, legal pages, anything the app hands off to). */
export const SITE_URL = 'https://www.smle-question-bank.com';

export const SUPPORT_EMAIL = 'alshraky3@gmail.com';
export const TELEGRAM_CHANNEL_URL = 'https://t.me/sqb_exam';

/**
 * Google Sign-In needs a native Android OAuth client in the same Google Cloud
 * project as the website's web client (package + EAS signing SHA-1). Until the
 * owner creates it and sets this id, the Google button stays hidden.
 * See docs/GOOGLE_SIGN_IN.md.
 */
export const GOOGLE_WEB_CLIENT_ID: string = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

/**
 * In-app card checkout. The site sells through Moyasar and the app mirrors it.
 * Google Play requires Play Billing for digital goods sold inside an app it
 * distributes, so a Play Store build must set this to false (the paywall then
 * explains that plans are bought on the website). Sideloaded/internal APKs keep
 * the full checkout. See docs/PLAY_STORE_PAYMENTS.md.
 */
export const IN_APP_CHECKOUT_ENABLED = process.env.EXPO_PUBLIC_IN_APP_CHECKOUT !== 'false';
