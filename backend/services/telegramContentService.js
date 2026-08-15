/**
 * All DB access for the Telegram bot/channel lives here — routes/telegram.js
 * only orchestrates (parse update → call one of these → call telegramClient).
 *
 * Launch scope is medical-track only (see config/tracks.js), so every query
 * here is hardcoded to MEDICAL rather than accepting a track param. Widen this
 * the same day nursing is added to the bot, not before.
 */

import { MEDICAL, TRACKS } from '../config/tracks.js';

/** English label for a question_type — tracks.js only exports the Arabic one (specialtyLabel). */
function specialtyLabelEn(questionType) {
    const hit = TRACKS[MEDICAL].specialties.find((s) => s.key === questionType);
    return hit ? hit.labelEn : questionType;
}

/** The four options in DB column order, and which index is correct. */
function toPollShape(q) {
    const options = [q.option1, q.option2, q.option3, q.option4];
    let correctOptionIndex = options.findIndex((o) => String(o).trim() === String(q.correct_option).trim());
    if (correctOptionIndex === -1) correctOptionIndex = 0; // defensive — should never happen with clean data
    return { options, correctOptionIndex };
}

const QUESTION_COLUMNS = 'id, question_text, option1, option2, option3, option4, correct_option, explanation, question_type';

/**
 * Pick a question for the daily channel post, avoiding anything posted to the
 * channel in the last 90 days. Falls back to the least-recently-posted
 * question once the whole bank has cycled through that window.
 */
export async function pickChannelQuestion(db) {
    const fresh = await db.query(`
        SELECT ${QUESTION_COLUMNS} FROM questions q
        WHERE track = $1
          AND NOT EXISTS (
              SELECT 1 FROM telegram_sent_questions tsq
              WHERE tsq.question_id = q.id AND tsq.context = 'channel'
                AND tsq.sent_at > NOW() - INTERVAL '90 days'
          )
        ORDER BY RANDOM() LIMIT 1
    `, [MEDICAL]);
    if (fresh.rows[0]) return { ...fresh.rows[0], ...toPollShape(fresh.rows[0]) };

    const oldest = await db.query(`
        SELECT ${QUESTION_COLUMNS} FROM questions q
        WHERE track = $1
        ORDER BY (
            SELECT MAX(sent_at) FROM telegram_sent_questions tsq
            WHERE tsq.question_id = q.id AND tsq.context = 'channel'
        ) NULLS FIRST
        LIMIT 1
    `, [MEDICAL]);
    if (!oldest.rows[0]) return null;
    return { ...oldest.rows[0], ...toPollShape(oldest.rows[0]) };
}

/** Random question for a /quiz DM — light dedupe against that user's last 20 answers. */
export async function pickDmQuizQuestion(db, chatId) {
    const { rows } = await db.query(`
        SELECT ${QUESTION_COLUMNS} FROM questions q
        WHERE track = $1
          AND q.id NOT IN (
              SELECT question_id FROM telegram_quiz_attempts
              WHERE chat_id = $2
              ORDER BY sent_at DESC LIMIT 20
          )
        ORDER BY RANDOM() LIMIT 1
    `, [MEDICAL, chatId]);
    if (rows[0]) return { ...rows[0], ...toPollShape(rows[0]) };

    // This user has seen everything recently — just give them a random one.
    const { rows: any } = await db.query(
        `SELECT ${QUESTION_COLUMNS} FROM questions q WHERE track = $1 ORDER BY RANDOM() LIMIT 1`,
        [MEDICAL]
    );
    return any[0] ? { ...any[0], ...toPollShape(any[0]) } : null;
}

export async function recordSentQuestion(db, { questionId, context, chatId = null }) {
    await db.query(
        `INSERT INTO telegram_sent_questions (question_id, context, chat_id) VALUES ($1, $2, $3)`,
        [questionId, context, chatId]
    );
}

export async function recordQuizPollSent(db, { chatId, questionId, pollId }) {
    await db.query(
        `INSERT INTO telegram_quiz_attempts (chat_id, question_id, poll_id) VALUES ($1, $2, $3)
         ON CONFLICT (poll_id) DO NOTHING`,
        [chatId, questionId, pollId]
    );
}

/**
 * poll_answer webhook update → mark whether the selected option was correct.
 * `correctOptionIndex` is passed in because it isn't stored on the attempt
 * row — it's re-derived from the questions table so a later edit to a
 * question's correct answer can never retroactively change past attempts.
 */
export async function recordQuizAnswer(db, { pollId, optionIds }) {
    const { rows } = await db.query(
        `SELECT a.chat_id, a.question_id, q.correct_option, q.option1, q.option2, q.option3, q.option4
         FROM telegram_quiz_attempts a JOIN questions q ON q.id = a.question_id
         WHERE a.poll_id = $1`,
        [pollId]
    );
    const attempt = rows[0];
    if (!attempt) return null; // poll we didn't send (or already resolved), ignore
    const { correctOptionIndex } = toPollShape(attempt);
    const isCorrect = Array.isArray(optionIds) && optionIds[0] === correctOptionIndex;
    await db.query(
        `UPDATE telegram_quiz_attempts SET is_correct = $1, answered_at = NOW() WHERE poll_id = $2`,
        [isCorrect, pollId]
    );
    return { chatId: attempt.chat_id, isCorrect };
}

export async function upsertTelegramUser(db, { chatId, username, firstName }) {
    await db.query(`
        INSERT INTO telegram_users (chat_id, username, first_name)
        VALUES ($1, $2, $3)
        ON CONFLICT (chat_id) DO UPDATE SET
            username = EXCLUDED.username,
            first_name = EXCLUDED.first_name,
            last_active_at = NOW(),
            is_blocked = FALSE
    `, [chatId, username || null, firstName || null]);
}

export async function touchLastActive(db, chatId) {
    await db.query(`UPDATE telegram_users SET last_active_at = NOW() WHERE chat_id = $1`, [chatId]);
}

export async function markBlocked(db, chatId) {
    await db.query(`UPDATE telegram_users SET is_blocked = TRUE WHERE chat_id = $1`, [chatId]);
}

const MIN_ATTEMPTS_FOR_WEAKSPOTS = 5;

/**
 * Weak topics for one chat, from their own answered /quiz polls. Returns null
 * if they haven't answered enough yet (nothing useful to say).
 */
export async function computeWeakTopics(db, chatId) {
    const { rows } = await db.query(`
        SELECT q.question_type,
               COUNT(*)::int AS total,
               SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::int AS correct
        FROM telegram_quiz_attempts a
        JOIN questions q ON q.id = a.question_id
        WHERE a.chat_id = $1 AND a.is_correct IS NOT NULL
        GROUP BY q.question_type
    `, [chatId]);

    const totalAnswered = rows.reduce((sum, r) => sum + r.total, 0);
    if (totalAnswered < MIN_ATTEMPTS_FOR_WEAKSPOTS) return { totalAnswered, topics: null };

    const topics = rows
        .map((r) => ({
            questionType: r.question_type,
            labelEn: specialtyLabelEn(r.question_type),
            total: r.total,
            accuracy: Math.round((r.correct / r.total) * 100),
        }))
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 3);

    return { totalAnswered, topics };
}

/** Bot users due for their weekly weak-topics DM: enough attempts, stamp is null or 7+ days old. */
export async function findDueForWeeklyDigest(db) {
    const { rows } = await db.query(`
        SELECT tu.chat_id
        FROM telegram_users tu
        WHERE tu.is_blocked = FALSE
          AND (tu.weak_topics_sent_at IS NULL OR tu.weak_topics_sent_at < NOW() - INTERVAL '7 days')
          AND (
              SELECT COUNT(*) FROM telegram_quiz_attempts a
              WHERE a.chat_id = tu.chat_id AND a.is_correct IS NOT NULL
          ) >= $1
        LIMIT 200
    `, [MIN_ATTEMPTS_FOR_WEAKSPOTS]);
    return rows.map((r) => r.chat_id);
}

export async function stampWeeklyDigestSent(db, chatId) {
    await db.query(`UPDATE telegram_users SET weak_topics_sent_at = NOW() WHERE chat_id = $1`, [chatId]);
}

/** How many channel questions have already gone out today (UTC)? Caps the daily cron at 3/day. */
export async function channelPostsToday(db) {
    const { rows } = await db.query(
        `SELECT COUNT(*)::int AS c FROM telegram_sent_questions WHERE context = 'channel' AND sent_at::date = CURRENT_DATE`
    );
    return rows[0].c;
}

/** Log an outbound message for scheduled deletion (channel posts only — see telegramClient.deleteMessage). */
export async function recordSentMessage(db, { chatId, messageId, deleteAfterDays }) {
    await db.query(
        `INSERT INTO telegram_sent_messages (chat_id, message_id, delete_after) VALUES ($1, $2, NOW() + make_interval(days => $3))`,
        [String(chatId), messageId, deleteAfterDays]
    );
}

/** Messages due for deletion right now. */
export async function findMessagesDueForDeletion(db, limit = 50) {
    const { rows } = await db.query(
        `SELECT id, chat_id, message_id FROM telegram_sent_messages WHERE delete_after <= NOW() ORDER BY delete_after LIMIT $1`,
        [limit]
    );
    return rows;
}

export async function removeSentMessageLog(db, id) {
    await db.query(`DELETE FROM telegram_sent_messages WHERE id = $1`, [id]);
}

/** Least-recently-posted published summary for the weekly channel topic post — same rotation pattern as pickChannelQuestion. */
export async function pickChannelSummary(db) {
    const { rows } = await db.query(`
        SELECT s.id, s.slug, s.title_en, s.title, s.description
        FROM summaries s
        WHERE s.track = $1 AND s.is_published = TRUE AND s.is_overview = FALSE
        ORDER BY (
            SELECT MAX(sent_at) FROM telegram_sent_summaries tss WHERE tss.summary_id = s.id
        ) NULLS FIRST
        LIMIT 1
    `, [MEDICAL]);
    return rows[0] || null;
}

export async function recordSentSummary(db, summaryId) {
    await db.query(`INSERT INTO telegram_sent_summaries (summary_id) VALUES ($1)`, [summaryId]);
}
