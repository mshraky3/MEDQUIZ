import React, { useCallback, useState } from 'react';
import { Linking, View } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { Href, router, useFocusEffect } from 'expo-router';
import { TELEGRAM_CHANNEL_URL } from '@/config';
import { formatDate, useApp, useCommon, useLang } from '@/i18n';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { colors, radius } from '@/theme';
import { Button, Card, Chevron, Divider, Icon, ListRow, Row, T } from '@/ui';
import { LanguageToggle } from './LanguageToggle';
import { TabScreen } from './TabScreen';

/**
 * Everything that is not the study loop: account, plans, notifications, the
 * information pages, the language and signing out. The website keeps these in
 * its navbar menu and footer.
 */
export default function MoreScreen() {
  const { user, signOut } = useAuth();
  const common = useCommon();
  const app = useApp();
  const { lang } = useLang();
  const [hasGroup, setHasGroup] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateReady, setUpdateReady] = useState(false);
  const [checking, setChecking] = useState(false);

  // "My group" only means something for someone who owns a group; for anyone
  // else it would land on the buy pitch, which reads as broken from a menu item
  // named "my group".
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      api
        .get('/api/groups/mine')
        .then((data) => {
          if (!cancelled) setHasGroup(Boolean(data?.groups?.length));
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const go = (href: Href) => () => router.push(href);

  const logout = async () => {
    setLoggingOut(true);
    await signOut();
    // The route guard returns the app to the welcome screen.
  };

  const checkUpdates = async () => {
    setChecking(true);
    setUpdateMsg('');
    try {
      if (!Updates.isEnabled) {
        setUpdateMsg(app.more.upToDate);
        return;
      }
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        await Updates.fetchUpdateAsync();
        setUpdateReady(true);
        setUpdateMsg(app.more.updateReady);
      } else {
        setUpdateMsg(app.more.upToDate);
      }
    } catch {
      setUpdateMsg(app.offline);
    } finally {
      setChecking(false);
    }
  };

  const expiry =
    user?.subscription_status === 'active' && user.subscription_expiry_date && new Date(user.subscription_expiry_date).getTime() > Date.now()
      ? common.nav.subscriptionUntil(formatDate(user.subscription_expiry_date, lang))
      : null;

  const section = (title: string, rows: React.ReactNode[]) => (
    <View style={{ gap: 8 }}>
      <T weight="bold" size={13} color={colors.textLight}>
        {title}
      </T>
      <Card pad={0} style={{ overflow: 'hidden' }}>
        {rows.filter(Boolean).map((row, i, all) => (
          <View key={i}>
            {row}
            {i < all.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </Card>
    </View>
  );

  const arrow = <Chevron />;

  return (
    <TabScreen title={app.more.title} contentStyle={{ gap: 18 }}>
      <Card style={{ gap: 6 }}>
        <Row gap={12}>
          <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="user" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <T size={12} color={colors.textLight}>
              {app.more.signedInAs}
            </T>
            <T weight="bold" size={14} ltr numberOfLines={1}>
              {user?.username}
            </T>
          </View>
        </Row>
        {expiry ? (
          <View style={{ alignSelf: 'flex-start', backgroundColor: colors.successBg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
            <T size={12} weight="bold" color={colors.success}>
              {expiry}
            </T>
          </View>
        ) : null}
      </Card>

      {section(app.more.study, [
        <ListRow key="acc" icon="user" title={app.more.account} subtitle={app.more.accountHint} onPress={go('/account')} right={arrow} />,
        hasGroup ? <ListRow key="grp" icon="users" title={app.more.group} subtitle={app.more.groupHint} onPress={go('/groups')} right={arrow} /> : null,
        <ListRow key="sub" icon="rocket" title={app.more.subscribe} subtitle={app.more.subscribeHint} onPress={go('/subscribe')} right={arrow} />,
        !hasGroup ? <ListRow key="grps" icon="users" title={app.more.groups} onPress={go('/groups')} right={arrow} /> : null,
        <ListRow key="not" icon="bell" title={app.more.notifications} onPress={go('/notifications')} right={arrow} />,
      ])}

      {section(app.more.help, [
        <ListRow key="guides" icon="book-open" title={common.nav.guides} onPress={go('/guides')} right={arrow} />,
        <ListRow key="free" icon="help-circle" title={common.footer.freeQuestions} onPress={go('/questions')} right={arrow} />,
        <ListRow key="pp" icon="folder" title={common.footer.collections} onPress={go('/past-papers')} right={arrow} />,
        <ListRow key="ss" icon="star" title={common.footer.successStories} onPress={go('/success-stories')} right={arrow} />,
        <ListRow key="faq" icon="message-circle" title={common.nav.faq} onPress={go('/faq')} right={arrow} />,
        <ListRow key="about" icon="info" title={common.nav.about} onPress={go('/about')} right={arrow} />,
        <ListRow key="sug" icon="lightbulb" title={common.footer.suggestions} onPress={go('/suggestions')} right={arrow} />,
        <ListRow key="contact" icon="mail" title={common.nav.contact} onPress={go('/contact')} right={arrow} />,
        <ListRow key="tg" icon="send" title={common.footer.telegram} onPress={() => Linking.openURL(TELEGRAM_CHANNEL_URL).catch(() => {})} right={<Icon name="external-link" size={16} color={colors.textLight} />} />,
      ])}

      {section(app.more.legal, [
        <ListRow key="terms" icon="file-text" title={common.footer.terms} onPress={go('/terms')} right={arrow} />,
        <ListRow key="priv" icon="shield-check" title={common.footer.privacy} onPress={go('/privacy')} right={arrow} />,
        <ListRow key="ref" icon="refresh" title={common.footer.refund} onPress={go('/refund-policy')} right={arrow} />,
      ])}

      <Card style={{ gap: 12 }}>
        <Row justify="space-between">
          <View>
            <T weight="bold" size={15}>
              {app.more.language}
            </T>
            <T size={12} color={colors.textLight}>
              {app.more.languageName}
            </T>
          </View>
          <LanguageToggle />
        </Row>
        <Divider />
        <Row justify="space-between">
          <View>
            <T weight="bold" size={15}>
              {app.more.updates}
            </T>
            <T size={12} color={colors.textLight}>
              {app.more.version} <T size={12} color={colors.textLight} ltr>{Constants.expoConfig?.version || ''}</T>
            </T>
          </View>
          <Button
            label={app.more.checkUpdates}
            variant="secondary"
            size="sm"
            full={false}
            loading={checking}
            onPress={() => void checkUpdates()}
          />
        </Row>
        {updateMsg ? (
          <Row gap={8} align="flex-start" style={{ backgroundColor: colors.surface2, borderRadius: radius.md, padding: 10 }}>
            <Icon name={updateReady ? 'refresh' : 'check-circle'} size={16} color={colors.primary} />
            <T size={13} style={{ flex: 1 }}>
              {updateMsg}
            </T>
          </Row>
        ) : null}
        {updateReady ? <Button label={app.more.restart} icon="refresh" onPress={() => void Updates.reloadAsync()} /> : null}
      </Card>

      <Button label={loggingOut ? app.more.loggingOut : app.more.logout} icon="log-out" variant="secondary" loading={loggingOut} onPress={() => void logout()} />
    </TabScreen>
  );
}
