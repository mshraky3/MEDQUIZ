import React from 'react';
import { RefreshControl, View } from 'react-native';
import { colors } from '@/theme';
import { Screen } from '@/ui';
import { AppBar, FreeAllowanceBanner } from './chrome';

/**
 * The frame of every tab: app bar, the free-allowance banner (free accounts
 * only) and a pull-to-refresh scroll body.
 */
export function TabScreen({
  children,
  onRefresh,
  refreshing = false,
  title,
  contentStyle,
}: {
  children: React.ReactNode;
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
  title?: string;
  contentStyle?: React.ComponentProps<typeof Screen>['contentStyle'];
}) {
  return (
    <Screen
      header={
        <View>
          <AppBar title={title} />
          <FreeAllowanceBanner />
        </View>
      }
      contentStyle={contentStyle}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} tintColor={colors.primary} colors={[colors.primary]} />
        ) : undefined
      }
    >
      {children}
    </Screen>
  );
}
