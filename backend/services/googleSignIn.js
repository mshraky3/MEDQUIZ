/**
 * Whether POST /api/auth/google must refuse to create an account for an identity
 * it has never seen. The login page sends mode 'login'; the Google Play build of
 * the app sends client 'android-play' (accounts are created on the website only).
 * The website's own sign-up page sends neither, so it keeps creating accounts.
 * Both values can only make the route refuse, never grant, so a forged one is harmless.
 */
export function refusesNewGoogleAccount(body = {}) {
    return body.mode === 'login' || body.client === 'android-play';
}
