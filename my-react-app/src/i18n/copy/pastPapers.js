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
        breadcrumbLabel: 'مسار التنقل',

        seo: {
            hubTitle: (bankTotal) => `تجميعات أسئلة SMLE وSNLE وSDLE — ${bankTotal} سؤالاً | SQB`,
            hubDescription: 'دليل تجميعات أسئلة اختبارات الهيئة السعودية للتخصصات الصحية للطب والتمريض وطب الأسنان: ما تحتويه كل تجميعة، وكم سؤالاً فيها، مع أسئلة مفتوحة للاطلاع من بعضها بدون حساب.',
            hubKeywords: 'smle past papers, تجميعات سملي, تجميعات SMLE, تجميعات SNLE, تجميعات SDLE, اسئلة سملي سابقة, snle past papers, اسئلة برومترك سابقة',
            hubCollectionName: 'تجميعات أسئلة SMLE وSNLE وSDLE',
            collectionTitle: (label, total, track) => `${label} — ${total} سؤال ${track} | SQB`,
            collectionDescription: (blurb, total, track) => `${blurb} ${total} سؤالاً بنمط اختبار ${track}.`,
            collectionKeywords: (labelAr, labelEn, track) => `${labelEn}, ${labelAr}, smle past papers, تجميعات ${track}, اسئلة ${track}`,
        },

        relatedLinksLabel: 'روابط ذات صلة',

        hub: {
            kicker: 'SMLE, SNLE & SDLE collections',
            title: 'تجميعات أسئلة SMLE وSNLE وSDLE',
            intro: (bankTotal, n) => `بنك SQB مبني من ${bankTotal} سؤالاً موزّعة على ${n} تجميعات، وقد يرد السؤال الواحد في أكثر من تجميعة. هذه الصفحة تشرح ما تحتويه كل تجميعة، مع أسئلة مفتوحة للاطلاع من بعضها بدون حساب.`,
            tracks: { medical: 'الطب البشري — SMLE', nursing: 'التمريض — SNLE', dental: 'طب الأسنان — SDLE' },
            countLabel: (n) => `${n} سؤالاً`,
        },

        collection: {
            intro: (blurb, total, track) => `${blurb} تضم هذه التجميعة ${total} سؤالاً بنمط اختبار ${track}.`,
            specialtiesTitle: 'التخصصات التي تغطيها',
            openCount: (n) => `${n} سؤالاً مفتوحاً`,
            samplesTitle: 'أسئلة مفتوحة من هذه التجميعة',
            siblingsTitle: 'تجميعات أخرى',
        },

        faqTitle: 'أسئلة شائعة عن التجميعات',
        faq: (bankTotal, n) => [
            {
                q: 'هل هذه أوراق اختبارات SMLE سابقة رسمية؟',
                a: 'لا. لا تنشر الهيئة السعودية للتخصصات الصحية ولا Prometric أوراق اختبارات سابقة، وأي جهة تدّعي بيع أوراق رسمية فهي غير صادقة. ما تجده هنا تجميعات أسئلة أعدّها فريق SQB اعتماداً على ما ينقله المتقدمون بعد الاختبار، ثم روجعت إجاباتها وأُعيدت صياغتها على نمط الاختبار الحالي.',
            },
            {
                q: 'ما الفرق بين التجميعات؟',
                a: `البنك مبني من ${n} تجميعات تضم ${bankTotal} سؤالاً في المجموع (قد يرد السؤال الواحد في أكثر من تجميعة). بعضها مرتبط بمصدر معروف بين المتقدمين مثل Midgard وGameBoy، وبعضها مجموعات مبنية على معيار: «الأسئلة المؤكدة» هي ما تكرر وروده في أكثر من مصدر، و«الأكثر تكراراً» هي الأعلى تردداً بين الدورات.`,
            },
            {
                q: 'هل يمكنني الاطلاع على تجميعة كاملة مجاناً؟',
                a: 'لا. المنشور هنا عيّنات مفتوحة للاطلاع بدون حساب. للوصول إلى التجميعات كاملة أنشئ حساباً مجانياً — يمنحك 10 أسئلة من البنك كله بدون بطاقة دفع.',
            },
            {
                q: 'هل تُحدَّث التجميعات؟',
                a: 'نعم. تُضاف تجميعات جديدة بعد مراجعة أسئلتها وتدقيق إجاباتها، وتُحدَّث الأعداد على هذه الصفحة مع كل إضافة.',
            },
        ],

        cta: {
            title: '10 أسئلة مجانية من البنك الكامل',
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
        breadcrumbLabel: 'Breadcrumb',

        seo: {
            hubTitle: (bankTotal) => `SMLE, SNLE and SDLE question collections — ${bankTotal} questions | SQB`,
            hubDescription: 'A guide to the SMLE, SNLE and SDLE question collections: what each one contains, how many questions it holds, and open sample questions from some of them with no account.',
            hubKeywords: 'smle past papers, snle past papers, SMLE question collections, SMLE recalls, Saudi Prometric past questions, SNLE recalls, SDLE recalls',
            hubCollectionName: 'SMLE, SNLE and SDLE question collections',
            collectionTitle: (label, total, track) => `${label} — ${total} ${track} questions | SQB`,
            collectionDescription: (blurb, total, track) => `${blurb} ${total} ${track}-style questions.`,
            collectionKeywords: (labelAr, labelEn, track) => `${labelEn}, smle past papers, ${track} question collection, ${track} recalls, ${track} practice questions`,
        },

        relatedLinksLabel: 'Related links',

        hub: {
            kicker: 'SMLE, SNLE & SDLE collections',
            title: 'SMLE, SNLE and SDLE question collections',
            intro: (bankTotal, n) => `The SQB bank is built from ${bankTotal} questions across ${n} collections, and one question can appear in more than one collection. This page sets out what each collection contains, with open sample questions from some of them — no account needed.`,
            tracks: { medical: 'Medicine — SMLE', nursing: 'Nursing — SNLE', dental: 'Dentistry — SDLE' },
            countLabel: (n) => `${n} questions`,
        },

        collection: {
            intro: (blurb, total, track) => `${blurb} This collection holds ${total} ${track}-style questions.`,
            specialtiesTitle: 'Specialties it covers',
            openCount: (n) => `${n} open questions`,
            samplesTitle: 'Open questions from this collection',
            siblingsTitle: 'Other collections',
        },

        faqTitle: 'Questions about the collections',
        faq: (bankTotal, n) => [
            {
                q: 'Are these official past SMLE papers?',
                a: 'No. Neither SCFHS nor Prometric publishes past exam papers, and anyone claiming to sell official papers is not being straight with you. What you find here are collections assembled by the SQB team from what candidates report after sitting the exam, then answer-checked and rewritten to the current exam style.',
            },
            {
                q: 'What is the difference between the collections?',
                a: `The bank is built from ${n} collections holding ${bankTotal} questions in total (one question can appear in more than one collection). Some carry a name candidates already know, such as Midgard and GameBoy; others are grouped by a rule — "Confirmed" means reported by more than one source, "Most repeated" means highest recurrence across sittings.`,
            },
            {
                q: 'Can I read a whole collection for free?',
                a: 'No. What is published here is an open sample you can read without an account. For the collections in full, create a free account — it gives you 10 questions from the whole bank, with no payment card.',
            },
            {
                q: 'Are the collections updated?',
                a: 'Yes. New collections are added once their questions are reviewed and their answers checked, and the counts on this page update with each addition.',
            },
        ],

        cta: {
            title: '10 free questions from the full bank',
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
