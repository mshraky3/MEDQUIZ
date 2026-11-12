import test from 'node:test';
import assert from 'node:assert/strict';
import { examRoutePaths as light } from './examPaths.js';
import { examRoutePaths as full } from './examGuides.js';
import * as copy from '../i18n/copy/examGuides.js';
import * as paths from './examPaths.js';

test('light route list equals the full module list, in the same order', () => {
    assert.deepEqual(light(), full());
    assert.equal(light().length, 13);
});

test('copy module still re-exports the same constants and helpers', () => {
    for (const k of ['EXAMS_ROOT', 'SHARED_PAGES', 'EXAM_PAGES', 'EXAM_KEYS', 'examPath', 'examPagePath', 'sharedPagePath']) {
        assert.equal(copy[k], paths[k], k);
    }
});