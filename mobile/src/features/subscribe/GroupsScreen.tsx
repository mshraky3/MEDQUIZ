import React, { useEffect, useState } from 'react';
import { Share, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { formatDate, useApp, useCopy, useLang } from '@/i18n';
import groupsCopy from '@/i18n/copy/groups.js';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { colors, radius } from '@/theme';
import { Button, Card, Icon, Notice, Row, Screen, ScreenHeader, Spinner, T, Link } from '@/ui';
import type { Plan } from './checkout';

type GroupPlan = Plan & { compareToHalalas?: number | null };
type Seat = { seatIndex: number; isYou: boolean; claimed: boolean; claimedAt?: string | null; link?: string | null };
type Group = { id: number; seats: number; months: number; expiresAt: string; expired: boolean; seatList: Seat[] };

/**
 * What one person saves by joining the group instead of buying alone.
 * `compareToHalalas` is the individual plan of the SAME length, sent by the
 * server so this screen never has to pick which plan to compare against.
 * Returns null when no comparison came, or when the group plan is not actually
 * cheaper per seat: the card then says nothing rather than inventing a saving.
 */
export function savingsFor(plan: Pick<GroupPlan, 'compareToHalalas' | 'seats' | 'priceHalalas'> | null | undefined) {
  const solo = Number(plan?.compareToHalalas);
  const seats = Number(plan?.seats);
  const total = Number(plan?.priceHalalas);
  if (!solo || !seats || !total) return null;
  const perSeat = total / seats;
  if (perSeat >= solo) return null;
  return { perSeat: Math.round(perSeat / 100), solo: Math.round(solo / 100), percent: Math.round((1 - perSeat / solo) * 100) };
}

/**
 * /groups: buy a group subscription, then manage its invite links. One screen
 * for both halves of the story: before paying, a buyer sees the seat
 * placeholders they will get; after paying, the same rows fill with real links.
 * The owner never sees who claimed a seat: the API does not return it.
 * Readable WITHOUT a session, like the website: a guest gets the plan cards and
 * only meets the login wall when they choose to buy.
 */
export default function GroupsScreen() {
  const { user, token } = useAuth();
  const t = useCopy(groupsCopy);
  const app = useApp();
  const { lang } = useLang();
  const signedIn = !!(user && token);

  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [plans, setPlans] = useState<GroupPlan[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [copiedSeat, setCopiedSeat] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Signed in: the private view, which also carries any group they own.
    // Signed out: the public plan ladder only (same shape, no `groups`).
    const request = signedIn ? api.get('/api/groups/mine') : api.get('/api/payment/config', { params: { kind: 'group' }, auth: false });
    request
      .then((data) => {
        if (cancelled) return;
        setPlans(data.plans || []);
        setGroups(data.groups || []);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  const copyLink = async (link: string, seatIndex: number) => {
    try {
      await Clipboard.setStringAsync(link);
      setCopiedSeat(seatIndex);
      setTimeout(() => setCopiedSeat((c) => (c === seatIndex ? null : c)), 2000);
    } catch {
      /* The link is shown as selectable text beside the button, so a denied clipboard is never a dead end. */
    }
  };

  const shareLink = (link: string) => {
    void Share.share({ message: link }).catch(() => {});
  };

  const buy = (planId: string) => {
    // A guest picking a plan is sent to sign in, not silently to a wall.
    if (!signedIn) {
      router.push('/login');
      return;
    }
    router.push({ pathname: '/subscribe', params: { kind: 'group', plan: planId } });
  };

  const showBuy = state === 'ready' && groups.length === 0;

  return (
    <Screen header={<ScreenHeader title={t.pageTitle} onBack={() => (router.canGoBack() ? router.back() : router.replace(signedIn ? '/(tabs)' : '/welcome'))} />}>
      {!(state === 'ready' && groups.length > 0) ? (
        <View style={{ gap: 6 }}>
          <View style={{ alignSelf: 'flex-start', backgroundColor: colors.infoBg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
            <T weight="bold" size={12} color={colors.primary}>
              {t.pill}
            </T>
          </View>
          <T weight="extrabold" size={24}>
            {t.introTitle}
          </T>
          <T color={colors.textMedium}>{t.introBody}</T>
        </View>
      ) : null}

      {state === 'loading' ? <Spinner fullScreen label={t.loading} /> : null}
      {state === 'error' ? <Notice kind="error">{t.loadError}</Notice> : null}

      {showBuy ? (
        <View style={{ gap: 14 }}>
          <T weight="extrabold" size={18}>
            {t.chooseTitle}
          </T>
          {plans.map((plan) => {
            const saving = savingsFor(plan);
            const seats = plan.seats || 1;
            return (
              <Card key={plan.id} style={{ gap: 10 }}>
                <View style={{ gap: 2 }}>
                  <T weight="extrabold" size={18}>
                    {t.seatsLabel(seats)}
                  </T>
                  <Row gap={8} align="flex-end">
                    {(plan.compareAtHalalas || 0) > plan.priceHalalas ? (
                      <T size={14} color={colors.textLight} ltr style={{ textDecorationLine: 'line-through' }}>
                        {(plan.compareAtHalalas || 0) / 100}
                      </T>
                    ) : null}
                    <T weight="extrabold" size={28} color={colors.primary}>
                      {t.priceWithCurrency(plan.priceHalalas / 100)}
                    </T>
                  </Row>
                  <T size={13} color={colors.textMedium}>
                    {t.monthsLabel(plan.months)} · {t.perSeat(Math.round(plan.priceHalalas / seats / 100))}
                  </T>
                  {saving ? (
                    <T size={13} weight="semibold" color={colors.success}>
                      {t.compare(t.priceWithCurrency(saving.perSeat), t.priceWithCurrency(saving.solo), saving.percent)}
                    </T>
                  ) : null}
                </View>

                {/* The placeholders: seat 1 is always "you", so a buyer sees a 3-seat group means 2 links, not 3. */}
                <T size={12} color={colors.textLight}>
                  {t.previewNote}
                </T>
                <View style={{ gap: 6 }}>
                  {Array.from({ length: seats }, (_, i) => i + 1).map((n) => (
                    <Row
                      key={n}
                      gap={10}
                      style={{
                        backgroundColor: n === 1 ? colors.infoBg : colors.surface2,
                        borderRadius: radius.md,
                        padding: 10,
                      }}
                    >
                      <Icon name={n === 1 ? 'user' : 'link'} size={15} color={n === 1 ? colors.primary : colors.textMedium} />
                      <T size={13} style={{ flex: 1 }}>
                        {n === 1 ? t.seatYouPreview : t.seatLinkPreview(n)}
                      </T>
                    </Row>
                  ))}
                </View>

                <Button
                  label={signedIn ? t.buyCta(t.priceWithCurrency(plan.priceHalalas / 100)) : t.buyCtaGuest(t.priceWithCurrency(plan.priceHalalas / 100))}
                  size="lg"
                  onPress={() => buy(plan.id)}
                />
              </Card>
            );
          })}
          <T size={12} color={colors.textLight} align="center">
            {t.noAutoRenew}
          </T>
          {!signedIn ? (
            <Row gap={6} wrap justify="center">
              <T size={13} color={colors.textMedium}>
                {t.guestNote}
              </T>
              <Link label={t.guestSignup} onPress={() => router.push('/signup')} size={13} />
            </Row>
          ) : null}
        </View>
      ) : null}

      {state === 'ready'
        ? groups.map((group) => {
            const used = group.seatList.filter((s) => s.claimed).length;
            return (
              <View key={group.id} style={{ gap: 12 }}>
                <T weight="extrabold" size={20}>
                  {t.yourGroupTitle}
                </T>
                {group.expired ? (
                  <Notice kind="warning">
                    <T weight="bold" size={14} color={colors.warning}>
                      {t.expiredTitle}
                    </T>
                    <T size={13} color={colors.warning}>
                      {t.expiredBody}
                    </T>
                  </Notice>
                ) : (
                  <T size={13} color={colors.textMedium}>
                    {t.endsOn(formatDate(group.expiresAt, lang))} · {t.seatsUsed(used, group.seats)}
                  </T>
                )}

                {group.seatList.map((seat) => (
                  <Card key={seat.seatIndex} pad={12} style={{ gap: 8, borderColor: seat.isYou ? colors.primary : colors.border }}>
                    <Row justify="space-between" gap={8}>
                      <Row gap={8}>
                        <Icon name={seat.isYou ? 'user' : seat.claimed ? 'check' : 'link'} size={15} color={seat.claimed || seat.isYou ? colors.success : colors.primary} />
                        <T weight="bold" size={14}>
                          {seat.isYou ? t.seatYou : t.seatNumber(seat.seatIndex)}
                        </T>
                      </Row>
                      {seat.isYou ? (
                        <T size={12} color={colors.success} weight="semibold">
                          {t.seatActive}
                        </T>
                      ) : seat.claimed ? (
                        <T size={12} color={colors.success} weight="semibold">
                          {seat.claimedAt ? t.seatUsedOn(formatDate(seat.claimedAt, lang)) : t.seatActive}
                        </T>
                      ) : !seat.link ? (
                        <T size={12} color={colors.textLight}>
                          {t.seatAvailable}
                        </T>
                      ) : null}
                    </Row>
                    {!seat.isYou && !seat.claimed && seat.link ? (
                      <View style={{ gap: 8 }}>
                        {/* LTR so a URL never renders reversed inside the Arabic screen. */}
                        <View style={{ backgroundColor: colors.surface2, borderRadius: radius.md, padding: 10 }}>
                          <T ltr size={12} selectable color={colors.textMedium}>
                            {seat.link}
                          </T>
                        </View>
                        <Row gap={8}>
                          <View style={{ flex: 1 }}>
                            <Button
                              label={copiedSeat === seat.seatIndex ? t.copied : t.copy}
                              icon={copiedSeat === seat.seatIndex ? 'check' : 'copy'}
                              variant="secondary"
                              size="sm"
                              onPress={() => void copyLink(seat.link!, seat.seatIndex)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Button label={app.share} icon="share" size="sm" onPress={() => shareLink(seat.link!)} />
                          </View>
                        </Row>
                      </View>
                    ) : null}
                  </Card>
                ))}

                {!group.expired ? (
                  <T size={13} color={colors.textMedium}>
                    {t.shareHint}
                  </T>
                ) : null}
                <T size={12} color={colors.textLight}>
                  {t.privacyNote}
                </T>
              </View>
            );
          })
        : null}

      {state === 'ready' ? (
        <Button
          label={signedIn ? t.backToHome : t.backToIndividual}
          variant="ghost"
          onPress={() => router.replace(signedIn ? '/(tabs)' : '/welcome')}
        />
      ) : null}
    </Screen>
  );
}
