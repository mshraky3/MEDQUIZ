/**
 * The no-account demo at /demo.
 *
 * 120 people chose a study track this month and 42 went on to request a
 * verification code — 78 walked away at the form. They wanted to see the
 * questions, not to open an account, and /questions (which publishes 240 of
 * them) answers that only for someone willing to read. This is the same
 * content made playable: pick an answer, find out, read why.
 *
 * Study content stays in English in both languages, exactly as it does
 * everywhere else — the exam is written in English. Only the chrome translates.
 */
const demoCopy = {
    ar: {
        meta: {
            title: 'جرّب بنك الأسئلة — ٢٠ سؤالاً بدون حساب | SQB',
            description: 'جرّب أسئلة SMLE وSNLE حقيقية بشرح كامل لكل إجابة، بدون تسجيل وبدون بريد إلكتروني. عشرون سؤالاً من البنك نفسه الذي يستخدمه المشتركون.',
        },
        kicker: 'تجربة مجانية بدون حساب',
        title: 'جرّب عشرين سؤالاً الآن',
        intro: 'أسئلة حقيقية من البنك، بشرح كامل لكل إجابة. بدون بريد إلكتروني وبدون بطاقة — اختر مسارك وابدأ.',
        trackQuestion: 'أي مسار تريد تجربته؟',
        tracks: {
            medical: { label: 'طب بشري', exam: 'اختبار الترخيص الطبي (SMLE)' },
            nursing: { label: 'تمريض', exam: 'اختبار SNLE للتمريض' },
        },
        start: 'ابدأ التجربة',
        progress: (n, total) => `السؤال ${n} من ${total}`,
        correct: 'إجابة صحيحة',
        incorrect: 'إجابة خاطئة',
        correctAnswerIs: 'الإجابة الصحيحة',
        explanationTitle: 'الشرح',
        next: 'السؤال التالي',
        finish: 'عرض النتيجة',
        loading: 'جارٍ تحضير الأسئلة…',
        error: 'تعذّر تحميل الأسئلة. حدّث الصفحة للمحاولة مرة أخرى.',
        result: {
            kicker: 'انتهت التجربة',
            title: (score, total) => `أجبت ${score} من ${total} إجابة صحيحة`,
            strong: 'بداية قوية. الأسئلة في البنك الكامل بالمستوى نفسه ومعها الشرح نفسه.',
            mixed: 'هذا بالضبط ما تكشفه المذاكرة بالأسئلة: أين تقف فعلاً قبل الاختبار لا بعده.',
            weak: 'لا بأس — هذه هي الفائدة. كل سؤال أخطأت فيه هنا مشروح، وهذا ما يجعل العشرة التالية أسهل.',
            ctaTitle: 'أنشئ حساباً مجانياً و احصل على ٤٠ سؤالاً إضافياً',
            ctaBody: 'بدون بطاقة. تحصل أيضاً على تحليلات أدائك، وصفحة تجمع أخطاءك، وأول درس من كل تخصص.',
            cta: 'أنشئ حسابي المجاني',
            retry: 'جرّب عشرين سؤالاً أخرى',
            browse: 'تصفّح الأسئلة المنشورة',
        },
    },
    en: {
        meta: {
            title: 'Try the question bank — 20 questions, no account | SQB',
            description: 'Try real SMLE and SNLE questions with a full written explanation on every answer. No sign-up, no email, no card — twenty questions from the same bank subscribers use.',
        },
        kicker: 'Free trial, no account',
        title: 'Try twenty questions right now',
        intro: 'Real questions from the bank, each with a full written explanation. No email and no card — pick your track and start.',
        trackQuestion: 'Which track do you want to try?',
        tracks: {
            medical: { label: 'Medicine', exam: 'Saudi Medical Licensing Exam (SMLE)' },
            nursing: { label: 'Nursing', exam: 'Saudi Nursing Licensure Exam (SNLE)' },
        },
        start: 'Start the demo',
        progress: (n, total) => `Question ${n} of ${total}`,
        correct: 'Correct',
        incorrect: 'Not quite',
        correctAnswerIs: 'The correct answer',
        explanationTitle: 'Explanation',
        next: 'Next question',
        finish: 'See my result',
        loading: 'Getting your questions ready…',
        error: 'Could not load the questions. Refresh to try again.',
        result: {
            kicker: 'Demo finished',
            title: (score, total) => `You got ${score} of ${total} right`,
            strong: 'Strong start. The full bank is the same standard, with the same explanation on every answer.',
            mixed: 'That is exactly what practising with questions is for: finding out where you actually stand before the exam, not after it.',
            weak: 'That is the point, not a problem. Every question you missed here came with the reason why — which is what makes the next ten easier.',
            ctaTitle: 'Create a free account for 40 more',
            ctaBody: 'No card. You also get your performance analytics, a page collecting every question you got wrong, and the first lesson of every specialty.',
            cta: 'Create my free account',
            retry: 'Try twenty more',
            browse: 'Browse the published questions',
        },
    },
};

export default demoCopy;
