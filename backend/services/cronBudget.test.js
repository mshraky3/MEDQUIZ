/**
 * The cron time budget (utils/cronBudget.js): once it is spent, every job must
 * stop before the next recipient instead of being killed mid-send at Vercel's
 * 60 s limit. A fake db hands each job candidates; with the budget already
 * spent the only query that may run is the job's own candidate SELECT.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { cronDeadline } from '../utils/cronBudget.js';
import {
    runTrialEndedJob,
    runComebackJob,
    runRenewalSequenceJob,
    runProgressDigestJob,
    runExamReminderJob,
} from './lifecycleJobs.js';
import { runWeeklyWeakTopicsJob } from './telegramJobs.js';

const candidate = {
    id: 1, username: 'student', email: 'student@example.test', track: 'medical',
    preferred_lang: 'en', days_since: 30, days_to_expiry: 1, renewal_stage: null,
    exam_date: new Date(Date.now() + 3 * 864e5).toISOString(), chat_id: 1,
};
function fakeDb() {
    const queries = [];
    return {
        queries,
        query: async (sql) => {
            queries.push(sql);
            return { rows: [candidate, { ...candidate, id: 2 }], rowCount: 2 };
        },
    };
}
const spent = () => true;

test('cronDeadline is not spent at first and is spent after its budget', async () => {
    const outOfTime = cronDeadline(20);
    assert.equal(outOfTime(), false);
    await new Promise((r) => setTimeout(r, 30));
    assert.equal(outOfTime(), true);
});

for (const [name, job] of [
    ['trial ended', runTrialEndedJob],
    ['comeback', runComebackJob],
    ['renewal sequence', runRenewalSequenceJob],
    ['progress digest', runProgressDigestJob],
    ['exam reminder', runExamReminderJob],
]) {
    test(`${name}: a spent budget sends nothing and stamps nothing`, async () => {
        const db = fakeDb();
        const r = await job(db, { outOfTime: spent });
        assert.equal(r.sent, 0);
        assert.equal(db.queries.length, 1, 'only the candidate SELECT ran');
    });
}

test('weekly Telegram digest: a spent budget sends nothing', async () => {
    const db = fakeDb();
    const r = await runWeeklyWeakTopicsJob(db, { outOfTime: spent });
    assert.equal(r.sent, 0);
});
