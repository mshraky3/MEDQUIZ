/**
 * Logic of the "Android testers offer" card on /account (components/account/AndroidTestersCard.jsx).
 * The server decides everything (GET /api/android-testers/status answers 404 until
 * ANDROID_TESTERS_OFFER_ENABLED=true on the API); this file only turns its answer
 * into a view and a refusal reason into a message key.
 */

/** Same shape check as the server (services/androidTesters.js); the server has the last word. */
export function looksLikeEmail(value) {
    const v = String(value || '').trim();
    return v.length >= 6 && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Reasons for which the account can never get the months: the card stays hidden
// instead of offering something the server would refuse.
const INELIGIBLE = new Set([
    'account_not_found', 'email_not_verified', 'already_redeemed', 'has_paid',
    'grandfathered', 'already_granted', 'active_subscription',
]);

/** @returns {'hidden'|'join'|'full'|'joined'|'redeemed'} */
export function offerView(status) {
    if (!status || status.success === false) return 'hidden';
    if (status.redeemed) return 'redeemed';
    if (status.joined) return 'joined';
    if (INELIGIBLE.has(status.reason)) return 'hidden';
    if (status.left <= 0 || status.reason === 'full') return 'full';
    return 'join';
}

/** Key into the card's copy.errors for a refusal reason from POST /join. */
export function joinErrorKey(reason) {
    if (reason === 'invalid_email') return 'invalidEmail';
    if (reason === 'email_taken') return 'emailTaken';
    if (reason === 'full') return 'full';
    if (reason === 'already_joined') return 'alreadyJoined';
    if (INELIGIBLE.has(reason)) return 'notEligible';
    return 'generic';
}
