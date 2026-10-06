import React from 'react';
import { StyleProp, Text as RNText, TextProps, TextStyle } from 'react-native';
import { useLang } from '@/i18n/LanguageContext';
import { colors, fontFamilies, FontWeight } from '@/theme';

export type TProps = TextProps & {
  weight?: FontWeight;
  size?: number;
  color?: string;
  /**
   * Exam material (question stems, options, explanations, deck text) stays in
   * English in both UI languages: pin it left-to-right and use the Latin face.
   */
  ltr?: boolean;
  align?: 'start' | 'end' | 'center';
  /** Line height as a multiple of the font size. */
  lh?: number;
  style?: StyleProp<TextStyle>;
};

/**
 * The one text component. It picks the face for the UI language (Cairo for
 * Arabic, Inter for English), aligns to the reading start edge, and leaves the
 * line height roomy enough for Arabic diacritics and tall Cairo glyphs.
 */
export function T({ weight = 'regular', size = 15, color = colors.text, ltr = false, align = 'start', lh, style, ...rest }: TProps) {
  const { lang, isRTL } = useLang();
  const rtl = ltr ? false : isRTL;
  const family = fontFamilies[ltr ? 'en' : lang][weight];
  const textAlign: TextStyle['textAlign'] =
    align === 'center' ? 'center' : align === 'start' ? (rtl ? 'right' : 'left') : rtl ? 'left' : 'right';
  const lineHeight = Math.round(size * (lh ?? (lang === 'ar' && !ltr ? 1.65 : 1.5)));
  return (
    <RNText
      {...rest}
      style={[{ fontFamily: family, fontSize: size, color, textAlign, writingDirection: rtl ? 'rtl' : 'ltr', lineHeight }, style]}
    />
  );
}

/** Bold-run text used by the explanation renderer and a few headings. */
export const B = (props: TProps) => <T weight="bold" {...props} />;

/**
 * Inline run inside a <T>: only the face, size, weight and colour. Alignment and
 * line height belong to the parent paragraph; repeating them on nested text
 * makes the lines uneven.
 */
export function Span({
  weight = 'regular',
  size,
  color,
  ltr = false,
  style,
  ...rest
}: Omit<TProps, 'align' | 'lh'>) {
  const { lang } = useLang();
  const family = fontFamilies[ltr ? 'en' : lang][weight];
  return <RNText {...rest} style={[{ fontFamily: family, fontSize: size, color }, style]} />;
}
