/**
 * Settings of the "SQB for Android" login card (components/login/AndroidAppCard.jsx).
 * Build-time Vercel env on the medquiz-react project. The card is hidden unless
 * BOTH links are real https links, so the code can ship before the Play links exist.
 *   VITE_ANDROID_TESTER_URL    Play Console closed-test opt-in link
 *   VITE_ANDROID_DOWNLOAD_URL  the app's Google Play store link
 *   VITE_ANDROID_FREE_MONTH    exactly "true" adds the free-month line (owner decision)
 */

/** Only a real https link counts; anything else keeps the card hidden. */
export function cleanLink(value) {
    const v = String(value || '').trim();
    return /^https:\/\/[^\s]+$/.test(v) ? v : '';
}

export function androidAppConfig(source = {}) {
    return {
        testerUrl: cleanLink(source.VITE_ANDROID_TESTER_URL),
        downloadUrl: cleanLink(source.VITE_ANDROID_DOWNLOAD_URL),
        freeMonth: String(source.VITE_ANDROID_FREE_MONTH || '').trim() === 'true',
    };
}

export function isAndroidCardVisible(config) {
    return !!(config && config.testerUrl && config.downloadUrl);
}
