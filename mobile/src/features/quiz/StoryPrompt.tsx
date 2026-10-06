import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useCopy, useLang } from '@/i18n';
import successStoriesCopy from '@/i18n/copy/successStories.js';
import { api } from '@/lib/api';
import { KEYS, getItem, setItem } from '@/lib/storage';
import { colors, radius } from '@/theme';
import { Button, Card, Checkbox, Icon, Input, Row, T } from '@/ui';

/**
 * The in-app ask: "has SQB helped? tell the next student."
 *
 * Asked at a moment of goodwill (a strong result), only of accounts that have
 * actually used the product, and ONCE: a favour that was declined is not asked
 * for twice. Consent is a required checkbox, and the server refuses a story
 * without it too, so this is not the only gate, just the honest one.
 */
export function StoryPrompt({ username, onClose }: { username: string; onClose: () => void }) {
  const t = useCopy(successStoriesCopy);
  const { lang } = useLang();
  const f = t.form;
  const [stage, setStage] = useState<'ask' | 'form' | 'sent'>('ask');
  const [form, setForm] = useState({ name: '', specialty: '', result: '', quote: '' });
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = useCallback(async () => {
    if (form.quote.trim().length < 40) return setError(f.errorShort);
    if (!consent) return setError(f.errorConsent);
    setSending(true);
    setError('');
    try {
      const res = await api.post('/api/success-stories', {
        display_name: form.name.trim(),
        specialty: form.specialty.trim(),
        exam_result: form.result.trim(),
        quote: form.quote.trim(),
        consent_publish: true,
        lang,
      });
      if (!res?.success) throw new Error(res?.message || 'failed');
      setStage('sent');
    } catch {
      setError(f.errorGeneric);
    } finally {
      setSending(false);
    }
  }, [form, consent, lang, f]);

  const shell = { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.primary, padding: 16, gap: 10 } as const;

  if (stage === 'sent') {
    return (
      <View style={shell}>
        <Row gap={10} align="flex-start">
          <Icon name="check-circle" size={22} color={colors.success} />
          <View style={{ flex: 1 }}>
            <T weight="bold">{f.thanksTitle}</T>
            <T size={13} color={colors.textMedium}>
              {f.thanksBody}
            </T>
          </View>
        </Row>
        <Button label={t.prompt.dismiss} variant="ghost" onPress={onClose} />
      </View>
    );
  }

  if (stage === 'ask') {
    return (
      <View style={shell}>
        <Row gap={10} align="flex-start">
          <Icon name="star" size={22} color={colors.warning} />
          <View style={{ flex: 1 }}>
            <T weight="bold">{t.prompt.title}</T>
            <T size={13} color={colors.textMedium}>
              {t.prompt.body}
            </T>
          </View>
        </Row>
        <Row gap={10}>
          <View style={{ flex: 1 }}>
            <Button label={t.prompt.cta} size="sm" onPress={() => setStage('form')} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label={t.prompt.dismiss} size="sm" variant="secondary" onPress={onClose} />
          </View>
        </Row>
      </View>
    );
  }

  return (
    <Card style={{ gap: 12 }}>
      <T weight="bold" size={17}>
        {f.title}
      </T>
      <Input label={f.nameLabel} placeholder={f.namePlaceholder} value={form.name} onChangeText={set('name')} maxLength={80} />
      <Input label={f.resultLabel} placeholder={f.resultPlaceholder} value={form.result} onChangeText={set('result')} maxLength={120} />
      <Input label={f.specialtyLabel} value={form.specialty} onChangeText={set('specialty')} maxLength={120} />
      <Input
        label={f.quoteLabel}
        placeholder={f.quotePlaceholder}
        value={form.quote}
        onChangeText={set('quote')}
        multiline
        maxLength={900}
        inputStyle={{ minHeight: 110, textAlignVertical: 'top' }}
        hint={`${f.quoteHint} · ${form.quote.trim().length}/900`}
      />
      <Checkbox checked={consent} onChange={setConsent}>
        <T size={13}>{f.consent}</T>
      </Checkbox>
      <T size={12} color={colors.textLight}>
        {f.consentNote}
      </T>
      {error ? (
        <T size={13} color={colors.error}>
          {error}
        </T>
      ) : null}
      <Button
        label={sending ? f.sending : f.submit}
        onPress={submit}
        loading={sending}
        disabled={!consent || form.quote.trim().length < 40 || !form.name.trim()}
      />
      <Button label={f.cancel} variant="ghost" onPress={onClose} disabled={sending} />
    </Card>
  );
}

/**
 * Decides whether to ask at all: once per account (remembered locally), and
 * never of an account that already submitted one (checked against the server,
 * so it holds across devices). It stays quiet while it does not yet know.
 */
export function useStoryPrompt({ username, eligible }: { username?: string; eligible: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!eligible || !username) return undefined;
    let alive = true;
    (async () => {
      if (await getItem(KEYS.storyAsked(username))) return;
      try {
        const data = await api.get('/api/success-stories/mine');
        // Already told us theirs: never ask again, whatever its status.
        if (alive && data?.success && !data.story) setShow(true);
      } catch {
        /* stay quiet rather than risk asking twice */
      }
    })();
    return () => {
      alive = false;
    };
  }, [eligible, username]);

  const dismiss = useCallback(() => {
    if (username) void setItem(KEYS.storyAsked(username), '1');
    setShow(false);
  }, [username]);

  return { show, dismiss };
}
