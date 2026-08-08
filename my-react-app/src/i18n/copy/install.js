/**
 * Copy for the PWA install banner and the landing page's install guide.
 * Lives here (not in common.js) so it ships in the chunk that uses it.
 *
 * Copy modules stay plain data — no JSX — so they read like a translation
 * file. A sentence that wraps an inline icon is split into the text either
 * side of it (`bannerIOSBefore` / `bannerIOSAfter`).
 */
const installCopy = {
    ar: {
        bannerLabel: 'تثبيت تطبيق SQB',
        bannerTitle: 'ثبّت SQB على جهازك',
        bannerIOSBefore: 'اضغط زر المشاركة',
        bannerIOSAfter: 'ثم «إضافة إلى الشاشة الرئيسية».',
        bannerAndroid: 'افتحه كتطبيق بنقرة واحدة — وصول أسرع بلا متصفح.',
        install: 'تثبيت',
        close: 'إغلاق',

        sectionLabel: 'تثبيت التطبيق على الشاشة الرئيسية',
        pill: 'تطبيق على جهازك',
        sectionTitle: 'ثبّت SQB على شاشتك الرئيسية',
        sectionBody: 'أضف المنصة كأيقونة على جوالك لتفتحها بنقرة واحدة كأنها تطبيق — بملء الشاشة وبدون شريط المتصفح، ودون الحاجة إلى متجر التطبيقات.',
        iosTitle: 'على iPhone / iPad (Safari)',
        iosSteps: [
            'اضغط زر «المشاركة» في شريط سفاري.',
            'اختر «إضافة إلى الشاشة الرئيسية».',
            'اضغط «إضافة» — ستظهر أيقونة SQB على شاشتك.',
        ],
        androidTitle: 'على Android (Chrome)',
        androidSteps: [
            'افتح قائمة المتصفح (⋮) أعلى الشاشة.',
            'اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».',
            'أكّد — ستُضاف أيقونة SQB إلى جهازك.',
        ],
        installNow: 'ثبّت التطبيق الآن',
        // Labels inside the animated phone that plays the steps (see
        // InstallShowcase.jsx). They mirror what the real OS shows, so the
        // student recognises the sheet when it actually appears.
        mock: {
            addressBar: 'smle-question-bank.com',
            sheetTitle: 'خيارات المشاركة',
            addToHome: 'إضافة إلى الشاشة الرئيسية',
            installApp: 'تثبيت التطبيق',
            confirm: 'إضافة',
            homeLabel: 'الشاشة الرئيسية',
            done: 'تم — SQB على جهازك',
            stepAria: (n, total) => `الخطوة ${n} من ${total}`,
            replay: 'إعادة التشغيل',
        },
    },

    en: {
        bannerLabel: 'Install the SQB app',
        bannerTitle: 'Add SQB to your device',
        bannerIOSBefore: 'Tap the share button',
        bannerIOSAfter: 'then “Add to Home Screen”.',
        bannerAndroid: 'Open it like an app in one tap — faster, with no browser bar.',
        install: 'Install',
        close: 'Close',

        sectionLabel: 'Install the app on your home screen',
        pill: 'An app on your device',
        sectionTitle: 'Add SQB to your home screen',
        sectionBody: 'Put SQB on your phone as an icon and open it in one tap, just like a native app — full screen, no browser bar, and no app store needed.',
        iosTitle: 'On iPhone / iPad (Safari)',
        iosSteps: [
            'Tap the “Share” button in the Safari toolbar.',
            'Choose “Add to Home Screen”.',
            'Tap “Add” — the SQB icon appears on your home screen.',
        ],
        androidTitle: 'On Android (Chrome)',
        androidSteps: [
            'Open the browser menu (⋮) at the top of the screen.',
            'Choose “Install app” or “Add to Home screen”.',
            'Confirm — the SQB icon is added to your device.',
        ],
        installNow: 'Install the app now',
        // Labels inside the animated phone that plays the steps (see
        // InstallShowcase.jsx). They mirror what the real OS shows, so the
        // student recognises the sheet when it actually appears.
        mock: {
            addressBar: 'smle-question-bank.com',
            sheetTitle: 'Share options',
            addToHome: 'Add to Home Screen',
            installApp: 'Install app',
            confirm: 'Add',
            homeLabel: 'Home screen',
            done: 'Done — SQB is on your device',
            stepAria: (n, total) => `Step ${n} of ${total}`,
            replay: 'Replay',
        },
    },
};

export default installCopy;
