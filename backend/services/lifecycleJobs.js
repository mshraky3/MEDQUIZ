/**
 * Lifecycle email jobs — who is due, and what their numbers are.
 *
 * These live here rather than inline in routes/email-campaigns.js because each
 * one is called from two places: the daily cron, and a standalone endpoint that
 * an external scheduler can hit more often. Vercel's Hobby plan caps the project
 * at two cron entries and both are already spent, so "call it more often from
 * outside" is the only way to tighten the cadence — the same arrangement
 * /api/cron/broadcast-drain already uses.
 *
 * Every job is idempotent: it selects only accounts whose dedupe stamp is unset
 * (or old enough), and stamps the row immediately after a successful send. A
 * job that runs twice in a minute mails nobody twice.
 */
import {
    sendTrialEndedEmail,
    sendProgressDigestEmail,
    sendExpiryReminderEmail,
    sendExamReminderEmail,
    arDaysCount,
} from './userEmailService.js';
import { notify } from './notificationService.js';
import { specialtyLabel } from '../config/tracks.js';

/**
 * Trial ended, never converted → the re-engagement email.
 *
 * The audit behind this job: of 28 traceable trial grants, 4 came back after
 * expiry and 1 paid. Nothing was sent at expiry, so this is the first thing
 * that has ever addressed that moment.
 *
 * Deliberately waits an hour past expiry before sending, so someone who is
 * actively subscribing right now isn't emailed mid-checkout, and skips anyone
 * who already has access (paid, admin-created or grandfathered).
 */
export async function runTrialEndedJob(db, { limit = 100 } = {}) {
    const result = { sent: 0, errors: [] };
    const { rows } = await db.query(`
        SELECT a.id, a.username, a.email, a.track, a.preferred_lang, tg.granted_at, tg.expires_at
          FROM trial_grants tg
          JOIN accounts a ON a.id = tg.account_id
         WHERE tg.expires_at < NOW() - INTERVAL '1 hour'
           AND a.trial_ended_email_sent_at IS NULL
           AND a.email IS NOT NULL
           AND a.email_verified = TRUE
           AND a.isactive = TRUE
           AND COALESCE(a.email_opt_out, FALSE) = FALSE
           AND a.is_admin_created = FALSE
           AND a.grandfathered_at IS NULL
           AND NOT EXISTS (
                 SELECT 1 FROM payment_events pe
                  WHERE pe.account_id = a.id AND pe.status = 'paid'
                    AND pe.livemode IS DISTINCT FROM FALSE)
         ORDER BY tg.expires_at
         LIMIT $1
    `, [limit]);

    for (const user of rows) {
        try {
            // What they actually did inside their hour — the most persuasive
            // content in the email, and entirely theirs.
            const { rows: s } = await db.query(`
                SELECT COALESCE(SUM(qs.total_questions), 0)::int AS answered,
                       COALESCE(SUM(qs.correct_answers), 0)::int AS correct,
                       COUNT(*) FILTER (WHERE qs.end_time IS NOT NULL)::int AS quizzes
                  FROM user_quiz_sessions qs
                 WHERE qs.user_id = $1
                   AND qs.start_time BETWEEN $2 AND $3
            `, [user.id, user.granted_at, user.expires_at]);
            const answered = s[0]?.answered || 0;
            const correct = s[0]?.correct || 0;

            await sendTrialEndedEmail(user.email, String(user.username).split('@')[0], user.track, {
                questionsAnswered: answered,
                accuracy: answered > 0 ? (correct / answered) * 100 : 0,
                quizzesCompleted: s[0]?.quizzes || 0,
            }, { lang: user.preferred_lang, accountId: user.id });
            await db.query(`UPDATE accounts SET trial_ended_email_sent_at = NOW() WHERE id = $1`, [user.id]);
            result.sent++;
        } catch (err) {
            result.errors.push({ job: 'trial_ended', userId: user.id, error: err.message });
        }
    }
    return result;
}

/**
 * Active subscription expiring within 7 days → renewal reminder.
 * The subscription never auto-renews, so without this email an expiry is
 * simply a silent churn.
 */
export async function runExpiryReminderJob(db, { limit = 100 } = {}) {
    const result = { sent: 0, errors: [] };
    const { rows } = await db.query(`
        SELECT id, username, email, track, preferred_lang,
               GREATEST(0, CEIL(EXTRACT(EPOCH FROM (subscription_expiry_date - NOW())) / 86400))::int AS days_remaining
          FROM accounts
         WHERE subscription_status = 'active'
           AND subscription_expiry_date > NOW()
           AND subscription_expiry_date <= NOW() + INTERVAL '7 days'
           AND email IS NOT NULL
           AND email_verified = TRUE
           AND isactive = TRUE
           AND (expiry_reminder_sent_at IS NULL
                OR expiry_reminder_sent_at < NOW() - INTERVAL '30 days')
         LIMIT $1
    `, [limit]);

    for (const user of rows) {
        try {
            await sendExpiryReminderEmail(user.email, String(user.username).split('@')[0], user.track, user.days_remaining,
                { lang: user.preferred_lang, accountId: user.id });
            await db.query(`UPDATE accounts SET expiry_reminder_sent_at = NOW() WHERE id = $1`, [user.id]);
            await notify(db, {
                userId: user.id,
                type: 'subscription_expiring',
                title: `اشتراكك ينتهي بعد ${arDaysCount(user.days_remaining)}`,
                body: 'الاشتراك لا يُجدَّد تلقائياً — جدّده للحفاظ على وصولك.',
                ctaUrl: '/subscribe',
                dedupeKey: `expiry:${new Date(Date.now()).toISOString().slice(0, 10)}`,
            });
            result.sent++;
        } catch (err) {
            result.errors.push({ job: 'expiry_reminder', userId: user.id, error: err.message });
        }
    }
    return result;
}

/**
 * Weekly progress digest for students who actually studied this week.
 *
 * Gated on real activity: someone with nothing to report gets nothing, because
 * a digest of zeros is a reminder that you have not been studying, sent by the
 * product you are not using. Only users with access are included — telling a
 * locked-out user how well they are doing would be tone-deaf.
 */
export async function runProgressDigestJob(db, { limit = 200 } = {}) {
    const result = { sent: 0, errors: [] };
    const { rows } = await db.query(`
        SELECT a.id, a.username, a.email, a.track, a.preferred_lang,
               a.exam_date,
               COALESCE(us.current_streak, 0) AS streak
          FROM accounts a
          LEFT JOIN user_streaks us ON us.user_id = a.id
         WHERE a.email IS NOT NULL
           AND a.email_verified = TRUE
           AND a.isactive = TRUE
           AND COALESCE(a.email_opt_out, FALSE) = FALSE
           AND (a.progress_digest_sent_at IS NULL
                OR a.progress_digest_sent_at < NOW() - INTERVAL '7 days')
           AND ((a.subscription_status = 'active' AND a.subscription_expiry_date > NOW())
                OR a.grandfathered_at IS NOT NULL
                OR a.is_admin_created = TRUE)
           AND EXISTS (
                 SELECT 1 FROM user_quiz_sessions qs
                  WHERE qs.user_id = a.id AND qs.start_time > NOW() - INTERVAL '7 days')
         LIMIT $1
    `, [limit]);

    for (const user of rows) {
        try {
            const { rows: w } = await db.query(`
                SELECT
                    COALESCE(SUM(total_questions) FILTER (WHERE start_time > NOW() - INTERVAL '7 days'), 0)::int  AS q_now,
                    COALESCE(SUM(correct_answers) FILTER (WHERE start_time > NOW() - INTERVAL '7 days'), 0)::int  AS c_now,
                    COALESCE(SUM(total_questions) FILTER (WHERE start_time > NOW() - INTERVAL '14 days'
                                                            AND start_time <= NOW() - INTERVAL '7 days'), 0)::int AS q_prev,
                    COALESCE(SUM(correct_answers) FILTER (WHERE start_time > NOW() - INTERVAL '14 days'
                                                            AND start_time <= NOW() - INTERVAL '7 days'), 0)::int AS c_prev
                  FROM user_quiz_sessions WHERE user_id = $1
            `, [user.id]);
            const r = w[0] || {};
            const qNow = r.q_now || 0;
            const qPrev = r.q_prev || 0;

            const { rows: g } = await db.query(
                // period/question_type/source come along too: without them
                // goalProgress() would treat every goal as an unscoped weekly
                // one, and the bar in the inbox would disagree with the ring
                // on the hub — the exact drift this shared function prevents.
                `SELECT goal_type, target_value, baseline, period, question_type, source
                   FROM user_goals
                  WHERE user_id = $1 AND is_active = TRUE LIMIT 1`, [user.id]);
            let goal = null;
            if (g.length) {
                const progress = await goalProgress(db, user.id, g[0]);
                goal = { label: progress.label, current: progress.current, target: g[0].target_value };
            }

            await sendProgressDigestEmail(user.email, String(user.username).split('@')[0], user.track, {
                questionsThisWeek: qNow,
                accuracyThisWeek: qNow > 0 ? ((r.c_now || 0) / qNow) * 100 : 0,
                accuracyLastWeek: qPrev > 0 ? ((r.c_prev || 0) / qPrev) * 100 : null,
                streak: user.streak,
                goal,
                examDaysRemaining: daysUntil(user.exam_date),
            }, { lang: user.preferred_lang, accountId: user.id });
            await db.query(`UPDATE accounts SET progress_digest_sent_at = NOW() WHERE id = $1`, [user.id]);
            result.sent++;
        } catch (err) {
            result.errors.push({ job: 'progress_digest', userId: user.id, error: err.message });
        }
    }
    return result;
}

/**
 * The reminder ladder, in descending order. Each rung mails exactly once —
 * accounts.exam_reminder_stage holds the last rung sent, and the job only ever
 * moves it DOWN, so an hourly cron cannot re-send and a student who sets their
 * date 10 days out correctly starts at the 7-day rung rather than being
 * back-filled with the 30- and 14-day mails they have already missed.
 */
export const EXAM_REMINDER_STAGES = [30, 14, 7, 3, 1];

/** Whole days from today (UTC midnight) to a DATE column, or null. */
function daysUntil(examDate) {
    if (!examDate) return null;
    const d = new Date(examDate);
    const target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    const now = new Date();
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return Math.round((target - today) / 86400000);
}

/**
 * Staged reminders for the student's own exam date.
 *
 * The only genuinely real deadline in the product — they typed the date in
 * themselves — so this is the one campaign allowed to be urgent. What it is not
 * allowed to be is repetitive: the message differs at every rung (see
 * sendExamReminderEmail), and each student's own weakest specialty is named
 * where the data supports it.
 *
 * Runs off the same cadence as the other lifecycle jobs and is idempotent by
 * the same mechanism: select who is due, send, stamp immediately.
 */
export async function runExamReminderJob(db, { limit = 200 } = {}) {
    const result = { sent: 0, errors: [] };
    const { rows } = await db.query(`
        SELECT id, username, email, track, preferred_lang, exam_date, exam_reminder_stage,
               (exam_date - CURRENT_DATE)::int AS days_remaining
          FROM accounts
         WHERE exam_date IS NOT NULL
           AND exam_date >= CURRENT_DATE
           AND exam_date <= CURRENT_DATE + $1::int
           AND email IS NOT NULL
           AND email_verified = TRUE
           AND isactive = TRUE
           AND COALESCE(email_opt_out, FALSE) = FALSE
         ORDER BY exam_date
         LIMIT $2
    `, [EXAM_REMINDER_STAGES[0], limit]);

    for (const user of rows) {
        // The rung this student is currently inside: the smallest threshold
        // that is still >= the days left. At 9 days out that is 14; at 2 it is
        // 3. Skipped entirely when that rung (or a closer one) already went.
        const due = EXAM_REMINDER_STAGES.find((s) => user.days_remaining <= s);
        if (due == null) continue;
        if (user.exam_reminder_stage != null && user.exam_reminder_stage <= due) continue;

        try {
            // Their own position, so the email can point at a specialty by name
            // rather than saying "revise your weak areas".
            const { rows: st } = await db.query(`
                SELECT COUNT(*)::int                                  AS answered,
                       COUNT(*) FILTER (WHERE uqa.is_correct)::int    AS correct,
                       COUNT(*) FILTER (WHERE NOT uqa.is_correct)::int AS wrong
                  FROM user_question_attempts uqa
                 WHERE uqa.user_id = $1
            `, [user.id]);
            const answered = st[0]?.answered || 0;

            // Weakest specialty, but only where there is enough of a sample for
            // the number to mean anything — 3 questions at 33% is noise.
            const { rows: weak } = await db.query(`
                SELECT q.question_type,
                       ROUND(100.0 * COUNT(*) FILTER (WHERE uqa.is_correct) / COUNT(*))::int AS accuracy
                  FROM user_question_attempts uqa
                  JOIN questions q ON q.id = uqa.question_id
                 WHERE uqa.user_id = $1
                 GROUP BY q.question_type
                HAVING COUNT(*) >= 10
                 ORDER BY accuracy ASC
                 LIMIT 1
            `, [user.id]);

            await sendExamReminderEmail(
                user.email,
                String(user.username).split('@')[0],
                user.track,
                user.days_remaining,
                {
                    questionsAnswered: answered,
                    accuracy: answered > 0 ? ((st[0]?.correct || 0) / answered) * 100 : null,
                    wrongCount: st[0]?.wrong || 0,
                    weakestLabel: weak[0] ? specialtyLabel(weak[0].question_type) : null,
                    weakestAccuracy: weak[0]?.accuracy ?? null,
                },
                { lang: user.preferred_lang, accountId: user.id }
            );
            await db.query(`UPDATE accounts SET exam_reminder_stage = $2 WHERE id = $1`, [user.id, due]);
            await notify(db, {
                userId: user.id,
                type: 'exam_reminder',
                title: user.days_remaining === 0
                    ? 'اختبارك اليوم — بالتوفيق!'
                    : `متبقٍ ${arDaysCount(user.days_remaining)} على اختبارك`,
                body: 'راجع أضعف تخصص لديك وأسئلتك الخاطئة.',
                ctaUrl: '/analysis',
                dedupeKey: `exam:${user.exam_date instanceof Date ? user.exam_date.toISOString().slice(0, 10) : user.exam_date}:${due}`,
            });
            result.sent++;
        } catch (err) {
            result.errors.push({ job: 'exam_reminder', userId: user.id, error: err.message });
        }
    }
    return result;
}

/**
 * Whether a goal is narrowed to a specialty and/or a collection.
 *
 * This is the fork that decides which table answers "how much have I done":
 * an unscoped goal is counted from the per-session totals on
 * user_quiz_sessions (one cheap row per quiz), while a scoped one has to be
 * counted from user_question_attempts, because a session's total_questions
 * says nothing about which specialty each question belonged to.
 */
const isScoped = (goal) => !!(goal.question_type || goal.source);

/**
 * WHERE fragment + params for the scoped (attempts) path.
 * `$1` is always the user id; scope predicates append after it.
 */
function scopedFilter(userId, goal, weekly) {
    const where = ['uqa.user_id = $1'];
    const params = [userId];
    if (weekly) where.push(`uqa.attempted_at > NOW() - INTERVAL '7 days'`);
    if (goal.question_type) {
        params.push(goal.question_type);
        where.push(`q.question_type = $${params.length}`);
    }
    if (goal.source) {
        params.push(goal.source);
        where.push(`q.source = $${params.length}`);
    }
    return { sql: where.join(' AND '), params };
}

/**
 * The lifetime total a scoped goal starts from, so a 'total' goal measures
 * work done since it was set. Exported because routes/goals.js must record it
 * with the SAME definition goalProgress will later subtract it with — a
 * baseline counted one way and progress counted another is a goal that starts
 * at -37%.
 */
export async function scopedBaseline(db, userId, goal) {
    const { sql, params } = scopedFilter(userId, goal, false);
    const { rows } = await db.query(`
        SELECT COUNT(*)::int AS n
          FROM user_question_attempts uqa
          JOIN questions q ON q.id = uqa.question_id
         WHERE ${sql}
    `, params);
    return rows[0]?.n || 0;
}

/**
 * Current progress toward one goal. Exported so the goals API and the digest
 * email compute it identically — two definitions of "how far along am I" is
 * exactly the drift adminMetricsService exists to prevent elsewhere.
 *
 * `baseline` is the user's lifetime total at the moment the goal was created,
 * so a total-period goal measures progress since then rather than crediting
 * work done before the goal existed.
 */
export async function goalProgress(db, userId, goal) {
    const weekly = goal.period !== 'total';
    const windowClause = weekly ? `AND start_time > NOW() - INTERVAL '7 days'` : '';
    const scoped = isScoped(goal);

    if (goal.goal_type === 'questions') {
        if (scoped) {
            const { sql, params } = scopedFilter(userId, goal, weekly);
            const { rows } = await db.query(`
                SELECT COUNT(*)::int AS n
                  FROM user_question_attempts uqa
                  JOIN questions q ON q.id = uqa.question_id
                 WHERE ${sql}
            `, params);
            const total = rows[0]?.n || 0;
            return { label: 'أسئلة', current: Math.max(0, weekly ? total : total - (goal.baseline || 0)) };
        }
        const { rows } = await db.query(
            `SELECT COALESCE(SUM(total_questions),0)::int AS n FROM user_quiz_sessions
              WHERE user_id = $1 ${windowClause}`, [userId]);
        const total = rows[0]?.n || 0;
        return { label: 'أسئلة', current: Math.max(0, weekly ? total : total - (goal.baseline || 0)) };
    }
    if (goal.goal_type === 'quizzes') {
        // Quizzes are never scoped — a session can mix specialties, so "10
        // paediatrics quizzes" has no answer the data could give honestly.
        // routes/goals.js drops any scope sent with this type.
        const { rows } = await db.query(
            `SELECT COUNT(*) FILTER (WHERE end_time IS NOT NULL)::int AS n FROM user_quiz_sessions
              WHERE user_id = $1 ${windowClause}`, [userId]);
        const total = rows[0]?.n || 0;
        return { label: 'اختبارات', current: Math.max(0, weekly ? total : total - (goal.baseline || 0)) };
    }
    // accuracy — a rate, not a running total, so a baseline would be meaningless.
    if (scoped) {
        const { sql, params } = scopedFilter(userId, goal, weekly);
        const { rows } = await db.query(`
            SELECT COUNT(*)::int AS q,
                   COUNT(*) FILTER (WHERE uqa.is_correct)::int AS c
              FROM user_question_attempts uqa
              JOIN questions q ON q.id = uqa.question_id
             WHERE ${sql}
        `, params);
        const q = rows[0]?.q || 0;
        return { label: 'نسبة الدقة', current: q > 0 ? Math.round(((rows[0]?.c || 0) / q) * 100) : 0 };
    }
    const { rows } = await db.query(
        `SELECT COALESCE(SUM(total_questions),0)::int AS q, COALESCE(SUM(correct_answers),0)::int AS c
           FROM user_quiz_sessions WHERE user_id = $1 ${windowClause}`, [userId]);
    const q = rows[0]?.q || 0;
    return { label: 'نسبة الدقة', current: q > 0 ? Math.round(((rows[0]?.c || 0) / q) * 100) : 0 };
}
