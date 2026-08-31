import guidesCopy from '../i18n/copy/guides.js';
import { guideArticleHtml, guidesHubHtml, guidesTeaserHtml, siteFooterNavHtml } from './prerenderHtml.js';
import { EN_PRERENDER, FAQ_ITEMS_EN, enLandingHtml, enQuestionsTeaserHtml } from './staticPrerenderEn.js';
import {
    absoluteUrl,
    alternatesFor,
    hasEnglishTwin,
    localizedPath,
    ogLocale,
    stripLocale,
} from './locales.js';

const SITE_ORIGIN = 'https://www.smle-question-bank.com';
const SITE_NAME = 'SQB';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-image.svg`;
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
// Freshness signal: recomputed at module load (build time for prerendered HTML,
// current date for client-injected JSON-LD). Keeps `dateModified` from going stale.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

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
        question: 'هل تدعم SQB مسار التمريض SNLE؟',
        answer: 'نعم، SQB توفر مساراً كاملاً ومستقلاً للتمريض يغطي أساسيات التمريض والتمريض الباطني والجراحي وتمريض الأمومة والمواليد وتمريض الأطفال والصحة النفسية والأدوية وحسابات الجرعات، بأسئلته وملخصاته وتحليلات أدائه الخاصة.'
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

function articleSchema(path, headline, description, keywords = '') {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        url: makeUrl(path),
        inLanguage: 'ar-SA',
        datePublished: '2026-04-21',
        dateModified: BUILD_DATE,
        author: {
            '@type': 'Organization',
            name: 'SQB'
        },
        publisher: {
            '@type': 'EducationalOrganization',
            name: 'SQB',
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_ORIGIN}/icons/icon-512.png`
            }
        },
        image: DEFAULT_IMAGE,
        keywords
    };
}

function courseSchema(path, name, description, keywords = '') {
    return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name,
        description,
        url: makeUrl(path),
        inLanguage: 'ar-SA',
        educationalLevel: 'Professional',
        about: 'Saudi Medical Licensing Examination (SMLE)',
        keywords,
        provider: {
            '@type': 'EducationalOrganization',
            name: 'SQB',
            sameAs: SITE_ORIGIN
        }
    };
}

const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'اس كيو بي',
    alternateName: 'SQB',
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/icons/icon-512.png`,
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
    description: 'منصة عربية للتحضير لاختبار SMLE للطب البشري وSNLE للتمريض والبرومترك، من خلال بنك أسئلة وتحليلات أداء ومسارات تدريب عملية.'
};

const routeMap = {
    '/': {
        title: 'اس كيو بي | بنك أسئلة SMLE وSNLE وبرومترك في السعودية',
        description: 'منصة SQB تساعدك على التحضير لاختبار SMLE للطب البشري وSNLE للتمريض والبرومترك، عبر بنك أسئلة عربي، تحليلات أداء، اختبارات تدريبية، ومراجعة ذكية لطلاب الطب والتمريض في السعودية.',
        keywords: 'SMLE, SNLE, Prometric, Saudi Medical Licensing Examination, Saudi Nursing Licensure Examination, بنك أسئلة SMLE, بنك اسئلة تمريض, اسئلة SNLE, اسئلة برومترك, اسئلة الهيئة السعودية للتخصصات الصحية, تحضير SMLE, تحضير اختبار التمريض, منصة طبية, بنك اسئلة طبية, Saudi Prometric questions, nursing MCQ, medical MCQ',
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
          <h1>منصة عربية للتحضير لاختبار SMLE وSNLE والبرومترك</h1>
          <p>بنك أسئلة، تحليلات أداء، مراجعة للأخطاء، واختبارات تدريبية تساعد طلاب الطب والتمريض والأطباء في السعودية على الاستعداد لاختبارات الهيئة السعودية للتخصصات الصحية.</p>
        </header>
        <section>
          <h2>لماذا يستخدم الطلاب والأطباء منصة SQB؟</h2>
          <p>لأنها تجمع بين الأسئلة التدريبية المنظمة، وتتبع التقدم، والقدرة على التركيز على نقاط الضعف، مع تجربة عربية سهلة على الجوال والكمبيوتر.</p>
        </section>
        <section>
          <h2>مساران مستقلان: طب بشري وتمريض</h2>
          <p>تختار مسارك عند إنشاء الحساب. مسار الطب البشري يغطي الباطنة والجراحة والأطفال والنساء والولادة، ومسار التمريض يغطي أساسيات التمريض والتمريض الباطني والجراحي وتمريض الأمومة والمواليد وتمريض الأطفال والصحة النفسية والأدوية وحسابات الجرعات. كل مسار له بنك أسئلته وملخصاته وتحليلات أدائه الخاصة.</p>
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
        <section>
          <h2>أسئلة تدريبية مجانية بدون حساب</h2>
          <p>نشرنا عيّنة من بنك الأسئلة مفتوحة للجميع: أسئلة بنمط الاختبار في الطب البشري والتمريض، كل سؤال بخياراته الأربعة وشرح مكتوب يوضّح سبب صحة الإجابة. لا تحتاج حساباً ولا بطاقة دفع لقراءتها.</p>
          <p><a href="/questions">تصفّح الأسئلة التدريبية المجانية</a></p>
        </section>
${guidesTeaserHtml(guidesCopy.ar.hub, {
        heading: 'أدلة التحضير لاختبار SMLE والبرومترك',
        intro: 'أدلة مكتوبة بالكامل ومتاحة للجميع بدون حساب: كيف تستخدم بنك الأسئلة، وخطة مذاكرة من 12 أسبوعاً، ومراجعة الأخطاء، والفرق بين SMLE وبرومترك، والمواضيع عالية العائد.'
    })}
        <nav aria-label="روابط مهمة">
          <a href="/about">من نحن</a>
          <a href="/guides">أدلة التحضير</a>
          <a href="/questions">أسئلة تدريبية مجانية</a>
          <a href="/past-papers">تجميعات الأسئلة</a>
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
        // The English twin gets English FAQ entities; the same markup describing
        // Arabic answers on an English page would be describing text that page
        // does not contain.
        structuredDataEn: [
            {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                inLanguage: 'en',
                mainEntity: FAQ_ITEMS_EN.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: { '@type': 'Answer', text: item.answer }
                }))
            }
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
        // Indexable on purpose. This page carries the business's real contact
        // details, and it already has ContactPage structured data, breadcrumbs,
        // hreflang alternates and prerendered HTML — all of which were wasted
        // while it was marked `noindex, nofollow`. A reachable contact page is
        // a standard trust signal for a registered business; `nofollow` was
        // also throwing away its internal links.
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
    // Only the logged-out half of /groups is indexable — GroupsPage flips the
    // robots tag to noindex once a session exists, because the signed-in view
    // lists a person's own seats and invite links.
    '/groups': {
        title: 'الاشتراك الجماعي | SQB',
        description: 'اشتراك جماعي في SQB لك ولأصدقائك: 3 حسابات بـ 250 ريالاً أو 5 حسابات بـ 299 ريالاً لمدة أربعة أشهر، بدفعة واحدة وروابط دعوة توزّعها بنفسك.',
        keywords: 'اشتراك جماعي SMLE, بنك أسئلة للمجموعات, اشتراك SQB للأصدقاء, خصم مجموعات',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/groups', 'الاشتراك الجماعي | SQB', 'خطط الاشتراك الجماعي في منصة SQB.'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'الاشتراك الجماعي', path: '/groups' }
            ])
        ],
        prerenderHtml: `
      <main class="seo-shell" dir="rtl">
        <h1>الاشتراك الجماعي</h1>
        <p>دفعة واحدة تفعّل حسابك مباشرة وتعطيك روابط دعوة لبقية المقاعد توزّعها على أصدقائك. كل المقاعد تنتهي في نفس التاريخ، وكل رابط يفتح حساباً واحداً فقط.</p>
        <ul>
          <li>3 حسابات لمدة 4 أشهر — 250 ريالاً (83 ريالاً للحساب)</li>
          <li>5 حسابات لمدة 4 أشهر — 299 ريالاً (60 ريالاً للحساب)</li>
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
    '/refund-policy': {
        title: 'سياسة الاسترداد | SQB',
        description: 'سياسة الاسترداد لمنصة SQB. الخدمة مجانية حالياً ولا تُحصّل أي مدفوعات. تشرح هذه الصفحة شروط الاسترداد المستقبلية في حال تفعيل الاشتراك المدفوع.',
        keywords: 'سياسة الاسترداد SQB, refund policy SMLE, استرداد الاشتراك, منصة طبية',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/refund-policy', 'سياسة الاسترداد | SQB', 'سياسة الاسترداد الخاصة بمنصة SQB.'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'سياسة الاسترداد', path: '/refund-policy' }
            ])
        ],
        prerenderHtml: `
      <main class="seo-shell" dir="rtl">
        <h1>سياسة الاسترداد</h1>
        <p>الخدمة مجانية حالياً ولا تُحصّل أي مدفوعات. تشرح هذه الصفحة شروط الاسترداد المستقبلية عند تفعيل الاشتراك المدفوع.</p>
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
        prerenderHtml: guidesHubHtml(guidesCopy.ar.hub)
    },
    '/guides/how-to-use-a-question-bank': {
        title: 'كيف تستخدم بنك الأسئلة لرفع أدائك في SMLE والبرومترك | SQB',
        description: 'دليل عملي لاستخدام بنك الأسئلة بالترتيب الصحيح: جلسة تشخيصية، حل تحت ظروف الاختبار، مراجعة الأخطاء، وتوزيع الأسئلة حسب العائد لرفع أدائك في SMLE والبرومترك.',
        keywords: 'كيف تستخدم بنك الأسئلة, how to use a question bank, question bank strategy SMLE, question bank prometric exam, تحسين الأداء ببنك الأسئلة, smle qbank tips',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/guides/how-to-use-a-question-bank', 'كيف تستخدم بنك الأسئلة لرفع أدائك في SMLE والبرومترك | SQB', 'دليل عملي لاستخدام بنك الأسئلة بالترتيب الصحيح لرفع الأداء في SMLE والبرومترك.'),
            articleSchema('/guides/how-to-use-a-question-bank', 'كيف تستخدم بنك الأسئلة لرفع أدائك في SMLE والبرومترك | SQB', 'دليل عملي لاستخدام بنك الأسئلة بالترتيب الصحيح لرفع الأداء في SMLE والبرومترك.', 'كيف تستخدم بنك الأسئلة, how to use a question bank, question bank strategy SMLE'),
            courseSchema('/guides/how-to-use-a-question-bank', 'كيف تستخدم بنك الأسئلة لرفع أدائك في SMLE والبرومترك', 'دليل عملي لاستخدام بنك الأسئلة بالترتيب الصحيح لرفع الأداء في SMLE والبرومترك.', 'كيف تستخدم بنك الأسئلة, how to use a question bank, question bank strategy SMLE'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'الأدلة', path: '/guides' },
                { name: 'كيف تستخدم بنك الأسئلة', path: '/guides/how-to-use-a-question-bank' }
            ])
        ],
        prerenderHtml: guideArticleHtml(guidesCopy.ar.howToUseBank, { hub: guidesCopy.ar.hub, currentPath: '/guides/how-to-use-a-question-bank' })
    },
    '/guides/smle-study-plan': {
        title: 'خطة SMLE من 12 أسبوع | SQB',
        description: 'دليل عملي لبناء خطة مذاكرة 12 أسبوع لاختبار SMLE: تقسيم المراحل، إدارة الوقت، ومؤشرات الجاهزية قبل يوم الاختبار.',
        keywords: 'خطة SMLE, study plan SMLE, جدول مذاكرة SMLE, التحضير لاختبار الهيئة السعودية',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/guides/smle-study-plan', 'خطة SMLE من 12 أسبوع | SQB', 'دليل تدريجي للتحضير لاختبار SMLE خلال 12 أسبوع.'),
            articleSchema('/guides/smle-study-plan', 'خطة SMLE من 12 أسبوع | SQB', 'دليل تدريجي للتحضير لاختبار SMLE خلال 12 أسبوع.', 'خطة SMLE, study plan SMLE, جدول مذاكرة SMLE'),
            courseSchema('/guides/smle-study-plan', 'خطة SMLE من 12 أسبوع', 'دليل تدريجي للتحضير لاختبار SMLE خلال 12 أسبوع.', 'خطة SMLE, study plan SMLE, جدول مذاكرة SMLE'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'الأدلة', path: '/guides' },
                { name: 'خطة 12 أسبوع', path: '/guides/smle-study-plan' }
            ])
        ],
        prerenderHtml: guideArticleHtml(guidesCopy.ar.studyPlan, { hub: guidesCopy.ar.hub, currentPath: '/guides/smle-study-plan' })
    },
    '/guides/wrong-questions-method': {
        title: 'طريقة مراجعة الأسئلة الخاطئة | SQB',
        description: 'طريقة عملية لتحويل أخطاء أسئلة SMLE إلى قواعد قرار ثابتة: تصنيف الخطأ، التكرار المتباعد، وبناء قائمة أخطاء عالية العائد.',
        keywords: 'مراجعة الأخطاء SMLE, wrong questions method, أخطاء اختبار SMLE, تحسين دقة الإجابة',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/guides/wrong-questions-method', 'طريقة مراجعة الأسئلة الخاطئة | SQB', 'دليل عملي لمنهجية مراجعة الأسئلة الخاطئة في SMLE.'),
            articleSchema('/guides/wrong-questions-method', 'طريقة مراجعة الأسئلة الخاطئة | SQB', 'دليل عملي لمنهجية مراجعة الأسئلة الخاطئة في SMLE.', 'مراجعة الأخطاء SMLE, wrong questions method, أخطاء اختبار SMLE'),
            courseSchema('/guides/wrong-questions-method', 'طريقة مراجعة الأسئلة الخاطئة في SMLE', 'دليل عملي لمنهجية مراجعة الأسئلة الخاطئة في SMLE.', 'مراجعة الأخطاء SMLE, wrong questions method, أخطاء اختبار SMLE'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'الأدلة', path: '/guides' },
                { name: 'مراجعة الأخطاء', path: '/guides/wrong-questions-method' }
            ])
        ],
        prerenderHtml: guideArticleHtml(guidesCopy.ar.wrongQuestions, { hub: guidesCopy.ar.hub, currentPath: '/guides/wrong-questions-method' })
    },
    '/guides/smle-vs-prometric-differences': {
        title: 'الفرق بين SMLE وPrometric | SQB',
        description: 'مقارنة عملية بين SMLE وPrometric من حيث نمط الأسئلة وإدارة الوقت واستراتيجية المذاكرة لتحسين الأداء قبل الاختبار.',
        keywords: 'الفرق بين SMLE وPrometric, SMLE vs Prometric, اختبار الهيئة السعودية, طريقة مذاكرة البرومترك',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/guides/smle-vs-prometric-differences', 'الفرق بين SMLE وPrometric | SQB', 'دليل يشرح الفروقات العملية بين اختبار SMLE وبرومترك.'),
            articleSchema('/guides/smle-vs-prometric-differences', 'الفرق بين SMLE وPrometric | SQB', 'دليل يشرح الفروقات العملية بين اختبار SMLE وبرومترك.', 'الفرق بين SMLE وPrometric, SMLE vs Prometric, اختبار الهيئة السعودية'),
            courseSchema('/guides/smle-vs-prometric-differences', 'الفرق بين SMLE وPrometric', 'دليل يشرح الفروقات العملية بين اختبار SMLE وبرومترك.', 'الفرق بين SMLE وPrometric, SMLE vs Prometric, اختبار الهيئة السعودية'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'الأدلة', path: '/guides' },
                { name: 'الفرق بين SMLE وPrometric', path: '/guides/smle-vs-prometric-differences' }
            ])
        ],
        prerenderHtml: guideArticleHtml(guidesCopy.ar.vsPrometric, { hub: guidesCopy.ar.hub, currentPath: '/guides/smle-vs-prometric-differences' })
    },
    '/guides/smle-high-yield-topics': {
        title: 'أهم مواضيع SMLE عالية العائد | SQB',
        description: 'دليل لتحديد مواضيع SMLE الأكثر تأثيرا على الدرجة مع نموذج عملي لتوزيع وقت المذاكرة وفق الأولويات.',
        keywords: 'مواضيع SMLE عالية العائد, high yield SMLE topics, أولويات مذاكرة SMLE, توزيع وقت SMLE',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            routePageData('/guides/smle-high-yield-topics', 'أهم مواضيع SMLE عالية العائد | SQB', 'دليل يوضح ترتيب أولويات مواضيع SMLE حسب العائد.'),
            articleSchema('/guides/smle-high-yield-topics', 'أهم مواضيع SMLE عالية العائد | SQB', 'دليل يوضح ترتيب أولويات مواضيع SMLE حسب العائد.', 'مواضيع SMLE عالية العائد, high yield SMLE topics, أولويات مذاكرة SMLE'),
            courseSchema('/guides/smle-high-yield-topics', 'أهم مواضيع SMLE عالية العائد', 'دليل يوضح ترتيب أولويات مواضيع SMLE حسب العائد.', 'مواضيع SMLE عالية العائد, high yield SMLE topics, أولويات مذاكرة SMLE'),
            breadcrumbs([
                { name: 'الرئيسية', path: '/' },
                { name: 'الأدلة', path: '/guides' },
                { name: 'مواضيع SMLE عالية العائد', path: '/guides/smle-high-yield-topics' }
            ])
        ],
        prerenderHtml: guideArticleHtml(guidesCopy.ar.highYield, { hub: guidesCopy.ar.hub, currentPath: '/guides/smle-high-yield-topics' })
    },
    // Runtime placeholder for /questions and everything under it.
    //
    // No prerenderHtml here on purpose: those pages are emitted by
    // scripts/postbuild-seo.mjs from src/seo/publicQuestions.js, which is also
    // where their real per-page title, description and schema live. This entry
    // exists only so a client-side navigation into the library does not fall
    // through to the site-wide default for the moment before the question data
    // chunk resolves and the page renders its own <SEO>. Kept deliberately
    // generic so there is nothing here that can drift out of sync.
    // Same arrangement as /questions below: a generic placeholder for the
    // moment before the collection data resolves, with the real per-page
    // metadata rendered by the page from src/seo/pastPapers.js.
    '/past-papers': {
        title: 'تجميعات أسئلة SMLE وSNLE | SQB',
        description: 'دليل تجميعات أسئلة اختبار الهيئة السعودية للتخصصات الصحية للطب والتمريض، مع أسئلة مفتوحة من كل تجميعة بدون حساب.',
        keywords: 'smle past papers, تجميعات سملي, تجميعات SMLE, تجميعات SNLE, اسئلة سملي سابقة',
        alternates: ['ar-SA', 'ar', 'x-default']
    },
    // Placeholder only — the real head for /demo is built in seo/demo.js and
    // applied both at build time and by the page's own <SEO> after hydration.
    '/demo': {
        title: 'جرّب بنك الأسئلة — ٢٠ سؤالاً بدون حساب | SQB',
        description: 'جرّب أسئلة SMLE وSNLE حقيقية بشرح كامل لكل إجابة، بدون تسجيل وبدون بريد إلكتروني.',
        keywords: 'أسئلة SMLE مجانية, اختبار تجريبي SMLE, تجربة بنك أسئلة, أسئلة تمريض SNLE',
        alternates: ['ar-SA', 'ar', 'x-default']
    },
    '/questions': {
        title: 'أسئلة تدريبية مجانية لاختبار SMLE وSNLE | SQB',
        description: 'أسئلة تدريبية بنمط اختبار الهيئة السعودية للتخصصات الصحية، مع الإجابة الصحيحة وشرح مكتوب لكل سؤال، مفتوحة بدون حساب.',
        keywords: 'أسئلة SMLE مجانية, اسئلة SNLE, اسئلة برومترك مجانية, SMLE practice questions, بنك أسئلة مجاني',
        alternates: ['ar-SA', 'ar', 'x-default']
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
    // /signup and /login carry `noindex` while robots.txt deliberately leaves
    // both crawlable — see the comment there. Blocking the crawl would stop
    // Googlebot ever reading this directive, which is the one thing that keeps
    // a bare auth form out of the results. Do not "tidy" one without the other.
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
    '/summaries': {
        title: 'الملخصات | SQB',
        description: 'ملخصات المواضيع داخل منصة SQB — محتوى خاص بالأعضاء.',
        keywords: 'ملخصات SQB, ملخصات SMLE',
        robots: 'noindex, nofollow, noarchive',
        structuredData: [routePageData('/summaries', 'الملخصات | SQB', 'صفحة الملخصات الداخلية.')]
    },
    '/summaries-detail': {
        title: 'ملخص الموضوع | SQB',
        description: 'صفحة ملخص موضوع داخلية — محتوى خاص بالأعضاء.',
        keywords: 'ملخص SMLE',
        robots: 'noindex, nofollow, noarchive',
        canonicalPath: '/summaries',
        structuredData: [routePageData('/summaries', 'ملخص الموضوع | SQB', 'صفحة ملخص داخلية.')]
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
    // Fallback for any path with no entry above — utility pages and, notably,
    // unmatched URLs (the 404 screen). noindex so mistyped/dead links never
    // enter the index, and canonical points at the homepage rather than at the
    // junk path itself.
    default: {
        title: 'SQB | بنك أسئلة SMLE وSNLE',
        description: 'منصة عربية للتحضير لاختبار SMLE للطب البشري وSNLE للتمريض والبرومترك، من خلال بنك أسئلة وتحليلات أداء.',
        keywords: 'SQB, SMLE, SNLE, Prometric, بنك أسئلة SMLE, بنك أسئلة تمريض',
        robots: 'noindex, nofollow, noarchive',
        canonicalPath: '/',
        structuredData: [routePageData('/', 'SQB', 'منصة تحضير لاختبارات SMLE وSNLE والبرومترك.')]
    }
};

/**
 * English overlay for the browser tab title and meta description.
 *
 * Deliberately NOT a full second SEO surface: canonical URLs, hreflang, JSON-LD
 * and the prerendered HTML stay Arabic, because each page is indexed at exactly
 * one URL and that URL's indexed language should not change based on a
 * visitor's client-side toggle. This map only fixes what an English-reading
 * visitor actually sees — the tab title and the share/description string.
 */
const enOverlay = {
    '/': {
        title: 'SQB | SMLE & SNLE Question Bank for Saudi Arabia',
        description: 'SQB helps you prepare for the SMLE (medicine), the SNLE (nursing) and Prometric exams with a large question bank, performance analytics, mock exams and smart review.'
    },
    '/about': { title: 'About us | SQB', description: 'Who is behind SQB, what the platform offers, and how it helps you prepare for the SMLE, SNLE and Prometric exams.' },
    '/faq': { title: 'Frequently asked questions | SQB', description: 'Answers to the most common questions about SQB: subscriptions, the question bank, the nursing track, refunds and support.' },
    '/contact': { title: 'Contact us | SQB', description: 'Get in touch with the SQB team by email or WhatsApp for help, feedback or billing questions.' },
    '/privacy': { title: 'Privacy Policy | SQB', description: 'How SQB collects, uses and protects your personal data.' },
    '/terms': { title: 'Terms of Service | SQB', description: 'The terms that govern your use of the SQB platform.' },
    '/refund-policy': { title: 'Refund Policy | SQB', description: 'When and how you can request a refund for an SQB subscription.' },
    '/groups': { title: 'Group plans | SQB', description: 'Share one SQB subscription with your study group: 3 accounts for SAR 250 or 5 for SAR 299 over four months, one payment, invite links you hand out yourself.' },
    '/guides': { title: 'SMLE study guides | SQB', description: 'Practical guides for preparing for the SMLE: study plans, high-yield topics, and how to review your wrong questions.' },
    '/guides/how-to-use-a-question-bank': { title: 'How to Use a Question Bank to Improve Your SMLE & Prometric Performance | SQB', description: 'A practical guide to using a question bank the right way: a diagnostic session, timed practice, reviewing every answer as data, and weighting questions by topic yield.' },
    '/guides/smle-study-plan': { title: 'The 12-week SMLE study plan | SQB', description: 'A week-by-week SMLE study plan you can actually follow, built around question practice and spaced review.' },
    '/guides/wrong-questions-method': { title: 'How to review your wrong questions | SQB', description: 'A repeatable method for turning every wrong answer into a question you will never miss again.' },
    '/guides/smle-vs-prometric-differences': { title: 'SMLE vs Prometric: the differences | SQB', description: 'What actually differs between the SMLE and Prometric exams, and what it means for how you prepare.' },
    '/guides/smle-high-yield-topics': { title: 'High-yield SMLE topics | SQB', description: 'The topics that carry the most marks in the SMLE, and how much time each one deserves.' },
    '/login': { title: 'Log in | SQB', description: 'Log in to your SQB account to continue studying.' },
    '/signup': { title: 'Create a free account | SQB', description: 'Create an SQB account and start practising for the SMLE, SNLE and Prometric exams.' },
    '/quizs': { title: 'Start a quiz | SQB', description: 'Choose how many questions to practise and which mode to use.' },
    '/suggestions': { title: 'Suggestions and ideas | SQB', description: 'Send the SQB team your suggestions.' },
    '/analysis': { title: 'Performance analytics | SQB', description: 'Your performance analytics inside SQB.' },
    '/summaries': { title: 'Study material | SQB', description: 'Topic summaries inside SQB — members-only content.' },
    '/summaries-detail': { title: 'Topic summary | SQB', description: 'A topic summary page — members-only content.' },
    '/wrong-questions': { title: 'Review your wrong questions | SQB', description: 'Review the questions you got wrong.' },
    '/signup-token': { title: 'Create an account | SQB', description: 'A personal invite link for creating an SQB account.' },
    '/quiz-dynamic': { title: 'Quiz session | SQB', description: 'An SQB quiz session.' },
    default: { title: 'SQB | SMLE & SNLE Question Bank', description: 'Prepare for the SMLE, SNLE and Prometric exams with a question bank and performance analytics.' }
};

function resolveRouteKey(pathname) {
    if (pathname.startsWith('/signup/')) {
        return '/signup-token';
    }

    if (/^\/quiz\/[^/]+/.test(pathname)) {
        return '/quiz-dynamic';
    }

    if (/^\/summaries\/[^/]+/.test(pathname)) {
        return '/summaries-detail';
    }

    // /questions/<specialty> and /questions/<specialty>/<slug> share the
    // placeholder above; the page itself renders the precise metadata.
    if (pathname.startsWith('/questions/')) {
        return '/questions';
    }

    if (pathname.startsWith('/past-papers/')) {
        return '/past-papers';
    }

    return routeMap[pathname] ? pathname : 'default';
}

/**
 * SEO config for a pathname.
 *
 * The LANGUAGE COMES FROM THE URL, not from the visitor's toggle: /en/x is the
 * English document and /x is the Arabic one, and that has to hold no matter
 * which language the reader has selected — otherwise the page's canonical, its
 * hreflang set and its content stop agreeing, which is the exact failure this
 * whole scheme exists to fix.
 */
export function getSeoConfig(pathname = '/') {
    const { lang, path } = stripLocale(pathname);
    // /en/<something with no English twin> is not a page — the router has no
    // route for it and renders the 404. Falling through to `default` (which is
    // noindex) keeps that 404 from being dressed up in the metadata of its
    // Arabic namesake and indexed as a real page.
    const key = lang === 'en' && !hasEnglishTwin(path) ? 'default' : resolveRouteKey(path);
    const route = routeMap[key] || routeMap.default;
    const canonicalPath = route.canonicalPath || path;
    const overlay = (lang === 'en' && (enOverlay[key] || enOverlay.default)) || null;
    const title = overlay?.title || route.title;
    const description = overlay?.description || route.description;

    return {
        title,
        description,
        keywords: route.keywords,
        image: route.image || DEFAULT_IMAGE,
        imageAlt: route.imageAlt || title,
        url: absoluteUrl(localizedPath(canonicalPath, lang)),
        type: path === '/' ? 'website' : 'article',
        siteName: SITE_NAME,
        robots: route.robots || DEFAULT_ROBOTS,
        lang,
        locale: ogLocale(lang),
        // Every variant, including this one, each at its own URL. A route with
        // no English body published (see prerenderFor) still lists both, because
        // the React app serves /en for it either way.
        alternates: alternatesFor(canonicalPath),
        structuredData: (lang === 'en' && route.structuredDataEn) || route.structuredData || []
    };
}

/**
 * The English body for a hand-written route.
 *
 * The guide routes regenerate from guidesCopy.en; the rest come from
 * staticPrerenderEn.js. Returns null when no English body exists, and the
 * route is then simply not emitted into the English tree — publishing an
 * English URL containing Arabic prose would be worse than not publishing it.
 */
function englishPrerenderFor(path) {
    if (path === '/') {
        return enLandingHtml({
            questionsTeaser: enQuestionsTeaserHtml(),
            guidesTeaser: guidesTeaserHtml(guidesCopy.en.hub, {
                lang: 'en',
                heading: 'Study guides for the SMLE and Prometric exams',
                intro: 'Five complete guides, open to everyone with no account: how to use a question bank in the right order, a twelve-week plan, reviewing your mistakes, SMLE versus Prometric, and the highest-yield topics.'
            })
        });
    }
    if (path === '/guides') return guidesHubHtml(guidesCopy.en.hub, { lang: 'en' });

    const guideKey = EN_GUIDE_KEYS[path];
    if (guideKey) {
        return guideArticleHtml(guidesCopy.en[guideKey], {
            lang: 'en',
            hub: guidesCopy.en.hub,
            currentPath: path
        });
    }

    return EN_PRERENDER[path] || null;
}

const EN_GUIDE_KEYS = {
    '/guides/how-to-use-a-question-bank': 'howToUseBank',
    '/guides/smle-study-plan': 'studyPlan',
    '/guides/wrong-questions-method': 'wrongQuestions',
    '/guides/smle-vs-prometric-differences': 'vsPrometric',
    '/guides/smle-high-yield-topics': 'highYield'
};

/**
 * Prerendered routes for one language.
 *
 * The footer nav is appended rather than written into each block: it is the
 * crawler's equivalent of Footer.jsx, and it is what gives /guides (and the
 * articles below it) an internal link from every crawlable page instead of
 * none. It is generated per language so an English page's footer keeps the
 * reader in the English tree.
 */
export function getPrerenderRoutes(lang = 'ar') {
    const footerNav = siteFooterNavHtml(lang);

    return Object.entries(routeMap)
        .filter(([path, config]) => path !== 'default' && config.prerenderHtml)
        .map(([path, config]) => {
            const html = lang === 'en' ? englishPrerenderFor(path) : config.prerenderHtml;
            if (!html) return null;
            const localized = localizedPath(path, lang);
            return {
                path: localized,
                html: `${html}${footerNav}`,
                seo: getSeoConfig(localized)
            };
        })
        .filter(Boolean);
}

export { DEFAULT_IMAGE, SITE_NAME, SITE_ORIGIN };