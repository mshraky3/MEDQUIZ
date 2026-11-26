import test from 'node:test';
import assert from 'node:assert/strict';
import {
    callbackSignal, createdPaymentSignal, failureMessage, readInvalidFields,
    rememberAttempt, safeStatus, scrubGatewayText,
} from './paymentSignals.js';

test('long digit runs are masked, however they are split', () => {
    for (const raw of ['card 4111111111111111 declined', 'card 4111 1111 1111 1111 declined',
        'card 4111-1111-1111-1111 declined', 'card ٤١١١ ١١١١ ١١١١ ١١١١ declined', 'ending 1111', 'expiry 12 / 27']) {
        assert.doesNotMatch(scrubGatewayText(raw), /\p{Nd}{4}|\p{Nd}{2} \/ \p{Nd}{2}/u, raw);
    }
    assert.equal(scrubGatewayText('M074: Credit card country is not allowed'), 'M074: Credit card country is not allowed');
    assert.equal(scrubGatewayText('Payment failed. Error: HTTP 402'), 'Payment failed. Error: HTTP 402');
});

test('tokens, ids, emails and links are removed and text is capped', () => {
    const out = scrubGatewayText('token_x9Ab pk_live_abc a@b.com https://x.sa/3ds?t=1 79cced57-9deb-4c4b-8f48-59c124f79688');
    assert.equal(out, '[id] [id] [email] [url] [id]');
    assert.equal(scrubGatewayText('x '.repeat(500)).length <= 150, true);
    assert.equal(scrubGatewayText(null), null);
    assert.equal(scrubGatewayText({ number: '4111111111111111' }), null);
});

test('only status and source.message are taken from a payment object', () => {
    const signal = createdPaymentSignal({
        id: 'p1', status: 'failed', amount: 5000,
        source: { type: 'creditcard', name: 'Test Name', number: '411111XXXXXX1111', token: 'token_abc', message: 'INSUFFICIENT FUNDS' },
    });
    assert.deepEqual(signal, { status: 'failed', message: 'INSUFFICIENT FUNDS' });
    assert.deepEqual(createdPaymentSignal(undefined), { status: null, message: null });
    assert.equal(safeStatus('4111111111111111'), null);
});

test('on_failure arguments of every shape', () => {
    assert.equal(failureMessage('Network Error'), 'Network Error');
    assert.equal(failureMessage(null), null);
    assert.equal(failureMessage({ status: 401, url: 'https://x' }), 'HTTP 401');
    assert.equal(failureMessage(new Error('boom')), 'boom');
    assert.equal(failureMessage({ number: '4111' }), null);
});

test('a missing form or unmarked form reports nothing', () => {
    assert.equal(readInvalidFields(null), null);
    assert.equal(readInvalidFields({ querySelectorAll: () => [] }), null);
});

test('the callback signal carries the remembered plan and never throws', () => {
    // No window at all (storage blocked): still returns status and message.
    delete globalThis.window;
    assert.doesNotThrow(() => rememberAttempt({ plan: 'annual', amountHalalas: 29900 }));
    assert.deepEqual(callbackSignal('?id=abc&status=failed&message=Declined'), { status: 'failed', message: 'Declined' });

    const store = new Map();
    globalThis.window = { sessionStorage: { setItem: (k, v) => store.set(k, v), getItem: (k) => store.get(k) ?? null } };
    rememberAttempt({ plan: 'annual', amountHalalas: 29900 });
    assert.deepEqual(callbackSignal('?status=failed'), {
        status: 'failed', message: null, plan: 'annual', amountHalalas: 29900,
    });
    delete globalThis.window;
});
