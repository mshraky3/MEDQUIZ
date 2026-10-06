import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useLang } from '@/i18n';
import { colors, radius } from '@/theme';
import { Icon, Row, T } from '@/ui';

/**
 * One-tap language switch. It always shows the language you would switch TO,
 * in that language's own script ("العربية" while reading English, "English"
 * while reading Arabic), the pattern people recognise fastest.
 */
export function LanguageToggle({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { lang, setLang } = useLang();
  const next = lang === 'ar' ? 'en' : 'ar';
  const label = compact ? next.toUpperCase() : next === 'ar' ? 'العربية' : 'English';
  const fg = dark ? colors.white : colors.primary;
  return (
    <TouchableOpacity
      onPress={() => setLang(next)}
      accessibilityRole="button"
      // The accessible name is written in the target language.
      accessibilityLabel={next === 'ar' ? 'التبديل إلى العربية' : 'Switch to English'}
      hitSlop={8}
      activeOpacity={0.8}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        borderColor: dark ? 'rgba(255,255,255,0.35)' : colors.border,
        backgroundColor: dark ? 'rgba(255,255,255,0.1)' : colors.surface,
      }}
    >
      <Row gap={6}>
        <Icon name="globe" size={15} color={fg} />
        <T weight="bold" size={12} color={fg}>
          {label}
        </T>
      </Row>
    </TouchableOpacity>
  );
}
