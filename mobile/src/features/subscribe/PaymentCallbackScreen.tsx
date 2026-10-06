import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCopy } from '@/i18n';
import supportCopy from '@/i18n/copy/support.js';
import { ApiError, api } from '@/lib/api';
import { trackFunnel } from '@/lib/analytics';
import { useAuth } from '@/lib/auth';
import { colors } from '@/theme';
import { Button, Card, Icon, Screen, Spinner, T } from '@/ui';
import { safeNextPath } from './checkout';

/**
 * Where a payment attempt ends. Moyasar's redirect carries the payment id; the
 * server verifies it with the secret key and activates the subscription. The
 * account comes from the session, never from anything in the URL.
 */
export default function PaymentCallbackScreen() {
  const t = useCopy(supportCopy).callback;
  const { updateUser, refreshSubscription } = useAuth();
  const params = useLocalSearchParams<{ id?: string; status?: string; message?: string; next?: string }>();
  const [state, setState] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('');
  const ran = useRef(false);

  // The server returns a stable reason code; the wording is ours.
  const reasonText = (reason?: string) => (t.reasons as Record<string, string>)[reason || ''] || t.reasons.default;

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const paymentId = params.id || '';
    const moyasarStatus = params.status || '';

    if (!paymentId) {
      setState('failed');
      setMessage(t.noPaymentInfo);
      trackFunnel('payment_failed', { reason: 'no_payment_info' });
      return;
    }
    if (moyasarStatus && moyasarStatus !== 'paid') {
      setState('failed');
      setMessage(params.message || reasonText('not_paid'));
      trackFunnel('payment_failed', { reason: 'not_paid' });
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    (async () => {
      try {
        const data = await api.post('/api/payment/verify', { paymentId });
        if (data.success) {
          // Reflect the new state locally so the allowance banner and the
          // account page are right before the next server sync.
          updateUser({ accessAllowed: true, subscription_status: 'active', free_questions_remaining: null });
          void refreshSubscription(true);
          setState('success');
          setMessage(data.seats > 1 ? t.successMessageGroup(data.seats) : t.successMessage);
          trackFunnel('payment_success', { amountHalalas: data.amountHalalas ?? data.amount_halalas ?? null });
          // A group buyer goes to /groups, where the invite links they just paid for are waiting.
          const next = safeNextPath(params.next);
          timer = setTimeout(() => router.replace(next), 1800);
        } else {
          setState('failed');
          setMessage(reasonText(data.reason));
          trackFunnel('payment_failed', { reason: data.reason || 'unknown' });
        }
      } catch (err) {
        const reason = err instanceof ApiError ? err.data?.reason : undefined;
        setState('failed');
        setMessage(reasonText(reason));
        trackFunnel('payment_failed', { reason: reason || 'exception' });
      }
    })();
    return () => {
      if (timer) clearTimeout(timer);
    };
    // Runs once for the redirect that opened this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card pad={24} style={{ alignItems: 'center', gap: 12 }}>
          {state === 'verifying' ? (
            <>
              <Spinner size="lg" />
              <T weight="extrabold" size={20} align="center">
                {t.verifyingTitle}
              </T>
              <T color={colors.textMedium} align="center">
                {t.verifyingBody}
              </T>
            </>
          ) : state === 'success' ? (
            <>
              <Icon name="check-circle" size={64} color={colors.success} />
              <T weight="extrabold" size={20} align="center">
                {t.successTitle}
              </T>
              <T color={colors.textMedium} align="center">
                {message}
              </T>
              <T color={colors.textLight} size={13} align="center">
                {t.redirecting}
              </T>
            </>
          ) : (
            <>
              <Icon name="x-circle" size={64} color={colors.error} />
              <T weight="extrabold" size={20} align="center">
                {t.failedTitle}
              </T>
              <T color={colors.textMedium} align="center">
                {message}
              </T>
              <Button label={t.retry} onPress={() => router.replace('/subscribe')} />
            </>
          )}
        </Card>
      </View>
    </Screen>
  );
}
