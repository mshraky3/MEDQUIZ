import React from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLang } from '@/i18n/LanguageContext';
import { colors, radius, shadow } from '@/theme';
import { Icon } from './Icon';
import { Row } from './Layout';
import { T } from './Text';

type SpinnerProps = { size?: 'sm' | 'md' | 'lg'; label?: string; fullScreen?: boolean };

/** The one canonical loading indicator. */
export function Spinner({ size = 'md', label, fullScreen = false }: SpinnerProps) {
  const dim = size === 'sm' ? 'small' : 'large';
  const node = <ActivityIndicator size={dim} color={colors.primary} accessibilityLabel={label || 'Loading'} />;
  if (fullScreen) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32, minHeight: 240 }}>
        {node}
        {label ? (
          <T color={colors.textLight} align="center">
            {label}
          </T>
        ) : null}
      </View>
    );
  }
  if (label) {
    return (
      <Row gap={10} justify="center">
        {node}
        <T color={colors.textLight}>{label}</T>
      </Row>
    );
  }
  return node;
}

type NoticeKind = 'error' | 'warning' | 'success' | 'info';

const NOTICE = {
  error: { fg: colors.error, bg: colors.errorBg, icon: 'alert-triangle' },
  warning: { fg: colors.warning, bg: colors.warningBg, icon: 'alert-triangle' },
  success: { fg: colors.success, bg: colors.successBg, icon: 'check-circle' },
  info: { fg: colors.primary, bg: colors.infoBg, icon: 'info' },
} as const;

/** The inline alert box (login errors, hints, session-expired notices). */
/**
 * The text of children that are only strings or numbers (`{a} 4111 {b}` arrives
 * as three of them), or null when there is a real element among them. A raw
 * string inside a View is a hard error on Android, so text-only children are
 * always wrapped in a Text.
 */
function textOnly(children: React.ReactNode): string | null {
  const parts = React.Children.toArray(children);
  if (parts.length === 0) return null;
  return parts.every((p) => typeof p === 'string' || typeof p === 'number') ? parts.join('') : null;
}

export function Notice({
  kind = 'info',
  children,
  style,
}: {
  kind?: NoticeKind;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const n = NOTICE[kind];
  const text = textOnly(children);
  return (
    <Row
      gap={10}
      align="flex-start"
      accessibilityRole="alert"
      style={[{ backgroundColor: n.bg, borderRadius: radius.md, padding: 12 }, style]}
    >
      <View style={{ marginTop: 2 }}>
        <Icon name={n.icon} size={17} color={n.fg} />
      </View>
      <View style={{ flex: 1 }}>
        {text !== null ? (
          <T size={14} color={n.fg} weight="medium">
            {text}
          </T>
        ) : (
          children
        )}
      </View>
    </Row>
  );
}

/** A dialog over a scrim. Dismissable unless `blocking`. */
export function Dialog({
  visible,
  onClose,
  children,
  blocking = false,
  scroll = true,
}: {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  blocking?: boolean;
  scroll?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={blocking ? undefined : onClose} statusBarTranslucent>
      <Pressable
        onPress={blocking ? undefined : onClose}
        style={{
          flex: 1,
          backgroundColor: colors.scrim,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 16,
        }}
      >
        <Pressable
          onPress={() => {}}
          style={[
            {
              width: '100%',
              maxWidth: 480,
              maxHeight: '100%',
              backgroundColor: colors.surface,
              borderRadius: radius.xl,
              overflow: 'hidden',
            },
            shadow.lg,
          ]}
        >
          {scroll ? (
            <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
          ) : (
            <View style={{ padding: 20, gap: 14 }}>{children}</View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function ProgressBar({
  pct,
  color = colors.primary,
  height = 8,
  track = colors.surfaceTint,
}: {
  pct: number;
  color?: string;
  height?: number;
  track?: string;
}) {
  const { isRTL } = useLang();
  const clamped = Math.max(0, Math.min(100, Number.isFinite(pct) ? pct : 0));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}
      style={{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden', flexDirection: isRTL ? 'row-reverse' : 'row' }}
    >
      <View style={{ width: `${clamped}%`, backgroundColor: color, borderRadius: height }} />
    </View>
  );
}

/** Centred empty / error state with an optional action. */
export function EmptyState({
  icon = 'inbox',
  title,
  body,
  children,
  tone = 'neutral',
}: {
  icon?: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
  tone?: 'neutral' | 'error';
}) {
  return (
    <View style={{ alignItems: 'center', gap: 10, paddingVertical: 28, paddingHorizontal: 16 }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tone === 'error' ? colors.errorBg : colors.surfaceTint,
        }}
      >
        <Icon name={icon} size={28} color={tone === 'error' ? colors.error : colors.primary} />
      </View>
      <T weight="bold" size={17} align="center">
        {title}
      </T>
      {body ? (
        <T color={colors.textLight} align="center">
          {body}
        </T>
      ) : null}
      {children ? <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 6 }}>{children}</View> : null}
    </View>
  );
}

/** Small coloured badge (tags, "new", counts). */
export function Badge({ label, color = colors.primary, bg = colors.infoBg, icon }: { label: string; color?: string; bg?: string; icon?: string }) {
  return (
    <Row gap={5} style={{ backgroundColor: bg, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' }}>
      {icon ? <Icon name={icon} size={12} color={color} /> : null}
      <T weight="bold" size={11} color={color}>
        {label}
      </T>
    </Row>
  );
}

/** Pressable card row (menu items, list entries). */
export function ListRow({
  icon,
  title,
  subtitle,
  onPress,
  right,
  iconColor = colors.primary,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  iconColor?: string;
}) {
  const content = (
    <Row gap={12} style={{ paddingVertical: 14, paddingHorizontal: 14 }}>
      {icon ? (
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: radius.md,
            backgroundColor: colors.surfaceTint,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon} size={19} color={iconColor} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <T weight="semibold" size={15}>
          {title}
        </T>
        {subtitle ? (
          <T size={12} color={colors.textLight}>
            {subtitle}
          </T>
        ) : null}
      </View>
      {right}
    </Row>
  );
  return onPress ? (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} accessibilityRole="button">
      {content}
    </TouchableOpacity>
  ) : (
    content
  );
}
