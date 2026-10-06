import React, { useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { SUPPORT_EMAIL, TELEGRAM_CHANNEL_URL } from '@/config';
import { useCopy } from '@/i18n';
import supportCopy from '@/i18n/copy/support.js';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { userTrack } from '@/lib/tracks';
import { colors, radius } from '@/theme';
import { Button, Card, Chevron, Chip, Icon, Input, Notice, Row, Screen, ScreenHeader, T } from '@/ui';

const SUBJECTS = ['subscription', 'report issue', 'other'] as const;

/**
 * /contact: support is by email only (someone who prefers WhatsApp adds their
 * number to the message and we follow up there, so no phone number is
 * published). The form posts to the same endpoint as the website; if that fails
 * the message can be sent from the phone's mail app instead.
 */
export default function ContactScreen() {
  const t = useCopy(supportCopy).contact;
  const { user } = useAuth();
  const [form, setForm] = useState<{ name: string; mobile: string; subject: (typeof SUBJECTS)[number]; message: string }>({
    name: '',
    mobile: '',
    subject: 'subscription',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  const set = (key: 'name' | 'mobile' | 'message') => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const subjectLabel = { subscription: t.subjectSubscription, 'report issue': t.subjectIssue, other: t.subjectOther };
  const valid = form.name.trim() && form.mobile.trim() && form.message.trim();

  const mailFallback = () => {
    const subject = encodeURIComponent(form.subject || t.mailSubject);
    const body = encodeURIComponent(`Name: ${form.name}\nMobile: ${form.mobile}\n\nMessage:\n${form.message}\n\n---\n${t.mailFooter}`);
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`).catch(() => {});
  };

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setFailed(false);
    try {
      await api.post(
        '/api/contact',
        {
          name: form.name,
          mobile: form.mobile,
          subject: form.subject || t.mailSubject,
          message: form.message,
          // The form is reachable signed out, so this is best-effort: when we
          // do know who is writing, tell the inbox which track they study.
          track: user ? userTrack(user) : null,
          username: user?.username || null,
        },
        { auth: false }
      );
      setSuccess(true);
      setForm({ name: '', mobile: '', subject: 'subscription', message: '' });
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const header = <ScreenHeader title={t.title} />;

  if (success) {
    return (
      <Screen header={header}>
        <Card pad={22} style={{ alignItems: 'center', gap: 12 }}>
          <Icon name="check-circle" size={44} color={colors.success} />
          <T weight="extrabold" size={20} align="center">
            {t.successTitle}
          </T>
          <T color={colors.textMedium} align="center">
            {t.successBody}
          </T>
          <T size={13} color={colors.textLight} align="center">
            {t.successAlso}
          </T>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {})} accessibilityRole="link">
            <Row gap={6}>
              <Icon name="mail" size={15} color={colors.primary} />
              <T weight="semibold" color={colors.primary} ltr>
                {SUPPORT_EMAIL}
              </T>
            </Row>
          </TouchableOpacity>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen header={header}>
      <T color={colors.textMedium}>{t.subtitle}</T>

      <TouchableOpacity activeOpacity={0.85} onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {})} accessibilityRole="link">
        <Row gap={12} style={{ backgroundColor: colors.primary, borderRadius: radius.lg, padding: 14 }}>
          <Icon name="mail" size={22} color={colors.white} />
          <View style={{ flex: 1 }}>
            <T weight="bold" color={colors.white}>
              {t.emailCta}
            </T>
            <T size={12} color="#dbeafe">
              {t.emailHint}
            </T>
          </View>
          <Chevron color={colors.white} />
        </Row>
      </TouchableOpacity>

      <Card style={{ gap: 12 }}>
        {[
          { icon: 'mail', title: t.email, value: SUPPORT_EMAIL, url: `mailto:${SUPPORT_EMAIL}` },
          { icon: 'telegram', title: t.telegram, value: '@sqb_exam', url: TELEGRAM_CHANNEL_URL },
        ].map((info) => (
          <TouchableOpacity key={info.title} onPress={() => Linking.openURL(info.url).catch(() => {})} accessibilityRole="link">
            <Row gap={12}>
              <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surfaceTint, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={info.icon} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <T weight="bold" size={14}>
                  {info.title}
                </T>
                <T size={13} color={colors.primary} ltr>
                  {info.value}
                </T>
              </View>
            </Row>
          </TouchableOpacity>
        ))}
      </Card>

      <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/suggestions')} accessibilityRole="button">
        <Row gap={12} style={{ backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: 14 }}>
          <Icon name="lightbulb" size={22} color={colors.warning} />
          <View style={{ flex: 1 }}>
            <T weight="bold">{t.suggestionsTitle}</T>
            <T size={12} color={colors.textLight}>
              {t.suggestionsSubtitle}
            </T>
          </View>
          <Chevron />
        </Row>
      </TouchableOpacity>

      <Card style={{ gap: 14 }}>
        <T weight="extrabold" size={17}>
          {t.formTitle}
        </T>
        <Input label={t.name} placeholder={t.namePlaceholder} value={form.name} onChangeText={set('name')} autoComplete="name" />
        <Input label={t.mobile} placeholder={t.mobilePlaceholder} value={form.mobile} onChangeText={set('mobile')} keyboardType="phone-pad" autoComplete="tel" ltr />
        <View style={{ gap: 6 }}>
          <T weight="semibold" size={13} color={colors.textMedium}>
            {t.subject}
          </T>
          {/* The values are stable keys the admin inbox reads: only the labels change. */}
          <Row wrap gap={8}>
            {SUBJECTS.map((s) => (
              <Chip key={s} label={subjectLabel[s]} selected={form.subject === s} onPress={() => setForm((f) => ({ ...f, subject: s }))} />
            ))}
          </Row>
        </View>
        <Input
          label={t.message}
          placeholder={t.messagePlaceholder}
          value={form.message}
          onChangeText={set('message')}
          multiline
          inputStyle={{ minHeight: 100, textAlignVertical: 'top' }}
        />
        {failed ? <Notice kind="error">{t.failed}</Notice> : null}
        <Button label={loading ? t.sending : t.send} icon="send" size="lg" onPress={() => void submit()} loading={loading} disabled={!valid} />
        {failed ? <Button label={SUPPORT_EMAIL} icon="mail" variant="secondary" onPress={mailFallback} /> : null}
      </Card>
    </Screen>
  );
}
