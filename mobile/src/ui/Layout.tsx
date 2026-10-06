import React from 'react';
import {
  RefreshControlProps,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useCopy, useLang } from '@/i18n/LanguageContext';
import appCopy from '@/i18n/appCopy';
import { MAX_CONTENT_WIDTH, colors, radius, shadow } from '@/theme';
import { Icon } from './Icon';
import { T } from './Text';

type RowProps = ViewProps & {
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
  /** Force LTR order (rare: exam-material rows). */
  ltr?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** A horizontal group that starts at the reading start edge (right in Arabic). */
export function Row({ gap = 0, align = 'center', justify, wrap = false, ltr = false, style, ...rest }: RowProps) {
  const { isRTL } = useLang();
  return (
    <View
      {...rest}
      style={[
        {
          flexDirection: isRTL && !ltr ? 'row-reverse' : 'row',
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : 'nowrap',
          gap,
        },
        style,
      ]}
    />
  );
}

type CardProps = ViewProps & { pad?: number; style?: StyleProp<ViewStyle>; flat?: boolean };

/** An opaque panel: the site uses no glass or translucency anywhere. */
export function Card({ pad = 16, flat = false, style, ...rest }: CardProps) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: colors.border,
          padding: pad,
        },
        flat ? null : shadow.sm,
        style,
      ]}
    />
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: StyleSheet.hairlineWidth * 2, backgroundColor: colors.borderLight }, style]} />;
}

/** Goes back, or to the right home when there is nothing to go back to. */
export function goBack(signedIn: boolean) {
  if (router.canGoBack()) router.back();
  else router.replace(signedIn ? '/(tabs)' : '/');
}

type HeaderProps = {
  title?: string;
  subtitle?: string;
  /** Hide the back arrow (tab roots). */
  noBack?: boolean;
  right?: React.ReactNode;
  onBack?: () => void;
};

export function ScreenHeader({ title, subtitle, noBack, right, onBack }: HeaderProps) {
  const app = useCopy(appCopy);
  return (
    <Row
      gap={10}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: colors.surface,
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
        borderBottomColor: colors.border,
      }}
    >
      {!noBack && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={app.back}
          onPress={onBack || (() => goBack(true))}
          hitSlop={10}
          style={{
            width: 38,
            height: 38,
            borderRadius: radius.md,
            backgroundColor: colors.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="chevron-left" size={20} color={colors.text} strokeWidth={2.5} flip />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        {!!title && (
          <T weight="bold" size={17} numberOfLines={1}>
            {title}
          </T>
        )}
        {!!subtitle && (
          <T size={12} color={colors.textLight} numberOfLines={1}>
            {subtitle}
          </T>
        )}
      </View>
      {right}
    </Row>
  );
}

type ScreenProps = {
  children?: React.ReactNode;
  /** Fixed bar above the content. It receives the top safe-area inset. */
  header?: React.ReactNode;
  /** Fixed bar below the content (sticky actions). */
  footer?: React.ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  bg?: string;
  /** Content max width (default 720). Pass 0 for full bleed. */
  maxWidth?: number;
  padded?: boolean;
  /** Gives the caller the ScrollView (scroll to a section, remember position). */
  scrollRef?: React.Ref<ScrollView>;
};

/**
 * The page shell: safe-area aware, themed background, optional fixed header and
 * footer, and a centred content column so wide screens do not stretch lines.
 */
export function Screen({
  children,
  header,
  footer,
  scroll = true,
  contentStyle,
  refreshControl,
  bg = colors.bg,
  maxWidth = MAX_CONTENT_WIDTH,
  padded = true,
  scrollRef,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const body = (
    <View
      style={[
        { width: '100%', alignSelf: 'center', flexGrow: 1 },
        maxWidth ? { maxWidth } : null,
        padded ? { padding: 16, gap: 16 } : null,
        contentStyle,
      ]}
    >
      {children}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: header ? 0 : insets.top }}>
      {header ? <View style={{ paddingTop: insets.top, backgroundColor: colors.surface }}>{header}</View> : null}
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: footer ? 16 : insets.bottom + 16 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          {body}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{body}</View>
      )}
      {footer ? <View style={{ paddingBottom: insets.bottom }}>{footer}</View> : null}
    </View>
  );
}
