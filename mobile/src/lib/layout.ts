import { useWindowDimensions } from 'react-native';
import { LIST_PANE_WIDTH, contentMaxWidthFor, sizeClassFor, targetScaleFor, textScaleFor } from './layoutLogic';

export { LIST_PANE_WIDTH };
export type { SizeClass } from './layoutLogic';

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
