/**
 * Optional links used by the Android testers section on the landing page
 * (components/landing/AndroidTestersSection.jsx). Build-time Vercel env on the
 * medquiz-react project. They only change the "next steps" a joined tester sees;
 * whether the offer shows at all is decided by the API (ANDROID_TESTERS_OFFER_ENABLED).
 *   VITE_ANDROID_TESTER_URL    Play Console closed-test opt-in link
 *   VITE_ANDROID_DOWNLOAD_URL  the app's Google Play store link
 *   VITE_ANDROID_GROUP_URL     Google Group (open joining) used as the Play tester
 *                              list. Set it only once that group IS the tester list:
 *                              it removes the "we add your email by hand" step.
 */

/** Only a real https link counts; anything else is treated as not set. */
export function cleanLink(value) {
    const v = String(value || '').trim();
    return /^https:\/\/[^\s]+$/.test(v) ? v : '';
}

export function androidAppConfig(source = {}) {
    return {
        testerUrl: cleanLink(source.VITE_ANDROID_TESTER_URL),
        downloadUrl: cleanLink(source.VITE_ANDROID_DOWNLOAD_URL),
        groupUrl: cleanLink(source.VITE_ANDROID_GROUP_URL),
    };
}

/**
 * The numbered steps of the joined state: [{ key, text, href, linkLabel, missing }].
 * With a group link the student adds themselves; without it the owner adds each
 * e-mail by hand and the copy says so.
 */
export function testerSteps(config, copy) {
    const byGroup = !!config.groupUrl;
    const texts = byGroup ? copy.stepsGroup : copy.stepsManual;
    const first = byGroup
        ? { key: 'group', text: texts.group, href: config.groupUrl, linkLabel: copy.openGroup }
        : { key: 'wait', text: texts.wait, href: '', linkLabel: '' };
    return [
        first,
        {
            key: 'optin', text: texts.optIn, href: config.testerUrl, linkLabel: copy.openOptIn,
            missing: config.testerUrl ? '' : copy.noLink,
        },
        { key: 'install', text: texts.install, href: config.downloadUrl, linkLabel: copy.openDownload },
    ];
}

/**
 * The same steps as testerSteps, shown one at a time when a Google Group is the
 * tester list (components/landing/AndroidTesterGuide.jsx). Sign-in is its own
 * step because the free month starts there.
 */
export function guideSteps(config, guide, { googleAccount = false } = {}) {
    const links = { group: config.groupUrl, optin: config.testerUrl, install: config.downloadUrl, signin: '' };
    return Object.keys(links).map((key) => {
        const step = guide.steps[key];
        const lines = key === 'signin'
            ? [step.open, googleAccount ? step.google : step.password, step.done]
            : step.lines;
        return { key, title: step.title, lines, href: links[key], button: step.button || '' };
    });
}

/** A stored step number, kept inside the list. */
export function clampStep(value, count) {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), count - 1) : 0;
}
