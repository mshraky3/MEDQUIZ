import { useWindowDimensions } from 'react-native';

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

/** Content column cap. The phone value stays what the app always used. */
export function contentMaxWidthFor(size: SizeClass): number {
  return size === 'expanded' ? 960 : size === 'medium' ? 760 : 720;
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

export function useLayout() {
  const { width, height } = useWindowDimensions();
  const size = sizeClassFor(width);
  return {
    width,
    height,
    size,
    isExpanded: size === 'expanded',
    isLandscape: width > height,
    contentMaxWidth: contentMaxWidthFor(size),
    textScale: textScaleFor(size),
    targetScale: targetScaleFor(size),
    /** Two panes only when there is room for a list AND a readable lesson beside it. */
    twoPane: size === 'expanded',
  };
}
