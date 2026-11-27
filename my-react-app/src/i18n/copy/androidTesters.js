/**
 * The "Android testers offer": the section on the landing page
 * (components/landing/AndroidTestersSection.jsx) and the closable card on the
 * study home (AndroidTestersHubCard.jsx) for signed-in accounts the server still
 * accepts (owner, 2026-11-26 evening). Not on /login and not on /account.
 *
 * Website-only: the Android app has no such section, so mobile/scripts/sync-copy.mjs
 * skips this file (see its SKIP list).
 *
 * Wording is deliberate (Google Play policy, see mobile/docs/PLAY-LAUNCH-CHECKLIST.md):
 * it is a tester programme that asks for feedback; it never asks for a rating or a
 * review, and the number of seats is never shown.
 *
 * Two sets of "next steps" for someone who joined:
 *   stepsGroup   VITE_ANDROID_GROUP_URL is set: the student joins the Google Group
 *                that is the Play closed-test list, so nothing waits for the owner.
 *   stepsManual  not set: the owner adds each e-mail to the Play list by hand, so
 *                the test link only works after that. Do not promise faster.
 */
const androidTestersCopy = {
    ar: {
        pill: 'تطبيق أندرويد · نسخة تجريبية',
        hubShow: 'التفاصيل والانضمام',
        hubShowJoined: 'اعرض خطوات التنزيل',
        hubJoinedTitle: 'أنت في قائمة مجرّبي أندرويد',
        hubHide: 'إخفاء التفاصيل',
        hubDismiss: 'إغلاق البطاقة',
        teaserTitle: 'انضم إلى مجرّبي تطبيق أندرويد',
        title: 'انضم إلى مجرّبي SQB على أندرويد',
        gift: 'شهر مجاني لأوائل المجرّبين',
        body: 'نجرّب تطبيق SQB على هواتف أندرويد ونحتاج إلى ملاحظاتك لتحسينه. من ينضم إلى المجرّبين يحصل على شهر مجاني على حسابه، يعمل في الموقع وفي التطبيق، ويُضاف عند أول تسجيل دخول من تطبيق أندرويد.',
        terms: 'لأوائل المستخدمين ولفترة محدودة، للحسابات التي لم تدفع من قبل وليس لديها اشتراك أو منحة حالية.',
        saudi: 'الاختبار المغلق متاح حاليًا في السعودية فقط.',
        guestSteps: [
            'أنشئ حسابك المجاني.',
            'نعيدك إلى هنا لتنضم إلى المجرّبين.',
            'تظهر لك خطوات تنزيل التطبيق.',
        ],
        guestCta: 'أنشئ حسابًا وانضم',
        memberLead: 'خطوة واحدة: اكتب بريد Google الذي تستخدمه على هاتف أندرويد.',
        spots: () => 'مقاعد محدودة لأوائل المستخدمين فقط',
        full: 'اكتملت مقاعد هذا العرض. شكرًا لاهتمامك.',
        emailLabel: 'بريد حساب Google على هاتفك',
        emailHint: 'هو البريد الذي تستخدمه في متجر Google Play. نحفظه لإضافتك إلى قائمة الاختبار.',
        privacyLink: 'سياسة الخصوصية',
        join: 'انضم إلى المجرّبين',
        joining: 'جارٍ الانضمام...',
        limit: 'مقعد واحد لكل حساب، والمقاعد بالأسبقية.',
        joinedTitle: 'تم تسجيلك في قائمة المجرّبين',
        savedAs: 'البريد المسجّل:',
        nextTitle: 'خطواتك التالية',
        oneTap: {
            lead: 'سنسجّلك بهذا البريد:',
            check: 'تأكّد أنه نفس البريد المستخدم في متجر Google Play على هاتفك.',
            join: 'نعم، سجّلني',
            other: 'أستخدم بريدًا آخر في هاتفي',
        },
        guide: {
            progress: 'الخطوة {n} من {total}',
            account: 'استخدم دائمًا هذا البريد:',
            back: 'رجوع للخطوة السابقة',
            helpTitle: 'ما اشتغلت معك؟',
            help: [
                'استخدم هاتف أندرويد.',
                'تأكّد أنك داخل بنفس البريد الظاهر هنا. إذا عندك أكثر من حساب Google فبدّل الحساب.',
                'إذا فتحت الموقع من داخل تيك توك أو تيليجرام أو إنستغرام، فافتحه في متصفح Chrome.',
                'إذا ظهر أن التطبيق غير متاح، فانتظر قليلًا ثم جرّب مرة أخرى.',
                'التطبيق متاح حاليًا في السعودية فقط.',
            ],
            steps: {
                group: {
                    title: 'انضم إلى مجموعة المجرّبين',
                    lines: ['اضغط الزر بالأسفل.', 'في صفحة Google اضغط زر الانضمام إلى المجموعة (Join group).', 'بعدها ارجع إلى هذه الصفحة.'],
                    button: 'افتح المجموعة',
                },
                optin: {
                    title: 'وافق على تجربة التطبيق',
                    lines: ['اضغط الزر بالأسفل.', 'في الصفحة التي تفتح اضغط زر الانضمام إلى الاختبار (Become a tester).', 'بعدها ارجع إلى هذه الصفحة.'],
                    button: 'افتح صفحة الاختبار',
                },
                install: {
                    title: 'نزّل التطبيق',
                    lines: ['اضغط الزر بالأسفل.', 'في Google Play اضغط تثبيت (Install).'],
                    button: 'افتح Google Play',
                },
                signin: {
                    title: 'سجّل الدخول وخذ شهرك المجاني',
                    open: 'افتح تطبيق SQB على هاتفك.',
                    google: 'اضغط زر الدخول بحساب Google واختر نفس حسابك في SQB.',
                    password: 'سجّل الدخول بنفس اسم المستخدم وكلمة المرور في SQB.',
                    done: 'يُضاف الشهر المجاني تلقائيًا. لا تحتاج إلى أي خطوة أخرى.',
                },
            },
        },
        stepsGroup: {
            group: 'انضم إلى مجموعة Google الخاصة بالمجرّبين بحساب Google نفسه الذي سجّلته.',
            optIn: 'من هاتف أندرويد، وبالحساب نفسه، افتح رابط الاختبار ووافق على الانضمام.',
            install: 'نزّل التطبيق من Google Play وسجّل الدخول بحساب SQB نفسه. إذا كنت تدخل بحساب Google فاستخدم زر Google.',
        },
        stepsManual: {
            wait: 'نضيف بريدك يدويًا إلى قائمة الاختبار في Google Play، وعادةً يتم ذلك خلال يوم.',
            optIn: 'رابط الاختبار لا يعمل إلا بعد إضافة بريدك. بعدها افتحه من هاتف أندرويد بالحساب نفسه ووافق على الانضمام. إذا ظهرت رسالة خطأ من Google فأعد المحاولة لاحقًا.',
            install: 'نزّل التطبيق من Google Play وسجّل الدخول بحساب SQB نفسه. إذا كنت تدخل بحساب Google فاستخدم زر Google.',
        },
        openGroup: 'افتح مجموعة Google',
        openOptIn: 'افتح رابط الاختبار',
        openDownload: 'تنزيل التطبيق من Google Play',
        noLink: 'سيظهر رابط الاختبار هنا عندما يكون جاهزًا.',
        monthNote: 'يُضاف الشهر المجاني إلى حسابك تلقائيًا عند أول تسجيل دخول من تطبيق أندرويد.',
        redeemedTitle: 'تم تفعيل شهرك المجاني',
        redeemedBody: 'سجّلت الدخول من تطبيق أندرويد وأُضيف شهر مجاني إلى حسابك في SQB، ويعمل في الموقع وفي التطبيق. شكرًا لتجربتك.',
        returningNotice: 'جاري تسجيل دخولك وإعادتك لإكمال الانضمام إلى المجرّبين...',
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
        pill: 'Android app · test version',
        hubShow: 'Details and join',
        hubShowJoined: 'Show install steps',
        hubJoinedTitle: 'You are on the Android testers list',
        hubHide: 'Hide details',
        hubDismiss: 'Close this card',
        teaserTitle: 'Join the Android app testers',
        title: 'Join the SQB Android testers',
        gift: 'A free month for the first testers',
        body: 'We are testing the SQB app on Android phones and we need your feedback to improve it. Everyone who joins the testers gets 1 free month on their account, usable on the website and in the app, added the first time they sign in from the Android app.',
        terms: 'For the first few users and for a limited time, for accounts that have never paid and have no current plan or grant.',
        saudi: 'The closed test is currently available in Saudi Arabia only.',
        guestSteps: [
            'Create your free account.',
            'We bring you back here to join the testers.',
            'You then see the steps to get the app.',
        ],
        guestCta: 'Create an account and join',
        memberLead: 'One step: enter the Google email you use on your Android phone.',
        spots: () => 'Limited seats, first few users only',
        full: 'All seats for this offer are taken. Thank you for your interest.',
        emailLabel: 'Google account email on your phone',
        emailHint: 'The email you use in Google Play. We save it to add you to the test list.',
        privacyLink: 'Privacy policy',
        join: 'Join the testers',
        joining: 'Joining...',
        limit: 'One spot per account, first come first served.',
        joinedTitle: 'You are on the testers list',
        savedAs: 'Saved email:',
        nextTitle: 'Your next steps',
        oneTap: {
            lead: 'We will sign you up with this email:',
            check: 'Check that it is the same email your phone uses in Google Play.',
            join: 'Yes, sign me up',
            other: 'My phone uses another email',
        },
        guide: {
            progress: 'Step {n} of {total}',
            account: 'Always use this email:',
            back: 'Back to the previous step',
            helpTitle: 'Not working?',
            help: [
                'Use an Android phone.',
                'Check that you are signed in with the email shown here. If you have more than one Google account, switch to it.',
                'If you opened this site inside TikTok, Telegram or Instagram, open it in Chrome.',
                'If it says the app is not available, wait a while and try again.',
                'The app is currently available in Saudi Arabia only.',
            ],
            steps: {
                group: {
                    title: 'Join the testers group',
                    lines: ['Tap the button below.', 'On the Google page, tap the button to join the group (Join group).', 'Then come back to this page.'],
                    button: 'Open the group',
                },
                optin: {
                    title: 'Accept the app test',
                    lines: ['Tap the button below.', 'On the page that opens, tap the button to join the test (Become a tester).', 'Then come back to this page.'],
                    button: 'Open the test page',
                },
                install: {
                    title: 'Install the app',
                    lines: ['Tap the button below.', 'In Google Play, tap Install.'],
                    button: 'Open Google Play',
                },
                signin: {
                    title: 'Sign in and get your free month',
                    open: 'Open the SQB app on your phone.',
                    google: 'Tap the Google button and choose the same account you use for SQB.',
                    password: 'Sign in with the same SQB username and password.',
                    done: 'The free month is added automatically. There is nothing else to do.',
                },
            },
        },
        stepsGroup: {
            group: 'Join the testers Google Group with the same Google account you entered.',
            optIn: 'On your Android phone, with that same account, open the test link and accept.',
            install: 'Install the app from Google Play and sign in with the same SQB account. If you sign in with Google, use the Google button.',
        },
        stepsManual: {
            wait: 'We add your email to the Google Play test list by hand, usually within a day.',
            optIn: 'The test link works only after your email has been added. Then open it on your Android phone with the same account and accept. If Google shows an error, try again later.',
            install: 'Install the app from Google Play and sign in with the same SQB account. If you sign in with Google, use the Google button.',
        },
        openGroup: 'Open the Google Group',
        openOptIn: 'Open the test link',
        openDownload: 'Get the app on Google Play',
        noLink: 'The test link will appear here when it is ready.',
        monthNote: 'The free month is added to your account automatically the first time you sign in from the Android app.',
        redeemedTitle: 'Your free month is active',
        redeemedBody: 'You signed in from the Android app and 1 free month was added to your SQB account, usable on the website and in the app. Thank you for testing.',
        returningNotice: 'Logging you in and taking you back to finish joining the testers…',
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
