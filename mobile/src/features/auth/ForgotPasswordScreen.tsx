import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useCopy } from '@/i18n';
import authCopy from '@/i18n/copy/auth.js';
import { ApiError, api } from '@/lib/api';
import { colors } from '@/theme';
import { Button, Input, Link, Notice, Row, T } from '@/ui';
import { AuthShell } from './parts';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Reset a forgotten password: email -> 6-digit code -> new password. */
export default function ForgotPasswordScreen() {
  const t = useCopy(authCopy).forgot;
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    if (!email.trim()) return setError(t.errEmailRequired);
    if (!EMAIL_RE.test(email.trim())) return setError(t.errEmailInvalid);
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/send-otp', { email: email.trim().toLowerCase(), purpose: 'reset' }, { auth: false });
      setStep('otp');
    } catch (err) {
      setError((err instanceof ApiError && err.data?.message) || t.errSendFailed);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = () => {
    if (otp.length !== 6) return setError(t.errOtpLength);
    setError('');
    setStep('password');
  };

  const resetPassword = async () => {
    if (!newPassword || !confirm) return setError(t.errAllFields);
    if (newPassword.length < 8) return setError(t.errPasswordLength);
    if (newPassword !== confirm) return setError(t.errPasswordMatch);
    setLoading(true);
    setError('');
    try {
      await api.post(
        '/api/auth/reset-password',
        { email: email.trim().toLowerCase(), otp_code: otp, new_password: newPassword },
        { auth: false }
      );
      router.replace({ pathname: '/login', params: { message: t.done, username: email.trim().toLowerCase() } });
    } catch (err) {
      setError((err instanceof ApiError && err.data?.message) || t.errResetFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <View style={{ gap: 4 }}>
        <T weight="extrabold" size={24}>
          {t.title}
        </T>
        <T color={colors.textLight}>
          {step === 'email' ? t.subtitleEmail : step === 'otp' ? t.subtitleOtp : t.subtitlePassword}
        </T>
      </View>

      {step === 'email' && (
        <>
          <Input
            label={t.emailLabel}
            placeholder={t.emailPlaceholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            ltr
          />
          {error ? <Notice kind="error">{error}</Notice> : null}
          <Button label={loading ? t.sending : t.sendOtp} onPress={sendOtp} loading={loading} size="lg" />
          <Row justify="center">
            <Link label={t.backToLogin} onPress={() => router.replace('/login')} />
          </Row>
        </>
      )}

      {step === 'otp' && (
        <>
          <Input
            label={t.otpLabel}
            placeholder={t.otpPlaceholder}
            value={otp}
            onChangeText={(v) => setOtp(v.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            ltr
            inputStyle={{ textAlign: 'center', fontSize: 28, letterSpacing: 12 }}
          />
          <T size={13} color={colors.textLight}>
            {t.otpSentTo}{' '}
            <T size={13} weight="bold" ltr>
              {email}
            </T>
          </T>
          <T size={13} color={colors.textLight}>
            {t.spamHintBefore} <T size={13} weight="bold">{t.spamFolder}</T> {t.spamOr}{' '}
            <T size={13} weight="bold">{t.trashFolder}</T>.
          </T>
          {error ? <Notice kind="error">{error}</Notice> : null}
          <Button label={t.next} onPress={verifyOtp} size="lg" />
          <Row justify="center">
            <Link
              label={t.changeEmail}
              onPress={() => {
                setStep('email');
                setError('');
                setOtp('');
              }}
            />
          </Row>
        </>
      )}

      {step === 'password' && (
        <>
          <Input
            label={t.newPasswordLabel}
            placeholder={t.newPasswordPlaceholder}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            ltr
          />
          <Input
            label={t.confirmLabel}
            placeholder={t.confirmPlaceholder}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            ltr
          />
          {error ? <Notice kind="error">{error}</Notice> : null}
          <Button label={loading ? t.submitting : t.submit} onPress={resetPassword} loading={loading} size="lg" />
        </>
      )}
    </AuthShell>
  );
}
