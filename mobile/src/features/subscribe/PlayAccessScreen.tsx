import React, { useEffect } from 'react';
import { AppState, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { SITE_URL, WEBSITE_SUBSCRIBE_BUTTON } from '@/config';
import { useApp } from '@/i18n';
import { useAuth } from '@/lib/auth';
import { accountAccess } from '@/lib/subscriptionState';
import { colors } from '@/theme';
import { Button, Card, Icon, Screen, ScreenHeader, T } from '@/ui';

/**
 * What /subscribe and /groups show in the Google Play build (PLAY_BUILD): no
 * plans, no prices, no offers, no card form. The app is sign-in and study only;
 * payment stays on the website. The "open my account on the website" button is
 * a separate switch (WEBSITE_SUBSCRIBE_BUTTON, off unless the build sets it).
 * Coming back from the browser re-reads the subscription so a plan bought on the
 * site unlocks the app at once.
 */
export default function PlayAccessScreen() {
  const app = useApp().playAccess;
  const { user, refreshSubscription } = useAuth();
  const access = accountAccess(user);
  // Read the subscription again on opening so the status is the server's, not an old session's.
  useEffect(() => {
    void refreshSubscription(true);
  }, [refreshSubscription]);

  useEffect(() => {
    if (!WEBSITE_SUBSCRIBE_BUTTON) return undefined;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshSubscription(true);
    });
    return () => sub.remove();
  }, [refreshSubscription]);

  const openWebsite = () =>
    WebBrowser.openBrowserAsync(`${SITE_URL}/account`).catch(() => Linking.openURL(`${SITE_URL}/account`));

  return (
    <Screen header={<ScreenHeader title={app.title} />}>
      <Card pad={22} style={{ alignItems: 'center', gap: 12 }}>
        <Icon name="user" size={38} color={colors.primary} />
        <T color={colors.textMedium} align="center">
          {access === 'free' ? app.status.free(Number(user?.free_questions_remaining)) : app.status[access]}
        </T>
        {access === 'subscriber' ? null : (
          <T color={colors.textMedium} align="center">
            {WEBSITE_SUBSCRIBE_BUTTON ? app.websiteBody : app.body}
          </T>
        )}
        {WEBSITE_SUBSCRIBE_BUTTON ? <Button label={app.website} icon="external-link" onPress={openWebsite} /> : null}
        <Button label={app.contact} variant="secondary" icon="message-circle" onPress={() => router.push('/contact')} />
        <Button label={app.back} variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} />
      </Card>
    </Screen>
  );
}
