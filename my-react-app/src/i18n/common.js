import { useCopy } from './LanguageContext.jsx';

/**
 * Site-wide UI copy: the shell (navbar, footer, banners), generic buttons and
 * the error/empty states that several pages share.
 *
 * Page-specific copy does NOT live here — it sits in a `*.copy.js` module next
 * to its page so a lazily-loaded route keeps shipping its own text in its own
 * chunk. This file is loaded on every page, so keep it lean.
 *
 * Exam names (SMLE, SNLE, Prometric), the brand (SQB) and all study material
 * stay in English in both languages — see LanguageContext.jsx.
 */
const common = {
    ar: {
        brand: 'SQB',
        nav: {
            home: 'الرئيسية',
            analysis: 'التحليل',
            wrongQuestions: 'أسئلتي الخاطئة',
            studyContent: 'المحتوى الدراسي',
            contact: 'تواصل معنا',
            guides: 'أدلة التحضير',
            about: 'من نحن',
            faq: 'الأسئلة الشائعة',
            menu: 'القائمة',
            back: 'رجوع',
            logout: 'تسجيل الخروج',
            account: 'حسابي',
            login: 'تسجيل الدخول',
            signup: 'إنشاء حساب',
            subscribe: 'الاشتراك',
            subscriptionUntil: (date) => `الاشتراك حتى ${date}`,
            subscriptionExpiryTitle: 'تاريخ انتهاء اشتراكك',
        },
        actions: {
            retry: 'إعادة المحاولة',
            reload: 'إعادة تحميل',
            backHome: 'العودة للرئيسية',
            close: 'إغلاق',
            cancel: 'إلغاء',
            confirm: 'تأكيد',
            save: 'حفظ',
            send: 'إرسال',
            next: 'التالي',
            previous: 'السابق',
            quickLinks: 'روابط سريعة',
        },
        loading: 'جاري التحميل',
        loadingEllipsis: 'جاري التحميل…',
        footer: {
            tagline: 'منصتك الشاملة للتحضير لاختبار SMLE وSNLE والبرومترك',
            platform: 'المنصة',
            information: 'معلومات',
            legal: 'الشؤون القانونية',
            contactHeading: 'تواصل',
            suggestions: 'الاقتراحات',
            terms: 'شروط الخدمة',
            refund: 'سياسة الاسترداد',
            privacy: 'سياسة الخصوصية',
            email: 'البريد الإلكتروني',
            whatsapp: 'واتساب',
            contactPage: 'صفحة الاتصال',
            contactUs: 'اتصل بنا',
            rights: (year) => `© ${year} SQB — بنك أسئلة SMLE. جميع الحقوق محفوظة.`,
            legalEntity: 'شركة دار الخبرة التجارية  |  السجل التجاري (الرقم الموحد): 7040567922',
            disclaimer: 'هذه المنصة للأغراض التعليمية فقط، وغير تابعة للهيئة السعودية للتخصصات الصحية أو Prometric.',
        },
        cookies: {
            dialogLabel: 'ملفات تعريف الارتباط',
            text: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وعرض إعلانات مناسبة لك.',
            privacyLink: 'سياسة الخصوصية',
            necessaryOnly: 'الضرورية فقط',
            acceptAll: 'قبول الكل',
        },
        // Arabic counts questions in four buckets — see arDays in the backend's
        // userEmailService for the same rule applied to days.
        freeAllowance: {
            remaining: (n) => (
                n === 1 ? 'باقي لك سؤال مجاني واحد'
                    : n === 2 ? 'باقي لك سؤالان مجانيان'
                        : n <= 10 ? `باقي لك ${n} أسئلة مجانية`
                            : `باقي لك ${n} سؤالاً مجانياً`
            ),
            spent: 'أنهيت أسئلتك المجانية — حسابك وملخصاتك المجانية تبقى مفتوحة',
            cta: 'اشترك الآن',
        },
        notifications: {
            label: 'الإشعارات',
            title: 'الإشعارات',
            empty: 'لا توجد إشعارات بعد. أكمل اختباراً أو اضبط هدفاً وستظهر إنجازاتك هنا.',
            markAllRead: 'تعليم الكل كمقروء',
            justNow: 'الآن',
            minutesAgo: (n) => `قبل ${n} دقيقة`,
            hoursAgo: (n) => `قبل ${n} ساعة`,
            daysAgo: (n) => `قبل ${n} يوم`,
        },
        errors: {
            notFoundTitle: 'الصفحة غير موجودة',
            notFoundBody: 'الرابط الذي فتحته غير صحيح أو لم يعد متاحاً. يمكنك العودة للرئيسية أو الانتقال مباشرة إلى ما تبحث عنه.',
            notFoundShort: 'الرابط الذي فتحته غير صحيح أو لم يعد متاحاً.',
            unexpectedTitle: 'حدث خطأ غير متوقع',
            unexpectedBody: 'تعذّر تحميل هذه الصفحة. جرّب إعادة التحميل، وإذا تكرر الأمر تواصل معنا.',
            updatingTitle: 'جاري تحديث الصفحة...',
            updatingBody: 'صدر تحديث جديد للمنصة — نعيد التحميل لتحصل على أحدث نسخة.',
            network: 'تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.',
            generic: 'حدث خطأ. حاول مرة أخرى.',
        },
        install: {
            dialogLabel: 'تثبيت تطبيق SQB',
        },
    },

    en: {
        brand: 'SQB',
        nav: {
            home: 'Home',
            analysis: 'Analytics',
            wrongQuestions: 'My Wrong Questions',
            studyContent: 'Study Material',
            contact: 'Contact',
            guides: 'Study Guides',
            about: 'About',
            faq: 'FAQ',
            menu: 'Menu',
            back: 'Back',
            logout: 'Log out',
            account: 'My account',
            login: 'Log in',
            signup: 'Sign up',
            subscribe: 'Subscribe',
            subscriptionUntil: (date) => `Subscribed until ${date}`,
            subscriptionExpiryTitle: 'Your subscription expiry date',
        },
        actions: {
            retry: 'Try again',
            reload: 'Reload',
            backHome: 'Back to home',
            close: 'Close',
            cancel: 'Cancel',
            confirm: 'Confirm',
            save: 'Save',
            send: 'Send',
            next: 'Next',
            previous: 'Previous',
            quickLinks: 'Quick links',
        },
        loading: 'Loading',
        loadingEllipsis: 'Loading…',
        footer: {
            tagline: 'Your complete prep platform for the SMLE, SNLE and Prometric exams',
            platform: 'Platform',
            information: 'Information',
            legal: 'Legal',
            contactHeading: 'Contact',
            suggestions: 'Suggestions',
            terms: 'Terms of Service',
            refund: 'Refund Policy',
            privacy: 'Privacy Policy',
            email: 'Email',
            whatsapp: 'WhatsApp',
            contactPage: 'Contact page',
            contactUs: 'Contact us',
            rights: (year) => `© ${year} SQB — SMLE Question Bank. All rights reserved.`,
            legalEntity: 'Dar Al Khibra Trading Co.  |  Commercial Registration (Unified No.): 7040567922',
            disclaimer: 'This platform is for educational purposes only. It is not affiliated with SCFHS or Prometric.',
        },
        cookies: {
            dialogLabel: 'Cookies',
            text: 'We use cookies to improve your experience and show relevant ads.',
            privacyLink: 'Privacy Policy',
            necessaryOnly: 'Necessary only',
            acceptAll: 'Accept all',
        },
        freeAllowance: {
            remaining: (n) => `${n} free question${n === 1 ? '' : 's'} left`,
            spent: "That's your free questions — your account and the free lessons stay open",
            cta: 'Subscribe now',
        },
        notifications: {
            label: 'Notifications',
            title: 'Notifications',
            empty: 'Nothing yet. Finish a quiz or set a goal and your milestones will show up here.',
            markAllRead: 'Mark all as read',
            justNow: 'Just now',
            minutesAgo: (n) => `${n}m ago`,
            hoursAgo: (n) => `${n}h ago`,
            daysAgo: (n) => `${n}d ago`,
        },
        errors: {
            notFoundTitle: 'Page not found',
            notFoundBody: 'That link is wrong or no longer available. Head back home, or jump straight to what you were looking for.',
            notFoundShort: 'That link is wrong or no longer available.',
            unexpectedTitle: 'Something went wrong',
            unexpectedBody: 'We could not load this page. Try reloading — if it keeps happening, get in touch.',
            updatingTitle: 'Updating the page…',
            updatingBody: 'A new version of the platform was released — reloading so you get the latest one.',
            network: 'Could not reach the server. Check your connection and try again.',
            generic: 'Something went wrong. Please try again.',
        },
        install: {
            dialogLabel: 'Install the SQB app',
        },
    },
};

export const useCommon = () => useCopy(common);

export default common;
