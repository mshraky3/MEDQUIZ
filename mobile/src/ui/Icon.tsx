import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';
import { useLang } from '@/i18n/LanguageContext';
import { colors } from '@/theme';
import { GLYPHS } from './glyphs.generated';

/**
 * Glyphs the app needs that the website's Icon.jsx does not have. Same
 * Lucide-style 24x24 grid, 2px strokes.
 */
const EXTRA_GLYPHS: Record<string, (color: string) => React.ReactElement> = {
  'external-link': () => (
    <>
      <Path d="M15 3h6v6" />
      <Path d="M10 14 21 3" />
      <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  share: () => (
    <>
      <Circle cx="18" cy="5" r="3" />
      <Circle cx="6" cy="12" r="3" />
      <Circle cx="18" cy="19" r="3" />
      <Line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      <Line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </>
  ),
  copy: () => (
    <>
      <Rect x="9" y="9" width="13" height="13" rx="2" />
      <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  'credit-card': () => (
    <>
      <Rect x="2" y="5" width="20" height="14" rx="2" />
      <Line x1="2" y1="10" x2="22" y2="10" />
    </>
  ),
  'wifi-off': () => (
    <>
      <Path d="m2 2 20 20" />
      <Path d="M8.5 16.4a5 5 0 0 1 7 0" />
      <Path d="M5 12.9a10 10 0 0 1 5.2-2.7" />
      <Path d="M2 8.8a15 15 0 0 1 4.2-2.7" />
      <Path d="M19 12.9a10 10 0 0 0-2.7-1.9" />
      <Path d="M12 20h.01" />
    </>
  ),
  'file-text': () => (
    <>
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Polyline points="14 2 14 8 20 8" />
      <Line x1="16" y1="13" x2="8" y2="13" />
      <Line x1="16" y1="17" x2="8" y2="17" />
    </>
  ),
  'arrow-right': () => (
    <>
      <Path d="M5 12h14" />
      <Path d="m12 5 7 7-7 7" />
    </>
  ),
  'arrow-left': () => (
    <>
      <Path d="M19 12H5" />
      <Path d="m12 19-7-7 7-7" />
    </>
  ),
  'chevron-up': () => <Path d="m18 15-6-6-6 6" />,
  layers: () => (
    <>
      <Path d="m12 2 10 5-10 5L2 7z" />
      <Path d="m2 17 10 5 10-5" />
      <Path d="m2 12 10 5 10-5" />
    </>
  ),
  list: () => (
    <>
      <Line x1="8" y1="6" x2="21" y2="6" />
      <Line x1="8" y1="12" x2="21" y2="12" />
      <Line x1="8" y1="18" x2="21" y2="18" />
      <Line x1="3" y1="6" x2="3.01" y2="6" />
      <Line x1="3" y1="12" x2="3.01" y2="12" />
      <Line x1="3" y1="18" x2="3.01" y2="18" />
    </>
  ),
  gift: () => (
    <>
      <Rect x="3" y="8" width="18" height="4" rx="1" />
      <Path d="M12 8v13" />
      <Path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <Path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </>
  ),
  edit: () => (
    <>
      <Path d="M12 20h9" />
      <Path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
    </>
  ),
  save: () => (
    <>
      <Path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <Polyline points="17 21 17 13 7 13 7 21" />
      <Polyline points="7 3 7 8 15 8" />
    </>
  ),
  'minus-circle': () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M8 12h8" />
    </>
  ),
  'plus-circle': () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 8v8M8 12h8" />
    </>
  ),
  history: () => (
    <>
      <Path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <Path d="M3 3v5h5" />
      <Path d="M12 7v5l3 2" />
    </>
  ),
};

export type IconName = string;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Mirror the glyph in Arabic (directional arrows and chevrons). */
  flip?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = 20, color = colors.text, strokeWidth = 2, flip = false, style }: Props) {
  const { isRTL } = useLang();
  const glyph = GLYPHS[name] || EXTRA_GLYPHS[name];
  if (!glyph) return null;
  const mirror = flip && isRTL;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={[mirror ? { transform: [{ scaleX: -1 }] } : null, style]}
    >
      {glyph(color)}
    </Svg>
  );
}

/** The "forward" chevron: points toward the reading end (left in Arabic). */
export function Chevron({ size = 18, color = colors.textLight, back = false }: { size?: number; color?: string; back?: boolean }) {
  return <Icon name={back ? 'chevron-left' : 'chevron-right'} size={size} color={color} flip />;
}
