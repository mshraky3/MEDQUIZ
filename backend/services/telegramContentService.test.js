import test from 'node:test';
import assert from 'node:assert/strict';
import { NO_PLACEHOLDER_OPTIONS, PLACEHOLDER_OPTION } from './telegramContentService.js';

test('the poll picker filters the bank placeholder on all four options', () => {
    for (const col of ['option1', 'option2', 'option3', 'option4']) {
        assert.ok(NO_PLACEHOLDER_OPTIONS.includes(`q.${col}`), `${col} is checked`);
    }
    assert.equal(PLACEHOLDER_OPTION, "didn't recall");
    assert.ok(NO_PLACEHOLDER_OPTIONS.includes("'didn''t recall'"), 'apostrophe is escaped for SQL');
});
