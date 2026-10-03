/**
 * Additive import of a recall collection into the live bank, with multi-source
 * membership.
 *
 * Rules (owner decisions, 2026-10-03):
 *   - Questions are inserted EXACTLY as extracted: text, options, answer and
 *     explanation are never edited. A question recalled with fewer than four
 *     options is padded with the bank's own placeholder ("didn't recall").
 *   - A question whose text already exists in the track's bank is NOT inserted
 *     again. The existing row is attached to the new collection instead
 *     (`questions.sources`), so one row lives in both collections and the
 *     student's progress is shared.
 *   - Nothing existing is edited except `sources` gaining one value.
 *
 * planImport() is pure (no database); applyPlan() writes one transaction.
 */

export const PAD_OPTION = "didn't recall";

/** Same normalisation the offline dedupe used: lower-case, strip everything but a-z0-9. */
export function normalizeText(s) {
    return String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** null when the question is importable, otherwise the reason. */
export function validateQuestion(q, allowedTypes) {
    if (!q || typeof q !== 'object') return 'not an object';
    if (!q.question_text || String(q.question_text).trim().length < 5) return 'empty question_text';
    const opts = [q.option1, q.option2, q.option3, q.option4];
    if (opts.some((o) => typeof o !== 'string' || !o.trim())) return 'a missing option (pad to four first)';
    if (!opts.includes(q.correct_option)) return 'correct_option is not one of the options';
    if (!allowedTypes.includes(q.question_type)) return `question_type "${q.question_type}" is not valid for the track`;
    return null;
}

/**
 * @param {{id:number, question_text:string, correct_option:string, sources:string[]}[]} existing
 *        every row of the track's bank (id order does not matter)
 * @param {object[]} incoming questions of ONE collection
 * @param {string} source the collection being imported
 */
export function planImport({ existing, incoming, source }) {
    const byText = new Map();
    for (const row of [...existing].sort((a, b) => a.id - b.id)) {
        const key = normalizeText(row.question_text);
        if (!byText.has(key)) byText.set(key, []);
        byText.get(key).push(row);
    }
    const plan = {
        insert: [], attach: [], alreadyAttached: [], duplicatesInBatch: [],
        multiMatch: [], answerConflicts: [],
    };
    const seen = new Set();
    for (const q of incoming) {
        const key = normalizeText(q.question_text);
        if (seen.has(key)) { plan.duplicatesInBatch.push(q.qid ?? null); continue; }
        seen.add(key);
        const matches = byText.get(key);
        if (!matches) { plan.insert.push(q); continue; }
        if (matches.some((m) => (m.sources || []).includes(source))) {
            plan.alreadyAttached.push({ qid: q.qid ?? null, id: matches.find((m) => (m.sources || []).includes(source)).id });
            continue;
        }
        const target = matches[0]; // lowest id, deterministic
        plan.attach.push({ id: target.id, qid: q.qid ?? null });
        if (matches.length > 1) plan.multiMatch.push({ qid: q.qid ?? null, ids: matches.map((m) => m.id) });
        if (normalizeText(target.correct_option) !== normalizeText(q.correct_option)) {
            plan.answerConflicts.push({
                qid: q.qid ?? null, id: target.id,
                existing: String(target.correct_option ?? '').slice(0, 80),
                incoming: String(q.correct_option ?? '').slice(0, 80),
            });
        }
    }
    return plan;
}

export function summarisePlan(plan) {
    return {
        toInsert: plan.insert.length,
        toAttach: plan.attach.length,
        alreadyAttached: plan.alreadyAttached.length,
        duplicatesInBatch: plan.duplicatesInBatch.length,
        multiMatch: plan.multiMatch.length,
        answerConflicts: plan.answerConflicts.length,
    };
}

/** Writes the plan in ONE transaction. `client` needs query(); begin/commit are issued here. */
export async function applyPlan(client, plan, { source, track }) {
    await client.query('BEGIN');
    try {
        let inserted = 0;
        for (const q of plan.insert) {
            await client.query(
                `INSERT INTO questions
                    (question_text, option1, option2, option3, option4,
                     question_type, correct_option, source, track, explanation)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                [q.question_text, q.option1, q.option2, q.option3, q.option4,
                 q.question_type, q.correct_option, source, track, q.explanation || null]
            );
            inserted += 1;
        }
        let attached = 0;
        for (const a of plan.attach) {
            const r = await client.query(
                `UPDATE questions SET sources = array_append(sources, $2)
                  WHERE id = $1 AND NOT ($2 = ANY(sources))`,
                [a.id, source]
            );
            attached += r.rowCount ?? 0;
        }
        await client.query('COMMIT');
        return { inserted, attached };
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
    }
}

/**
 * Express handler body shared by the admin route.
 * Body: { source, track, dryRun?, questions: [...] }  (kept under ~80 KB per call)
 */
export async function runRecallImport({ pool, body, allowedSourcesFor, specialtyKeysFor }) {
    const source = String(body?.source || '');
    const track = String(body?.track || '');
    const questions = Array.isArray(body?.questions) ? body.questions : [];
    const allowedSources = allowedSourcesFor(track);
    if (!allowedSources.includes(source)) {
        return { status: 400, json: { success: false, message: `source "${source}" is not a ${track} collection` } };
    }
    if (questions.length === 0 || questions.length > 400) {
        return { status: 400, json: { success: false, message: 'send between 1 and 400 questions per call' } };
    }
    const allowedTypes = specialtyKeysFor(track);
    const bad = [];
    questions.forEach((q, i) => {
        const why = validateQuestion(q, allowedTypes);
        if (why) bad.push({ index: i, qid: q?.qid ?? null, why });
    });
    if (bad.length) return { status: 400, json: { success: false, message: 'invalid questions', bad: bad.slice(0, 20), nBad: bad.length } };

    const { rows: existing } = await pool.query(
        `SELECT id, question_text, correct_option, sources FROM questions WHERE track = $1`, [track]
    );
    const plan = planImport({ existing, incoming: questions, source });
    const summary = summarisePlan(plan);
    if (body?.dryRun !== false) {
        return {
            status: 200,
            json: {
                success: true, dryRun: true, summary,
                conflictSample: plan.answerConflicts.slice(0, 5), multiMatchSample: plan.multiMatch.slice(0, 5),
            },
        };
    }
    const client = await pool.connect();
    try {
        const done = await applyPlan(client, plan, { source, track });
        return { status: 200, json: { success: true, dryRun: false, summary, ...done } };
    } finally {
        client.release();
    }
}
