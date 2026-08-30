/**
 * The public question library: URL scheme, lookups, SEO config and crawler HTML.
 *
 * Background: the bank holds 5,033 questions, every one with a written
 * explanation, and all of them sit behind the login. Google has five pages of
 * this site indexed. scripts/exportPublicQuestions.js (in backend/) selects a
 * bounded sample into src/seo/data/publicQuestions.json, and this module turns
 * that file into routes — one static page per question, plus a per-specialty
 * index and a hub.
 *
 * Deliberately does NOT import the JSON. The payload is ~415 KB and
 * siteMetadata.js is imported by the running app, so importing it here would
 * put the whole question set in the main client bundle. Instead:
 *   - scripts/postbuild-seo.mjs reads the file with fs and passes it in,
 *   - the React routes `await import()` it, so it lands in its own async chunk
 *     that only visitors to /questions/* ever download.
 *
 * Also stays React-free and browser-free: it runs under plain Node at build
 * time.
 */

const SITE_ORIGIN = 'https://www.smle-question-bank.com';

// Specialty keys are the literal `questions.question_type` values, which
// contain spaces ("obstetrics and gynecology"). URLs get the hyphenated form.
export function specialtySlug(specialtyKey) {
    return String(specialtyKey).trim().toLowerCase().replace(/\s+/g, '-');
}

export const QUESTIONS_ROOT = '/questions';

export function specialtyPath(specialtyKey) {
    return `${QUESTIONS_ROOT}/${specialtySlug(specialtyKey)}`;
}

export function questionPath(question) {
    return `${specialtyPath(question.specialty)}/${question.slug}`;
}

/**
 * Group the flat export into the shape every consumer wants: ordered
 * specialties, questions per specialty, and slug lookups.
 */
export function buildQuestionIndex(payload) {
    const questions = (payload && payload.questions) || [];
    const bySpecialty = new Map();

    for (const question of questions) {
        if (!bySpecialty.has(question.specialty)) {
            bySpecialty.set(question.specialty, {
                key: question.specialty,
                slug: specialtySlug(question.specialty),
                track: question.track,
                labelEn: question.specialtyLabelEn,
                labelAr: question.specialtyLabelAr,
                path: specialtyPath(question.specialty),
                questions: [],
            });
        }
        bySpecialty.get(question.specialty).questions.push(question);
    }

    const specialties = [...bySpecialty.values()];
    const bySpecialtySlug = new Map(specialties.map((s) => [s.slug, s]));
    const byQuestionSlug = new Map(questions.map((q) => [q.slug, q]));

    return {
        generatedAt: payload?.generatedAt || null,
        total: questions.length,
        questions,
        specialties,
        bySpecialtySlug,
        byQuestionSlug,
        tracks: ['medical', 'nursing'].map((track) => ({
            key: track,
            specialties: specialties.filter((s) => s.track === track),
        })).filter((t) => t.specialties.length > 0),
    };
}

/**
 * Up to `limit` other questions from the same specialty.
 *
 * Every published page linking to siblings is what makes the library a
 * connected cluster instead of 240 orphans — the same problem that left the
 * five study guides at "Discovered — currently not indexed".
 */
export function relatedQuestions(index, question, limit = 6) {
    const group = index.bySpecialtySlug.get(specialtySlug(question.specialty));
    if (!group) return [];
    const others = group.questions.filter((q) => q.slug !== question.slug);
    const start = others.findIndex((q) => q.id > question.id);
    const from = start === -1 ? 0 : start;
    // Wrap around so the last question in a specialty still gets six links.
    return [...others.slice(from), ...others.slice(0, from)].slice(0, limit);
}

/**
 * The vignette minus the sentence already shown as the <h1>.
 *
 * `headline` is the stem's first sentence, so rendering both verbatim printed
 * it twice on every page. When the headline is the exact opening sentence the
 * body starts after it and the two read as one continuous vignette; when it
 * had to be truncated (trailing ellipsis) the body keeps the full stem, since
 * a shortened heading is not a substitute for the sentence.
 *
 * The structured data and the search snippet always use the complete `stem` —
 * only what a reader sees below the heading is trimmed.
 */
export function stemBody(question) {
    const { stem, headline } = question;
    if (headline && !headline.endsWith('…') && stem.startsWith(headline)) {
        const rest = stem.slice(headline.length).trim();
        // Guard against a one-sentence stem, where trimming would leave nothing.
        if (rest) return rest;
    }
    return stem;
}

/* ------------------------------------------------------------------ *
 * Crawler HTML
 * ------------------------------------------------------------------ */

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * One question page.
 *
 * The explanation renders as ordinary visible prose — not inside a collapsed
 * <details>, and not hidden behind a "reveal" the crawler is served open. A
 * page that shows Google more than it shows a reader is cloaking, and the
 * whole point of publishing these is to be a page that genuinely answers the
 * question someone searched for.
 */
export function questionPageHtml(question, related = []) {
    const options = question.options
        .map((option, i) => {
            const isCorrect = i === question.correctIndex;
            return `        <li${isCorrect ? ' class="is-correct"' : ''}>
          <span class="pq-letter">${OPTION_LETTERS[i]}</span>
          <span>${escapeHtml(option)}</span>
${isCorrect ? '          <span class="pq-correct-tag">الإجابة الصحيحة</span>\n' : ''}        </li>`;
        })
        .join('\n');

    const relatedLinks = related
        .map((q) => `        <li><a href="${questionPath(q)}">${escapeHtml(q.headline)}</a></li>`)
        .join('\n');

    return `
    <main class="pq-page" dir="rtl">
      <nav class="pq-breadcrumb" aria-label="مسار التنقل">
        <a href="/">الرئيسية</a>
        <a href="${QUESTIONS_ROOT}">أسئلة تدريبية مجانية</a>
        <a href="${specialtyPath(question.specialty)}">${escapeHtml(question.specialtyLabelAr)}</a>
      </nav>
      <article class="pq-question" lang="en" dir="ltr">
        <p class="pq-kicker">${escapeHtml(question.specialtyLabelEn)}</p>
        <h1>${escapeHtml(question.headline)}</h1>
        <p class="pq-stem">${escapeHtml(stemBody(question))}</p>
        <ol class="pq-options">
${options}
        </ol>
        <section class="pq-explanation">
          <h2>Explanation</h2>
          <p>${escapeHtml(question.explanation)}</p>
        </section>
      </article>
      <section class="pq-cta" dir="rtl">
        <h2>تدرّب على 40 سؤالاً مجاناً</h2>
        <p>هذا واحد من ${escapeHtml(String(question.specialtyLabelAr))} ضمن بنك أسئلة كامل — كل سؤال فيه بشرح مكتوب. أنشئ حساباً مجانياً واحصل على 40 سؤالاً بدون بطاقة دفع.</p>
        <a class="pq-cta-btn" href="/signup">إنشاء حساب مجاني</a>
      </section>
${related.length ? `      <nav class="pq-related" aria-label="أسئلة ذات صلة" dir="rtl">
        <h2>أسئلة أخرى في ${escapeHtml(question.specialtyLabelAr)}</h2>
        <ul>
${relatedLinks}
        </ul>
        <p><a href="${specialtyPath(question.specialty)}">كل أسئلة ${escapeHtml(question.specialtyLabelAr)}</a></p>
      </nav>` : ''}
    </main>
  `;
}

/** A specialty index — every published question in one specialty. */
export function specialtyPageHtml(group, allSpecialties = []) {
    const items = group.questions
        .map((q) => `          <li><a href="${questionPath(q)}">${escapeHtml(q.headline)}</a></li>`)
        .join('\n');

    const siblings = allSpecialties
        .filter((s) => s.slug !== group.slug)
        .map((s) => `        <a href="${s.path}">${escapeHtml(s.labelAr)}</a>`)
        .join('\n');

    return `
    <main class="pq-page" dir="rtl">
      <nav class="pq-breadcrumb" aria-label="مسار التنقل">
        <a href="/">الرئيسية</a>
        <a href="${QUESTIONS_ROOT}">أسئلة تدريبية مجانية</a>
      </nav>
      <header class="pq-hero">
        <p class="pq-kicker">${escapeHtml(group.labelEn)}</p>
        <h1>أسئلة ${escapeHtml(group.labelAr)} — تدريب مجاني بدون حساب</h1>
        <p>${group.questions.length} سؤالاً بنمط الاختبار في ${escapeHtml(group.labelAr)}، كل سؤال بخياراته الأربعة وشرح مكتوب يوضّح سبب صحة الإجابة. مفتوحة للجميع بدون تسجيل.</p>
      </header>
      <section>
        <h2>الأسئلة</h2>
        <ol class="pq-list">
${items}
        </ol>
      </section>
      <section class="pq-cta">
        <h2>هذه عيّنة — البنك الكامل أوسع بكثير</h2>
        <p>أنشئ حساباً مجانياً واحصل على 40 سؤالاً من بنك الأسئلة الكامل، مع تحليل أدائك وصفحة لمراجعة أخطائك.</p>
        <a class="pq-cta-btn" href="/signup">إنشاء حساب مجاني</a>
      </section>
${siblings ? `      <nav class="pq-siblings" aria-label="تخصصات أخرى">
        <h2>تخصصات أخرى</h2>
${siblings}
      </nav>` : ''}
    </main>
  `;
}

/** The library hub. */
export function questionsHubHtml(index) {
    const trackLabels = { medical: 'الطب البشري — SMLE', nursing: 'التمريض — SNLE' };

    const groups = index.tracks
        .map((track) => {
            const items = track.specialties
                .map((s) => `          <li><a href="${s.path}">أسئلة ${escapeHtml(s.labelAr)}</a> — ${s.questions.length} سؤالاً</li>`)
                .join('\n');
            return `      <section>
        <h2>${escapeHtml(trackLabels[track.key] || track.key)}</h2>
        <ul>
${items}
        </ul>
      </section>`;
        })
        .join('\n');

    return `
    <main class="pq-page" dir="rtl">
      <nav class="pq-breadcrumb" aria-label="مسار التنقل">
        <a href="/">الرئيسية</a>
      </nav>
      <header class="pq-hero">
        <p class="pq-kicker">Free practice questions</p>
        <h1>أسئلة تدريبية مجانية لاختبار SMLE وSNLE</h1>
        <p>${index.total} سؤالاً بنمط الاختبار، مفتوحة للجميع بدون حساب وبدون بطاقة دفع — كل سؤال بخياراته الأربعة وشرح مكتوب يوضّح سبب صحة الإجابة وسبب خطأ البقية. مأخوذة من بنك أسئلة SQB الكامل.</p>
      </header>
${groups}
      <section class="pq-cta">
        <h2>40 سؤالاً مجاناً مع حساب</h2>
        <p>الأسئلة هنا عيّنة ثابتة. أنشئ حساباً مجانياً لتتدرب على بنك الأسئلة الكامل مع تحليل أدائك حسب التخصص ومراجعة أخطائك.</p>
        <a class="pq-cta-btn" href="/signup">إنشاء حساب مجاني</a>
      </section>
    </main>
  `;
}

/* ------------------------------------------------------------------ *
 * SEO config
 * ------------------------------------------------------------------ */

function makeUrl(routePath) {
    return new URL(routePath, `${SITE_ORIGIN}/`).toString();
}

function breadcrumbList(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: makeUrl(item.path),
        })),
    };
}

/**
 * Question pages get Quiz + Question/Answer schema.
 *
 * This is the markup answer engines read to quote a page, and it is the reason
 * a question page can be cited by AI search — which already sends this site
 * more traffic than Bing does, with nothing done to earn it.
 */
function quizSchema(question, routePath) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        url: makeUrl(routePath),
        inLanguage: 'en',
        about: { '@type': 'Thing', name: question.specialtyLabelEn },
        educationalLevel: 'Professional',
        hasPart: {
            '@type': 'Question',
            eduQuestionType: 'Multiple choice',
            text: question.stem,
            acceptedAnswer: {
                '@type': 'Answer',
                text: question.options[question.correctIndex],
                explanation: question.explanation,
            },
            suggestedAnswer: question.options
                .filter((_, i) => i !== question.correctIndex)
                .map((option) => ({ '@type': 'Answer', text: option })),
        },
    };
}

export function questionSeo(question) {
    const routePath = questionPath(question);
    const description = `${question.headline} — سؤال تدريبي بنمط ${question.specialtyLabelAr} مع الإجابة الصحيحة وشرح مكتوب. مجاني وبدون حساب.`;
    return {
        path: routePath,
        title: `${question.headline} | ${question.specialtyLabelEn} | SQB`,
        description: description.slice(0, 300),
        keywords: `${question.specialtyLabelEn} MCQ, SMLE practice question, SNLE practice question, أسئلة ${question.specialtyLabelAr}, اسئلة برومترك`,
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            quizSchema(question, routePath),
            breadcrumbList([
                { name: 'الرئيسية', path: '/' },
                { name: 'أسئلة تدريبية مجانية', path: QUESTIONS_ROOT },
                { name: question.specialtyLabelAr, path: specialtyPath(question.specialty) },
                { name: question.headline, path: routePath },
            ]),
        ],
    };
}

export function specialtySeo(group) {
    return {
        path: group.path,
        title: `أسئلة ${group.labelAr} مجانية — ${group.labelEn} MCQs | SQB`,
        description: `${group.questions.length} سؤالاً تدريبياً في ${group.labelAr} بنمط اختبار الهيئة السعودية، مع الإجابة الصحيحة وشرح مكتوب لكل سؤال. مفتوحة بدون حساب.`,
        keywords: `أسئلة ${group.labelAr}, ${group.labelEn} MCQ, ${group.labelEn} questions, اسئلة SMLE, اسئلة SNLE, اسئلة برومترك`,
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: `أسئلة ${group.labelAr}`,
                url: makeUrl(group.path),
                inLanguage: 'ar-SA',
                hasPart: group.questions.slice(0, 24).map((q) => ({
                    '@type': 'Question',
                    name: q.headline,
                    url: makeUrl(questionPath(q)),
                })),
            },
            breadcrumbList([
                { name: 'الرئيسية', path: '/' },
                { name: 'أسئلة تدريبية مجانية', path: QUESTIONS_ROOT },
                { name: group.labelAr, path: group.path },
            ]),
        ],
    };
}

export function hubSeo(index) {
    return {
        path: QUESTIONS_ROOT,
        title: `${index.total} سؤال تدريبي مجاني لاختبار SMLE وSNLE | SQB`,
        description: `${index.total} سؤالاً بنمط اختبار الهيئة السعودية للتخصصات الصحية في الطب والتمريض، مع الإجابة الصحيحة وشرح مكتوب لكل سؤال. مفتوحة للجميع بدون حساب وبدون بطاقة دفع.`,
        keywords: 'أسئلة SMLE مجانية, اسئلة SNLE, اسئلة برومترك مجانية, SMLE practice questions free, SNLE MCQ, بنك أسئلة مجاني, smle past papers',
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'أسئلة تدريبية مجانية لاختبار SMLE وSNLE',
                url: makeUrl(QUESTIONS_ROOT),
                inLanguage: 'ar-SA',
            },
            breadcrumbList([
                { name: 'الرئيسية', path: '/' },
                { name: 'أسئلة تدريبية مجانية', path: QUESTIONS_ROOT },
            ]),
        ],
    };
}

/**
 * Every public-question route, ready for the prerenderer.
 *
 * Returns `{ path, html, seo }` in the same shape getPrerenderRoutes() returns,
 * so scripts/postbuild-seo.mjs can concatenate the two lists and treat them
 * identically — including in the sitemap.
 */
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

/**
 * Fill in the fields buildRouteHtml() and buildSitemap() read, so these routes
 * are interchangeable with the ones getPrerenderRoutes() returns. Kept local
 * rather than imported from siteMetadata.js so this module has no cross-import
 * back into the app's own SEO config.
 */
export function completeSeo(partial) {
    return {
        title: partial.title,
        description: partial.description,
        keywords: partial.keywords,
        image: `${SITE_ORIGIN}/og-image.svg`,
        imageAlt: partial.title,
        url: makeUrl(partial.path),
        type: 'article',
        siteName: 'SQB',
        robots: DEFAULT_ROBOTS,
        locale: 'ar_SA',
        alternates: partial.alternates || [],
        structuredData: partial.structuredData || [],
    };
}

export function buildPublicQuestionRoutes(payload, { footerNav = '' } = {}) {
    const index = buildQuestionIndex(payload);
    if (!index.total) return [];

    const routes = [
        { path: QUESTIONS_ROOT, html: questionsHubHtml(index), seo: hubSeo(index) },
    ];

    for (const group of index.specialties) {
        routes.push({
            path: group.path,
            html: specialtyPageHtml(group, index.specialties),
            seo: specialtySeo(group),
        });
    }

    for (const question of index.questions) {
        routes.push({
            path: questionPath(question),
            html: questionPageHtml(question, relatedQuestions(index, question)),
            seo: questionSeo(question),
        });
    }

    return routes.map((route) => ({
        path: route.path,
        html: `${route.html}${footerNav}`,
        seo: completeSeo(route.seo),
    }));
}
