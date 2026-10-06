import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useCopy, useLang } from '@/i18n';
import authCopy from '@/i18n/copy/auth.js';
import { TRACK_KEYS, TRACKS, TrackKey, pick } from '@/lib/tracks';
import { colors, radius } from '@/theme';
import { LanguageToggle } from '@/features/common/LanguageToggle';
import { Button, Card, Checkbox, Dialog, Icon, Row, Screen, T, goBack } from '@/ui';

/**
 * The shared frame of every signed-out screen: a slim top bar (back + language
 * switch) over a centred card on the page background.
 */
export function AuthShell({ children, canGoBack = true }: { children: React.ReactNode; canGoBack?: boolean }) {
  return (
    <Screen
      header={
        <Row justify="space-between" style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          {canGoBack ? (
            <TouchableOpacity
              onPress={() => goBack(false)}
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={10}
              style={{
                width: 38,
                height: 38,
                borderRadius: radius.md,
                backgroundColor: colors.surface2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="chevron-left" size={20} color={colors.text} strokeWidth={2.5} flip />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 38 }} />
          )}
          <T weight="extrabold" size={20} color={colors.primary} ltr>
            SQB
          </T>
          <LanguageToggle compact />
        </Row>
      }
    >
      <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 8 }}>
        <Card pad={22} style={{ gap: 16 }}>
          {children}
        </Card>
      </View>
    </Screen>
  );
}

/** Terms of Use, shown once to an account that has not accepted them yet. */
export function TermsDialog({
  visible,
  busy,
  onAccept,
}: {
  visible: boolean;
  busy?: boolean;
  onAccept: () => void;
}) {
  const terms = useCopy(authCopy).terms;
  const [checked, setChecked] = React.useState(false);
  return (
    <Dialog visible={visible} blocking>
      <T weight="bold" size={18}>
        {terms.title}
      </T>
      {terms.sections.map((sec: { heading: string; body: string }) => (
        <View key={sec.heading} style={{ gap: 2 }}>
          <T weight="bold" size={14}>
            {sec.heading}
          </T>
          <T size={13} color={colors.textMedium}>
            {sec.body}
          </T>
        </View>
      ))}
      <View style={{ gap: 4 }}>
        <T weight="bold" size={14}>
          {terms.prohibitedHeading}
        </T>
        {terms.prohibited.map((item: string) => (
          <Row key={item} gap={8} align="flex-start">
            <T size={13} color={colors.textMedium}>
              •
            </T>
            <T size={13} color={colors.textMedium} style={{ flex: 1 }}>
              {item}
            </T>
          </Row>
        ))}
      </View>
      {terms.sectionsAfter.map((sec: { heading: string; body: string }) => (
        <View key={sec.heading} style={{ gap: 2 }}>
          <T weight="bold" size={14}>
            {sec.heading}
          </T>
          <T size={13} color={colors.textMedium}>
            {sec.body}
          </T>
        </View>
      ))}
      <T size={13} color={colors.textMedium}>
        {terms.closing}
      </T>
      <Checkbox checked={checked} onChange={setChecked}>
        <T size={14} weight="semibold">
          {terms.accept}
        </T>
      </Checkbox>
      <Button label={terms.continue} onPress={onAccept} disabled={!checked} loading={busy} />
    </Dialog>
  );
}

/**
 * The one irreversible choice on a new account: it decides which question bank,
 * summaries and analytics the account will ever see, and only an admin can move
 * an account afterwards. Blocking on purpose: no default, no skipping.
 */
export function TrackDialog({
  visible,
  studyTrack,
  onSelect,
  onConfirm,
}: {
  visible: boolean;
  studyTrack: TrackKey | null;
  onSelect: (key: TrackKey) => void;
  onConfirm: () => void;
}) {
  const t = useCopy(authCopy).trackModal;
  const { lang } = useLang();
  return (
    <Dialog visible={visible} blocking>
      <View style={{ gap: 4 }}>
        <T weight="bold" size={12} color={colors.primary}>
          {t.eyebrow}
        </T>
        <T weight="extrabold" size={19}>
          {t.title}
        </T>
        <T size={13} color={colors.textMedium}>
          {t.body}
        </T>
      </View>
      {TRACK_KEYS.map((key) => {
        const def = TRACKS[key];
        const selected = studyTrack === key;
        return (
          <TouchableOpacity
            key={key}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(key)}
            style={{
              borderRadius: radius.lg,
              borderWidth: 2,
              borderColor: selected ? colors.primary : colors.border,
              backgroundColor: selected ? colors.infoBg : colors.surface,
              padding: 14,
              gap: 6,
            }}
          >
            <Row gap={12}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.md,
                  backgroundColor: colors.surfaceTint,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={def.icon} size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <T weight="extrabold" size={16}>
                  {pick(def.label, lang)}
                </T>
                <T size={12} color={colors.textLight}>
                  {pick(def.exam, lang)}
                </T>
              </View>
              {selected ? <Icon name="check-circle" size={22} color={colors.primary} /> : null}
            </Row>
            <T size={13} color={colors.textMedium}>
              {pick(def.blurb, lang)}
            </T>
          </TouchableOpacity>
        );
      })}
      <Button
        label={studyTrack ? t.confirm(pick(TRACKS[studyTrack].label, lang)) : t.confirmEmpty}
        onPress={onConfirm}
        disabled={!studyTrack}
      />
      <Row gap={6} align="flex-start">
        <Icon name="info" size={14} color={colors.textLight} />
        <T size={12} color={colors.textLight} style={{ flex: 1 }}>
          {t.note}
        </T>
      </Row>
    </Dialog>
  );
}

export const goTo = {
  login: () => router.push('/login'),
  signup: () => router.push('/signup'),
};
