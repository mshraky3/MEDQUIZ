/**
 * Chrome for the public question library (/questions).
 *
 * Only the wrapper is translated. The questions, options and explanations stay
 * in English under both site languages, exactly as they do inside the app —
 * clinical content is English on the real exam, and rendering an Arabic
 * mock-up of it would promise something the product does not do.
 */
const publicQuestionsCopy = {
    ar: {
        breadcrumbHome: 'الرئيسية',
        breadcrumbRoot: 'أسئلة تدريبية مجانية',

        hub: {
            kicker: 'Free practice questions',
            title: 'أسئلة تدريبية مجانية لاختبار SMLE وSNLE',
            intro: (n) => `${n} سؤالاً بنمط الاختبار، مفتوحة للجميع بدون حساب وبدون بطاقة دفع — كل سؤال بخياراته الأربعة وشرح مكتوب يوضّح سبب صحة الإجابة. مأخوذة من بنك أسئلة SQB الكامل.`,
            tracks: {
                medical: 'الطب البشري — SMLE',
                nursing: 'التمريض — SNLE',
            },
            countLabel: (n) => `${n} سؤالاً`,
        },

        specialty: {
            title: (label) => `أسئلة ${label} — تدريب مجاني بدون حساب`,
            intro: (n, label) => `${n} سؤالاً بنمط الاختبار في ${label}، كل سؤال بخياراته الأربعة وشرح مكتوب يوضّح سبب صحة الإجابة. مفتوحة للجميع بدون تسجيل.`,
            listTitle: 'الأسئلة',
            siblingsTitle: 'تخصصات أخرى',
        },

        question: {
            answerLabel: 'الإجابة الصحيحة',
            yourAnswer: 'إجابتك',
            explanationTitle: 'الشرح',
            tryFirst: 'اختر إجابتك قبل قراءة الشرح بالأسفل.',
            relatedTitle: (label) => `أسئلة أخرى في ${label}`,
            allInSpecialty: (label) => `كل أسئلة ${label}`,
            sourceLabel: 'المصدر',
        },

        cta: {
            title: '40 سؤالاً مجاناً مع حساب',
            body: 'الأسئلة المنشورة هنا عيّنة ثابتة. أنشئ حساباً مجانياً لتتدرب على بنك الأسئلة الكامل، مع تحليل أدائك حسب التخصص وصفحة لمراجعة أخطائك.',
            button: 'إنشاء حساب مجاني',
            note: 'بدون بطاقة دفع',
        },

        notFound: {
            title: 'لم نجد هذا السؤال',
            body: 'ربما تغيّر الرابط. تصفّح بقية الأسئلة المجانية من هنا.',
            back: 'كل الأسئلة المجانية',
        },
    },

    en: {
        breadcrumbHome: 'Home',
        breadcrumbRoot: 'Free practice questions',

        hub: {
            kicker: 'Free practice questions',
            title: 'Free SMLE and SNLE practice questions',
            intro: (n) => `${n} exam-style questions, open to everyone with no account and no payment card — each with its four options and a written explanation of why the answer is right. Taken from the full SQB question bank.`,
            tracks: {
                medical: 'Medicine — SMLE',
                nursing: 'Nursing — SNLE',
            },
            countLabel: (n) => `${n} questions`,
        },

        specialty: {
            title: (label) => `${label} practice questions — free, no account`,
            intro: (n, label) => `${n} exam-style questions in ${label}, each with its four options and a written explanation of why the answer is right. Open to everyone, no sign-up.`,
            listTitle: 'Questions',
            siblingsTitle: 'Other specialties',
        },

        question: {
            answerLabel: 'Correct answer',
            yourAnswer: 'Your answer',
            explanationTitle: 'Explanation',
            tryFirst: 'Pick your answer before reading the explanation below.',
            relatedTitle: (label) => `More ${label} questions`,
            allInSpecialty: (label) => `All ${label} questions`,
            sourceLabel: 'Source',
        },

        cta: {
            title: '40 free questions with an account',
            body: 'The questions published here are a fixed sample. Create a free account to practise on the full bank, with performance analytics by specialty and a page for reviewing your mistakes.',
            button: 'Create a free account',
            note: 'No payment card',
        },

        notFound: {
            title: 'We could not find that question',
            body: 'The link may have changed. Browse the rest of the free questions here.',
            back: 'All free questions',
        },
    },
};

export default publicQuestionsCopy;
