/**
 * Copy for /success-stories and the in-app "tell us how it went" prompt.
 *
 * Every string here is chrome. The stories themselves are written by students
 * and are never translated, generated, edited for tone, or supplied as
 * examples — a testimonial's only value is that a real person said it, so
 * there is nothing in this file that could ever be mistaken for one.
 */
const successStoriesCopy = {
    ar: {
        meta: {
            title: 'قصص نجاح طلاب SQB في اختبار SMLE وSNLE',
            description: (n) => (n > 0
                ? `${n} من طلاب SQB يروون كيف حضّروا لاختبار الهيئة السعودية للتخصصات الصحية وكيف كانت النتيجة.`
                : 'قصص طلاب SQB مع اختبار الهيئة السعودية للتخصصات الصحية.'),
        },
        kicker: 'بكلماتهم هم',
        title: 'قصص نجاح من طلاب SQB',
        intro: (n) => (n === 1
            ? 'قصة واحدة حتى الآن، منشورة بإذن صاحبها.'
            : `${n} قصة من طلاب حضّروا معنا، منشورة بإذن أصحابها.`),
        ctaTitle: 'ابدأ قصتك',
        ctaBody: 'جرّب عشرين سؤالاً بدون حساب، أو ابدأ بأربعين سؤالاً مجانياً بحساب مجاني.',
        ctaDemo: 'جرّب ٢٠ سؤالاً الآن',
        ctaSignup: 'أنشئ حساباً مجانياً',

        // ── الطلب داخل التطبيق ──
        prompt: {
            title: 'هل ساعدك SQB؟',
            body: 'إن كنت تقدّمت في تحضيرك معنا، فكلمتان منك تساعدان طالباً آخر يقرّر الآن. لن يُنشر شيء إلا بموافقتك، وبعد مراجعتنا.',
            cta: 'اكتب قصتي',
            dismiss: 'ليس الآن',
        },
        form: {
            title: 'اكتب قصتك',
            nameLabel: 'الاسم كما تريد أن يظهر',
            namePlaceholder: 'مثال: د. سارة ع.',
            specialtyLabel: 'تخصصك (اختياري)',
            resultLabel: 'نتيجتك أو موعد اختبارك (اختياري)',
            resultPlaceholder: 'مثال: اجتزت SMLE في أغسطس ٢٠٢٦',
            quoteLabel: 'قصتك',
            quotePlaceholder: 'ما الذي كنت تعاني منه، وما الذي تغيّر؟ الجُمل الصادقة القصيرة أنفع من الفقرات الطويلة.',
            quoteHint: '٤٠ حرفاً على الأقل',
            consent: 'أوافق على نشر اسمي وكلماتي على موقع SQB.',
            consentNote: 'لن يُنشر شيء قبل مراجعتنا. يمكنك طلب الحذف في أي وقت عبر صفحة التواصل.',
            submit: 'أرسل قصتي',
            cancel: 'إلغاء',
            sending: 'جارٍ الإرسال…',
            thanksTitle: 'وصلتنا — شكراً لك',
            thanksBody: 'سنراجعها قبل النشر. إن أردت تعديلها أو سحبها، تواصل معنا.',
            errorShort: 'اكتب ٤٠ حرفاً على الأقل حتى تكون القصة مفيدة لمن يقرأها.',
            errorConsent: 'نحتاج موافقتك الصريحة قبل نشر أي شيء.',
            errorGeneric: 'تعذّر الإرسال. حاول مرة أخرى.',
        },
    },
    en: {
        meta: {
            title: 'SQB student success stories — SMLE and SNLE',
            description: (n) => (n > 0
                ? `${n} SQB students on how they prepared for the Saudi Commission exams and how it went.`
                : 'How SQB students prepared for the Saudi Commission exams.'),
        },
        kicker: 'In their own words',
        title: 'Success stories from SQB students',
        intro: (n) => (n === 1
            ? 'One story so far, published with its author’s permission.'
            : `${n} students who prepared with us, published with their permission.`),
        ctaTitle: 'Start your own',
        ctaBody: 'Try twenty questions with no account, or start with forty free ones.',
        ctaDemo: 'Try 20 questions now',
        ctaSignup: 'Create a free account',

        // ── The in-app ask ──
        prompt: {
            title: 'Has SQB helped?',
            body: 'If your preparation has moved forward with us, a couple of sentences from you helps the next student who is deciding right now. Nothing is published without your permission, and not before we have read it.',
            cta: 'Write my story',
            dismiss: 'Not now',
        },
        form: {
            title: 'Write your story',
            nameLabel: 'Name, as you want it shown',
            namePlaceholder: 'e.g. Dr Sara A.',
            specialtyLabel: 'Your specialty (optional)',
            resultLabel: 'Your result or exam date (optional)',
            resultPlaceholder: 'e.g. Passed the SMLE, August 2026',
            quoteLabel: 'Your story',
            quotePlaceholder: 'What were you struggling with, and what changed? A few honest sentences beat a long paragraph.',
            quoteHint: 'At least 40 characters',
            consent: 'I agree to my name and words being published on the SQB site.',
            consentNote: 'Nothing goes up before we have read it. You can ask us to remove it at any time from the contact page.',
            submit: 'Send my story',
            cancel: 'Cancel',
            sending: 'Sending…',
            thanksTitle: 'Got it — thank you',
            thanksBody: 'We will read it before publishing. If you want to change or withdraw it, just get in touch.',
            errorShort: 'Please write at least 40 characters, so the story is useful to whoever reads it.',
            errorConsent: 'We need your explicit permission before publishing anything.',
            errorGeneric: 'Could not send that. Please try again.',
        },
    },
};

export default successStoriesCopy;
