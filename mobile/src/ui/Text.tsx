import React, { createContext, useContext } from 'react';
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

/** True inside another <T>: an inline run, not a paragraph. */
const NestedText = createContext(false);

/**
 * The one text component. It picks the face for the UI language (Cairo for
 * Arabic, Inter for English), aligns to the reading start edge, and leaves the
 * line height roomy enough for Arabic diacritics and tall Cairo glyphs.
 *
 * A <T> inside a <T> is an inline run: it carries only its face, size, weight
 * and colour, and the surrounding paragraph keeps the alignment and line height
 * (repeating them on nested text makes the lines uneven).
 */
export function T({ weight = 'regular', size, color, ltr = false, align = 'start', lh, style, children, ...rest }: TProps) {
  const { lang, isRTL } = useLang();
  const nested = useContext(NestedText);
  const family = fontFamilies[ltr ? 'en' : lang][weight];

  if (nested) {
    const run: TextStyle = { fontFamily: family };
    if (size !== undefined) run.fontSize = size;
    if (color !== undefined) run.color = color;
    return (
      <RNText {...rest} style={[run, style]}>
        {children}
      </RNText>
    );
  }

  const fontSize = size ?? 15;
  const rtl = ltr ? false : isRTL;
  const textAlign: TextStyle['textAlign'] =
    align === 'center' ? 'center' : align === 'start' ? (rtl ? 'right' : 'left') : rtl ? 'left' : 'right';
  const lineHeight = Math.round(fontSize * (lh ?? (lang === 'ar' && !ltr ? 1.65 : 1.5)));
  return (
    <RNText
      {...rest}
      style={[{ fontFamily: family, fontSize, color: color ?? colors.text, textAlign, writingDirection: rtl ? 'rtl' : 'ltr', lineHeight }, style]}
    >
      <NestedText.Provider value>{children}</NestedText.Provider>
    </RNText>
  );
}

/** Bold-run text used by the explanation renderer and a few headings. */
export const B = (props: TProps) => <T weight="bold" {...props} />;

/** An explicit inline run. Same as a nested <T>, kept for call sites that predate nesting awareness. */
export function Span(props: Omit<TProps, 'align' | 'lh'>) {
  return <NestedText.Provider value>{<T {...props} />}</NestedText.Provider>;
}
