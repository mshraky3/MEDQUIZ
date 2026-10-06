import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCommon } from '@/i18n';
import { api } from '@/lib/api';
import { timeAgo } from '@/lib/stats';
import { appRouteForWebPath } from '@/lib/webPaths';
import { colors } from '@/theme';
import { Button, Card, EmptyState, Row, Screen, ScreenHeader, Spinner, T } from '@/ui';

type Notification = { id: number; title: string; body?: string | null; ctaUrl?: string | null; read: boolean; createdAt: string };

/**
 * The in-app milestone feed. Only ever shows things that actually happened to
 * this student (a goal reached, a streak milestone, a subscription about to
 * lapse). It is not a marketing channel, which is what keeps it worth opening.
 */
export default function NotificationsScreen() {
  const t = useCommon().notifications;
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.get('/api/notifications', { params: { limit: 30 } });
      if (data?.success) {
        setItems(data.notifications || []);
        setUnread(data.unreadCount || 0);
      }
    } catch {
      /* the feed is ambient: a failure leaves it empty */
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const markAllRead = async () => {
    // Optimistic: the badge clears immediately, because waiting on a round trip
    // to acknowledge your own tap reads as a broken button.
    setUnread(0);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.post('/api/notifications/read', {});
    } catch {
      /* ignore */
    }
  };

  const openItem = async (n: Notification) => {
    if (!n.read) {
      setUnread((u) => Math.max(0, u - 1));
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      try {
        await api.post('/api/notifications/read', { id: n.id });
      } catch {
        /* ignore */
      }
    }
    const target = appRouteForWebPath(n.ctaUrl);
    if (target) router.push(target);
  };

  return (
    <Screen header={<ScreenHeader title={t.title} />}>
      {loading ? (
        <Spinner fullScreen />
      ) : items.length === 0 ? (
        <EmptyState icon="bell" title={t.title} body={t.empty} />
      ) : (
        <View style={{ gap: 12 }}>
          {unread > 0 ? <Button label={t.markAllRead} variant="secondary" size="sm" full={false} onPress={() => void markAllRead()} /> : null}
          {items.map((n) => (
            <TouchableOpacity key={n.id} activeOpacity={0.85} onPress={() => void openItem(n)} accessibilityRole="button">
              <Card pad={14} style={{ gap: 4, borderColor: n.read ? colors.border : colors.primary, backgroundColor: n.read ? colors.surface : colors.infoBg }}>
                <Row gap={8}>
                  {!n.read ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} /> : null}
                  <T weight="bold" size={14} style={{ flex: 1 }}>
                    {n.title}
                  </T>
                </Row>
                {n.body ? (
                  <T size={13} color={colors.textMedium}>
                    {n.body}
                  </T>
                ) : null}
                <T size={11} color={colors.textLight}>
                  {timeAgo(n.createdAt, t)}
                </T>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Screen>
  );
}
