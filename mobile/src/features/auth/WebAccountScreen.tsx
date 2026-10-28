import React from 'react';
import { router } from 'expo-router';
import { useApp } from '@/i18n';
import { colors } from '@/theme';
import { Button, Card, Icon, Screen, ScreenHeader, T } from '@/ui';

/**
 * Play build: "create an account" points to the website, generically (no link, no prices).
 * One account works on the website and in the app.
 */
export default function WebAccountScreen() {
  const app = useApp().webAccount;
  return (
    <Screen header={<ScreenHeader title={app.title} />}>
      <Card pad={22} style={{ alignItems: 'center', gap: 12 }}>
        <Icon name="user" size={38} color={colors.primary} />
        <T color={colors.textMedium} align="center">
          {app.body}
        </T>
        <Button label={app.signIn} onPress={() => router.replace('/login')} />
      </Card>
    </Screen>
  );
}
