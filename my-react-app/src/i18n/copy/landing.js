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
        topbar: { account: 'حسابي', login: 'تسجيل الدخول' },

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
            pill: 'مساران: طب بشري وتمريض · جرّب كل شيء مجاناً لمدة ساعة',
            title: 'تدرّب بذكاء، واجتَز اختبار الترخيص بثقة',
            body: 'بنك أسئلة محدّث على نمط البرومترك، مع تفسير واضح لكل إجابة وتحليل فوري يكشف نقاط ضعفك ويرتّب أولويات مراجعتك — كل ما تحتاجه للوصول إلى درجتك المستهدفة في مكان واحد.',
            primary: 'سجّل وجرّب مجاناً لمدة ساعة',
            secondary: 'تسجيل الدخول',
            trust: [
                'ساعة وصول كامل مجاناً بعد تأكيد بريدك',
                '99 ريال للسنة كاملة بعد التجربة',
                'تغطية كاملة لمواضيع الاختبار',
                'تفسير واضح لكل سؤال',
                'بدون تجديد تلقائي',
            ],
        },

        statsLabel: 'إحصائيات المنصة',
        stats: [
            { label: 'محدّث لنمط الاختبار', value: '2026' },
            { label: 'تغطية لمواضيع الاختبار', value: '100%' },
            { label: 'من الطلاب بدرجات عالية', value: 'مئات' },
            { label: 'السنة كاملة', value: '99 ريال' },
        ],

        tracks: {
            pill: 'اختر مسارك عند التسجيل',
            title: 'اختر تخصصك وابدأ',
            body: 'محتوى مخصّص لكل تخصص: لن يظهر لك إلا ما يخصّ اختبارك أنت.',
            ready: 'متاح الآن',
            soon: 'المحتوى قيد الإعداد',
            soonNote: 'يمكنك إنشاء حسابك على هذا المسار الآن، وسنبلغك بالبريد فور رفع المحتوى.',
            medicalDesc: 'بنك أسئلة وملخصات كاملة للباطنة والجراحة والأطفال والنساء والولادة.',
            nursingDesc: 'مسار مستقل بأسئلته وملخصاته وتحليلات أدائه الخاصة — منفصل تماماً عن مسار الطب.',
        },

        features: {
            pill: 'كل الأدوات في مكان واحد',
            title: 'كل ما تحتاجه لاجتياز الاختبار من أول محاولة',
            body: 'أسئلة محدّثة، وتفسير واضح لكل إجابة، وتحليلات ذكية — مصممة لتوصلك لدرجتك المستهدفة بأقل وقت وجهد.',
            items: [
                { icon: 'book-open', title: 'تغطية كاملة لاختبارك', desc: 'بنك أسئلة منسق وفق أحدث مخطط برومترك — SMLE للطب البشري وSNLE للتمريض.' },
                { icon: 'trending-up', title: 'تحليلات موجهة', desc: 'تتبع نقاط الضعف والسرعة والدقة عبر لوحات واضحة.' },
                { icon: 'target', title: 'تدريب متكيف', desc: 'تمارين موجهة، محاكاة زمنية، ومراجعة ذكية.' },
                { icon: 'brain', title: 'تفكير سريري', desc: 'سيناريوهات سريرية تركز على اتخاذ القرار لا الحفظ.' },
            ],
        },

        compare: {
            sectionLabel: 'مقارنة طرق التحضير',
            pill: 'قارن بنفسك',
            title: 'لماذا SQB بدل الملفات المتناثرة والدورات المكلفة؟',
            body: 'معظم المتقدمين يجمعون تجميعات من مصادر متفرقة أو يدفعون آلاف الريالات لدورات تحضيرية. إليك المقارنة الصريحة.',
            tableLabel: 'جدول المقارنة',
            hint: 'اسحب الجدول جانبياً لعرض المقارنة كاملة',
            colAspect: 'وجه المقارنة',
            colSqb: 'منصة SQB',
            badge: 'الخيار الذكي',
            colFiles: 'ملفات وتجميعات متناثرة',
            colCourses: 'الدورات التحضيرية',
            rows: [
                { label: 'التكلفة', sqb: '99 ريالاً للسنة كاملة', files: 'مجانية لكن مبعثرة وغير موثوقة', courses: 'آلاف الريالات' },
                { label: 'تحديث المحتوى', sqb: 'تجميعات شهرية مدقّقة', files: 'غير منتظم وبدون تدقيق', courses: 'ينتهي بانتهاء الدورة' },
                { label: 'شرح الإجابات', sqb: 'تفسير لكل سؤال', files: 'إجابات بلا شرح غالباً', courses: 'يعتمد على المحاضر' },
                { label: 'تحليل الأداء والأخطاء', sqb: 'تحليلات تلقائية بعد كل جلسة', files: 'يدوي — إن وُجد', courses: 'غير متوفر غالباً' },
                { label: 'مدة الوصول', sqb: 'سنة كاملة، من أي جهاز', files: 'روابط تنتهي وملفات تضيع', courses: 'فترة محدودة' },
            ],
        },

        value: {
            sectionLabel: 'الاشتراك والأسعار',
            pill: 'لماذا الاشتراك؟',
            title: 'كل تحضيرك لاختبار الترخيص مقابل 99 ريالاً في السنة',
            body: 'نجاحك في الاختبار يفتح لك باب التدريب والوظيفة — والرسوب يكلفك رسوم إعادة، وشهوراً من الانتظار، وضغطاً أنت في غنى عنه. صُممت SQB لتوصلك لدرجتك المستهدفة من أول محاولة.',
            points: [
                { icon: 'award', title: 'استثمار صغير، عائد كبير', desc: 'رسوم دخول الاختبار وإعادته تتجاوز مئات الريالات، ودورات التحضير تكلف آلافاً. اشتراك SQB يكلف 99 ريالاً فقط للسنة كاملة — أقل من ريالين في الأسبوع.' },
                { icon: 'check-circle', title: 'دفع آمن وبدون التزامات', desc: 'دفعة واحدة عبر بوابة ميسر السعودية المرخّصة (مدى، Visa، Mastercard). بدون تجديد تلقائي وبدون رسوم مخفية — سنة كاملة من الوصول غير المحدود.' },
                { icon: 'refresh', title: 'محتوى لا يتوقف عن التحديث', desc: 'نضيف تجميعات جديدة تواكب أحدث نمط لأسئلة الهيئة السعودية، فتتدرب دائماً على الأقرب لما ستراه في اختبارك.' },
                { icon: 'users', title: 'انضم إلى مئات الناجحين', desc: 'مئات الطلاب تدرّبوا على المنصة واجتازوا اختبار الترخيص بدرجات عالية. تدرّب على نفس الأسئلة التي صنعت نتائجهم.' },
            ],
            priceCardLabel: 'تفاصيل الاشتراك',
            plan: 'اشتراك سنوي — دفعة واحدة',
            amount: '99',
            currency: 'ريال / سنة',
            perMonth: 'أي أقل من ريالين في الأسبوع — أرخص من كوب قهوة',
            included: [
                'بنك أسئلة شامل محدّث بنمط اختبارك — SMLE أو SNLE — مع تجميعات جديدة باستمرار',
                'تفسير واضح لكل إجابة — تعرف لماذا هي الصحيحة، ولماذا البقية خطأ',
                'ملخصات مركّزة للمواضيع عالية التكرار بدل تشتت الملفات والمصادر',
                'اختبارات محاكية بتوقيت حقيقي تهيّئك لأجواء الاختبار الفعلي',
                'لوحة تحليلات تكشف نقاط ضعفك وتعيد تدريبك عليها تلقائياً',
                'مراجعة أسئلتك الخاطئة في أي وقت حتى تتقنها',
                'يعمل على الجوال والكمبيوتر، وتقدّمك محفوظ ومتزامن دائماً',
            ],
            cta: 'ابدأ بساعة مجانية',
            note: 'ساعة تجربة مجانية أولاً · دفع آمن عبر ميسر · مدى / Visa / Mastercard / Apple Pay · بدون تجديد تلقائي',
        },

        faq: {
            sectionLabel: 'أسئلة قبل الاشتراك',
            pill: 'قبل أن تشترك',
            title: 'أسئلة تُطرح قبل الاشتراك',
            body: 'إجابات مباشرة على أكثر ما يسأل عنه الطلاب قبل البدء.',
            link: 'عرض كل الأسئلة الشائعة',
            items: [
                { q: 'كيف تعمل التجربة المجانية؟', a: 'أنشئ حسابك وأكّد بريدك لتحصل فوراً على ساعة وصول كامل لكل الأسئلة والتحليلات — بدون بطاقة دفع.' },
                { q: 'هل يوجد تجديد تلقائي أو رسوم خفية؟', a: 'لا. تدفع 99 ريالاً مرة واحدة وتحصل على سنة كاملة — لن يُخصم منك أي مبلغ آخر تلقائياً.' },
                { q: 'كيف أدفع؟ وهل الدفع آمن؟', a: 'الدفع عبر بوابة ميسر السعودية المرخّصة، ويدعم مدى وVisa وMastercard وApple Pay — لا نخزّن بيانات بطاقتك إطلاقاً.' },
                { q: 'هل الأسئلة محدّثة لنمط اختبار 2026؟', a: 'نعم — بنك الطب البشري محدّث بالكامل لنمط Midgard & Gameboy 2026، وبنك التمريض مبني على أحدث مراجعة معتمدة لاختبار SNLE. وتُضاف تجميعات جديدة باستمرار.' },
                { q: 'هل يشمل الاشتراك مسار التمريض أيضاً؟', a: 'نعم — نفس السعر لكلا المسارين. تختار مسارك (طب بشري أو تمريض) عند إنشاء الحساب، وكل الأسئلة والملخصات والتحليلات تكون خاصة بمسارك وحده.' },
            ],
        },

        flow: {
            pill: 'تدفق واضح',
            title: 'ابدأ وتدرّب وراجع خلال دقائق',
            body: 'مسار بسيط يقودك من إنشاء الحساب إلى جلسات المراجعة الذكية دون تشتيت.',
            steps: [
                { label: 'أنشئ حسابك وأكّد بريدك', hint: 'تحصل فوراً على ساعة وصول كامل مجاناً لتجربة كل شيء.' },
                { label: 'تمرن بدقة', hint: 'اختر المواضيع، اضبط الوقت، وركّز على المهارات المطلوبة.' },
                { label: 'راجع وتحسّن', hint: 'تحليلات فورية، سلاسل إنجاز، وتوصيات مخصصة.' },
            ],
        },

        news: {
            sectionLabel: 'آخر التحديثات',
            pill: 'جديد المنصة',
            title: 'آخر التحديثات والإضافات',
            body: 'نطوّر المنصة باستمرار — إليك آخر ما أضفناه وحدّثناه مؤخراً.',
            items: [
                { icon: 'shield-check', title: 'إطلاق مسار التمريض SNLE', desc: 'مسار التمريض صار متاحاً بالكامل: بنك أسئلة مستقل وملخصات مصوّرة تغطي أساسيات التمريض، والتمريض الباطني والجراحي، وتمريض الأمومة والمواليد، وتمريض الأطفال، والصحة النفسية، والأدوية وحسابات الجرعات — مع تحليل أداء خاص بالمسار. اختر «تمريض» عند إنشاء حسابك.', date: '31 يوليو 2026' },
                { icon: 'sparkles', title: 'صور طبية حقيقية داخل الملخصات', desc: 'الملخصات صارت مصوّرة بأشعة وصور مجهرية ورسوم تشريحية حقيقية — علامة الـSteeple في الخانوق، وعلامة الإبهام في التهاب لسان المزمار، والنزف فوق وتحت الجافية على الأشعة المقطعية، وبلورات النقرس تحت الضوء المستقطب. مع مخططات جديدة في كل تخصص وأسئلة تفاعلية أكثر بعد كل ملخص.', date: '25 يوليو 2026' },
                { icon: 'phone', title: 'اختصار SQB على شاشة جوالك', desc: 'ثبّت SQB على الشاشة الرئيسية لجوالك وافتحه بضغطة واحدة كأي تطبيق — بدون متجر تطبيقات وبدون تحميل. الخطوات كاملة للآيفون والأندرويد في القسم التالي.', date: '25 يوليو 2026' },
                { icon: 'target', title: 'تحديث الأسئلة لنمط 2026 Midgard & Gameboy', desc: 'تمت مراجعة بنك الأسئلة وتحديثه بالكامل ليواكب أحدث نمط اختبار 2026 (Midgard & Gameboy)، لتتدرب على الأقرب لما ستراه فعلياً في الاختبار.', date: '15 يوليو 2026' },
                { icon: 'calendar', title: 'إضافة التجميعات الشهرية لشهري 5 و6', desc: 'انضمت التجميعات الشهرية الجديدة لشهر مايو ويونيو إلى بنك الأسئلة، بعد مراجعة وتدقيق كامل لكل سؤال.', date: '15 يوليو 2026' },
                { icon: 'book-open', title: 'تطوير وتحديث الملخصات', desc: 'أعدنا صياغة الملخصات وحدّثنا محتواها لتكون أكثر وضوحاً وتركيزاً على النقاط عالية الأهمية.', date: '15 يوليو 2026' },
            ],
        },

        resources: {
            pill: 'روابط أساسية',
            title: 'صفحات تساعدك قبل البدء',
            body: 'قبل إنشاء الحساب أو بدء التدريب، يمكنك قراءة مزيد من التفاصيل عن المنصة، الاطلاع على الأسئلة الشائعة، أو التواصل معنا مباشرة إذا كنت تحتاج مساعدة.',
            links: [
                { to: '/about', title: 'من نحن', desc: 'تعرف على هدف SQB وما الذي تقدمه لطلاب الطب والتمريض والأطباء في السعودية.' },
                { to: '/guides', title: 'أدلة التحضير', desc: 'مقالات عملية عن خطة SMLE، مراجعة الأخطاء، وإدارة الوقت قبل الاختبار.' },
                { to: '/faq', title: 'الأسئلة الشائعة', desc: 'إجابات سريعة حول الحسابات، الاستخدام، والجوال وطبيعة بنك الأسئلة.' },
                { to: '/contact', title: 'اتصل بنا', desc: 'تواصل مع فريق SQB إذا احتجت دعماً أو كان لديك استفسار عن المنصة.' },
            ],
        },

        seo: {
            pill: 'SMLE • SNLE • برومترك • السعودية',
            title: 'محتوى موجّه لما يبحث عنه طلاب الطب والتمريض فعلاً',
            body: 'إذا كنت تبحث عن بنك أسئلة لاختبار الهيئة السعودية للتخصصات الصحية أو طريقة عملية للتحضير لاختبار البرومترك، فهذه المنصة تجمع بين الأسئلة، التدرج في التدريب، والتحليل بعد كل جلسة.',
            topics: [
                { title: 'تحضير منظم لاختبار SMLE', desc: 'ابدأ بجلسات قصيرة أو طويلة حسب وقتك، وراجع أداءك حسب التخصص والموضوع.' },
                { title: 'تحضير لاختبار التمريض SNLE', desc: 'مسار تمريض كامل ومستقل: أساسيات التمريض، الباطني والجراحي، الأمومة والمواليد، الأطفال، الصحة النفسية، والأدوية وحسابات الجرعات.' },
                { title: 'مراجعة نقاط الضعف بسرعة', desc: 'اعرف أين تخطئ، وارجع إلى الأسئلة الخاطئة، وركّز على المواضيع التي تحتاج إلى عمل فعلي.' },
                { title: 'تجميعات محدّثة لأسئلة البرومترك', desc: 'بنك أسئلة شامل مع تجميعات محدّثة تواكب أحدث نمط أسئلة اختبار الهيئة السعودية للتخصصات الصحية.' },
            ],
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
                body: 'أنشئ حسابك، أكّد بريدك، واحصل فوراً على ساعة وصول كامل مجاناً — انضم إلى مئات الطلاب الذين اجتازوا اختبارهم بعد التدريب هنا.',
                primary: 'إنشاء حساب',
                secondary: 'تسجيل الدخول',
                note: 'ساعة تجربة مجانية · ثم 99 ريال للسنة كاملة · دفع آمن عبر ميسر · بدون تجديد تلقائي',
            },
        },

        mobileCta: {
            continue: 'متابعة',
            logout: 'خروج',
            tryFree: 'جرّب مجاناً لمدة ساعة',
            login: 'دخول',
        },
    },

    en: {
        topbar: { account: 'My account', login: 'Log in' },

        heroReturning: {
            pill: 'Welcome back',
            title: 'Good to see you again',
            titlePrefix: 'Good to see you again, ',
            body: 'Your account is saved on this device — pick up your practice where you left off, or review your analytics and keep preparing for your exam.',
            primary: 'Go to my account',
            secondary: 'Log out',
        },
        hero: {
            pill: 'Two tracks: medicine and nursing · Try everything free for one hour',
            title: 'Practise smarter, and walk into your licensing exam confident',
            body: 'A question bank updated to the Prometric style, a clear explanation for every answer, and instant analytics that expose your weak spots and tell you what to revise next — everything you need to hit your target score, in one place.',
            primary: 'Sign up and try free for an hour',
            secondary: 'Log in',
            trust: [
                'One hour of full access, free, once you confirm your email',
                'SAR 99 for the whole year after the trial',
                'Full coverage of the exam syllabus',
                'A clear explanation for every question',
                'No auto-renewal',
            ],
        },

        statsLabel: 'Platform statistics',
        stats: [
            { label: 'Updated to the exam format', value: '2026' },
            { label: 'Coverage of exam topics', value: '100%' },
            { label: 'Of students scored highly', value: 'Hundreds' },
            { label: 'For the whole year', value: 'SAR 99' },
        ],

        tracks: {
            pill: 'Choose your track when you sign up',
            title: 'Pick your field and get started',
            body: 'Content is tailored per field: you only ever see what belongs to your own exam.',
            ready: 'Available now',
            soon: 'Content in preparation',
            soonNote: 'You can create your account on this track now — we will email you the moment the content goes live.',
            medicalDesc: 'A full question bank and summaries for internal medicine, surgery, paediatrics, and obstetrics & gynaecology.',
            nursingDesc: 'A standalone track with its own questions, summaries and performance analytics — completely separate from the medical track.',
        },

        features: {
            pill: 'Every tool in one place',
            title: 'Everything you need to pass on your first attempt',
            body: 'Up-to-date questions, a clear explanation for every answer, and smart analytics — built to get you to your target score with the least wasted time.',
            items: [
                { icon: 'book-open', title: 'Full coverage of your exam', desc: 'A question bank organised around the latest Prometric blueprint — SMLE for medicine, SNLE for nursing.' },
                { icon: 'trending-up', title: 'Analytics that point somewhere', desc: 'Track your weak spots, your speed and your accuracy on dashboards that actually read clearly.' },
                { icon: 'target', title: 'Adaptive practice', desc: 'Targeted drills, timed simulation, and smart review.' },
                { icon: 'brain', title: 'Clinical reasoning', desc: 'Clinical scenarios built around decision-making, not memorisation.' },
            ],
        },

        compare: {
            sectionLabel: 'Comparing ways to prepare',
            pill: 'See for yourself',
            title: 'Why SQB instead of scattered files and expensive courses?',
            body: 'Most candidates stitch together question collections from random sources, or pay thousands for a prep course. Here is the honest comparison.',
            tableLabel: 'Comparison table',
            hint: 'Swipe the table sideways to see the full comparison',
            colAspect: 'What matters',
            colSqb: 'SQB',
            badge: 'The smart choice',
            colFiles: 'Scattered files and collections',
            colCourses: 'Prep courses',
            rows: [
                { label: 'Cost', sqb: 'SAR 99 for the whole year', files: 'Free, but scattered and unreliable', courses: 'Thousands of riyals' },
                { label: 'Content updates', sqb: 'Verified monthly collections', files: 'Irregular, and unverified', courses: 'Ends when the course ends' },
                { label: 'Answer explanations', sqb: 'An explanation for every question', files: 'Usually answers with no reasoning', courses: 'Depends on the lecturer' },
                { label: 'Performance and error analysis', sqb: 'Automatic analytics after every session', files: 'Manual — if at all', courses: 'Usually not offered' },
                { label: 'How long you keep access', sqb: 'A full year, from any device', files: 'Links expire and files get lost', courses: 'A limited window' },
            ],
        },

        value: {
            sectionLabel: 'Subscription and pricing',
            pill: 'Why subscribe?',
            title: 'Your whole licensing-exam prep for SAR 99 a year',
            body: 'Passing opens the door to your training post and your job — failing costs you a resit fee, months of waiting, and pressure you do not need. SQB is built to get you to your target score first time.',
            points: [
                { icon: 'award', title: 'A small investment, a large return', desc: 'Sitting the exam — and resitting it — runs into hundreds of riyals, and prep courses cost thousands. An SQB subscription is SAR 99 for a full year: less than two riyals a week.' },
                { icon: 'check-circle', title: 'Secure payment, no strings', desc: 'A single payment through Moyasar, the licensed Saudi gateway (mada, Visa, Mastercard). No auto-renewal and no hidden fees — a full year of unlimited access.' },
                { icon: 'refresh', title: 'Content that keeps being updated', desc: 'We keep adding new collections that follow the latest SCFHS question style, so you always practise on what is closest to what you will actually sit.' },
                { icon: 'users', title: 'Join hundreds who passed', desc: 'Hundreds of students trained here and passed their licensing exam with strong scores. Practise on the same questions that produced those results.' },
            ],
            priceCardLabel: 'Subscription details',
            plan: 'Annual subscription — one payment',
            amount: '99',
            currency: 'SAR / year',
            perMonth: 'Less than two riyals a week — cheaper than a cup of coffee',
            included: [
                'A comprehensive question bank matched to your exam — SMLE or SNLE — with new collections added continually',
                'A clear explanation for every answer: why it is right, and why the others are not',
                'Focused summaries of the highest-yield topics, instead of a mess of files and sources',
                'Timed mock exams that put you in real exam conditions',
                'An analytics dashboard that finds your weak spots and drills you on them automatically',
                'Review your wrong questions any time until you own them',
                'Works on mobile and desktop, with your progress always saved and in sync',
            ],
            cta: 'Start with a free hour',
            note: 'A free hour first · Secure payment via Moyasar · mada / Visa / Mastercard / Apple Pay · No auto-renewal',
        },

        faq: {
            sectionLabel: 'Questions before you subscribe',
            pill: 'Before you subscribe',
            title: 'Questions people ask before subscribing',
            body: 'Straight answers to what students most often ask before starting.',
            link: 'See all frequently asked questions',
            items: [
                { q: 'How does the free trial work?', a: 'Create your account and confirm your email to get an immediate hour of full access to every question and every analytic — no payment card needed.' },
                { q: 'Is there auto-renewal or any hidden fee?', a: 'No. You pay SAR 99 once and get a full year — nothing else is ever charged automatically.' },
                { q: 'How do I pay, and is it secure?', a: 'Payment goes through Moyasar, the licensed Saudi gateway, and supports mada, Visa, Mastercard and Apple Pay — we never store your card details.' },
                { q: 'Are the questions updated to the 2026 exam format?', a: 'Yes — the medical bank is fully updated to the Midgard & Gameboy 2026 format, and the nursing bank is built on the latest approved SNLE review. New collections are added continually.' },
                { q: 'Does the subscription cover the nursing track too?', a: 'Yes — the same price covers both tracks. You choose your track (medicine or nursing) when you create your account, and every question, summary and analytic is specific to that track alone.' },
            ],
        },

        flow: {
            pill: 'A clear path',
            title: 'Start, practise and review within minutes',
            body: 'A simple route that takes you from creating an account to smart review sessions, with nothing in the way.',
            steps: [
                { label: 'Create your account and confirm your email', hint: 'You immediately get one free hour of full access to try everything.' },
                { label: 'Practise precisely', hint: 'Pick your topics, set the timer, and drill the skills you need.' },
                { label: 'Review and improve', hint: 'Instant analytics, streaks, and recommendations made for you.' },
            ],
        },

        news: {
            sectionLabel: 'Latest updates',
            pill: "What's new",
            title: 'Latest updates and additions',
            body: 'We keep developing the platform — here is what we have added and improved recently.',
            items: [
                { icon: 'shield-check', title: 'The SNLE nursing track is live', desc: 'The nursing track is now fully available: a standalone question bank and illustrated summaries covering nursing fundamentals, medical-surgical nursing, maternal and newborn nursing, paediatric nursing, mental health, and pharmacology with dosage calculations — plus performance analytics specific to the track. Choose “Nursing” when you create your account.', date: '31 July 2026' },
                { icon: 'sparkles', title: 'Real medical imaging inside the summaries', desc: 'The summaries are now illustrated with genuine radiographs, micrographs and anatomical figures — the steeple sign in croup, the thumb sign in epiglottitis, extradural and subdural haemorrhage on CT, and gout crystals under polarised light. Plus new diagrams in every specialty and more interactive questions after each summary.', date: '25 July 2026' },
                { icon: 'phone', title: 'An SQB shortcut on your phone screen', desc: 'Add SQB to your phone’s home screen and open it in a single tap like any app — no app store, no download. Full steps for iPhone and Android are in the next section.', date: '25 July 2026' },
                { icon: 'target', title: 'Questions updated to the 2026 Midgard & Gameboy format', desc: 'The question bank has been fully reviewed and updated to the latest 2026 exam format (Midgard & Gameboy), so you practise on what is closest to what you will actually see.', date: '15 July 2026' },
                { icon: 'calendar', title: 'May and June monthly collections added', desc: 'The new May and June monthly collections have joined the question bank, after a full review and verification of every question.', date: '15 July 2026' },
                { icon: 'book-open', title: 'Summaries rewritten and updated', desc: 'We rewrote the summaries and refreshed their content so they are clearer and more focused on the high-yield points.', date: '15 July 2026' },
            ],
        },

        resources: {
            pill: 'Essential links',
            title: 'Pages worth reading before you start',
            body: 'Before creating an account or starting to practise, you can read more about the platform, browse the FAQ, or contact us directly if you need help.',
            links: [
                { to: '/about', title: 'About us', desc: 'What SQB is for, and what it offers medical and nursing students and doctors in Saudi Arabia.' },
                { to: '/guides', title: 'Study guides', desc: 'Practical articles on the SMLE study plan, reviewing your mistakes, and managing your time before the exam.' },
                { to: '/faq', title: 'FAQ', desc: 'Quick answers about accounts, using the platform, mobile, and what the question bank contains.' },
                { to: '/contact', title: 'Contact us', desc: 'Reach the SQB team if you need support or have a question about the platform.' },
            ],
        },

        seo: {
            pill: 'SMLE • SNLE • Prometric • Saudi Arabia',
            title: 'Built around what medical and nursing students are actually looking for',
            body: 'If you are looking for a question bank for the SCFHS licensing exam, or a practical way to prepare for Prometric, this platform brings the questions, a graded practice path, and post-session analysis together.',
            topics: [
                { title: 'Structured SMLE preparation', desc: 'Start with short or long sessions depending on your time, and review your performance by specialty and by topic.' },
                { title: 'SNLE nursing exam preparation', desc: 'A complete, standalone nursing track: fundamentals, medical-surgical, maternal and newborn, paediatrics, mental health, and pharmacology with dosage calculations.' },
                { title: 'Fix your weak spots fast', desc: 'See where you go wrong, revisit those questions, and put your time into the topics that actually need work.' },
                { title: 'Updated Prometric question collections', desc: 'A comprehensive bank with updated collections that follow the latest SCFHS question style.' },
            ],
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
                body: 'Create your account, confirm your email, and get an hour of full access free — join the hundreds of students who passed their exam after training here.',
                primary: 'Create an account',
                secondary: 'Log in',
                note: 'A free hour · then SAR 99 for the whole year · Secure payment via Moyasar · No auto-renewal',
            },
        },

        mobileCta: {
            continue: 'Continue',
            logout: 'Log out',
            tryFree: 'Try free for an hour',
            login: 'Log in',
        },
    },
};

export default landingCopy;
