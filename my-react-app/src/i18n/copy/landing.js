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
                    desc: 'ليست تفسيرات لبعض الأسئلة الصعبة فقط — كل سؤال في بنكك له تفسير كامل، مكتوب بنفس البنية: الفكرة، العرض السريري، التشخيص، العلاج.',
                },
                {
                    icon: 'target',
                    title: 'ولماذا بقية الخيارات خاطئة',
                    desc: 'التفسير يبيّن ما الذي يميّز التشخيص الصحيح عن أقرب البدائل له — وهذا بالضبط ما يُختبر فيه سؤال الاختبار الحقيقي.',
                },
                {
                    icon: 'refresh',
                    title: 'وضع مذاكرة ووضع اختبار',
                    desc: 'في وضع المذاكرة يظهر التفسير فور اختيارك للإجابة. وفي وضع الاختبار لا يظهر شيء حتى تنتهي — تماماً كأجواء الاختبار الحقيقي. أنت من يختار.',
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
            cta: 'اختر مسارك وابدأ مجاناً',
            ctaNote: '40 سؤالاً مجاناً · بدون بطاقة دفع',
        },

        // Replaces the old four-icon "features" grid. Instead of describing the
        // product in adjectives, the section REBUILDS it: each panel is a live,
        // animated replica of the real screen, driven by the same CSS the app
        // uses. No screenshots — an image would go stale the first time the UI
        // changed, and would ship a 300 KB PNG to every mobile visitor.
        showcase: {
            sectionLabel: 'جولة داخل المنصة',
            pill: 'كل الأدوات في مكان واحد',
            title: 'شاهد المنصة قبل أن تسجّل',
            body: 'هذه ليست صوراً — بل الشاشات الفعلية للمنصة، تتحرك أمامك كما ستستخدمها تماماً.',
            liveTag: 'معاينة حيّة',
            items: [
                {
                    key: 'quiz',
                    icon: 'clipboard',
                    kicker: 'الأسئلة',
                    title: 'سؤال بنمط الاختبار، وتفسير فوري',
                    desc: 'تختار إجابتك فتظهر لك الإجابة الصحيحة وسبب صحتها فوراً — لا تنتظر نهاية الاختبار لتعرف أين أخطأت.',
                },
                {
                    key: 'analysis',
                    icon: 'bar-chart',
                    kicker: 'التحليلات',
                    title: 'دقتك في كل تخصص، بنظرة واحدة',
                    desc: 'حلقات تقدّم لكل تخصص، وتحديد تلقائي لأضعف نقطة لديك — لتعرف من أين تبدأ مراجعتك بدل التخمين.',
                },
                {
                    key: 'annotate',
                    icon: 'highlighter',
                    kicker: 'الملخصات',
                    title: 'علّم وارسم على الملخصات',
                    desc: 'أداة تحديد ورسم مدمجة داخل الملخصات المصوّرة — ظلّل النقاط المهمة وارسم عليها، وتبقى ملاحظاتك محفوظة.',
                },
                {
                    key: 'wrong',
                    icon: 'refresh',
                    kicker: 'أخطاؤك',
                    title: 'كل سؤال أخطأت فيه، مجموعاً وقابلاً للبحث',
                    desc: 'صفحة واحدة تجمع أخطاءك مع بحث فوري وفلترة بالتخصص — مراجعة الأخطاء هي أسرع طريق لرفع درجتك.',
                },
            ],
            // Text inside the animated replicas. Kept here so the mock screens
            // are translated like everything else.
            mock: {
                quizProgress: 'سؤال ٧ من ١٠',
                quizStem: 'رجل ٦٢ عاماً يعاني ألماً صدرياً ضاغطاً منذ ساعتين، ينتشر إلى الفك الأيسر مع تعرّق. ما أنسب خطوة أولى؟',
                quizOptions: ['تصوير مقطعي للصدر', 'تخطيط قلب كهربائي فوراً', 'اختبار جهد', 'تصوير صدر بالأشعة'],
                quizCorrectIndex: 1,
                quizExplain: 'تخطيط القلب خلال ١٠ دقائق هو المعيار في أي ألم صدري مشتبه بكونه إقفارياً — فهو ما يحدد مسار العلاج فوراً.',
                quizCorrectTag: 'إجابة صحيحة',
                analysisTitle: 'دقتك حسب التخصص',
                analysisWeak: 'أضعف تخصص',
                analysisOverall: 'الدقة العامة',
                annotateTitle: 'علامة الـSteeple في الخانوق',
                annotateTools: ['تحديد', 'قلم', 'ممحاة'],
                annotateNote: 'تضيّق تحت المزمار',
                wrongSearch: 'الأطفال',
                wrongCount: 'ثلاث نتائج',
                wrongItems: [
                    { q: 'أنسب علاج أولي للخانوق المتوسط…', you: 'مضاد حيوي', right: 'ديكساميثازون' },
                    { q: 'أشيع مسبب لالتهاب القصيبات…', you: 'المكورة الرئوية', right: 'الفيروس المخلوي RSV' },
                ],
                wrongYou: 'إجابتك',
                wrongRight: 'الصحيحة',
            },
            cta: 'جرّب هذه الشاشات بنفسك',
            ctaNote: '40 سؤالاً مجاناً · بدون بطاقة دفع',
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
                { label: 'التكلفة', sqb: 'من 50 ريالاً شهرياً — و300 للسنة كاملة', files: 'مجانية لكن مبعثرة وغير موثوقة', courses: 'آلاف الريالات' },
                { label: 'تحديث المحتوى', sqb: 'تجميعات شهرية مدقّقة', files: 'غير منتظم وبدون تدقيق', courses: 'ينتهي بانتهاء الدورة' },
                { label: 'شرح الإجابات', sqb: 'تفسير كامل لكل سؤال: الفكرة والتشخيص والعلاج', files: 'إجابات بلا شرح غالباً', courses: 'يعتمد على المحاضر' },
                { label: 'تحليل الأداء والأخطاء', sqb: 'تحليلات تلقائية بعد كل جلسة', files: 'يدوي — إن وُجد', courses: 'غير متوفر غالباً' },
                { label: 'مدة الوصول', sqb: 'شهر أو 4 أشهر أو سنة — تختار أنت', files: 'روابط تنتهي وملفات تضيع', courses: 'فترة محدودة' },
            ],
            cta: 'جرّب SQB بـ 40 سؤالاً مجاناً',
            ctaNote: 'قارن بنفسك قبل أن تدفع ريالاً واحداً',
        },

        costOfWaiting: {
            sectionLabel: 'التكلفة الحقيقية للتأجيل',
            pill: 'قبل أن تقرر',
            title: 'الرسوب لا يكلّفك درجة فقط — يكلّفك وقتاً ومالاً',
            body: 'قبل أن تقارن الأسعار، قارن التكلفة الحقيقية للمحاولة غير المستعدة: تسجيل جديد، انتظار الدورة القادمة، وتأخر يمتد لأشهر قبل أن تحصل على ترخيصك وتبدأ عملك.',
            items: [
                {
                    icon: 'refresh',
                    title: 'تسجيل جديد ودفع رسوم الاختبار مجدداً',
                    desc: 'أي محاولة إضافية تعني دفع رسوم الاختبار من جديد — قبل أن تُحتسب تكلفة وقتك.',
                },
                {
                    icon: 'calendar',
                    title: 'انتظار الدورة القادمة',
                    desc: 'مواعيد الاختبار محدودة على مدار السنة — رسوب دورة واحدة قد يعني أشهراً من الانتظار قبل فرصتك التالية.',
                },
                {
                    icon: 'trending-down',
                    title: 'تأخر الترخيص وبداية العمل',
                    desc: 'كل شهر تأخير في الترخيص هو شهر دخل مؤجَّل — التكلفة الأكبر، وإن كانت لا تظهر في أي فاتورة.',
                },
            ],
            note: '300 ريال لسنة كاملة من التحضير أقل بكثير من تكلفة محاولة واحدة إضافية.',
            cta: 'ابدأ التحضير الآن مجاناً',
            ctaNote: 'ابدأ اليوم بدل أن تدفع ثمن التأجيل لاحقاً',
        },

        value: {
            sectionLabel: 'الاشتراك والأسعار',
            pill: 'لماذا الاشتراك؟',
            // Sharpened to lead with the stake rather than the price. Every
            // consequence named here is real and verifiable — a resit fee, a
            // limited sitting calendar, a delayed licence. Nothing invents a
            // deadline, a vanishing discount or a seat cap.
            title: 'السؤال ليس «كم يكلفني الاشتراك؟» — بل «كم يكلفني الرسوب؟»',
            body: 'رسوب واحد يعني رسوم اختبار جديدة، وأشهراً حتى الدورة القادمة، وتأخراً في التوظيف والتدريب. اشتراك سنة كامل هنا يكلف 300 ريال — أقل من ستة ريالات في الأسبوع. الفرق بين الرقمين هو كل ما في الأمر.',
            points: [
                { icon: 'trending-down', title: 'ثمن المحاولة الثانية أعلى من الاشتراك بكثير', desc: 'إعادة الاختبار تعني دفع رسوم الاختبار كاملة من جديد، وشهوراً من الانتظار، وسنةً تُضاف إلى تخرجك قبل أن تبدأ عملك. 300 ريال في مقابل ذلك ليست تكلفة — بل تأمين.' },
                { icon: 'target', title: 'لا تدخل الاختبار وأنت تجهل نقاط ضعفك', desc: 'أكثر من يرسب لا يرسب لأنه لم يذاكر، بل لأنه ذاكر ما يتقنه أصلاً. التحليلات هنا تكشف التخصص الذي يخسّرك الدرجات وتعيد تدريبك عليه تحديداً.' },
                { icon: 'refresh', title: 'أسئلة محدّثة، لا ملفات عمرها ثلاث سنوات', desc: 'التجميعات المتداولة مجاناً غالباً قديمة وغير مدقّقة — وقد تحفظ منها إجابة خاطئة. نضيف تجميعات مراجَعة تواكب أحدث نمط لأسئلة الهيئة السعودية.' },
                { icon: 'check-circle', title: 'جرّب قبل أن تدفع', desc: '40 سؤالاً مجاناً بلا حد زمني، وأول درس من كل تخصص مفتوح لك للأبد. ثم دفعة واحدة عبر ميسر، وبدون تجديد تلقائي.' },
            ],
            priceCardLabel: 'تفاصيل الاشتراك',
            plan: 'شهر · 4 أشهر · سنة — دفعة واحدة في كل الحالات',
            amount: '50',
            currency: 'ريال / شهر',
            perMonth: 'أربعة أشهر بـ 129 ريالاً بدلاً من 200 · 300 ريال للسنة · واشتراكات جماعية للأصدقاء',
            included: [
                'بنك أسئلة شامل محدّث بنمط اختبارك — SMLE أو SNLE — مع تجميعات جديدة باستمرار',
                'تفسير واضح لكل إجابة — تعرف لماذا هي الصحيحة، ولماذا البقية خطأ',
                'ملخصات مركّزة للمواضيع عالية التكرار بدل تشتت الملفات والمصادر',
                'اختبارات محاكية بتوقيت حقيقي تهيّئك لأجواء الاختبار الفعلي',
                'لوحة تحليلات تكشف نقاط ضعفك وتعيد تدريبك عليها تلقائياً',
                'مراجعة أسئلتك الخاطئة في أي وقت حتى تتقنها',
                'يعمل على الجوال والكمبيوتر، وتقدّمك محفوظ ومتزامن دائماً',
            ],
            cta: 'ابدأ بـ 40 سؤالاً مجاناً',
            note: '40 سؤالاً مجاناً أولاً · دفع آمن عبر ميسر · مدى / Visa / Mastercard / Apple Pay · بدون تجديد تلقائي',
            // The public shop window for the group plans. Prices here must stay
            // in step with PLANS.group_3 / group_5 in backend/services/paymentService.js.
            group: {
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
            cta: 'احصل على كل هذا الآن',
            ctaNote: 'كل ما سبق مشمول في الاشتراك نفسه — وكل جديد يصلك تلقائياً',
        },
        // The five study guides. Titles and excerpts are NOT duplicated here —
        // Landing.jsx reads them straight from i18n/copy/guides.js, so the
        // landing band, the /guides hub and the prerendered HTML can never
        // drift apart. Only the framing around them lives in this file.
        guides: {
            sectionLabel: 'أدلة التحضير',
            pill: 'اقرأ قبل أن تبدأ',
            title: 'أدلة عملية عن طريقة المذاكرة نفسها',
            body: 'خمسة أدلة مكتوبة بالكامل ومفتوحة للجميع بدون حساب: كيف تستخدم بنك الأسئلة بالترتيب الصحيح، وكيف تبني خطة واقعية، وكيف تحوّل كل خطأ إلى قاعدة لا تتكرر.',
            all: 'تصفّح كل الأدلة',
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
                body: 'أنشئ حسابك، أكّد بريدك، وابدأ فوراً بـ 40 سؤالاً مجانياً — انضم إلى مئات الطلاب الذين اجتازوا اختبارهم بعد التدريب هنا.',
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
                    desc: 'These are not explanations on a selected few. Every question in your bank has a full one, written to the same structure: concept, presentation, diagnosis, management.',
                },
                {
                    icon: 'target',
                    title: 'And why the other options are wrong',
                    desc: 'The explanation names what separates the right diagnosis from its nearest look-alike — which is precisely what the real exam question is testing.',
                },
                {
                    icon: 'refresh',
                    title: 'Study mode and exam mode',
                    desc: 'In study mode the explanation opens the moment you answer. In exam mode nothing is revealed until you finish, exactly like the real thing. You choose which.',
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
            cta: 'Pick your track and start free',
            ctaNote: '40 free questions · No payment card',
        },

        // Replaces the old four-icon "features" grid. Instead of describing the
        // product in adjectives, the section REBUILDS it: each panel is a live,
        // animated replica of the real screen, driven by the same CSS the app
        // uses. No screenshots — an image would go stale the first time the UI
        // changed, and would ship a 300 KB PNG to every mobile visitor.
        showcase: {
            sectionLabel: 'A tour inside the platform',
            pill: 'Every tool in one place',
            title: 'See the platform before you sign up',
            body: 'These are not screenshots — they are the real screens, moving exactly the way you will use them.',
            liveTag: 'Live preview',
            items: [
                {
                    key: 'quiz',
                    icon: 'clipboard',
                    kicker: 'Questions',
                    title: 'An exam-style question, explained the moment you answer',
                    desc: 'Pick an option and the correct answer — and the reasoning behind it — appears immediately. You never wait until the end of a quiz to find out where you went wrong.',
                },
                {
                    key: 'analysis',
                    icon: 'bar-chart',
                    kicker: 'Analytics',
                    title: 'Your accuracy in every specialty, at a glance',
                    desc: 'A progress ring per specialty and your weakest one flagged automatically — so you know where revision starts instead of guessing.',
                },
                {
                    key: 'annotate',
                    icon: 'highlighter',
                    kicker: 'Summaries',
                    title: 'Highlight and draw straight on the summaries',
                    desc: 'A highlighter and pen built into the illustrated summaries — mark what matters, draw on the images, and your notes stay put.',
                },
                {
                    key: 'wrong',
                    icon: 'refresh',
                    kicker: 'Your mistakes',
                    title: 'Every question you got wrong, collected and searchable',
                    desc: 'One page gathering all your mistakes, with instant search and a specialty filter. Reworking your own errors is the fastest way to move your score.',
                },
            ],
            // Text inside the animated replicas. Kept here so the mock screens
            // are translated like everything else.
            mock: {
                quizProgress: 'Question 7 of 10',
                quizStem: 'A 62-year-old man has two hours of crushing chest pain radiating to the left jaw, with sweating. What is the most appropriate first step?',
                quizOptions: ['CT chest', 'Immediate 12-lead ECG', 'Exercise stress test', 'Chest X-ray'],
                quizCorrectIndex: 1,
                quizExplain: 'An ECG within 10 minutes is the standard for any suspected ischaemic chest pain — it is what decides the treatment pathway straight away.',
                quizCorrectTag: 'Correct',
                analysisTitle: 'Accuracy by specialty',
                analysisWeak: 'Weakest',
                analysisOverall: 'Overall accuracy',
                annotateTitle: 'Steeple sign in croup',
                annotateTools: ['Highlight', 'Pen', 'Erase'],
                annotateNote: 'Subglottic narrowing',
                wrongSearch: 'croup',
                wrongCount: '3 results',
                wrongItems: [
                    { q: 'First-line treatment for moderate croup…', you: 'Antibiotics', right: 'Dexamethasone' },
                    { q: 'Commonest cause of bronchiolitis…', you: 'Pneumococcus', right: 'RSV' },
                ],
                wrongYou: 'You',
                wrongRight: 'Correct',
            },
            cta: 'Try these screens yourself',
            ctaNote: '40 free questions · No payment card',
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
                { label: 'Cost', sqb: 'From SAR 50 a month — SAR 300 for a whole year', files: 'Free, but scattered and unreliable', courses: 'Thousands of riyals' },
                { label: 'Content updates', sqb: 'Verified monthly collections', files: 'Irregular, and unverified', courses: 'Ends when the course ends' },
                { label: 'Answer explanations', sqb: 'A full explanation for every question: concept, diagnosis, management', files: 'Usually answers with no reasoning', courses: 'Depends on the lecturer' },
                { label: 'Performance and error analysis', sqb: 'Automatic analytics after every session', files: 'Manual — if at all', courses: 'Usually not offered' },
                { label: 'How long you keep access', sqb: 'A month, four months or a year — your choice', files: 'Links expire and files get lost', courses: 'A limited window' },
            ],
            cta: 'Try SQB with 40 free questions',
            ctaNote: 'See it for yourself before you pay a riyal',
        },

        costOfWaiting: {
            sectionLabel: 'The real cost of waiting',
            pill: 'Before you decide',
            title: "Failing doesn't just cost you a grade — it costs you time and money",
            body: "Before you compare prices, compare the real cost of an unprepared attempt: registering again, waiting for the next sitting window, and months of delay before you're licensed and earning.",
            items: [
                {
                    icon: 'refresh',
                    title: 'Re-registering and paying the exam fee again',
                    desc: 'Every extra attempt means paying the exam fee again — before your time is even counted.',
                },
                {
                    icon: 'calendar',
                    title: 'Waiting for the next sitting window',
                    desc: 'Exam dates are limited across the year — failing one sitting can mean months before your next shot.',
                },
                {
                    icon: 'trending-down',
                    title: 'A delayed licence, a delayed start',
                    desc: 'Every month your licence is delayed is a month of income postponed — the biggest cost, even though it never shows up on an invoice.',
                },
            ],
            note: 'SAR 300 for a full year of preparation is far less than the cost of a single extra attempt.',
            cta: 'Start preparing now, free',
            ctaNote: 'Start today instead of paying for the delay later',
        },

        value: {
            sectionLabel: 'Subscription and pricing',
            pill: 'Why subscribe?',
            // Sharpened to lead with the stake rather than the price. Every
            // consequence named here is real and verifiable — a resit fee, a
            // limited sitting calendar, a delayed licence. Nothing invents a
            // deadline, a vanishing discount or a seat cap.
            title: 'The question is not “what does a subscription cost?” — it is “what does failing cost me?”',
            body: 'One failed attempt means paying the exam fee again, months until the next sitting window, and a delayed start to your training and your income. A full year here costs less than two riyals a week. The gap between those two numbers is the whole argument.',
            points: [
                { icon: 'trending-down', title: 'A second attempt costs far more than a subscription', desc: 'Resitting means the full exam fee again, months of waiting, and another year added before you start earning. Against that, SAR 300 is not a cost — it is insurance.' },
                { icon: 'target', title: "Don't walk in blind to your own weak spots", desc: 'Most people who fail did revise — they revised what they were already good at. The analytics here name the specialty that is losing you marks and drill you on that one.' },
                { icon: 'refresh', title: 'Current questions, not files three years old', desc: 'The collections passed around for free are usually old and unverified — you can memorise a wrong answer from them. We add reviewed collections that track the latest SCFHS question style.' },
                { icon: 'check-circle', title: 'Try it before you pay', desc: '40 free questions with no time limit, and the first lesson of every specialty open to you for good. Then one payment through Moyasar, and no auto-renewal.' },
            ],
            priceCardLabel: 'Subscription details',
            plan: 'A month, four months or a year — one payment either way',
            amount: '50',
            currency: 'SAR / month',
            perMonth: 'Four months for SAR 129, down from 200 · SAR 300 for a year · group plans for study partners',
            included: [
                'A comprehensive question bank matched to your exam — SMLE or SNLE — with new collections added continually',
                'A clear explanation for every answer: why it is right, and why the others are not',
                'Focused summaries of the highest-yield topics, instead of a mess of files and sources',
                'Timed mock exams that put you in real exam conditions',
                'An analytics dashboard that finds your weak spots and drills you on them automatically',
                'Review your wrong questions any time until you own them',
                'Works on mobile and desktop, with your progress always saved and in sync',
            ],
            cta: 'Start with 40 free questions',
            note: '40 free questions first · Secure payment via Moyasar · mada / Visa / Mastercard / Apple Pay · No auto-renewal',
            // The public shop window for the group plans. Prices here must stay
            // in step with PLANS.group_3 / group_5 in backend/services/paymentService.js.
            group: {
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
            cta: 'Get all of this now',
            ctaNote: 'Everything above is in the same subscription — and every update reaches you automatically',
        },
        guides: {
            sectionLabel: 'Study guides',
            pill: 'Read before you start',
            title: 'Practical guides on how to study, not just what to study',
            body: 'Five complete guides, open to everyone with no account: how to use a question bank in the right order, how to build a plan you can actually keep, and how to turn every mistake into a rule that stops repeating.',
            all: 'Browse all the guides',
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
                body: 'Create your account, confirm your email, and start with 40 free questions — join the hundreds of students who passed their exam after training here.',
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
