import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import router from './question-images.js';

async function withServer(fn) {
    const app = express();
    app.use('/api/question-images', router);
    const server = app.listen(0);
    try { await fn(`http://127.0.0.1:${server.address().port}`); } finally { server.close(); }
}

test('rejects names that are not a plain image file name', async () => {
    await withServer(async (base) => {
        for (const bad of ['..%2Fsecret.jpg', 'a.b.jpg', 'x.exe', 'x']) {
            const r = await fetch(`${base}/api/question-images/file/${bad}`, { redirect: 'manual' });
            assert.equal(r.status, 400, bad);
        }
    });
});

test('without R2 keys it redirects to the web-published file', async () => {
    await withServer(async (base) => {
        const r = await fetch(`${base}/api/question-images/file/ci-af-12lead.jpg`, { redirect: 'manual' });
        assert.equal(r.status, 302);
        assert.equal(r.headers.get('location'), 'https://www.smle-question-bank.com/qimg/ci-af-12lead.jpg');
    });
});
