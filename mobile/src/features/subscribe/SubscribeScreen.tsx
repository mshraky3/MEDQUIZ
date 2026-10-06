import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { router, useLocalSearchParams } from 'expo-router';
import { IN_APP_CHECKOUT_ENABLED, SITE_URL } from '@/config';
import { useApp, useCopy, useLang } from '@/i18n';
import supportCopy from '@/i18n/copy/support.js';
import { api } from '@/lib/api';
import { priceLadder, trackFunnel } from '@/lib/analytics';
import { useAuth } from '@/lib/auth';
import { colors, radius } from '@/theme';
import { Button, Card, Icon, Notice, Row, Screen, ScreenHeader, Spinner, T } from '@/ui';
import { CheckoutWebView } from './CheckoutWebView';
import {
  CallbackResult,
  PaymentConfig,
  Plan,
  choosePlan,
  isCheckoutAvailable,
  isTestKey,
  planOffer,
} from './checkout';

type Status = 'loading' | 'ready' | 'blocked' | 'error' | 'unavailable';

/**
 * /subscribe: the plan picker and Moyasar's card form. The individual ladder is
 * the default; ?kind=group&plan=group_3 is how the groups page hands off here.
 * A group plan never surfaces on its own, because this page says nothing about
 * the invite links a group buyer is really paying for.
 */
export default function SubscribeScreen() {
  const { user } = useAuth();
  const t = useCopy(supportCopy).subscribe;
  const app = useApp();
  const { lang } = useLang();
  const params = useLocalSearchParams<{ kind?: string; plan?: string; reason?: string }>();
  const isGroup = params.kind === 'group';
  const kind = isGroup ? 'group' : 'individual';
  const requestedPlan = typeof params.plan === 'string' ? params.plan : null;

  const [status, setStatus] = useState<Status>('loading');
  const [formStatus, setFormStatus] = useState<'loading' | 'ready' | 'blocked'>('loading');
  const [cfg, setCfg] = useState<PaymentConfig | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    trackFunnel('subscribe_view', { reason: params.reason || null });
    let cancelled = false;
    (async () => {
      try {
        const config = await api.get<PaymentConfig>('/api/payment/config', { params: { kind }, auth: false });
        if (cancelled) return;
        if (!isCheckoutAvailable(config)) {
          setStatus('unavailable');
          return;
        }
        setCfg(config);
        trackFunnel('subscribe_prices_shown', {
          kind,
          ladder: priceLadder(config.plans),
          currency: config.currency || 'SAR',
          offer: config.offer?.active ? config.offer.id : null,
        });
        setSelectedId(choosePlan(config.plans!, requestedPlan, t.recommendedPlan).id);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
    // The ladder is fetched once per visit; the kind never changes in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  // Arriving again from /groups with a different ?plan= must move the picker.
  useEffect(() => {
    if (requestedPlan && cfg?.plans?.some((p) => p.id === requestedPlan)) setSelectedId(requestedPlan);
  }, [requestedPlan, cfg]);

  const plans: Plan[] = cfg?.plans || [];
  const selected = plans.find((p) => p.id === selectedId) || null;
  const selectedOffer = planOffer(selected);
  const currency = cfg?.currency || 'SAR';

  const selectPlan = (id: string) => {
    if (id === selectedId) return;
    trackFunnel('subscribe_plan_select', { plan: id, amountHalalas: plans.find((p) => p.id === id)?.priceHalalas ?? null });
    setSelectedId(id);
    setFormStatus('loading');
  };

  const init = useMemo(() => {
    if (!selected || !cfg?.publishableKey || !user?.id) return null;
    const planLabel = t.plans[selected.id as keyof typeof t.plans]?.label || selected.id;
    return {
      amount: selected.priceHalalas,
      currency,
      description: t.paymentDescription(user.id, planLabel),
      publishableKey: cfg.publishableKey,
      callbackUrl: `${SITE_URL}/payment/callback${selected.kind === 'group' ? '?next=/groups' : ''}`,
      accountId: user.id,
      planId: selected.id,
      seats: selected.seats || 1,
      lang,
    };
  }, [selected, cfg?.publishableKey, user?.id, currency, lang, t]);

  const onResult = (result: CallbackResult) => {
    router.replace({
      pathname: '/payment/callback',
      params: {
        id: result.id || '',
        status: result.status || '',
        message: result.message || '',
        next: result.next || '',
      },
    });
  };

  const showSeptember = (user?.track || 'medical') !== 'nursing';
  const allowanceSpent = params.reason === 'free_allowance_exhausted' || user?.free_questions_remaining === 0;
  const riyals = selected ? selected.priceHalalas / 100 : null;
  const perks = (isGroup ? t.groupPerks : t.perks) as string[];

  const header = <ScreenHeader title={isGroup ? t.groupPill : t.pill} />;

  if (status === 'loading') {
    return (
      <Screen header={header}>
        <Spinner fullScreen label={t.loadingForm} />
      </Screen>
    );
  }

  if (status === 'unavailable' || status === 'error') {
    return (
      <Screen header={header}>
        <Card style={{ gap: 12, alignItems: 'center' }}>
          <Icon name={status === 'error' ? 'wifi-off' : 'info'} size={34} color={colors.primary} />
          <T color={colors.textMedium} align="center">
            {status === 'error' ? t.loadError : t.blocked}
          </T>
          <Button label={t.reload} icon="refresh" onPress={() => router.replace('/subscribe')} />
          <Button label={t.contactUs} variant="secondary" onPress={() => router.push('/contact')} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen header={header} contentStyle={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <T weight="extrabold" size={24}>
          {isGroup ? t.groupTitle : allowanceSpent ? t.allowanceSpentTitle : t.title}
        </T>
        <T color={colors.textMedium}>{isGroup ? t.groupBody : allowanceSpent ? t.allowanceSpentBody : t.body}</T>
      </View>

      {/* The September 2026 recall set is SMLE (medicine) only. */}
      {showSeptember ? (
        <Row gap={10} align="flex-start" style={{ backgroundColor: colors.infoBg, borderRadius: radius.lg, padding: 12 }}>
          <View style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 }}>
            <T weight="bold" size={10} color={colors.white}>
              {t.newSetTag}
            </T>
          </View>
          <View style={{ flex: 1 }}>
            <T weight="bold" size={13} color={colors.primary}>
              {t.newSetTitle}
            </T>
            <T size={12} color={colors.primary}>
              {t.newSetBody}
            </T>
          </View>
        </Row>
      ) : null}

      <Row wrap gap={10} align="stretch">
        {plans.map((plan) => {
          const copy = t.plans[plan.id as keyof typeof t.plans] as { label: string; period: string; badge?: string } | undefined;
          if (!copy) return null;
          const perMonth = Math.round(plan.priceHalalas / plan.months / 100);
          const offer = planOffer(plan);
          const on = plan.id === selectedId;
          return (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.85}
              onPress={() => selectPlan(plan.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              style={{
                flexGrow: 1,
                flexBasis: '30%',
                minWidth: 100,
                borderRadius: radius.lg,
                borderWidth: 2,
                borderColor: on ? colors.primary : colors.border,
                backgroundColor: on ? colors.infoBg : colors.surface,
                padding: 12,
                gap: 3,
                alignItems: 'center',
              }}
            >
              {offer ? (
                <View style={{ backgroundColor: colors.error, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 }}>
                  <T weight="bold" size={10} color={colors.white}>
                    {t.offerBadge(offer.pct)}
                  </T>
                </View>
              ) : copy.badge ? (
                <View style={{ backgroundColor: colors.successBg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 }}>
                  <T weight="bold" size={10} color={colors.success}>
                    {copy.badge}
                  </T>
                </View>
              ) : null}
              <T weight="bold" size={14} align="center">
                {copy.label}
              </T>
              <Row gap={6}>
                {offer ? (
                  <T size={13} color={colors.textLight} ltr style={{ textDecorationLine: 'line-through' }}>
                    {offer.was}
                  </T>
                ) : null}
                <T weight="extrabold" size={22} color={colors.primary} ltr>
                  {plan.priceHalalas / 100}
                </T>
              </Row>
              {(plan.seats || 1) > 1 ? (
                <T size={11} color={colors.textLight} align="center">
                  {t.perSeat(Math.round(plan.priceHalalas / (plan.seats || 1) / 100))}
                </T>
              ) : plan.months > 1 ? (
                <T size={11} color={colors.textLight} align="center">
                  {t.perMonth(perMonth)}
                </T>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </Row>

      <Card pad={14} style={{ alignItems: 'center', gap: 2 }}>
        <Row gap={6} align="flex-end">
          {selectedOffer ? (
            <T size={16} color={colors.textLight} ltr style={{ textDecorationLine: 'line-through', marginBottom: 6 }}>
              {selectedOffer.was}
            </T>
          ) : null}
          <T weight="extrabold" size={40} color={colors.primary} ltr style={{ lineHeight: 48 }}>
            {riyals != null ? riyals : '—'}
          </T>
          <T weight="bold" size={14} color={colors.textMedium} style={{ marginBottom: 8 }}>
            {t.currency}
          </T>
        </Row>
        <T size={13} color={colors.textLight}>
          {selected ? (t.plans[selected.id as keyof typeof t.plans] as { period: string } | undefined)?.period : ''}
        </T>
        {selectedOffer ? (
          <T size={12} color={colors.success} weight="semibold">
            {t.saveNote(selectedOffer.saved, selectedOffer.pct)}
          </T>
        ) : null}
      </Card>

      {isTestKey(cfg?.publishableKey) ? (
        <Notice kind="warning">
          {`${t.testBannerBefore} 4111 1111 1111 1111 ${t.testBannerAfter}`}
        </Notice>
      ) : null}

      {/* The card form. Moyasar owns this page; the app never sees card data. */}
      {IN_APP_CHECKOUT_ENABLED && Platform.OS !== 'web' && init ? (
        <View style={{ gap: 10 }}>
          {formStatus === 'loading' ? (
            <Row gap={8} justify="center">
              <Spinner size="sm" />
              <T size={13} color={colors.textLight}>
                {t.loadingForm}
              </T>
            </Row>
          ) : null}
          {formStatus === 'blocked' ? (
            <View style={{ gap: 10 }}>
              <Notice kind="error">{t.blocked}</Notice>
              <Button label={t.reload} icon="refresh" onPress={() => { setFormStatus('loading'); setAttempt((n) => n + 1); }} />
            </View>
          ) : null}
          <View style={{ display: formStatus === 'blocked' ? 'none' : 'flex' }}>
            <CheckoutWebView
              // A new key per plan: the form is rebuilt from scratch, so amount,
              // description and metadata always move together.
              key={`${selected!.id}:${attempt}`}
              init={init}
              onReady={() => setFormStatus('ready')}
              onBlocked={() => setFormStatus('blocked')}
              onPayClick={() => trackFunnel('subscribe_pay_click', { amountHalalas: selected!.priceHalalas, plan: selected!.id })}
              onResult={onResult}
            />
          </View>
        </View>
      ) : (
        <Card style={{ gap: 10 }}>
          <T color={colors.textMedium}>
            {Platform.OS === 'web' ? app.checkoutOnSite.webPreview : app.checkoutOnSite.body}
          </T>
          <Button
            label={app.checkoutOnSite.open}
            icon="external-link"
            onPress={() =>
              WebBrowser.openBrowserAsync(`${SITE_URL}/subscribe${isGroup ? '?kind=group' : ''}`).catch(() => Linking.openURL(`${SITE_URL}/subscribe`))
            }
          />
        </Card>
      )}

      <View style={{ gap: 6 }}>
        {perks.map((perk) => (
          <Row key={perk} gap={8} align="flex-start">
            <Icon name="check" size={16} color={colors.success} strokeWidth={3} />
            <T size={13} style={{ flex: 1 }}>
              {perk}
            </T>
          </Row>
        ))}
      </View>

      <View style={{ gap: 8 }}>
        <Row gap={8} align="flex-start">
          <Icon name="lock" size={14} color={colors.textLight} />
          <T size={12} color={colors.textLight} style={{ flex: 1 }}>
            {t.secureNoteBefore} {t.secureNoteProvider}
            {t.secureNoteAfter} {t.noAutoRenew}
          </T>
        </Row>
        <TouchableOpacity onPress={() => (isGroup ? router.replace('/subscribe') : router.push('/groups'))} accessibilityRole="link">
          <Row gap={8}>
            <Icon name={isGroup ? 'user' : 'users'} size={15} color={colors.primary} />
            <T size={13} weight="semibold" color={colors.primary}>
              {isGroup ? t.crossToIndividual : t.crossToGroup}
            </T>
          </Row>
        </TouchableOpacity>
        <T size={12} color={colors.textLight}>
          {t.policyBefore}{' '}
          <T size={12} color={colors.primary} onPress={() => router.push('/terms')}>
            {t.terms}
          </T>
          .
        </T>
        <TouchableOpacity onPress={() => router.push('/refund-policy')} accessibilityRole="link">
          <Row gap={6}>
            <Icon name="shield-check" size={14} color={colors.primary} />
            <T size={12} color={colors.primary} weight="semibold">
              {t.guaranteeLink}
            </T>
          </Row>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
