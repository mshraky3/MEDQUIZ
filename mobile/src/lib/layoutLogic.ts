// Pure layout rules (no React Native import, so unit tests can load it).
/**
 * Window size classes (Material 3 / Play large-screen guidance): the app reacts to the
 * width of the WINDOW, not the device, so a phone in landscape, a foldable, a tablet in
 * split-screen and the web preview all get the layout that fits the space they really have.
 */
export type SizeClass = 'compact' | 'medium' | 'expanded';

export const COMPACT_MAX = 600; // phones in portrait
export const EXPANDED_MIN = 840; // tablets, foldables unfolded, landscape tablets

export function sizeClassFor(width: number): SizeClass {
  if (width < COMPACT_MAX) return 'compact';
  if (width < EXPANDED_MIN) return 'medium';
  return 'expanded';
}

/**
 * Content column presets. Phones (compact) keep the 720 cap they always had, so nothing on a
 * phone changes. On tablets each kind of page gets the width it reads best at:
 *  - form:    sign-in and sign-up cards (a form wider than ~560 dp is hard to scan)
 *  - reading: lists, settings, lessons, questions (a text line should stay near 70 characters)
 *  - wide:    dashboards and the landing page, which lay their cards out in columns
 *  - full:    no cap
 */
export type ContentWidth = 'form' | 'reading' | 'wide' | 'full';

const CAPS: Record<ContentWidth, Record<SizeClass, number>> = {
  form: { compact: 720, medium: 520, expanded: 560 },
  reading: { compact: 720, medium: 720, expanded: 840 },
  wide: { compact: 720, medium: 1040, expanded: 1120 },
  full: { compact: 0, medium: 0, expanded: 0 },
};

/** 0 means "no cap". */
export function contentCapFor(size: SizeClass, preset: ContentWidth = 'reading'): number {
  return CAPS[preset][size];
}

/** The default column cap (the "reading" preset). */
export function contentMaxWidthFor(size: SizeClass): number {
  return contentCapFor(size, 'reading');
}

/** Page padding on each side of the content column. */
export const PAGE_PADDING = 16;

/**
 * How many equal columns fit. `available` is the width the grid may use; a column is never
 * narrower than `minItem`. Always at least 1 and at most `max`.
 */
export function columnsFor(available: number, minItem: number, max = 3, gap = 14): number {
  if (!(available > 0) || !(minItem > 0)) return 1;
  const fit = Math.floor((available + gap) / (minItem + gap));
  return Math.max(1, Math.min(max, fit));
}

/** Splits items into rows of `count` (the last row may be short). */
export function chunk<T>(items: readonly T[], count: number): T[][] {
  const size = Math.max(1, Math.floor(count));
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/** The width a page's content really gets: the window, capped, minus the page padding. */
export function contentWidthFor(windowWidth: number, size: SizeClass, preset: ContentWidth = 'reading'): number {
  const cap = contentCapFor(size, preset);
  const outer = cap > 0 ? Math.min(windowWidth, cap) : windowWidth;
  return Math.max(0, outer - PAGE_PADDING * 2);
}

/** Wide windows put the bottom tabs in a side rail (landscape tablets, unfolded foldables). */
export function usesRail(size: SizeClass): boolean {
  return size === 'expanded';
}

/** A question page splits into stem | options only when the pane can hold two real columns. */
export const SPLIT_QUESTION_MIN = 900;
export function splitsQuestion(paneWidth: number, landscape: boolean): boolean {
  return landscape && paneWidth >= SPLIT_QUESTION_MIN;
}

/** Larger type on larger screens (on top of the user's own system font scale). */
export function textScaleFor(size: SizeClass): number {
  return size === 'expanded' ? 1.14 : size === 'medium' ? 1.07 : 1;
}

/** Larger tap targets on larger screens (Play: 48dp minimum, more comfortable on tablets). */
export function targetScaleFor(size: SizeClass): number {
  return size === 'expanded' ? 1.15 : size === 'medium' ? 1.08 : 1;
}

/** Width of the list pane in a two-pane layout. */
export const LIST_PANE_WIDTH = 380;

