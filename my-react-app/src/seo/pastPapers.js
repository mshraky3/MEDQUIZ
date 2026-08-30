/**
 * The collections hub — /past-papers and one page per question collection.
 *
 * Why: "smle past papers" already earns this site 58 impressions a quarter
 * with nothing to serve it. The bank is built out of named collections, the
 * landing page advertises them ("May and June monthly collections added",
 * "updated to the 2026 Midgard & Gameboy format"), and there has never been a
 * page for the people searching for exactly that.
 *
 * On the wording: the URL and the headings use the phrase people search for,
 * but the copy never claims these are official papers. They are recall-based
 * collections compiled and reviewed by SQB — SCFHS and Prometric do not
 * publish past papers, and the site already carries a disclaimer saying it is
 * unaffiliated with either. Saying "past papers" in a heading and "reviewed
 * collections" in the body would be having it both ways, so the body says what
 * they are in the first sentence.
 *
 * Grouping is by `questions.source`, which is the only collection identity the
 * schema carries. There is no sitting date on a question, so these are pages
 * per collection, not per exam sitting.
 *
 * Same constraints as publicQuestions.js: React-free, browser-free, and it
 * never imports the question JSON (postbuild reads the file and passes it in).
 */
import {
    QUESTIONS_ROOT,
    buildQuestionIndex,
    questionPath,
    specialtyPath,
} from './publicQuestions.js';

const SITE_ORIGIN = 'https://www.smle-question-bank.com';

export const PAST_PAPERS_ROOT = '/past-papers';

/**
 * Display metadata per `questions.source` value.
 *
 * Keyed by the raw source string so an unknown collection appearing in the
 * bank is skipped rather than published under a guessed name — see
 * buildCollections().
 */
const COLLECTION_META = {
    MedicalMidgard: {
        slug: 'smle-midgard',
        labelAr: 'تجميعة Midgard للطب البشري',
        labelEn: 'Midgard collection (SMLE)',
        blurbAr: 'التجميعة الأحدث لاختبار SMLE، مراجَعة بالكامل لتواكب نمط أسئلة 2026.',
        blurbEn: 'The most recent SMLE collection, fully reviewed against the 2026 question style.',
    },
    MedicalGameBoy: {
        slug: 'smle-gameboy',
        labelAr: 'تجميعة GameBoy للطب البشري',
        labelEn: 'GameBoy collection (SMLE)',
        blurbAr: 'تجميعة SMLE المعروفة باسم GameBoy، محدَّثة على نمط اختبار 2026.',
        blurbEn: 'The SMLE collection known as GameBoy, updated to the 2026 exam format.',
    },
    MedicalConfirmed: {
        slug: 'smle-confirmed',
        labelAr: 'الأسئلة المؤكدة — الطب البشري',
        labelEn: 'Confirmed questions (SMLE)',
        blurbAr: 'أسئلة SMLE التي تكرر ورودها في أكثر من مصدر وتم تدقيق إجاباتها.',
        blurbEn: 'SMLE questions reported by more than one source, with their answers checked.',
    },
    NursingConfirmed: {
        slug: 'snle-confirmed',
        labelAr: 'الأسئلة المؤكدة — التمريض',
        labelEn: 'Confirmed questions (SNLE)',
        blurbAr: 'أسئلة SNLE التي تكرر ورودها في أكثر من مصدر وتم تدقيق إجاباتها.',
        blurbEn: 'SNLE questions reported by more than one source, with their answers checked.',
    },
    NursingMostRepeated: {
        slug: 'snle-most-repeated',
        labelAr: 'الأكثر تكراراً — التمريض',
        labelEn: 'Most repeated (SNLE)',
        blurbAr: 'أسئلة SNLE الأكثر تكراراً بين الدورات، وهي أعلى ما يستحق المراجعة قبل الاختبار.',
        blurbEn: 'The SNLE questions that recur most across sittings — the highest-yield revision before the exam.',
    },
};

export function collectionPath(slug) {
    return `${PAST_PAPERS_ROOT}/${slug}`;
}

/**
 * Join the collection totals from the export with the published sample.
 *
 * A collection with no published questions still gets a page — it is a real
 * part of the bank and the count is honest — but it links to the specialty
 * indexes instead of to individual questions.
 */
export function buildCollections(payload) {
    const index = buildQuestionIndex(payload);
    const published = new Map();
    for (const question of index.questions) {
        if (!published.has(question.source)) published.set(question.source, []);
        published.get(question.source).push(question);
    }

    const collections = (payload?.collections || [])
        .filter((row) => COLLECTION_META[row.source])
        .map((row) => {
            const meta = COLLECTION_META[row.source];
            const samples = published.get(row.source) || [];

            // Which specialties this collection actually covers, with a count,
            // taken from the published sample rather than invented.
            const bySpecialty = new Map();
            for (const q of samples) {
                if (!bySpecialty.has(q.specialty)) {
                    bySpecialty.set(q.specialty, {
                        key: q.specialty,
                        labelAr: q.specialtyLabelAr,
                        labelEn: q.specialtyLabelEn,
                        path: specialtyPath(q.specialty),
                        count: 0,
                    });
                }
                bySpecialty.get(q.specialty).count += 1;
            }

            return {
                ...meta,
                source: row.source,
                track: row.track,
                total: row.total,
                path: collectionPath(meta.slug),
                samples,
                specialties: [...bySpecialty.values()].sort((a, b) => b.count - a.count),
            };
        });

    return {
        bankTotal: payload?.bankTotal || index.total,
        publishedTotal: index.total,
        collections,
        bySlug: new Map(collections.map((c) => [c.slug, c])),
        tracks: ['medical', 'nursing']
            .map((track) => ({ key: track, collections: collections.filter((c) => c.track === track) }))
            .filter((t) => t.collections.length > 0),
    };
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

export const HONESTY_NOTE_EN =
    'Neither SCFHS nor Prometric publishes past exam papers. What you find here are '
    + 'question collections assembled by the SQB team from what candidates report after '
    + 'sitting the exam, then answer-checked and rewritten to the current exam style. '
    + 'This platform is not affiliated with SCFHS or Prometric.';

export const HONESTY_NOTE_AR =
    'لا تنشر الهيئة السعودية للتخصصات الصحية ولا Prometric أوراق اختبارات سابقة. '
    + 'ما تجده هنا تجميعات أسئلة أعدّها فريق SQB اعتماداً على ما ينقله المتقدمون بعد الاختبار، '
    + 'ثم روجعت إجاباتها وأُعيدت صياغتها على نمط الاختبار الحالي. المنصة غير تابعة للهيئة أو Prometric.';

export function pastPapersHubHtml(data) {
    const groups = data.tracks
        .map((track) => {
            const label = track.key === 'medical' ? 'الطب البشري — SMLE' : 'التمريض — SNLE';
            const items = track.collections
                .map((c) => `          <li>
            <a href="${c.path}">${escapeHtml(c.labelAr)}</a> — ${c.total} سؤالاً
            <p>${escapeHtml(c.blurbAr)}</p>
          </li>`)
                .join('\n');
            return `      <section>
        <h2>${escapeHtml(label)}</h2>
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
        <p class="pq-kicker">SMLE &amp; SNLE collections</p>
        <h1>تجميعات أسئلة SMLE وSNLE</h1>
        <p>بنك SQB مبني من ${data.bankTotal} سؤالاً موزّعة على ${data.collections.length} تجميعات، لكل سؤال فيها شرح مكتوب. هذه الصفحة تشرح ما تحتويه كل تجميعة، مع أسئلة مفتوحة للاطلاع من كل واحدة منها بدون حساب.</p>
        <p class="pq-note">${escapeHtml(HONESTY_NOTE_AR)}</p>
      </header>
${groups}
      <section class="pq-cta">
        <h2>40 سؤالاً مجاناً من كل التجميعات</h2>
        <p>أنشئ حساباً مجانياً للتدرب على البنك الكامل مع تحليل أدائك حسب التخصص ومراجعة أخطائك.</p>
        <a class="pq-cta-btn" href="/signup">إنشاء حساب مجاني</a>
      </section>
      <nav class="pq-siblings" aria-label="روابط ذات صلة">
        <a href="${QUESTIONS_ROOT}">كل الأسئلة التدريبية المجانية</a>
        <a href="/guides">أدلة التحضير</a>
      </nav>
    </main>
  `;
}

export function collectionPageHtml(collection, allCollections = []) {
    const specialties = collection.specialties
        .map((s) => `          <li><a href="${s.path}">أسئلة ${escapeHtml(s.labelAr)}</a> — ${s.count} سؤالاً مفتوحاً</li>`)
        .join('\n');

    const samples = collection.samples
        .slice(0, 30)
        .map((q) => `          <li><a href="${questionPath(q)}">${escapeHtml(q.headline)}</a></li>`)
        .join('\n');

    const siblings = allCollections
        .filter((c) => c.slug !== collection.slug)
        .map((c) => `        <a href="${c.path}">${escapeHtml(c.labelAr)}</a>`)
        .join('\n');

    const trackLabel = collection.track === 'medical' ? 'SMLE' : 'SNLE';

    return `
    <main class="pq-page" dir="rtl">
      <nav class="pq-breadcrumb" aria-label="مسار التنقل">
        <a href="/">الرئيسية</a>
        <a href="${PAST_PAPERS_ROOT}">تجميعات الأسئلة</a>
      </nav>
      <header class="pq-hero">
        <p class="pq-kicker">${escapeHtml(collection.labelEn)}</p>
        <h1>${escapeHtml(collection.labelAr)}</h1>
        <p>${escapeHtml(collection.blurbAr)} تضم هذه التجميعة ${collection.total} سؤالاً بنمط اختبار ${trackLabel}، لكل سؤال منها شرح مكتوب يوضّح سبب صحة الإجابة.</p>
        <p class="pq-note">${escapeHtml(HONESTY_NOTE_AR)}</p>
      </header>
${collection.specialties.length ? `      <section>
        <h2>التخصصات التي تغطيها</h2>
        <ul>
${specialties}
        </ul>
      </section>` : ''}
${samples ? `      <section>
        <h2>أسئلة مفتوحة من هذه التجميعة</h2>
        <ol class="pq-list">
${samples}
        </ol>
      </section>` : ''}
      <section class="pq-cta">
        <h2>البنك الكامل خلف حساب مجاني</h2>
        <p>الأسئلة المعروضة هنا عيّنة. أنشئ حساباً مجانياً واحصل على 40 سؤالاً من البنك الكامل بدون بطاقة دفع.</p>
        <a class="pq-cta-btn" href="/signup">إنشاء حساب مجاني</a>
      </section>
${siblings ? `      <nav class="pq-siblings" aria-label="تجميعات أخرى">
        <h2>تجميعات أخرى</h2>
${siblings}
      </nav>` : ''}
    </main>
  `;
}

/* ------------------------------------------------------------------ *
 * SEO
 * ------------------------------------------------------------------ */

const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

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

function completeSeo(partial) {
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
        alternates: ['ar-SA', 'ar', 'x-default'],
        structuredData: partial.structuredData || [],
    };
}

export function pastPapersHubSeo(data) {
    return {
        path: PAST_PAPERS_ROOT,
        title: `تجميعات أسئلة SMLE وSNLE — ${data.bankTotal} سؤالاً مع الشرح | SQB`,
        description: `دليل تجميعات أسئلة اختبار الهيئة السعودية للتخصصات الصحية للطب والتمريض: ما تحتويه كل تجميعة، وكم سؤالاً فيها، مع أسئلة مفتوحة للاطلاع من كل واحدة بدون حساب.`,
        keywords: 'smle past papers, تجميعات سملي, تجميعات SMLE, تجميعات SNLE, اسئلة سملي سابقة, snle past papers, اسئلة برومترك سابقة',
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'تجميعات أسئلة SMLE وSNLE',
                url: makeUrl(PAST_PAPERS_ROOT),
                inLanguage: 'ar-SA',
            },
            breadcrumbList([
                { name: 'الرئيسية', path: '/' },
                { name: 'تجميعات الأسئلة', path: PAST_PAPERS_ROOT },
            ]),
        ],
    };
}

export function collectionSeo(collection) {
    const trackLabel = collection.track === 'medical' ? 'SMLE' : 'SNLE';
    return {
        path: collection.path,
        title: `${collection.labelAr} — ${collection.total} سؤال ${trackLabel} مع الشرح | SQB`,
        description: `${collection.blurbAr} ${collection.total} سؤالاً بنمط اختبار ${trackLabel}، لكل سؤال شرح مكتوب، مع أسئلة مفتوحة للاطلاع بدون حساب.`,
        keywords: `${collection.labelEn}, ${collection.labelAr}, smle past papers, تجميعات ${trackLabel}, اسئلة ${trackLabel}`,
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: collection.labelAr,
                url: makeUrl(collection.path),
                inLanguage: 'ar-SA',
                hasPart: collection.samples.slice(0, 24).map((q) => ({
                    '@type': 'Question',
                    name: q.headline,
                    url: makeUrl(questionPath(q)),
                })),
            },
            breadcrumbList([
                { name: 'الرئيسية', path: '/' },
                { name: 'تجميعات الأسئلة', path: PAST_PAPERS_ROOT },
                { name: collection.labelAr, path: collection.path },
            ]),
        ],
    };
}

/** Every /past-papers route, in the shape the prerenderer expects. */
export function buildPastPaperRoutes(payload, { footerNav = '' } = {}) {
    const data = buildCollections(payload);
    if (!data.collections.length) return [];

    const routes = [
        { path: PAST_PAPERS_ROOT, html: pastPapersHubHtml(data), seo: pastPapersHubSeo(data) },
        ...data.collections.map((collection) => ({
            path: collection.path,
            html: collectionPageHtml(collection, data.collections),
            seo: collectionSeo(collection),
        })),
    ];

    return routes.map((route) => ({
        path: route.path,
        html: `${route.html}${footerNav}`,
        seo: completeSeo(route.seo),
    }));
}

export { completeSeo as completePastPaperSeo };
