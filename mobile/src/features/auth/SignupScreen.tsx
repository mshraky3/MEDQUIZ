import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking } from 'react-native';
import { SUPPORT_EMAIL } from '@/config';
import { formatDate, useCopy, useLang } from '@/i18n';
import authCopy from '@/i18n/copy/auth.js';
import { ApiError, api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { TRACKS, TRACK_KEYS, TrackKey, normalizeTrack, pick } from '@/lib/tracks';
import { colors } from '@/theme';
import { Button, Checkbox, Icon, Input, Link, Notice, Row, Span, Spinner, T } from '@/ui';
import { GOOGLE_SIGN_IN_AVAILABLE, GoogleButton } from './GoogleButton';
import { AuthShell, TermsDialog, TrackDialog } from './parts';

export type SignupMode = 'free' | 'invite' | 'seat';

const FIRST_QUIZ_SIZE = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Where a brand-new account lands: question one, not the hub. Every screen
 * between "account created" and "first question" is somewhere to stop, so there
 * are none left. Study mode shows the explanation on the first answer.
 */
const openFirstQuiz = () =>
  router.replace({ pathname: '/quiz', params: { count: String(FIRST_QUIZ_SIZE), mode: 'study', types: 'mix' } });

/**
 * Create an account. Three ways in, all ending in the same signed-in session:
 *  - free:   email + password + a 6-digit code mailed to the address;
 *  - invite: an admin invite link (/signup/:token), no code, track fixed by the link;
 *  - seat:   a paid group seat (/join/:token), no code, the claimer picks a track.
 */
export default function SignupScreen({ mode, token }: { mode: SignupMode; token?: string }) {
  const t = useCopy(authCopy).signup;
  const { lang } = useLang();
  const { signIn, user: signedInUser } = useAuth();
  const params = useLocalSearchParams<{ track?: string }>();
  const preselected = TRACK_KEYS.includes(params.track as TrackKey) ? (params.track as TrackKey) : null;

  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [studyTrack, setStudyTrack] = useState<TrackKey | null>(preselected);
  const [showTrack, setShowTrack] = useState(false);
  const [inviteTrack, setInviteTrack] = useState<TrackKey | null>(null);
  const [seatExpiresAt, setSeatExpiresAt] = useState<string | null>(null);
  const [seatError, setSeatError] = useState<string | null>(null);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const [validating, setValidating] = useState(mode !== 'free');
  const [emailFormOpen, setEmailFormOpen] = useState(mode !== 'free' || !GOOGLE_SIGN_IN_AVAILABLE);

  // Google-created account waiting on the terms dialog.
  const [oauthSession, setOauthSession] = useState<{ user: any; sessionToken: string } | null>(null);
  const [acceptingTerms, setAcceptingTerms] = useState(false);

  const isSeat = mode === 'seat';
  const isInvite = mode === 'invite';
  const trackLocked = isInvite;
  const effectiveTrack = isInvite ? inviteTrack : studyTrack;
  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // Entry: validate a token link, or ask which track this student is.
  useEffect(() => {
    if (isSeat && token) {
      setShowTrack(true);
      (async () => {
        try {
          const data = await api.get(`/api/groups/seat/${token}`, { auth: false });
          if (!aliveRef.current) return;
          if (data.valid) setSeatExpiresAt(data.expiresAt);
          else {
            setSeatError(data.reason || 'error');
            setLinkInvalid(true);
            setShowTrack(false);
          }
        } catch {
          if (!aliveRef.current) return;
          setSeatError('error');
          setLinkInvalid(true);
          setShowTrack(false);
        } finally {
          if (aliveRef.current) setValidating(false);
        }
      })();
    } else if (isInvite && token) {
      (async () => {
        try {
          const data = await api.get(`/api/validate-temp-link/${token}`, { auth: false });
          if (!aliveRef.current) return;
          if (data.valid) setInviteTrack(normalizeTrack(data.link?.track));
          else setLinkInvalid(true);
        } catch {
          if (aliveRef.current) setLinkInvalid(true);
        } finally {
          if (aliveRef.current) setValidating(false);
        }
      })();
    } else if (!preselected) {
      setShowTrack(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, mode]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const set = (key: 'email' | 'password' | 'confirm') => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    if (!isInvite && !studyTrack) {
      setError(t.errTrackFirst);
      setShowTrack(true);
      return false;
    }
    if (!form.email || !form.password || !form.confirm) {
      setError(t.errAllFields);
      return false;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError(t.errEmail);
      return false;
    }
    if (form.password.length < 8) {
      setError(t.errPasswordLength);
      return false;
    }
    if (form.password !== form.confirm) {
      setError(t.errPasswordMatch);
      return false;
    }
    if (!agreed) {
      setError(t.errTerms);
      return false;
    }
    return true;
  };

  const email = form.email.trim().toLowerCase();

  /** Signs the new account straight in, accepting the terms they just agreed to. */
  const autoLogin = async () => {
    try {
      const res = await api.post<{ user?: any; sessionToken: string; showTerms?: boolean }>(
        '/login',
        { username: email, password: form.password },
        { auth: false }
      );
      if (res.showTerms) {
        await api
          .post('/accept-terms', { username: email }, { auth: false, headers: { Authorization: `Bearer ${res.sessionToken}` } })
          .catch(() => {});
      }
      await signIn(res.user || { username: email }, res.sessionToken);
      setTimeout(openFirstQuiz, 900);
    } catch {
      setTimeout(() => router.replace({ pathname: '/login', params: { message: t.createdFallback, username: email } }), 1200);
    }
  };

  const sendOtp = async () => {
    await api.post('/api/auth/send-otp', { email, purpose: 'signup' }, { auth: false });
  };

  const createAccount = async (otpCode: string | null) => {
    setLoading(true);
    try {
      const endpoint = isSeat ? '/api/signup/group-seat' : isInvite ? '/api/signup/temp-link' : '/api/signup/free';
      const payload = isSeat
        ? { token, email, password: form.password, track: studyTrack }
        : isInvite
          ? { token, email, password: form.password }
          : { email, password: form.password, otp_code: otpCode, track: studyTrack };
      const res = await api.post(endpoint, payload, { auth: false });
      if (res.success) {
        setSuccess(true);
        await autoLogin();
      } else {
        throw new Error(res.message || t.errCreate);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? (err.data?.message as string | undefined) : (err as Error).message;
      setError(msg || t.errCreate);
    } finally {
      setLoading(false);
    }
  };

  const onCredentials = async () => {
    setError('');
    if (!validate()) return;
    if (isInvite || isSeat) {
      await createAccount(null);
      return;
    }
    setLoading(true);
    try {
      await sendOtp();
      setStep('otp');
      setCooldown(30);
    } catch (err) {
      setError((err instanceof ApiError && err.data?.message) || t.errSendOtp);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError('');
    setLoading(true);
    try {
      await sendOtp();
      setCooldown(30);
    } catch (err) {
      setError((err instanceof ApiError && err.data?.message) || t.errSendOtp);
    } finally {
      setLoading(false);
    }
  };

  const onOtp = async () => {
    setError('');
    if (otp.length !== 6) {
      setError(t.errOtpLength);
      return;
    }
    await createAccount(otp);
  };

  // Google: the same session shape /login returns. A brand-new Google account
  // always comes back with showTerms, so it finishes in acceptOauthTerms.
  const onGoogle = async (data: any) => {
    setError('');
    if (data.showTerms) {
      setOauthSession({ user: data.user, sessionToken: data.sessionToken });
      return;
    }
    await signIn(data.user, data.sessionToken);
    router.replace('/(tabs)');
  };

  const acceptOauthTerms = async () => {
    if (!oauthSession) return;
    setAcceptingTerms(true);
    try {
      const name = String(oauthSession.user?.username || oauthSession.user?.email || '').toLowerCase();
      await api.post(
        '/accept-terms',
        { username: name },
        { auth: false, headers: { Authorization: `Bearer ${oauthSession.sessionToken}` } }
      );
      await signIn({ ...oauthSession.user, terms_accepted: true }, oauthSession.sessionToken);
      setOauthSession(null);
      openFirstQuiz();
    } catch {
      setOauthSession(null);
      setError(t.errCreate);
    } finally {
      setAcceptingTerms(false);
    }
  };

  const trackName = (key: TrackKey | null) => (key ? pick(TRACKS[key].label, lang) : '');
  const mailSupport = () => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Account%20Support`).catch(() => {});

  const pillText = isSeat ? t.pillSeat : isInvite ? t.pillInvite : null;
  const title = isSeat ? t.titleSeat : isInvite ? t.titleInvite : t.titleFree;
  const subtitle = useMemo(() => {
    if (step === 'credentials') return isSeat ? t.subtitleSeat : isInvite ? t.subtitleInvite : t.subtitleFree;
    return isInvite ? t.subtitleOtpInvite(form.email) : t.subtitleOtpFree(form.email);
  }, [step, isSeat, isInvite, t, form.email]);

  if (signedInUser && !success && !oauthSession) {
    // Opened an invite or seat link while already signed in.
    return (
      <AuthShell>
        <Notice kind="info">{lang === 'ar' ? 'أنت مسجّل الدخول بالفعل. سجّل الخروج أولاً لاستخدام هذا الرابط.' : 'You are already signed in. Log out first to use this link.'}</Notice>
        <Button label={lang === 'ar' ? 'العودة' : 'Back'} onPress={() => router.replace('/(tabs)')} />
      </AuthShell>
    );
  }

  if (success) {
    return (
      <AuthShell canGoBack={false}>
        <View style={{ alignItems: 'center', gap: 10, paddingVertical: 12 }}>
          <Icon name="check-circle" size={56} color={colors.success} />
          <T weight="extrabold" size={20} align="center">
            {t.successTitle}
          </T>
          <T weight="semibold" align="center">
            {isSeat ? t.successSeat : isInvite ? t.successInvite : t.successFree}
          </T>
          <T color={colors.textLight} align="center">
            {t.successRedirect}
          </T>
          <Spinner size="sm" />
        </View>
      </AuthShell>
    );
  }

  if (validating) {
    return (
      <AuthShell>
        <View style={{ alignItems: 'center', gap: 14, paddingVertical: 24 }}>
          <Spinner />
          <T color={colors.textLight}>{t.validatingLink}</T>
        </View>
      </AuthShell>
    );
  }

  if (linkInvalid) {
    return (
      <AuthShell>
        <View style={{ gap: 6 }}>
          <T weight="extrabold" size={22} align="center">
            {t.invalidLinkTitle}
          </T>
          <T color={colors.textLight} align="center">
            {seatError ? (t.seatReasons as Record<string, string>)[seatError] || t.seatReasons.error : t.invalidLinkBody}
          </T>
        </View>
        <Button
          label={t.invalidLinkCta}
          onPress={() => {
            setLinkInvalid(false);
            setError('');
            router.replace('/signup');
          }}
        />
        <Row gap={6} justify="center" wrap>
          <T size={14} color={colors.textMedium}>
            {t.invalidLinkThinkError}
          </T>
          <Link label={t.contactSupport} onPress={() => router.push('/contact')} />
        </Row>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <View style={{ gap: 6 }}>
        {pillText ? (
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.infoBg,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 3,
            }}
          >
            <T weight="bold" size={12} color={colors.primary}>
              {pillText}
            </T>
          </View>
        ) : null}
        <T weight="extrabold" size={24}>
          {title}
        </T>
        <T color={colors.textLight}>{subtitle}</T>
      </View>

      {isSeat && seatExpiresAt ? (
        <Notice kind="info">
          <T weight="bold" size={14} color={colors.primary}>
            {t.seatCalloutTitle}
          </T>
          <T size={13} color={colors.primary}>
            {t.seatCalloutBody(formatDate(seatExpiresAt, lang))}
          </T>
        </Notice>
      ) : null}

      {step === 'credentials' ? (
        <>
          {trackLocked ? (
            <Row gap={8} style={{ backgroundColor: colors.surface2, borderRadius: 12, padding: 12 }}>
              <Icon name={TRACKS[inviteTrack || 'medical'].icon} size={18} color={colors.primary} />
              <T size={13} style={{ flex: 1 }}>
                {t.trackLockedPrefix} <Span weight="bold" size={13}>{trackName(inviteTrack)}</Span> {t.trackLockedSuffix}
              </T>
            </Row>
          ) : (
            <Row gap={10} style={{ backgroundColor: colors.surface2, borderRadius: 12, padding: 12 }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: colors.surfaceTint,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={studyTrack ? TRACKS[studyTrack].icon : 'help-circle'} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <T size={12} color={colors.textLight}>
                  {t.trackLabel}
                </T>
                <T weight="bold" size={15}>
                  {studyTrack ? trackName(studyTrack) : t.trackUnset}
                </T>
              </View>
              <Link label={studyTrack ? t.trackChange : t.trackChoose} onPress={() => setShowTrack(true)} />
            </Row>
          )}

          {mode === 'free' ? (
            <GoogleButton
              mode="signup"
              dividerLabel={t.dividerOr}
              dividerPosition="after"
              track={studyTrack}
              onSuccess={onGoogle}
              onError={() => setError(t.oauthError)}
            />
          ) : null}

          {error ? <Notice kind="error">{error}</Notice> : null}

          {!emailFormOpen ? (
            <Button label={t.emailInstead} variant="secondary" size="lg" onPress={() => setEmailFormOpen(true)} />
          ) : (
            <>
              <Input
                label={t.emailLabel}
                placeholder={t.emailPlaceholder}
                value={form.email}
                onChangeText={set('email')}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                ltr
              />
              <Input
                label={t.passwordLabel}
                placeholder={t.passwordPlaceholder}
                value={form.password}
                onChangeText={set('password')}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                ltr
              />
              <Input
                label={t.confirmLabel}
                placeholder={t.confirmPlaceholder}
                value={form.confirm}
                onChangeText={set('confirm')}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                ltr
              />
              <Checkbox checked={agreed} onChange={setAgreed}>
                <T size={13}>
                  {t.agreePrefix}{' '}
                  <Span size={13} color={colors.primary} weight="semibold" onPress={() => router.push('/terms')}>
                    {t.termsLink}
                  </Span>{' '}
                  {t.and}{' '}
                  <Span size={13} color={colors.primary} weight="semibold" onPress={() => router.push('/privacy')}>
                    {t.privacyLink}
                  </Span>
                </T>
              </Checkbox>
              <Button
                label={
                  loading
                    ? isInvite || isSeat
                      ? t.creatingAccount
                      : t.sending
                    : isSeat
                      ? t.submitSeat
                      : isInvite
                        ? t.submitInvite
                        : t.submitFree
                }
                onPress={onCredentials}
                loading={loading}
                size="lg"
              />
            </>
          )}

          <Row gap={6} justify="center" wrap>
            <T size={14} color={colors.textMedium}>
              {t.haveAccount}
            </T>
            <Link label={t.loginLink} onPress={() => router.replace('/login')} />
          </Row>
          <Row gap={6} justify="center" wrap>
            <T size={14} color={colors.textMedium}>
              {t.troubleQuestion}
            </T>
            <Link label={t.contactSupport} onPress={mailSupport} />
          </Row>
        </>
      ) : (
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
            inputStyle={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
            hint={`${t.otpSpamHintBefore} ${t.otpSpamFolder} ${t.otpSpamOr} ${t.otpTrashFolder}.`}
          />
          {error ? <Notice kind="error">{error}</Notice> : null}
          <Button label={loading ? t.creatingAccount : t.otpSubmit} onPress={onOtp} loading={loading} size="lg" />
          <Button
            label={t.changeEmail}
            variant="ghost"
            disabled={loading}
            onPress={() => {
              setStep('credentials');
              setOtp('');
              setError('');
            }}
          />
          <Row gap={6} justify="center" wrap>
            <T size={14} color={colors.textMedium}>
              {t.noCode}
            </T>
            {cooldown > 0 ? (
              <T size={14} color={colors.textLight}>
                {t.resendCooldown(cooldown)}
              </T>
            ) : (
              <Link label={t.resend} onPress={onResend} />
            )}
          </Row>
        </>
      )}

      <TrackDialog
        visible={showTrack && !isInvite}
        studyTrack={studyTrack}
        onSelect={setStudyTrack}
        onConfirm={() => {
          setError('');
          setShowTrack(false);
        }}
      />
      <TermsDialog visible={!!oauthSession} busy={acceptingTerms} onAccept={acceptOauthTerms} />
    </AuthShell>
  );
}
