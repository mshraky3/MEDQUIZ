/**
 * Landing page copy.
 *
 * This is marketing prose, so the English is written as English — not as a
 * word-for-word rendering of the Arabic. Both versions make the same promises,
 * quote the same price and carry the same structure, but each reads the way a
 * native speaker would write it.
 *
 * Never translated: SQB, SMLE, SNLE, Prometric, Moyasar/mada/Visa/Mastercard,
 * "Midgard & GameBoy 2026" (the bank's name) and the specialty names that come
 * from tracks.js.
 */
const landingCopy = {
    ar: {
        topbar: { account: 'حسابي', login: 'تسجيل الدخول', signup: 'ابدأ مجاناً' },

        heroReturning: {
            pill: 'مرحباً بعودتك',
            title: 'أهلاً بك من جديد',
            // The username is rendered separately inside a <bdi>, so this is
            // only the run of text that precedes it.
            titlePrefix: 'أهلاً بك من جديد، ',
            body: 'حسابك محفوظ على هذا الجهاز — تابع تدريبك من حيث توقفت، أو راجع تحليلاتك وواصل التحضير لاختبارك.',
            primary: 'متابعة إلى حسابي',
            secondary: 'تسجيل الخروج',
        },
        hero: {
            pill: 'مساران: طب بشري وتمريض · ابدأ بـ 40 سؤالاً مجاناً',
            title: 'تدرّب بذكاء، واجتَز اختبار الترخيص بثقة',
            body: 'بنك أسئلة محدّث على نمط البرومترك، مع تفسير واضح لكل إجابة وتحليل فوري يكشف نقاط ضعفك ويرتّب أولويات مراجعتك — كل ما تحتاجه للوصول إلى درجتك المستهدفة في مكان واحد.',
            primary: 'ابدأ بـ 40 سؤالاً مجاناً',
            // سطر صغير تحت الأزرار لمن لم يقرّر بعد: 78 من 120 اختاروا مساراً
            // هذا الشهر ثم تركوا نموذج التسجيل — أرادوا رؤية الأسئلة أولاً.
            // شريط أرقام حيّة من قاعدة البيانات (/api/public/stats). الاعتراض
            // على ملفات PDF المجانية المتداولة أنها قديمة وغير موثّقة — والردّ
            // الوحيد المقنع هو رقم يُحسب الآن ولا يمكن أن يتقادم.
            liveQuestions: (n) => `${n} سؤالاً في البنك`,
            liveDecks: (n) => `${n} ملزمة ملخّصات`,
            liveUpdated: (date) => `آخر إضافة ${date}`,
            secondary: 'تسجيل الدخول',
            trust: [
                'تفسير كامل لكل سؤال',
                '40 سؤالاً مجاناً بلا حد زمني',
                'أول درس من كل تخصص مجاني للأبد',
                'من 50 ريالاً شهرياً',
                'بدون تجديد تلقائي',
            ],
            // Rendered only when config/examDates.js has a real, verified future
            // date — otherwise ExamCountdown renders nothing.
            examCountdown: (days) => `الاختبار القادم بعد ${days} ${days === 1 ? 'يوم' : 'يوماً'}`,
            scrollCue: 'تصفّح',
        },

        // The explanations section. This is the platform's strongest single
        // claim, so the wording stays concrete: what a student actually reads
        // after answering, and what the two quiz modes do. No question counts —
        // the number is deliberately kept out of all landing copy.
        explain: {
            sectionLabel: 'تفسير كل إجابة',
            pill: 'أقوى ما في المنصة',
            title: 'لا تحفظ الإجابة — افهم لماذا هي الصحيحة',
            body: 'كل سؤال في البنك له تفسير مكتوب ومراجَع، لا سطر واحد يخبرك «الجواب ب». تقرأ الفكرة الأساسية خلف السؤال، والعرض السريري الذي يميّزه، وكيف يُشخَّص، وكيف يُعالج — فتخرج من السؤال بمعلومة تنفعك في عشرة أسئلة أخرى، لا بإجابة واحدة محفوظة.',
            points: [
                {
                    icon: 'lightbulb',
                    title: 'تفسير لكل سؤال، بلا استثناء',
                    desc: 'كل سؤال في بنكك له تفسير كامل بنفس البنية: الفكرة، العرض السريري، التشخيص، العلاج.',
                },
                {
                    icon: 'target',
                    title: 'ولماذا بقية الخيارات خاطئة',
                    desc: 'التفسير يبيّن ما الذي يميّز التشخيص الصحيح عن أقرب البدائل له — وهذا بالضبط ما يُختبر فيه سؤال الاختبار الحقيقي.',
                },
                {
                    icon: 'refresh',
                    title: 'وضع مذاكرة ووضع اختبار',
                    desc: 'يظهر التفسير فوراً في وضع المذاكرة، وينتظر حتى الانتهاء في وضع الاختبار — أنت من يختار.',
                },
            ],
            sampleTitle: 'شرح الإجابة',
            cta: 'اقرأ تفسيراتك الأولى مجاناً',
            ctaNote: '40 سؤالاً مجاناً · كل واحد منها بتفسيره',
        },

        tracks: {
            pill: 'اختر مسارك عند التسجيل',
            title: 'اختر تخصصك وابدأ',
            body: 'محتوى مخصّص لكل تخصص: لن يظهر لك إلا ما يخصّ اختبارك أنت.',
            ready: 'متاح الآن',
            soon: 'المحتوى قيد الإعداد',
            soonNote: 'يمكنك إنشاء حسابك على هذا المسار الآن، وسنبلغك بالبريد فور رفع المحتوى.',
            medicalDesc: 'بنك أسئلة وملخصات كاملة للباطنة والجراحة والأطفال والنساء والولادة.',
            nursingDesc: 'مسار مستقل بأسئلته وملخصاته وتحليلات أدائه الخاصة — منفصل تماماً عن مسار الطب.',
            cardCta: (title) => `ابدأ مسار ${title}`,
            ctaNote: '40 سؤالاً مجاناً · بدون بطاقة دفع',
        },

        compare: {
            sectionLabel: 'مقارنة طرق التحضير',
            pill: 'قارن بنفسك',
            title: 'لماذا SQB بدل الملفات المتناثرة والدورات المكلفة؟',
            body: 'معظم المتقدمين يجمعون تجميعات من مصادر متفرقة أو يدفعون آلاف الريالات لدورات تحضيرية. إليك المقارنة الصريحة.',
            colSqb: 'منصة SQB',
            badge: 'الخيار الذكي',
            colFiles: 'ملفات وتجميعات متناثرة',
            colCourses: 'الدورات التحضيرية',
            rows: [
                { label: 'التكلفة', sqb: 'من 50 ريالاً شهرياً — و300 للسنة كاملة', files: 'مجانية لكن مبعثرة وغير موثوقة', courses: 'آلاف الريالات' },
                { label: 'تحديث المحتوى', sqb: 'تجميعات شهرية مدقّقة', files: 'غير منتظم وبدون تدقيق', courses: 'ينتهي بانتهاء الدورة' },
                { label: 'شرح الإجابات', sqb: 'تفسير كامل لكل سؤال: الفكرة والتشخيص والعلاج', files: 'إجابات بلا شرح غالباً', courses: 'يعتمد على المحاضر' },
                { label: 'تحليل الأداء والأخطاء', sqb: 'تحليلات تلقائية بعد كل جلسة', files: 'يدوي — إن وُجد', courses: 'غير متوفر غالباً' },
                { label: 'مدة الوصول', sqb: 'شهر أو 4 أشهر أو سنة — تختار أنت', files: 'روابط تنتهي وملفات تضيع', courses: 'فترة محدودة' },
            ],
            cta: 'جرّب SQB بـ 40 سؤالاً مجاناً',
            ctaNote: 'قارن بنفسك قبل أن تدفع ريالاً واحداً',
        },

        value: {
            sectionLabel: 'الاشتراك والأسعار',
            pill: 'لماذا الاشتراك؟',
            // Sharpened to lead with the stake rather than the price. Every
            // consequence named here is real and verifiable — a resit fee, a
            // limited sitting calendar, a delayed licence. Nothing invents a
            // deadline, a vanishing discount or a seat cap.
            title: 'السؤال ليس «كم يكلفني الاشتراك؟» — بل «كم يكلفني الرسوب؟»',
            body: 'اشتراك سنة كاملة هنا أقل من ستة ريالات في الأسبوع — والرسوب يكلفك أكثر من ذلك بكثير.',
            points: [
                { icon: 'trending-down', title: 'ثمن المحاولة الثانية أعلى من الاشتراك بكثير' },
                { icon: 'target', title: 'لا تدخل الاختبار وأنت تجهل نقاط ضعفك' },
                { icon: 'refresh', title: 'أسئلة محدّثة، لا ملفات عمرها ثلاث سنوات' },
                { icon: 'check-circle', title: 'جرّب قبل أن تدفع' },
            ],
            priceCardLabel: 'تفاصيل الاشتراك',
            plan: 'شهر · 4 أشهر · سنة — دفعة واحدة في كل الحالات',
            amount: '50',
            currency: 'ريال / شهر',
            perMonth: 'أربعة أشهر بـ 129 ريالاً بدلاً من 200 · 300 ريال للسنة · واشتراكات جماعية للأصدقاء',
            included: [
                'بنك أسئلة شامل لاختبارك — SMLE أو SNLE — يُحدَّث باستمرار',
                'تفسير واضح لكل إجابة',
                'ملخصات مركّزة على النقاط عالية التكرار',
                'اختبارات محاكية بتوقيت حقيقي',
                'تحليلات تكشف نقاط ضعفك وتتيح لك مراجعة أخطائك حتى تتقنها',
            ],
            cta: 'ابدأ بـ 40 سؤالاً مجاناً',
            note: '40 سؤالاً مجاناً أولاً · دفع آمن عبر ميسر · مدى / Visa / Mastercard / Apple Pay · بدون تجديد تلقائي',
            // The public shop window for the group plans. Prices here must stay
            // in step with PLANS.group_3 / group_5 in backend/services/paymentService.js.
            group: {
                badge: 'وفّر حتى ٥٣٪ للحساب',
                title: 'تذاكرون مجموعة؟ الاشتراك الجماعي أرخص بكثير',
                body: 'دفعة واحدة تفعّل حسابك فوراً وتعطيك روابط دعوة لبقية المقاعد، توزّعها على أصدقائك. كل المقاعد تنتهي في نفس التاريخ، وكل رابط يفتح حساباً واحداً فقط.',
                tiers: [
                    { label: '3 حسابات · 4 أشهر', price: '250 ريال', each: '83 ريالاً للحساب' },
                    { label: '5 حسابات · 4 أشهر', price: '299 ريال', each: '60 ريالاً للحساب' },
                ],
                cta: 'اعرض الاشتراكات الجماعية',
            },
        },


        flow: {
            pill: 'تدفق واضح',
            title: 'ابدأ وتدرّب وراجع خلال دقائق',
            body: 'مسار بسيط يقودك من إنشاء الحساب إلى جلسات المراجعة الذكية دون تشتيت.',
            steps: [
                { label: 'أنشئ حسابك وأكّد بريدك', hint: 'تحصل فوراً على 40 سؤالاً مجانياً، وأول درس من كل تخصص.' },
                { label: 'تمرن بدقة', hint: 'اختر المواضيع، اضبط الوقت، وركّز على المهارات المطلوبة.' },
                { label: 'راجع وتحسّن', hint: 'تحليلات فورية، سلاسل إنجاز، وتوصيات مخصصة.' },
            ],
            cta: 'ابدأ بالخطوة الأولى',
            ctaNote: 'التسجيل يستغرق أقل من دقيقة',
        },

        ctaBand: {
            returning: {
                pill: 'جاهز لمتابعة التدريب؟',
                title: 'أكمل من حيث توقفت',
                body: 'حسابك متزامن وجاهز — عد إلى لوحتك وواصل التدريب أو راجع تحليلاتك.',
                primary: 'الذهاب إلى حسابي',
                secondary: 'تسجيل الخروج',
            },
            visitor: {
                pill: 'جاهز للبدء؟',
                title: 'كل يوم تأجيل هو يوم تدريب يكسبه غيرك عليك',
                body: 'أنشئ حسابك، أكّد بريدك، وابدأ فوراً بـ 40 سؤالاً مجانياً — من بنك يضم 5,033 سؤالاً، لكل واحد منها شرح مكتوب، ويُحدَّث بتجميعات شهرية.',
                primary: 'إنشاء حساب',
                secondary: 'تسجيل الدخول',
                note: '40 سؤالاً مجاناً · ثم من 50 ريالاً شهرياً · دفع آمن عبر ميسر · بدون تجديد تلقائي',
            },
        },

        mobileCta: {
            continue: 'متابعة',
            logout: 'خروج',
            tryFree: 'ابدأ بـ 40 سؤالاً مجاناً',
            login: 'دخول',
        },
    },

    en: {
        topbar: { account: 'My account', login: 'Log in', signup: 'Start free' },

        heroReturning: {
            pill: 'Welcome back',
            title: 'Good to see you again',
            titlePrefix: 'Good to see you again, ',
            body: 'Your account is saved on this device — pick up your practice where you left off, or review your analytics and keep preparing for your exam.',
            primary: 'Go to my account',
            secondary: 'Log out',
        },
        hero: {
            pill: 'Two tracks: medicine and nursing · Start with 40 free questions',
            title: 'Practise smarter, and walk into your licensing exam confident',
            body: 'A question bank updated to the Prometric style, a clear explanation for every answer, and instant analytics that expose your weak spots and tell you what to revise next — everything you need to hit your target score, in one place.',
            primary: 'Start with 40 free questions',
            // A quiet line under the buttons for anyone not ready: 78 of the
            // 120 who picked a track this month left at the signup form.
            // A strip of live numbers counted from the database
            // (/api/public/stats). The objection to the free PDF collections
            // people use instead is that they are old and unverified, and the
            // only convincing answer is a figure that is counted now and
            // cannot go stale.
            liveQuestions: (n) => `${n} questions in the bank`,
            liveDecks: (n) => `${n} summary decks`,
            liveUpdated: (date) => `newest added ${date}`,
            secondary: 'Log in',
            trust: [
                'A full explanation for every question',
                '40 free questions, with no time limit',
                'The first lesson of every specialty, free for good',
                'From SAR 50 a month',
                'No auto-renewal',
            ],
            // Rendered only when config/examDates.js has a real, verified future
            // date — otherwise ExamCountdown renders nothing.
            examCountdown: (days) => `Next exam window in ${days} day${days === 1 ? '' : 's'}`,
            scrollCue: 'Scroll',
        },

        // The explanations section. This is the platform's strongest single
        // claim, so the wording stays concrete: what a student actually reads
        // after answering, and what the two quiz modes do. No question counts —
        // the number is deliberately kept out of all landing copy.
        explain: {
            sectionLabel: 'An explanation for every answer',
            pill: 'The strongest thing we do',
            title: 'Do not memorise the answer — understand why it is the answer',
            body: 'Every question in the bank carries a written, reviewed explanation — not a one-liner telling you the answer was B. You get the core concept behind the question, the presentation that distinguishes it, how it is diagnosed and how it is managed. You leave each question with something that works on ten more, instead of one answer you have memorised.',
            points: [
                {
                    icon: 'lightbulb',
                    title: 'Every question, not just the hard ones',
                    desc: 'Every question in your bank has a full explanation, written to the same structure: concept, presentation, diagnosis, management.',
                },
                {
                    icon: 'target',
                    title: 'And why the other options are wrong',
                    desc: 'The explanation names what separates the right diagnosis from its nearest look-alike — which is precisely what the real exam question is testing.',
                },
                {
                    icon: 'refresh',
                    title: 'Study mode and exam mode',
                    desc: 'Study mode reveals it the moment you answer; exam mode waits until you finish — you choose.',
                },
            ],
            sampleTitle: 'Why this answer',
            cta: 'Read your first explanations free',
            ctaNote: '40 free questions · every one of them explained',
        },

        tracks: {
            pill: 'Choose your track when you sign up',
            title: 'Pick your field and get started',
            body: 'Content is tailored per field: you only ever see what belongs to your own exam.',
            ready: 'Available now',
            soon: 'Content in preparation',
            soonNote: 'You can create your account on this track now — we will email you the moment the content goes live.',
            medicalDesc: 'A full question bank and summaries for internal medicine, surgery, paediatrics, and obstetrics & gynaecology.',
            nursingDesc: 'A standalone track with its own questions, summaries and performance analytics — completely separate from the medical track.',
            cardCta: (title) => `Start the ${title} track`,
            ctaNote: '40 free questions · No payment card',
        },

        compare: {
            sectionLabel: 'Comparing ways to prepare',
            pill: 'See for yourself',
            title: 'Why SQB instead of scattered files and expensive courses?',
            body: 'Most candidates stitch together question collections from random sources, or pay thousands for a prep course. Here is the honest comparison.',
            colSqb: 'SQB',
            badge: 'The smart choice',
            colFiles: 'Scattered files and collections',
            colCourses: 'Prep courses',
            rows: [
                { label: 'Cost', sqb: 'From SAR 50 a month — SAR 300 for a whole year', files: 'Free, but scattered and unreliable', courses: 'Thousands of riyals' },
                { label: 'Content updates', sqb: 'Verified monthly collections', files: 'Irregular, and unverified', courses: 'Ends when the course ends' },
                { label: 'Answer explanations', sqb: 'A full explanation for every question: concept, diagnosis, management', files: 'Usually answers with no reasoning', courses: 'Depends on the lecturer' },
                { label: 'Performance and error analysis', sqb: 'Automatic analytics after every session', files: 'Manual — if at all', courses: 'Usually not offered' },
                { label: 'How long you keep access', sqb: 'A month, four months or a year — your choice', files: 'Links expire and files get lost', courses: 'A limited window' },
            ],
            cta: 'Try SQB with 40 free questions',
            ctaNote: 'See it for yourself before you pay a riyal',
        },

        value: {
            sectionLabel: 'Subscription and pricing',
            pill: 'Why subscribe?',
            // Sharpened to lead with the stake rather than the price. Every
            // consequence named here is real and verifiable — a resit fee, a
            // limited sitting calendar, a delayed licence. Nothing invents a
            // deadline, a vanishing discount or a seat cap.
            title: 'The question is not “what does a subscription cost?” — it is “what does failing cost me?”',
            body: 'A full year here costs less than two riyals a week — failing costs a lot more than that.',
            points: [
                { icon: 'trending-down', title: 'A second attempt costs far more than a subscription' },
                { icon: 'target', title: "Don't walk in blind to your own weak spots" },
                { icon: 'refresh', title: 'Current questions, not files three years old' },
                { icon: 'check-circle', title: 'Try it before you pay' },
            ],
            priceCardLabel: 'Subscription details',
            plan: 'A month, four months or a year — one payment either way',
            amount: '50',
            currency: 'SAR / month',
            perMonth: 'Four months for SAR 129, down from 200 · SAR 300 for a year · group plans for study partners',
            included: [
                'A full question bank for your exam — SMLE or SNLE — updated continually',
                'A clear explanation for every answer',
                'Focused, high-yield summaries',
                'Timed mock exams under real exam conditions',
                "Analytics that find your weak spots and let you drill your wrong questions until they're gone",
            ],
            cta: 'Start with 40 free questions',
            note: '40 free questions first · Secure payment via Moyasar · mada / Visa / Mastercard / Apple Pay · No auto-renewal',
            // The public shop window for the group plans. Prices here must stay
            // in step with PLANS.group_3 / group_5 in backend/services/paymentService.js.
            group: {
                badge: 'Save up to 53% per seat',
                title: 'Studying as a group? A group plan costs far less each',
                body: 'One payment activates your own account straight away and gives you invite links for the other seats to hand out. Every seat ends on the same date, and each link opens exactly one account.',
                tiers: [
                    { label: '3 accounts · 4 months', price: 'SAR 250', each: 'SAR 83 per account' },
                    { label: '5 accounts · 4 months', price: 'SAR 299', each: 'SAR 60 per account' },
                ],
                cta: 'See the group plans',
            },
        },


        flow: {
            pill: 'A clear path',
            title: 'Start, practise and review within minutes',
            body: 'A simple route that takes you from creating an account to smart review sessions, with nothing in the way.',
            steps: [
                { label: 'Create your account and confirm your email', hint: 'You immediately get 40 free questions, plus the first lesson of every specialty.' },
                { label: 'Practise precisely', hint: 'Pick your topics, set the timer, and drill the skills you need.' },
                { label: 'Review and improve', hint: 'Instant analytics, streaks, and recommendations made for you.' },
            ],
            cta: 'Start with step one',
            ctaNote: 'Signing up takes under a minute',
        },

        ctaBand: {
            returning: {
                pill: 'Ready to keep going?',
                title: 'Pick up where you left off',
                body: 'Your account is synced and ready — head back to your dashboard and keep practising, or review your analytics.',
                primary: 'Go to my account',
                secondary: 'Log out',
            },
            visitor: {
                pill: 'Ready to start?',
                title: 'Every day you put it off is a day of practice someone else gains on you',
                body: 'Create your account, confirm your email, and start with 40 free questions — from a bank of 5,033, every one of them explained, updated with monthly collections.',
                primary: 'Create an account',
                secondary: 'Log in',
                note: '40 free questions · then from SAR 50 a month · Secure payment via Moyasar · No auto-renewal',
            },
        },

        mobileCta: {
            continue: 'Continue',
            logout: 'Log out',
            tryFree: 'Start with 40 free questions',
            login: 'Log in',
        },
    },
};

export default landingCopy;
