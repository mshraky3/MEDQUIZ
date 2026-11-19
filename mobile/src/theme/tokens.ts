/**
 * Theme-independent design tokens: radii, spacing, type scale, fonts, shadows.
 * Colours depend on the theme and live in palettes.ts.
 */
import { Platform, ViewStyle } from 'react-native';

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

/** 4px grid, the same steps as the site's --space-N tokens. */
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 } as const;

export const fontSize = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36 } as const;

export const fontFamilies = {
  ar: {
    regular: 'Cairo_400Regular',
    medium: 'Cairo_500Medium',
    semibold: 'Cairo_600SemiBold',
    bold: 'Cairo_700Bold',
    extrabold: 'Cairo_800ExtraBold',
  },
  en: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extrabold: 'Inter_800ExtraBold',
  },
} as const;

export type FontWeight = keyof (typeof fontFamilies)['ar'];

const shadowBase = (opacity: number, radiusPx: number, offsetY: number, elevation: number): ViewStyle =>
  Platform.select<ViewStyle>({
    android: { elevation },
    // boxShadow, not the shadow* props: React Native 0.86 deprecates those.
    default: { boxShadow: `0px ${offsetY}px ${radiusPx}px rgba(15, 23, 42, ${opacity})` },
  }) as ViewStyle;

export const shadow = {
  sm: shadowBase(0.06, 2, 1, 1),
  md: shadowBase(0.1, 14, 4, 3),
  lg: shadowBase(0.16, 36, 14, 8),
} as const;
