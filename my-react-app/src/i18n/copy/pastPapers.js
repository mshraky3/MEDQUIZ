/**
 * Chrome for /past-papers.
 *
 * The collection names, blurbs and the not-official-papers note live in
 * src/seo/pastPapers.js, because the prerendered HTML needs them too and one
 * copy of a factual claim is safer than two. Only the framing is here.
 */
const pastPapersCopy = {
    ar: {
        breadcrumbHome: 'الرئيسية',
        breadcrumbRoot: 'تجميعات الأسئلة',

        hub: {
            kicker: 'SMLE & SNLE collections',
            title: 'تجميعات أسئلة SMLE وSNLE',
            intro: (bankTotal, n) => `بنك SQB مبني من ${bankTotal} سؤالاً موزّعة على ${n} تجميعات، لكل سؤال فيها شرح مكتوب. هذه الصفحة تشرح ما تحتويه كل تجميعة، مع أسئلة مفتوحة للاطلاع من كل واحدة منها بدون حساب.`,
            tracks: { medical: 'الطب البشري — SMLE', nursing: 'التمريض — SNLE' },
            countLabel: (n) => `${n} سؤالاً`,
        },

        collection: {
            intro: (blurb, total, track) => `${blurb} تضم هذه التجميعة ${total} سؤالاً بنمط اختبار ${track}، لكل سؤال منها شرح مكتوب يوضّح سبب صحة الإجابة.`,
            specialtiesTitle: 'التخصصات التي تغطيها',
            openCount: (n) => `${n} سؤالاً مفتوحاً`,
            samplesTitle: 'أسئلة مفتوحة من هذه التجميعة',
            siblingsTitle: 'تجميعات أخرى',
        },

        cta: {
            title: '40 سؤالاً مجاناً من البنك الكامل',
            body: 'الأسئلة المعروضة هنا عيّنة. أنشئ حساباً مجانياً للتدرب على البنك الكامل مع تحليل أدائك حسب التخصص ومراجعة أخطائك.',
            button: 'إنشاء حساب مجاني',
            note: 'بدون بطاقة دفع',
        },

        links: { allQuestions: 'كل الأسئلة التدريبية المجانية', guides: 'أدلة التحضير' },

        notFound: {
            title: 'لم نجد هذه التجميعة',
            body: 'ربما تغيّر الرابط. تصفّح بقية التجميعات من هنا.',
            back: 'كل التجميعات',
        },
    },

    en: {
        breadcrumbHome: 'Home',
        breadcrumbRoot: 'Question collections',

        hub: {
            kicker: 'SMLE & SNLE collections',
            title: 'SMLE and SNLE question collections',
            intro: (bankTotal, n) => `The SQB bank is built from ${bankTotal} questions across ${n} collections, every one of them explained. This page sets out what each collection contains, with open sample questions from each — no account needed.`,
            tracks: { medical: 'Medicine — SMLE', nursing: 'Nursing — SNLE' },
            countLabel: (n) => `${n} questions`,
        },

        collection: {
            intro: (blurb, total, track) => `${blurb} This collection holds ${total} ${track}-style questions, each with a written explanation of why the answer is right.`,
            specialtiesTitle: 'Specialties it covers',
            openCount: (n) => `${n} open questions`,
            samplesTitle: 'Open questions from this collection',
            siblingsTitle: 'Other collections',
        },

        cta: {
            title: '40 free questions from the full bank',
            body: 'The questions shown here are a sample. Create a free account to practise on the full bank, with performance analytics by specialty and a page for reviewing your mistakes.',
            button: 'Create a free account',
            note: 'No payment card',
        },

        links: { allQuestions: 'All free practice questions', guides: 'Study guides' },

        notFound: {
            title: 'We could not find that collection',
            body: 'The link may have changed. Browse the rest of the collections here.',
            back: 'All collections',
        },
    },
};

export default pastPapersCopy;
