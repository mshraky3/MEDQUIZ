/**
 * Database side of exam mode: the question queries, the free demo claim, and
 * saving a finished demo. The picking rules are in services/examPicker.js, the
 * exam shapes in config/exams.js, the HTTP layer in routes/exam.js.
 *
 * Track rule (project-rules/SQB.md): the track is ALWAYS the session's. Nothing
 * here accepts a track from a request.
 */

import { resolveSources } from '../config/sources.js';
import { specialtyKeys } from '../config/tracks.js';
import { DEMO_RESUME_HOURS } from '../config/exams.js';
import { pickExamQuestions, toExamQuestion } from './examPicker.js';
import { insertFinalQuizAttempts } from './finalQuizAttempts.js';
import { recomputeSessionSummary } from './sessionSummary.js';
import { judgeAnswer } from './attemptValidation.js';
import { attachQuestionImages } from './questionImagesService.js';

/**
 * One row per account that has started its free demo. `question_ids` pins the
 * questions so a reload can resume the same demo; `submitted_at` / `session_id`
 * close it. ON DELETE CASCADE: deleting an account removes its claim.
 */
export const EXAM_DEMO_DDL = [
    `CREATE TABLE IF NOT EXISTS exam_demo_claims (
        account_id   INTEGER PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
        exam_key     VARCHAR(10) NOT NULL,
        question_ids INTEGER[] NOT NULL DEFAULT '{}',
        claimed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        submitted_at TIMESTAMPTZ,
        session_id   INTEGER
    )`,
];

// The two columns of final_review_sessions that describe what was sat.
export const EXAM_SESSION_TYPE = 'exam';
export const examSessionSource = (key, demo) => (demo ? `${key}-demo` : key);

/** SQL that refuses a "didn't recall" option, in either apostrophe style, and any empty or repeated option. */
const OPTIONS_OK_SQL = (() => {
    const cols = ['option1', 'option2', 'option3', 'option4'].map((c) => `LOWER(BTRIM(REPLACE(q.${c}, '’', '''')))`);
    const parts = cols.map((c) => `${c} <> '' AND ${c} <> 'didn''t recall'`);
    for (let i = 0; i < cols.length; i += 1) {
        for (let j = i + 1; j < cols.length; j += 1) parts.push(`${cols[i]} <> ${cols[j]}`);
    }
    return parts.join(' AND ');
})();

const EXPLAINED_SQL = `q.explanation IS NOT NULL AND BTRIM(q.explanation) <> ''`;

function sourceClause(track, params) {
    const sources = resolveSources(null, track);
    if (!sources) return '';
    params.push(sources);
    return `AND q.sources && $${params.length}::text[]`;
}

/** Usable questions per specialty for a track. { 'medicine': 2582, ... } */
export async function countUsableBySpecialty(db, track) {
    const params = [track, specialtyKeys(track)];
    const src = sourceClause(track, params);
    const { rows } = await db.query(
        `SELECT q.question_type AS key, COUNT(*)::int AS n
           FROM questions q
          WHERE q.track = $1 AND q.question_type = ANY($2::text[]) ${src}
            AND ${EXPLAINED_SQL} AND ${OPTIONS_OK_SQL}
          GROUP BY q.question_type`,
        params
    );
    return Object.fromEntries(rows.map((r) => [r.key, r.n]));
}

/** Random usable candidates from some specialties of a track, never the ids in `excludeIds`. */
export function makeBucketFetcher(db, track) {
    return async function fetchBucket({ specialties, limit, excludeIds }) {
        const params = [track, specialties];
        const src = sourceClause(track, params);
        params.push(excludeIds || []);
        const exIdx = params.length;
        params.push(limit);
        const { rows } = await db.query(
            `SELECT q.id, q.question_text, q.option1, q.option2, q.option3, q.option4,
                    q.correct_option, q.question_type, q.source, TRUE AS has_explanation
               FROM questions q
              WHERE q.track = $1 AND q.question_type = ANY($2::text[]) ${src}
                AND ${EXPLAINED_SQL} AND ${OPTIONS_OK_SQL}
                AND NOT (q.id = ANY($${exIdx}::int[]))
              ORDER BY RANDOM()
              LIMIT $${params.length}`,
            params
        );
        return rows;
    };
}

/** Pick and shape an exam for the session's track. */
export async function buildExam(db, { track, config, rng }) {
    const counts = await countUsableBySpecialty(db, track);
    const result = await pickExamQuestions({ config, counts, fetchBucket: makeBucketFetcher(db, track), rng });
    const questions = result.questions.map(toExamQuestion);
    await attachQuestionImages(db, questions);
    return { ...result, questions };
}

// ---------------------------------------------------------------- demo claim

export async function getDemoClaim(db, accountId) {
    const { rows } = await db.query(
        `SELECT account_id, exam_key, question_ids, claimed_at, submitted_at, session_id
           FROM exam_demo_claims WHERE account_id = $1`,
        [accountId]
    );
    return rows[0] || null;
}

/** An unsubmitted claim can be resumed for a few hours; after that the demo counts as used. */
export function claimState(claim, now = Date.now()) {
    if (!claim) return 'available';
    if (claim.submitted_at) return 'used';
    const age = now - new Date(claim.claimed_at).getTime();
    return age <= DEMO_RESUME_HOURS * 3600 * 1000 && (claim.question_ids || []).length > 0 ? 'resume' : 'used';
}

/**
 * Take the one demo. Atomic: the INSERT is the claim, so two parallel starts
 * cannot both win. Returns true when this call created the claim.
 */
export async function claimDemo(db, accountId, examKey) {
    const { rows } = await db.query(
        `INSERT INTO exam_demo_claims (account_id, exam_key) VALUES ($1, $2)
         ON CONFLICT (account_id) DO NOTHING RETURNING account_id`,
        [accountId, examKey]
    );
    return rows.length === 1;
}

export async function pinDemoQuestions(db, accountId, ids) {
    await db.query(`UPDATE exam_demo_claims SET question_ids = $2::int[] WHERE account_id = $1`, [accountId, ids]);
}

/** A failed start must not burn the demo. */
export async function releaseDemoClaim(db, accountId) {
    await db.query(`DELETE FROM exam_demo_claims WHERE account_id = $1 AND submitted_at IS NULL`, [accountId]);
}

/** The pinned questions again, in their pinned order (a resumed demo). */
export async function loadPinnedQuestions(db, ids) {
    if (!ids || ids.length === 0) return [];
    const { rows } = await db.query(
        `SELECT q.id, q.question_text, q.option1, q.option2, q.option3, q.option4,
                q.correct_option, q.question_type, q.source
           FROM questions q WHERE q.id = ANY($1::int[])`,
        [ids]
    );
    const byId = new Map(rows.map((r) => [r.id, r]));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean).map(toExamQuestion);
    await attachQuestionImages(db, ordered);
    return ordered;
}

// --------------------------------------------------------------- demo submit

const clampInt = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(Number(v) || 0)));

/**
 * Save a finished demo. The server grades it: the key and is_correct come from
 * the questions table, the browser only says which option text was chosen.
 * Idempotent: a repeat of an already-saved demo returns the first session.
 *
 * @returns {{ status: 'saved'|'already'|'no_claim'|'bad_attempts', ... }}
 */
export async function saveDemoSession(db, { accountId, attempts, timeTaken, timeLimit, flagsUsed, metaIn }) {
    const claim = await getDemoClaim(db, accountId);
    if (!claim) return { status: 'no_claim' };
    if (claim.submitted_at && claim.session_id) {
        const { rows } = await db.query(
            `SELECT id, session_id, total_questions, correct_answers, score FROM final_review_sessions WHERE id = $1`,
            [claim.session_id]
        );
        if (rows[0]) {
            return { status: 'already', sessionId: rows[0].id, sessionUuid: rows[0].session_id, score: Number(rows[0].score) };
        }
    }

    const pinned = (claim.question_ids || []).map(Number);
    const pinnedSet = new Set(pinned);
    const list = Array.isArray(attempts) ? attempts : [];
    if (list.length > pinned.length || list.some((a) => !pinnedSet.has(Number(a?.questionId)))) {
        return { status: 'bad_attempts' };
    }
    const chosen = new Map(list.map((a) => [Number(a.questionId), a]));

    const { rows: qrows } = await db.query(
        `SELECT id, option1, option2, option3, option4, correct_option FROM questions WHERE id = ANY($1::int[])`,
        [pinned]
    );
    const byId = new Map(qrows.map((r) => [r.id, r]));

    const stored = [];
    let correct = 0;
    let answered = 0;
    for (const id of pinned) {
        const q = byId.get(id);
        if (!q) continue;
        const a = chosen.get(id);
        const verdict = judgeAnswer(q, a ? a.userAnswer : '');
        const picked = verdict.status === 'ok';
        if (picked) answered += 1;
        if (picked && verdict.isCorrect) correct += 1;
        stored.push({
            questionId: id,
            userAnswer: picked ? String(verdict.canonical).slice(0, 255) : '',
            correctAnswer: String(q.correct_option).slice(0, 255),
            isCorrect: picked && verdict.isCorrect,
            timeTaken: clampInt(a?.timeTaken, 0, 36000),
        });
    }
    if (stored.length === 0) return { status: 'bad_attempts' };

    const total = stored.length;
    const score = Math.round((correct / total) * 10000) / 100;
    const seconds = clampInt(timeTaken, 0, 36000);
    const limit = clampInt(timeLimit, 0, 36000);
    const metadata = {
        device: 'web',
        timestamp: new Date().toISOString(),
        exam: {
            v: 1,
            key: claim.exam_key,
            mode: 'demo',
            parts: [{ index: 1, questions: total, answered, correct, percent: score, seconds }],
            flagsUsed: clampInt(flagsUsed, 0, total),
            ...(metaIn && typeof metaIn === 'object' && metaIn.confirmed === false ? { confirmed: false } : {}),
        },
    };

    const ins = await db.query(
        `INSERT INTO final_review_sessions
            (user_id, question_type, source, total_questions, correct_answers, score,
             time_taken, time_limit, end_time, session_metadata, question_ids)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, $9::jsonb, $10::int[])
         RETURNING id, session_id`,
        [accountId, EXAM_SESSION_TYPE, examSessionSource(claim.exam_key, true), total, correct, score,
            seconds, limit, JSON.stringify(metadata), stored.map((s) => s.questionId)]
    );
    const sessionId = ins.rows[0].id;
    try {
        await insertFinalQuizAttempts(db, sessionId, stored);
        await recomputeSessionSummary(db, sessionId, accountId, { final: true });
        await db.query(
            `UPDATE exam_demo_claims SET submitted_at = NOW(), session_id = $2 WHERE account_id = $1`,
            [accountId, sessionId]
        );
    } catch (err) {
        // Do not leave a half-saved session behind: remove it (attempts cascade) and let the client retry.
        await db.query(`DELETE FROM final_review_sessions WHERE id = $1`, [sessionId]).catch(() => {});
        throw err;
    }
    return { status: 'saved', sessionId, sessionUuid: ins.rows[0].session_id, score, correct, total };
}
