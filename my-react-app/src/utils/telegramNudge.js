/**
 * The "follow your track's channel" card on the quiz result screen: whether it
 * may show. Once dismissed or clicked it never shows again in this browser.
 * With storage blocked, the answer still holds until the page is reloaded.
 */
import { safeGetItem, safeSetItem } from './safeStorage.js';
import { userTrack } from './tracks.js';

export const TELEGRAM_NUDGE_KEY = 'sqb_tg_nudge_done';

let doneThisVisit = false;

export function isTelegramNudgeDone() {
    return doneThisVisit || safeGetItem(TELEGRAM_NUDGE_KEY) === '1';
}

export function markTelegramNudgeDone() {
    doneThisVisit = true;
    safeSetItem(TELEGRAM_NUDGE_KEY, '1');
}

/** The track whose channel to offer, or null when the card must not show. */
export function telegramNudgeTrack({ user, done }) {
    if (!user || done) return null;
    return userTrack(user);
}
