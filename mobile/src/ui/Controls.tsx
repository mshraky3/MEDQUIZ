import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useCopy, useLang } from '@/i18n/LanguageContext';
import authCopy from '@/i18n/copy/auth.js';
import { colors, fontFamilies, radius } from '@/theme';
import { Icon } from './Icon';
import { Row } from './Layout';
import { T } from './Text';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  /** Stretch to the full width of the parent (default true). */
  full?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const BUTTON_SIZES = {
  sm: { h: 38, px: 14, font: 13, icon: 15 },
  md: { h: 48, px: 18, font: 15, icon: 18 },
  lg: { h: 54, px: 22, font: 16, icon: 19 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  full = true,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const s = BUTTON_SIZES[size];
  const off = disabled || loading;
  const palette = {
    primary: { bg: colors.primary, fg: colors.white, border: colors.primary },
    secondary: { bg: colors.surface, fg: colors.primary, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
    danger: { bg: colors.error, fg: colors.white, border: colors.error },
    success: { bg: colors.success, fg: colors.white, border: colors.success },
  }[variant];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: off, busy: loading }}
      activeOpacity={0.8}
      disabled={off}
      onPress={onPress}
      style={[
        {
          minHeight: s.h,
          paddingHorizontal: s.px,
          borderRadius: radius.md,
          backgroundColor: palette.bg,
          borderWidth: 1.5,
          borderColor: palette.border,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: off ? 0.55 : 1,
          alignSelf: full ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      <Row gap={8} justify="center">
        {loading ? <ActivityIndicator size="small" color={palette.fg} /> : icon ? <Icon name={icon} size={s.icon} color={palette.fg} /> : null}
        <T weight="bold" size={s.font} color={palette.fg} align="center" style={{ flexShrink: 1 }}>
          {label}
        </T>
      </Row>
    </TouchableOpacity>
  );
}

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  sub?: string;
  icon?: string;
  disabled?: boolean;
};

/** A selectable pill (quiz launcher choices, filters). */
export function Chip({ label, selected = false, onPress, sub, icon, disabled }: ChipProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!disabled }}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.infoBg : colors.surface,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Row gap={6}>
        {icon ? <Icon name={icon} size={14} color={selected ? colors.primary : colors.textMedium} /> : null}
        <T weight="semibold" size={13} color={selected ? colors.primary : colors.text}>
          {label}
        </T>
        {sub ? (
          <T size={11} color={colors.textLight}>
            {sub}
          </T>
        ) : null}
      </Row>
    </TouchableOpacity>
  );
}

type InputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  error?: string;
  /** Pin LTR (emails, codes, tokens) even in the Arabic UI. */
  ltr?: boolean;
  hint?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps['style'];
  trailing?: React.ReactNode;
};

export function Input({ label, error, ltr = false, hint, style, inputStyle, trailing, secureTextEntry, ...rest }: InputProps) {
  const { isRTL, lang } = useLang();
  const login = useCopy(authCopy).login;
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const rtl = !ltr && isRTL;
  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? (
        <T weight="semibold" size={13} color={colors.textMedium}>
          {label}
        </T>
      ) : null}
      <Row
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          borderWidth: 1.5,
          borderColor: error ? colors.error : focused ? colors.primary : colors.border,
          paddingHorizontal: 12,
        }}
      >
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor="#94a3b8"
          style={[
            {
              flex: 1,
              minHeight: 48,
              paddingVertical: 10,
              fontFamily: fontFamilies[ltr ? 'en' : lang].regular,
              fontSize: 15,
              color: colors.text,
              textAlign: rtl ? 'right' : 'left',
              writingDirection: rtl ? 'rtl' : 'ltr',
            },
            inputStyle,
          ]}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? login.showPassword : login.hidePassword}
          >
            <Icon name={hidden ? 'eye-off' : 'eye'} size={18} color={colors.textLight} />
          </TouchableOpacity>
        ) : null}
        {trailing}
      </Row>
      {error ? (
        <T size={12} color={colors.error}>
          {error}
        </T>
      ) : hint ? (
        <T size={12} color={colors.textLight}>
          {hint}
        </T>
      ) : null}
    </View>
  );
}

type CheckboxProps = { checked: boolean; onChange: (next: boolean) => void; children: React.ReactNode; error?: boolean };

export function Checkbox({ checked, onChange, children, error }: CheckboxProps) {
  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      activeOpacity={0.8}
      onPress={() => onChange(!checked)}
    >
      <Row gap={10} align="flex-start">
        <View
          style={{
            width: 22,
            height: 22,
            marginTop: 2,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: checked ? colors.primary : error ? colors.error : colors.border,
            backgroundColor: checked ? colors.primary : colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {checked ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}
        </View>
        <View style={{ flex: 1 }}>{children}</View>
      </Row>
    </TouchableOpacity>
  );
}

/** A tappable text link. */
export function Link({
  label,
  onPress,
  size = 14,
  color = colors.primary,
  weight = 'semibold',
}: {
  label: string;
  onPress: () => void;
  size?: number;
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}) {
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="link" hitSlop={8}>
      <T weight={weight} size={size} color={color}>
        {label}
      </T>
    </TouchableOpacity>
  );
}

export const hairline = StyleSheet.hairlineWidth * 2;
