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

        faqTitle: 'أسئلة شائعة عن الأسئلة المجانية',
        faq: (total, bankTotal) => [
            {
                q: 'هل هذه الأسئلة مجانية فعلاً؟',
                a: `نعم. الأسئلة المنشورة هنا وعددها ${total} سؤالاً مفتوحة للجميع: لا تحتاج حساباً، ولا بريداً إلكترونياً، ولا بطاقة دفع. كل سؤال معروض بخياراته الأربعة وإجابته الصحيحة وشرحه المكتوب كاملاً على الصفحة نفسها.`,
            },
            {
                q: 'لماذا الأسئلة والشروحات بالإنجليزية؟',
                a: 'لأن اختبار الهيئة السعودية للتخصصات الصحية نفسه يُقدَّم بالإنجليزية. ترجمة الأسئلة كانت ستجعل التدريب أسهل من الاختبار الحقيقي، وهذا يضر أكثر مما ينفع. واجهة الموقع بالعربية، أما المحتوى الطبي فيبقى بلغة الاختبار.',
            },
            {
                q: 'ما الفرق بين هذه الأسئلة والبنك الكامل؟',
                a: `هذه عيّنة ثابتة من ${total} سؤالاً منشورة للاطلاع. البنك الكامل يضم ${bankTotal} سؤالاً، ويأتي معه تحليل أدائك حسب التخصص، وصفحة تجمع أسئلتك الخاطئة، واختبارات محاكية بوقت. تحصل على 40 سؤالاً منه مجاناً عند إنشاء حساب.`,
            },
            {
                q: 'هل الأسئلة محدَّثة على نمط الاختبار الحالي؟',
                a: 'نعم. البنك مراجَع على نمط أسئلة 2026، وتُضاف إليه تجميعات جديدة بعد مراجعتها. صفحة التجميعات توضّح ما تحتويه كل مجموعة ومتى أُضيفت.',
            },
        ],

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

        faqTitle: 'Questions about the free questions',
        faq: (total, bankTotal) => [
            {
                q: 'Are these questions really free?',
                a: `Yes. The ${total} questions published here are open to everyone: no account, no email, no payment card. Each one shows its four options, the correct answer and the full written explanation on the page itself.`,
            },
            {
                q: 'Why are the questions and explanations in English?',
                a: 'Because the SCFHS exam itself is sat in English. Translating the questions would make practice easier than the real thing, which helps nobody. The site interface is available in Arabic; the clinical content stays in the language of the exam.',
            },
            {
                q: 'How is this different from the full bank?',
                a: `This is a fixed sample of ${total} questions. The full bank holds ${bankTotal}, and comes with performance analytics by specialty, a page collecting every question you got wrong, and timed mock exams. Creating a free account gives you 40 questions from it.`,
            },
            {
                q: 'Are the questions current?',
                a: 'Yes. The bank is reviewed against the 2026 question style, and new collections are added after review. The collections page sets out what each group contains.',
            },
        ],

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
