import { describe, expect, it } from 'vitest';
import {
  PAGE_PADDING,
  SPLIT_QUESTION_MIN,
  chunk,
  columnsFor,
  contentCapFor,
  contentMaxWidthFor,
  contentWidthFor,
  sizeClassFor,
  splitsQuestion,
  targetScaleFor,
  textScaleFor,
  usesRail,
} from '../lib/layoutLogic';
import { paletteCell } from '../features/quiz/quizLogic';

describe('window size classes', () => {
  it('phones are compact, small tablets medium, large tablets and landscape expanded', () => {
    expect(sizeClassFor(360)).toBe('compact');
    expect(sizeClassFor(599)).toBe('compact');
    expect(sizeClassFor(600)).toBe('medium');
    expect(sizeClassFor(768)).toBe('medium');
    expect(sizeClassFor(839)).toBe('medium');
    expect(sizeClassFor(840)).toBe('expanded');
    expect(sizeClassFor(1280)).toBe('expanded');
  });

  it('the phone keeps its old 720 cap and nothing shrinks as the window grows', () => {
    expect(contentMaxWidthFor('compact')).toBe(720);
    expect(contentMaxWidthFor('medium')).toBeGreaterThanOrEqual(720);
    expect(contentMaxWidthFor('expanded')).toBeGreaterThan(contentMaxWidthFor('medium'));
    expect(textScaleFor('compact')).toBe(1);
    expect(textScaleFor('expanded')).toBeGreaterThan(textScaleFor('medium'));
    expect(targetScaleFor('compact')).toBe(1);
    expect(targetScaleFor('expanded')).toBeGreaterThan(1);
  });
});

describe('question palette', () => {
  it('marks the current, answered and open questions (never right or wrong)', () => {
    const answers = { 0: 'a', 2: 'c' };
    expect(paletteCell(1, 1, answers)).toBe('current');
    expect(paletteCell(0, 1, answers)).toBe('answered');
    expect(paletteCell(2, 1, answers)).toBe('answered');
    expect(paletteCell(3, 1, answers)).toBe('open');
    // the current question wins even when it is answered
    expect(paletteCell(0, 0, answers)).toBe('current');
  });
});

describe('content width presets', () => {
  it('a phone window is never affected: every capped preset keeps the old 720', () => {
    for (const preset of ['form', 'reading', 'wide'] as const) expect(contentCapFor('compact', preset)).toBe(720);
    expect(contentCapFor('compact', 'full')).toBe(0);
  });

  it('tablet columns stay inside the 720 to 840 reading band, forms are narrower, dashboards wider', () => {
    expect(contentCapFor('medium', 'reading')).toBe(720);
    expect(contentCapFor('expanded', 'reading')).toBe(840);
    for (const size of ['medium', 'expanded'] as const) {
      expect(contentCapFor(size, 'form')).toBeLessThan(contentCapFor(size, 'reading'));
      expect(contentCapFor(size, 'wide')).toBeGreaterThan(contentCapFor(size, 'reading'));
      expect(contentCapFor(size, 'full')).toBe(0);
    }
  });

  it('content width is the window or the cap, minus the page padding', () => {
    expect(contentWidthFor(360, 'compact', 'reading')).toBe(360 - PAGE_PADDING * 2);
    expect(contentWidthFor(800, 'medium', 'wide')).toBe(800 - PAGE_PADDING * 2); // the window is narrower than the cap
    expect(contentWidthFor(1067, 'expanded', 'form')).toBe(560 - PAGE_PADDING * 2);
    expect(contentWidthFor(1067, 'expanded', 'full')).toBe(1067 - PAGE_PADDING * 2);
  });
});

describe('column grid', () => {
  it('fits as many columns as the width allows, within 1 and max', () => {
    expect(columnsFor(300, 340, 2)).toBe(1);
    expect(columnsFor(734, 360, 2)).toBe(2); // 7-inch portrait content width ~768 less padding
    expect(columnsFor(1088, 340, 2)).toBe(2);
    expect(columnsFor(1088, 300, 3)).toBe(3);
    expect(columnsFor(1088, 230, 4)).toBe(4);
    expect(columnsFor(0, 300)).toBe(1);
    expect(columnsFor(500, 0)).toBe(1);
  });

  it('the real tablet windows get the layouts the plan describes', () => {
    // tab7 portrait 800 dp, landscape 1280 dp; tab10 portrait 1067 dp, landscape 1707 dp (density 240)
    const at = (w: number, minItem: number, max: number) => columnsFor(contentWidthFor(w, sizeClassFor(w), 'wide'), minItem, max);
    expect(at(800, 360, 2)).toBe(2);
    expect(at(1067, 360, 2)).toBe(2);
    expect(at(1280, 300, 3)).toBe(3);
    expect(at(1707, 230, 4)).toBe(4);
    expect(at(412, 360, 2)).toBe(1);
  });

  it('chunks rows without dropping or repeating items', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    expect(chunk([], 3)).toEqual([]);
    expect(chunk([1, 2], 0)).toEqual([[1], [2]]);
  });
});

describe('tablet-only structure', () => {
  it('the side rail and the split question page appear only on wide windows', () => {
    expect(usesRail('compact')).toBe(false);
    expect(usesRail('medium')).toBe(false);
    expect(usesRail('expanded')).toBe(true);
    expect(splitsQuestion(SPLIT_QUESTION_MIN, true)).toBe(true);
    expect(splitsQuestion(SPLIT_QUESTION_MIN - 1, true)).toBe(false);
    expect(splitsQuestion(1400, false)).toBe(false); // portrait never splits
    // 7-inch landscape minus the 300 dp palette still splits; 10-inch portrait does not
    expect(splitsQuestion(1280 - 300, true)).toBe(true);
    expect(splitsQuestion(1067 - 300, false)).toBe(false);
  });
});
