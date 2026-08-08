/**
 * In-app notifications.
 *
 * Strictly event-driven: a row exists because something actually happened to
 * this student (a goal completed, a streak milestone reached, a subscription
 * about to lapse). There is deliberately no "send a notification to everyone"
 * path — that is what routes/admin-broadcast.js is for, and mixing the two
 * turns a useful signal into a channel people learn to ignore.
 *
 * Every write is best-effort. A notification is a nicety; failing to record one
 * must never break the quiz submission or cron run that triggered it.
 */

/**
 * Record one notification.
 *
 * `dedupeKey` makes milestones idempotent — "goal:42:done" or "streak:7" can be
 * evaluated on every quiz submission and will only ever produce one row, via
 * the partial unique index in ensureSchema(). Omit it for genuinely repeatable
 * notifications.
 */
export async function notify(db, { userId, type, title, body = null, ctaUrl = null, dedupeKey = null }) {
    if (!userId || !type || !title) return null;
    try {
        const { rows } = await db.query(`
            INSERT INTO user_notifications (user_id, type, title, body, cta_url, dedupe_key)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT DO NOTHING
            RETURNING id
        `, [userId, type, String(title).slice(0, 200), body, ctaUrl, dedupeKey]);
        return rows[0]?.id || null;
    } catch (err) {
        console.error('[notifications] insert failed:', err.message);
        return null;
    }
}

/** Streak lengths worth interrupting someone for. */
const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

/**
 * Fire the milestone notifications a finished quiz can trigger: goal reached
 * and streak milestones. Called after a quiz session is recorded.
 *
 * Marks the goal `achieved_at` when it completes but leaves it active, so the
 * hub can show a "done" state the student sees and dismisses themselves rather
 * than a goal that silently vanishes the moment they hit it.
 */
export async function checkMilestones(db, userId) {
    const fired = [];
    try {
        const { rows: goals } = await db.query(
            `SELECT id, goal_type, target_value, period, baseline, achieved_at
               FROM user_goals WHERE user_id = $1 AND is_active = TRUE LIMIT 1`, [userId]);

        if (goals.length && !goals[0].achieved_at) {
            const goal = goals[0];
            const { goalProgress } = await import('./lifecycleJobs.js');
            const { current, label } = await goalProgress(db, userId, goal);
            if (current >= goal.target_value) {
                await db.query(`UPDATE user_goals SET achieved_at = NOW() WHERE id = $1`, [goal.id]);
                const id = await notify(db, {
                    userId,
                    type: 'goal_reached',
                    title: '🎯 حقّقت هدفك!',
                    body: `وصلت إلى ${goal.target_value} ${label}. اضبط هدفاً جديداً وواصل.`,
                    ctaUrl: '/quizs',
                    dedupeKey: `goal:${goal.id}:done`,
                });
                if (id) fired.push('goal_reached');
            }
        }

        const { rows: st } = await db.query(
            `SELECT current_streak FROM user_streaks WHERE user_id = $1`, [userId]);
        const streak = st[0]?.current_streak || 0;
        if (STREAK_MILESTONES.includes(streak)) {
            const id = await notify(db, {
                userId,
                type: 'streak_milestone',
                title: `🔥 ${streak} أيام متتالية`,
                body: 'المداومة هي ما يصنع الفرق في الاختبار — واصل.',
                ctaUrl: '/quizs',
                dedupeKey: `streak:${streak}`,
            });
            if (id) fired.push('streak_milestone');
        }
    } catch (err) {
        console.error('[notifications] milestone check failed:', err.message);
    }
    return fired;
}
