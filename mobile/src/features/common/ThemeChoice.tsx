import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useApp } from '@/i18n';
import { THEME_PREFS, ThemePref, radius, useColors, useTheme } from '@/theme';
import { Icon, Row, T } from '@/ui';

const ICONS: Record<ThemePref, string> = { system: 'smartphone', light: 'sun', dark: 'moon' };

/**
 * The appearance switch: Device / Light / Dark. The choice is saved on the phone
 * and applies at once; "Device" follows the phone's own light/dark setting.
 */
export function ThemeChoice() {
  const colors = useColors();
  const app = useApp();
  const { pref, setPref } = useTheme();
  const labels: Record<ThemePref, string> = { system: app.more.themeSystem, light: app.more.themeLight, dark: app.more.themeDark };
  return (
    <View style={{ gap: 10 }}>
      <View>
        <T weight="bold" size={15}>
          {app.more.appearance}
        </T>
        <T size={12} color={colors.textLight}>
          {app.more.appearanceHint}
        </T>
      </View>
      <Row gap={8} accessibilityRole="radiogroup">
        {THEME_PREFS.map((value) => {
          const selected = pref === value;
          return (
            <TouchableOpacity
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ selected, checked: selected }}
              accessibilityLabel={labels[value]}
              activeOpacity={0.8}
              onPress={() => setPref(value)}
              style={{
                flex: 1,
                minHeight: 44,
                paddingHorizontal: 8,
                borderRadius: radius.md,
                borderWidth: 1.5,
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.infoBg : colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Row gap={6} justify="center">
                <Icon name={ICONS[value]} size={15} color={selected ? colors.primaryInk : colors.textMedium} />
                <T weight="semibold" size={13} color={selected ? colors.primaryInk : colors.text} style={{ flexShrink: 1 }}>
                  {labels[value]}
                </T>
              </Row>
            </TouchableOpacity>
          );
        })}
      </Row>
    </View>
  );
}
