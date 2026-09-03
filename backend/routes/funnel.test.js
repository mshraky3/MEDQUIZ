/**
 * The funnel whitelist against the events the frontend actually emits.
 *
 * POST /api/funnel answers 204 to an unknown event name, which is right for an
 * open endpoint and wrong for us: an event added to a component and not added
 * to FUNNEL_EVENTS looks exactly like a working beacon from the browser, and
 * the only symptom is a step that never appears in the admin panel. That is how
 * `subscribe_plan_select` was lost — it shipped in a commit that never touched
 * this file.
 *
 * So the check is mechanical: scan the React source for trackFunnel('name')
 * and require every name to be one the server will store.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FUNNEL_EVENTS } from './funnel.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_SRC = path.join(__dirname, '..', '..', 'my-react-app', 'src');

/** Every literal event name passed to trackFunnel(), with the file it came from. */
function emittedEvents(dir) {
    const found = new Map(); // event -> Set(relative file)
    const walk = (current) => {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === 'node_modules') continue;
                walk(full);
            } else if (/\.(js|jsx)$/.test(entry.name)) {
                const source = fs.readFileSync(full, 'utf8');
                for (const m of source.matchAll(/trackFunnel\(\s*'([a-zA-Z0-9_]+)'/g)) {
                    const rel = path.relative(CLIENT_SRC, full).replace(/\\/g, '/');
                    if (!found.has(m[1])) found.set(m[1], new Set());
                    found.get(m[1]).add(rel);
                }
            }
        }
    };
    walk(dir);
    return found;
}

test('every event the client emits is one the server will store', (t) => {
    if (!fs.existsSync(CLIENT_SRC)) {
        // The backend is deployed on its own; a missing frontend checkout is
        // not a failure, it just means there is nothing to compare against.
        t.skip('frontend source not present');
        return;
    }

    const emitted = emittedEvents(CLIENT_SRC);
    assert.ok(emitted.size > 0, 'found no trackFunnel calls at all — has the helper been renamed?');

    const dropped = [...emitted.entries()]
        .filter(([event]) => !FUNNEL_EVENTS.has(event))
        .map(([event, files]) => `${event}  (emitted from ${[...files].join(', ')})`);

    assert.deepEqual(
        dropped, [],
        `these events are beaconed by the client and silently dropped by the server:\n  ${dropped.join('\n  ')}\n` +
        'Add each name to FUNNEL_EVENTS in backend/routes/funnel.js.'
    );
});

test('the price-test events are on the whitelist', () => {
    // Named individually rather than left to the scan above, because the price
    // report is built on exactly these three and a rename that dropped one
    // would still pass the general check (the client would be renamed too).
    for (const event of ['subscribe_prices_shown', 'subscribe_plan_select', 'subscribe_pay_click']) {
        assert.ok(FUNNEL_EVENTS.has(event), `${event} must be recordable`);
    }
});

test('the whitelist holds no unreachable names', () => {
    if (!fs.existsSync(CLIENT_SRC)) return;
    const emitted = new Set(emittedEvents(CLIENT_SRC).keys());
    // Written by the server, not the browser, so the scan above cannot see them.
    const serverSide = new Set(['paywall_hit']);
    // Retired 2026-08-08 with the engaged-time trial. Kept on the whitelist and
    // in the admin panel so an old cohort's rows still have a label; delete both
    // together or the panel goes back to rendering a bare event name.
    const retired = new Set(['trial_started']);

    const orphans = [...FUNNEL_EVENTS]
        .filter((event) => !emitted.has(event) && !serverSide.has(event) && !retired.has(event));
    assert.deepEqual(orphans, [], `nothing emits these: ${orphans.join(', ')}`);
});
