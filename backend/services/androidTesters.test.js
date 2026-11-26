/**
 * Android tester offer: cap of 15, one spot per account and per address, the race,
 * redeem on an Android sign-in, the owner-first export, and the HTTP routes.
 *
 * The SQL runs against PGlite (no local Postgres): it is not a repo dependency,
 * install it outside the repo and set PGLITE_PATH to node_modules/@electric-sql/pglite
 * (those tests are skipped otherwise). The real migrations/002_android_testers.sql
 * creates the table under test. PGlite has ONE connection, so concurrent clients are
 * serialised by a JS mutex held from BEGIN to COMMIT/ROLLBACK (see poolOver): the race
 * test proves the cap logic and the SQL under that serialisation, and a separate test
 * proves the advisory lock is taken before the count. Real parallel sessions still
 * deserve one check on a throwaway Postgres (test plan in the pull request).
 */
process.env.PAYMENT_ENFORCEMENT_ENABLED = 'true';

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { pathToFileURL, fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const svc = await import('./androidTesters.js');
const {
    ANDROID_TESTERS_CAP, ANDROID_TESTER_MONTHS, ANDROID_TESTER_EVENT,
    isAndroidTestersOfferEnabled, cleanPlayEmail, emailKey, ownerTesterEmails,
    evaluateTesterOffer, joinAndroidTesters, redeemTesterOffer, getOfferStatus,
    buildTesterExport, exportToCsv,
} = svc;
const { default: testersRouter, androidTestersAdminRouter, androidTestersPublicRouter } = await import('../routes/androidTesters.js');
const { default: appRouter } = await import('../routes/appFreeMonth.js');

let PGlite;
try {
    const mod = process.env.PGLITE_PATH
        ? await import(pathToFileURL(path.join(process.env.PGLITE_PATH, 'dist', 'index.js')).href)
        : await import('@electric-sql/pglite');
    PGlite = mod.PGlite;
} catch { /* skipped below */ }
const skip = PGlite ? false : 'PGlite not available (set PGLITE_PATH)';

/** pg-Pool-shaped adapter over one PGlite; transactions are serialised (see header). */
function poolOver(pg) {
    let tail = Promise.resolve();
    return {
        query: (sql, params) => pg.query(sql, params),
        connect: async () => {
            let release = null;
            const done = () => { if (release) { release(); release = null; } };
            return {
                query: async (sql, params) => {
                    if (sql === 'BEGIN') {
                        const prev = tail;
                        let open;
                        tail = new Promise((r) => { open = r; });
                        await prev;
                        release = open;
                    }
                    try {
                        return await pg.query(sql, params);
                    } finally {
                        if (sql === 'COMMIT' || sql === 'ROLLBACK') done();
                    }
                },
                release: done,
            };
        },
    };
}

async function setup() {
    const pg = new PGlite();
    await pg.exec(`
        CREATE TABLE accounts (id INT PRIMARY KEY, email_verified BOOLEAN DEFAULT TRUE,
            subscription_status TEXT, subscription_expiry_date TIMESTAMPTZ,
            is_admin_created BOOLEAN NOT NULL DEFAULT FALSE, grandfathered_at TIMESTAMPTZ,
            renewal_reminder_stage TEXT);
        CREATE TABLE payment_events (id BIGSERIAL PRIMARY KEY, account_id INT, event_type TEXT NOT NULL,
            gateway TEXT, gateway_ref TEXT, amount_halalas INT, currency TEXT, status TEXT, raw_payload JSONB,
            received_at TIMESTAMPTZ DEFAULT NOW());
    `);
    await pg.exec(fs.readFileSync(path.join(here, '..', 'migrations', '002_android_testers.sql'), 'utf8'));
    for (let i = 1; i <= 40; i += 1) await pg.query('INSERT INTO accounts (id) VALUES ($1)', [i]);
    return { pg, db: poolOver(pg) };
}

test('the offer is off unless ANDROID_TESTERS_OFFER_ENABLED is exactly "true"', () => {
    delete process.env.ANDROID_TESTERS_OFFER_ENABLED;
    assert.equal(isAndroidTestersOfferEnabled(), false);
    process.env.ANDROID_TESTERS_OFFER_ENABLED = '1';
    assert.equal(isAndroidTestersOfferEnabled(), false);
    process.env.ANDROID_TESTERS_OFFER_ENABLED = 'true';
    assert.equal(isAndroidTestersOfferEnabled(), true);
    delete process.env.ANDROID_TESTERS_OFFER_ENABLED;
    assert.equal(ANDROID_TESTERS_CAP, 15);
    assert.equal(ANDROID_TESTER_MONTHS, 1);
});

test('e-mail check and the canonical key', () => {
    assert.equal(cleanPlayEmail('  Student@Gmail.COM '), 'student@gmail.com');
    assert.equal(cleanPlayEmail('a.b@school.edu.sa'), 'a.b@school.edu.sa');
    assert.equal(cleanPlayEmail('ab@x.co'), 'ab@x.co');
    for (const bad of ['', 'abc', 'a@b', 'a b@c.com', '@x.com', 'x@.com', '=cmd@x.com', 'x@x..com', 'x'.repeat(250) + '@x.com', null, undefined, 42,
        'a..b@gmail.com', 'ab.@gmail.com', 'ab@x.c', 'ab@x.c1', 'ab@x.123', { toString: () => 'ok@gmail.com' }, ['ok@gmail.com'], true]) {
        assert.equal(cleanPlayEmail(bad), null, JSON.stringify(bad));
    }
    assert.equal(emailKey('a.b.c+tag@gmail.com'), 'abc@gmail.com');
    assert.equal(emailKey('abc@googlemail.com'), 'abc@gmail.com');
    assert.equal(emailKey('a.b@school.edu.sa'), 'a.b@school.edu.sa');
});

test('rules: who may take a spot or the months', () => {
    const base = { id: 1, email_verified: true, subscription_status: null, subscription_expiry_date: null, is_admin_created: false, grandfathered_at: null };
    const future = new Date(Date.now() + 86400000);
    assert.equal(evaluateTesterOffer(base, []).eligible, true);
    assert.equal(evaluateTesterOffer(null).reason, 'account_not_found');
    assert.equal(evaluateTesterOffer({ ...base, email_verified: false }).reason, 'email_not_verified');
    assert.equal(evaluateTesterOffer(base, [{ event_type: ANDROID_TESTER_EVENT, status: 'granted' }]).reason, 'already_redeemed');
    assert.equal(evaluateTesterOffer(base, [{ event_type: 'payment_paid', status: 'paid' }]).reason, 'has_paid');
    assert.equal(evaluateTesterOffer({ ...base, grandfathered_at: new Date() }).reason, 'grandfathered');
    assert.equal(evaluateTesterOffer({ ...base, is_admin_created: true }).reason, 'already_granted');
    assert.equal(evaluateTesterOffer({ ...base, subscription_status: 'active', subscription_expiry_date: future }).reason, 'active_subscription');
});

test('join: the advisory lock is taken before the count, and an invalid address never opens a transaction', async () => {
    const log = [];
    const client = {
        query: async (sql) => {
            const q = sql.replace(/\s+/g, ' ').trim();
            log.push(q);
            if (q.startsWith('SELECT id, email_verified')) return { rows: [{ id: 1, email_verified: true }] };
            if (q.startsWith('SELECT COUNT')) return { rows: [{ taken: 3 }] };
            return { rows: [] };
        },
        release: () => log.push('RELEASE'),
    };
    const out = await joinAndroidTesters({ connect: async () => client }, 1, 'ok.person@gmail.com');
    assert.equal(out.joined, true);
    assert.equal(out.left, 11);
    assert.equal(log[0], 'BEGIN');
    assert.match(log[1], /pg_advisory_xact_lock/);
    assert.ok(log.findIndex((l) => l.startsWith('SELECT COUNT')) > 1);
    assert.ok(log.includes('COMMIT'));

    let touched = false;
    const spy = { connect: async () => { touched = true; throw new Error('must not connect'); } };
    assert.deepEqual(await joinAndroidTesters(spy, 1, 'not-an-email'), { joined: false, reason: 'invalid_email' });
    assert.equal(touched, false);
});

test('cap: the 15th joins, the 16th is refused; status counts down', { skip }, async () => {
    const { db } = await setup();
    for (let i = 1; i <= 14; i += 1) assert.equal((await joinAndroidTesters(db, i, `s${i}@school.edu.sa`)).joined, true, `spot ${i}`);
    assert.equal((await getOfferStatus(db, 30)).left, 1);
    const fifteenth = await joinAndroidTesters(db, 15, 's15@school.edu.sa');
    assert.equal(fifteenth.joined, true);
    assert.equal(fifteenth.left, 0);
    const sixteenth = await joinAndroidTesters(db, 16, 's16@school.edu.sa');
    assert.deepEqual(sixteenth, { joined: false, reason: 'full' });
    const status = await getOfferStatus(db, 16);
    assert.equal(status.taken, 15);
    assert.equal(status.left, 0);
    assert.equal(status.canJoin, false);
    assert.equal(status.reason, 'full');
    const mine = await getOfferStatus(db, 3);
    assert.equal(mine.joined, true);
    assert.equal(mine.playEmail, 's3@school.edu.sa');
});

test('one spot per account and per address (gmail dots and +tags count as the same address)', { skip }, async () => {
    const { db, pg } = await setup();
    assert.equal((await joinAndroidTesters(db, 1, 'first.person@gmail.com')).joined, true);
    const again = await joinAndroidTesters(db, 1, 'other@gmail.com');
    assert.equal(again.reason, 'already_joined');
    assert.equal(again.playEmail, 'first.person@gmail.com');
    assert.equal((await joinAndroidTesters(db, 2, 'First.Person@gmail.com')).reason, 'email_taken');
    assert.equal((await joinAndroidTesters(db, 2, 'firstperson+sqb@gmail.com')).reason, 'email_taken');
    assert.equal((await joinAndroidTesters(db, 2, 'firstperson@googlemail.com')).reason, 'email_taken');
    assert.equal((await joinAndroidTesters(db, 2, 'broken')).reason, 'invalid_email');
    const { rows } = await pg.query('SELECT COUNT(*)::int AS n FROM android_testers');
    assert.equal(rows[0].n, 1);
});

test('accounts that could never get the months do not take a spot', { skip }, async () => {
    const { db, pg } = await setup();
    await pg.query('UPDATE accounts SET email_verified = FALSE WHERE id = 1');
    await pg.query(`INSERT INTO payment_events (account_id, event_type, status) VALUES (2, 'payment_paid', 'paid')`);
    await pg.query(`UPDATE accounts SET subscription_status = 'active', subscription_expiry_date = NOW() + INTERVAL '10 days' WHERE id = 3`);
    assert.equal((await joinAndroidTesters(db, 1, 'a1@x.com')).reason, 'email_not_verified');
    assert.equal((await joinAndroidTesters(db, 2, 'a2@x.com')).reason, 'has_paid');
    assert.equal((await joinAndroidTesters(db, 3, 'a3@x.com')).reason, 'active_subscription');
    assert.equal((await joinAndroidTesters(db, 999, 'a9@x.com')).reason, 'account_not_found');
    assert.equal((await getOfferStatus(db, 4)).left, 15);
});

test('race: 25 simultaneous joins give exactly 15 spots', { skip }, async () => {
    const { db, pg } = await setup();
    const results = await Promise.all(
        Array.from({ length: 25 }, (_, i) => joinAndroidTesters(db, i + 1, `racer${i + 1}@school.edu.sa`))
    );
    assert.equal(results.filter((r) => r.joined).length, 15);
    assert.equal(results.filter((r) => r.reason === 'full').length, 10);
    const { rows } = await pg.query('SELECT COUNT(*)::int AS n FROM android_testers');
    assert.equal(rows[0].n, 15);
});

test('race: the same address from two accounts at once gives one spot', { skip }, async () => {
    const { db, pg } = await setup();
    const same = await Promise.all([joinAndroidTesters(db, 30, 'twin@school.edu.sa'), joinAndroidTesters(db, 31, 'Twin@school.edu.sa')]);
    assert.deepEqual(same.map((r) => r.reason).sort(), ['email_taken', 'joined']);
    assert.equal((await pg.query('SELECT COUNT(*)::int AS n FROM android_testers')).rows[0].n, 1);
});

test('redeem: only a tester, only from the Android app, 1 month, once', { skip }, async () => {
    const { db, pg } = await setup();
    await joinAndroidTesters(db, 1, 'tester1@school.edu.sa');
    assert.deepEqual(await redeemTesterOffer(db, 2, { platform: 'android-app' }), { granted: false, reason: 'not_a_tester' });
    assert.deepEqual(await redeemTesterOffer(db, 1, { platform: 'web' }), { granted: false, reason: 'not_from_app' });
    assert.deepEqual(await redeemTesterOffer(db, 1, {}), { granted: false, reason: 'not_from_app' });

    const before = Date.now();
    const out = await redeemTesterOffer(db, 1, { platform: 'android-app' });
    assert.equal(out.granted, true);
    assert.equal(out.months, 1);
    const days = (new Date(out.expiresAt).getTime() - before) / 86400000;
    assert.ok(days > 28 && days < 32, `about one month, got ${days} days`);

    const acc = (await pg.query('SELECT subscription_status, is_admin_created, subscription_expiry_date FROM accounts WHERE id = 1')).rows[0];
    assert.equal(acc.subscription_status, 'active');
    assert.equal(acc.is_admin_created, true);
    const ev = (await pg.query('SELECT * FROM payment_events WHERE account_id = 1')).rows;
    assert.equal(ev.length, 1);
    assert.equal(ev[0].event_type, 'android_tester_offer');
    assert.equal(ev[0].status, 'granted');
    assert.equal(ev[0].amount_halalas, 0);
    assert.equal(ev[0].gateway_ref, 'android_tester_offer_1');
    assert.ok((await getOfferStatus(db, 1)).redeemed);

    assert.deepEqual(await redeemTesterOffer(db, 1, { platform: 'android-app' }), { granted: false, reason: 'already_redeemed' });
    assert.equal((await pg.query('SELECT COUNT(*)::int AS n FROM payment_events WHERE account_id = 1')).rows[0].n, 1);
});

test('redeem: a tester who paid in the meantime gets nothing and keeps the spot', { skip }, async () => {
    const { db, pg } = await setup();
    await joinAndroidTesters(db, 1, 'tester1@school.edu.sa');
    await pg.query(`INSERT INTO payment_events (account_id, event_type, status) VALUES (1, 'payment_paid', 'paid')`);
    assert.deepEqual(await redeemTesterOffer(db, 1, { platform: 'android-app' }), { granted: false, reason: 'has_paid' });
    assert.equal((await pg.query('SELECT subscription_status FROM accounts WHERE id = 1')).rows[0].subscription_status, null);
});

test('owner addresses: read from env, listed first, outside the cap, never stored', { skip }, async () => {
    const env = { OWNER_TESTER_EMAILS: ' Owner.One@gmail.com, owner2@example.com ;bad, owner.one@gmail.com' };
    assert.deepEqual(ownerTesterEmails(env), ['owner.one@gmail.com', 'owner2@example.com']);
    assert.deepEqual(ownerTesterEmails({}), []);

    const { db, pg } = await setup();
    for (let i = 1; i <= 16; i += 1) await joinAndroidTesters(db, i, `s${i}@school.edu.sa`);
    // a student who typed an owner address (before it was configured) is listed once, as owner
    await pg.query(`INSERT INTO android_testers (account_id, play_email, email_key) VALUES (20, 'owner2@example.com', 'owner2@example.com')`);
    const list = await buildTesterExport(db, env);
    assert.equal(list[0].email, 'owner.one@gmail.com');
    assert.equal(list[0].source, 'owner');
    assert.equal(list[1].email, 'owner2@example.com');
    assert.equal(list[1].source, 'owner');
    assert.equal(list.filter((r) => r.source === 'student').length, 15, 'students keep their 15, owners are extra');
    assert.equal(list.filter((r) => r.email === 'owner2@example.com').length, 1);
    assert.equal((await pg.query('SELECT COUNT(*)::int AS n FROM android_testers WHERE play_email LIKE $1', ['owner.one%'])).rows[0].n, 0);

    const csv = exportToCsv(list);
    assert.ok(csv.startsWith('email,source,joined_at,redeemed\nowner.one@gmail.com,owner,,no\nowner2@example.com,owner,,no\n'));
    assert.deepEqual(await buildTesterExport(db, {}).then((l) => l[0].source), 'student');
});

/** Start a throwaway express app with the real routers and a fake session. */
async function serve(db, accountId) {
    const app = express();
    app.use(express.json());
    const withDb = (req, _res, next) => { req.db = db; req.accountId = accountId; next(); };
    app.use('/api/public/android-testers', withDb, androidTestersPublicRouter);
    app.use('/api/android-testers', withDb, testersRouter);
    app.use('/api/admin/android-testers', withDb, androidTestersAdminRouter);
    app.use('/api/app', withDb, appRouter);
    const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    const base = `http://127.0.0.1:${server.address().port}`;
    const call = async (method, url, body) => {
        const r = await fetch(base + url, { method, headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
        const text = await r.text();
        let json = null;
        try { json = JSON.parse(text); } catch { /* not json */ }
        return { status: r.status, json, text, type: r.headers.get('content-type') };
    };
    return { call, close: () => new Promise((r) => server.close(r)) };
}

test('routes: every endpoint answers 404 while the flag is off', { skip }, async () => {
    delete process.env.ANDROID_TESTERS_OFFER_ENABLED;
    delete process.env.APP_FREE_MONTH_ENABLED;
    const { db } = await setup();
    const s = await serve(db, 1);
    try {
        assert.equal((await s.call('GET', '/api/android-testers/status')).status, 404);
        assert.equal((await s.call('POST', '/api/android-testers/join', { email: 'a@b.com' })).status, 404);
        assert.equal((await s.call('GET', '/api/admin/android-testers/export')).status, 404);
        assert.equal((await s.call('POST', '/api/app/free-month', { platform: 'android-app' })).status, 404);
    } finally { await s.close(); }
});

test('routes: join, refuse, export, and the Android sign-in call grants the 1 month', { skip }, async () => {
    process.env.ANDROID_TESTERS_OFFER_ENABLED = 'true';
    delete process.env.APP_FREE_MONTH_ENABLED;
    process.env.OWNER_TESTER_EMAILS = 'owner@example.com';
    const { db, pg } = await setup();
    const s = await serve(db, 1);
    try {
        const st = await s.call('GET', '/api/android-testers/status');
        assert.equal(st.status, 200);
        assert.equal(st.json.left, 15);
        assert.equal(st.json.joined, false);
        assert.equal(st.json.canJoin, true);

        assert.equal((await s.call('POST', '/api/android-testers/join', { email: 'nope' })).status, 400);
        assert.equal((await s.call('POST', '/api/android-testers/join', {})).status, 400);
        const joined = await s.call('POST', '/api/android-testers/join', { email: 'Me@Gmail.com' });
        assert.equal(joined.status, 200);
        assert.equal(joined.json.joined, true);
        assert.equal(joined.json.left, 14);
        const twice = await s.call('POST', '/api/android-testers/join', { email: 'me@gmail.com' });
        assert.equal(twice.status, 409);
        assert.equal(twice.json.reason, 'already_joined');

        // the status response never lists other people
        assert.ok(!JSON.stringify((await s.call('GET', '/api/android-testers/status')).json).includes('owner@example.com'));

        const csv = await s.call('GET', '/api/admin/android-testers/export');
        assert.match(csv.type, /text\/csv/);
        assert.ok(csv.text.startsWith('email,source,joined_at,redeemed\nowner@example.com,owner,,no\nme@gmail.com,student,'));
        assert.equal((await s.call('GET', '/api/admin/android-testers/export?format=emails')).text, 'owner@example.com\nme@gmail.com\n');
        assert.equal((await s.call('GET', '/api/admin/android-testers/export?format=json')).json.count, 2);

        // the installed app's existing sign-in call
        const web = await s.call('POST', '/api/app/free-month', { platform: 'web' });
        assert.equal(web.status, 200);
        assert.equal(web.json.granted, false);
        const app = await s.call('POST', '/api/app/free-month', { platform: 'android-app' });
        assert.equal(app.status, 200);
        assert.equal(app.json.granted, true);
        assert.equal(app.json.months, 1);
        assert.equal((await s.call('POST', '/api/app/free-month', { platform: 'android-app' })).json.granted, false);
        assert.equal((await pg.query(`SELECT COUNT(*)::int AS n FROM payment_events WHERE event_type = 'android_tester_offer'`)).rows[0].n, 1);
    } finally {
        await s.close();
        delete process.env.ANDROID_TESTERS_OFFER_ENABLED;
        delete process.env.OWNER_TESTER_EMAILS;
    }
});

test('routes: a non-string e-mail is a clean 400, not a 500', { skip }, async () => {
    process.env.ANDROID_TESTERS_OFFER_ENABLED = 'true';
    const { db } = await setup();
    const s = await serve(db, 1);
    try {
        for (const email of [{ toString: 'x' }, ['a@gmail.com'], 42, true, null]) {
            const r = await s.call('POST', '/api/android-testers/join', { email });
            assert.equal(r.status, 400, JSON.stringify(email));
            assert.equal(r.json.reason, 'invalid_email');
        }
        assert.equal((await s.call('POST', '/api/android-testers/join', { email: 'a..b@gmail.com' })).status, 400);
        assert.equal((await getOfferStatus(db, 1)).taken, 0);
    } finally {
        await s.close();
        delete process.env.ANDROID_TESTERS_OFFER_ENABLED;
    }
});

test('routes: tester flag on, table missing, plain free month off: the sign-in call is not a 5xx', { skip }, async () => {
    process.env.ANDROID_TESTERS_OFFER_ENABLED = 'true';
    delete process.env.APP_FREE_MONTH_ENABLED;
    const pg = new PGlite();
    await pg.exec(`CREATE TABLE accounts (id INT PRIMARY KEY, email_verified BOOLEAN DEFAULT TRUE, subscription_status TEXT,
        subscription_expiry_date TIMESTAMPTZ, is_admin_created BOOLEAN NOT NULL DEFAULT FALSE, grandfathered_at TIMESTAMPTZ, renewal_reminder_stage TEXT);
        CREATE TABLE payment_events (id BIGSERIAL PRIMARY KEY, account_id INT, event_type TEXT NOT NULL, gateway TEXT, gateway_ref TEXT,
        amount_halalas INT, currency TEXT, status TEXT, raw_payload JSONB, received_at TIMESTAMPTZ DEFAULT NOW());
        INSERT INTO accounts (id) VALUES (1);`);
    const s = await serve(poolOver(pg), 1);
    try {
        const out = await s.call('POST', '/api/app/free-month', { platform: 'android-app' });
        assert.equal(out.status, 404, 'same answer as before the offer existed');
        assert.equal((await pg.query('SELECT COUNT(*)::int AS n FROM payment_events')).rows[0].n, 0);
    } finally {
        await s.close();
        delete process.env.ANDROID_TESTERS_OFFER_ENABLED;
    }
});

test('routes: with the table missing (migration not run) the answer is 503 and the plain free month still works', { skip }, async () => {
    process.env.ANDROID_TESTERS_OFFER_ENABLED = 'true';
    process.env.APP_FREE_MONTH_ENABLED = 'true';
    const pg = new PGlite();
    await pg.exec(`CREATE TABLE accounts (id INT PRIMARY KEY, email_verified BOOLEAN DEFAULT TRUE, subscription_status TEXT,
        subscription_expiry_date TIMESTAMPTZ, is_admin_created BOOLEAN NOT NULL DEFAULT FALSE, grandfathered_at TIMESTAMPTZ, renewal_reminder_stage TEXT);
        CREATE TABLE payment_events (id BIGSERIAL PRIMARY KEY, account_id INT, event_type TEXT NOT NULL, gateway TEXT, gateway_ref TEXT,
        amount_halalas INT, currency TEXT, status TEXT, raw_payload JSONB, received_at TIMESTAMPTZ DEFAULT NOW());
        INSERT INTO accounts (id) VALUES (1);`);
    const s = await serve(poolOver(pg), 1);
    try {
        assert.equal((await s.call('GET', '/api/android-testers/status')).status, 503);
        assert.equal((await s.call('POST', '/api/android-testers/join', { email: 'a@b.com' })).status, 503);
        const out = await s.call('POST', '/api/app/free-month', { platform: 'android-app' });
        assert.equal(out.status, 200);
        assert.equal(out.json.granted, true);
        assert.equal(out.json.months, 1, 'the old one-month offer is unchanged');
    } finally {
        await s.close();
        delete process.env.ANDROID_TESTERS_OFFER_ENABLED;
        delete process.env.APP_FREE_MONTH_ENABLED;
    }
});

test('public switch: 404 while off, then open or full, never a count or an address', { skip }, async () => {
    delete process.env.ANDROID_TESTERS_OFFER_ENABLED;
    const { db } = await setup();
    const s = await serve(db, 1);
    try {
        assert.equal((await s.call('GET', '/api/public/android-testers')).status, 404);
        process.env.ANDROID_TESTERS_OFFER_ENABLED = 'true';
        assert.deepEqual((await s.call('GET', '/api/public/android-testers')).json, { success: true, open: true });
        for (let i = 1; i <= ANDROID_TESTERS_CAP; i += 1) {
            assert.equal((await joinAndroidTesters(db, i, 'pub' + i + '@school.edu.sa')).joined, true);
        }
        assert.deepEqual((await s.call('GET', '/api/public/android-testers')).json, { success: true, open: false });
    } finally {
        await s.close();
        delete process.env.ANDROID_TESTERS_OFFER_ENABLED;
    }
});

test('app.js mounts the admin export behind adminAuth and the session routes behind requireSession', () => {
    const src = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8');
    assert.match(src, /app\.use\('\/api\/admin\/android-testers', adminAuth,/);
    assert.match(src, /app\.use\('\/api\/android-testers', requireSession,/);
});
