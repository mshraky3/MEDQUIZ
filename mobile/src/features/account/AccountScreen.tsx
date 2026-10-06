import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { formatDate, useCopy, useLang } from '@/i18n';
import accountCopy from '@/i18n/copy/account.js';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { specialtiesOf, userTrack } from '@/lib/tracks';
import { colors, radius } from '@/theme';
import { Button, Card, Icon, Notice, ProgressBar, Row, Screen, ScreenHeader, Spinner, T } from '@/ui';
import { ExamDateCard, GoalCard, StreakCard } from './StudyPlan';

/**
 * /account: the one place that answers "what do I actually have?" Everything
 * shown comes from the server on load: the stored login snapshot goes stale the
 * moment a quiz is submitted, and a page whose job is to state facts about the
 * account cannot show a stale one. Since no plan auto-renews, this page is also
 * the only reminder anyone gets that a term is running out.
 */
export default function AccountScreen() {
  const { user, refreshSubscription } = useAuth();
  const t = useCopy(accountCopy);
  const { lang } = useLang();

  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sub, setSub] = useState<any>(null);
  const [allowance, setAllowance] = useState(40);
  const [hasGroup, setHasGroup] = useState(false);
  // What they actually bought, from the most recent paid payment (null for an
  // account that has never paid).
  const [purchase, setPurchase] = useState<any>(null);
  // The study-plan cards' data: allowed to stay null on failure, because this
  // page's actual job is stating what the account has.
  const [content, setContent] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [subRes, groupRes] = await Promise.all([
        api.get(`/api/user-subscription/${user.id}`),
        // A missing group is the normal case, not an error.
        api.get('/api/groups/mine').catch(() => null),
      ]);
      setSub({ ...subRes.user, enforcement: subRes.enforcement });
      setAllowance(subRes.allowance || 40);
      setPurchase(subRes.purchase || null);
      setHasGroup(Boolean(groupRes?.groups?.length));
      setState('ready');
      void refreshSubscription(true);
    } catch {
      setState('error');
    }
    const [contentRes, streakRes] = await Promise.allSettled([api.get('/api/track-content-status'), api.get(`/user-streaks/${user.id}`)]);
    if (contentRes.status === 'fulfilled') setContent(contentRes.value);
    if (streakRes.status === 'fulfilled') setStreak(streakRes.value);
  }, [user?.id, refreshSubscription]);

  useEffect(() => {
    void load();
  }, [load]);

  // An admin-granted ("managed") account is time-limited, so the grant can
  // lapse; once it has, the account is an ordinary free-tier one and is shown
  // as such.
  const adminGrantExpiry = sub?.is_admin_created ? sub.subscription_expiry_date : null;
  const adminGrantLive = Boolean(sub?.is_admin_created) && (!adminGrantExpiry || new Date(adminGrantExpiry).getTime() > Date.now());

  const statusLabel = () => {
    if (!sub) return '';
    if (adminGrantLive) return t.statusAdmin;
    if (sub.grandfathered_at) return t.statusLegacy;
    // subscription_status stays 'active' after the expiry passes (nothing
    // rewrites the column), so the date has to be checked here too.
    const stillValid = sub.subscription_expiry_date ? new Date(sub.subscription_expiry_date).getTime() > Date.now() : false;
    if (sub.subscription_status === 'active' && stillValid) return sub.account_type === 'group_seat' ? t.statusGroupSeat : t.statusActive;
    return t.statusFree;
  };

  // freeQuestionsRemaining is null for anyone with unlimited access, which is
  // exactly the test for "is this a paying/exempt account".
  const isFree = sub != null && typeof sub.freeQuestionsRemaining === 'number';
  const isPaid = sub != null && !isFree && sub.subscription_status === 'active';
  // "Legacy" means access with no end date at all. A managed account with a real
  // expiry is NOT that: it needs the end date and the renew button.
  const isLegacy = sub != null && (sub.grandfathered_at || (sub.is_admin_created && !sub.subscription_expiry_date));

  const specialties = specialtiesOf(userTrack(user));

  const fact = (label: string, value: React.ReactNode) => (
    <View key={label} style={{ gap: 2 }}>
      <T size={12} color={colors.textLight}>
        {label}
      </T>
      {typeof value === 'string' ? <T weight="semibold">{value}</T> : value}
    </View>
  );

  return (
    <Screen header={<ScreenHeader title={t.heading} />} contentStyle={{ gap: 16 }}>
      {state === 'loading' ? (
        <Spinner fullScreen label={t.loading} />
      ) : state === 'error' ? (
        <>
          <Notice kind="error">{t.loadError}</Notice>
          <Button label={t.contactCta} variant="secondary" onPress={() => router.push('/contact')} />
        </>
      ) : sub ? (
        <>
          <Card style={{ gap: 14 }}>
            <T weight="extrabold" size={17}>
              {t.sectionHeading}
            </T>
            {fact(
              t.emailLabel,
              <T weight="semibold" ltr>
                {sub.email || sub.username}
              </T>
            )}
            {fact(
              t.statusLabel,
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: isPaid ? colors.successBg : isLegacy ? colors.infoBg : colors.surfaceTint,
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                }}
              >
                <T weight="bold" size={13} color={isPaid ? colors.success : isLegacy ? colors.primary : colors.textMedium}>
                  {statusLabel()}
                </T>
              </View>
            )}
            {/* Which plan, not just "you are subscribed". */}
            {purchase
              ? fact(
                  t.planLabel,
                  <T weight="semibold">
                    {(t.planNames as Record<string, string>)[purchase.planId] || t.planUnknown}
                    <T size={13} color={colors.textLight}>{`  ${t.paidAmount(purchase.amountSar, purchase.currency)}`}</T>
                  </T>
                )
              : null}
            {purchase?.startedAt ? fact(t.startedLabel, formatDate(purchase.startedAt, lang)) : null}
            {isPaid && sub.subscription_expiry_date
              ? fact(
                  t.endsLabel,
                  <T weight="semibold">
                    {formatDate(sub.subscription_expiry_date, lang)}
                    {typeof sub.daysRemaining === 'number' ? <T size={13} color={colors.textLight}>{`  ${t.daysLeft(sub.daysRemaining)}`}</T> : null}
                  </T>
                )
              : null}

            {/* The promise, stated where it matters most. */}
            {isLegacy ? (
              <T size={13} color={colors.textMedium}>
                {t.legacyNote}
              </T>
            ) : adminGrantLive ? (
              <T size={13} color={colors.textMedium}>
                {t.adminGrantNote}
              </T>
            ) : (
              <Row gap={8} align="flex-start" style={{ backgroundColor: colors.successBg, borderRadius: radius.md, padding: 10 }}>
                <Icon name="shield-check" size={16} color={colors.success} />
                <T size={13} color={colors.success} style={{ flex: 1 }}>
                  {t.noAutoRenew}
                </T>
              </Row>
            )}
          </Card>

          {isFree ? (
            <Card style={{ gap: 10 }}>
              <T weight="extrabold" size={17}>
                {t.freeTitle}
              </T>
              <ProgressBar pct={Math.round(((allowance - sub.freeQuestionsRemaining) / allowance) * 100)} />
              <T size={14} weight="semibold">
                {t.freeRemaining(sub.freeQuestionsRemaining, allowance)}
              </T>
              <T size={13} color={colors.textMedium}>
                {sub.freeQuestionsRemaining <= 0 ? t.freeSpentNote : t.freeLeftNote}
              </T>
            </Card>
          ) : null}

          <View style={{ gap: 12 }}>
            <T weight="extrabold" size={17}>
              {t.studyPlanHeading}
            </T>
            <ExamDateCard questionsRemaining={content?.totalQuestions || 0} />
            <StreakCard streak={streak} onStartToday={() => router.replace('/(tabs)')} />
            <GoalCard specialties={specialties} sources={content?.selectableSources || []} />
          </View>

          <View style={{ gap: 10 }}>
            {!isLegacy ? <Button label={isPaid ? t.renewCta : t.subscribeCta} size="lg" onPress={() => router.push('/subscribe')} /> : null}
            <Button label={hasGroup ? t.groupCta : t.groupBuyCta} icon="users" variant="secondary" onPress={() => router.push('/groups')} />
            <Button label={t.contactCta} icon="message-circle" variant="secondary" onPress={() => router.push('/contact')} />
            <Button label={t.backToQuizzes} variant="ghost" onPress={() => router.replace('/(tabs)')} />
          </View>
        </>
      ) : null}
    </Screen>
  );
}
