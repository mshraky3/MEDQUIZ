import React from 'react';
import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { SITE_URL } from '@/config';
import { useApp } from '@/i18n';
import { colors } from '@/theme';
import { Button, Card, Icon, Screen, ScreenHeader, T } from '@/ui';

/**
 * What the sign-up routes show in the Google Play build (PLAY_BUILD): accounts are
 * created on the website only, the app signs in. `path` is the matching website
 * page, so an invite or seat link keeps working: /signup, /signup/<token> or /join/<token>.
 */
export default function WebAccountScreen({ path = '/signup' }: { path?: string }) {
  const t = useApp().webAccount;
  const url = `${SITE_URL}${path}`;
  const openWebsite = () => WebBrowser.openBrowserAsync(url).catch(() => Linking.openURL(url));
  const goLogin = () => router.replace('/login');

  return (
    <Screen header={<ScreenHeader title={t.title} />}>
      <Card pad={22} style={{ alignItems: 'center', gap: 12 }}>
        <Icon name="user" size={38} color={colors.primary} />
        <T color={colors.textMedium} align="center">
          {t.body}
        </T>
        <Button label={t.open} icon="external-link" onPress={openWebsite} />
        <Button label={t.signIn} variant="secondary" onPress={goLogin} />
      </Card>
    </Screen>
  );
}
