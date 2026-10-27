import test from 'node:test';
import assert from 'node:assert/strict';
import { createSeenQueue, SEEN_MAX_IDS } from './seenQueue.js';

const fakeTimers = () => {
  let fn = null;
  return { setTimer: (f) => { fn = f; return 1; }, clearTimer: () => { fn = null; }, fire: () => fn && fn(), armed: () => !!fn };
};

test('flushes queued ids after the delay, once each', () => {
  const t = fakeTimers(); const calls = [];
  const q = createSeenQueue({ send: (ids) => calls.push(ids), ...t });
  q.add(1); q.add(2); q.add(1);
  assert.equal(calls.length, 0);
  t.fire();
  assert.deepEqual(calls, [[1, 2]]);
  q.add(2); t.fire();
  assert.equal(calls.length, 1); // 2 already sent
});

test('flush() on hide sends at once and disarms the timer', () => {
  const t = fakeTimers(); const calls = [];
  const q = createSeenQueue({ send: (ids) => calls.push(ids), ...t });
  q.add(7); q.flush();
  assert.deepEqual(calls, [[7]]);
  assert.equal(t.armed(), false);
});

test('never sends more than the server limit per call', () => {
  const t = fakeTimers(); const calls = [];
  const q = createSeenQueue({ send: (ids) => calls.push(ids), ...t });
  for (let i = 1; i <= SEEN_MAX_IDS + 5; i++) q.add(i);
  q.flush();
  assert.deepEqual(calls.map((c) => c.length), [SEEN_MAX_IDS, 5]);
});

test('ignores bad ids and survives a failing or rejecting send', async () => {
  const t = fakeTimers();
  const q = createSeenQueue({ send: () => { throw new Error('boom'); }, ...t });
  q.add('x'); q.add(-1); q.add(null); q.add(3);
  assert.doesNotThrow(() => q.flush());
  const q2 = createSeenQueue({ send: () => Promise.reject(new Error('net')), ...t });
  q2.add(4);
  assert.doesNotThrow(() => q2.flush());
  await new Promise((r) => setTimeout(r, 5));
});
