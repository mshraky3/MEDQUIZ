/**
 * The public FAQ. Answers use "\n" to separate lines — the page renders each
 * line as its own paragraph, which is how the bulleted answers stay readable.
 */
const faqCopy = {
    ar: {
        title: 'الأسئلة الشائعة',
        subtitle: 'إجابات على أكثر ما يُسأل عن منصة SQB',
        ctaTitle: 'لم تجد إجابة لسؤالك؟',
        ctaBody: 'تواصل معنا وسنكون سعداء بمساعدتك',
        ctaContact: 'اتصل بنا',
        ctaWhatsapp: 'واتساب',
        items: [
            {
                question: 'ما هي منصة SQB؟',
                answer: 'SQB منصة تعليمية متخصّصة في التحضير لاختبارات الهيئة السعودية للتخصصات الصحية والبرومترك، بمسارين مستقلّين: الطب البشري (SMLE) والتمريض (SNLE). توفّر المنصة بنك أسئلة شاملاً يُحدَّث باستمرار، مع ملخّصات وتحليلات مفصّلة وتتبّع كامل لأدائك.',
            },
            {
                question: 'هل يوجد مسار للتمريض؟',
                answer: 'نعم. مسار التمريض متاح بالكامل وله بنك أسئلته وملخّصاته وتحليلات أدائه الخاصة، ويغطي:\n• أساسيات التمريض\n• التمريض الباطني والجراحي\n• تمريض الأمومة والمواليد\n• تمريض الأطفال\n• الصحة النفسية\n• الأدوية وحسابات الجرعات\n\nتختار مسارك عند إنشاء الحساب، وبعدها لن يظهر لك إلا محتوى مسارك. والاشتراك نفسه لكلا المسارين (99 ريالاً سنوياً).',
            },
            {
                question: 'ما التخصصات التي يغطيها بنك الأسئلة؟',
                answer: 'مسار الطب البشري يغطي الباطنة (Internal Medicine) والجراحة (Surgery) والأطفال (Pediatrics) والنساء والولادة (OB/GYN).\n\nومسار التمريض يغطي أساسيات التمريض، والتمريض الباطني والجراحي، وتمريض الأمومة والمواليد، وتمريض الأطفال، والصحة النفسية، والأدوية وحسابات الجرعات.',
            },
            {
                question: 'هل يمكنني تجربة المنصة مجاناً؟',
                answer: 'نعم. عند إنشاء حسابك وتأكيد بريدك الإلكتروني تحصل فوراً على ساعة وصول كامل مجاناً لكل الأسئلة والتحليلات، بدون بطاقة دفع. وبعدها يمكنك الاشتراك السنوي مقابل 99 ريالاً للمتابعة.',
            },
            {
                question: 'كم تكلفة الاشتراك؟',
                answer: 'الاشتراك السنوي 99 ريالاً بدفعة واحدة، ويمنحك وصولاً كاملاً لمدة سنة بدون تجديد تلقائي. والدفع عبر بوابة ميسر السعودية المرخّصة (مدى، Visa، Mastercard، Apple Pay).',
            },
            {
                question: 'ما أنواع الاختبارات المتاحة؟',
                answer: 'تختار حجم الاختبار وتخصّصاته ومؤقّته كما تريد:\n• اختبار سريع: 10 أسئلة مختلطة بضغطة واحدة\n• اختبار من 50 سؤالاً\n• عدد مخصّص: من سؤال واحد حتى 500 سؤال\n• اختبار نهائي: كل أسئلة تخصّص معيّن دفعة واحدة، بما فيها ما أجبت عليه سابقاً\n\nويمكنك ضبط مؤقّت لكل اختبار أو تركه بلا وقت محدّد.',
            },
            {
                question: 'كيف يعمل نظام التحليلات؟',
                answer: 'يعطيك نظام التحليلات صورة مفصّلة عن أدائك، تشمل:\n• نسبة الإجابات الصحيحة لكل تخصّص\n• تتبّع تقدّمك عبر الزمن\n• تحديد المواضيع الضعيفة التي تحتاج مراجعة\n• سجلّ اختباراتك السابقة ونتائجها\n• أسئلتك الخاطئة لمراجعتها',
            },
            {
                question: 'هل الأسئلة محدّثة؟',
                answer: 'نعم. يُحدَّث بنك الأسئلة بشكل دوري ليواكب أحدث المعايير والمحتوى الطبي، وفريقنا يضيف أسئلة جديدة ويحسّن الموجودة باستمرار.',
            },
            {
                question: 'كيف أشترك في المنصة؟',
                answer: 'يمكنك البدء فوراً بخطوات بسيطة:\n1. أنشئ حسابك وأكّد بريدك للحصول على ساعة تجربة مجانية\n2. ابدأ أول اختبار سريع خلال التجربة\n3. عند انتهاء الساعة، اشترك سنوياً مقابل 99 ريالاً للمتابعة\n4. واصل يومياً لرفع مستواك قبل الاختبار',
            },
            {
                question: 'هل المنصة تابعة للهيئة السعودية للتخصصات الصحية؟',
                answer: 'لا. SQB منصة تعليمية مستقلة غير تابعة للهيئة السعودية للتخصصات الصحية (SCFHS) أو شركة Prometric أو أي جهة رسمية، والأسئلة المقدَّمة للتدريب والممارسة فقط.',
            },
            {
                question: 'كيف أتواصل مع الدعم؟',
                answer: 'يمكنك التواصل معنا عبر:\n• واتساب: 0582619119\n• البريد الإلكتروني: alshraky3@gmail.com\n• صفحة الاتصال على الموقع',
            },
            {
                question: 'هل يمكنني استخدام المنصة على الجوال؟',
                answer: 'نعم. المنصة مصمّمة لتعمل بشكل ممتاز على جميع الأجهزة — الهواتف والأجهزة اللوحية وأجهزة الكمبيوتر — ولا تحتاج إلى تحميل أي تطبيق؛ استخدمها مباشرة من المتصفح.',
            },
        ],
    },

    en: {
        title: 'Frequently asked questions',
        subtitle: 'Answers to what people most often ask about SQB',
        ctaTitle: 'Did not find your answer?',
        ctaBody: 'Get in touch — we are happy to help',
        ctaContact: 'Contact us',
        ctaWhatsapp: 'WhatsApp',
        items: [
            {
                question: 'What is SQB?',
                answer: 'SQB is an educational platform built for the SCFHS licensing and Prometric exams, across two independent tracks: medicine (SMLE) and nursing (SNLE). It gives you a comprehensive, continuously updated question bank, plus summaries, detailed analytics and full performance tracking.',
            },
            {
                question: 'Is there a nursing track?',
                answer: 'Yes. The nursing track is fully available, with its own question bank, summaries and performance analytics. It covers:\n• Nursing fundamentals\n• Medical-surgical nursing\n• Maternal and newborn nursing\n• Paediatric nursing\n• Mental health nursing\n• Pharmacology and dosage calculations\n\nYou choose your track when you create your account, and from then on you only see content for that track. The subscription is the same for both (SAR 99 a year).',
            },
            {
                question: 'Which specialties does the question bank cover?',
                answer: 'The medical track covers Internal Medicine, Surgery, Paediatrics and OB/GYN.\n\nThe nursing track covers nursing fundamentals, medical-surgical nursing, maternal and newborn nursing, paediatric nursing, mental health nursing, and pharmacology with dosage calculations.',
            },
            {
                question: 'Can I try the platform for free?',
                answer: 'Yes. When you create your account and confirm your email you immediately get one hour of full free access to every question and every analytic — no payment card required. After that, the annual subscription is SAR 99 to continue.',
            },
            {
                question: 'How much does the subscription cost?',
                answer: 'The annual subscription is SAR 99 as a single payment, giving you full access for a year with no auto-renewal. Payment goes through Moyasar, the licensed Saudi gateway (mada, Visa, Mastercard, Apple Pay).',
            },
            {
                question: 'What kinds of quiz can I take?',
                answer: 'You choose the size, the specialties and the timer:\n• Quick quiz: 10 mixed questions in one tap\n• A 50-question quiz\n• A custom number: anything from 1 to 500 questions\n• Final quiz: every question in a chosen specialty at once, including ones you have already answered\n\nYou can set a timer for any quiz, or leave it untimed.',
            },
            {
                question: 'How do the analytics work?',
                answer: 'The analytics give you a detailed picture of your performance, including:\n• Your accuracy in each specialty\n• Your progress over time\n• The weak topics that need revising\n• Your history of past quizzes and results\n• Your wrong questions, ready to review',
            },
            {
                question: 'Are the questions up to date?',
                answer: 'Yes. The question bank is updated regularly to stay aligned with the latest standards and medical content, and our team is continually adding new questions and improving existing ones.',
            },
            {
                question: 'How do I subscribe?',
                answer: 'You can start right away:\n1. Create your account and confirm your email to get your free trial hour\n2. Take your first quick quiz during the trial\n3. When the hour ends, subscribe for SAR 99 a year to continue\n4. Keep going daily to build your score before the exam',
            },
            {
                question: 'Is the platform affiliated with SCFHS?',
                answer: 'No. SQB is an independent educational platform, not affiliated with the Saudi Commission for Health Specialties (SCFHS), Prometric, or any official body. The questions are for practice only.',
            },
            {
                question: 'How do I contact support?',
                answer: 'You can reach us at:\n• WhatsApp: 0582619119\n• Email: alshraky3@gmail.com\n• The contact page on this site',
            },
            {
                question: 'Can I use the platform on my phone?',
                answer: 'Yes. The platform is built to work well on every device — phones, tablets and desktops — and there is no app to download; just use it straight from your browser.',
            },
        ],
    },
};

export default faqCopy;
