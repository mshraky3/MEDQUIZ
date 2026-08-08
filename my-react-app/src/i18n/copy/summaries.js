/**
 * Copy for the guided study path (summaries).
 *
 * Only the CHROME is here — headings, progress labels, buttons, search. Every
 * piece of study MATERIAL (milestone names, step titles, "why", "covers", the
 * summaries themselves and the practice questions) comes from the content files
 * in English and is rendered verbatim, inside elements marked dir="ltr", in
 * both languages. That is deliberate: it is the language of the exam.
 */
const summariesCopy = {
    ar: {
        loading: 'جاري تحميل المحتوى الدراسي',
        errorTitle: 'تعذّر تحميل المحتوى الدراسي',
        errorBody: 'تحقّق من اتصالك بالإنترنت ثم أعد المحاولة.',
        retry: 'إعادة المحاولة',

        comingSoonTitle: (track) => `المحتوى الدراسي لمسار ${track} قيد الإعداد`,
        comingSoonBody: (exam) => `نعمل حالياً على تجهيز المحتوى الدراسي المصوّر الخاص بـ${exam}، مرتّباً كمسار دراسي متسلسل تماماً كبقية المسارات.`,
        comingSoonNote: 'سنرسل لك بريداً فور جاهزيته. في هذه الأثناء يمكنك متابعة التدرب على الأسئلة من صفحة الاختبارات.',

        eyebrow: 'مسار مذاكرة مرتّب',
        title: 'المحتوى الدراسي، مرتّب بترتيب دراسته',
        factMilestones: 'مراحل',
        factSteps: 'خطوة',
        factQuestions: 'سؤال تدريبي',

        pathComplete: 'اكتمل المسار',
        // Copy modules stay plain data — the number is emboldened by the caller.
        stepXofYBefore: 'الخطوة',
        stepXofYAfter: (total) => `من ${total}`,
        pctComplete: 'مكتمل',
        stepsDone: 'خطوة منجزة',
        progressAria: 'تقدّمك في مسار المذاكرة',

        finishedTitle: (total) => `أنجزت كل الخطوات (${total})`,
        finishedWhy: 'ارجع لأي خطوة بالأسفل — كل شيء يبقى مفتوحاً للمراجعة.',

        resumeKicker: 'أكمل من حيث توقفت',
        startKicker: 'ابدأ من هنا',
        nextKicker: 'التالي',
        resumeStepPrefix: 'الخطوة',
        questionsSuffix: 'سؤال',
        resumeCta: 'متابعة',
        startCta: 'ابدأ الخطوة الأولى',
        revealOnPath: 'أظهرها على المسار',

        searchPlaceholder: 'ابحث عن موضوع — مثل asthma أو DKA أو breast cancer…',
        searchAria: 'ابحث في الخطوات',
        clearSearch: 'مسح البحث',
        resultsCount: (n) => `${n} خطوة مطابقة لـ`,
        backToPath: 'العودة إلى المسار',
        noResultsBefore: 'لا توجد خطوات مطابقة لـ',

        milestoneKicker: (order, total) => `المرحلة ${order} من ${total}`,
        youAreHere: 'أنت هنا',
        milestoneSteps: 'خطوة',
        milestoneQuestions: 'سؤال',
        milestoneDone: 'منجزة',

        stepNo: (n) => `الخطوة ${n}`,
        stateDone: 'مكتملة',
        stateCurrent: 'أنت هنا',
        stateUpcoming: 'قادمة',
        // الدرس الأول من كل تخصص مجاني دائماً؛ البقية ضمن الاشتراك.
        lockedTag: 'ضمن الاشتراك',
        lockedCta: 'افتحه بالاشتراك',
        freeTag: 'مجاني دائماً',
        freeBannerTitle: 'أول درس من كل تخصص مجاني لك',
        freeBannerBody: 'اقرأه في أي وقت وبلا حد. بقية الدروس وأسئلتها تُفتح بالاشتراك.',
        stateResume: 'توقفت هنا',
        willLearn: 'ستتعلم',
        practiceQuestions: 'سؤال تدريبي',
        ctaReview: 'مراجعة',
        ctaContinue: 'متابعة',
        ctaOpen: 'افتح',
        markDone: 'ضع علامة إنجاز',
        marked: 'منجزة',
        markedTitle: 'مُعلَّمة كمنجزة — اضغط للتراجع',
        markTitle: 'ضع علامة إنجاز على هذه الخطوة',

        endTitleDone: 'أنهيت المسار',
        endTitle: 'خط النهاية',
        endBodyDone: (steps, milestones) => `أنجزت كل الخطوات (${steps}) وكل محطات التقييم (${milestones}). ارجع لأي خطوة للمراجعة — لا شيء يُغلق.`,
        endBody: (remaining) => `تبقّت ${remaining} خطوة. واصل خطوة بخطوة — كل خطوة تتعلّمها تحرّك الخط للأمام.`,

        panelStep: (n, total) => `الخطوة ${n} من ${total}`,
        close: 'إغلاق',
        tabSummary: 'الملخص',
        tabQuestions: 'اختبر نفسك',
        panelStepDone: 'الخطوة منجزة',
        panelMarkDone: 'ضع علامة إنجاز',

        tools: {
            open: 'أدوات المذاكرة',
            openAria: 'افتح أدوات المذاكرة',
            openTitle: 'أدوات المذاكرة — قلم، تظليل، ملء الشاشة',
            toolbar: 'أدوات المذاكرة',
            move: 'تصفّح',
            pen: 'قلم',
            highlighter: 'تظليل',
            eraser: 'ممحاة',
            color: (c) => `اللون ${c}`,
            undo: 'تراجع',
            clear: 'مسح الكل',
            fullscreen: 'ملء الشاشة',
            exitFullscreen: 'إنهاء ملء الشاشة',
            hide: 'إخفاء الأدوات',
        },

        question: {
            correct: 'إجابة صحيحة',
            incorrect: 'إجابة خاطئة',
        },

        checkpoint: {
            passed: 'اجتزت المحطة',
            label: 'محطة تقييم',
            titlePassed: (name) => `${name} — منجزة`,
            titleOpen: (name) => `جاهز لمغادرة ${name}؟`,
            recapBefore: 'وضعت علامة إنجاز على',
            recapOf: 'من',
            recapAfter: 'خطوة في هذه المرحلة.',
            allRead: ' تأكد أنك ما زلت تستطيع الإجابة عن هذه الأسئلة من الذاكرة قبل المتابعة.',
            notAllRead: ' لا شيء مقفل — يمكنك المتابعة الآن والعودة للباقي متى شئت.',
            fromStep: 'من الخطوة:',
            notAttempted: 'لم تُجرَّب بعد',
            score: (correct, answered) => `${correct} من ${answered} صحيحة`,
            redo: 'أعد هذا التقييم',
            readyNext: (name) => `أنا جاهز — تابع إلى ${name}`,
            readyFinish: 'أنا جاهز — أنهِ المسار',
        },
    },

    en: {
        loading: 'Loading the study material',
        errorTitle: 'Could not load the study material',
        errorBody: 'Check your internet connection and try again.',
        retry: 'Try again',

        comingSoonTitle: (track) => `${track} study material is being prepared`,
        comingSoonBody: (exam) => `We are currently building the illustrated study material for the ${exam}, laid out as a sequential study path exactly like the other tracks.`,
        comingSoonNote: 'We will email you as soon as it is ready. In the meantime you can keep practising questions from the quizzes page.',

        eyebrow: 'An ordered study path',
        title: 'The study material, in the order you should study it',
        factMilestones: 'milestones',
        factSteps: 'steps',
        factQuestions: 'practice questions',

        pathComplete: 'Path complete',
        stepXofYBefore: 'Step',
        stepXofYAfter: (total) => `of ${total}`,
        pctComplete: 'complete',
        stepsDone: 'steps done',
        progressAria: 'Your progress along the study path',

        finishedTitle: (total) => `You have finished all ${total} steps`,
        finishedWhy: 'Go back to any step below — everything stays open for revision.',

        resumeKicker: 'Pick up where you left off',
        startKicker: 'Start here',
        nextKicker: 'Next',
        resumeStepPrefix: 'Step',
        questionsSuffix: 'questions',
        resumeCta: 'Continue',
        startCta: 'Start the first step',
        revealOnPath: 'Show it on the path',

        searchPlaceholder: 'Search for a topic — e.g. asthma, DKA or breast cancer…',
        searchAria: 'Search the steps',
        clearSearch: 'Clear search',
        resultsCount: (n) => `${n} steps match`,
        backToPath: 'Back to the path',
        noResultsBefore: 'No steps match',

        milestoneKicker: (order, total) => `Milestone ${order} of ${total}`,
        youAreHere: 'You are here',
        milestoneSteps: 'steps',
        milestoneQuestions: 'questions',
        milestoneDone: 'done',

        stepNo: (n) => `Step ${n}`,
        stateDone: 'Completed',
        stateCurrent: 'You are here',
        stateUpcoming: 'Upcoming',
        // The first lesson of every specialty is free for good; the rest is
        // part of the subscription.
        lockedTag: 'In the subscription',
        lockedCta: 'Unlock with a subscription',
        freeTag: 'Always free',
        freeBannerTitle: 'The first lesson of every specialty is yours free',
        freeBannerBody: 'Read it any time, as often as you like. The remaining lessons and their questions open with a subscription.',
        stateResume: 'Left off here',
        willLearn: 'You’ll learn',
        practiceQuestions: 'practice questions',
        ctaReview: 'Review',
        ctaContinue: 'Continue',
        ctaOpen: 'Open',
        markDone: 'Mark done',
        marked: 'Done',
        markedTitle: 'Marked as done — click to undo',
        markTitle: 'Mark this step as done',

        endTitleDone: 'You finished the path',
        endTitle: 'The finish line',
        endBodyDone: (steps, milestones) => `You have completed all ${steps} steps and all ${milestones} checkpoints. Go back to any step to revise — nothing closes.`,
        endBody: (remaining) => `${remaining} steps to go. Keep going step by step — every one you learn moves the line forward.`,

        panelStep: (n, total) => `Step ${n} of ${total}`,
        close: 'Close',
        tabSummary: 'Summary',
        tabQuestions: 'Test yourself',
        panelStepDone: 'Step done',
        panelMarkDone: 'Mark step done',

        tools: {
            open: 'Study tools',
            openAria: 'Open study tools',
            openTitle: 'Study tools — pen, highlighter, full screen',
            toolbar: 'Study tools',
            move: 'Browse',
            pen: 'Pen',
            highlighter: 'Highlighter',
            eraser: 'Eraser',
            color: (c) => `Colour ${c}`,
            undo: 'Undo',
            clear: 'Clear all',
            fullscreen: 'Full screen',
            exitFullscreen: 'Exit full screen',
            hide: 'Hide tools',
        },

        question: {
            correct: 'Correct',
            incorrect: 'Incorrect',
        },

        checkpoint: {
            passed: 'Checkpoint passed',
            label: 'Checkpoint',
            titlePassed: (name) => `${name} — done`,
            titleOpen: (name) => `Ready to leave ${name}?`,
            recapBefore: 'You’ve marked',
            recapOf: 'of',
            recapAfter: 'steps in this milestone as done.',
            allRead: ' Check you can still answer these from memory before moving on.',
            notAllRead: ' Nothing is locked — you can continue now and come back to the rest whenever you like.',
            fromStep: 'From step:',
            notAttempted: 'Not attempted yet',
            score: (correct, answered) => `${correct} of ${answered} correct`,
            redo: 'Redo this check',
            readyNext: (name) => `I’m ready — continue to ${name}`,
            readyFinish: 'I’m ready — finish the path',
        },
    },
};

export default summariesCopy;
