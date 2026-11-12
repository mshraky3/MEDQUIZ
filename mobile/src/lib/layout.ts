import { useWindowDimensions } from 'react-native';
import {
  ContentWidth,
  LIST_PANE_WIDTH,
  columnsFor,
  contentCapFor,
  contentWidthFor,
  sizeClassFor,
  splitsQuestion,
  targetScaleFor,
  textScaleFor,
  usesRail,
} from './layoutLogic';

export { LIST_PANE_WIDTH };
export type { ContentWidth, SizeClass } from './layoutLogic';

/**
 * The one hook every screen asks "how much room do I have?" (the breakpoint helper).
 * `size` is the window class, `isTablet` is anything wider than a phone window, and
 * `columns()` says how many equal columns a card grid can use at that width.
 */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const size = sizeClassFor(width);
  return {
    width,
    height,
    size,
    isTablet: size !== 'compact',
    isExpanded: size === 'expanded',
    isLandscape: width > height,
    contentMaxWidth: contentCapFor(size, 'reading'),
    textScale: textScaleFor(size),
    targetScale: targetScaleFor(size),
    /** Two panes only when there is room for a list AND a readable lesson beside it. */
    twoPane: size === 'expanded',
    /** Side navigation rail instead of the bottom tab bar. */
    rail: usesRail(size),
    /** Content cap for a width preset (0 = none). */
    capFor: (preset: ContentWidth) => contentCapFor(size, preset),
    /** Columns a card grid of this preset can use (always 1 on a phone window). */
    columns: (minItem: number, max = 3, preset: ContentWidth = 'wide', gap = 14) =>
      size === 'compact' ? 1 : columnsFor(contentWidthFor(width, size, preset), minItem, max, gap),
    /** Stem | options side by side, for a question pane of this width. */
    splitQuestion: (paneWidth: number) => splitsQuestion(paneWidth, width > height),
  };
}
