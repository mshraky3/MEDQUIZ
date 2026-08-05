/**
 * Normalize the re-authored 2026 question bank in source-material/ into a clean,
 * canonical, import-ready set of JSON files under source-material/clean/.
 *
 * The bank was re-written from scratch as LLM-generated JSON across several
 * sessions and two different models, so the 116 input files agree on their
 * *shape* (every question carries exactly the 7 expected keys) but not on their
 * *values*: source labels drift ("Confirmd", "confirmed", "most-repeated"),
 * question_type is spelled a dozen ways, ~1400 questions are duplicates of one
 * another, and ~150 have no recoverable correct answer.
 *
 * This script reads those files and writes one clean file per source. It never
 * modifies the originals — they stay as the raw record.
 *
 * The canonical vocabulary is NOT invented here: question_type must land on one
 * of the keys config/tracks.js already defines for the track, because a
 * mislabelled type makes a question invisible to every per-specialty query in
 * the app. An unmappable value aborts the run rather than being guessed at.
 *
 * Usage (from the repo root or backend/, no DB access, no .env needed):
 *   node backend/scripts/normalizeSourceMaterial.js            # dry run
 *   node backend/scripts/normalizeSourceMaterial.js --apply    # write clean/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MEDICAL, NURSING, specialtyKeys } from '../config/tracks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', 'source-material');
const OUT_DIR = path.join(ROOT, 'clean');

const APPLY = process.argv.includes('--apply');

/** The exact string every unrecalled option is normalized to. */
const PLACEHOLDER = "didn't recall";

/**
 * Input folder -> output collection.
 *
 * The medical source keys are deliberately new. "Midgard" and "GameBoy" are
 * *retired* labels that historical user_quiz_sessions rows still reference
 * (see config/sources.js), so reusing them verbatim would conflate old sessions
 * with the new bank. The nursing keys are the ones already live in the DB, so
 * those rows swap in place.
 *
 * Duplicates are resolved inside a collection only, so no priority between
 * collections is needed: a question held by two collections stays in both.
 */
const COLLECTIONS = [
    {
        folder: path.join('medical', 'questions', 'Midgard'),
        source: 'MedicalMidgard',
        track: MEDICAL,
        outFile: 'medical-midgard.json',
    },
    {
        folder: path.join('medical', 'questions', 'GameBoy'),
        source: 'MedicalGameBoy',
        track: MEDICAL,
        outFile: 'medical-gameboy.json',
    },
    {
        folder: path.join('medical', 'questions', 'Confirmed'),
        source: 'MedicalConfirmed',
        track: MEDICAL,
        outFile: 'medical-confirmed.json',
    },
    {
        folder: path.join('nursing', 'most repated'),
        source: 'NursingMostRepeated',
        track: NURSING,
        outFile: 'nursing-most-repeated.json',
    },
    {
        folder: path.join('nursing', 'confiermd'),
        source: 'NursingConfirmed',
        track: NURSING,
        outFile: 'nursing-confirmed.json',
    },
];

/**
 * Every question_type spelling found in the source material, mapped to the
 * canonical key for its track. Lookup is on typeKey() — lowercased with all
 * non-letters stripped — so "Medical-Surgical", "medical surgical" and
 * "MedicalSurgical" all resolve to the same entry and unseen casing variants
 * still land.
 */
const TYPE_MAP = {
    // medical
    medicine: 'medicine',
    internalmedicine: 'medicine',
    surgery: 'surgery',
    pediatric: 'pediatric',
    pediatic: 'pediatric', // the typo the template itself shipped with
    paediatric: 'pediatric',
    obstetricsgynecology: 'obstetrics and gynecology',
    obstetricsandgynecology: 'obstetrics and gynecology',
    // nursing
    fundamentals: 'nursing fundamentals',
    nursingfundamentals: 'nursing fundamentals',
    medicalsurgical: 'medical surgical nursing',
    medicalsurgicalnursing: 'medical surgical nursing',
    maternalnewborn: 'maternal and newborn nursing',
    maternalandnewbornnursing: 'maternal and newborn nursing',
    paediatricnursing: 'pediatric nursing',
    pediatricnursing: 'pediatric nursing',
    mentalhealth: 'mental health nursing',
    mentalhealthnursing: 'mental health nursing',
    pharmacologydosage: 'nursing pharmacology',
    nursingpharmacology: 'nursing pharmacology',
};

/**
 * "ethics" is not a specialty in either track's blueprint — the 8 questions
 * carrying it are ordinary clinical-ethics vignettes that belong to whichever
 * specialty their scenario sits in. Each was read individually and assigned
 * here; matched on the first 60 chars of the normalized stem so the near
 * -duplicate pairs in the source files both resolve.
 */
const ETHICS_OVERRIDES = [
    ['a multiparous patient who had delivered 6 babies previously', 'obstetrics and gynecology'],
    ['female patient with a strong family history of breast cancer', 'medicine'],
    ['20s years old female nurse called emergency dispatch', 'medicine'],
    ['16 yo is pregnant and wants to get an abortion', 'obstetrics and gynecology'],
    ['female k/c pcos with 6 failed induction of ovulation', 'obstetrics and gynecology'],
    ['pregnant woman presented to the delivery room', 'obstetrics and gynecology'],
    ['a couple came to the clinic due to primary infertility', 'obstetrics and gynecology'],
];

/**
 * Damage the source PDFs took on extraction, repaired mechanically.
 *
 * Two kinds, both unambiguous:
 *   - lost hyphens — "30yearold", "lowgrade" (15 occurrences)
 *   - lost "ti"/"ft" ligatures — one badly-extracted ulcerative-colitis stem
 *     that reads as "lesided ulcerave colis … Aer fluid resuscitation"
 *
 * Each pattern was checked against the whole bank for false positives before
 * being added (notably `Aer` — the albumin-excretion-rate acronym `AER` does
 * not appear anywhere, and the match is case-sensitive regardless).
 */
const TEXT_REPAIRS = [
    [/(\d)\s?yearold\b/gi, '$1-year-old'],
    [/\blowgrade\b/gi, 'low-grade'],
    [/\bhighgrade\b/gi, 'high-grade'],
    [/\bulcerave\b/gi, 'ulcerative'],
    [/\bcolis\b/gi, 'colitis'],
    [/\bnegave\b/gi, 'negative'],
    [/\blesided\b/gi, 'left-sided'],
    [/\bAer\b/g, 'After'],
];

// ---------------------------------------------------------------------------
// text helpers
// ---------------------------------------------------------------------------

/**
 * Whitespace/line-ending cleanup plus the mechanical extraction repairs above,
 * applied to every string field. Deliberately pure — norm() calls it on every
 * comparison, so it must never have side effects like bumping a counter.
 */
function cleanText(value) {
    let s = String(value == null ? '' : value)
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t ]+/g, ' ')
        .replace(/\s*\n\s*/g, '\n')
        .trim();
    for (const [pattern, replacement] of TEXT_REPAIRS) s = s.replace(pattern, replacement);
    return s;
}

/**
 * Did any extraction repair actually fire on this raw value? For the report only.
 * lastIndex is reset because the patterns are global and .test() is stateful.
 */
function needsRepair(value) {
    const s = String(value == null ? '' : value);
    return TEXT_REPAIRS.some(([p]) => {
        p.lastIndex = 0;
        return p.test(s);
    });
}

/** Comparison form: case- and whitespace-insensitive. */
const norm = (s) => cleanText(s).toLowerCase().replace(/\s+/g, ' ');

/** Dedupe key: also punctuation-insensitive, so "CPR?" == "CPR ?". */
const dedupeKey = (s) => norm(s).replace(/[^a-z0-9؀-ۿ]+/g, '');

/** Word set of a stem, for the near-duplicate similarity check. */
const tokens = (s) => new Set(norm(s).match(/[a-z0-9؀-ۿ]+/g) || []);

/** Jaccard similarity of two token sets. */
function similarity(a, b) {
    let shared = 0;
    for (const t of a) if (b.has(t)) shared++;
    return shared / (a.size + b.size - shared);
}

/** Collapse a question_type to its lookup key. */
const typeKey = (s) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z]/g, '');

/**
 * Strip the "118. " numbering the source PDFs left on some stems.
 *
 * Guarded twice: the remainder must still be a real question (>= 40 chars), and
 * must not start with a digit — otherwise a dosage written as "2. 5 mg" would
 * lose its leading digit.
 */
function stripLeadingNumber(text) {
    const m = /^(\d{1,4})[.)]\s+(\S.*)$/s.exec(text);
    if (!m) return text;
    const rest = m[2];
    if (rest.length < 40 || /^\d/.test(rest)) return text;
    return rest;
}

/** Strip an "A) " / "b. " answer-letter prefix an option was written with. */
function stripOptionLetter(text) {
    const m = /^([A-Da-d])[).]\s+(\S.*)$/s.exec(text);
    return m ? m[2] : text;
}

/**
 * Is this option a "the student didn't recall it" placeholder rather than a
 * real answer? Matched on the whole value only — a genuine option that merely
 * contains one of these words ("pregnancy of unknown location") is a real
 * answer and must survive.
 */
function isPlaceholder(value) {
    const n = norm(value).replace(/[.!]+$/, '');
    return (
        n === ''
        || /^(i )?(did ?n.?t|do ?n.?t|can.?t|couldn.?t) ?(recall|remember)$/.test(n)
        || /^not (recalled|remembered|provided|recorded|available)$/.test(n)
        || n === 'missing'
        || n === 'unknown'
        || n === 'n/a'
        || n === 'na'
        || n === '-'
        || n === '?'
    );
}

// ---------------------------------------------------------------------------
// parsing
// ---------------------------------------------------------------------------

function listJsonFiles(dir) {
    return fs.readdirSync(dir)
        .filter((f) => f.toLowerCase().endsWith('.json'))
        .sort()
        .map((f) => path.join(dir, f));
}

/**
 * Parse a bank file, recovering the one file that was truncated mid-write.
 *
 * The recovery is deliberately narrow: cut back to the last complete question
 * object and re-close the array/object. Returns { data, lostObjects }.
 */
function parseBankFile(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    try {
        return { data: JSON.parse(raw), lostObjects: 0 };
    } catch (err) {
        // Walk back through the object boundaries inside `questions` and re-close
        // the array at each one until the document parses. The first success is
        // the longest recoverable prefix.
        const boundaries = [...raw.matchAll(/\}\s*,/g)].map((m) => m.index + 1);
        for (let i = boundaries.length - 1; i >= 0; i--) {
            const head = raw.slice(0, boundaries[i]);
            try {
                const data = JSON.parse(`${head}\n  ]\n}`);
                if (!Array.isArray(data.questions)) continue;
                const tail = raw.slice(boundaries[i]);
                const lost = (tail.match(/"question_text"\s*:/g) || []).length;
                return { data, lostObjects: lost, repaired: true };
            } catch {
                // this boundary was nested inside a question object — keep walking back
            }
        }
        throw err;
    }
}

// ---------------------------------------------------------------------------
// pipeline
// ---------------------------------------------------------------------------

const report = {
    files: 0,
    repaired: [],
    perCollection: [],
    drops: [],
    dedupe: { removed: 0, groups: 0, nearRemoved: 0, crossSource: 0 },
    typeCounts: {},
    fixes: {
        extractionRepairs: 0,
        numberingStripped: 0,
        letterPrefixStripped: 0,
        placeholdersNormalized: 0,
        duplicateOptionsBlanked: 0,
        correctOptionRecased: 0,
    },
    unmappedTypes: new Map(),
};

function drop(reason, collection, file, question) {
    report.drops.push({
        reason,
        source: collection.source,
        file: path.basename(file),
        question_text: cleanText(question.question_text).slice(0, 120),
        correct_option: question.correct_option,
        options: [question.option1, question.option2, question.option3, question.option4],
    });
}

/**
 * Clean one raw question into its canonical form, or return null if it is
 * unusable and must be dropped.
 */
function normalizeQuestion(raw, collection, file) {
    const allowed = specialtyKeys(collection.track);

    // --- 1. text cleanup -----------------------------------------------------
    if (['question_text', 'option1', 'option2', 'option3', 'option4'].some((k) => needsRepair(raw[k]))) {
        report.fixes.extractionRepairs++;
    }

    let text = cleanText(raw.question_text);
    const stripped = stripLeadingNumber(text);
    if (stripped !== text) report.fixes.numberingStripped++;
    text = stripped;

    if (text.length < 10) {
        drop('question_text too short to be a real question', collection, file, raw);
        return null;
    }

    const options = ['option1', 'option2', 'option3', 'option4'].map((k) => {
        let v = cleanText(raw[k]);
        const noLetter = stripOptionLetter(v);
        if (noLetter !== v) report.fixes.letterPrefixStripped++;
        v = noLetter;
        if (isPlaceholder(v)) {
            if (v !== PLACEHOLDER) report.fixes.placeholdersNormalized++;
            return PLACEHOLDER;
        }
        return v;
    });

    // --- 2. de-duplicate options within the question -------------------------
    const seenOption = new Set();
    for (let i = 0; i < options.length; i++) {
        if (options[i] === PLACEHOLDER) continue;
        const k = norm(options[i]);
        if (seenOption.has(k)) {
            options[i] = PLACEHOLDER;
            report.fixes.duplicateOptionsBlanked++;
        } else {
            seenOption.add(k);
        }
    }

    // --- 3. question_type ----------------------------------------------------
    const rawType = String(raw.question_type || '');
    let type;
    if (typeKey(rawType) === 'ethics') {
        const stem = dedupeKey(text);
        const hit = ETHICS_OVERRIDES.find(([prefix]) => stem.startsWith(dedupeKey(prefix)));
        if (!hit) {
            report.unmappedTypes.set(
                `ethics (unclassified): ${stem.slice(0, 60)}`,
                (report.unmappedTypes.get(rawType) || 0) + 1,
            );
            return null;
        }
        type = hit[1];
    } else {
        type = TYPE_MAP[typeKey(rawType)];
    }
    if (!type) {
        report.unmappedTypes.set(rawType, (report.unmappedTypes.get(rawType) || 0) + 1);
        return null;
    }
    if (!allowed.includes(type)) {
        // A medical type on a nursing question (or vice versa) means the folder
        // and the label disagree — never silently pick one.
        report.unmappedTypes.set(
            `${rawType} -> ${type} (not a ${collection.track} specialty)`,
            (report.unmappedTypes.get(rawType) || 0) + 1,
        );
        return null;
    }

    // --- 4. correct answer must exist ---------------------------------------
    let correct = cleanText(raw.correct_option);
    correct = stripOptionLetter(correct);
    if (isPlaceholder(correct)) {
        drop('correct_option is a placeholder', collection, file, raw);
        return null;
    }
    const exact = options.find((o) => o !== PLACEHOLDER && o === correct);
    if (!exact) {
        const loose = options.find((o) => o !== PLACEHOLDER && norm(o) === norm(correct));
        if (!loose) {
            drop('correct_option matches none of the four options', collection, file, raw);
            return null;
        }
        correct = loose; // keep the option's exact spelling as the answer
        report.fixes.correctOptionRecased++;
    }

    if (options.every((o) => o === PLACEHOLDER)) {
        drop('all four options are placeholders', collection, file, raw);
        return null;
    }

    report.typeCounts[type] = (report.typeCounts[type] || 0) + 1;

    return {
        question_text: text,
        option1: options[0],
        option2: options[1],
        option3: options[2],
        option4: options[3],
        correct_option: correct,
        question_type: type,
    };
}

// ---------------------------------------------------------------------------
// run
// ---------------------------------------------------------------------------

const collected = []; // { collection, question }

for (const collection of COLLECTIONS) {
    const dir = path.join(ROOT, collection.folder);
    if (!fs.existsSync(dir)) {
        console.error(`FATAL: missing input folder ${dir}`);
        process.exit(1);
    }
    const files = listJsonFiles(dir);
    let rawCount = 0;
    let keptCount = 0;

    for (const file of files) {
        report.files++;
        let parsed;
        try {
            parsed = parseBankFile(file);
        } catch (err) {
            console.error(`FATAL: cannot parse ${file}: ${err.message}`);
            process.exit(1);
        }
        if (parsed.repaired) {
            report.repaired.push({ file: path.basename(file), lost: parsed.lostObjects });
        }
        const questions = parsed.data.questions || [];
        rawCount += questions.length + (parsed.lostObjects || 0);

        for (const raw of questions) {
            const q = normalizeQuestion(raw, collection, file);
            if (!q) continue;
            collected.push({ collection, question: q });
            keptCount++;
        }
    }

    report.perCollection.push({
        source: collection.source,
        track: collection.track,
        folder: collection.folder,
        files: files.length,
        raw: rawCount,
        afterValidation: keptCount,
    });
}

if (report.unmappedTypes.size) {
    console.error('FATAL: unmappable question_type values found — refusing to guess:');
    for (const [k, n] of report.unmappedTypes) console.error(`  ${JSON.stringify(k)} x${n}`);
    process.exit(1);
}

// --- dedupe, within each collection -----------------------------------------
// Scoped to one source on purpose. A question that genuinely appears in two
// collections belongs to both — deduping across them would gut the smaller
// collection (270 of the 616 "Most Repeated" nursing questions are also in
// "Confirmed") and make the source picker misrepresent what each one holds.
const placeholderCount = (q) =>
    [q.option1, q.option2, q.option3, q.option4].filter((o) => o === PLACEHOLDER).length;

/** Lower sorts first = kept: the most complete copy of the question. */
function betterFirst(a, b) {
    const pa = placeholderCount(a.question);
    const pb = placeholderCount(b.question);
    if (pa !== pb) return pa - pb;
    return b.question.question_text.length - a.question.question_text.length;
}

const groups = new Map();
for (const entry of collected) {
    const key = `${entry.collection.source}::${dedupeKey(entry.question.question_text)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
}

const winners = new Set();
for (const [, entries] of groups) {
    if (entries.length > 1) {
        report.dedupe.groups++;
        report.dedupe.removed += entries.length - 1;
    }
    entries.sort(betterFirst);
    winners.add(entries[0]);
}

// --- second pass: near-duplicates -------------------------------------------
// Exact-text dedupe misses the copies that were transcribed twice from the same
// recall sheet: "…what to do about it?" vs "…what to do about it? (not exact
// citation)", "18-year-old" vs "11-year-old", an abbreviated "…" stem vs the
// full one. They are recognisable because the four options AND the answer are
// identical — a coincidence that does not happen between genuinely different
// questions — so that is the entry condition, and it is then confirmed by the
// stems either sharing a 40-character opening or overlapping ≥85% by word.
// Both gates are required; option-identity alone wrongly merges different
// vignettes that happen to share an answer set.
const NEAR_DUP_SIMILARITY = 0.85;
const NEAR_DUP_PREFIX = 40;

for (const collection of COLLECTIONS) {
    const buckets = new Map();
    for (const entry of collected) {
        if (!winners.has(entry) || entry.collection !== collection) continue;
        const q = entry.question;
        const real = [q.option1, q.option2, q.option3, q.option4].filter((o) => o !== PLACEHOLDER);
        // Fewer than two real options carries too little signal to merge on.
        if (real.length < 2) continue;
        const k = `${real.map(dedupeKey).sort().join('~')}##${dedupeKey(q.correct_option)}`;
        if (!buckets.has(k)) buckets.set(k, []);
        buckets.get(k).push(entry);
    }
    for (const [, entries] of buckets) {
        if (entries.length < 2) continue;
        const kept = [];
        for (const entry of entries.slice().sort(betterFirst)) {
            const stem = dedupeKey(entry.question.question_text);
            const tok = tokens(entry.question.question_text);
            const match = kept.find((p) => (
                similarity(tok, p.tok) >= NEAR_DUP_SIMILARITY
                || stem.startsWith(p.stem.slice(0, NEAR_DUP_PREFIX))
                || p.stem.startsWith(stem.slice(0, NEAR_DUP_PREFIX))
            ));
            if (match) {
                winners.delete(entry);
                report.dedupe.nearRemoved++;
            } else {
                kept.push({ stem, tok });
            }
        }
    }
}

// Reported for transparency, not acted on: these questions are kept in every
// collection that holds them.
const acrossSources = new Map();
for (const entry of collected) {
    if (!winners.has(entry)) continue;
    const k = `${entry.collection.track}::${dedupeKey(entry.question.question_text)}`;
    if (!acrossSources.has(k)) acrossSources.set(k, new Set());
    acrossSources.get(k).add(entry.collection.source);
}
for (const [, srcs] of acrossSources) if (srcs.size > 1) report.dedupe.crossSource++;

// Preserve encounter order within each collection.
const byCollection = new Map(COLLECTIONS.map((c) => [c.source, []]));
for (const entry of collected) {
    if (winners.has(entry)) byCollection.get(entry.collection.source).push(entry.question);
}

// --- report -----------------------------------------------------------------
const dropReasons = {};
for (const d of report.drops) dropReasons[d.reason] = (dropReasons[d.reason] || 0) + 1;

const totalRaw = report.perCollection.reduce((n, c) => n + c.raw, 0);
const totalOut = [...byCollection.values()].reduce((n, a) => n + a.length, 0);

console.log(`\n${APPLY ? 'APPLY' : 'DRY RUN'} — source-material normalization\n`);
console.log(`input files          : ${report.files}`);
console.log(`raw questions        : ${totalRaw}`);
console.log(`dropped (unusable)   : ${report.drops.length}`);
for (const [r, n] of Object.entries(dropReasons)) console.log(`    ${r}: ${n}`);
console.log(`removed as duplicate : ${report.dedupe.removed} (${report.dedupe.groups} groups, within a collection only)`);
console.log(`removed as near-dup  : ${report.dedupe.nearRemoved} (same options + answer, same stem)`);
console.log(`shared by 2+ sources : ${report.dedupe.crossSource} (kept in each, by design)`);
console.log(`clean questions      : ${totalOut}\n`);
console.log('per collection:');
for (const c of report.perCollection) {
    console.log(`  ${c.source.padEnd(20)} ${String(c.raw).padStart(5)} raw -> ${String(byCollection.get(c.source).length).padStart(5)} clean  (${c.files} files, ${c.track})`);
}
console.log('\nquestion_type distribution (pre-dedupe):');
for (const [t, n] of Object.entries(report.typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t.padEnd(30)} ${n}`);
}
console.log('\ntext fixes:');
for (const [k, n] of Object.entries(report.fixes)) console.log(`  ${k.padEnd(28)} ${n}`);
if (report.repaired.length) {
    console.log('\nrecovered truncated files:');
    for (const r of report.repaired) console.log(`  ${r.file} (lost ${r.lost} incomplete question(s))`);
}

if (!APPLY) {
    console.log('\nDry run — nothing written. Re-run with --apply to write source-material/clean/.\n');
    process.exit(0);
}

// --- write ------------------------------------------------------------------
fs.mkdirSync(OUT_DIR, { recursive: true });
for (const collection of COLLECTIONS) {
    const payload = {
        source: collection.source,
        track: collection.track,
        questions: byCollection.get(collection.source),
    };
    fs.writeFileSync(
        path.join(OUT_DIR, collection.outFile),
        `${JSON.stringify(payload, null, 2)}\n`,
        'utf8',
    );
}

const md = [];
md.push('# Question bank normalization report');
md.push('');
md.push('Generated by `backend/scripts/normalizeSourceMaterial.js`. Inputs under');
md.push('`source-material/medical/` and `source-material/nursing/` are never modified.');
md.push('');
md.push('## Totals');
md.push('');
md.push('| | count |');
md.push('|---|---|');
md.push(`| input files | ${report.files} |`);
md.push(`| raw questions | ${totalRaw} |`);
md.push(`| dropped as unusable | ${report.drops.length} |`);
md.push(`| removed as exact duplicate | ${report.dedupe.removed} |`);
md.push(`| removed as near-duplicate | ${report.dedupe.nearRemoved} |`);
md.push(`| **clean questions** | **${totalOut}** |`);
md.push('');
md.push('## Per collection');
md.push('');
md.push('| source | track | files | raw | clean |');
md.push('|---|---|---|---|---|');
for (const c of report.perCollection) {
    md.push(`| \`${c.source}\` | ${c.track} | ${c.files} | ${c.raw} | ${byCollection.get(c.source).length} |`);
}
md.push('');
md.push('## question_type distribution');
md.push('');
md.push('| question_type | count (pre-dedupe) |');
md.push('|---|---|');
for (const [t, n] of Object.entries(report.typeCounts).sort((a, b) => b[1] - a[1])) {
    md.push(`| \`${t}\` | ${n} |`);
}
md.push('');
md.push('## Text fixes applied');
md.push('');
md.push('| fix | count |');
md.push('|---|---|');
for (const [k, n] of Object.entries(report.fixes)) md.push(`| ${k} | ${n} |`);
md.push('');
if (report.repaired.length) {
    md.push('## Recovered truncated files');
    md.push('');
    for (const r of report.repaired) {
        md.push(`- \`${r.file}\` — recovered; ${r.lost} incomplete question(s) at the end of the file were lost.`);
    }
    md.push('');
}
md.push('## Deduplication');
md.push('');
md.push(`${report.dedupe.groups} exact-text duplicate groups collapsed (${report.dedupe.removed} copies removed),`);
md.push(`plus ${report.dedupe.nearRemoved} near-duplicates — copies transcribed twice from the same recall`);
md.push('sheet, identified by having identical options *and* an identical answer while their');
md.push(`stems share a ${NEAR_DUP_PREFIX}-character opening or overlap ≥${Math.round(NEAR_DUP_SIMILARITY * 100)}% by word.`);
md.push('');
md.push('Keeper chosen by fewest `didn\'t recall` options, then longest question text.');
md.push('');
md.push('Deduplication runs **within a collection only**. A question genuinely held by');
md.push('two collections stays in both, so each source still contains everything it is');
md.push(`supposed to — ${report.dedupe.crossSource} clean questions are shared this way.`);
md.push('');
md.push('## Dropped questions');
md.push('');
for (const [r, n] of Object.entries(dropReasons)) md.push(`- **${r}** — ${n}`);
md.push('');
for (const d of report.drops) {
    md.push(`### ${d.reason}`);
    md.push('');
    md.push(`- source: \`${d.source}\` · file: \`${d.file}\``);
    md.push(`- stem: ${d.question_text}`);
    md.push(`- correct_option: \`${d.correct_option}\``);
    md.push(`- options: ${d.options.map((o) => `\`${o}\``).join(' · ')}`);
    md.push('');
}
fs.writeFileSync(path.join(OUT_DIR, 'REPORT.md'), `${md.join('\n')}\n`, 'utf8');

console.log(`\nWrote ${COLLECTIONS.length} files + REPORT.md to ${OUT_DIR}\n`);
