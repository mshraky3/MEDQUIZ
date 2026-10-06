/**
 * Design tokens: "Scholar blue", the light theme of the website
 * (my-react-app/src/index.css is the source of truth). Light only, opaque
 * panels, no glass.
 */
import { Platform, ViewStyle } from 'react-native';

export const colors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#3b82f6',
  secondary: '#16a34a',
  secondaryDark: '#166534',

  text: '#0f1e3d',
  textMedium: '#475569',
  textLight: '#5b6779',

  bg: '#eef2fb',
  surface: '#ffffff',
  surface2: '#f5f8fd',
  surfaceTint: '#e1eafb',
  border: '#d4deee',
  borderLight: '#e6ecf7',

  success: '#16a34a',
  successBg: 'rgba(22, 163, 74, 0.12)',
  error: '#dc2626',
  errorBg: 'rgba(220, 38, 38, 0.10)',
  warning: '#d97706',
  warningBg: 'rgba(217, 119, 6, 0.12)',
  info: '#2563eb',
  infoBg: 'rgba(37, 99, 235, 0.10)',

  accuracyHigh: '#16a34a',
  accuracyHighBg: 'rgba(22, 163, 74, 0.12)',
  accuracyMid: '#d97706',
  accuracyMidBg: 'rgba(217, 119, 6, 0.12)',
  accuracyLow: '#dc2626',
  accuracyLowBg: 'rgba(220, 38, 38, 0.12)',

  white: '#ffffff',
  black: '#000000',
  scrim: 'rgba(15, 30, 61, 0.55)',
  /** The splash / icon background, also the dark hero band. */
  navy: '#0b1021',
} as const;

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
    default: {
      shadowColor: '#0f172a',
      shadowOpacity: opacity,
      shadowRadius: radiusPx,
      shadowOffset: { width: 0, height: offsetY },
    },
  }) as ViewStyle;

export const shadow = {
  sm: shadowBase(0.06, 2, 1, 1),
  md: shadowBase(0.1, 14, 4, 3),
  lg: shadowBase(0.16, 36, 14, 8),
} as const;

/** Tone -> text colour / tinted background, shared by every accuracy figure. */
export const toneColor = {
  high: colors.accuracyHigh,
  mid: colors.accuracyMid,
  low: colors.accuracyLow,
  neutral: colors.textLight,
} as const;

export const toneBg = {
  high: colors.accuracyHighBg,
  mid: colors.accuracyMidBg,
  low: colors.accuracyLowBg,
  neutral: colors.surfaceTint,
} as const;

/** Content width cap so tablets and the web preview don't stretch lines. */
export const MAX_CONTENT_WIDTH = 720;
