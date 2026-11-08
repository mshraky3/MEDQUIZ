import test from 'node:test';
import assert from 'node:assert/strict';
import { saveAttempts } from './attemptsSync.js';

const sleep = async () => {};
const mk = (n) => Array.from({ length: n }, (_, i) => ({ user_id: 1, question_id: i + 1, selected_option: 'a', is_correct: true, time_taken: 3, quiz_session_id: 9 }));
const httpErr = (status) => Object.assign(new Error('x'), { response: { status } });

test('150 answers = exactly ONE request', async () => {
  const calls = [];
  const r = await saveAttempts(async (url, body) => { calls.push([url, body]); }, mk(150), { sessionId: 9, userId: 1, sleep });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], '/question-attempts/batch');
  assert.equal(calls[0][1].attempts.length, 150);
  assert.equal(calls[0][1].quiz_session_id, 9);
  assert.deepEqual(r, { failures: 0, usedFallback: false });
});

test('a 503 on the batch is retried (batch is idempotent) before any fallback', async () => {
  let n = 0;
  const r = await saveAttempts(async () => { n += 1; if (n < 3) throw httpErr(503); }, mk(10), { sessionId: 9, userId: 1, sleep });
  assert.equal(n, 3);
  assert.equal(r.usedFallback, false);
});

test('batch refused (404 old server) falls back to per-answer calls, never more than 5 at once', async () => {
  let live = 0; let peak = 0; let singles = 0;
  const post = async (url) => {
    if (url.endsWith('/batch')) throw httpErr(404);
    singles += 1; live += 1; peak = Math.max(peak, live);
    await new Promise((res) => setImmediate(res));
    live -= 1;
  };
  const r = await saveAttempts(post, mk(40), { sessionId: 9, userId: 1, sleep });
  assert.equal(singles, 40);
  assert.ok(peak <= 5 && peak > 1, `peak ${peak}`);
  assert.deepEqual(r, { failures: 0, usedFallback: true });
});

test('fallback retries 5xx with backoff and counts only the ones that never land; 4xx is not retried', async () => {
  const tries = {};
  const post = async (url, body) => {
    if (url.endsWith('/batch')) throw httpErr(500);
    tries[body.question_id] = (tries[body.question_id] || 0) + 1;
    if (body.question_id === 1 && tries[1] < 3) throw httpErr(500);   // recovers on 3rd
    if (body.question_id === 2) throw httpErr(500);                   // never lands
    if (body.question_id === 3) throw httpErr(400);                   // refused
  };
  const r = await saveAttempts(post, mk(4), { sessionId: 9, userId: 1, sleep });
  assert.equal(tries[1], 3);
  assert.equal(tries[2], 3);
  assert.equal(tries[3], 1);
  assert.equal(r.failures, 2);
});
