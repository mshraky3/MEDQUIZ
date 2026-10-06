import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useCopy } from '@/i18n';
import supportCopy from '@/i18n/copy/support.js';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { userTrack } from '@/lib/tracks';
import { colors, radius } from '@/theme';
import { Button, Card, Chip, Icon, Input, Notice, Row, Screen, ScreenHeader, T } from '@/ui';

// The values are stable keys stored server-side; only labels are localised.
const CATEGORIES = ['feature', 'improvement', 'ui', 'content', 'bug', 'other'] as const;
const PRIORITIES = ['low', 'medium', 'high'] as const;

/** /suggestions: tell us what to build or fix. Reachable signed out. */
export default function SuggestionsScreen() {
  const t = useCopy(supportCopy).suggestions;
  const { user } = useAuth();
  const [form, setForm] = useState<{ category: (typeof CATEGORIES)[number]; title: string; description: string; priority: (typeof PRIORITIES)[number] }>({
    category: 'feature',
    title: '',
    description: '',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  const valid = form.title.trim() && form.description.trim();

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setFailed(false);
    try {
      await api.post(
        '/api/suggestions',
        {
          category: form.category,
          title: form.title,
          description: form.description,
          priority: form.priority,
          track: user ? userTrack(user) : null,
          username: user?.username || null,
        },
        { auth: false }
      );
      setSuccess(true);
      setForm({ category: 'feature', title: '', description: '', priority: 'medium' });
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
          <Icon name="check-circle" size={52} color={colors.success} />
          <T weight="extrabold" size={20} align="center">
            {t.successTitle}
          </T>
          <T color={colors.textMedium} align="center">
            {t.successBody}
          </T>
          <Button label={t.another} icon="pen" variant="secondary" onPress={() => setSuccess(false)} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen header={header}>
      <View style={{ gap: 8, alignItems: 'center' }}>
        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.warningBg, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="lightbulb" size={30} color={colors.warning} />
        </View>
        <T color={colors.textMedium} align="center">
          {t.subtitle}
        </T>
      </View>

      <Row gap={8} align="flex-start" style={{ backgroundColor: colors.infoBg, borderRadius: radius.md, padding: 12 }}>
        <Icon name="info" size={16} color={colors.primary} />
        <T size={13} color={colors.primary} style={{ flex: 1 }}>
          {t.banner}
        </T>
      </Row>

      <Card style={{ gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Row gap={6}>
            <Icon name="folder" size={14} color={colors.textMedium} />
            <T weight="semibold" size={13} color={colors.textMedium}>
              {t.categoryLabel}
            </T>
          </Row>
          <Row wrap gap={8}>
            {CATEGORIES.map((c) => (
              <Chip key={c} label={t.categories[c]} selected={form.category === c} onPress={() => setForm((f) => ({ ...f, category: c }))} />
            ))}
          </Row>
        </View>

        <Input
          label={t.titleLabel}
          placeholder={t.titlePlaceholder}
          value={form.title}
          onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
          maxLength={100}
        />

        <Input
          label={t.descriptionLabel}
          placeholder={t.descriptionPlaceholder}
          value={form.description}
          onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
          multiline
          maxLength={1000}
          inputStyle={{ minHeight: 110, textAlignVertical: 'top' }}
          hint={`${form.description.length}/1000`}
        />

        <View style={{ gap: 8 }}>
          <Row gap={6}>
            <Icon name="star" size={14} color={colors.textMedium} />
            <T weight="semibold" size={13} color={colors.textMedium}>
              {t.priorityLabel}
            </T>
          </Row>
          <Row wrap gap={8}>
            {PRIORITIES.map((p) => (
              <Chip key={p} label={t.priorities[p]} selected={form.priority === p} onPress={() => setForm((f) => ({ ...f, priority: p }))} />
            ))}
          </Row>
        </View>

        {failed ? <Notice kind="error">{t.failed}</Notice> : null}
        <Button label={loading ? t.sending : t.send} icon="rocket" size="lg" onPress={() => void submit()} loading={loading} disabled={!valid} />
      </Card>

      <Button label={t.back} variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/contact'))} />
    </Screen>
  );
}
