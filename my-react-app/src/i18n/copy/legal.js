/**
 * The legal documents and the About page, as structured data.
 *
 * Rendered by components/legal/LegalDoc.jsx. Inline markup: `**bold**` and
 * `[[/path|label]]` (or `[[https://…|label]]` for external links).
 *
 * The Arabic is a real translation of the legal text, not a gloss: these pages
 * previously showed English and Arabic stacked paragraph-by-paragraph, which is
 * unreadable in either language. The company name, commercial registration
 * number, contact details, and the names SMLE / SNLE / SCFHS / Prometric /
 * Moyasar / Google AdSense / GDPR / CCPA stay as they are in both versions.
 */

const CONTACT_EMAIL = 'alshraky3@gmail.com';
const CONTACT_WHATSAPP = '+966 58 261 9119';

const legalCopy = {
    ar: {
        terms: {
            title: 'شروط الاستخدام',
            updated: 'آخر تحديث: يناير 2026',
            sections: [
                {
                    heading: '1. قبول الشروط',
                    blocks: [{ p: 'باستخدامك منصة SMLE Question Bank («الخدمة») فإنك تقبل الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق عليها، فيرجى عدم استخدام الخدمة.' }],
                },
                {
                    heading: '2. وصف الخدمة',
                    blocks: [
                        { p: 'SMLE Question Bank منصة تعليمية تساعد الأطباء وطلاب الطب والتمريض على التحضير لاختبار الترخيص السعودي (SMLE) واختبار التمريض (SNLE). تقدّم الخدمة:' },
                        {
                            ul: [
                                'بنك أسئلة شامل يُحدَّث باستمرار',
                                'اختبارات تدريبية واختبارات محاكية',
                                'تحليلات أداء وتتبّعاً للتقدّم',
                                'محتوى دراسي مرتّب حسب التخصص',
                            ],
                        },
                    ],
                },
                {
                    heading: '3. حسابات المستخدمين',
                    blocks: [
                        { p: 'للوصول إلى بعض مزايا الخدمة يلزمك إنشاء حساب. وأنت توافق على:' },
                        {
                            ul: [
                                'تقديم معلومات صحيحة وكاملة عند التسجيل',
                                'الحفاظ على سرّية كلمة المرور وبيانات حسابك',
                                'إبلاغنا فوراً بأي استخدام غير مصرّح به لحسابك',
                                'تحمّل المسؤولية عن كل نشاط يتم عبر حسابك',
                            ],
                        },
                    ],
                },
                {
                    heading: '4. الاستخدام المقبول',
                    blocks: [
                        { p: 'أنت توافق على عدم:' },
                        {
                            ul: [
                                'استخدام الخدمة لأي غرض مخالف للقانون',
                                'مشاركة بيانات دخولك مع الآخرين',
                                'نسخ محتوانا أو إعادة إنتاجه أو توزيعه دون إذن',
                                'تعطيل الخدمة أو خوادمها أو التشويش عليها',
                                'استخدام أدوات آلية للوصول إلى الخدمة دون إذن',
                                'انتحال شخصية أي فرد أو جهة',
                            ],
                        },
                    ],
                },
                {
                    heading: '5. الملكية الفكرية',
                    blocks: [
                        { p: 'كل ما تحتويه المنصة — بما في ذلك الأسئلة والتفسيرات والرسوم والشعارات والبرمجيات — مملوك لـ SMLE Question Bank أو لمزوّدي محتواها، ومحميّ بقوانين الملكية الفكرية.' },
                        { p: 'لا يجوز لك نسخ أي محتوى أو توزيعه أو تعديله أو اشتقاق أعمال منه دون إذن كتابي مسبق منّا.' },
                    ],
                },
                {
                    heading: '6. إخلاء مسؤولية تعليمي',
                    blocks: [
                        { p: 'المحتوى المقدَّم في المنصة لأغراض تعليمية ومعلوماتية فقط. ورغم حرصنا على دقّته وتحديثه:' },
                        {
                            ul: [
                                'لسنا تابعين لشركة Prometric أو الهيئة السعودية للتخصصات الصحية (SCFHS) أو أي جهة ترخيص رسمية',
                                'أسئلتنا مواد تدريبية وقد لا تطابق محتوى الاختبار الفعلي',
                                'النجاح على منصتنا لا يضمن النجاح في اختبار SMLE الفعلي',
                                'على المستخدم التحقق من المعلومات عبر المصادر الرسمية',
                            ],
                        },
                    ],
                },
                {
                    heading: '7. الإعلانات',
                    blocks: [{ p: 'قد تعرض الخدمة إعلانات من أطراف ثالثة، من بينها Google AdSense. نحن غير مسؤولين عن محتوى هذه الإعلانات، وأي تعامل بينك وبين المعلن هو مسؤوليتكما وحدكما.' }],
                },
                {
                    heading: '8. حدود المسؤولية',
                    blocks: [{ p: 'إلى أقصى حدّ يسمح به النظام، لا تتحمّل SMLE Question Bank أي مسؤولية عن أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو تأديبية، ولا عن أي خسارة في الأرباح أو الإيرادات أو البيانات أو السمعة، سواء وقعت بشكل مباشر أو غير مباشر.' }],
                },
                {
                    heading: '9. الاشتراك والدفع',
                    blocks: [
                        { p: 'تعمل الخدمة بنظام مجاني محدود مع اشتراكات مدفوعة اختيارية:' },
                        {
                            ul: [
                                'يحصل كل حساب جديد على **40 سؤالاً مجانياً** مدى الحياة، بالإضافة إلى **أول درس من كل تخصص** في الملخصات، ويبقى ذلك متاحاً دون حد زمني.',
                                'استنفاد الأسئلة المجانية **لا يُغلق الحساب**: يظل بإمكانك تسجيل الدخول والاطلاع على تحليلاتك وتقدّمك ودروسك المجانية، ويقتصر الأثر على عدم إمكانية بدء اختبارات جديدة.',
                                'الاشتراكات الفردية: **50 ريالاً سعودياً للشهر**، أو **129 ريالاً لأربعة أشهر**، أو **300 ريال للسنة**.',
                                'الاشتراكات الجماعية: **250 ريالاً لثلاثة حسابات** أو **299 ريالاً لخمسة حسابات**، ومدتها أربعة أشهر. يُفعَّل حساب المشتري مباشرة، ويحصل على روابط دعوة أحادية الاستخدام لبقية المقاعد. وتنتهي جميع مقاعد المجموعة في تاريخ واحد يُحدَّد وقت الشراء، ولا يمدّد استخدام أي رابط هذا التاريخ.',
                                'جميع الخطط **دفعة واحدة ولا تتجدّد تلقائياً**. لا نحفظ بيانات بطاقتك لخصم لاحق، ولن يُخصم منك أي مبلغ ما لم تقم بعملية شراء جديدة بنفسك.',
                                'المستخدمون الذين سجّلوا قبل تفعيل الاشتراك المدفوع يحتفظون بوصولهم المجاني.',
                                'الحسابات التي ينشئها المشرفون معفاة من رسوم الاشتراك.',
                                'يخضع الاسترجاع، حيثما ينطبق، لـ[[/refund-policy|سياسة الاسترجاع]] الخاصة بنا.',
                            ],
                        },
                        { p: 'تُعالَج المدفوعات بشكل آمن عبر ميسر، وهي بوابة دفع سعودية مرخّصة. نحن لا نخزّن بيانات بطاقتك كاملةً على خوادمنا.' },
                    ],
                },
                {
                    heading: '10. تعديل الخدمة',
                    blocks: [{ p: 'نحتفظ بالحق في تعديل الخدمة أو تعليقها أو إيقافها (كلياً أو جزئياً) في أي وقت، بإشعار أو بدونه، ودون أن نتحمّل مسؤولية تجاهك أو تجاه أي طرف ثالث نتيجة ذلك.' }],
                },
                {
                    heading: '11. إنهاء الحساب',
                    blocks: [{ p: 'يجوز لنا إيقاف حسابك أو إنهاء وصولك إلى الخدمة فوراً، دون إشعار مسبق أو مسؤولية، لأي سبب — بما في ذلك مخالفة هذه الشروط.' }],
                },
                {
                    heading: '12. تعديل الشروط',
                    blocks: [{ p: 'نحتفظ بالحق في تحديث هذه الشروط في أي وقت، وسننشر إشعاراً على الموقع عند إجراء تغييرات جوهرية. استمرارك في استخدام الخدمة بعد التغيير يُعدّ قبولاً بالشروط الجديدة.' }],
                },
                {
                    heading: '13. القانون الواجب التطبيق',
                    blocks: [{ p: 'تخضع هذه الشروط لأنظمة المملكة العربية السعودية وتُفسَّر وفقاً لها، دون اعتبار لقواعد تنازع القوانين.' }],
                },
                {
                    heading: '14. للتواصل',
                    blocks: [
                        { p: 'إذا كان لديك أي سؤال حول هذه الشروط، تواصل معنا:' },
                        { p: `**البريد الإلكتروني:** ${CONTACT_EMAIL}` },
                        { p: `**واتساب:** ${CONTACT_WHATSAPP}` },
                        { p: '**الكيان القانوني:** شركة دار الخبرة التجارية' },
                        { p: '**السجل التجاري:** 7040567922' },
                    ],
                },
            ],
        },

        refund: {
            title: 'سياسة الاسترجاع',
            updated: 'آخر تحديث: يونيو 2026',
            sections: [
                {
                    heading: '1. الاشتراك',
                    blocks: [{ p: 'تقدّم SQB اشتراكاً مدفوعاً بثلاث مدد — **شهري، 4 أشهر، وسنوي** — بالأسعار المعروضة عند الاشتراك. أما المستخدمون الذين سجّلوا قبل تفعيل الاشتراك المدفوع والحسابات التي أنشأها المشرفون، فيحتفظون بوصولهم المجاني ولا تُحتسب عليهم أي رسوم.' }],
                },
                {
                    heading: '2. شروط الاسترجاع',
                    blocks: [
                        { p: 'مهلة الاسترجاع الكامل تتناسب مع مدة الخطة نفسها، حتى لا تسمح خطة قصيرة باسترجاع شبه كامل بعد استخدامها كاملاً تقريباً:' },
                        {
                            ul: [
                                '**الخطة الشهرية:** يمكن طلب استرجاع كامل خلال **3 أيام** من تاريخ الشراء فقط.',
                                '**خطة 4 أشهر والخطة السنوية:** يمكن طلب استرجاع كامل خلال **14 يوماً** من تاريخ الشراء.',
                                'في جميع الحالات، يجب أن يكون طلب الاسترجاع بحسن نيّة، وطلبات الاسترجاع بعد انتهاء المهلة المذكورة أعلاه غير مؤهّلة عادةً، إلا في الحالات التي يوجبها نظام حماية المستهلك السعودي.',
                                'يمكن إلغاء التجديد في أي وقت لمنع أي خصم مستقبلي؛ والإلغاء يوقف التجديد التالي ولا يسترجع قيمة الفترة الجارية بأثر رجعي.',
                                'الحسابات التي حصلت على وصول مجاني (المستخدمون السابقون والحسابات التي أنشأها المشرفون) لا تُحتسب عليها رسوم، وبالتالي لا تنطبق عليها سياسة الاسترجاع.',
                            ],
                        },
                    ],
                },
                {
                    heading: '3. كيف تطلب الاسترجاع',
                    blocks: [{ p: 'يمكن إرسال طلبات الاسترجاع عبر البريد الإلكتروني أو واتساب باستخدام بيانات التواصل أدناه. يرجى ذكر بريد حسابك وتاريخ الشراء التقريبي. نسعى للرد خلال 5 أيام عمل.' }],
                },
                {
                    heading: '4. معالجة المدفوعات',
                    blocks: [{ p: 'تُعالَج المدفوعات بشكل آمن عبر ميسر، وهي بوابة دفع سعودية مرخّصة. نحن لا نخزّن بيانات بطاقتك كاملةً على خوادمنا.' }],
                },
                {
                    heading: '5. القانون الواجب التطبيق',
                    blocks: [{ p: 'تخضع سياسة الاسترجاع هذه لأنظمة المملكة العربية السعودية وتُفسَّر وفقاً لها.' }],
                },
                {
                    heading: '6. للتواصل',
                    blocks: [
                        { p: 'لطلبات الاسترجاع أو الاستفسار عن هذه السياسة، تواصل معنا:' },
                        { p: `**البريد الإلكتروني:** ${CONTACT_EMAIL}` },
                        { p: `**واتساب:** ${CONTACT_WHATSAPP}` },
                        { p: '**الكيان القانوني:** شركة دار الخبرة التجارية' },
                        { p: '**السجل التجاري:** 7040567922' },
                        { p: 'اطّلع أيضاً على [[/terms|شروط الاستخدام]] و[[/privacy|سياسة الخصوصية]].' },
                    ],
                },
            ],
        },

        privacy: {
            title: 'سياسة الخصوصية',
            updated: 'آخر تحديث: فبراير 2026',
            sections: [
                {
                    heading: '1. مقدمة',
                    blocks: [
                        { p: 'مرحباً بك في SMLE Question Bank («SQB» أو «نحن»). نلتزم بحماية معلوماتك الشخصية وحقك في الخصوصية. توضّح هذه السياسة كيف نجمع معلوماتك ونستخدمها ونفصح عنها ونحميها عند زيارتك لموقعنا (www.smle-question-bank.com) واستخدامك لخدماتنا.' },
                    ],
                },
                {
                    heading: '2. المعلومات التي نجمعها',
                    blocks: [
                        { h3: 'المعلومات الشخصية' },
                        { p: 'قد نجمع معلومات شخصية تقدّمها لنا طوعاً عند:' },
                        {
                            ul: [
                                'إنشاء حساب (الاسم والبريد الإلكتروني)',
                                'استخدام الاختبارات والتدريب (بيانات الأداء)',
                                'التواصل معنا عبر نموذج الاتصال',
                                'الاشتراك في خدماتنا',
                            ],
                        },
                        { p: 'وقد تشمل هذه المعلومات:' },
                        {
                            ul: [
                                'الاسم وعنوان البريد الإلكتروني',
                                'اسم المستخدم وكلمة المرور',
                                'بيانات أدائك وتقدّمك في الاختبارات',
                                'رقم الجوال أو واتساب (إن قدّمته)',
                            ],
                        },
                        { h3: 'المعلومات المجمَّعة تلقائياً' },
                        { p: 'عند دخولك موقعنا قد نجمع تلقائياً معلومات عن جهازك، منها نوع المتصفح وعنوان IP والمنطقة الزمنية وبعض ملفات تعريف الارتباط المخزّنة على جهازك. كما نجمع معلومات عن الصفحات التي تزورها، والموقع أو عبارة البحث التي أوصلتك إلينا، وكيفية تفاعلك مع الموقع.' },
                    ],
                },
                {
                    heading: '3. كيف نستخدم معلوماتك',
                    blocks: [
                        { p: 'نستخدم المعلومات التي نجمعها من أجل:' },
                        {
                            ul: [
                                'إنشاء حسابك وإدارته',
                                'تقديم تجربة اختبارات مخصّصة وتتبّع تقدّمك',
                                'تحليل خدماتنا ومحتوانا وتحسينهما',
                                'التواصل معك بشأن التحديثات والمزايا الجديدة',
                                'عرض إعلانات مناسبة عبر Google AdSense',
                                'الحماية من الاحتيال والنشاط غير المصرّح به',
                                'الالتزام بالمتطلبات النظامية',
                            ],
                        },
                        { p: '**الأساس النظامي للمعالجة (GDPR):** نعالج بياناتك الشخصية استناداً إلى:' },
                        {
                            ul: [
                                '**الموافقة:** عند موافقتك على استخدام ملفات تعريف الارتباط والإعلانات المخصّصة',
                                '**العقد:** لتقديم الخدمات التي اشتركت فيها',
                                '**المصلحة المشروعة:** لتحسين المنصة ومنع الاحتيال',
                            ],
                        },
                    ],
                },
                {
                    heading: '4. الإعلانات وخدمات الأطراف الثالثة',
                    blocks: [
                        { p: 'نستخدم **Google AdSense** لعرض الإعلانات على موقعنا. ويستخدم AdSense ملفات تعريف الارتباط وإشارات الويب لعرض إعلانات بناءً على زياراتك السابقة لموقعنا أو لمواقع أخرى على الإنترنت.' },
                        { p: '**ملف DoubleClick DART من Google:** تستخدم Google، بصفتها طرفاً ثالثاً، ملف DART لعرض إعلانات لزوّار موقعنا بناءً على زياراتهم لموقعنا ولمواقع أخرى. ويمكن للمستخدمين إلغاء الاشتراك في هذا الملف عبر سياسة خصوصية شبكة إعلانات ومحتوى Google.' },
                        { p: 'يستخدم مزوّدو الأطراف الثالثة، ومنهم Google، ملفات تعريف الارتباط لعرض إعلانات بناءً على زيارات المستخدم السابقة لموقعنا أو لمواقع أخرى.' },
                        { p: 'يمكنك إلغاء الاشتراك في الإعلانات المخصّصة عبر:' },
                        {
                            ul: [
                                '[[https://www.google.com/settings/ads|إعدادات إعلانات Google]]',
                                '[[https://policies.google.com/technologies/ads|خصوصية وشروط Google — الإعلانات]]',
                                '[[https://optout.networkadvertising.org/|صفحة إلغاء الاشتراك في Network Advertising Initiative]]',
                                '[[https://optout.aboutads.info/|صفحة إلغاء الاشتراك في Digital Advertising Alliance]]',
                            ],
                        },
                        { p: 'لمزيد من المعلومات عن كيفية استخدام Google للبيانات، راجع [[https://policies.google.com/privacy|سياسة خصوصية Google]].' },
                    ],
                },
                {
                    heading: '5. ملفات تعريف الارتباط وتقنيات التتبّع',
                    blocks: [
                        { p: 'نستخدم ملفات تعريف الارتباط وتقنيات تتبّع مشابهة لتتبّع النشاط على موقعنا وتخزين بعض المعلومات. أنواع الملفات التي نستخدمها:' },
                        {
                            ul: [
                                '**الملفات الأساسية:** لازمة لعمل الموقع بشكل صحيح (مثل تسجيل الدخول وإدارة الجلسة)',
                                '**ملفات التحليلات:** تساعدنا على فهم كيفية تفاعل الزوّار مع الموقع',
                                '**ملفات الإعلانات:** تستخدمها Google AdSense وشركاؤها لعرض إعلانات مناسبة لسلوك تصفّحك',
                                '**ملفات التفضيلات:** تحفظ إعداداتك وتفضيلاتك (مثل لغة الواجهة)',
                            ],
                        },
                        { p: 'يمكنك ضبط متصفحك لرفض كل ملفات تعريف الارتباط أو لتنبيهك عند إرسال أحدها. لكن إذا لم تقبلها فقد لا تعمل بعض مزايا الموقع بشكل صحيح.' },
                        { p: '**موافقة ملفات تعريف الارتباط:** نعرض شريط موافقة عند زيارتك الأولى للموقع، ويمكنك قبول جميع الملفات أو الملفات الضرورية فقط. ويمكنك تغيير تفضيلاتك في أي وقت بحذف ملفات المتصفح ثم إعادة زيارة الموقع.' },
                    ],
                },
                {
                    heading: '6. الاحتفاظ بالبيانات',
                    blocks: [
                        { p: 'نحتفظ بمعلوماتك الشخصية طالما ظلّ حسابك نشطاً أو بالقدر اللازم لتقديم خدماتنا. وتحديداً:' },
                        {
                            ul: [
                                '**بيانات الحساب:** تُحفظ حتى تطلب حذف حسابك',
                                '**بيانات الأداء في الاختبارات:** تُحفظ طوال مدة وجود حسابك',
                                '**بيانات ملفات تعريف الارتباط:** تُحفظ ملفات الإعلانات عادةً حتى 13 شهراً',
                                '**بيانات نموذج الاتصال:** تُحفظ حتى 12 شهراً',
                            ],
                        },
                    ],
                },
                {
                    heading: '7. أمن البيانات',
                    blocks: [{ p: 'نطبّق إجراءات أمنية تقنية وتنظيمية مناسبة لحماية معلوماتك الشخصية، بما في ذلك النقل الآمن للبيانات. ومع ذلك، لا توجد وسيلة نقل عبر الإنترنت أو تخزين إلكتروني آمنة بنسبة 100%.' }],
                },
                {
                    heading: '8. حقوقك',
                    blocks: [
                        { h3: 'لجميع المستخدمين' },
                        {
                            ul: [
                                'الوصول إلى بياناتك الشخصية',
                                'تصحيح البيانات غير الدقيقة',
                                'طلب حذف بياناتك',
                                'الاعتراض على معالجة بياناتك',
                                'إلغاء الاشتراك في الإعلانات المخصّصة',
                            ],
                        },
                        { h3: 'حقوق GDPR (مستخدمو الاتحاد الأوروبي)' },
                        { p: 'إذا كنت مقيماً في المنطقة الاقتصادية الأوروبية، فلك حقوق إضافية:' },
                        {
                            ul: [
                                '**حق نقل البيانات:** طلب نسخة من بياناتك بصيغة قابلة للنقل',
                                '**حق التقييد:** طلب تقييد معالجة بياناتك',
                                '**حق سحب الموافقة:** سحب موافقتك في أي وقت',
                                '**حق تقديم شكوى:** رفع شكوى إلى هيئة حماية البيانات المحلية لديك',
                            ],
                        },
                        { h3: 'حقوق CCPA (مستخدمو كاليفورنيا)' },
                        { p: 'إذا كنت مقيماً في كاليفورنيا، فلك الحق في:' },
                        {
                            ul: [
                                'معرفة المعلومات الشخصية التي نجمعها عنك',
                                'معرفة ما إذا كانت معلوماتك الشخصية تُباع أو يُفصح عنها',
                                'رفض بيع معلوماتك الشخصية',
                                'الوصول إلى معلوماتك الشخصية',
                                'الحصول على الخدمة نفسها والسعر نفسه حتى عند ممارستك لحقوق الخصوصية',
                            ],
                        },
                    ],
                },
                {
                    heading: '9. خصوصية الأطفال',
                    blocks: [{ p: 'خدمتنا غير موجّهة للأطفال دون سن 13 عاماً، ولا نجمع معلومات شخصية منهم عن قصد. وإذا اكتشفنا أن طفلاً دون 13 عاماً قدّم لنا معلومات شخصية، فسنحذفها فوراً.' }],
                },
                {
                    heading: '10. نقل البيانات دولياً',
                    blocks: [{ p: 'قد تُنقل معلوماتك وتُحفظ على خوادم خارج بلد إقامتك. ونحرص على وجود ضمانات كافية لحماية بياناتك عند نقلها دولياً.' }],
                },
                {
                    heading: '11. التغييرات على هذه السياسة',
                    blocks: [{ p: 'قد نحدّث سياسة الخصوصية من وقت لآخر، وسنخطرك بأي تغييرات بنشر السياسة الجديدة على هذه الصفحة وتحديث تاريخ «آخر تحديث». ونشجّعك على مراجعة هذه الصفحة دورياً.' }],
                },
                {
                    heading: '12. تواصل معنا',
                    blocks: [
                        { p: 'إذا كان لديك أي سؤال حول سياسة الخصوصية هذه، أو رغبت في ممارسة حقوقك على بياناتك، أو لديك أي ملاحظة على طريقة التعامل معها، تواصل معنا:' },
                        {
                            ul: [
                                `**البريد الإلكتروني:** ${CONTACT_EMAIL}`,
                                '**واتساب:** 0582619119',
                                '**الموقع:** المملكة العربية السعودية',
                                '**الكيان القانوني:** شركة دار الخبرة التجارية — السجل التجاري: 7040567922',
                            ],
                        },
                        { p: '[[/contact|صفحة الاتصال]]' },
                    ],
                },
            ],
        },

        about: {
            title: 'من نحن',
            updated: 'SQB · بنك أسئلة SMLE وSNLE',
            sections: [
                {
                    heading: 'من نحن',
                    blocks: [{ p: 'SQB منصة تعليمية سعودية متخصّصة في التحضير لاختبارات الهيئة السعودية للتخصصات الصحية والبرومترك، بمسارين مستقلّين: الطب البشري (SMLE) والتمريض (SNLE). تأسّست المنصة لمساعدة طلاب وخريجي الطب والتمريض في المملكة والمنطقة العربية على اجتياز هذه الاختبارات بنجاح.' }],
                },
                {
                    heading: 'مهمتنا',
                    blocks: [{ p: 'نسعى لتوفير أفضل تجربة تحضيرية للاختبارات الطبية، عبر بنك أسئلة شامل وتحليلات متقدّمة تساعدك على تحديد نقاط قوّتك وضعفك والتركيز على ما يحتاج مراجعة فعلية.' }],
                },
                {
                    heading: 'ماذا نقدّم',
                    blocks: [
                        {
                            ul: [
                                '**بنك أسئلة شامل:** أسئلة محدّثة باستمرار تغطي جميع التخصصات.',
                                '**تحليلات مفصّلة:** تتبّع أداءك وحدّد نقاط قوّتك وضعفك.',
                                '**اختبارات متنوّعة:** من جلسات قصيرة (10 أسئلة) إلى عدد مخصّص تختاره، إضافة إلى اختبار نهائي لكل تخصص.',
                                '**تتبّع التقدّم:** تابع تطوّرك عبر الزمن بإحصائيات دقيقة.',
                                '**مساران مستقلّان:** طب بشري (SMLE) وتمريض (SNLE)، لكلٍّ منهما أسئلته وملخّصاته وتحليلاته.',
                                '**بداية مجانية:** 40 سؤالاً مجانياً وأول درس من كل تخصص، بلا حد زمني وبلا بطاقة دفع.',
                            ],
                        },
                    ],
                },
                {
                    heading: 'لماذا SQB؟',
                    blocks: [
                        {
                            ul: [
                                '**تحديث مستمر:** يُحدَّث بنك الأسئلة بانتظام ليواكب أحدث المعايير.',
                                '**تصميم سهل الاستخدام:** واجهة بسيطة وواضحة على جميع الأجهزة.',
                                '**دعم لغتين:** المنصة متاحة بالعربية والإنجليزية بالكامل.',
                            ],
                        },
                    ],
                },
                {
                    heading: 'آخر التحديثات',
                    blocks: [
                        { h3: 'إطلاق مسار التمريض SNLE' },
                        { p: '31 يوليو 2026 — مسار التمريض صار متاحاً بالكامل: بنك أسئلة مستقل وملخصات مصوّرة تغطي أساسيات التمريض، والتمريض الباطني والجراحي، وتمريض الأمومة والمواليد، وتمريض الأطفال، والصحة النفسية، والأدوية وحسابات الجرعات — مع تحليل أداء خاص بالمسار. اختر «تمريض» عند إنشاء حسابك.' },
                        { h3: 'صور طبية حقيقية داخل الملخصات' },
                        { p: '25 يوليو 2026 — الملخصات صارت مصوّرة بأشعة وصور مجهرية ورسوم تشريحية حقيقية — علامة الـSteeple في الخانوق، وعلامة الإبهام في التهاب لسان المزمار، والنزف فوق وتحت الجافية على الأشعة المقطعية، وبلورات النقرس تحت الضوء المستقطب. مع مخططات جديدة في كل تخصص وأسئلة تفاعلية أكثر بعد كل ملخص.' },
                        { h3: 'اختصار SQB على شاشة جوالك' },
                        { p: '25 يوليو 2026 — ثبّت SQB على الشاشة الرئيسية لجوالك وافتحه بضغطة واحدة كأي تطبيق — بدون متجر تطبيقات وبدون تحميل.' },
                        { h3: 'تحديث الأسئلة لنمط 2026 Midgard & Gameboy' },
                        { p: '15 يوليو 2026 — تمت مراجعة بنك الأسئلة وتحديثه بالكامل ليواكب أحدث نمط اختبار 2026 (Midgard & Gameboy)، لتتدرب على الأقرب لما ستراه فعلياً في الاختبار.' },
                        { h3: 'إضافة التجميعات الشهرية لشهري 5 و6' },
                        { p: '15 يوليو 2026 — انضمت التجميعات الشهرية الجديدة لشهر مايو ويونيو إلى بنك الأسئلة، بعد مراجعة وتدقيق كامل لكل سؤال.' },
                        { h3: 'تطوير وتحديث الملخصات' },
                        { p: '15 يوليو 2026 — أعدنا صياغة الملخصات وحدّثنا محتواها لتكون أكثر وضوحاً وتركيزاً على النقاط عالية الأهمية.' },
                    ],
                },
                {
                    heading: 'إخلاء المسؤولية',
                    blocks: [{ p: 'SQB منصة تعليمية مستقلة غير تابعة للهيئة السعودية للتخصصات الصحية (SCFHS) أو شركة Prometric أو أي جهة رسمية. الأسئلة المقدَّمة للتدريب والممارسة فقط ولا تمثّل الاختبار الفعلي.' }],
                },
                {
                    heading: 'تواصل معنا',
                    blocks: [
                        { p: 'نرحّب بأسئلتك واقتراحاتك. يمكنك التواصل معنا عبر:' },
                        {
                            ul: [
                                `**البريد الإلكتروني:** ${CONTACT_EMAIL}`,
                                '**واتساب:** 0582619119',
                                '**صفحة الاتصال:** [[/contact|اتصل بنا]]',
                            ],
                        },
                        { p: '**الموقع:** المملكة العربية السعودية' },
                        { p: 'شركة دار الخبرة التجارية · السجل التجاري: 7040567922' },
                    ],
                },
            ],
        },
    },

    en: {
        terms: {
            title: 'Terms of Service',
            updated: 'Last updated: January 2026',
            sections: [
                {
                    heading: '1. Acceptance of terms',
                    blocks: [{ p: 'By accessing and using SMLE Question Bank (“the Service”), you accept and agree to be bound by these Terms of Service. If you do not agree to them, please do not use the Service.' }],
                },
                {
                    heading: '2. Description of the service',
                    blocks: [
                        { p: 'SMLE Question Bank is an educational platform that helps doctors and medical and nursing students prepare for the Saudi Medical Licensing Examination (SMLE) and the Saudi Nursing Licensure Examination (SNLE). The Service provides:' },
                        {
                            ul: [
                                'Access to a comprehensive, regularly updated question bank',
                                'Quiz and practice-test functionality',
                                'Performance analytics and progress tracking',
                                'Study resources organised by specialty',
                            ],
                        },
                    ],
                },
                {
                    heading: '3. User accounts',
                    blocks: [
                        { p: 'To access certain features of the Service you must create an account. You agree to:' },
                        {
                            ul: [
                                'Provide accurate and complete information during registration',
                                'Keep your password and account details secure',
                                'Notify us immediately of any unauthorised use of your account',
                                'Accept responsibility for all activity that occurs under your account',
                            ],
                        },
                    ],
                },
                {
                    heading: '4. Acceptable use',
                    blocks: [
                        { p: 'You agree not to:' },
                        {
                            ul: [
                                'Use the Service for any unlawful purpose',
                                'Share your account credentials with others',
                                'Copy, reproduce or distribute our content without permission',
                                'Interfere with or disrupt the Service or its servers',
                                'Use automated systems to access the Service without permission',
                                'Impersonate any person or entity',
                            ],
                        },
                    ],
                },
                {
                    heading: '5. Intellectual property',
                    blocks: [
                        { p: 'All content on SMLE Question Bank — including but not limited to questions, explanations, graphics, logos and software — is the property of SMLE Question Bank or its content suppliers, and is protected by intellectual property law.' },
                        { p: 'You may not reproduce, distribute, modify or create derivative works from any content without our prior written consent.' },
                    ],
                },
                {
                    heading: '6. Educational disclaimer',
                    blocks: [
                        { p: 'The content provided on SMLE Question Bank is for educational and informational purposes only. While we work to keep it accurate and up to date:' },
                        {
                            ul: [
                                'We are not affiliated with Prometric, SCFHS, or any official licensing body',
                                'Our questions are practice material and may not reflect actual exam content',
                                'Success on our platform does not guarantee success in the actual SMLE exam',
                                'You should verify information against official sources',
                            ],
                        },
                    ],
                },
                {
                    heading: '7. Advertisements',
                    blocks: [{ p: 'The Service may display advertisements provided by third parties, including Google AdSense. We are not responsible for the content of those advertisements; your interactions with advertisers are solely between you and the advertiser.' }],
                },
                {
                    heading: '8. Limitation of liability',
                    blocks: [{ p: 'To the maximum extent permitted by law, SMLE Question Bank shall not be liable for any indirect, incidental, special, consequential or punitive damages, nor for any loss of profits or revenue, whether incurred directly or indirectly, nor for any loss of data, use, goodwill or other intangible losses.' }],
                },
                {
                    heading: '9. Subscription and payment',
                    blocks: [
                        { p: 'The Service operates on a limited free tier with optional paid subscriptions:' },
                        {
                            ul: [
                                'Every new account receives **40 free questions** for the lifetime of the account, plus **the first lesson of every specialty** in the summaries, with no time limit on either.',
                                'Using up the free questions **does not close the account**: you can still sign in and access your analytics, your progress and your free lessons. The only effect is that new quizzes cannot be started.',
                                'Individual subscriptions: **50 SAR for one month**, **129 SAR for four months**, or **300 SAR for one year**.',
                                'Group subscriptions: **250 SAR for three accounts** or **299 SAR for five accounts**, each for four months. The purchaser’s own account is activated immediately and they receive single-use invite links for the remaining seats. All seats in a group expire on one shared date fixed at the time of purchase; claiming a link later does not extend that date.',
                                'All plans are **a single payment and do not renew automatically**. We do not retain your card details for future charges, and you will never be charged again unless you make a new purchase yourself.',
                                'Users who registered before the paid rollout are grandfathered and retain free access.',
                                'Accounts created by administrators are exempt from subscription charges.',
                                'Refunds, where applicable, are governed by our [[/refund-policy|Refund Policy]].',
                            ],
                        },
                        { p: 'Payments are processed securely through Moyasar, a licensed Saudi payment gateway. We do not store full card details on our servers.' },
                    ],
                },
                {
                    heading: '10. Service modifications',
                    blocks: [{ p: 'We reserve the right to modify, suspend or discontinue the Service (or any part of it) at any time, with or without notice. We shall not be liable to you or any third party for any such modification, suspension or discontinuation.' }],
                },
                {
                    heading: '11. Termination',
                    blocks: [{ p: 'We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason — including breach of these Terms.' }],
                },
                {
                    heading: '12. Changes to these terms',
                    blocks: [{ p: 'We reserve the right to update these Terms at any time. We will notify users of significant changes by posting a notice on our website. Continued use of the Service after a change constitutes acceptance of the new Terms.' }],
                },
                {
                    heading: '13. Governing law',
                    blocks: [{ p: 'These Terms are governed by, and construed in accordance with, the laws of the Kingdom of Saudi Arabia, without regard to its conflict of law provisions.' }],
                },
                {
                    heading: '14. Contact information',
                    blocks: [
                        { p: 'If you have any questions about these Terms, please contact us at:' },
                        { p: `**Email:** ${CONTACT_EMAIL}` },
                        { p: `**WhatsApp:** ${CONTACT_WHATSAPP}` },
                        { p: '**Legal entity:** Dar Al Khibra Trading Co.' },
                        { p: '**Commercial registration:** 7040567922' },
                    ],
                },
            ],
        },

        refund: {
            title: 'Refund Policy',
            updated: 'Last updated: June 2026',
            sections: [
                {
                    heading: '1. Subscription',
                    blocks: [{ p: 'SQB offers a paid subscription in three terms — **monthly, 4-month, and annual** — at the prices shown at checkout. Users who registered before the paid rollout, and admin-created accounts, retain free access and are not billed.' }],
                },
                {
                    heading: '2. Refund terms',
                    blocks: [
                        { p: 'The full-refund window scales with the plan\'s own term, so a short plan cannot be refunded almost in full after being used nearly to the end:' },
                        {
                            ul: [
                                '**Monthly plan:** a full refund may be requested within **3 days** of purchase.',
                                '**4-month and annual plans:** a full refund may be requested within **14 days** of purchase.',
                                'In all cases the request must be made in good faith, and requests made after the window above are generally not eligible, except where required by applicable Saudi consumer protection law.',
                                'Renewals may be cancelled at any time to prevent future billing; cancellation stops the next renewal but does not retroactively refund the current active period.',
                                'Accounts that received access for free (grandfathered users and admin-created accounts) are not billed and are therefore not eligible for refunds.',
                            ],
                        },
                    ],
                },
                {
                    heading: '3. How to request a refund',
                    blocks: [{ p: 'Refund requests can be submitted by email or WhatsApp using the contact details below. Please include your account email and the approximate date of purchase. We aim to respond within 5 business days.' }],
                },
                {
                    heading: '4. Payment processing',
                    blocks: [{ p: 'Payments are processed securely through Moyasar, a licensed Saudi payment gateway. We do not store full card details on our servers.' }],
                },
                {
                    heading: '5. Governing law',
                    blocks: [{ p: 'This Refund Policy is governed by, and construed in accordance with, the laws of the Kingdom of Saudi Arabia.' }],
                },
                {
                    heading: '6. Contact information',
                    blocks: [
                        { p: 'For refund requests or questions about this policy, contact us at:' },
                        { p: `**Email:** ${CONTACT_EMAIL}` },
                        { p: `**WhatsApp:** ${CONTACT_WHATSAPP}` },
                        { p: '**Legal entity:** Dar Al Khibra Trading Co.' },
                        { p: '**Commercial registration:** 7040567922' },
                        { p: 'See also our [[/terms|Terms of Service]] and [[/privacy|Privacy Policy]].' },
                    ],
                },
            ],
        },

        privacy: {
            title: 'Privacy Policy',
            updated: 'Last updated: February 2026',
            sections: [
                {
                    heading: '1. Introduction',
                    blocks: [{ p: 'Welcome to SMLE Question Bank (“SQB”, “we”, “our”, “us”). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose and safeguard your information when you visit our website (www.smle-question-bank.com) and use our services.' }],
                },
                {
                    heading: '2. Information we collect',
                    blocks: [
                        { h3: 'Personal information' },
                        { p: 'We may collect personal information that you voluntarily provide when you:' },
                        {
                            ul: [
                                'Register for an account (name and email address)',
                                'Use our quiz and practice features (performance data)',
                                'Contact us through our contact form',
                                'Subscribe to our services',
                            ],
                        },
                        { p: 'This information may include:' },
                        {
                            ul: [
                                'Name and email address',
                                'Username and password',
                                'Quiz performance and progress data',
                                'Phone / WhatsApp number (if provided)',
                            ],
                        },
                        { h3: 'Automatically collected information' },
                        { p: 'When you access our website we may automatically collect certain information about your device, including your browser, IP address, time zone and some of the cookies installed on your device. We also collect information about the pages you visit, the site or search terms that referred you to us, and how you interact with our website.' },
                    ],
                },
                {
                    heading: '3. How we use your information',
                    blocks: [
                        { p: 'We use the information we collect to:' },
                        {
                            ul: [
                                'Create and manage your account',
                                'Provide a personalised quiz experience and track your progress',
                                'Analyse and improve our services and content',
                                'Communicate with you about updates and features',
                                'Display relevant advertisements through Google AdSense',
                                'Protect against fraudulent or unauthorised activity',
                                'Comply with legal obligations',
                            ],
                        },
                        { p: '**Legal basis for processing (GDPR):** we process your personal data on the basis of:' },
                        {
                            ul: [
                                '**Consent:** when you agree to cookie usage and personalised ads',
                                '**Contract:** to provide the services you have subscribed to',
                                '**Legitimate interest:** to improve our platform and prevent fraud',
                            ],
                        },
                    ],
                },
                {
                    heading: '4. Advertising and third-party services',
                    blocks: [
                        { p: 'We use **Google AdSense** to display advertisements on our website. Google AdSense uses cookies and web beacons to serve ads based on your prior visits to our website or to other websites.' },
                        { p: '**Google’s DoubleClick DART cookie:** Google, as a third-party vendor, uses the DART cookie to serve ads to our visitors based on their visits to our site and other sites. Users may opt out of the DART cookie by visiting the Google ad and content network privacy policy.' },
                        { p: 'Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to our website or other websites.' },
                        { p: 'You may opt out of personalised advertising by visiting:' },
                        {
                            ul: [
                                '[[https://www.google.com/settings/ads|Google Ads Settings]]',
                                '[[https://policies.google.com/technologies/ads|Google Privacy & Terms — Advertising]]',
                                '[[https://optout.networkadvertising.org/|Network Advertising Initiative opt-out page]]',
                                '[[https://optout.aboutads.info/|Digital Advertising Alliance opt-out page]]',
                            ],
                        },
                        { p: 'For more information about how Google uses data, see the [[https://policies.google.com/privacy|Google Privacy Policy]].' },
                    ],
                },
                {
                    heading: '5. Cookies and tracking technologies',
                    blocks: [
                        { p: 'We use cookies and similar tracking technologies to track activity on our website and store certain information. The types of cookie we use are:' },
                        {
                            ul: [
                                '**Essential cookies:** required for the website to function properly (e.g. authentication, session management)',
                                '**Analytics cookies:** help us understand how visitors interact with our website',
                                '**Advertising cookies:** used by Google AdSense and its partners to display relevant advertisements based on your browsing behaviour',
                                '**Preference cookies:** remember your settings and preferences (e.g. your language)',
                            ],
                        },
                        { p: 'You can instruct your browser to refuse all cookies, or to tell you when a cookie is being sent. If you do not accept cookies, however, some features of our website may not work properly.' },
                        { p: '**Cookie consent:** we display a cookie consent banner on your first visit. You can accept all cookies or only the essential ones, and you can change your choice at any time by clearing your browser cookies and revisiting the site.' },
                    ],
                },
                {
                    heading: '6. Data retention',
                    blocks: [
                        { p: 'We retain your personal information for as long as your account is active, or as needed to provide our services. Specifically:' },
                        {
                            ul: [
                                '**Account data:** retained until you request account deletion',
                                '**Quiz performance data:** retained for the lifetime of your account',
                                '**Cookie data:** advertising cookies are typically retained for up to 13 months',
                                '**Contact form data:** retained for up to 12 months',
                            ],
                        },
                    ],
                },
                {
                    heading: '7. Data security',
                    blocks: [{ p: 'We implement appropriate technical and organisational security measures to protect your personal information, including secure data transmission. However, no method of transmission over the internet or of electronic storage is 100% secure.' }],
                },
                {
                    heading: '8. Your rights',
                    blocks: [
                        { h3: 'For all users' },
                        {
                            ul: [
                                'Access your personal data',
                                'Correct inaccurate data',
                                'Request deletion of your data',
                                'Object to the processing of your data',
                                'Opt out of personalised advertising',
                            ],
                        },
                        { h3: 'GDPR rights (EU/EEA users)' },
                        { p: 'If you are a resident of the European Economic Area (EEA), you have additional rights:' },
                        {
                            ul: [
                                '**Right to data portability:** request a copy of your data in a portable format',
                                '**Right to restriction:** request that processing of your data be restricted',
                                '**Right to withdraw consent:** withdraw your consent at any time',
                                '**Right to lodge a complaint:** file a complaint with your local data protection authority',
                            ],
                        },
                        { h3: 'CCPA rights (California users)' },
                        { p: 'If you are a California resident, you have the right to:' },
                        {
                            ul: [
                                'Know what personal information is collected about you',
                                'Know whether your personal information is sold or disclosed',
                                'Say no to the sale of personal information',
                                'Access your personal information',
                                'Receive equal service and pricing, even if you exercise your privacy rights',
                            ],
                        },
                    ],
                },
                {
                    heading: '9. Children’s privacy',
                    blocks: [{ p: 'Our service is not intended for children under 13 years of age, and we do not knowingly collect personal information from them. If we discover that a child under 13 has provided us with personal information, we will delete it immediately.' }],
                },
                {
                    heading: '10. International data transfers',
                    blocks: [{ p: 'Your information may be transferred to, and held on, servers located outside your country of residence. We ensure that adequate safeguards are in place to protect your data when it is transferred internationally.' }],
                },
                {
                    heading: '11. Changes to this policy',
                    blocks: [{ p: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the “Last updated” date. We encourage you to review this page periodically.' }],
                },
                {
                    heading: '12. Contact us',
                    blocks: [
                        { p: 'If you have any questions about this Privacy Policy, wish to exercise your data rights, or have concerns about how your data is handled, please contact us at:' },
                        {
                            ul: [
                                `**Email:** ${CONTACT_EMAIL}`,
                                '**WhatsApp:** 0582619119',
                                '**Location:** Saudi Arabia',
                                '**Legal entity:** Dar Al Khibra Trading Co. — Commercial registration: 7040567922',
                            ],
                        },
                        { p: '[[/contact|Contact us page]]' },
                    ],
                },
            ],
        },

        about: {
            title: 'About us',
            updated: 'SQB · SMLE & SNLE Question Bank',
            sections: [
                {
                    heading: 'Who we are',
                    blocks: [{ p: 'SQB is a Saudi educational platform dedicated to preparing candidates for the SCFHS licensing and Prometric exams, across two independent tracks: medicine (SMLE) and nursing (SNLE). It was built to help medical and nursing students and graduates in Saudi Arabia and the wider region pass those exams.' }],
                },
                {
                    heading: 'Our mission',
                    blocks: [{ p: 'To deliver the best exam-prep experience available, through a comprehensive question bank and advanced analytics that show you exactly where you are strong, where you are weak, and what actually needs revising.' }],
                },
                {
                    heading: 'What we offer',
                    blocks: [
                        {
                            ul: [
                                '**A comprehensive question bank:** continuously updated questions across every specialty.',
                                '**Detailed analytics:** track your performance and identify your strengths and weaknesses.',
                                '**Varied quizzes:** from short 10-question sessions to any custom length, plus a full final exam per specialty.',
                                '**Progress tracking:** monitor your improvement over time with precise statistics.',
                                '**Two independent tracks:** Medicine (SMLE) and Nursing (SNLE), each with its own questions, summaries and analytics.',
                                '**A free start:** 40 free questions and the first lesson of every specialty, with no time limit and no payment card.',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Why SQB?',
                    blocks: [
                        {
                            ul: [
                                '**Kept up to date:** the question bank is updated regularly to match the latest standards.',
                                '**Easy to use:** a simple, clear interface on every device.',
                                '**Fully bilingual:** the whole platform is available in Arabic and English.',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Recent updates',
                    blocks: [
                        { h3: 'The SNLE nursing track is live' },
                        { p: '31 July 2026 — The nursing track is now fully available: a standalone question bank and illustrated summaries covering nursing fundamentals, medical-surgical nursing, maternal and newborn nursing, paediatric nursing, mental health, and pharmacology with dosage calculations — plus performance analytics specific to the track. Choose “Nursing” when you create your account.' },
                        { h3: 'Real medical imaging inside the summaries' },
                        { p: '25 July 2026 — The summaries are now illustrated with genuine radiographs, micrographs and anatomical figures — the steeple sign in croup, the thumb sign in epiglottitis, extradural and subdural haemorrhage on CT, and gout crystals under polarised light. Plus new diagrams in every specialty and more interactive questions after each summary.' },
                        { h3: 'An SQB shortcut on your phone screen' },
                        { p: '25 July 2026 — Add SQB to your phone’s home screen and open it in a single tap like any app — no app store, no download.' },
                        { h3: 'Questions updated to the 2026 Midgard & Gameboy format' },
                        { p: '15 July 2026 — The question bank has been fully reviewed and updated to the latest 2026 exam format (Midgard & Gameboy), so you practise on what is closest to what you will actually see.' },
                        { h3: 'May and June monthly collections added' },
                        { p: '15 July 2026 — The new May and June monthly collections have joined the question bank, after a full review and verification of every question.' },
                        { h3: 'Summaries rewritten and updated' },
                        { p: '15 July 2026 — We rewrote the summaries and refreshed their content so they are clearer and more focused on the high-yield points.' },
                    ],
                },
                {
                    heading: 'Disclaimer',
                    blocks: [{ p: 'SQB is an independent educational platform, not affiliated with the Saudi Commission for Health Specialties (SCFHS), Prometric, or any official body. The questions are for practice only and do not represent the actual exam.' }],
                },
                {
                    heading: 'Contact us',
                    blocks: [
                        { p: 'We welcome your questions and suggestions. You can reach us at:' },
                        {
                            ul: [
                                `**Email:** ${CONTACT_EMAIL}`,
                                '**WhatsApp:** 0582619119',
                                '**Contact page:** [[/contact|Contact us]]',
                            ],
                        },
                        { p: '**Location:** Saudi Arabia' },
                        { p: 'Dar Al Khibra Trading Co. · Commercial registration: 7040567922' },
                    ],
                },
            ],
        },
    },
};

export default legalCopy;
