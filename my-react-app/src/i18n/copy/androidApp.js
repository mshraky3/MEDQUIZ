/**
 * The "SQB for Android" card on the login page.
 *
 * Website-only: the Android app has no login-page card, so mobile/scripts/sync-copy.mjs
 * skips this file (see its SKIP list).
 *
 * Wording is deliberate (Google Play policy, see mobile/docs/PLAY-LAUNCH-CHECKLIST.md):
 * the base text is a tester programme asking for feedback. It never promises a
 * reward for installing and never mentions ratings or reviews. The free-month
 * line is a SEPARATE string shown only when VITE_ANDROID_FREE_MONTH is "true".
 */
const androidAppCopy = {
    ar: {
        pill: 'تطبيق أندرويد',
        title: 'SQB على أندرويد',
        body: 'نجرّب تطبيق SQB لأندرويد مع مجموعة من الطلاب، ونحتاج ملاحظاتك لتحسينه. سجّل دخولك وانضم إلى المجرّبين من صفحة حسابك، ثم نزّل التطبيق من متجر Google Play. تُنشأ الحسابات من الموقع فقط، والتطبيق لتسجيل الدخول والمذاكرة.',
        freeMonth: 'شهر مجاني لمن يسجّل الدخول بحسابه من التطبيق مرة واحدة لكل حساب.',
        join: 'سجّل دخولك وانضم إلى المجرّبين',
        download: 'تنزيل التطبيق',
        note: 'نضيف بريد Google الذي تكتبه إلى قائمة الاختبار ويظهر لك رابط الانضمام في صفحة حسابك. لا نطلب منك تقييمًا ولا مراجعة.',
    },
    en: {
        pill: 'Android app',
        title: 'SQB for Android',
        body: 'We are testing the SQB Android app with a group of students and we need your feedback to improve it. Log in and join the testers from your account page, then get the app from Google Play. Accounts are created on the website only; the app is for signing in and studying.',
        freeMonth: 'A free month for signing in from the app once, one per account.',
        join: 'Log in and join the testers',
        download: 'Get the app',
        note: 'We add the Google email you enter to the test list, and the join link then appears on your account page. We do not ask for a rating or a review.',
    },
};

export default androidAppCopy;
