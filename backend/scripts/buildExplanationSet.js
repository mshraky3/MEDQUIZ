/**
 * Merge the AI-returned explanation files into one clean, verified set keyed by
 * questions.id — the input for scripts/importExplanations.js.
 *
 * Two directories feed this (both under the gitignored exports/):
 *   questions-explanations/  the export of the live bank (5,033 rows), written
 *                            by scripts/exportQuestionsForExplanations.js. This
 *                            is the IDENTITY ANCHOR: id, question text and
 *                            correct answer are taken from here and nowhere
 *                            else.
 *   done/                    the same questions came back with explanations
 *                            filled in, in ~264 randomly-named files. This
 *                            contributes ONLY the explanation string.
 *
 * The returned set is messy in ways that all have to be handled here rather
 * than at import time:
 *   - every JSON key (and most values) carries a trailing space: "id ", "PICA "
 *   - 16 files fail JSON.parse — unescaped quotes inside question/option text,
 *     `$\ge$` producing an invalid \g escape, and three files truncated
 *     mid-string. Those are salvaged field-wise instead of repaired, see
 *     salvageExplanations() below.
 *   - the same id comes back in more than one file (253 of them)
 *   - the model silently reworded questions and, in a handful of cases, changed
 *     the correct answer. Whitespace drift is ignored; a REAL answer change
 *     means the explanation may be arguing for the wrong option, so those rows
 *     are quarantined for hand-review instead of imported.
 *
 * Output (all in exports/):
 *   explanations-merged.json      [{id, explanation, origin}] ready to import
 *   explanations-missing.json     questions still without one, with their full
 *                                 text/options/answer so they can be written
 *   explanations-quarantine.json  answer-drift rows, for hand-review
 *
 * explanations-authored.json, if present, is applied last as an overlay — that
 * is how hand-written explanations (the missing ones, and the rewritten
 * quarantined ones) get into the merged set: write the file, re-run this.
 *
 * Usage (from backend/):
 *   node scripts/buildExplanationSet.js
 *
 * No database access — this script only reads and writes files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPORTS_DIR = path.join(__dirname, '..', '..', 'exports');
const ORIGINAL_DIR = path.join(EXPORTS_DIR, 'questions-explanations');
const DONE_DIR = path.join(EXPORTS_DIR, 'done');
const AUTHORED_FILE = path.join(EXPORTS_DIR, 'explanations-authored.json');
const CORRECTIONS_FILE = path.join(EXPORTS_DIR, 'answer-corrections.json');

const OUT_MERGED = path.join(EXPORTS_DIR, 'explanations-merged.json');
const OUT_MISSING = path.join(EXPORTS_DIR, 'explanations-missing.json');
const OUT_QUARANTINE = path.join(EXPORTS_DIR, 'explanations-quarantine.json');

/** Shorter than this is not an explanation, it is a stray fragment. */
const MIN_LENGTH = 20;

// ── helpers ──────────────────────────────────────────────────────────────────

/** Trailing spaces live in the keys AND the values of every done file. */
function trimRecord(record) {
    const out = {};
    for (const key of Object.keys(record)) {
        const value = record[key];
        out[key.trim()] = typeof value === 'string' ? value.trim() : value;
    }
    return out;
}

/**
 * Comparison key that ignores the model's whitespace damage. The returned
 * files have a space injected roughly every 180 characters, mid-word
 * ("prescrib ed"), so collapsing runs of whitespace is not enough — all
 * whitespace and punctuation has to go before two strings can be compared.
 */
function compareKey(text) {
    return String(text ?? '')
        .replace(/[‘’]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase();
}

/** JSON string unescaping that tolerates the invalid escapes in these files. */
function unescapeJsonString(raw) {
    let out = '';
    for (let i = 0; i < raw.length; i++) {
        if (raw[i] !== '\\') { out += raw[i]; continue; }
        const next = raw[i + 1];
        if (next === 'n') { out += '\n'; i++; }
        else if (next === 't') { out += '\t'; i++; }
        else if (next === 'r') { out += '\r'; i++; }
        else if (next === 'b') { out += '\b'; i++; }
        else if (next === 'f') { out += '\f'; i++; }
        else if (next === '"' || next === '\\' || next === '/') { out += next; i++; }
        else if (next === 'u' && /^[0-9a-fA-F]{4}$/.test(raw.slice(i + 2, i + 6))) {
            out += String.fromCharCode(parseInt(raw.slice(i + 2, i + 6), 16));
            i += 5;
        } else {
            // An invalid escape such as the \g of `$\ge$`. Keep it verbatim;
            // normalizeExplanation() turns those into real symbols later.
            out += '\\';
        }
    }
    return out;
}

/**
 * Pull (id, explanation) pairs straight out of raw text, for the 16 files that
 * do not parse.
 *
 * Every parse failure in this set is inside a question_text or option field —
 * an unescaped inner quote, an invalid escape, or a truncated tail. The
 * explanation is always the LAST field of the record, so it can be read
 * without the parser ever touching the broken fields: find the record's id,
 * find its "explanation": ", then read to the quote that closes the object.
 * Anything whose closing quote is missing (the truncated files) is dropped
 * rather than half-imported.
 */
function salvageExplanations(text) {
    const found = [];
    const idPattern = /"id\s*"\s*:\s*(\d+)/g;
    const starts = [];
    let match;
    while ((match = idPattern.exec(text)) !== null) {
        starts.push({ id: Number(match[1]), at: match.index });
    }

    for (let i = 0; i < starts.length; i++) {
        const segment = text.slice(starts[i].at, i + 1 < starts.length ? starts[i + 1].at : text.length);
        const key = /"explanation\s*"\s*:\s*"/.exec(segment);
        if (!key) continue;

        const body = segment.slice(key.index + key[0].length);
        let raw = null;
        for (let p = 0; p < body.length; p++) {
            if (body[p] === '\\') { p++; continue; }
            // The record ends here: a quote followed by the object's closing brace.
            if (body[p] === '"' && /^\s*}/.test(body.slice(p + 1))) {
                raw = body.slice(0, p);
                break;
            }
        }
        if (raw === null) continue; // truncated mid-string — treat as missing
        found.push({ id: starts[i].id, explanation: unescapeJsonString(raw) });
    }
    return found;
}

/** LaTeX fragments the models emitted inside otherwise-plain markdown. */
const MATH_SYMBOLS = {
    ge: '≥', geq: '≥', le: '≤', leq: '≤',
    neq: '≠', approx: '≈', pm: '±', times: '×',
    rightarrow: '→', to: '→', alpha: 'α', beta: 'β',
    mu: 'μ', degree: '°', circ: '°',
};

/**
 * Formatting only — never wording. The three generations came back in three
 * markdown dialects and they have to render through one panel.
 */
function normalizeExplanation(text) {
    let out = String(text ?? '').replace(/\r\n?/g, '\n');

    // `$\ge$ 140 mmHg` → `≥ 140 mmHg`, then unwrap any remaining `$...$` math.
    out = out.replace(/\$\s*\\([a-zA-Z]+)\s*\$/g, (whole, name) => MATH_SYMBOLS[name] ?? whole);
    out = out.replace(/\\([a-zA-Z]+)/g, (whole, name) => MATH_SYMBOLS[name] ?? whole);
    out = out.replace(/\$([^$\n]{1,40})\$/g, '$1');

    // `## Core Concept` → `**Core Concept:**`, matching the dominant dialect.
    out = out.replace(/^\s*#{1,6}\s+(.+?)\s*$/gm, (whole, heading) => {
        const clean = heading.replace(/\*+/g, '').replace(/:\s*$/, '').trim();
        return `**${clean}:**`;
    });

    // `* item` → `- item`. The negative lookahead keeps `**bold**` intact.
    out = out.replace(/^(\s*)\*[ \t]+(?!\*)/gm, '$1- ');
    // `• item` / `· item` → `- item`, so the panel has one bullet marker to style.
    out = out.replace(/^(\s*)[•·▪]\s*/gm, '$1- ');

    out = out.split('\n').map(line => line.replace(/[ \t]+$/, '')).join('\n');
    out = out.replace(/\n{3,}/g, '\n\n');
    return out.trim();
}

function readJsonDir(dir) {
    return fs.readdirSync(dir).filter(name => name.toLowerCase().endsWith('.json')).sort();
}

// ── load the anchor ──────────────────────────────────────────────────────────

function loadOriginals() {
    const byId = new Map();
    for (const file of readJsonDir(ORIGINAL_DIR)) {
        const rows = JSON.parse(fs.readFileSync(path.join(ORIGINAL_DIR, file), 'utf8'));
        for (const row of rows) byId.set(row.id, row);
    }
    return byId;
}

// ── load the explanations ────────────────────────────────────────────────────

/**
 * Every candidate explanation found for an id, tagged with where it came from.
 * Duplicates are resolved later (longest wins) rather than here, so the report
 * can say how many ids had more than one.
 */
function loadCandidates() {
    const byId = new Map();
    const stats = { files: 0, parsed: 0, salvaged: 0, records: 0, salvagedRecords: 0 };

    // `answer` is the correct_option as the model returned it, kept only so the
    // drift check can compare it with the original. Salvaged records do not
    // carry one — the salvage reads the explanation field and nothing else.
    const add = (id, explanation, origin, answer) => {
        const value = String(explanation ?? '').trim();
        if (!Number.isInteger(id) || value.length < MIN_LENGTH) return;
        if (!byId.has(id)) byId.set(id, []);
        byId.get(id).push({ explanation: value, origin, answer: answer ?? null });
    };

    for (const file of readJsonDir(DONE_DIR)) {
        stats.files++;
        const raw = fs.readFileSync(path.join(DONE_DIR, file), 'utf8');
        let rows = null;
        try {
            rows = JSON.parse(raw);
        } catch {
            rows = null;
        }

        if (Array.isArray(rows)) {
            stats.parsed++;
            for (const row of rows) {
                const record = trimRecord(row);
                stats.records++;
                add(Number(record.id), record.explanation, 'parsed', record.correct_option);
            }
        } else {
            stats.salvaged++;
            for (const item of salvageExplanations(raw)) {
                stats.salvagedRecords++;
                add(item.id, item.explanation, 'salvaged');
            }
        }
    }

    return { byId, stats };
}

// ── main ─────────────────────────────────────────────────────────────────────

/**
 * A handful of questions had a wrong correct_option in the bank, spotted while
 * reviewing the answer drift. The corrections live in answer-corrections.json
 * and are applied to the anchor here so the drift check compares against the
 * answer the bank is about to hold — importExplanations.js applies the same
 * file to the database, guarded on the current value.
 */
function applyAnswerCorrections(originals) {
    if (!fs.existsSync(CORRECTIONS_FILE)) return 0;
    const corrections = JSON.parse(fs.readFileSync(CORRECTIONS_FILE, 'utf8'));
    let applied = 0;
    for (const correction of corrections) {
        const original = originals.get(Number(correction.id));
        if (!original) {
            console.warn(`  correction for unknown id ${correction.id} — skipped`);
            continue;
        }
        if (compareKey(original.correct_option) !== compareKey(correction.from)) {
            console.warn(`  correction for id ${correction.id} expected "${correction.from}" but the export holds "${original.correct_option}" — skipped`);
            continue;
        }
        original.correct_option = correction.to;
        applied++;
    }
    return applied;
}

function main() {
    const originals = loadOriginals();
    const corrected = applyAnswerCorrections(originals);
    const { byId: candidates, stats } = loadCandidates();

    console.log(`Originals:  ${originals.size} questions from ${ORIGINAL_DIR}`);
    console.log(`Answer corrections applied to the anchor: ${corrected}`);
    console.log(`Done files: ${stats.files} (${stats.parsed} parsed, ${stats.salvaged} salvaged)`);
    console.log(`            ${stats.records} records parsed, ${stats.salvagedRecords} records salvaged`);

    const merged = new Map();       // id -> {id, explanation, origin}
    const quarantine = [];
    const counts = { duplicates: 0, unknownId: 0, answerDrift: 0, twin: 0, authored: 0 };

    for (const [id, list] of candidates) {
        const original = originals.get(id);
        if (!original) { counts.unknownId++; continue; }

        if (list.length > 1) counts.duplicates++;
        // Longest wins: the copies that differ do so by being truncated.
        const best = list.slice().sort((a, b) => b.explanation.length - a.explanation.length)[0];
        const explanation = normalizeExplanation(best.explanation);
        if (explanation.length < MIN_LENGTH) continue;

        // The model rewrote some questions. Whitespace damage is fine — a
        // different correct answer is not, because the explanation then
        // justifies an option the bank does not consider correct.
        const doneAnswer = list.find(item => item.answer)?.answer;
        if (doneAnswer && compareKey(doneAnswer) !== compareKey(original.correct_option)) {
            counts.answerDrift++;
            quarantine.push({ id, reason: 'correct_option drift', original, doneAnswer, explanation });
            continue;
        }

        merged.set(id, { id, explanation, origin: best.origin });
    }

    // The bank holds the same question under more than one collection (388 rows
    // share a text with another row). An id with no explanation of its own can
    // borrow its twin's, as long as the question AND the answer match exactly.
    const twinIndex = new Map();
    for (const id of merged.keys()) {
        const original = originals.get(id);
        const key = `${compareKey(original.question_text)}|${compareKey(original.correct_option)}`;
        if (!twinIndex.has(key)) twinIndex.set(key, id);
    }
    for (const [id, original] of originals) {
        if (merged.has(id)) continue;
        const key = `${compareKey(original.question_text)}|${compareKey(original.correct_option)}`;
        const twin = twinIndex.get(key);
        if (twin === undefined) continue;
        merged.set(id, { id, explanation: merged.get(twin).explanation, origin: 'twin' });
        counts.twin++;
    }

    // Hand-written explanations win over everything: they are the fix for the
    // rows the pipeline could not produce, and for the quarantined ones.
    if (fs.existsSync(AUTHORED_FILE)) {
        const authored = JSON.parse(fs.readFileSync(AUTHORED_FILE, 'utf8'));
        for (const row of authored) {
            const id = Number(row.id);
            const explanation = normalizeExplanation(row.explanation);
            if (!originals.has(id)) { counts.unknownId++; continue; }
            if (explanation.length < MIN_LENGTH) continue;
            merged.set(id, { id, explanation, origin: 'authored' });
            counts.authored++;
        }
        console.log(`Authored overlay: ${counts.authored} explanations from ${path.basename(AUTHORED_FILE)}`);
    } else {
        console.log(`Authored overlay: ${path.basename(AUTHORED_FILE)} not present (skipped)`);
    }

    const missing = [];
    for (const [id, original] of originals) {
        if (merged.has(id)) continue;
        missing.push({
            id,
            question_text: original.question_text,
            option1: original.option1,
            option2: original.option2,
            option3: original.option3,
            option4: original.option4,
            correct_option: original.correct_option,
            question_type: original.question_type,
            source: original.source,
            track: original.track,
            explanation: '',
        });
    }

    const rows = [...merged.values()].sort((a, b) => a.id - b.id);
    fs.writeFileSync(OUT_MERGED, JSON.stringify(rows, null, 2), 'utf8');
    fs.writeFileSync(OUT_MISSING, JSON.stringify(missing.sort((a, b) => a.id - b.id), null, 2), 'utf8');
    fs.writeFileSync(OUT_QUARANTINE, JSON.stringify(quarantine.sort((a, b) => a.id - b.id), null, 2), 'utf8');

    const byOrigin = {};
    for (const row of rows) byOrigin[row.origin] = (byOrigin[row.origin] || 0) + 1;

    console.log('');
    console.log(`Merged:      ${rows.length} / ${originals.size} questions`);
    console.log(`  by origin: ${Object.entries(byOrigin).map(([k, v]) => `${k}=${v}`).join(' ')}`);
    console.log(`  duplicate ids resolved (longest wins): ${counts.duplicates}`);
    console.log(`  ids not in the original export (dropped): ${counts.unknownId}`);
    console.log(`Quarantined: ${quarantine.length} (answer drift — hand-review)`);
    console.log(`Missing:     ${missing.length}`);
    console.log('');
    console.log(`Wrote ${OUT_MERGED}`);
    console.log(`Wrote ${OUT_MISSING}`);
    console.log(`Wrote ${OUT_QUARANTINE}`);
}

main();
