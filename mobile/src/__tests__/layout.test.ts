import { describe, expect, it } from 'vitest';
import { contentMaxWidthFor, sizeClassFor, targetScaleFor, textScaleFor } from '../lib/layout';
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
