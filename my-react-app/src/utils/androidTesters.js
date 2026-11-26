/**
 * Logic of the "Android testers offer" section on the landing page
 * (components/landing/AndroidTestersSection.jsx).
 * The server decides everything (both status routes answer 404 until
 * ANDROID_TESTERS_OFFER_ENABLED=true on the API); this file only turns its answers
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

/**
 * What the landing section shows. A signed-out visitor sees the offer only while
 * the public switch says it is open (off, full or unknown: nothing). A signed-in
 * visitor gets the answer for their own account.
 * @returns {'hidden'|'guest'|'join'|'full'|'joined'|'redeemed'}
 */
export function landingView({ authReady, signedIn, publicState, status }) {
    if (!authReady) return 'hidden';
    if (signedIn) return offerView(status);
    return publicState?.success === true && publicState.open === true ? 'guest' : 'hidden';
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
