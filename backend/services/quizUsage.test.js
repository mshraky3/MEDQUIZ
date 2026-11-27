/**
 * Which questions a submitted quiz uses up (marked as seen, charged to the free
 * allowance). A timed quiz that runs out is scored on every question, but an
 * unanswered one is neither marked as seen nor charged (owner, 27 Nov 2026).
 * The app.js wiring is asserted on its source, as in the other tests here,
 * because app.js cannot be imported without a database.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { quizUsage } from './quizUsage.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const use = (answeredQuestionIds, over = {}) =>
    quizUsage({ questionIds: [1, 2, 3, 4, 5], answeredQuestionIds, totalQuestions: 5, ...over });

test('timer ran out with 2 of 5 answered: only those 2 are used up', () => {
    assert.deepEqual(use([1, 2]), { questionIds: [1, 2], billable: 2 });
});

test('timer ran out with nothing answered: nothing is used up, NOT the whole quiz', () => {
    // The old charge fell back to total_questions on an empty id list.
    assert.deepEqual(use([]), { questionIds: [], billable: 0 });
});

test('a client that does not send answered ids (Android, an old tab) is treated as before', () => {
    assert.deepEqual(use(undefined), { questionIds: [1, 2, 3, 4, 5], billable: 5 });
    assert.deepEqual(use(null), { questionIds: [1, 2, 3, 4, 5], billable: 5 });
    assert.deepEqual(use('1,2'), { questionIds: [1, 2, 3, 4, 5], billable: 5 });
    assert.deepEqual(use(undefined, { questionIds: undefined }), { questionIds: [], billable: 5 });
    assert.deepEqual(use(undefined, { questionIds: [] }), { questionIds: [], billable: 5 });
});

test('without a question list the answered list cannot remove the charge', () => {
    assert.deepEqual(use([], { questionIds: undefined }), { questionIds: [], billable: 5 });
    assert.deepEqual(use([], { questionIds: [] }), { questionIds: [], billable: 5 });
});

test('answered ids outside the quiz are ignored and repeats count once', () => {
    assert.deepEqual(use([2, 2, '3', 99]), { questionIds: [2, 3], billable: 2 });
});

test('app.js wiring: the charge, progress rows and topic completion use the same set', () => {
    const src = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8').replace(/\r\n/g, '\n');
    const start = src.indexOf("app.post('/quiz-sessions', requireSession");
    const route = src.slice(start, src.indexOf('\n});', start));
    assert.match(route, /answered_question_ids,/);
    assert.match(route, /const usage = quizUsage\(\{\s*questionIds: question_ids,\s*answeredQuestionIds: answered_question_ids,\s*totalQuestions: total_questions,?\s*\}\);/);
    // The charge is inline here, or goes through spendFreeAllowance (PR 57). Passing
    // the full question list there would charge the unanswered ones again.
    assert.match(route, /const billable = usage\.billable;|questionIds: usage\.questionIds,\s*totalQuestions: usage\.billable,/);
    assert.match(route, /if \(usage\.questionIds\.length > 0\) \{[\s\S]{0,300}WHERE id = ANY\(\$1\)\s*`, \[usage\.questionIds\]\);/);
});
