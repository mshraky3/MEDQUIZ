/**
 * Move each summary "deck" block next to the topic it belongs to.
 *
 * ── The problem ───────────────────────────────────────────────────────────
 * Every subtopic's summary is written as a clean body of <h3> topics, followed
 * by one trailing <section class="topic deck-enrich"> that dumps EVERY table,
 * algorithm and topic-card for that subtopic in a single undifferentiated
 * block. So a reader working through "Thyroid Disorders" gets no figures, and
 * then meets the thyroid algorithms hundreds of lines later, mixed in with
 * adrenal, pituitary and diabetes material.
 *
 * ── What this does ────────────────────────────────────────────────────────
 * For every subtopic, in every content file:
 *   1. Split the body into its <h3> sections.
 *   2. Pull the individual blocks out of the deck-enrich section
 *      (deck-tbl divs, algo-flow figures, and h4.deck-topic + deck-cards pairs).
 *   3. Score each block's caption against every section, and append it to the
 *      section it matches best.
 *   4. Anything that doesn't clearly belong to one section stays behind in a
 *      smaller "More from the deck" section rather than being guessed at.
 *
 * Matching is deliberately conservative: a block only moves when its caption
 * shares distinctive vocabulary with exactly one section. Everything else is
 * left where it was, because a figure under the wrong heading is worse than a
 * figure at the end.
 *
 * Run:  node scripts/relocate-deck-blocks.mjs [--write]
 * Without --write it prints the plan and changes nothing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(HERE, '..', 'src', 'components', 'summaries', 'content');
const FILES = ['medicine.js', 'surgery.js', 'pediatrics.js', 'obgyn.js'];
const WRITE = process.argv.includes('--write');

// Words too common in clinical text to identify a topic.
const STOP = new Set(`
a an and or the of in to for with without on at by from is are was were be been
vs versus approach management treatment diagnosis diagnostic workup when how why
what which who patient patients disease diseases syndrome syndromes disorder
disorders test tests testing first second third line step steps algorithm table
overview quick glance comparison types type causes cause clinical after before
during if then than that this these those not no yes new all any more most
common rare acute chronic severe mild moderate high low normal abnormal
level levels risk factors factor use used using give given start stop
`.trim().split(/\s+/));

/**
 * Hand-checked placements for blocks whose title defeats keyword matching.
 *
 * "Diabetes insipidus vs SIADH" is the motivating case: it shares the word
 * "diabetes" with Diabetes Mellitus but is an ADH/pituitary topic and has
 * nothing to do with diabetes mellitus. Keyword scoring cannot know that, so
 * the few cases like it are stated explicitly rather than fudged with more
 * heuristics.
 *
 * Match is: block title contains `titleContains` → force into the section
 * whose heading contains `sectionContains` (both case-insensitive).
 */
const OVERRIDES = [
    { titleContains: 'diabetes insipidus', sectionContains: 'pituitary' },
    { titleContains: 'subacute thyroiditis', sectionContains: 'thyroid' },
    { titleContains: 'euthyroid sick', sectionContains: 'thyroid' },
];

function overrideFor(block, sections) {
    const title = (block.title || '').toLowerCase();
    for (const o of OVERRIDES) {
        if (!title.includes(o.titleContains)) continue;
        const idx = sections.findIndex((s) => s.title.toLowerCase().includes(o.sectionContains));
        if (idx >= 0) return idx;
    }
    return -1;
}

const tokens = (s) => (s || '')
    .replace(/<[^>]*>/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));

/** Scan forward from `start` (an opening tag) to its matching close tag. */
function matchTag(html, start, tagName) {
    const open = new RegExp(`<${tagName}\\b`, 'gi');
    const close = new RegExp(`</${tagName}>`, 'gi');
    let depth = 0;
    let i = start;
    while (i < html.length) {
        open.lastIndex = i;
        close.lastIndex = i;
        const o = open.exec(html);
        const c = close.exec(html);
        if (!c) return -1;
        if (o && o.index < c.index) { depth++; i = o.index + 1; continue; }
        depth--;
        if (depth === 0) return c.index + c[0].length;
        i = c.index + 1;
    }
    return -1;
}

/** Break the deck-enrich body into individually placeable blocks. */
function extractBlocks(deckBody) {
    const blocks = [];
    let i = 0;
    while (i < deckBody.length) {
        const tbl = deckBody.indexOf('<div class="deck-block deck-tbl">', i);
        const algo = deckBody.indexOf('<figure class="deck-block algo-flow">', i);
        const topic = deckBody.indexOf('<h4 class="deck-topic">', i);
        const candidates = [tbl, algo, topic].filter((n) => n >= 0);
        if (!candidates.length) break;
        const next = Math.min(...candidates);

        if (next === tbl) {
            const end = matchTag(deckBody, tbl, 'div');
            if (end < 0) break;
            const html = deckBody.slice(tbl, end);
            blocks.push({ kind: 'table', html, title: capOf(html) });
            i = end;
        } else if (next === algo) {
            const end = matchTag(deckBody, algo, 'figure');
            if (end < 0) break;
            const html = deckBody.slice(algo, end);
            blocks.push({ kind: 'algorithm', html, title: capOf(html) });
            i = end;
        } else {
            // h4.deck-topic is a heading followed by its .deck-cards sibling.
            const hEnd = deckBody.indexOf('</h4>', topic) + 5;
            const title = deckBody.slice(topic, hEnd).replace(/<[^>]*>/g, '').trim();
            const cardsStart = deckBody.indexOf('<div class="deck-cards">', hEnd);
            let end = hEnd;
            if (cardsStart >= 0 && cardsStart < hEnd + 40) {
                const cardsEnd = matchTag(deckBody, cardsStart, 'div');
                if (cardsEnd > 0) end = cardsEnd;
            }
            blocks.push({ kind: 'cards', html: deckBody.slice(topic, end), title });
            i = end;
        }
    }
    return blocks;
}

function capOf(html) {
    const m = html.match(/<div class="deck-cap">([\s\S]*?)<\/div>/)
        || html.match(/<figcaption>([\s\S]*?)<\/figcaption>/);
    return m ? m[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

/** Split a summary body into { heading, headingHtml, body } sections. */
function splitSections(body) {
    const parts = [];
    const re = /<h3>([\s\S]*?)<\/h3>/g;
    const marks = [];
    let m;
    while ((m = re.exec(body))) marks.push({ index: m.index, end: re.lastIndex, title: m[1].replace(/<[^>]*>/g, '').trim() });
    if (!marks.length) return null;

    const preamble = body.slice(0, marks[0].index);
    marks.forEach((mk, idx) => {
        const stop = idx + 1 < marks.length ? marks[idx + 1].index : body.length;
        parts.push({ title: mk.title, html: body.slice(mk.index, stop) });
    });
    return { preamble, sections: parts };
}

/**
 * Build a per-subtopic index of which sections mention each word.
 *
 * A word that appears in exactly ONE section's body is a strong signal of
 * ownership ("Graves" only ever appears under Thyroid Disorders). A word
 * spread across several sections ("pregnancy", "insulin") says nothing about
 * where a block belongs, so it is ignored rather than allowed to vote.
 */
function buildVocabulary(sections) {
    const owners = new Map(); // token -> Set(sectionIndex)
    sections.forEach((s, i) => {
        for (const t of new Set(tokens(s.html))) {
            if (!owners.has(t)) owners.set(t, new Set());
            owners.get(t).add(i);
        }
    });
    return owners;
}

function scoreBlock(block, section, sectionIndex, vocabulary) {
    const titleTokens = new Set(tokens(block.title));
    if (!titleTokens.size) return 0;
    const headTokens = new Set(tokens(section.title));

    let score = 0;
    for (const t of titleTokens) {
        if (headTokens.has(t)) {
            score += 10;                      // heading match is decisive
            continue;
        }
        const owners = vocabulary.get(t);
        if (!owners || !owners.has(sectionIndex)) continue;
        // Only distinctive vocabulary counts: a term used by every section
        // tells us nothing about which one owns this block.
        if (owners.size === 1) score += 6;
    }
    return score;
}

let totalMoved = 0;
let totalKept = 0;
const report = [];

for (const file of FILES) {
    const full = path.join(CONTENT_DIR, file);
    let src = fs.readFileSync(full, 'utf8');
    const original = src;

    // Each subtopic's summaryHtml is a template literal; operate on the
    // deck-enrich section inside it.
    const DECK_OPEN = '<section class="topic deck-enrich">';
    let cursor = 0;
    let out = '';

    while (true) {
        const start = src.indexOf(DECK_OPEN, cursor);
        if (start < 0) { out += src.slice(cursor); break; }
        const end = matchTag(src, start, 'section');
        if (end < 0) { out += src.slice(cursor); break; }

        const before = src.slice(cursor, start);
        const deck = src.slice(start, end);

        // The body of this subtopic is everything since the last summaryHtml: `
        const bodyStart = before.lastIndexOf('summaryHtml: `');
        if (bodyStart < 0) { out += before + deck; cursor = end; continue; }

        const head = before.slice(0, bodyStart);
        const body = before.slice(bodyStart);
        const split = splitSections(body);

        const innerStart = deck.indexOf('>', deck.indexOf('<p class="deck-intro"')) + 1;
        const introEnd = deck.indexOf('</p>', innerStart);
        const deckBody = introEnd > 0 ? deck.slice(introEnd + 4, deck.lastIndexOf('</section>')) : '';
        const blocks = deckBody ? extractBlocks(deckBody) : [];

        if (!split || !blocks.length) { out += before + deck; cursor = end; continue; }

        const placed = split.sections.map(() => []);
        const leftovers = [];

        const vocabulary = buildVocabulary(split.sections);
        for (const block of blocks) {
            // Hand-checked placements win outright.
            const forced = overrideFor(block, split.sections);
            if (forced >= 0) { placed[forced].push(block); totalMoved++; continue; }

            const scores = split.sections.map((s, i) => scoreBlock(block, s, i, vocabulary));
            const best = Math.max(...scores);
            const bestIdx = scores.indexOf(best);
            const runnerUp = Math.max(...scores.filter((_, i) => i !== bestIdx), 0);
            // Confident = a heading hit or distinctive-vocabulary hit, AND a
            // clear win over the next-best section. Ties stay put rather than
            // being guessed: a figure under the wrong heading is worse than a
            // figure at the end.
            if (best >= 6 && best > runnerUp) {
                placed[bestIdx].push(block);
                totalMoved++;
            } else {
                leftovers.push(block);
                totalKept++;
            }
        }

        let rebuilt = split.preamble;
        split.sections.forEach((s, i) => {
            rebuilt += s.html;
            if (placed[i].length) {
                rebuilt += `\n                <div class="topic-deck">\n`
                    + placed[i].map((b) => b.html).join('\n')
                    + `\n                </div>\n`;
            }
        });

        const newDeck = leftovers.length
            ? `<section class="topic deck-enrich">\n`
              + `                    <h3>More from the study deck</h3>\n`
              + `                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>\n`
              + leftovers.map((b) => b.html).join('\n')
              + `\n                </section>`
            : '';

        report.push({
            file,
            topic: (head.match(/title: '([^']+)'/g) || []).slice(-1)[0] || '?',
            sections: split.sections.map((s, i) => `${s.title} (+${placed[i].length})`),
            moved: blocks.length - leftovers.length,
            kept: leftovers.length,
        });

        out += head + rebuilt + newDeck;
        cursor = end;
    }

    if (out !== original) {
        if (WRITE) fs.writeFileSync(full, out, 'utf8');
    }
}

console.log(WRITE ? '── APPLIED ──' : '── DRY RUN (pass --write to apply) ──');
for (const r of report) {
    console.log(`\n${r.file}  ${r.topic}`);
    console.log(`  moved ${r.moved}, left in place ${r.kept}`);
    r.sections.forEach((s) => console.log(`    · ${s}`));
}
console.log(`\nTOTAL: ${totalMoved} blocks moved next to their topic, ${totalKept} left in the shared section.`);
