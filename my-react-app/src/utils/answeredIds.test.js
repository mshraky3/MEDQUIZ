import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { answeredIds } from './answeredIds.js';

const answers = (...selected) => selected.map((s, i) => ({ id: i + 11, selected: s }));

test('only questions with an answer are listed, in quiz order', () => {
  assert.deepEqual(answeredIds(answers('a', undefined, 'b', undefined)), [11, 13]);
});

test('nothing answered gives an empty list', () => {
  assert.deepEqual(answeredIds(answers(undefined, undefined)), []);
});

test('QUIZ.jsx sends the list with the session, next to the full question list', () => {
  const src = fs.readFileSync(new URL('../components/Quiz/QUIZ.jsx', import.meta.url), 'utf8');
  assert.match(src, /question_ids: questionIds,\s*answered_question_ids: answeredIds\(finalAnswers\)/);
});
