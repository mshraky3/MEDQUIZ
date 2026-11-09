/**
 * Daily integrity check: do answers still belong to their questions, and do totals still add up?
 * Read-only SQL (the same checks as _private-data/SQB/prevention-2026-11-04/audit-queries.sql, limited to the last 2 days).
 * Since 2026-11-09 the result goes into the daily digest; only an URGENT finding gets its own mail at once.
 * Mail text carries counts and account/session numbers only: no names, phones, answers or tokens.
 */

import { renderOwnerMail, ADMIN_LINKS } from './ownerMail.js';

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

// ── known and closed cases ──────────────────────────────────────────────────
/**
 * Cases the owner already knows about and has closed. They are shown in the mail as "Known and closed" and are
 * NEVER a reason to turn the headline amber or to send a mail on their own.
 *
 * Why this exists: the check looks at the last 2 days, so a closed case keeps being reported every day until it
 * leaves the window (the 8 and 9 Nov mails were exactly this).
 *
 * To add one: append { check, sessionId, note } where `check` is the check name (only 'session_totals_differ' is
 * matched by session today) and `note` is one plain sentence the owner will read. Only add a case after it has
 * been looked at and is truly closed; never add one to silence a new problem.
 */
export const ACKNOWLEDGED_CASES = [
    {
        check: 'session_totals_differ',
        sessionId: 1554,
        note: 'session 1554: 25 answers lost on 7 Nov when the database ran out of connections, student compensated',
    },
    {
        check: 'session_totals_differ',
        sessionId: 1551,
        note: 'session 1551: 1 of 2 answers not saved, one lost request, cause unknown, closed',
    },
];

/** Plain-words name and meaning of each check, in the order they run. */
export const CHECK_INFO = {
    attempt_not_an_option: {
        name: 'Saved answers match their question',
        meaning: 'Every saved answer must be one of that question\'s options. A miss means answers were saved against the wrong questions (the 3-4 Nov problem).',
    },
    final_answer_not_an_option: {
        name: 'Final-exam answers match their question',
        meaning: 'The same test for final exams.',
    },
    session_totals_differ: {
        name: 'Quiz totals add up',
        meaning: 'The number of questions a finished quiz says it had must equal the answers saved for it. A gap means some answers never reached the database.',
    },
    question_key_not_an_option: {
        name: 'Every question has a valid correct answer',
        meaning: 'The correct answer must be one of the question\'s four options. A miss means a question was edited or imported wrongly.',
    },
    attempt_without_session: {
        name: 'No answers without a quiz',
        meaning: 'Every saved answer must belong to a quiz. A miss means answers were saved but the quiz row is gone.',
    },
};

const findAck = (checkName, row, list) =>
    list.find((a) => a.check === checkName && String(a.sessionId) === String(row.session_id));

const rowText = (r) => Object.entries(r).map(([k, v]) => `${k}=${v}`).join(' ');

/**
 * Turns the raw findings into one verdict plus one line per check (all five, always).
 * @returns {{status:'ok'|'attention'|'urgent', openCount:number, knownCount:number, urgentCount:number, checks:Array}}
 */
export function evaluateIntegrity(found, acknowledged = ACKNOWLEDGED_CASES, checks = INTEGRITY_CHECKS) {
    const byName = new Map(found.map((f) => [f.name, f]));
    let openCount = 0;
    let knownCount = 0;
    let urgentCount = 0;
    const out = checks.map((c) => {
        const info = CHECK_INFO[c.name] || { name: c.title, meaning: '' };
        const rows = byName.get(c.name)?.rows || [];
        const known = rows.filter((r) => findAck(c.name, r, acknowledged));
        const open = rows.filter((r) => !findAck(c.name, r, acknowledged));
        openCount += open.length;
        knownCount += known.length;
        if (c.urgent) urgentCount += open.length;
        let state = 'ok';
        let result = 'OK';
        if (open.length) { state = c.urgent ? 'urgent' : 'attention'; result = `${open.length} found`; }
        else if (known.length) { state = 'known'; result = 'OK (known cases only)'; }
        const details = [
            ...open.map((r) => rowText(r)),
            ...known.map((r) => `Known and closed: ${findAck(c.name, r, acknowledged).note}`),
        ];
        return { name: info.name, meaning: info.meaning, state, result, detail: details.join('\n'), checkName: c.name, urgent: c.urgent };
    });
    return { status: urgentCount ? 'urgent' : openCount ? 'attention' : 'ok', openCount, knownCount, urgentCount, checks: out };
}

export const REPAIR_PLAYBOOK = '_private-data/SQB/prevention-2026-11-04/repair-playbook.md';

/** The "what to do" text for a verdict; null means "Nothing to do". */
export function integrityTodo(ev) {
    if (ev.status === 'ok') return null;
    const lines = [];
    if (ev.urgentCount) {
        lines.push('Answers may be attached to the wrong question. First check whether a question text was edited today (a typo fix explains it).');
        lines.push(`If not, follow the repair playbook: ${REPAIR_PLAYBOOK}`);
    }
    if (ev.openCount > ev.urgentCount) {
        lines.push('A quiz total differs from its saved answers: look at the student in Admin > Users, check whether answers were really lost, and compensate if so. Nothing is changed automatically.');
    }
    return lines.join('\n');
}

export const INTEGRITY_EXPLAINER = 'Every night the server asks the database five yes/no questions to make sure students\' answers were saved correctly. It only reads; it never changes anything.';

export function integrityHeadline(ev) {
    if (ev.status === 'ok') return ev.knownCount ? 'All good: only already-closed cases show up.' : 'All good: answers are saved correctly, all 5 checks passed.';
    if (ev.status === 'urgent') return 'Needs a look today: saved answers may not match their questions.';
    return `Needs a look: ${ev.openCount} new quiz total${ev.openCount === 1 ? '' : 's'} differ${ev.openCount === 1 ? 's' : ''} from the saved answers.`;
}

/** The immediate mail for an URGENT finding: the only integrity mail that is sent on its own. */
export function renderIntegrityMail(found, now = new Date(), acknowledged = ACKNOWLEDGED_CASES) {
    const ev = evaluateIntegrity(found, acknowledged);
    const date = now.toISOString().slice(0, 10);
    const mail = renderOwnerMail({
        status: ev.status,
        title: 'Integrity check',
        headline: integrityHeadline(ev),
        intro: INTEGRITY_EXPLAINER,
        sections: [{ title: 'The 5 questions this check asks (last 2 days)', checks: ev.checks }],
        todo: integrityTodo(ev),
        action: { label: 'Open the admin panel', url: ADMIN_LINKS.overview },
    });
    return {
        urgent: ev.status === 'urgent',
        status: ev.status,
        subject: ev.status === 'urgent' ? `SQB URGENT: saved answers need a look (${date})` : `SQB: integrity check needs a look (${date})`,
        text: mail.text,
        html: mail.html,
    };
}
