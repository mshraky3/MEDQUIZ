// alertOn5xx: a handler may mark a 5xx as expected so it does not page the owner.
import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { alertOn5xx } from './observability.js';

function run(status, { expected = false } = {}) {
    const calls = [];
    const notify = async (...args) => { calls.push(args); };
    const res = new EventEmitter();
    res.statusCode = status;
    res.locals = {};
    res.json = (b) => res;
    res.send = (b) => res;
    const req = { method: 'POST', originalUrl: '/api/test' };
    alertOn5xx(notify)(req, res, () => {});
    if (expected) res.locals.__expected5xx = true;
    res.json({ ok: false });
    res.emit('finish');
    return calls;
}

test('a 503 marked __expected5xx does not notify', () => {
    assert.equal(run(503, { expected: true }).length, 0);
});

test('a plain 503 still notifies exactly once', () => {
    assert.equal(run(503).length, 1);
});

test('a 500 still notifies exactly once', () => {
    assert.equal(run(500).length, 1);
});
