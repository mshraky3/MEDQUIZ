/**
 * Daily integrity check: do answers still belong to their questions, and do totals still add up?
 * Read-only SQL (the same checks as _private-data/SQB/prevention-2026-11-04/audit-queries.sql, limited to the last 2 days).
 * The route mails the owner ONLY when a check finds rows; a quiet day sends nothing.
 * Mail text carries counts and account/session numbers only: no names, phones, answers or tokens.
 */

const WINDOW = `INTERVAL '2 days'`;

export const INTEGRITY_CHECKS = [
    {
        name: 'attempt_not_an_option',
        title: 'Answers whose chosen text is not one of the question\'s options (last 2 days)',
        urgent: true,
        sql: `SELECT a.user_id, a.quiz_session_id AS session_id, COUNT(*)::int AS n
                FROM user_question_attempts a JOIN questions q ON q.id = a.question_id
               WHERE a.attempted_at > NOW() - ${WINDOW}
                 AND a.selected_option IS DISTINCT FROM q.option1 AND a.selected_option IS DISTINCT FROM q.option2
                 AND a.selected_option IS DISTINCT FROM q.option3 AND a.selected_option IS DISTINCT FROM q.option4
               GROUP BY 1, 2 ORDER BY n DESC LIMIT 10`,
    },
    {
        name: 'final_answer_not_an_option',
        title: 'Final-exam answers that are not an option of their question (last 2 days)',
        urgent: true,
        sql: `SELECT f.session_id, COUNT(*)::int AS n
                FROM final_quiz_attempts f JOIN questions q ON q.id = f.question_id
               WHERE f.created_at > NOW() - ${WINDOW}
                 AND f.user_answer IS DISTINCT FROM q.option1 AND f.user_answer IS DISTINCT FROM q.option2
                 AND f.user_answer IS DISTINCT FROM q.option3 AND f.user_answer IS DISTINCT FROM q.option4
               GROUP BY 1 ORDER BY n DESC LIMIT 10`,
    },
    {
        name: 'session_totals_differ',
        title: 'Quiz sessions whose totals differ from their saved answers (older than 30 min, last 2 days)',
        urgent: false,
        sql: `SELECT s.user_id, s.id AS session_id, s.total_questions AS stored_total, t.n AS rows, s.correct_answers AS stored_correct, t.c AS rows_correct
                FROM user_quiz_sessions s
                JOIN (SELECT quiz_session_id AS sid, COUNT(*)::int AS n, (COUNT(*) FILTER (WHERE is_correct))::int AS c
                        FROM user_question_attempts GROUP BY 1) t ON t.sid = s.id
               WHERE s.start_time > NOW() - ${WINDOW} AND s.start_time < NOW() - INTERVAL '30 minutes'
                 AND (s.total_questions <> t.n OR s.correct_answers <> t.c)
               ORDER BY s.id DESC LIMIT 10`,
    },
    {
        name: 'question_key_not_an_option',
        title: 'Questions whose correct answer is not one of the four options',
        urgent: true,
        sql: `SELECT id FROM questions
               WHERE correct_option IS DISTINCT FROM option1 AND correct_option IS DISTINCT FROM option2
                 AND correct_option IS DISTINCT FROM option3 AND correct_option IS DISTINCT FROM option4
               ORDER BY id DESC LIMIT 10`,
    },
    {
        name: 'attempt_without_session',
        title: 'Answers saved with no quiz session (last 2 days)',
        urgent: false,
        sql: `SELECT a.user_id, COUNT(*)::int AS n FROM user_question_attempts a
               WHERE a.attempted_at > NOW() - ${WINDOW}
                 AND (a.quiz_session_id IS NULL OR NOT EXISTS (SELECT 1 FROM user_quiz_sessions s WHERE s.id = a.quiz_session_id))
               GROUP BY 1 LIMIT 10`,
    },
];

/** Runs every check (read only). Returns [{name,title,urgent,rows}] for the checks that found something. */
export async function runIntegrityChecks(db, checks = INTEGRITY_CHECKS) {
    const found = [];
    for (const c of checks) {
        const { rows } = await db.query(c.sql);
        if (rows.length > 0) found.push({ name: c.name, title: c.title, urgent: c.urgent, rows });
    }
    return found;
}

export function renderIntegrityMail(found, now = new Date()) {
    const urgent = found.some((f) => f.urgent);
    const lines = [`SQB integrity check, ${now.toISOString().slice(0, 10)}`, ''];
    for (const f of found) {
        lines.push(`${f.urgent ? '[URGENT] ' : ''}${f.title}`);
        for (const r of f.rows) lines.push('  ' + Object.entries(r).map(([k, v]) => `${k}=${v}`).join('  '));
        lines.push('');
    }
    lines.push('What to do: nothing is deleted or changed by this mail. For answers that are not an option, follow repair-playbook.md');
    lines.push('(private folder _private-data/SQB/prevention-2026-11-04). Check first whether a question text was edited today (typo fix).');
    return { urgent, subject: `${urgent ? 'SQB URGENT: ' : 'SQB: '}integrity check found ${found.length} issue(s)`, text: lines.join('\n') };
}
