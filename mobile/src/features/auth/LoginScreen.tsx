import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SUPPORT_EMAIL } from '@/config';
import { useCopy } from '@/i18n';
import authCopy from '@/i18n/copy/auth.js';
import { ApiError, api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { colors } from '@/theme';
import { Button, Dialog, Input, Link, Notice, Row, T } from '@/ui';
import { AuthShell, TermsDialog } from './parts';
import { GoogleButton } from './GoogleButton';

type LoginResponse = { user?: any; sessionToken: string; showTerms?: boolean };

/**
 * Sign in with email + password (or Google). Logging in is never gated on a
 * subscription: a free-tier account signs in to its own dashboard like anyone.
 */
export default function LoginScreen() {
  const copy = useCopy(authCopy).login;
  const { signIn, sessionExpired, clearExpiredNotice } = useAuth();
  const params = useLocalSearchParams<{ message?: string; username?: string }>();

  const [username, setUsername] = useState(typeof params.username === 'string' ? params.username : '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [noGoogleAccount, setNoGoogleAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  // Held back until the terms are accepted: signing in flips the route guard
  // and would carry the student straight past the terms dialog.
  const [pending, setPending] = useState<LoginResponse | null>(null);
  const [acceptingTerms, setAcceptingTerms] = useState(false);

  const finish = async (data: LoginResponse) => {
    await signIn(data.user, data.sessionToken);
    router.replace('/(tabs)');
  };

  const handleSubmit = async () => {
    if (loading) return;
    const cleaned = username.trim().toLowerCase();
    if (!cleaned || !password) {
      setError(copy.requiredFieldsError);
      return;
    }
    setError('');
    setNoGoogleAccount(false);
    setLoading(true);
    try {
      const data = await api.post<LoginResponse>('/login', { username: cleaned, password }, { auth: false });
      if (data.showTerms) setPending({ ...data, user: { ...data.user, username: data.user?.username || cleaned } });
      else await finish(data);
    } catch (err) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      const body = err instanceof ApiError ? err.data : null;
      if (body?.accountDeleted) setError(copy.accountDeletedError);
      else if (body?.alreadyLogged) setError(copy.accountInUseError);
      else {
        if (attempts >= 10) setShowHelp(true);
        setError(copy.credentialsError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (data: LoginResponse) => {
    setError('');
    setNoGoogleAccount(false);
    if (data.showTerms) setPending(data);
    else await finish(data);
  };

  const handleGoogleError = (err: unknown) => {
    if (err instanceof ApiError && err.status === 404 && err.data?.noAccount) {
      setError('');
      setNoGoogleAccount(true);
      return;
    }
    setNoGoogleAccount(false);
    setError(copy.oauthError);
  };

  const acceptTerms = async () => {
    if (!pending) return;
    setAcceptingTerms(true);
    try {
      const name = String(pending.user?.username || pending.user?.email || username).trim().toLowerCase();
      await api.post(
        '/accept-terms',
        { username: name },
        { auth: false, headers: { Authorization: `Bearer ${pending.sessionToken}` } }
      );
      const data = pending;
      setPending(null);
      await finish({ ...data, user: { ...data.user, terms_accepted: true } });
    } catch {
      setPending(null);
      setError(copy.acceptTermsError);
    } finally {
      setAcceptingTerms(false);
    }
  };

  const mailSupport = () =>
    Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(copy.supportSubject)}&body=${encodeURIComponent(copy.supportBody)}`
    ).catch(() => {});

  return (
    <AuthShell canGoBack={router.canGoBack()}>
      <View style={{ gap: 4 }}>
        <T weight="extrabold" size={24}>
          {copy.title}
        </T>
        <T color={colors.textLight}>{copy.subtitle}</T>
      </View>

      {sessionExpired ? (
        <Notice kind="warning">{copy.sessionExpired}</Notice>
      ) : null}
      {typeof params.message === 'string' && params.message ? <Notice kind="success">{params.message}</Notice> : null}

      <Input
        label={copy.emailLabel}
        placeholder={copy.emailPlaceholder}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        textContentType="username"
        ltr
        onSubmitEditing={handleSubmit}
        returnKeyType="next"
      />
      <Input
        label={copy.passwordLabel}
        placeholder={copy.passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        ltr
        onSubmitEditing={handleSubmit}
        returnKeyType="go"
      />

      <Row justify="flex-end">
        <Link label={copy.forgot} size={13} onPress={() => router.push('/forgot-password')} />
      </Row>

      {error ? <Notice kind="error">{error}</Notice> : null}
      {noGoogleAccount ? (
        <Notice kind="warning">
          <T size={14} color={colors.warning} weight="medium">
            {copy.googleNoAccount}{' '}
          </T>
          <Link label={copy.googleNoAccountCta} onPress={() => router.push('/signup')} />
        </Notice>
      ) : null}

      <Button label={loading ? copy.submitting : copy.submit} onPress={handleSubmit} loading={loading} size="lg" />

      <GoogleButton mode="login" dividerLabel={copy.dividerOr} onSuccess={handleGoogle} onError={handleGoogleError} />

      <Row gap={6} justify="center" wrap>
        <T color={colors.textMedium} size={14}>
          {copy.noAccount}
        </T>
        <Link label={copy.signupLink} onPress={() => router.push('/signup')} />
      </Row>

      <TermsDialog visible={!!pending} busy={acceptingTerms} onAccept={acceptTerms} />

      <Dialog
        visible={showHelp}
        onClose={() => {
          setShowHelp(false);
          clearExpiredNotice();
        }}
      >
        <T weight="bold" size={18}>
          {copy.popupTitle}
        </T>
        <T color={colors.textMedium}>{copy.popupBody}</T>
        <Button label={copy.contactUs} onPress={() => { setShowHelp(false); router.push('/contact'); }} />
        <Button label={copy.contactSupport} variant="secondary" onPress={mailSupport} />
        <Button label={copy.close} variant="ghost" onPress={() => setShowHelp(false)} />
      </Dialog>
    </AuthShell>
  );
}
