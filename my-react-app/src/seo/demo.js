/**
 * /demo — SEO metadata and the crawler-visible body.
 *
 * The page itself is an interactive quiz, which a crawler can neither play nor
 * see: React renders it from a lazily-fetched data file after hydration. What
 * is prerendered here is therefore a description of the offer, not a fake
 * transcript of a quiz — the same rule the rest of the prerender follows, which
 * is that the HTML must say something true about the page a person would find.
 *
 * It also does double duty for Sprint 1: "free SMLE questions" and "SMLE
 * practice test" are exactly the queries this page should answer, and it is
 * the only page on the site where the answer is "yes, right now, no account".
 *
 * React-free and browser-free: runs under Node at build time.
 */
import demoCopy from '../i18n/copy/demo.js';
import {
    absoluteUrl,
    alternatesFor,
    dirFor,
    localizedPath,
    ogLocale,
    schemaLang,
} from './locales.js';

export const DEMO_ROOT = '/demo';

const SITE_ORIGIN = 'https://www.smle-question-bank.com';
const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

/** Head metadata for /demo (or /en/demo). */
export function demoSeo(lang = 'ar') {
    const t = demoCopy[lang] || demoCopy.ar;
    const url = absoluteUrl(localizedPath(DEMO_ROOT, lang));
    return {
        title: t.meta.title,
        description: t.meta.description,
        keywords: lang === 'en'
            ? 'free SMLE questions, SMLE practice test, SNLE practice questions, Saudi Prometric practice, medical MCQ practice'
            : 'أسئلة SMLE مجانية, اختبار تجريبي SMLE, أسئلة تمريض SNLE, تجربة بنك أسئلة, برومترك',
        image: `${SITE_ORIGIN}/og-image.svg`,
        imageAlt: t.meta.title,
        url,
        type: 'website',
        siteName: 'SQB',
        robots: 'index, follow, max-image-preview:large, max-snippet:-1',
        lang,
        locale: ogLocale(lang),
        alternates: alternatesFor(DEMO_ROOT),
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: t.title,
                description: t.meta.description,
                url,
                inLanguage: schemaLang(lang),
                isPartOf: { '@type': 'WebSite', name: 'SQB', url: SITE_ORIGIN },
                // Stated because it is the page's whole proposition, and because
                // it is true: no account, no card, nothing behind a wall.
                isAccessibleForFree: true,
            },
        ],
    };
}

/** The crawler-visible body for /demo. */
export function demoHtml(lang = 'ar', { footerNav = '' } = {}) {
    const t = demoCopy[lang] || demoCopy.ar;
    const isEn = lang === 'en';
    const p = (path) => localizedPath(path, lang);

    return `
    <main class="demo" dir="${dirFor(lang)}">
      <header class="demo-hero">
        <p class="demo-kicker">${escapeHtml(t.kicker)}</p>
        <h1>${escapeHtml(t.title)}</h1>
        <p>${escapeHtml(t.intro)}</p>
      </header>
      <section>
        <h2>${escapeHtml(t.trackQuestion)}</h2>
        <ul>
          <li><strong>${escapeHtml(t.tracks.medical.label)}</strong> — ${escapeHtml(t.tracks.medical.exam)}</li>
          <li><strong>${escapeHtml(t.tracks.nursing.label)}</strong> — ${escapeHtml(t.tracks.nursing.exam)}</li>
        </ul>
      </section>
      <section>
        <h2>${escapeHtml(isEn ? 'What the demo is' : 'ما هي هذه التجربة')}</h2>
        <p>${escapeHtml(isEn
        ? 'Twenty questions drawn from the same bank subscribers practise on, in the format the exam uses: a clinical stem, four options, one answer. You pick, you find out immediately whether you were right, and you read the written explanation for why — the concept behind the question, how the presentation is distinguished, and how it is managed.'
        : 'عشرون سؤالاً من البنك نفسه الذي يتدرّب عليه المشتركون، بصيغة الاختبار: حالة سريرية وأربعة خيارات وإجابة واحدة. تختار، تعرف فوراً إن كنت مصيباً، ثم تقرأ الشرح المكتوب للسبب — المفهوم خلف السؤال، وكيف يُميَّز، وكيف يُعالج.')}</p>
        <p>${escapeHtml(isEn
        ? 'No account, no email address and no payment card. Nothing is asked for before you have seen the questions.'
        : 'بدون حساب وبدون بريد إلكتروني وبدون بطاقة. لا نطلب منك شيئاً قبل أن ترى الأسئلة.')}</p>
      </section>
      <section>
        <h2>${escapeHtml(isEn ? 'After the twenty' : 'بعد العشرين سؤالاً')}</h2>
        <p>${escapeHtml(t.result.ctaBody)}</p>
        <p><a href="${p('/signup')}">${escapeHtml(t.result.cta)}</a></p>
      </section>
      <nav aria-label="${escapeHtml(isEn ? 'Related pages' : 'صفحات ذات صلة')}">
        <a href="${p('/questions')}">${escapeHtml(t.result.browse)}</a>
        <a href="${p('/past-papers')}">${escapeHtml(isEn ? 'Question collections' : 'مجموعات الأسئلة')}</a>
        <a href="${p('/guides')}">${escapeHtml(isEn ? 'Study guides' : 'أدلة التحضير')}</a>
      </nav>
${footerNav}
    </main>
  `;
}

/**
 * The build-time route for /demo, in one language.
 *
 * Same `{ path, html, seo }` shape the question and collection builders return,
 * so scripts/postbuild-seo.mjs can flat-map it in beside them without knowing
 * anything about this page.
 */
export function buildDemoRoutes(lang = 'ar', { footerNav = '' } = {}) {
    return [{
        path: localizedPath(DEMO_ROOT, lang),
        html: demoHtml(lang, { footerNav }),
        seo: demoSeo(lang),
    }];
}
