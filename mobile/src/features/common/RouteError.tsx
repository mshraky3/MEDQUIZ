import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useCommon } from '@/i18n';
import { Button, EmptyState, Screen } from '@/ui';

/**
 * Rendered by Expo Router (exported as ErrorBoundary from the root layout)
 * when a screen throws. Offers a retry, then a way home.
 */
export function RouteError({ error, retry }: { error: Error; retry: () => Promise<void> | void }) {
  const t = useCommon();
  if (__DEV__) console.error(error);
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <EmptyState icon="alert-triangle" tone="error" title={t.errors.unexpectedTitle} body={t.errors.unexpectedBody}>
          <Button label={t.actions.retry} onPress={() => void retry()} />
          <Button label={t.actions.backHome} variant="secondary" onPress={() => router.replace('/')} />
        </EmptyState>
      </View>
    </Screen>
  );
}
