/**
 * "Come back to the testers offer after signing up."
 *
 * The landing section sends a visitor to /signup?next=android-testers. Signup
 * remembers that here, and whichever path finishes the sign-in (email code,
 * Google, or the manual /login fallback) asks takeAndroidReturn() where to go
 * instead of the usual first quiz or study hub. It lives in storage, not router
 * state, because /login clears its router state and the visitor may reload.
 * It expires after an hour and works once. Any other landing signup/login button
 * clears it (see Landing.jsx).
 */
import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage.js';
import { pathForLang } from '../seo/locales.js';

export const ANDROID_ANCHOR = 'android-testers';
export const ANDROID_SIGNUP_PATH = `/signup?next=${ANDROID_ANCHOR}`;
const KEY = 'sqb_return_after_signup';
export const ANDROID_RETURN_TTL_MS = 60 * 60 * 1000;

/** Remember the intent when `next` is ours; any other value changes nothing. */
export function rememberAndroidReturn(next, now = Date.now()) {
    if (next === ANDROID_ANCHOR) safeSetItem(KEY, String(now));
}

export function hasAndroidReturn(now = Date.now()) {
    const at = Number(safeGetItem(KEY));
    return at > 0 && now - at >= 0 && now - at < ANDROID_RETURN_TTL_MS;
}

export function clearAndroidReturn() {
    safeRemoveItem(KEY);
}

/** The landing path to go back to (in the reader's language), or null. One use. */
export function takeAndroidReturn(lang, now = Date.now()) {
    const wanted = hasAndroidReturn(now);
    clearAndroidReturn();
    return wanted ? `${pathForLang('/', lang)}#${ANDROID_ANCHOR}` : null;
}
