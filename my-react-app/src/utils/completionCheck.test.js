/**
 * C1 client guard: the launcher must not call /api/check-completion for the dead
 * whole-bank sentinel, and must keep calling it for real collections.
 * No DOM environment exists in this repo, so the component is checked at source level
 * (same approach as components/Quiz/quiz-swap-guard.test.js).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WHOLE_BANK_SOURCE, shouldCheckCompletion } from './completionCheck.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const launcher = fs.readFileSync(path.join(here, '..', 'components', 'quizs', 'QuizLauncher.jsx'), 'utf8').replace(/\r\n/g, '\n');

test('the sentinel is skipped, real collections are still checked', () => {
    assert.equal(WHOLE_BANK_SOURCE, 'MidgardGameBoy');
    assert.equal(shouldCheckCompletion('MidgardGameBoy'), false);
    for (const s of ['MedicalOctoberRecall', 'MedicalGameBoy', 'MedicalConfirmed', 'MedicalMidgard', 'NursingConfirmed',
        'DentalExplained', 'midgardgameboy', '', undefined, null]) {
        assert.equal(shouldCheckCompletion(s), true, String(s));
    }
});

test('QuizLauncher uses the guard before looping over specialties, and WHOLE_BANK is the same sentinel', () => {
    assert.match(launcher, /const WHOLE_BANK = WHOLE_BANK_SOURCE;/);
    const i = launcher.indexOf('const checkCompletionForSource = async (source) => {');
    assert.ok(i > 0, 'checkCompletionForSource not found');
    const body = launcher.slice(i, launcher.indexOf('};', i));
    const guard = body.indexOf('if (!shouldCheckCompletion(source)) return;');
    const loop = body.indexOf('for (const type of availableTypes)');
    assert.ok(guard > 0 && loop > guard, 'guard comes before the specialty loop');
    // the single caller still passes the active source, and the real-collection path is intact
    assert.match(launcher, /checkCompletionForSource\(activeSource\)/);
    assert.match(launcher, /apiClient\.get\(`\/api\/check-completion\/\$\{id\}`/);
    assert.match(launcher, /const activeSource = selectedSource \|\| WHOLE_BANK;/);
});

test('no other web code calls the completion endpoint', () => {
    const root = path.join(here, '..');
    const hits = [];
    (function walk(d) {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (/\.(jsx?|tsx?)$/.test(e.name) && !e.name.endsWith('.test.js') && fs.readFileSync(p, 'utf8').includes('.get(`/api/check-completion')) hits.push(path.relative(root, p).split(path.sep).join('/'));
        }
    })(root);
    assert.deepEqual(hits, ['components/quizs/QuizLauncher.jsx']);
});
