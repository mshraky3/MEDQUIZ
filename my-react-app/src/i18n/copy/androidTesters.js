/**
 * The "Android testers offer" card on /account.
 *
 * Website-only: the Android app has no such card, so mobile/scripts/sync-copy.mjs
 * skips this file (see its SKIP list).
 *
 * Wording is deliberate (Google Play policy, see mobile/docs/PLAY-LAUNCH-CHECKLIST.md):
 * it is a tester programme that asks for feedback; it never asks for a rating or a
 * review. Plain numbers are formatted by the card with formatNumber.
 */
const androidTestersCopy = {
    ar: {
        pill: 'عرض المجرّبين',
        title: 'جرّب SQB على أندرويد',
        body: 'نجرّب تطبيق SQB على هواتف أندرويد مع مجموعة صغيرة من الطلاب ونحتاج إلى ملاحظاتهم. من ينضم إلى المجرّبين يحصل على 3 أشهر مجانًا عند تسجيل الدخول من التطبيق على هاتف أندرويد.',
        spots: (n) => `بقي ${n} من 15 مقعدًا`,
        full: 'اكتملت المقاعد الـ 15. شكرًا لاهتمامك.',
        emailLabel: 'بريد حساب Google على هاتفك',
        emailHint: 'هو البريد الذي تستخدمه في متجر Google Play على هاتف أندرويد.',
        join: 'انضم إلى المجرّبين',
        joining: 'جارٍ الانضمام...',
        limit: 'مقعد واحد لكل حساب، والمقاعد بالأسبقية.',
        joinedTitle: 'تم تسجيلك في قائمة المجرّبين',
        joinedBody: (email) => `سجّلنا ${email} وسنضيفه إلى قائمة الاختبار في Google Play. افتح الرابط التالي من هاتف أندرويد بنفس حساب Google ووافق على الانضمام، ثم نزّل التطبيق وسجّل الدخول بحساب SQB. تُضاف الأشهر الثلاثة تلقائيًا عند أول تسجيل دخول من التطبيق.`,
        optIn: 'افتح رابط الانضمام على هاتف أندرويد',
        noLink: 'سيظهر رابط الانضمام هنا عندما يكون جاهزًا.',
        redeemedTitle: 'تم تفعيل أشهرك الثلاثة',
        redeemedBody: 'سجّلت الدخول من التطبيق وأُضيفت 3 أشهر إلى حسابك. شكرًا لتجربتك.',
        errors: {
            invalidEmail: 'اكتب بريدًا إلكترونيًا صحيحًا.',
            emailTaken: 'هذا البريد مسجّل مع حساب آخر.',
            full: 'اكتملت المقاعد الـ 15.',
            alreadyJoined: 'حسابك مسجّل بالفعل.',
            notEligible: 'هذا العرض لحسابات بلا اشتراك مدفوع أو منحة حالية.',
            generic: 'تعذّر الانضمام الآن. حاول مرة أخرى بعد قليل.',
        },
    },
    en: {
        pill: 'Testers offer',
        title: 'Try SQB on Android',
        body: 'We are testing the SQB app on Android phones with a small group of students and we want their feedback. Everyone who joins the testers gets 3 months free when they sign in from the app on an Android phone.',
        spots: (n) => `${n} of 15 spots left`,
        full: 'All 15 spots are taken. Thank you for your interest.',
        emailLabel: 'Google account email on your phone',
        emailHint: 'The email you use in Google Play on your Android phone.',
        join: 'Join the testers',
        joining: 'Joining...',
        limit: 'One spot per account, first come first served.',
        joinedTitle: 'You are on the testers list',
        joinedBody: (email) => `We saved ${email} and will add it to the Google Play test list. Open the link below on your Android phone with the same Google account and accept, then install the app and sign in with your SQB account. The 3 months are added automatically the first time you sign in from the app.`,
        optIn: 'Open the join link on your Android phone',
        noLink: 'The join link will appear here when it is ready.',
        redeemedTitle: 'Your 3 months are active',
        redeemedBody: 'You signed in from the app and 3 months were added to your account. Thank you for testing.',
        errors: {
            invalidEmail: 'Enter a valid email address.',
            emailTaken: 'This email is already used by another account.',
            full: 'All 15 spots are taken.',
            alreadyJoined: 'Your account is already on the list.',
            notEligible: 'This offer is for accounts without a paid plan or an existing grant.',
            generic: 'Could not join right now. Please try again in a moment.',
        },
    },
};

export default androidTestersCopy;
