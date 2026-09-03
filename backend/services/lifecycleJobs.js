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
    sendAccessEndedEmail,
    sendExamReminderEmail,
    sendOneSessionComebackEmail,
    arDaysCount,
} from './userEmailService.js';
import { notify } from './notificationService.js';
import { specialtyLabel } from '../config/tracks.js';
import { FREE_QUESTION_ALLOWANCE } from './paymentService.js';

/**
 * Free allowance used up, never converted → the re-engagement email.
 *
 * Was the "trial ended" job. The moment it addresses is the same one — the
 * student has seen what the bank is like and hit the end of the free part —
 * but it is now a question count, not a clock, and reaching it no longer locks
 * anyone out. That changes the ask: not "you've been cut off", but "you've
 * finished the free 40, here's what they showed about you".
 *
 * Skips anyone who already has access (paid, admin-created or grandfathered),
 * and anyone with a paid event in the ledger even if their term has lapsed.
 */
export async function runTrialEndedJob(db, { limit = 100 } = {}) {
    const result = { sent: 0, errors: [] };
    // No grace window is needed any more: the old one existed because the
    // heartbeat stamped subscription_expiry_date at the exact instant of
    // exhaustion and we did not want to mail someone mid-checkout. The
    // allowance is spent when a quiz is SUBMITTED, and the job runs daily, so
    // the gap is already hours.
    const { rows } = await db.query(`
        SELECT a.id, a.username, a.email, a.track, a.preferred_lang, a.created_at
          FROM accounts a
         WHERE a.free_questions_used >= ${FREE_QUESTION_ALLOWANCE}
           AND a.trial_ended_email_sent_at IS NULL
           AND a.email IS NOT NULL
           AND a.email_verified = TRUE
           AND a.isactive = TRUE
           AND COALESCE(a.email_opt_out, FALSE) = FALSE
           AND a.is_admin_created = FALSE
           AND a.grandfathered_at IS NULL
           AND NOT (a.subscription_status = 'active' AND a.subscription_expiry_date > NOW())
           AND NOT EXISTS (
                 SELECT 1 FROM payment_events pe
                  WHERE pe.account_id = a.id AND pe.status = 'paid'
                    AND pe.livemode IS DISTINCT FROM FALSE)
         ORDER BY a.id
         LIMIT $1
    `, [limit]);

    for (const user of rows) {
        try {
            // What they actually did with their 40 — the most persuasive
            // content in the email, and entirely theirs. Their whole history
            // now, since the free questions are their whole history.
            const { rows: s } = await db.query(`
                SELECT COALESCE(SUM(qs.total_questions), 0)::int AS answered,
                       COALESCE(SUM(qs.correct_answers), 0)::int AS correct,
                       COUNT(*) FILTER (WHERE qs.end_time IS NOT NULL)::int AS quizzes
                  FROM user_quiz_sessions qs
                 WHERE qs.user_id = $1
            `, [user.id]);
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
 * Day-1/Day-3 win-back for anyone stuck at exactly one quiz session, ever.
 *
 * The journey audit behind MONETIZATION_ANALYSIS_2026-08.md found 26 of 42
 * quizzing users did precisely one session and never returned — the single
 * largest drop-off in the funnel, and the one nobody had ever addressed.
 * Right now that user gets nothing after their one quiz. This writes itself
 * from data already on hand (their own wrong answers), which is the whole
 * point: it is the most persuasive, and the cheapest, email in the file.
 *
 * A ladder like exam_reminder_stage, but counting UP from the session instead
 * of down to a deadline: stage 1 fires ~a day after the session, stage 3 a
 * couple of days after that. Anyone who ran a second session already came
 * back on their own and drops out of the query entirely — no need to nag
 * someone who is already using the product.
 */
export const COMEBACK_STAGES = [1, 3];

// How many of the missed questions to actually put in the email. Four is the
// most that still reads as a reminder rather than a wall — and if a student
// missed twenty, seeing four of them makes the point about the other sixteen
// better than listing them would.
export const COMEBACK_QUESTION_SAMPLE = 4;

export async function runComebackJob(db, { limit = 200 } = {}) {
    const result = { sent: 0, errors: [] };
    const { rows } = await db.query(`
        SELECT a.id, a.username, a.email, a.track, a.preferred_lang, a.comeback_email_stage,
               qs.id AS session_id, qs.total_questions, qs.correct_answers,
               FLOOR(EXTRACT(EPOCH FROM (NOW() - qs.start_time)) / 86400)::int AS days_since
          FROM accounts a
          JOIN LATERAL (
               SELECT id, total_questions, correct_answers, start_time
                 FROM user_quiz_sessions
                WHERE user_id = a.id AND end_time IS NOT NULL
                ORDER BY start_time ASC
                LIMIT 1
          ) qs ON TRUE
         WHERE a.email IS NOT NULL
           AND a.email_verified = TRUE
           AND a.isactive = TRUE
           AND COALESCE(a.email_opt_out, FALSE) = FALSE
           AND qs.start_time <= NOW() - INTERVAL '1 day'
           AND (SELECT COUNT(*) FROM user_quiz_sessions s2
                 WHERE s2.user_id = a.id AND s2.end_time IS NOT NULL) = 1
         ORDER BY qs.start_time
         LIMIT $1
    `, [limit]);

    for (const user of rows) {
        const daysSince = Number(user.days_since) || 0;
        const due = [...COMEBACK_STAGES].reverse().find((s) => daysSince >= s);
        if (due == null) continue;
        if (user.comeback_email_stage != null && user.comeback_email_stage >= due) continue;

        try {
            // The questions themselves, not just how many. This email used to
            // say "you missed 5 of 20" and link to /wrong-questions, which is
            // behind a login — so its whole argument was a number and a door.
            // Putting the actual questions in the inbox is the argument: the
            // student reads one, remembers getting it wrong, and now wants the
            // explanation. That is the product, demonstrated rather than
            // described, and it costs one query against data already stored.
            const { rows: wrong } = await db.query(`
                SELECT q.question_text, q.correct_option, uqa.selected_option, q.explanation
                  FROM user_question_attempts uqa
                  JOIN questions q ON q.id = uqa.question_id
                 WHERE uqa.quiz_session_id = $1 AND uqa.is_correct = FALSE
                 ORDER BY uqa.attempted_at ASC
                 LIMIT $2
            `, [user.session_id, COMEBACK_QUESTION_SAMPLE]);

            const { rows: wrongTotal } = await db.query(`
                SELECT COUNT(*)::int AS n
                  FROM user_question_attempts
                 WHERE quiz_session_id = $1 AND is_correct = FALSE
            `, [user.session_id]);

            const answered = Number(user.total_questions) || 0;
            const correct = Number(user.correct_answers) || 0;
            const wrongCount = wrongTotal[0]?.n ?? Math.max(0, answered - correct);

            await sendOneSessionComebackEmail(user.email, String(user.username).split('@')[0], user.track, {
                questionsAnswered: answered,
                correct,
                wrongCount,
                wrongQuestions: wrong,
            }, { lang: user.preferred_lang, accountId: user.id });
            await db.query(`UPDATE accounts SET comeback_email_stage = $2 WHERE id = $1`, [user.id, due]);
            result.sent++;
        } catch (err) {
            result.errors.push({ job: 'comeback', userId: user.id, error: err.message });
        }
    }
    return result;
}

/**
 * The renewal sequence, both sides of the expiry date.
 *
 * Nothing in this product auto-renews — there is no tokenisation and no
 * recurring charge, which is a promise made in the UI and in the Terms. The
 * consequence is that every expiry is a manual re-sell, and one that is not
 * reminded is silent churn.
 *
 * Until now there was exactly one email, fired once when the subscription came
 * within seven days of ending, and nothing at all afterwards. So the moment
 * with the most evidence behind it — the student opens the bank, finds it
 * locked, and now genuinely knows what the subscription was worth — was the
 * moment the product said nothing.
 *
 * Three rungs, and the copy differs at each:
 *
 *   1  seven days out   why there is no automatic charge, and what lapsing costs
 *   2  the day before   the same fact, without the explanation in the way
 *   3  three days after their own record of the term, and the door left open
 *
 * Three is where it stops. A fourth would be arguing with someone who has
 * already decided, and this file's whole tone rests on not doing that.
 */
export const RENEWAL_STAGES = [
    { id: 1, at: 7 },   // send once days-to-expiry <= 7
    { id: 2, at: 1 },   // ... <= 1
    { id: 3, at: -3 },  // ... <= -3, i.e. three days after it lapsed
];

/** How far the ladder has been climbed, from days remaining (negative = lapsed). */
export function dueRenewalStage(daysToExpiry) {
    if (!Number.isFinite(daysToExpiry)) return null;
    // Highest rung whose threshold has been passed. The thresholds descend, so
    // walking them in reverse finds the furthest one reached.
    for (let i = RENEWAL_STAGES.length - 1; i >= 0; i--) {
        if (daysToExpiry <= RENEWAL_STAGES[i].at) return RENEWAL_STAGES[i].id;
    }
    return null;
}

/** How long after expiry rung 3 stops being offered, so a dormant account is not mailed months late. */
const RENEWAL_TAIL_DAYS = 30;

export async function runRenewalSequenceJob(db, { limit = 200 } = {}) {
    const result = { sent: 0, errors: [] };
    // The window spans both sides of the date: seven days before through
    // RENEWAL_TAIL_DAYS after. `subscription_status` is deliberately NOT
    // filtered to 'active' — rung 3 exists precisely for rows whose term has
    // run out — so the paid-term check is the expiry date plus the exclusions
    // below.
    //
    // 'refunded' is the exclusion that matters. A full refund sets the status
    // and pushes subscription_expiry_date to NOW() (see handleWebhookEvent), so
    // a refunded customer lands squarely inside this window — and would be told
    // three days later what they achieved with the term and invited to buy it
    // again. They asked for their money back. 'free' and 'grandfathered' are
    // excluded for the plainer reason that they never bought a term to renew.
    const { rows } = await db.query(`
        SELECT id, username, email, track, preferred_lang, renewal_reminder_stage,
               CEIL(EXTRACT(EPOCH FROM (subscription_expiry_date - NOW())) / 86400)::int AS days_to_expiry
          FROM accounts
         WHERE subscription_expiry_date IS NOT NULL
           AND subscription_expiry_date <= NOW() + INTERVAL '7 days'
           AND subscription_expiry_date >= NOW() - ($1::int * INTERVAL '1 day')
           AND COALESCE(subscription_status, '') NOT IN ('refunded', 'free', 'grandfathered')
           AND email IS NOT NULL
           AND email_verified = TRUE
           AND isactive = TRUE
           AND COALESCE(email_opt_out, FALSE) = FALSE
           AND grandfathered_at IS NULL
           AND is_admin_created = FALSE
         ORDER BY subscription_expiry_date
         LIMIT $2
    `, [RENEWAL_TAIL_DAYS, limit]);

    for (const user of rows) {
        const days = Number(user.days_to_expiry);
        const due = dueRenewalStage(days);
        if (due == null) continue;
        // The stage only moves forward, which is what makes an hourly job send
        // each rung exactly once. A renewal resets it to NULL (see
        // paymentService), restarting the ladder for the new term.
        if (user.renewal_reminder_stage != null && user.renewal_reminder_stage >= due) continue;

        try {
            const name = String(user.username).split('@')[0];
            if (due === 3) {
                // Their own record of the term they paid for. Anyone who
                // answered nothing gets the message without the numbers — see
                // sendAccessEndedEmail.
                const { rows: st } = await db.query(`
                    SELECT COUNT(*)::int AS answered,
                           COUNT(*) FILTER (WHERE is_correct)::int AS correct
                      FROM user_question_attempts
                     WHERE user_id = $1
                `, [user.id]);
                const answered = st[0]?.answered || 0;
                const correct = st[0]?.correct || 0;

                // Same sample floor as the exam reminder: three questions at
                // 33% is noise, not a weakness.
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

                await sendAccessEndedEmail(user.email, name, user.track, {
                    questionsAnswered: answered,
                    accuracy: answered ? Math.round((correct / answered) * 100) : null,
                    weakestLabel: weak[0] ? specialtyLabel(weak[0].question_type) : null,
                    weakestAccuracy: weak[0]?.accuracy ?? null,
                }, { lang: user.preferred_lang, accountId: user.id });
            } else {
                await sendExpiryReminderEmail(user.email, name, user.track, Math.max(0, days),
                    { lang: user.preferred_lang, accountId: user.id });
            }

            await db.query(
                `UPDATE accounts SET renewal_reminder_stage = $2 WHERE id = $1`,
                [user.id, due]
            );

            await notify(db, {
                userId: user.id,
                type: due === 3 ? 'subscription_ended' : 'subscription_expiring',
                title: due === 3
                    ? 'انتهى اشتراكك'
                    : `اشتراكك ينتهي بعد ${arDaysCount(Math.max(0, days))}`,
                body: due === 3
                    ? 'تقدّمك وإحصاءاتك محفوظة — استعد وصولك متى شئت.'
                    : 'الاشتراك لا يُجدَّد تلقائياً — جدّده للحفاظ على وصولك.',
                ctaUrl: '/subscribe',
                dedupeKey: `renewal:${user.id}:${due}`,
            });
            result.sent++;
        } catch (err) {
            result.errors.push({ job: 'renewal_sequence', userId: user.id, error: err.message });
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
