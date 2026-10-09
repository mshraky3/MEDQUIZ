import test from 'node:test';
import assert from 'node:assert/strict';
import { astDateTag, astDayRange, lastCompletedAstDay } from './dailySignupsReportService.js';

test('Saudi date rolls over at 21:00 UTC', () => {
    assert.equal(astDateTag(new Date('2026-10-09T20:59:59Z')), '2026-10-09');
    assert.equal(astDateTag(new Date('2026-10-09T21:00:00Z')), '2026-10-10');
});

test('a Saudi day is 21:00 UTC to 21:00 UTC', () => {
    const { start, end } = astDayRange('2026-10-09');
    assert.equal(start.toISOString(), '2026-10-08T21:00:00.000Z');
    assert.equal(end.toISOString(), '2026-10-09T21:00:00.000Z');
});

test('the scheduled report always covers a finished day', () => {
    // 00:05 AST on 10 Oct (21:05 UTC on 9 Oct) reports 9 Oct, which has just ended.
    const now = new Date('2026-10-09T21:05:00Z');
    const day = lastCompletedAstDay(now);
    assert.equal(day, '2026-10-09');
    assert.ok(astDayRange(day).end.getTime() <= now.getTime());
    // A late GitHub run (e.g. 03:00 AST) still reports the same finished day.
    assert.equal(lastCompletedAstDay(new Date('2026-10-10T00:00:00Z')), '2026-10-09');
    // Mid-afternoon on 9 Oct (the previous 20:00 UTC bug window) reports 8 Oct, never today.
    assert.equal(lastCompletedAstDay(new Date('2026-10-09T16:00:00Z')), '2026-10-08');
});
