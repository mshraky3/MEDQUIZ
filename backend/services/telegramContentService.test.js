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

test('the channel rotates through all three exam tracks, one poll each per day', async () => {
    const { CHANNEL_TRACKS } = await import('./telegramContentService.js');
    assert.deepEqual(CHANNEL_TRACKS, ['medical', 'nursing', 'dental']);
});

test('pickExplainedQuestion asks for an explained question of the right track and never repeats within 90 days', async () => {
    const { pickExplainedQuestion } = await import('./telegramContentService.js');
    const seen = [];
    const db = { query: async (sql, params) => { seen.push({ sql, params }); return { rows: [] }; } };
    assert.equal(await pickExplainedQuestion(db, 'dental'), null);
    assert.equal(seen.length, 2, 'hard query, then the random fallback');
    for (const { sql, params } of seen) {
        assert.deepEqual(params, ['dental']);
        assert.ok(sql.includes('q.explanation IS NOT NULL'));
        assert.ok(sql.includes("channel_explained"));
        assert.ok(sql.includes('90 days'));
    }
});
