/**
 * Database side of exam mode: the question queries. The picking rules are in services/examPicker.js, the
 * exam shapes in config/exams.js, the HTTP layer in routes/exam.js.
 *
 * Track rule (project-rules/SQB.md): the track is ALWAYS the session's. Nothing
 * here accepts a track from a request.
 */

import { resolveSources } from '../config/sources.js';
import { specialtyKeys } from '../config/tracks.js';
import { pickExamQuestions, toExamQuestion } from './examPicker.js';
import { attachQuestionImages } from './questionImagesService.js';

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
