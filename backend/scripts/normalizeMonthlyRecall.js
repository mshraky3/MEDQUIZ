/**
 * Merge and normalize the 54 MonthlyRecall batch files (raw exam-recall text
 * extracted by hand from three Telegram-compiled sources, see
 * source-material/medical/questions/MonthlyRecall/_PROGRESS.md) into one
 * clean, deduped, import-ready collection.
 *
 * Unlike normalizeSourceMaterial.js (which cleans up PDF-extraction damage
 * across the 2026H2 rebuild's 116 input files), the batch files here were
 * already hand-written with clean prose, validated question_type values, and
 * correct_option strings that exactly match one of the four options — each
 * batch was checked with an inline script during extraction. What this pass
 * adds on top:
 *
 *   1. Merges all 54 batches into one array (they all share
 *      source="MedicalMonthlyRecall", track="medical").
 *   2. Re-validates every row defensively (question_type in the medical
 *      specialty set, correct_option matches an option exactly) in case a
 *      hand-extraction slip made it through a single batch's own check.
 *   3. Deduplicates: exact-text duplicates, then near-duplicates (same four
 *      options + same answer, overlapping stems) — real risk here since the
 *      54 batches were written incrementally from memory across a very long
 *      session, so a fact recalled twice hundreds of batches apart is
 *      plausible in a way it wasn't within any single batch.
 *   4. Preserves the `explanation` field, which normalizeSourceMaterial.js's
 *      output does not carry (that rebuild's insert script never populated
 *      it; this collection is written with explanations up front).
 *
 * Usage (from the repo root or backend/, no DB access, no .env needed):
 *   node backend/scripts/normalizeMonthlyRecall.js            # dry run
 *   node backend/scripts/normalizeMonthlyRecall.js --apply    # write clean/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MEDICAL, specialtyKeys } from '../config/tracks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', 'source-material');
const BATCH_DIR = path.join(ROOT, 'medical', 'questions', 'MonthlyRecall');
const OUT_DIR = path.join(ROOT, 'clean');
const OUT_FILE = 'medical-monthlyrecall.json';
const REPORT_FILE = 'MONTHLY_RECALL_REPORT.md';

const APPLY = process.argv.includes('--apply');
const SOURCE = 'MedicalMonthlyRecall';
const TRACK = MEDICAL;
const ALLOWED_TYPES = specialtyKeys(TRACK);

// ---------------------------------------------------------------------------
// text helpers (same conventions as normalizeSourceMaterial.js)
// ---------------------------------------------------------------------------

function cleanText(value) {
    return String(value == null ? '' : value)
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\s*\n\s*/g, '\n')
        .trim();
}

const norm = (s) => cleanText(s).toLowerCase().replace(/\s+/g, ' ');

/**
 * Comparison operators carry real clinical meaning that plain punctuation
 * stripping would destroy — "ratio <0.4" (TB meningitis) and "ratio >0.4"
 * (viral meningitis) are different questions with different answers, not
 * the same stem with noise. Spelled out as words before the alphanumeric
 * filter runs so they survive into both the dedupe key and the token set.
 */
function spellOutComparators(s) {
    return s
        .replace(/<=/g, ' lessorequal ')
        .replace(/>=/g, ' greaterorequal ')
        .replace(/</g, ' lessthan ')
        .replace(/>/g, ' greaterthan ');
}

const dedupeKey = (s) => spellOutComparators(norm(s)).replace(/[^a-z0-9؀-ۿ]+/g, '');
const tokens = (s) => new Set(spellOutComparators(norm(s)).match(/[a-z0-9؀-ۿ]+/g) || []);

function similarity(a, b) {
    let shared = 0;
    for (const t of a) if (b.has(t)) shared++;
    return shared / (a.size + b.size - shared);
}

const isPlaceholder = (v) => norm(v) === "didn't recall" || norm(v) === '';
const placeholderCount = (q) =>
    [q.option1, q.option2, q.option3, q.option4].filter((o) => isPlaceholder(o)).length;

/** Lower sorts first = kept: fewest placeholders, then longer stem, then has an explanation. */
function betterFirst(a, b) {
    const pa = placeholderCount(a.question);
    const pb = placeholderCount(b.question);
    if (pa !== pb) return pa - pb;
    const ea = a.question.explanation ? 1 : 0;
    const eb = b.question.explanation ? 1 : 0;
    if (ea !== eb) return eb - ea;
    return b.question.question_text.length - a.question.question_text.length;
}

// ---------------------------------------------------------------------------
// load + validate
// ---------------------------------------------------------------------------

const report = {
    files: 0,
    rawCount: 0,
    invalid: [],
    dedupe: { exactGroups: 0, exactRemoved: 0, nearRemoved: 0 },
    typeCounts: {},
    batchList: [],
};

function drop(reason, file, q) {
    report.invalid.push({
        reason,
        file,
        question_text: cleanText(q.question_text || '').slice(0, 120),
        correct_option: q.correct_option,
    });
}

if (!fs.existsSync(BATCH_DIR)) {
    console.error(`FATAL: batch folder not found: ${BATCH_DIR}`);
    process.exit(1);
}

const batchFiles = fs.readdirSync(BATCH_DIR)
    .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
    .sort();

if (batchFiles.length === 0) {
    console.error(`FATAL: no batch-*.json files found in ${BATCH_DIR}`);
    process.exit(1);
}

const collected = []; // { question }

for (const file of batchFiles) {
    report.files++;
    const full = path.join(BATCH_DIR, file);
    let data;
    try {
        data = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (err) {
        console.error(`FATAL: cannot parse ${file}: ${err.message}`);
        process.exit(1);
    }
    if (data.source !== SOURCE || data.track !== TRACK) {
        console.error(`FATAL: ${file} has source="${data.source}" track="${data.track}", expected "${SOURCE}"/"${TRACK}"`);
        process.exit(1);
    }
    const questions = Array.isArray(data.questions) ? data.questions : [];
    report.rawCount += questions.length;
    let kept = 0;

    for (const raw of questions) {
        const text = cleanText(raw.question_text);
        if (text.length < 10) { drop('question_text too short', file, raw); continue; }

        const options = ['option1', 'option2', 'option3', 'option4'].map((k) => cleanText(raw[k]));
        if (options.every((o) => isPlaceholder(o))) { drop('all four options are placeholders', file, raw); continue; }

        const type = String(raw.question_type || '').trim();
        if (!ALLOWED_TYPES.includes(type)) {
            drop(`invalid question_type "${type}"`, file, raw);
            continue;
        }

        let correct = cleanText(raw.correct_option);
        if (isPlaceholder(correct)) { drop('correct_option is a placeholder', file, raw); continue; }
        if (!options.includes(correct)) {
            // Loose (case/whitespace-insensitive) match, same fallback normalizeSourceMaterial.js uses.
            const loose = options.find((o) => !isPlaceholder(o) && norm(o) === norm(correct));
            if (!loose) { drop('correct_option matches none of the four options', file, raw); continue; }
            correct = loose;
        }

        const explanation = raw.explanation ? cleanText(raw.explanation) : null;

        report.typeCounts[type] = (report.typeCounts[type] || 0) + 1;
        collected.push({
            question: {
                question_text: text,
                option1: options[0],
                option2: options[1],
                option3: options[2],
                option4: options[3],
                correct_option: correct,
                question_type: type,
                explanation,
            },
        });
        kept++;
    }
    report.batchList.push({ file, raw: questions.length, kept });
}

// ---------------------------------------------------------------------------
// dedupe — exact text
// ---------------------------------------------------------------------------

const exactGroups = new Map();
for (const entry of collected) {
    const key = dedupeKey(entry.question.question_text);
    if (!exactGroups.has(key)) exactGroups.set(key, []);
    exactGroups.get(key).push(entry);
}

const winners = new Set();
for (const [key, entries] of exactGroups) {
    if (entries.length === 1) { winners.add(entries[0]); continue; }

    // Safety net: if the "duplicate" stems actually carry different answers,
    // the dedupe key destroyed a real distinction (this caught a genuine bug —
    // "<0.4" vs ">0.4" both stripping to the same key). Don't silently merge;
    // keep every distinct answer and flag it for review instead.
    const byAnswer = new Map();
    for (const e of entries) {
        const ak = norm(e.question.correct_option);
        if (!byAnswer.has(ak)) byAnswer.set(ak, []);
        byAnswer.get(ak).push(e);
    }
    if (byAnswer.size > 1) {
        report.dedupe.conflictingAnswerGroups = (report.dedupe.conflictingAnswerGroups || 0) + 1;
        report.dedupe.conflicts = report.dedupe.conflicts || [];
        report.dedupe.conflicts.push({
            key,
            variants: entries.map((e) => ({
                question_text: e.question.question_text,
                correct_option: e.question.correct_option,
            })),
        });
        for (const [, group] of byAnswer) {
            if (group.length > 1) {
                report.dedupe.exactGroups++;
                report.dedupe.exactRemoved += group.length - 1;
            }
            group.sort(betterFirst);
            winners.add(group[0]);
        }
        continue;
    }

    report.dedupe.exactGroups++;
    report.dedupe.exactRemoved += entries.length - 1;
    entries.sort(betterFirst);
    winners.add(entries[0]);
}

// ---------------------------------------------------------------------------
// dedupe — near-duplicates (same 4 options + same answer, overlapping stems)
// ---------------------------------------------------------------------------

const NEAR_DUP_SIMILARITY = 0.85;
const NEAR_DUP_PREFIX = 40;

const nearBuckets = new Map();
for (const entry of collected) {
    if (!winners.has(entry)) continue;
    const q = entry.question;
    const real = [q.option1, q.option2, q.option3, q.option4].filter((o) => !isPlaceholder(o));
    if (real.length < 2) continue;
    const k = `${real.map(dedupeKey).sort().join('~')}##${dedupeKey(q.correct_option)}`;
    if (!nearBuckets.has(k)) nearBuckets.set(k, []);
    nearBuckets.get(k).push(entry);
}
for (const [, entries] of nearBuckets) {
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

const finalQuestions = collected.filter((e) => winners.has(e)).map((e) => e.question);

// ---------------------------------------------------------------------------
// report
// ---------------------------------------------------------------------------

console.log(`\n${APPLY ? 'APPLY' : 'DRY RUN'} — MonthlyRecall merge + normalize\n`);
console.log(`input batch files    : ${report.files}`);
console.log(`raw questions        : ${report.rawCount}`);
console.log(`invalid (dropped)    : ${report.invalid.length}`);
const invalidReasons = {};
for (const d of report.invalid) invalidReasons[d.reason] = (invalidReasons[d.reason] || 0) + 1;
for (const [r, n] of Object.entries(invalidReasons)) console.log(`    ${r}: ${n}`);
console.log(`removed exact dup    : ${report.dedupe.exactRemoved} (${report.dedupe.exactGroups} groups)`);
console.log(`removed near-dup     : ${report.dedupe.nearRemoved}`);
if (report.dedupe.conflictingAnswerGroups) {
    console.log(`\n!! same dedupe-key but DIFFERENT answers (kept both, not merged): ${report.dedupe.conflictingAnswerGroups} group(s)`);
    for (const c of report.dedupe.conflicts) {
        console.log(`   key: ${c.key.slice(0, 60)}`);
        for (const v of c.variants) console.log(`     -> "${v.question_text.slice(0, 90)}" == ${v.correct_option}`);
    }
}
console.log(`clean questions      : ${finalQuestions.length}\n`);
console.log('question_type distribution:');
for (const [t, n] of Object.entries(report.typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t.padEnd(30)} ${n}`);
}
const withExplanation = finalQuestions.filter((q) => q.explanation).length;
console.log(`\nquestions with explanation: ${withExplanation} / ${finalQuestions.length}`);

if (!APPLY) {
    console.log('\nDry run — nothing written. Re-run with --apply to write source-material/clean/.\n');
    process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
    path.join(OUT_DIR, OUT_FILE),
    `${JSON.stringify({ source: SOURCE, track: TRACK, questions: finalQuestions }, null, 2)}\n`,
    'utf8',
);

const md = [];
md.push('# Monthly Recall — merge & normalize report');
md.push('');
md.push('Generated by `backend/scripts/normalizeMonthlyRecall.js`. Inputs under');
md.push('`source-material/medical/questions/MonthlyRecall/batch-*.json` are never modified.');
md.push('');
md.push('## Totals');
md.push('');
md.push('| | count |');
md.push('|---|---|');
md.push(`| input batch files | ${report.files} |`);
md.push(`| raw questions | ${report.rawCount} |`);
md.push(`| invalid (dropped) | ${report.invalid.length} |`);
md.push(`| removed as exact duplicate | ${report.dedupe.exactRemoved} |`);
md.push(`| removed as near-duplicate | ${report.dedupe.nearRemoved} |`);
md.push(`| **clean questions** | **${finalQuestions.length}** |`);
md.push(`| with explanation | ${withExplanation} |`);
md.push('');
md.push('## question_type distribution');
md.push('');
md.push('| question_type | count |');
md.push('|---|---|');
for (const [t, n] of Object.entries(report.typeCounts).sort((a, b) => b[1] - a[1])) {
    md.push(`| \`${t}\` | ${n} |`);
}
md.push('');
md.push('## Batch-by-batch');
md.push('');
md.push('| file | raw | kept (pre-dedupe) |');
md.push('|---|---|---|');
for (const b of report.batchList) md.push(`| \`${b.file}\` | ${b.raw} | ${b.kept} |`);
md.push('');
if (report.invalid.length) {
    md.push('## Dropped (invalid)');
    md.push('');
    for (const [r, n] of Object.entries(invalidReasons)) md.push(`- **${r}** — ${n}`);
    md.push('');
    for (const d of report.invalid) {
        md.push(`### ${d.reason}`);
        md.push('');
        md.push(`- file: \`${d.file}\``);
        md.push(`- stem: ${d.question_text}`);
        md.push(`- correct_option: \`${d.correct_option}\``);
        md.push('');
    }
}
fs.writeFileSync(path.join(OUT_DIR, REPORT_FILE), `${md.join('\n')}\n`, 'utf8');

console.log(`\nWrote ${OUT_FILE} + ${REPORT_FILE} to ${OUT_DIR}\n`);
