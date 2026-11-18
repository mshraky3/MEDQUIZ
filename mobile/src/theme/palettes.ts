/**
 * Colour palettes: "Scholar blue" light (the website's index.css :root) and its
 * dark twin (index.css :root[data-theme="dark"]). Both have exactly the same
 * keys. Opaque panels, no glass.
 *
 * Rules the dark set follows (same as the website):
 *  - brand FILLS (primary, success, error...) keep their value in both themes;
 *    white on #2563eb is 5.2:1 either way;
 *  - brand/status colours used as TEXT or icon colour read the `*Ink` twin: in
 *    light it is the same colour as the fill (nothing changes), in dark it is a
 *    lighter tint that clears WCAG AA on every dark panel;
 *  - every dark text token clears 4.5:1 on every panel token (palettes.test.ts).
 */
export type Palette = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;

  /** Text / icon twins of the brand colours (see above). */
  primaryInk: string;
  primaryDarkInk: string;
  secondaryInk: string;
  secondaryDarkInk: string;
  successInk: string;
  errorInk: string;
  warningInk: string;
  infoInk: string;

  text: string;
  textMedium: string;
  textLight: string;

  bg: string;
  surface: string;
  surface2: string;
  surfaceTint: string;
  border: string;
  borderLight: string;

  success: string;
  successBg: string;
  error: string;
  errorBg: string;
  warning: string;
  warningBg: string;
  info: string;
  infoBg: string;

  accuracyHigh: string;
  accuracyHighBg: string;
  accuracyMid: string;
  accuracyMidBg: string;
  accuracyLow: string;
  accuracyLowBg: string;

  /** Text on a brand fill; never a page background. */
  white: string;
  black: string;
  scrim: string;
  /** The splash / icon background, also the dark hero band (same in both themes). */
  navy: string;
  /** Placeholder text inside inputs. */
  placeholder: string;
};

export const lightColors: Palette = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#3b82f6',
  secondary: '#16a34a',
  secondaryDark: '#166534',

  primaryInk: '#2563eb',
  primaryDarkInk: '#1d4ed8',
  secondaryInk: '#16a34a',
  secondaryDarkInk: '#166534',
  successInk: '#16a34a',
  errorInk: '#dc2626',
  warningInk: '#d97706',
  infoInk: '#2563eb',

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
  navy: '#0b1021',
  placeholder: '#94a3b8',
};

export const darkColors: Palette = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#3b82f6',
  secondary: '#16a34a',
  secondaryDark: '#166534',

  primaryInk: '#8ab4ff',
  primaryDarkInk: '#a9c6ff',
  secondaryInk: '#4ade80',
  secondaryDarkInk: '#6ee7a0',
  successInk: '#4ade80',
  errorInk: '#fca5a5',
  warningInk: '#fbbf24',
  infoInk: '#8ab4ff',

  text: '#e8eefb',
  textMedium: '#b8c4d9',
  textLight: '#9aa8bf',

  bg: '#0b1220',
  surface: '#121a2b',
  surface2: '#172238',
  surfaceTint: '#1c2a47',
  border: '#2a3956',
  borderLight: '#223049',

  success: '#16a34a',
  successBg: 'rgba(74, 222, 128, 0.14)',
  error: '#dc2626',
  errorBg: 'rgba(248, 113, 113, 0.14)',
  warning: '#d97706',
  warningBg: 'rgba(251, 191, 36, 0.14)',
  info: '#2563eb',
  infoBg: 'rgba(96, 165, 250, 0.14)',

  accuracyHigh: '#4ade80',
  accuracyHighBg: 'rgba(74, 222, 128, 0.14)',
  accuracyMid: '#fbbf24',
  accuracyMidBg: 'rgba(251, 191, 36, 0.14)',
  accuracyLow: '#f87171',
  accuracyLowBg: 'rgba(248, 113, 113, 0.14)',

  white: '#ffffff',
  black: '#000000',
  scrim: 'rgba(0, 0, 0, 0.66)',
  navy: '#0b1021',
  placeholder: '#7c8aa5',
};
