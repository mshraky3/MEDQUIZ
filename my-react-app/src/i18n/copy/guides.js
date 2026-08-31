/**
 * The public study guides (hub + six articles).
 *
 * Rendered by components/guides/GuideArticle.jsx from the same block shapes as
 * the legal documents: `{ p }`, `{ h3 }`, `{ ul }`, plus `{ ad: true }` for the
 * in-article ad slot. `**bold**` and `[[/path|label]]` work inside any string.
 *
 * Clinical terms that candidates meet in English on the real exam — stem,
 * high-yield, mixed blocks, timed sets, Internal Medicine, OB/GYN — stay in
 * English in the Arabic version too. That is how these guides were written and
 * how students actually talk about the exam.
 */
const guidesCopy = {
    ar: {
        hub: {
            kicker: 'SMLE & SNLE Guides',
            title: 'أدلة التحضير لاختبارات SMLE وSNLE والبرومترك',
            intro: 'مكتبة مخصّصة للمحتوى التعليمي العميق: التوزيع الرسمي لاختبار التمريض SNLE، وخطط مذاكرة، واستراتيجيات حل الأسئلة، وإدارة الوقت، ومناهج مراجعة موجّهة لطلاب الطب والتمريض في السعودية.',
            listLabel: 'أدلة التحضير',
            readMore: 'اقرأ الدليل الكامل',
            notesTitle: 'كيف تستفيد من الأدلة؟',
            notes: [
                'ابدأ بخطة زمنية واقعية حسب وقتك اليومي.',
                'إن كان اختبارك SNLE فابدأ من التوزيع الرسمي: الأقسام الأربعة لها نسب ثابتة، فليكن أسبوعك موزّعاً عليها.',
                'اربط كل جلسة حل أسئلة بمراجعة أخطائك مباشرة.',
                'حافظ على التوازن بين Internal Medicine والجراحة وPediatrics وOB/GYN.',
                'لا تقِس التقدّم بعدد الساعات فقط، بل بجودة التكرار وتصحيح القرار السريري.',
            ],
            cards: [
                {
                    path: '/guides/snle-blueprint',
                    title: 'اختبار SNLE للتمريض: التوزيع الرسمي وشكل الاختبار ودرجة النجاح',
                    excerpt: 'كل ما تحتاج معرفته عن اختبار الرخصة السعودية للتمريض، منقولاً من الدليل الرسمي للهيئة السعودية للتخصصات الصحية: عدد الأسئلة، توزيع الأقسام ونسبها، درجة النجاح، وسياسة المحاولات.',
                },
                {
                    path: '/guides/how-to-use-a-question-bank',
                    title: 'كيف تستخدم بنك الأسئلة لرفع أدائك في SMLE والبرومترك',
                    excerpt: 'امتلاك بنك أسئلة كبير لا يرفع درجتك وحده. دليل عملي لاستخدامه بالترتيب الصحيح: من التشخيص المبدئي إلى المحاكاة الكاملة.',
                },
                {
                    path: '/guides/smle-study-plan',
                    title: 'خطة SMLE من 12 أسبوعاً: من الصفر إلى الجاهزية',
                    excerpt: 'خطة أسبوعية واضحة لتغطية التخصصات الأساسية، مع توزيع يومي للمذاكرة، ومراجعة الأخطاء، وحل أسئلة عالية العائد.',
                },
                {
                    path: '/guides/wrong-questions-method',
                    title: 'طريقة مراجعة الأسئلة الخاطئة بدون تكرار نفس الخطأ',
                    excerpt: 'دليل عملي لبناء دفتر أخطاء ذكي وتحويل كل خطأ إلى قاعدة تشخيصية أو علاجية ثابتة قبل يوم الاختبار.',
                },
                {
                    path: '/guides/smle-vs-prometric-differences',
                    title: 'الفرق بين SMLE وPrometric: ما الذي يجب أن تغيّره في مذاكرتك؟',
                    excerpt: 'مقارنة عملية بين طبيعة الأسئلة، وأسلوب التفكير السريري، وإدارة الوقت في SMLE وبرومترك، مع خطة تنفيذية واضحة.',
                },
                {
                    path: '/guides/smle-high-yield-topics',
                    title: 'أهم مواضيع SMLE عالية العائد: كيف توزّع وقتك بذكاء؟',
                    excerpt: 'خريطة أولويات للمواضيع الأكثر تأثيراً على أدائك، مع توزيع أسبوعي يقلّل الهدر ويرفع نسبة إجاباتك الصحيحة.',
                },
            ],
        },

        /**
         * The only guide on the site written from a primary source rather than
         * from experience. Every number in it — 200 questions, 20/40/30/10,
         * the 500 pass mark — is transcribed from the SCFHS applicant guide
         * named in the last section, and the last section exists so a reader
         * can check the claim rather than trust it. If SCFHS publishes a new
         * edition, this page is wrong until someone re-reads it: that is the
         * cost of publishing exam logistics, and the reason the six pages in
         * S1-06/07 were not written blind.
         */
        snleBlueprint: {
            kicker: 'SNLE Blueprint',
            title: 'اختبار SNLE للتمريض: التوزيع الرسمي وشكل الاختبار ودرجة النجاح',
            intro: 'هذا الدليل يشرح اختبار الرخصة السعودية للتمريض (SNLE) كما تصفه الهيئة السعودية للتخصصات الصحية في دليل المتقدّم الرسمي: كم سؤالاً، وكيف تتوزّع الأقسام ونسبها، وما درجة النجاح، وكم محاولة لديك. كل رقم هنا منقول من ذلك الدليل، ومصدره مذكور في آخر الصفحة حتى تتحقّق منه بنفسك.',
            sections: [
                {
                    heading: '1) شكل الاختبار: كم سؤالاً وكم وقتاً',
                    blocks: [
                        { p: 'اختبار SNLE يتكوّن من **200 سؤال اختيار من متعدد**، وقد يتضمّن حتى 10% أسئلة تجريبية (pilot) لا تُحتسب في درجتك. الاختبار مقسوم إلى **جزأين، كل جزء 100 سؤال ومدّته 120 دقيقة**، وبينهما استراحة مجدولة مدّتها 30 دقيقة.' },
                        { p: 'كل سؤال يحمل أربعة خيارات تختار منها إجابة واحدة هي الأفضل. والاختبار يخلط بين أسئلة استرجاع مباشرة تقيس المعلومة، وأسئلة سيناريو تقيس التفسير والتحليل واتخاذ القرار والاستدلال وحل المشكلات — وهذا الخلط هو ما يجعل الحفظ وحده غير كافٍ.' },
                    ],
                },
                {
                    heading: '2) التوزيع الرسمي (Blueprint)',
                    blocks: [
                        { p: 'الاختبار مبني على أربعة أقسام بنسب ثابتة. هذه هي الخريطة التي يُبنى عليها كل نموذج اختبار:' },
                        {
                            ul: [
                                '**تمريض البالغين — 40%**: التمريض الباطني، والتمريض الجراحي، والعناية الحرجة، وتمريض المجتمع، والصحة النفسية.',
                                '**تمريض الأمومة والطفل — 30%**: تمريض الولادة، وأمراض النساء، وتمريض حديثي الولادة، وطب الأطفال، وجراحة الأطفال.',
                                '**أساسيات التمريض — 20%**: أساسيات التمريض، والمهنية، والرعاية المتمحورة حول المريض، والممارسة المبنية على الدليل والبحث، والقيادة والإدارة، وإدارة الجودة والسلامة، والتثقيف الصحي، والتواصل وتقنية المعلومات، والفحص السريري، والأدوية، والعلوم الأساسية.',
                                '**إدارة وقيادة التمريض — 10%**: الموارد اللازمة لتنسيق رعاية المريض، وجودة الرعاية وسلامتها في الخط الأول، وفرق التمريض والعلاقات بين المهن الصحية، والمعلوماتية التمريضية للتقديم الآمن والنظامي للرعاية، والبحث والممارسة المبنية على الدليل.',
                            ],
                        },
                        { p: 'ينصّ الدليل الرسمي على أن التوزيع قد يختلف بمقدار **±5% في كل مستوى**. أي أن قسم تمريض البالغين قد يظهر بين 35% و45%، وأن إدارة وقيادة التمريض لن تنزل عن 5% مهما حدث. هذا هامش تخطيط، لا إذن بتجاهل قسم كامل.' },
                    ],
                },
                {
                    heading: '3) درجة النجاح وعدد المحاولات',
                    blocks: [
                        { p: '**درجة النجاح هي 500 على مقياس من 200 إلى 800.** حدّدتها الهيئة في أبريل 2017 عبر لجنة من 14 ممرضة وممرضاً في تمرين ضبط معياري (standard setting)، ثم اعتمدتها لجنة التقييم المركزية. لاحظ أن هذه الدرجة ليست نسبة مئوية من الإجابات الصحيحة، بل درجة معيارية.' },
                        { p: 'ملاحظة مهمة لمن يقارن بين الاختبارين: **درجة النجاح في SMLE للطب هي 560 على المقياس نفسه، لا 500.** الرقمان ليسا متبادلين، وكثير من المصادر غير الرسمية تخلط بينهما.' },
                        { p: 'أما المحاولات: يحق لك دخول SNLE حتى **أربع مرات في السنة** ابتداءً من محاولتك الأولى حتى تحصل على درجة النجاح. وبعد النجاح يحق لك محاولتان إضافيتان لتحسين درجتك بهدف فرص أفضل في القبول للتدريب، ثم محاولة واحدة سنوياً بعد مرور سنة تقويمية على المحاولة الثانية.' },
                        { p: 'ولا يُسمح بدخول الاختبار مرتين في نافذة الاختبار نفسها: تُعتمد نتيجة الأول، وتُحتسب الثانية محاولةً ونتيجتها ملغاة.' },
                    ],
                },
                {
                    heading: '4) من يحقّ له التقديم، وكيف تحجز موعدك',
                    blocks: [
                        { p: 'التقديم متاح لمن يحمل **درجة جامعية أولى معترفاً بها (بكالوريوس تمريض أو ما يعادلها)** من برنامج صحي معتمد، أو لمن بدأ سنة الامتياز، أو لمن تبقّى له سنة واحدة على التخرّج. وطلاب الجامعات والكليات السعودية يمكنهم دخول SNLE في سنتهم الأخيرة.' },
                        { p: 'الترتيب العملي: تقدّم عبر الخدمة الإلكترونية، ثم يصلك تصريح الجدولة (scheduling permit) ومعه فترة الأهلية الخاصة بك عبر البريد الإلكتروني، ثم تحجز موعدك في أحد مراكز Prometric المعتمدة — داخل المملكة أو خارجها. الحجز غير متاح لأكثر من ثلاثة أشهر مقدماً، وجدولة المحاولات خلال السنة مسؤوليتك أنت وحدك.' },
                        { p: 'النتائج لا تظهر فور انتهائك. يجري تحليل نفسي-قياسي عند إغلاق النافذة، ثم **تُعلن النتائج خلال أسبوعين إلى ستة أسابيع من نهاية نافذة الاختبار**، ويصلك تقريران: بيان النتيجة، وتقرير أداء يقارنك بغيرك من المتقدّمين.' },
                    ],
                },
                {
                    heading: '5) كيف توزّع مذاكرتك على هذا التوزيع',
                    blocks: [
                        { p: 'أسهل طريقة لاستخدام الـblueprint هي أن تجعله جدول وقتك لا مجرد معلومة. إن كان لديك عشر ساعات مذاكرة أسبوعياً، فالتوزيع الأمين لها: أربع ساعات لتمريض البالغين، وثلاث لتمريض الأمومة والطفل، وساعتان للأساسيات، وساعة لإدارة وقيادة التمريض. هذا كل ما تعنيه النسب عملياً.' },
                        { p: '**والقسم الذي يُهمَل عادةً هو إدارة وقيادة التمريض.** هو عُشر الاختبار — نحو 20 سؤالاً — ومعظم مواد التحضير المتاحة تمرّ عليه مروراً سريعاً أو تتجاهله، لأنه ليس تخصصاً سريرياً يسهل تجميع أسئلته. عامله كقسم قائم بذاته: التفويض ومن يُفوَّض له، وترتيب الأولويات بين المرضى، وتقارير الحوادث والجودة، والعلاقة بالفرق الأخرى، والمعلوماتية التمريضية وسرّية السجل الإلكتروني. مرجع واحد في إدارة التمريض يغطّي هذا القسم أفضل من مئة سؤال سريري إضافي.' },
                        { p: 'وللأقسام السريرية، أفضل استخدام لبنك الأسئلة هو الحل ثم مراجعة الخطأ فوراً، لا الحل وحده — الطريقة مشروحة بالتفصيل في [[/guides/how-to-use-a-question-bank|دليل استخدام بنك الأسئلة]] و[[/guides/wrong-questions-method|دليل مراجعة الأسئلة الخاطئة]]، وكلاهما ينطبق على SNLE كما ينطبق على SMLE.' },
                        { p: 'ويمكنك البدء الآن بلا حساب: [[/demo|جرّب 20 سؤالاً]]، أو تصفّح [[/questions|الأسئلة المنشورة مجاناً]] بشرح مكتوب لكل إجابة، ومنها أقسام [[/questions/nursing-fundamentals|أساسيات التمريض]] و[[/questions/medical-surgical-nursing|التمريض الباطني والجراحي]] و[[/questions/maternal-and-newborn-nursing|تمريض الأمومة والمواليد]].' },
                    ],
                },
                {
                    heading: '6) يوم الاختبار',
                    blocks: [
                        { p: 'مراكز الاختبار تفتح الساعة 7:30 صباحاً. **إن تأخّرت أكثر من 30 دقيقة عن الموعد المدوّن في تذكرة الدخول، أو غبت، فلن يُسمح لك بالدخول وتُحتسب محاولة** — إلا بعذر مقبول موثّق توافق عليه اللجنة المشرفة.' },
                        { p: 'خُذ معك تصريح الجدولة (ورقياً أو على هاتفك) وهوية سارية: جواز السفر، أو الهوية الوطنية/الإقامة داخل المملكة. **يجب أن يطابق اسمك في الهوية اسمك في التصريح مطابقةً تامة.** من يصل بلا تصريح أو بلا هوية مقبولة لا يدخل، ويدفع رسوماً لإعادة الجدولة ضمن فترة أهليته.' },
                        { p: 'داخل المركز: فحص أمني قبل الدخول، ويُعاد الفحص في كل مرة تعود فيها إلى قاعة الاختبار بعد الاستراحة. يُعطى لك لوح كتابة قابل للمسح وأقلام لاستخدامها في الحسابات، وتُعيدها في نهاية الجلسة، ولا يجوز الكتابة على أي شيء آخر. والجلسات مراقَبة بالصوت والصورة.' },
                        { p: 'وإن أردت تجربة تشبه الاختبار الحقيقي قبل يومه، توفّر الهيئة اختباراً تجريبياً (mock test) مبنياً على التوزيع نفسه ومسحوباً من بنك أسئلة SNLE، ويُطلب عبر موقعها.' },
                    ],
                },
                {
                    heading: '7) مصدر هذه المعلومات',
                    blocks: [
                        { p: 'كل ما سبق منقول من **دليل المتقدّم لاختبار الرخصة السعودية للتمريض (SNLE — Examination Content Guideline)** الصادر عن الهيئة السعودية للتخصصات الصحية، النسخة المنشورة على موقع الهيئة، وقد رُوجعت في 31 أغسطس 2026.' },
                        { p: 'الهيئة تحدّث هذا الدليل من حين لآخر — النسخة السابقة اختلفت عن الحالية في بندين فرعيين — ولذلك: **قبل التقديم، افتح دليل المتقدّم الحالي على موقع الهيئة scfhs.org.sa وتأكّد بنفسك.** أي صفحة على الإنترنت، بما فيها هذه، قد تتأخّر عن الدليل الرسمي. ما تقرؤه هنا ليس بديلاً عنه.' },
                    ],
                },
            ],
        },

        studyPlan: {
            kicker: 'SMLE Study Plan',
            title: 'خطة SMLE من 12 أسبوعاً: برنامج مذاكرة عملي قابل للتنفيذ',
            intro: 'هذا الدليل مكتوب للأطباء وطلاب الطب الذين يريدون خطة واضحة للتحضير لاختبار الهيئة السعودية للتخصصات الصحية. الهدف ليس الدراسة العشوائية، بل تحويل كل أسبوع إلى نتائج قابلة للقياس: دقة أعلى، ووقت أقل لكل سؤال، وفهم سريري أقوى في القرار التشخيصي والعلاجي.',
            sections: [
                {
                    heading: '1) تقسيم الأسابيع إلى مراحل',
                    blocks: [{ p: 'قسّم التحضير إلى ثلاث مراحل: تأسيس، ورفع سرعة، ومحاكاة اختبار. في مرحلة التأسيس (أسابيع 1–4) ركّز على المواضيع الأعلى تكراراً في Internal Medicine وPediatrics مع مراجعة مبادئ OB/GYN والجراحة. في مرحلة رفع السرعة (أسابيع 5–8) زد حجم الأسئلة اليومية وابدأ جلسات timed sets. وفي مرحلة المحاكاة (أسابيع 9–12) اجعل أغلب مذاكرتك اختبارات كاملة مع تحليل دقيق بعد كل محاولة.' }],
                },
                {
                    heading: '2) نموذج يوم مذاكرة فعّال',
                    blocks: [{ p: 'اليوم الفعّال ثلاث كتل: كتلة تعلّم قصيرة، وكتلة حل أسئلة، وكتلة مراجعة أخطاء. مثال عملي: 45 دقيقة مراجعة مرجعية مركّزة، ثم 40 إلى 60 سؤالاً بنظام زمني، ثم 60 دقيقة تحليل أخطاء. ولا تنتقل لموضوع جديد قبل أن تكتب سبب الخطأ: نقص معلومة، أو سوء قراءة stem، أو تسرّع في استبعاد الخيارات.' }],
                },
                {
                    heading: '3) كيف تراجع السؤال الخاطئ بطريقة تمنع تكراره',
                    blocks: [{ p: 'كل سؤال خاطئ يجب أن ينتج ملاحظة قابلة للاستخدام لاحقاً. اكتب الجملة السريرية المفتاحية التي كان يجب أن توجّهك للإجابة الصحيحة، ثم اكتب قاعدة قرار قصيرة. مثال: إذا ذكر الـstem علامة خطر (red flag) مع تدهور سريع، فالأولوية لتشخيص أو تدخل محدّد حتى قبل التفاصيل الثانوية. بهذه الطريقة يتحول الخطأ إلى قرار واضح يُستدعى تلقائياً.' }],
                },
                { ad: true },
                {
                    heading: '4) إدارة الوقت داخل الاختبار',
                    blocks: [{ p: 'الهدف الواقعي متوسط ثابت لكل سؤال مع مساحة للمراجعة النهائية. استخدم قاعدة المرور الواحد: أجب على الأسئلة المباشرة فوراً، وعلّم الأسئلة المترددة، ثم ارجع لها في الجولة الثانية. ولا تسمح لسؤال واحد أن يسحب دقيقتين أو أكثر بلا قرار، لأن ذلك يضغطك في آخر البلوك ويزيد أخطاء التركيز.' }],
                },
                {
                    heading: '5) خطة أسبوعية مختصرة (عدّلها حسب وقتك)',
                    blocks: [
                        {
                            ul: [
                                'السبت – الاثنين: موضوع رئيسي + جلسات أسئلة موجّهة.',
                                'الثلاثاء: مراجعة الأخطاء المتراكمة وبناء قائمة high-yield.',
                                'الأربعاء – الخميس: mixed blocks لمحاكاة الواقع.',
                                'الجمعة: اختبار قصير + تقييم الأداء + ضبط خطة الأسبوع التالي.',
                            ],
                        },
                        { p: 'الثبات أهم من المثالية. حتى لو كان وقتك محدوداً، الالتزام بخطة واضحة لمدة 12 أسبوعاً يعطي نتيجة أفضل من الدراسة المتقطّعة بلا قياس حقيقي للأداء.' },
                    ],
                },
                {
                    heading: '6) مؤشرات الجاهزية قبل يوم الاختبار',
                    blocks: [{ p: 'راقب ثلاثة مؤشرات: دقة مستقرة في mixed sets، وانخفاض الأخطاء المتكررة في المحاور نفسها، وثبات إدارة الوقت عبر أكثر من محاكاة كاملة. إذا كانت هذه المؤشرات تتحسّن أسبوعياً فأنت على المسار الصحيح، حتى لو بقيت بعض الثغرات في مواضيع محدّدة.' }],
                },
            ],
        },

        howToUseBank: {
            kicker: 'Question Bank Strategy',
            title: 'كيف تستخدم بنك الأسئلة لرفع أدائك في SMLE والبرومترك',
            intro: 'امتلاك بنك أسئلة كبير لا يرفع درجتك تلقائياً؛ الفرق الحقيقي في كيفية استخدامه: بأي ترتيب تحل، وكيف تراجع، وكيف تحوّل كل جلسة إلى تحسّن مقاس فعلياً وليس مجرد عدد أسئلة أُنجز. هذا الدليل يجمع الخطوات العملية الأساسية، مع روابط لكل موضوع بالتفصيل.',
            sections: [
                {
                    heading: '1) ابدأ بجلسة تشخيصية قبل أي خطة',
                    blocks: [{ p: 'قبل أن تلتزم بخطة مذاكرة، حل بلوكاً مختلطاً من 40 إلى 60 سؤالاً يغطي عدة تخصصات دفعة واحدة. الهدف ليس الدرجة بل معرفة نقاط ضعفك الحقيقية قبل أن تبني عليها خطتك. بعدها ابنِ جدولك حول هذه النتيجة بدل توزيع وقت متساوٍ على كل موضوع، كما في [[/guides/smle-study-plan|خطة SMLE من 12 أسبوعاً]].' }],
                },
                {
                    heading: '2) حل تحت ظروف الاختبار الحقيقية',
                    blocks: [{ p: 'الأسئلة التي تُحل بلا وقت محدد ولا تركيز متواصل تدرّبك على عادات لن تنفعك يوم الاختبار. استخدم timed sets بعدد أسئلة وزمن مطابقين لبنية الاختبار الفعلي، بلا توقف منتصف البلوك. هذا وحده يكشف مشاكل إدارة الوقت التي لا تظهر في الحل العشوائي.' }],
                },
                {
                    heading: '3) عامل كل سؤال — صح أو خطأ — كبيانات',
                    blocks: [{ p: 'الإجابة الصحيحة بتخمين، أو بعد تردد بين خيارين، تحمل نفس قيمة الخطأ من ناحية التعلم. سجّلها وراجعها بنفس الجدية. للحصول على نظام كامل لتصنيف الأخطاء وتحويلها لقواعد قرار ثابتة، راجع [[/guides/wrong-questions-method|دليل مراجعة الأسئلة الخاطئة]].' }],
                },
                { ad: true },
                {
                    heading: '4) وزّع الأسئلة حسب العائد لا بالتساوي',
                    blocks: [{ p: 'لا تحل نفس عدد الأسئلة في كل موضوع. المواضيع عالية التكرار تستحق حصة أكبر من وقتك في بنك الأسئلة، والمواضيع النادرة تستحق مراجعة خفيفة فقط. تفاصيل هذا التوزيع وكيفية اكتشاف أولوياتك موجودة في [[/guides/smle-high-yield-topics|دليل المواضيع عالية العائد]].' }],
                },
                {
                    heading: '5) عدّل أسلوب الحل حسب الاختبار المستهدف',
                    blocks: [{ p: 'الطريقة المثلى لحل الأسئلة تختلف قليلاً بين SMLE والبرومترك من ناحية عمق قراءة الـstem وسرعة القرار. استخدام نفس الأسلوب للاختبارين يهدر وقتك في التدريب على مهارة أقل أهمية للاختبار الذي تستعد له فعلياً. الفروقات العملية موضحة في [[/guides/smle-vs-prometric-differences|دليل الفرق بين SMLE وPrometric]].' }],
                },
                { ad: true },
                {
                    heading: '6) قِس تقدّمك بثلاثة أرقام أسبوعياً',
                    blocks: [{ p: 'لا تقس تقدّمك بعدد الأسئلة المحلولة فقط. تابع أسبوعياً: نسبة الدقة في الجلسات المختلطة، متوسط الزمن لكل سؤال، وعدد الأخطاء المتكررة في نفس المحور. إذا كانت الثلاثة تتحسّن أسبوعاً بعد أسبوع، فأنت تستخدم بنك الأسئلة بالطريقة الصحيحة — بغض النظر عن عدد الأسئلة الكلي الذي حللته.' }],
                },
            ],
        },

        wrongQuestions: {
            kicker: 'Error Review Method',
            title: 'طريقة مراجعة الأسئلة الخاطئة: حوّل أخطاءك إلى نقاط قوة قبل SMLE',
            intro: 'كثير من الطلاب يحلّون مئات الأسئلة ومع ذلك تتكرر الأخطاء نفسها. السبب غالباً ليس قلة المذاكرة، بل ضعف منهجية المراجعة. هذا الدليل يشرح طريقة عملية لتحويل كل خطأ إلى قاعدة قرار سريرية تمنع تكراره.',
            sections: [
                {
                    heading: '1) صنّف الخطأ قبل أن تحفظ الإجابة',
                    blocks: [{ p: 'لا تكتفِ بقراءة الإجابة الصحيحة. اسأل: لماذا أخطأت؟ صنّف الخطأ إلى واحد من أربعة أنواع: نقص معرفي، أو سوء فهم للـstem، أو خطأ في استبعاد الخيارات، أو سوء إدارة وقت. هذا التصنيف مهم لأن علاج كل نوع مختلف.' }],
                },
                {
                    heading: '2) سجّل «إشارة القرار» بدل النص الطويل',
                    blocks: [{ p: 'بدل كتابة شرح طويل، اكتب جملة قصيرة تحدّد الإشارة السريرية التي تقود للإجابة. مثال: «progressive dyspnea + edema + orthopnea ← فكّر أولاً في heart failure pattern». هذه الإشارات تستدعيها داخل الاختبار أسرع بكثير من الفقرات المطوّلة.' }],
                },
                {
                    heading: '3) راجع الأخطاء بنظام التكرار المتباعد',
                    blocks: [{ p: 'راجع خطأ اليوم بعد 24 ساعة، ثم بعد 3 أيام، ثم بعد أسبوع. وإذا تكرر الخطأ نفسه مرتين، اجعله «أولوية حمراء» وخصّص له جلسة قصيرة مستقلة. الهدف أن ترى أخطاءك المتكررة تقلّ أسبوعاً بعد أسبوع.' }],
                },
                { ad: true },
                {
                    heading: '4) أنشئ قائمة «Top 20 Mistakes»',
                    blocks: [{ p: 'احتفظ بقائمة صغيرة تضم أكثر 20 خطأ تكراراً لديك، واقرأها قبل كل جلسة timed block. بهذه الطريقة تدخل الاختبار وعقلك مهيّأ لتجنّب أنماط خطئك أنت، لا لحفظ معلومات عامة فقط.' }],
                },
                {
                    heading: '5) اربط الخطأ بخطة عملية للجلسة القادمة',
                    blocks: [{ p: 'كل خطأ يجب أن ينتج إجراءً واضحاً: زيادة أسئلة موضوع معيّن، أو مراجعة مرجع مختصر، أو تدريب على قراءة الـstem. بدون هذا الإجراء تتحول مراجعة الأخطاء إلى نشاط نظري بلا أثر على أدائك الحقيقي.' }],
                },
            ],
        },

        vsPrometric: {
            kicker: 'SMLE vs Prometric',
            title: 'الفرق بين SMLE وPrometric: ما الذي يجب أن تغيّره في طريقة المذاكرة؟',
            intro: 'كثير من المتدرّبين يستخدمون الخطة نفسها لكل اختبار، ثم يتفاجؤون أن الأداء لا يعكس حجم الجهد. السبب أن SMLE وبرومترك يتقاطعان في المحتوى لكنهما يختلفان في صياغة الأسئلة، وتوزيع الصعوبة، وطريقة اختبار التفكير السريري. هذا الدليل يساعدك على تعديل تحضيرك عملياً.',
            sections: [
                {
                    heading: '1) التشابه: قاعدة معرفية مشتركة',
                    blocks: [{ p: 'يعتمد الاختباران على أساسيات الطب السريري: التشخيص التفريقي، واختيار الفحوصات، ثم اتخاذ القرار العلاجي المناسب. لذلك لا تحتاج خطة منفصلة بالكامل، بل خطة ذكية بنواة معرفية واحدة مع تعديلات حسب نمط كل اختبار.' }],
                },
                {
                    heading: '2) الاختلاف في نمط السؤال',
                    blocks: [{ p: 'في SMLE قد تواجه أسئلة تتطلب قراءة دقيقة للسياق وللتفاصيل الصغيرة في الـstem. أما في برومترك فالتركيز غالباً على القرار السريري المباشر تحت ضغط الوقت. والنتيجة: إذا كنت تتدرّب على الحفظ وحده أو على أسئلة قصيرة فقط، ستخسر درجات في التحليل.' }],
                },
                {
                    heading: '3) كيف تعدّل مذاكرتك حسب الهدف',
                    blocks: [
                        {
                            ul: [
                                'إذا كان هدفك SMLE: زد وقت قراءة السؤال وتحليل المفاتيح السريرية.',
                                'إذا كان هدفك برومترك: ركّز على سرعة القرار مع دقة ثابتة في الجلسات الزمنية.',
                                'في الحالتين: خصّص يومياً وقتاً لمراجعة الأخطاء المتكررة، لا لحل أسئلة جديدة فقط.',
                            ],
                        },
                    ],
                },
                { ad: true },
                {
                    heading: '4) إدارة الوقت داخل البلوك',
                    blocks: [{ p: 'أفضل طريقة هي المرور على الأسئلة في جولتين: الجولة الأولى للأسئلة المباشرة، والثانية للأسئلة التي تحتاج مقارنة بين خيارين. ولا تسمح لسؤال واحد بسحب وقت غير متوازن، لأن ذلك يضعف تركيزك في نهاية البلوك.' }],
                },
                {
                    heading: '5) خطة أسبوعية مختصرة للاختبارين',
                    blocks: [{ p: 'اعمل 3 أيام موضوعية (topic-focused) + يومين mixed blocks + يوم مراجعة أخطاء + يوم اختبار محاكاة. هذا التوزيع يحافظ على عمق الفهم ويدرّبك في الوقت نفسه على نمط الاختبار الحقيقي.' }],
                },
                {
                    heading: '6) متى تعرف أنك جاهز؟',
                    blocks: [{ p: 'عندما تلاحظ ثلاثة مؤشرات: ثبات الدقة في الجلسات المختلطة، وانخفاض الأخطاء المتكررة، وتحسّناً واضحاً في سرعة اتخاذ القرار. عندها تكون خطة تحضيرك مناسبة لنوع الاختبار، لا مجرد ساعات دراسة.' }],
                },
            ],
        },

        highYield: {
            kicker: 'High-Yield Topics',
            title: 'أهم مواضيع SMLE عالية العائد: كيف توزّع وقتك بذكاء؟',
            intro: 'المشكلة ليست قلّة المصادر، بل توزيع الوقت على مواضيع لا تعطي العائد نفسه في الدرجة. هذا الدليل يقدّم طريقة عملية لترتيب أولوياتك حتى تركّز على المواضيع الأعلى تأثيراً في أدائك.',
            sections: [
                {
                    heading: '1) ما معنى High-Yield فعلياً؟',
                    blocks: [{ p: 'الموضوع عالي العائد هو الذي يتكرر أكثر أو يرتبط بأنماط قرار سريري متعدّدة. لذلك لا تقيس أهمية الموضوع بعدد صفحاته، بل بعدد الأسئلة التي يمكن أن يولّدها وبمدى تأثيره على دقتك في الاختبار.' }],
                },
                {
                    heading: '2) أولويات مقترحة لمعظم المتدرّبين',
                    blocks: [
                        {
                            ul: [
                                'Internal Medicine: لأنه يغطي طيفاً واسعاً من الحالات الشائعة والحرجة.',
                                'Pediatrics: أسئلة متكررة تتطلّب انتباهاً للتفاصيل العمرية والجرعات.',
                                'OB/GYN: قرارات سريرية متسلسلة ومفاهيم عالية التكرار.',
                                'Surgery & Emergency: إدارة الحالات الحادة وترتيب التدخلات.',
                            ],
                        },
                    ],
                },
                {
                    heading: '3) نموذج توزيع أسبوعي حسب العائد',
                    blocks: [{ p: 'اجعل 60% من وقتك للمواضيع عالية العائد، و25% للمواضيع المتوسطة، و15% للأقل تكراراً. وراجع هذا التوزيع كل أسبوعين بناءً على نتائجك في الجلسات المختلطة، لا على انطباعك الشخصي.' }],
                },
                { ad: true },
                {
                    heading: '4) كيف تكتشف نقاط ضعفك الحقيقية؟',
                    blocks: [{ p: 'لا تعتمد على نسبة الإجابات الصحيحة العامة وحدها. تتبّع أداءك حسب الموضوع، ونوع الخطأ، وزمن الإجابة. فقد تكون دقتك جيدة لكن زمنك بطيء في محور معيّن، وهذا ينعكس سلباً يوم الاختبار.' }],
                },
                {
                    heading: '5) قاعدة 20/80 في بنك الأسئلة',
                    blocks: [{ p: 'عادةً يوجد عدد محدود من الأنماط السريرية يفسّر نسبة كبيرة من أخطائك المتكررة. حدّد هذه الأنماط مبكراً وخصّص لها مراجعة قصيرة متكررة؛ هذا يرفع دقتك أسرع من التنقّل العشوائي بين مواضيع كثيرة.' }],
                },
                {
                    heading: '6) قبل الاختبار بأسبوعين',
                    blocks: [{ p: 'خفّف إدخال مواضيع جديدة، وركّز على mixed blocks ومراجعة أخطاء high-yield. الهدف في هذه المرحلة تثبيت القرار السريري تحت الضغط، لا جمع معلومات جديدة بكثافة.' }],
                },
            ],
        },
    },

    en: {
        hub: {
            kicker: 'SMLE & SNLE Guides',
            title: 'Study guides for the SMLE, SNLE and Prometric exams',
            intro: 'A library for the deeper material: the official SNLE nursing blueprint, study plans, question-solving strategy, time management, and review methods — for doctors and nurses preparing for the Saudi Commission exams.',
            listLabel: 'Study guides',
            readMore: 'Read the full guide',
            notesTitle: 'How to get the most from these guides',
            notes: [
                'Start with a timeline that is realistic for the hours you actually have.',
                'Sitting the SNLE? Start from the official blueprint — the four sections carry fixed weights, and your week should carry the same ones.',
                'Pair every question session with an immediate review of your mistakes.',
                'Keep Internal Medicine, Surgery, Paediatrics and OB/GYN in balance.',
                'Do not measure progress in hours — measure it in the quality of your repetition and in better clinical decisions.',
            ],
            cards: [
                {
                    path: '/guides/snle-blueprint',
                    title: 'The SNLE blueprint: how the Saudi nursing licensing exam is built',
                    excerpt: 'What the SCFHS applicant guide actually says about the SNLE: how many questions, how the four sections are weighted, what score you need to pass, and how many attempts you get.',
                },
                {
                    path: '/guides/how-to-use-a-question-bank',
                    title: 'How to use a question bank to improve your SMLE & Prometric performance',
                    excerpt: 'Owning a large question bank does not raise your score by itself. A practical guide to using one in the right order — from an initial diagnostic to a full simulation.',
                },
                {
                    path: '/guides/smle-study-plan',
                    title: 'The 12-week SMLE plan: from zero to exam-ready',
                    excerpt: 'A clear week-by-week plan covering the core specialties, with a daily split between studying, reviewing mistakes and working through high-yield questions.',
                },
                {
                    path: '/guides/wrong-questions-method',
                    title: 'How to review wrong questions without repeating the same mistake',
                    excerpt: 'A practical method for building a smart error log and turning every mistake into a fixed diagnostic or management rule before exam day.',
                },
                {
                    path: '/guides/smle-vs-prometric-differences',
                    title: 'SMLE vs Prometric: what you should change in how you study',
                    excerpt: 'A practical comparison of question style, clinical reasoning and time management across the two exams, with a concrete plan to act on.',
                },
                {
                    path: '/guides/smle-high-yield-topics',
                    title: 'High-yield SMLE topics: how to spend your time wisely',
                    excerpt: 'A priority map of the topics that move your score most, with a weekly split that cuts wasted effort and lifts your accuracy.',
                },
            ],
        },

        // See the note on the Arabic snleBlueprint above. Written for the
        // internationally-trained nurses sitting the SNLE from outside Saudi
        // Arabia, who are the larger half of this page's likely readership and
        // the half least able to walk into a college and ask.
        snleBlueprint: {
            kicker: 'SNLE Blueprint',
            title: 'The SNLE blueprint: how the Saudi nursing licensing exam is built',
            intro: 'This guide sets out the Saudi Nursing Licensure Examination (SNLE) as the Saudi Commission for Health Specialties describes it in its own applicant guide: how many questions, how the four sections are weighted, what score you need, and how many attempts you get. Every figure here is transcribed from that document, and the last section names it so you can check it yourself.',
            sections: [
                {
                    heading: '1) The shape of the exam',
                    blocks: [
                        { p: 'The SNLE is **200 multiple-choice questions**, of which up to 10% may be unscored pilot items. It is split into **two parts of 100 questions, 120 minutes each**, with a scheduled 30-minute break between them.' },
                        { p: 'Every question has four options and one best answer. The paper mixes recall questions that test knowledge with scenario questions that test interpretation, analysis, decision-making, reasoning and problem-solving — which is why memorising alone does not carry you through it.' },
                    ],
                },
                {
                    heading: '2) The official blueprint',
                    blocks: [
                        { p: 'The exam is built from four sections with fixed weights. This is the map every form of the paper is assembled from:' },
                        {
                            ul: [
                                '**Adult Nursing — 40%**: medical nursing, surgical nursing, critical care nursing, community nursing, and mental/psychiatric nursing.',
                                '**Maternal-Child Nursing — 30%**: maternity nursing, gynecology, neonatal nursing, paediatric medical and paediatric surgical.',
                                '**Nursing Fundamentals — 20%**: fundamentals of nursing, professionalism, patient-centred care, evidence-based practice and research, leadership and management, quality and safety management, health education and promotion, communication and information technology, physical assessment, pharmacology, and basic sciences.',
                                '**Nursing Management and Leadership — 10%**: resources to support and coordinate patient care, quality and safe patient care at the frontline, nursing teams and interprofessional relations, nursing informatics for the safe and legal delivery of care, and research and evidence-based practice.',
                            ],
                        },
                        { p: 'The guide states its own tolerance: the distribution may differ by **up to ±5% in each level**. So Adult Nursing can appear anywhere between 35% and 45%, and Nursing Management and Leadership will never drop below 5%. That is a planning margin, not permission to skip a section.' },
                    ],
                },
                {
                    heading: '3) The pass mark and your attempts',
                    blocks: [
                        { p: '**The passing score is 500 on a 200–800 reporting scale.** It was set in April 2017 through a standard-setting exercise with a panel of 14 nurses, and approved by the Central Assessment Committee. It is a scaled score, not a percentage of questions answered correctly.' },
                        { p: 'One number worth getting right if you are comparing the two exams: **the SMLE pass mark for medicine is 560 on the same scale, not 500.** They are not interchangeable, and a good deal of second-hand advice online confuses them.' },
                        { p: 'On attempts: you may sit the SNLE **up to four times a year** from your first attempt until you pass. After passing, you are entitled to two further attempts to improve your mark for residency selection, and then one further attempt annually after a calendar year has passed since the second.' },
                        { p: 'You may not sit twice in the same testing window. If you do, the first dated result is the one announced; the second still counts as an attempt and its result is void.' },
                    ],
                },
                {
                    heading: '4) Who can apply, and how scheduling works',
                    blocks: [
                        { p: 'You need a **recognised primary degree (BSN or equivalent)** from an accredited health science programme, or to have started your internship year, or to be one year away from graduating. Students at Saudi universities and colleges may sit the SNLE in their final year.' },
                        { p: 'The sequence: apply through the e-application; a scheduling permit is issued with your eligibility period and reaches you by email; then book a seat at an SCFHS-approved Prometric centre, in Saudi Arabia or abroad. Scheduling is not available more than three months ahead, and fitting your attempts into the year is your responsibility, not the Commission’s.' },
                        { p: 'Results are not instant. Psychometric analysis runs during the window-closing period and **results are announced within two to six weeks of the end of a test window**. You receive two documents: a statement of results, and a feedback report comparing your performance with other candidates.' },
                    ],
                },
                {
                    heading: '5) Turning the blueprint into a study plan',
                    blocks: [
                        { p: 'The most useful thing you can do with a blueprint is spend your week by it. If you have ten study hours, the honest split is four on adult nursing, three on maternal-child, two on fundamentals and one on management and leadership. That is all the percentages mean in practice.' },
                        { p: '**The section almost everyone skips is management and leadership.** It is a tenth of the paper — roughly 20 questions — and most preparation material passes over it, because it is not a clinical specialty with an obvious bank of questions behind it. Study it as its own subject: delegation and who may be delegated to, prioritising between patients, incident reporting and quality, working with other professions, and nursing informatics and the confidentiality of the electronic record. One nursing-management textbook will do more for this section than another hundred clinical questions.' },
                        { p: 'For the clinical sections, what raises a score is solving questions and reviewing the wrong ones immediately, not solving alone — the method is set out in [[/guides/how-to-use-a-question-bank|the question-bank guide]] and [[/guides/wrong-questions-method|the wrong-questions guide]], and it applies to the SNLE exactly as it does to the SMLE.' },
                        { p: 'You can start without an account: [[/demo|try 20 questions]], or read the [[/questions|openly published questions]], each with a written explanation — including [[/questions/nursing-fundamentals|nursing fundamentals]], [[/questions/medical-surgical-nursing|medical-surgical nursing]] and [[/questions/maternal-and-newborn-nursing|maternal and newborn nursing]].' },
                    ],
                },
                {
                    heading: '6) Test day',
                    blocks: [
                        { p: 'Test centres open at 7:30 a.m. **If you are more than 30 minutes late against the time on your admission ticket, or absent, you will not be allowed to sit and it counts as an attempt** — unless you present documented grounds the supervising committee accepts.' },
                        { p: 'Bring your scheduling permit, on paper or on your phone, and unexpired identification: a passport, or a national/residence identity card inside Saudi Arabia. **The name on your ID must match the name on your permit exactly.** Arrive without either and you will not be admitted, and will pay a fee to reschedule within your eligibility period.' },
                        { p: 'Inside: a security check before you enter, repeated every time you return to the testing room after the break. You are given laminated writing surfaces and markers for notes and calculations, which you hand back at the end; writing on anything else can be recorded as irregular behaviour. Sessions are monitored in person and by audio and video.' },
                        { p: 'If you want a rehearsal closer to the real thing, SCFHS offers a mock test built on the same blueprint and sampled from the SNLE item bank, requested through its website.' },
                    ],
                },
                {
                    heading: '7) Where this comes from',
                    blocks: [
                        { p: 'All of the above is transcribed from the **Saudi Nursing Licensure Examination (SNLE) — Examination Content Guideline**, published by the Saudi Commission for Health Specialties, in the edition on the Commission’s website, read on 31 August 2026.' },
                        { p: 'SCFHS revises that guide from time to time — the previous edition differed from the current one in two sub-sections — so **before you apply, open the current applicant guide at scfhs.org.sa and check for yourself.** Any page on the internet, this one included, can lag behind the official document. This is not a substitute for it.' },
                    ],
                },
            ],
        },

        studyPlan: {
            kicker: 'SMLE Study Plan',
            title: 'The 12-week SMLE plan: a study programme you can actually follow',
            intro: 'This guide is written for doctors and medical students who want a clear plan for the SCFHS licensing exam. The aim is not to study at random, but to turn every week into something measurable: higher accuracy, less time per question, and stronger clinical reasoning in diagnosis and management.',
            sections: [
                {
                    heading: '1) Split the weeks into phases',
                    blocks: [{ p: 'Divide your preparation into three phases: foundation, speed, and exam simulation. In the foundation phase (weeks 1–4), focus on the highest-frequency topics in Internal Medicine and Paediatrics while reviewing the principles of OB/GYN and Surgery. In the speed phase (weeks 5–8), increase your daily question volume and start timed sets. In the simulation phase (weeks 9–12), make most of your study full-length exams, with a careful analysis after every attempt.' }],
                },
                {
                    heading: '2) What an effective study day looks like',
                    blocks: [{ p: 'An effective day has three blocks: a short learning block, a question block, and an error-review block. In practice: 45 minutes of focused reference review, then 40 to 60 questions under time, then 60 minutes analysing your mistakes. Do not move on to a new topic before you have written down why you got it wrong — a knowledge gap, a misread stem, or rushing the elimination of options.' }],
                },
                {
                    heading: '3) Reviewing a wrong question so it does not come back',
                    blocks: [{ p: 'Every wrong question should produce a note you can actually use later. Write the key clinical sentence that should have pointed you to the right answer, then write a short decision rule. For example: if the stem mentions a red flag plus rapid progression, a specific diagnosis or intervention takes priority over the secondary detail. That way the mistake becomes a clear trigger rather than a fact to memorise.' }],
                },
                { ad: true },
                {
                    heading: '4) Managing time inside the exam',
                    blocks: [{ p: 'The realistic goal is a steady average per question with room for a final review. Use the single-pass rule: answer the straightforward questions immediately, flag the ones you are unsure about, and come back to them on a second pass. Never let one question take two minutes or more without a decision — it squeezes you at the end of the block and multiplies careless errors.' }],
                },
                {
                    heading: '5) A short weekly plan (adapt it to your own time)',
                    blocks: [
                        {
                            ul: [
                                'Saturday–Monday: one main topic plus targeted question sessions.',
                                'Tuesday: review the mistakes you have accumulated and build your high-yield list.',
                                'Wednesday–Thursday: mixed blocks, to simulate the real thing.',
                                'Friday: a short exam, a performance review, and adjustments to next week’s plan.',
                            ],
                        },
                        { p: 'Consistency beats perfection. Even with limited hours, sticking to a clear plan for 12 weeks produces a better result than studying in bursts with no real measurement of performance.' },
                    ],
                },
                {
                    heading: '6) Signs you are ready before exam day',
                    blocks: [{ p: 'Watch three indicators: stable accuracy in mixed sets, a fall in repeated errors within the same areas, and consistent time management across more than one full simulation. If those are improving week to week you are on track, even if some gaps remain in specific topics.' }],
                },
            ],
        },

        howToUseBank: {
            kicker: 'Question Bank Strategy',
            title: 'How to Use a Question Bank to Improve Your SMLE & Prometric Performance',
            intro: 'Owning a large question bank does not raise your score by itself — how you use it does: what order you solve in, how you review, and whether each session turns into a measured improvement rather than just a question count. This guide lays out the core steps, with links to each topic in depth.',
            sections: [
                {
                    heading: '1) Start with a diagnostic block, not a plan',
                    blocks: [{ p: 'Before committing to a study schedule, work through one mixed block of 40 to 60 questions spanning several specialties at once. The goal is not the score — it is finding your real weak areas before you build a plan on top of them. Then structure your schedule around that result instead of splitting your time evenly across topics, as in the [[/guides/smle-study-plan|12-week SMLE plan]].' }],
                },
                {
                    heading: '2) Practise under real exam conditions',
                    blocks: [{ p: 'Questions solved with no time limit and no sustained focus train habits that will not serve you on exam day. Use timed sets matching the real exam’s question count and time, without pausing mid-block. That alone surfaces time-management problems that never show up in casual, untimed practice.' }],
                },
                {
                    heading: '3) Treat every question — right or wrong — as data',
                    blocks: [{ p: 'A correct answer reached by guessing, or after hesitating between two options, carries the same learning value as a wrong one. Log it and review it with the same seriousness. For a full system for classifying mistakes and turning them into fixed decision rules, see the [[/guides/wrong-questions-method|wrong-questions review guide]].' }],
                },
                { ad: true },
                {
                    heading: '4) Weight your questions by yield, not evenly',
                    blocks: [{ p: 'Do not solve the same number of questions in every topic. High-frequency topics deserve a larger share of your question-bank time, and rare ones deserve only a light pass. The details of that split, and how to find your own priorities, are in the [[/guides/smle-high-yield-topics|high-yield topics guide]].' }],
                },
                {
                    heading: '5) Adjust your approach to the exam you are sitting',
                    blocks: [{ p: 'The optimal way to work through questions differs slightly between the SMLE and Prometric, in how deeply you read the stem and how fast you need to decide. Using the same approach for both wastes time training a skill that matters less for the exam you are actually preparing for. The practical differences are set out in the [[/guides/smle-vs-prometric-differences|SMLE vs Prometric guide]].' }],
                },
                { ad: true },
                {
                    heading: '6) Track three numbers every week',
                    blocks: [{ p: 'Do not measure progress by question count alone. Track weekly: your accuracy in mixed sessions, your average time per question, and how many mistakes repeat within the same topic. If all three are improving week over week, you are using the question bank the right way — regardless of the total number of questions solved.' }],
                },
            ],
        },

        wrongQuestions: {
            kicker: 'Error Review Method',
            title: 'How to review wrong questions: turn your mistakes into strengths before the SMLE',
            intro: 'Many students work through hundreds of questions and still make the same mistakes. The cause is usually not a lack of studying — it is a weak review method. This guide sets out a practical way to turn every mistake into a clinical decision rule that stops it recurring.',
            sections: [
                {
                    heading: '1) Classify the mistake before you memorise the answer',
                    blocks: [{ p: 'Do not simply read the correct answer. Ask why you got it wrong, and classify the mistake into one of four types: a knowledge gap, a misread stem, a bad elimination of options, or poor time management. The classification matters, because each type has a different fix.' }],
                },
                {
                    heading: '2) Record the “decision signal”, not a long explanation',
                    blocks: [{ p: 'Instead of writing a long note, write one short sentence naming the clinical signal that leads to the answer. For example: “progressive dyspnoea + oedema + orthopnoea → think heart failure pattern first”. Signals like that come back to you inside the exam far faster than paragraphs.' }],
                },
                {
                    heading: '3) Review mistakes on a spaced-repetition schedule',
                    blocks: [{ p: 'Review today’s mistake after 24 hours, then after 3 days, then after a week. If the same mistake recurs twice, make it a “red priority” and give it its own mini-session. The aim is to watch your repeated errors shrink week by week.' }],
                },
                { ad: true },
                {
                    heading: '4) Build a “Top 20 Mistakes” list',
                    blocks: [{ p: 'Keep a short list of your 20 most frequent mistakes, and read it before every timed block. That way you go into the exam primed to avoid your own error patterns, rather than just holding general facts in your head.' }],
                },
                {
                    heading: '5) Tie every mistake to an action for the next session',
                    blocks: [{ p: 'Each mistake should produce a clear action: more questions in a specific topic, a short reference review, or practice at reading the stem. Without that action, reviewing errors becomes a theoretical exercise with no effect on real performance.' }],
                },
            ],
        },

        vsPrometric: {
            kicker: 'SMLE vs Prometric',
            title: 'SMLE vs Prometric: what you should change in how you study',
            intro: 'Many candidates use the same plan for every exam, then find their performance does not reflect the effort. The reason is that the SMLE and Prometric overlap in content but differ in how questions are written, how difficulty is distributed, and how they test clinical reasoning. This guide helps you adjust your preparation in practical terms.',
            sections: [
                {
                    heading: '1) The overlap: a shared knowledge base',
                    blocks: [{ p: 'Both exams rest on the fundamentals of clinical medicine: the differential diagnosis, choosing investigations, and then making the right management decision. So you do not need two entirely separate plans — you need one smart plan with a single knowledge core and adjustments for each exam’s style.' }],
                },
                {
                    heading: '2) The difference in question style',
                    blocks: [{ p: 'In the SMLE you will meet questions that demand careful reading of the context and the small details in the stem. In Prometric the emphasis is usually on the direct clinical decision under time pressure. The consequence: if you only train on memorisation, or only on short questions, you will lose marks on analysis.' }],
                },
                {
                    heading: '3) Adjusting your study to your target',
                    blocks: [
                        {
                            ul: [
                                'If your target is the SMLE: spend more time reading the question and analysing the clinical clues.',
                                'If your target is Prometric: focus on decision speed while holding your accuracy steady in timed sessions.',
                                'In both cases: set aside time every day for reviewing recurring mistakes, not just for new questions.',
                            ],
                        },
                    ],
                },
                { ad: true },
                {
                    heading: '4) Managing time inside the block',
                    blocks: [{ p: 'The best approach is two passes: the first for the straightforward questions, the second for the ones that need a comparison between two options. Never let a single question take a disproportionate share of your time — it weakens your concentration at the end of the block.' }],
                },
                {
                    heading: '5) A short weekly plan for either exam',
                    blocks: [{ p: 'Run 3 topic-focused days + 2 days of mixed blocks + 1 error-review day + 1 simulation day. That split keeps your understanding deep while training you on the real exam format at the same time.' }],
                },
                {
                    heading: '6) How do you know you are ready?',
                    blocks: [{ p: 'When you see three indicators: stable accuracy in mixed sessions, fewer repeated mistakes, and a clear improvement in decision speed. At that point your preparation actually fits the exam, rather than just adding up study hours.' }],
                },
            ],
        },

        highYield: {
            kicker: 'High-Yield Topics',
            title: 'High-yield SMLE topics: how to spend your time wisely',
            intro: 'The problem is not a shortage of resources — it is spending your time on topics that do not pay back the same number of marks. This guide gives you a practical way to order your priorities so you focus on what actually moves your score.',
            sections: [
                {
                    heading: '1) What “high-yield” really means',
                    blocks: [{ p: 'A high-yield topic is one that recurs more often, or that connects to several patterns of clinical decision-making. So do not judge a topic’s importance by its page count — judge it by how many questions it can generate and how much it affects your accuracy in the exam.' }],
                },
                {
                    heading: '2) Suggested priorities for most candidates',
                    blocks: [
                        {
                            ul: [
                                'Internal Medicine: it covers a wide spectrum of common and critical presentations.',
                                'Paediatrics: frequent questions that demand attention to age-specific detail and dosing.',
                                'OB/GYN: sequential clinical decisions and high-frequency concepts.',
                                'Surgery & Emergency: managing acute presentations and sequencing interventions.',
                            ],
                        },
                    ],
                },
                {
                    heading: '3) A weekly split weighted by yield',
                    blocks: [{ p: 'Give 60% of your time to high-yield topics, 25% to mid-tier ones and 15% to the least frequent. Revisit the split every two weeks based on your results in mixed sessions, not on how you feel you are doing.' }],
                },
                { ad: true },
                {
                    heading: '4) Finding your real weak spots',
                    blocks: [{ p: 'Do not rely on your overall percentage alone. Track your performance by topic, by type of mistake, and by time per question. Your accuracy in an area can look fine while your speed there is slow — and that shows up badly on exam day.' }],
                },
                {
                    heading: '5) The 20/80 rule in a question bank',
                    blocks: [{ p: 'Usually a limited set of clinical patterns explains a large share of your repeated mistakes. Identify those patterns early and give them short, frequent review; that lifts your accuracy faster than moving randomly between many topics.' }],
                },
                {
                    heading: '6) The last two weeks',
                    blocks: [{ p: 'Ease off introducing new topics and concentrate on mixed blocks and reviewing high-yield errors. At this stage the goal is to lock in clinical decision-making under pressure, not to pile on new information.' }],
                },
            ],
        },
    },
};

export default guidesCopy;
