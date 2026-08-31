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

import pastPapersCopy from '../i18n/copy/pastPapers.js';
import { faqHtml, faqPageSchema } from './faqSchema.js';
import {
    SITE_ORIGIN,
    absoluteUrl,
    alternatesFor,
    dirFor,
    localizedPath,
    ogLocale,
    schemaLang,
} from './locales.js';

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
    const bankTotal = payload?.bankTotal || index.total;
    const collectionCount = (payload?.collections || []).filter((row) => COLLECTION_META[row.source]).length;
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
                // Carried per collection rather than as a reference back to the
                // parent: the collection page's FAQ quotes both figures, and a
                // back-reference would make this structure circular.
                bankTotal,
                collectionCount,
            };
        });

    return {
        bankTotal,
        collectionCount,
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

/**
 * The collections FAQ, from the same copy the React pages render.
 *
 * The first entry is the "are these official past papers?" answer, and it is
 * first on purpose: it is the question the URL invites, and burying it would
 * make the page's phrasing feel like a trick.
 */
export function collectionsFaqItems({ bankTotal, collectionCount }, lang = 'ar') {
    const t = pastPapersCopy[lang] || pastPapersCopy.ar;
    return t.faq(bankTotal, collectionCount);
}

/** The signup CTA, shared with the question pages' wording. */
function ctaHtml(t, lang) {
    return `      <section class="pq-cta" dir="${dirFor(lang)}">
        <h2>${escapeHtml(t.cta.title)}</h2>
        <p>${escapeHtml(t.cta.body)}</p>
        <a class="pq-cta-btn" href="${localizedPath('/signup', lang)}">${escapeHtml(t.cta.button)}</a>
        <p class="pq-cta-note">${escapeHtml(t.cta.note)}</p>
      </section>`;
}

export function pastPapersHubHtml(data, lang = 'ar') {
    const t = pastPapersCopy[lang] || pastPapersCopy.ar;
    const dir = dirFor(lang);
    const note = lang === 'en' ? HONESTY_NOTE_EN : HONESTY_NOTE_AR;

    const groups = data.tracks
        .map((track) => {
            const items = track.collections
                .map((c) => `          <li>
            <a href="${localizedPath(c.path, lang)}">${escapeHtml(lang === 'en' ? c.labelEn : c.labelAr)}</a> — ${escapeHtml(t.hub.countLabel(c.total))}
            <p>${escapeHtml(lang === 'en' ? c.blurbEn : c.blurbAr)}</p>
          </li>`)
                .join('\n');
            return `      <section>
        <h2>${escapeHtml(t.hub.tracks[track.key] || track.key)}</h2>
        <ul>
${items}
        </ul>
      </section>`;
        })
        .join('\n');

    return `
    <main class="pq-page" dir="${dir}">
      <nav class="pq-breadcrumb" aria-label="${escapeHtml(t.breadcrumbLabel)}">
        <a href="${localizedPath('/', lang)}">${escapeHtml(t.breadcrumbHome)}</a>
      </nav>
      <header class="pq-hero">
        <p class="pq-kicker">${escapeHtml(t.hub.kicker)}</p>
        <h1>${escapeHtml(t.hub.title)}</h1>
        <p>${escapeHtml(t.hub.intro(data.bankTotal, data.collections.length))}</p>
        <p class="pq-note">${escapeHtml(note)}</p>
      </header>
${groups}
${ctaHtml(t, lang)}
${faqHtml(collectionsFaqItems(data, lang), t.faqTitle)}
      <nav class="pq-siblings" aria-label="${escapeHtml(t.relatedLinksLabel)}">
        <a href="${localizedPath(QUESTIONS_ROOT, lang)}">${escapeHtml(t.links.allQuestions)}</a>
        <a href="${localizedPath('/guides', lang)}">${escapeHtml(t.links.guides)}</a>
      </nav>
    </main>
  `;
}

export function collectionPageHtml(collection, allCollections = [], lang = 'ar') {
    const t = pastPapersCopy[lang] || pastPapersCopy.ar;
    const dir = dirFor(lang);
    const isEn = lang === 'en';
    const note = isEn ? HONESTY_NOTE_EN : HONESTY_NOTE_AR;
    const trackLabel = collection.track === 'medical' ? 'SMLE' : 'SNLE';

    const specialties = collection.specialties
        .map((s) => `          <li><a href="${localizedPath(s.path, lang)}">${escapeHtml(isEn ? s.labelEn : s.labelAr)}</a> — ${escapeHtml(t.collection.openCount(s.count))}</li>`)
        .join('\n');

    const samples = collection.samples
        .slice(0, 30)
        .map((q) => `          <li><a href="${localizedPath(questionPath(q), lang)}">${escapeHtml(q.headline)}</a></li>`)
        .join('\n');

    const siblings = allCollections
        .filter((c) => c.slug !== collection.slug)
        .map((c) => `        <a href="${localizedPath(c.path, lang)}">${escapeHtml(isEn ? c.labelEn : c.labelAr)}</a>`)
        .join('\n');

    return `
    <main class="pq-page" dir="${dir}">
      <nav class="pq-breadcrumb" aria-label="${escapeHtml(t.breadcrumbLabel)}">
        <a href="${localizedPath('/', lang)}">${escapeHtml(t.breadcrumbHome)}</a>
        <a href="${localizedPath(PAST_PAPERS_ROOT, lang)}">${escapeHtml(t.breadcrumbRoot)}</a>
      </nav>
      <header class="pq-hero">
        <p class="pq-kicker">${escapeHtml(collection.labelEn)}</p>
        <h1>${escapeHtml(isEn ? collection.labelEn : collection.labelAr)}</h1>
        <p>${escapeHtml(t.collection.intro(isEn ? collection.blurbEn : collection.blurbAr, collection.total, trackLabel))}</p>
        <p class="pq-note">${escapeHtml(note)}</p>
      </header>
${collection.specialties.length ? `      <section>
        <h2>${escapeHtml(t.collection.specialtiesTitle)}</h2>
        <ul>
${specialties}
        </ul>
      </section>` : ''}
${samples ? `      <section>
        <h2>${escapeHtml(t.collection.samplesTitle)}</h2>
        <ol class="pq-list">
${samples}
        </ol>
      </section>` : ''}
${ctaHtml(t, lang)}
${faqHtml(collectionsFaqItems(collection, lang), t.faqTitle)}
${siblings ? `      <nav class="pq-siblings" aria-label="${escapeHtml(t.collection.siblingsTitle)}">
        <h2>${escapeHtml(t.collection.siblingsTitle)}</h2>
${siblings}
      </nav>` : ''}
    </main>
  `;
}

/* ------------------------------------------------------------------ *
 * SEO
 * ------------------------------------------------------------------ */

const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

function breadcrumbList(items, lang) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: absoluteUrl(localizedPath(item.path, lang)),
        })),
    };
}

function completeSeo(partial, lang = 'ar') {
    return {
        title: partial.title,
        description: partial.description,
        keywords: partial.keywords,
        image: `${SITE_ORIGIN}/og-image.svg`,
        imageAlt: partial.title,
        url: absoluteUrl(localizedPath(partial.path, lang)),
        type: 'article',
        siteName: 'SQB',
        robots: DEFAULT_ROBOTS,
        lang,
        locale: ogLocale(lang),
        alternates: alternatesFor(partial.path),
        structuredData: partial.structuredData || [],
    };
}

export function pastPapersHubSeo(data, lang = 'ar') {
    const t = pastPapersCopy[lang] || pastPapersCopy.ar;
    const hubUrl = absoluteUrl(localizedPath(PAST_PAPERS_ROOT, lang));
    return {
        path: PAST_PAPERS_ROOT,
        title: t.seo.hubTitle(data.bankTotal),
        description: t.seo.hubDescription,
        keywords: t.seo.hubKeywords,
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: t.seo.hubCollectionName,
                url: hubUrl,
                inLanguage: schemaLang(lang),
            },
            faqPageSchema(collectionsFaqItems(data, lang), hubUrl, lang),
            breadcrumbList([
                { name: t.breadcrumbHome, path: '/' },
                { name: t.breadcrumbRoot, path: PAST_PAPERS_ROOT },
            ], lang),
        ].filter(Boolean),
    };
}

export function collectionSeo(collection, lang = 'ar') {
    const t = pastPapersCopy[lang] || pastPapersCopy.ar;
    const isEn = lang === 'en';
    const label = isEn ? collection.labelEn : collection.labelAr;
    const trackLabel = collection.track === 'medical' ? 'SMLE' : 'SNLE';
    const url = absoluteUrl(localizedPath(collection.path, lang));
    return {
        path: collection.path,
        title: t.seo.collectionTitle(label, collection.total, trackLabel),
        description: t.seo.collectionDescription(
            isEn ? collection.blurbEn : collection.blurbAr,
            collection.total,
            trackLabel
        ),
        keywords: t.seo.collectionKeywords(collection.labelAr, collection.labelEn, trackLabel),
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: label,
                url,
                inLanguage: schemaLang(lang),
                hasPart: collection.samples.slice(0, 24).map((q) => ({
                    '@type': 'Question',
                    name: q.headline,
                    url: absoluteUrl(localizedPath(questionPath(q), lang)),
                })),
            },
            faqPageSchema(collectionsFaqItems(collection, lang), url, lang),
            breadcrumbList([
                { name: t.breadcrumbHome, path: '/' },
                { name: t.breadcrumbRoot, path: PAST_PAPERS_ROOT },
                { name: label, path: collection.path },
            ], lang),
        ].filter(Boolean),
    };
}

/** Every /past-papers route for one language, in the prerenderer's shape. */
export function buildPastPaperRoutes(payload, { footerNav = '', lang = 'ar' } = {}) {
    const data = buildCollections(payload);
    if (!data.collections.length) return [];

    const routes = [
        { path: PAST_PAPERS_ROOT, html: pastPapersHubHtml(data, lang), seo: pastPapersHubSeo(data, lang) },
        ...data.collections.map((collection) => ({
            path: collection.path,
            html: collectionPageHtml(collection, data.collections, lang),
            seo: collectionSeo(collection, lang),
        })),
    ];

    return routes.map((route) => ({
        path: localizedPath(route.path, lang),
        html: `${route.html}${footerNav}`,
        seo: completeSeo(route.seo, lang),
    }));
}

export { completeSeo as completePastPaperSeo };
