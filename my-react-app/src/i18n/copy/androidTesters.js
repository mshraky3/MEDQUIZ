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
        body: 'نجرّب تطبيق SQB على هواتف أندرويد مع مجموعة صغيرة من الطلاب ونحتاج إلى ملاحظاتهم. من ينضم إلى المجرّبين يحصل على شهر مجاني على حساب SQB الخاص به، يُستخدم في الموقع وفي التطبيق، ويُضاف عند تسجيل الدخول من تطبيق أندرويد. العرض لأوائل المستخدمين فقط ولفترة محدودة.',
        spots: () => 'مقاعد محدودة لأوائل المستخدمين فقط',
        full: 'اكتملت مقاعد هذا العرض. شكرًا لاهتمامك.',
        emailLabel: 'بريد حساب Google على هاتفك',
        emailHint: 'هو البريد الذي تستخدمه في متجر Google Play على هاتف أندرويد.',
        join: 'انضم إلى المجرّبين',
        joining: 'جارٍ الانضمام...',
        limit: 'مقعد واحد لكل حساب، والمقاعد بالأسبقية.',
        joinedTitle: 'تم تسجيلك في قائمة المجرّبين',
        joinedBody: (email) => `سجّلنا ${email} وسنضيفه إلى قائمة الاختبار في Google Play. افتح الرابط التالي من هاتف أندرويد بنفس حساب Google ووافق على الانضمام، ثم نزّل التطبيق وسجّل الدخول بحساب SQB. يُضاف الشهر المجاني إلى حسابك تلقائيًا عند أول تسجيل دخول من تطبيق أندرويد، ويعمل في الموقع وفي التطبيق.`,
        optIn: 'افتح رابط الانضمام على هاتف أندرويد',
        noLink: 'سيظهر رابط الانضمام هنا عندما يكون جاهزًا.',
        redeemedTitle: 'تم تفعيل شهرك المجاني',
        redeemedBody: 'سجّلت الدخول من تطبيق أندرويد وأُضيف شهر مجاني إلى حساب SQB الخاص بك، وتعمل في الموقع وفي التطبيق. شكرًا لتجربتك.',
        errors: {
            invalidEmail: 'اكتب بريدًا إلكترونيًا صحيحًا.',
            emailTaken: 'لا يمكن استخدام هذا البريد. جرّب بريد حساب Google آخر.',
            full: 'اكتملت مقاعد هذا العرض.',
            alreadyJoined: 'حسابك مسجّل بالفعل.',
            notEligible: 'هذا العرض لحسابات بلا اشتراك مدفوع أو منحة حالية.',
            generic: 'تعذّر الانضمام الآن. حاول مرة أخرى بعد قليل.',
        },
    },
    en: {
        pill: 'Testers offer',
        title: 'Try SQB on Android',
        body: 'We are testing the SQB app on Android phones with a small group of students and we want their feedback. Everyone who joins the testers gets 1 free month on their SQB account, usable on the website and in the app, added when they sign in from the Android app. The offer is for the first few users only and for a limited time.',
        spots: () => 'Limited seats, first few users only',
        full: 'All seats for this offer are taken. Thank you for your interest.',
        emailLabel: 'Google account email on your phone',
        emailHint: 'The email you use in Google Play on your Android phone.',
        join: 'Join the testers',
        joining: 'Joining...',
        limit: 'One spot per account, first come first served.',
        joinedTitle: 'You are on the testers list',
        joinedBody: (email) => `We saved ${email} and will add it to the Google Play test list. Open the link below on your Android phone with the same Google account and accept, then install the app and sign in with your SQB account. The free month is added to your account automatically the first time you sign in from the Android app, and they work on the website and in the app.`,
        optIn: 'Open the join link on your Android phone',
        noLink: 'The join link will appear here when it is ready.',
        redeemedTitle: 'Your free month is active',
        redeemedBody: 'You signed in from the Android app and 1 free month was added to your SQB account, usable on the website and in the app. Thank you for testing.',
        errors: {
            invalidEmail: 'Enter a valid email address.',
            emailTaken: 'This address cannot be used. Try another Google account email.',
            full: 'All seats for this offer are taken.',
            alreadyJoined: 'Your account is already on the list.',
            notEligible: 'This offer is for accounts without a paid plan or an existing grant.',
            generic: 'Could not join right now. Please try again in a moment.',
        },
    },
};

export default androidTestersCopy;
