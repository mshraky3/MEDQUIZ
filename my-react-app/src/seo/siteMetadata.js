const SITE_ORIGIN = 'https://www.smle-question-bank.com';
const SITE_NAME = 'SQB';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-image.svg`;
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

const faqItems = [
    {
        question: 'ما هي منصة SQB؟',
        answer: 'SQB هي منصة تعليمية متخصصة في التحضير لاختبار الهيئة السعودية للتخصصات الصحية واختبار البرومترك، وتوفر بنك أسئلة وتحليلات أداء وخطط تدريب عملية.'
    },
    {
        question: 'هل المنصة مناسبة للتحضير لاختبار SMLE؟',
        answer: 'نعم، المنصة مصممة لمساعدة الأطباء والطلاب على التدريب على أسئلة SMLE وبرومترك عبر جلسات قصيرة وطويلة وتحليلات تفصيلية.'
    },
    {
        question: 'هل يمكنني إنشاء حساب مجاني؟',
        answer: 'نعم، يمكنك إنشاء حساب مجاني والبدء في استكشاف المنصة قبل الانتقال إلى استخدام أوسع حسب احتياجك.'
    },
    {
        question: 'هل تعمل SQB على الجوال؟',
        answer: 'نعم، المنصة تعمل على الهواتف والأجهزة اللوحية وأجهزة الكمبيوتر من خلال المتصفح مع تصميم متجاوب بالكامل.'
    },
    {
        question: 'كيف أتواصل مع فريق SQB؟',
        answer: 'يمكنك التواصل عبر صفحة اتصل بنا أو البريد الإلكتروني أو واتساب للحصول على المساعدة أو إرسال الاقتراحات.'
    }
];

function makeUrl(path = '/') {
    return new URL(path, `${SITE_ORIGIN}/`).toString();
}

const breadcrumbs = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: makeUrl(item.path)
    }))
});

function routePageData(path, name, description) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name,
        description,
        url: makeUrl(path),
        inLanguage: 'ar-SA'
    };
}

const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'اس كيو بي',
    alternateName: 'SQB',
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/tab_logo.png`,
    image: DEFAULT_IMAGE,
    email: 'alshraky3@gmail.com',
    telephone: '+966582619119',
    areaServed: 'Saudi Arabia',
    sameAs: [SITE_ORIGIN],
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'SA'
    }
};

const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'اس كيو بي',
    alternateName: 'SQB',
    url: SITE_ORIGIN,
    inLanguage: 'ar-SA',
    description: 'منصة عربية للتحضير لاختبار SMLE والبرومترك من خلال بنك أسئلة وتحليلات أداء ومسارات تدريب عملية.'
};

const routeMap = {
    '/': {
        title: 'اس كيو بي | بنك أسئلة SMLE وبرومترك في السعودية',
        description: 'منصة SQB تساعدك على التحضير لاختبار SMLE والبرومترك عبر بنك أسئلة عربي، تحليلات أداء، اختبارات تدريبية، ومراجعة ذكية للأطباء وطلاب الطب في السعودية.',
        keywords: 'SMLE, Prometric, Saudi Medical Licensing Examination, بنك أسئلة SMLE, اسئلة برومترك, اسئلة الهيئة السعودية للتخصصات الصحية, تحضير SMLE, منصة طبية, بنك اسئلة طبية, Saudi Prometric questions, medical MCQ',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/', 'اس كيو بي | بنك أسئلة SMLE وبرومترك', 'منصة عربية للتحضير لاختبار الهيئة السعودية للتخصصات الصحية وبرومترك.'),
            organizationSchema,
            webSiteSchema
        ],
        prerenderHtml: `
      <main class="seo-shell" dir="rtl">
        <header class="seo-hero">
          <p class="seo-kicker">SQB</p>
          <h1>منصة عربية للتحضير لاختبار SMLE والبرومترك</h1>
          <p>بنك أسئلة طبي، تحليلات أداء، مراجعة للأخطاء، واختبارات تدريبية تساعد الأطباء وطلاب الطب في السعودية على الاستعداد لاختبارات الهيئة السعودية للتخصصات الصحية.</p>
        </header>
        <section>
          <h2>لماذا يستخدم الطلاب والأطباء منصة SQB؟</h2>
          <p>لأنها تجمع بين الأسئلة التدريبية المنظمة، وتتبع التقدم، والقدرة على التركيز على نقاط الضعف، مع تجربة عربية سهلة على الجوال والكمبيوتر.</p>
        </section>
        <section>
          <h2>ماذا ستجد داخل المنصة؟</h2>
          <ul>
            <li>جلسات تدريب قصيرة وطويلة تحاكي نمط الاختبار.</li>
            <li>تحليلات أداء حسب الموضوع والدقة وسرعة الإجابة.</li>
            <li>مراجعة للأسئلة الخاطئة لمساعدتك على تحسين مستواك.</li>
            <li>صفحات مساعدة مثل من نحن والأسئلة الشائعة والتواصل.</li>
          </ul>
        </section>
        <nav aria-label="روابط مهمة">
          <a href="/about">من نحن</a>
          <a href="/faq">الأسئلة الشائعة</a>
          <a href="/contact">اتصل بنا</a>
          <a href="/signup">إنشاء حساب مجاني</a>
          <a href="/login">تسجيل الدخول</a>
        </nav>
      </main>
    `
    },
    '/about': {
        title: 'من نحن | SQB',
        description: 'تعرف على منصة SQB ورسالتها في مساعدة الأطباء وطلاب الطب على التحضير لاختبار SMLE والبرومترك في السعودية عبر بنك أسئلة وتحليلات عملية.',
        keywords: 'من نحن SQB, About SMLE Question Bank, منصة SQB, تحضير SMLE, بنك أسئلة برومترك',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'AboutPage',
                name: 'من نحن | SQB',
                description: 'تعرف على منصة SQB ورسالتها وفريقها وما تقدمه للطلاب والأطباء.',
                url: makeUrl('/about'),
                inLanguage: 'ar-SA'
            },
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'من نحن', path: '/about' }
            ])
        ],
        prerenderHtml: `
      <main class="seo-shell" dir="rtl">
        <h1>من نحن في SQB</h1>
        <p>SQB منصة تعليمية سعودية تساعد الأطباء وطلاب الطب على التحضير لاختبار الهيئة السعودية للتخصصات الصحية واختبار البرومترك من خلال محتوى تدريبي منظم وتحليلات أداء واضحة.</p>
        <section>
          <h2>رسالتنا</h2>
          <p>تقديم تجربة تدريب عملية وسهلة الوصول تساعد المستخدم على تحديد نقاط قوته وضعفه والتركيز على المواضيع الأكثر أهمية قبل الاختبار.</p>
        </section>
      </main>
    `
    },
    '/faq': {
        title: 'الأسئلة الشائعة | SQB',
        description: 'إجابات واضحة على أكثر الأسئلة شيوعاً حول منصة SQB، الاشتراك، بنك الأسئلة، التحضير لاختبار SMLE، والتواصل مع الدعم.',
        keywords: 'الأسئلة الشائعة SQB, FAQ SMLE, FAQ Prometric, أسئلة منصة طبية, تحضير SMLE',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqItems.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.answer
                    }
                }))
            },
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'الأسئلة الشائعة', path: '/faq' }
            ])
        ],
        prerenderHtml: `
      <main class="seo-shell" dir="rtl">
        <h1>الأسئلة الشائعة حول منصة SQB</h1>
        <p>هذه الصفحة توضح أهم المعلومات عن بنك الأسئلة، إنشاء الحساب، وتجربة المنصة للتحضير لاختبار SMLE والبرومترك.</p>
        <section>
          <ol>
            ${faqItems.map((item) => `<li><strong>${item.question}</strong><p>${item.answer}</p></li>`).join('')}
          </ol>
        </section>
      </main>
    `
    },
    '/contact': {
        title: 'اتصل بنا | SQB',
        description: 'تواصل مع فريق SQB للحصول على الدعم أو الاستفسار عن الاشتراكات أو إرسال الملاحظات والاقتراحات المتعلقة بمنصة التحضير لاختبار SMLE.',
        keywords: 'اتصل بنا SQB, دعم SMLE, تواصل منصة طبية, دعم برومترك, contact SQB',
        robots: 'noindex, nofollow, noarchive',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'ContactPage',
                name: 'اتصل بنا | SQB',
                url: makeUrl('/contact'),
                inLanguage: 'ar-SA',
                mainEntity: {
                    '@type': 'Organization',
                    name: 'SQB',
                    email: 'alshraky3@gmail.com',
                    telephone: '+966582619119'
                }
            },
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'اتصل بنا', path: '/contact' }
            ])
        ],
        prerenderHtml: `
      <main class="seo-shell" dir="rtl">
        <h1>اتصل بنا</h1>
        <p>إذا كنت تحتاج مساعدة في استخدام المنصة أو تريد الاستفسار عن الاشتراك أو لديك ملاحظة، يمكنك التواصل مع فريق SQB مباشرة.</p>
        <ul>
          <li>البريد الإلكتروني: <a href="mailto:alshraky3@gmail.com">alshraky3@gmail.com</a></li>
          <li>واتساب: <a href="https://wa.link/gqafib">0582619119</a></li>
        </ul>
      </main>
    `
    },
    '/privacy': {
        title: 'سياسة الخصوصية | SQB',
        description: 'راجع سياسة الخصوصية في SQB لمعرفة كيفية جمع البيانات الشخصية واستخدامها وحماية معلومات المستخدمين عند استخدام منصة التحضير لاختبار SMLE.',
        keywords: 'سياسة الخصوصية SQB, privacy policy SMLE, حماية البيانات, خصوصية منصة طبية',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/privacy', 'سياسة الخصوصية | SQB', 'سياسة الخصوصية الخاصة بمنصة SQB واستخدام البيانات.'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'سياسة الخصوصية', path: '/privacy' }
            ])
        ],
        prerenderHtml: `
      <main class="seo-shell" dir="rtl">
        <h1>سياسة الخصوصية</h1>
        <p>توضح هذه الصفحة كيفية تعامل منصة SQB مع بيانات المستخدمين ومعلومات الحساب وملفات تعريف الارتباط وطرق التواصل.</p>
      </main>
    `
    },
    '/terms': {
        title: 'شروط الخدمة | SQB',
        description: 'اطلع على شروط استخدام منصة SQB بما يشمل الحسابات، الملكية الفكرية، إخلاء المسؤولية التعليمية، والتزامات المستخدم عند استخدام الموقع.',
        keywords: 'شروط الخدمة SQB, terms of service SMLE, شروط استخدام منصة طبية',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/terms', 'شروط الخدمة | SQB', 'شروط استخدام منصة SQB للتحضير لاختبار SMLE والبرومترك.'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'شروط الخدمة', path: '/terms' }
            ])
        ],
        prerenderHtml: `
      <main class="seo-shell" dir="rtl">
        <h1>شروط الخدمة</h1>
        <p>تشرح هذه الصفحة شروط استخدام منصة SQB، بما في ذلك مسؤوليات المستخدم وطبيعة المحتوى التعليمي داخل الموقع.</p>
      </main>
    `
    },
    '/guides': {
        title: 'أدلة التحضير لاختبار SMLE | SQB',
        description: 'مكتبة أدلة عملية للتحضير لاختبار SMLE والبرومترك: خطط مذاكرة، مراجعة الأخطاء، إدارة الوقت، ونصائح أداء عالية العائد.',
        keywords: 'SMLE study guides, دليل SMLE, خطة مذاكرة SMLE, مراجعة أخطاء SMLE, برومترك طب, نصائح اختبار الهيئة',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/guides', 'أدلة التحضير لاختبار SMLE | SQB', 'أدلة ومقالات تعليمية للتحضير لاختبار SMLE والبرومترك.'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'الأدلة', path: '/guides' }
            ])
        ],
        prerenderHtml: `
            <main class="seo-shell" dir="rtl">
                <h1>أدلة التحضير لاختبار SMLE</h1>
                <p>صفحة تضم مقالات تعليمية عميقة حول خطط المذاكرة، مراجعة الأخطاء، وإدارة الوقت في اختبار SMLE والبرومترك.</p>
                <nav aria-label="أدلة التحضير">
                    <a href="/guides/smle-study-plan">خطة SMLE من 12 أسبوع</a>
                    <a href="/guides/wrong-questions-method">طريقة مراجعة الأسئلة الخاطئة</a>
                </nav>
            </main>
        `
    },
    '/guides/smle-study-plan': {
        title: 'خطة SMLE من 12 أسبوع | SQB',
        description: 'دليل عملي لبناء خطة مذاكرة 12 أسبوع لاختبار SMLE: تقسيم المراحل، إدارة الوقت، ومؤشرات الجاهزية قبل يوم الاختبار.',
        keywords: 'خطة SMLE, study plan SMLE, جدول مذاكرة SMLE, التحضير لاختبار الهيئة السعودية',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/guides/smle-study-plan', 'خطة SMLE من 12 أسبوع | SQB', 'دليل تدريجي للتحضير لاختبار SMLE خلال 12 أسبوع.'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'الأدلة', path: '/guides' },
                { name: 'خطة 12 أسبوع', path: '/guides/smle-study-plan' }
            ])
        ],
        prerenderHtml: `
            <main class="seo-shell" dir="rtl">
                <h1>خطة SMLE من 12 أسبوع</h1>
                <p>دليل يشرح تقسيم التحضير إلى مراحل، تنظيم اليوم الدراسي، ومراجعة الأخطاء بشكل منهجي لرفع الجاهزية قبل الاختبار.</p>
            </main>
        `
    },
    '/guides/wrong-questions-method': {
        title: 'طريقة مراجعة الأسئلة الخاطئة | SQB',
        description: 'طريقة عملية لتحويل أخطاء أسئلة SMLE إلى قواعد قرار ثابتة: تصنيف الخطأ، التكرار المتباعد، وبناء قائمة أخطاء عالية العائد.',
        keywords: 'مراجعة الأخطاء SMLE, wrong questions method, أخطاء اختبار SMLE, تحسين دقة الإجابة',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/guides/wrong-questions-method', 'طريقة مراجعة الأسئلة الخاطئة | SQB', 'دليل عملي لمنهجية مراجعة الأسئلة الخاطئة في SMLE.'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'الأدلة', path: '/guides' },
                { name: 'مراجعة الأخطاء', path: '/guides/wrong-questions-method' }
            ])
        ],
        prerenderHtml: `
            <main class="seo-shell" dir="rtl">
                <h1>طريقة مراجعة الأسئلة الخاطئة</h1>
                <p>دليل يوضح كيف تصنف الخطأ وتبني آلية مراجعة تمنع تكراره في اختبارات SMLE والبرومترك.</p>
            </main>
        `
    },
    '/login': {
        title: 'تسجيل الدخول | SQB',
        description: 'سجّل دخولك إلى منصة SQB للوصول إلى لوحة التدريب، جلسات الأسئلة، والمتابعة التحليلية الخاصة بالتحضير لاختبار SMLE والبرومترك.',
        keywords: 'تسجيل الدخول SQB, login SMLE, منصة تحضير برومترك, دخول بنك اسئلة SMLE',
        robots: 'noindex, nofollow, noarchive',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/login', 'تسجيل الدخول | SQB', 'صفحة تسجيل الدخول إلى منصة SQB.'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'تسجيل الدخول', path: '/login' }
            ])
        ],
        prerenderHtml: `
      <main class="seo-shell" dir="rtl">
        <h1>تسجيل الدخول إلى SQB</h1>
        <p>سجّل دخولك للوصول إلى اختباراتك السابقة، مراجعة الأداء، ومتابعة التحضير لاختبار SMLE والبرومترك من أي جهاز.</p>
      </main>
    `
    },
    '/signup': {
        title: 'إنشاء حساب مجاني | SQB',
        description: 'أنشئ حسابك المجاني في منصة SQB وابدأ التدريب على أسئلة SMLE والبرومترك مع تجربة عربية مبسطة وتحليلات تساعدك على تحسين مستواك.',
        keywords: 'إنشاء حساب SQB, signup SMLE, حساب مجاني برومترك, منصة اسئلة طبية',
        robots: 'noindex, nofollow, noarchive',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/signup', 'إنشاء حساب مجاني | SQB', 'صفحة إنشاء حساب مجاني في منصة SQB.'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'إنشاء حساب', path: '/signup' }
            ])
        ],
        prerenderHtml: `
      <main class="seo-shell" dir="rtl">
        <h1>إنشاء حساب مجاني في SQB</h1>
        <p>يمكنك إنشاء حساب مجاني والبدء في استخدام منصة SQB للوصول إلى أسئلة تدريبية وتحسين استعدادك لاختبار الهيئة السعودية للتخصصات الصحية.</p>
      </main>
    `
    },
    '/quizs': {
        title: 'اختيار الاختبار | SQB',
        description: 'صفحة اختيار عدد الأسئلة ونوعها داخل منصة SQB.',
        keywords: 'اختيار الاختبار SQB, quiz selection SMLE',
        robots: 'noindex, nofollow, noarchive',
        structuredData: [routePageData('/quizs', 'اختيار الاختبار | SQB', 'صفحة داخلية لاختيار جلسة التدريب.')]
    },
    '/suggestions': {
        title: 'الاقتراحات والأفكار | SQB',
        description: 'صفحة داخلية لإرسال اقتراحات المستخدمين إلى منصة SQB.',
        keywords: 'اقتراحات SQB',
        robots: 'noindex, nofollow, noarchive',
        structuredData: [routePageData('/suggestions', 'الاقتراحات والأفكار | SQB', 'صفحة إرسال الاقتراحات.')]
    },
    '/analysis': {
        title: 'تحليل الأداء | SQB',
        description: 'صفحة داخلية لتحليل الأداء في منصة SQB.',
        keywords: 'تحليل الأداء SQB',
        robots: 'noindex, nofollow, noarchive',
        structuredData: [routePageData('/analysis', 'تحليل الأداء | SQB', 'صفحة تحليل أداء داخلية.')]
    },
    '/wrong-questions': {
        title: 'مراجعة الأسئلة الخاطئة | SQB',
        description: 'صفحة داخلية لمراجعة الأسئلة الخاطئة.',
        keywords: 'مراجعة الأسئلة الخاطئة SQB',
        robots: 'noindex, nofollow, noarchive',
        structuredData: [routePageData('/wrong-questions', 'مراجعة الأسئلة الخاطئة | SQB', 'صفحة مراجعة داخلية.')]
    },
    '/signup-token': {
        title: 'إنشاء حساب | SQB',
        description: 'رابط مخصص لإنشاء حساب داخل منصة SQB.',
        keywords: 'signup token SQB',
        robots: 'noindex, nofollow, noarchive',
        canonicalPath: '/signup',
        structuredData: [routePageData('/signup', 'إنشاء حساب | SQB', 'صفحة إنشاء حساب خاصة.')]
    },
    '/quiz-dynamic': {
        title: 'جلسة اختبار | SQB',
        description: 'صفحة جلسة اختبار داخلية.',
        keywords: 'جلسة اختبار SQB',
        robots: 'noindex, nofollow, noarchive',
        canonicalPath: '/quizs',
        structuredData: [routePageData('/quizs', 'جلسة اختبار | SQB', 'صفحة جلسة اختبار داخلية.')]
    },
    default: {
        title: 'SQB | بنك أسئلة SMLE',
        description: 'منصة عربية للتحضير لاختبار SMLE والبرومترك من خلال بنك أسئلة وتحليلات أداء.',
        keywords: 'SQB, SMLE, Prometric, بنك أسئلة SMLE',
        robots: 'noindex, nofollow, noarchive',
        structuredData: [routePageData('/', 'SQB', 'منصة تحضير لاختبار SMLE والبرومترك.')]
    }
};

function resolveRouteKey(pathname) {
    if (pathname.startsWith('/signup/')) {
        return '/signup-token';
    }

    if (/^\/quiz\/[^/]+/.test(pathname)) {
        return '/quiz-dynamic';
    }

    return routeMap[pathname] ? pathname : 'default';
}

export function getSeoConfig(pathname = '/') {
    const key = resolveRouteKey(pathname);
    const route = routeMap[key] || routeMap.default;
    const canonicalPath = route.canonicalPath || pathname;

    return {
        title: route.title,
        description: route.description,
        keywords: route.keywords,
        image: route.image || DEFAULT_IMAGE,
        imageAlt: route.imageAlt || route.title,
        url: makeUrl(canonicalPath),
        type: pathname === '/' ? 'website' : 'article',
        lang: 'ar',
        dir: 'rtl',
        siteName: SITE_NAME,
        robots: route.robots || DEFAULT_ROBOTS,
        locale: 'ar_SA',
        alternates: route.alternates || [],
        structuredData: route.structuredData || []
    };
}

export function getPrerenderRoutes() {
    return Object.entries(routeMap)
        .filter(([path, config]) => path !== 'default' && config.prerenderHtml)
        .map(([path, config]) => ({
            path,
            html: config.prerenderHtml,
            seo: getSeoConfig(path)
        }));
}

export { DEFAULT_IMAGE, SITE_NAME, SITE_ORIGIN };