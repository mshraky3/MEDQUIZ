/**
 * Tripwire for the 3-4 Nov 2026 incident (answers saved against questions the student did not see).
 * Install as my-react-app/src/components/Quiz/quiz-swap-guard.test.js ; run:  cd my-react-app && npm test
 *
 * The repo has no DOM test environment (no jsdom / testing-library), so a full mount-the-quiz test cannot run today
 * (see frontend-tests.md for that plan). This is a source-level guard that needs no new dependency:
 *   1. the effect that fetches questions must not depend on identities that can change mid-quiz (user, sessionToken, t);
 *   2. it must refuse to replace the question list once an answer exists;
 *   3. a genuinely new set starts from a clean slate;
 *   4. submit builds every attempt from the SAME array (validQuestions[index]).
 * Verified: passes on origin/main (8639b82), fails on its parent 275f677.
 * Override the file under test with QUIZ_JSX=/path/to/QUIZ.jsx.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(process.env.QUIZ_JSX || path.join(here, 'QUIZ.jsx'), 'utf8').replace(/\r\n/g, '\n');

function fetchEffectDeps() {
    const start = src.indexOf('fetchQuestions();');
    assert.ok(start > 0, 'fetchQuestions() call not found: the quiz changed shape, update this test');
    const m = /return \(\) => controller\.abort\(\);\s*\}, \[([^\]]*)\]\);/.exec(src.slice(start));
    assert.ok(m, 'dependency array of the fetch effect not found');
    return m[1].split(',').map((x) => x.trim()).filter(Boolean);
}

test('the fetch effect does not re-run when auth objects or the language copy change identity', () => {
    const deps = fetchEffectDeps();
    for (const bad of ['user', 'sessionToken', 't', 'lang', 'location', 'location.state']) {
        assert.ok(!deps.includes(bad), `fetch effect depends on "${bad}": a late auth refresh would re-fetch and swap the questions (deps: ${deps.join(', ')})`);
    }
});

test('a fetched set is dropped when answers already exist for the current set', () => {
    const guard = /if \(Object\.keys\(answersRef\.current\)\.length > 0\) return;\s*setQuestions\(sanitizedQuestions\)/;
    assert.ok(guard.test(src), 'the "never swap the question set under answers already given" guard is missing');
});

test('a genuinely new set starts from a clean slate', () => {
    const at = src.indexOf('setQuestions(sanitizedQuestions)');
    assert.ok(at > 0, 'setQuestions(sanitizedQuestions) not found');
    const after = src.slice(at, at + 400);
    for (const reset of ['setQuestionAnswers({})', 'setCurrentQuestionIndex(0)', 'setSelectedAnswer(null)', 'setRevealedIndexes(new Set())']) {
        assert.ok(after.includes(reset), `after setQuestions the quiz must also call ${reset}`);
    }
});

test('a restored snapshot is kept for its own quiz even if auth settles later', () => {
    assert.ok(/restoredParamsKeyRef\.current === paramsKey && retryCount === 0/.test(src));
});

test('submit pairs answers and questions from the same array', () => {
    const uses = src.match(/const question = validQuestions\[index\];/g) || [];
    assert.ok(uses.length >= 2, 'both the final-exam and the practice attempt builders must read validQuestions[index]');
});
