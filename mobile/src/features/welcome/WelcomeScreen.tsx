import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { formatDate, formatNumber, useCopy, useLang } from '@/i18n';
import landingCopy from '@/i18n/copy/landing.js';
import { api } from '@/lib/api';
import { MEDICAL, NURSING, TRACKS, TrackKey, pick } from '@/lib/tracks';
import { colors, radius } from '@/theme';
import { Button, Card, Icon, Row, Screen, T } from '@/ui';
import { LanguageToggle } from '@/features/common/LanguageToggle';
import { SiteFooter } from '@/features/common/SiteFooter';

/**
 * The worked example inside the explanations section: a shortened but faithful
 * copy of a real entry from the bank. It is NOT translated: explanations are
 * study content and render in English in both UI languages.
 */
const EXPLANATION_SAMPLE = {
  stem: 'Primary dysmenorrhea — why is this the answer?',
  blocks: [
    {
      label: 'Core Concept:',
      lines: ['Excess endometrial prostaglandin (PGF2α) drives uterine hypercontractility and ischaemia, with no underlying pelvic pathology.'],
    },
    {
      label: 'Clinical Presentation:',
      lines: ['Crampy suprapubic pain starting with the flow, settling within 48–72 hours.', 'Regular cycles, onset within a few years of menarche.'],
    },
    {
      label: 'Diagnosis:',
      lines: [
        'Clinical, from the history and a normal examination.',
        'A normal pelvic ultrasound supports the diagnosis rather than making it — it is what separates this from endometriosis and adenomyosis.',
      ],
    },
    {
      label: 'Management:',
      lines: ['NSAIDs started at or just before the onset of flow, plus local heat.', 'Combined hormonal contraception when ongoing suppression is needed.'],
    },
  ],
};

type LiveStats = { questionsTotal: number; summaryDecks?: number; contentUpdatedAt?: string };

function SectionHead({ pill, title, body }: { pill?: string; title: string; body?: string }) {
  return (
    <View style={{ gap: 6 }}>
      {pill ? (
        <View style={{ alignSelf: 'flex-start', backgroundColor: colors.infoBg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
          <T weight="bold" size={12} color={colors.primary}>
            {pill}
          </T>
        </View>
      ) : null}
      <T weight="extrabold" size={21} style={{ lineHeight: 32 }}>
        {title}
      </T>
      {body ? <T color={colors.textMedium}>{body}</T> : null}
    </View>
  );
}

/** The signed-out front door: what SQB is, what it costs, and how to start. */
export default function WelcomeScreen() {
  const t = useCopy(landingCopy);
  const { lang } = useLang();
  const [stats, setStats] = useState<LiveStats | null>(null);

  // Bank size and deck count, counted from the database on request. Failure is
  // silent: the static trust list carries the page, and a broken number would
  // undo exactly the credibility this line is meant to build.
  useEffect(() => {
    const controller = new AbortController();
    api
      .get('/api/public/stats', { auth: false, signal: controller.signal, timeoutMs: 10_000 })
      .then((data) => {
        if (data?.success && data.questionsTotal > 0) setStats(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const goSignup = (track?: string) => router.push(track ? { pathname: '/signup', params: { track } } : '/signup');

  const studyTracks = ([MEDICAL, NURSING] as TrackKey[]).map((key) => ({
    key,
    icon: TRACKS[key].icon,
    title: pick(TRACKS[key].label, lang),
    exam: pick(TRACKS[key].exam, lang),
    desc: key === MEDICAL ? t.tracks.medicalDesc : t.tracks.nursingDesc,
    specialties: TRACKS[key].specialties.map((sp) => pick(sp.label, lang)),
  }));

  const compareColumns = [
    { key: 'sqb', label: t.compare.colSqb, icon: 'sparkles', badge: t.compare.badge },
    { key: 'files', label: t.compare.colFiles, icon: 'folder' },
    { key: 'courses', label: t.compare.colCourses, icon: 'users' },
  ];

  return (
    <Screen
      header={
        <Row justify="space-between" style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          <T weight="extrabold" size={22} color={colors.primary} ltr>
            SQB
          </T>
          <Row gap={8}>
            <LanguageToggle compact />
            <TouchableOpacity onPress={() => router.push('/login')} hitSlop={8} accessibilityRole="button">
              <T weight="bold" size={14} color={colors.primary}>
                {t.topbar.login}
              </T>
            </TouchableOpacity>
          </Row>
        </Row>
      }
      contentStyle={{ gap: 28 }}
    >
      {/* Hero */}
      <View style={{ gap: 14, paddingTop: 6 }}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => goSignup()}>
          <Row
            gap={8}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.surface,
              borderWidth: 1.5,
              borderColor: colors.border,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <View style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 }}>
              <T weight="bold" size={11} color={colors.white}>
                {t.hero.newTag}
              </T>
            </View>
            <T weight="semibold" size={12} style={{ flexShrink: 1 }}>
              {t.hero.newSet}
            </T>
          </Row>
        </TouchableOpacity>
        <View style={{ alignSelf: 'flex-start', backgroundColor: colors.infoBg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
          <T weight="bold" size={12} color={colors.primary}>
            {t.hero.pill}
          </T>
        </View>
        <T weight="extrabold" size={30} style={{ lineHeight: 46 }}>
          {t.hero.title}
        </T>
        <T size={16} color={colors.textMedium}>
          {t.hero.body}
        </T>
        <Button label={t.hero.primary} onPress={() => goSignup()} size="lg" />
        <Button label={t.hero.secondary} variant="secondary" onPress={() => router.push('/login')} size="lg" />
        <View style={{ gap: 6 }}>
          {t.hero.trust.map((item: string) => (
            <Row key={item} gap={8}>
              <Icon name="check-circle" size={16} color={colors.success} />
              <T size={14} color={colors.textMedium} style={{ flex: 1 }}>
                {item}
              </T>
            </Row>
          ))}
        </View>
        {stats ? (
          <Row wrap gap={14}>
            <T size={13} weight="semibold" color={colors.primary}>
              {t.hero.liveQuestions(formatNumber(stats.questionsTotal, lang))}
            </T>
            {stats.summaryDecks ? (
              <T size={13} weight="semibold" color={colors.primary}>
                {t.hero.liveDecks(formatNumber(stats.summaryDecks, lang))}
              </T>
            ) : null}
            {stats.contentUpdatedAt ? (
              <T size={13} weight="semibold" color={colors.primary}>
                {t.hero.liveUpdated(formatDate(stats.contentUpdatedAt, lang))}
              </T>
            ) : null}
          </Row>
        ) : null}
      </View>

      {/* Tracks */}
      <View style={{ gap: 14 }}>
        <SectionHead pill={t.tracks.pill} title={t.tracks.title} body={t.tracks.body} />
        {studyTracks.map((st) => (
          <Card key={st.key} style={{ gap: 10 }}>
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
                <Icon name={st.icon} size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <T weight="extrabold" size={17}>
                  {st.title}
                </T>
                <T size={12} color={colors.textLight}>
                  {st.exam}
                </T>
              </View>
              <View style={{ backgroundColor: colors.successBg, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 }}>
                <T weight="bold" size={11} color={colors.success}>
                  {t.tracks.ready}
                </T>
              </View>
            </Row>
            <T color={colors.textMedium} size={14}>
              {st.desc}
            </T>
            <Row wrap gap={6}>
              {st.specialties.map((sp) => (
                <View key={sp} style={{ backgroundColor: colors.surface2, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <T size={12} color={colors.textMedium}>
                    {sp}
                  </T>
                </View>
              ))}
            </Row>
            <Button label={t.tracks.cardCta(st.title)} onPress={() => goSignup(st.key)} />
          </Card>
        ))}
        <T size={12} color={colors.textLight} align="center">
          {t.tracks.ctaNote}
        </T>
      </View>

      {/* Compare */}
      <View style={{ gap: 14 }}>
        <SectionHead pill={t.compare.pill} title={t.compare.title} body={t.compare.body} />
        {compareColumns.map((col) => (
          <Card
            key={col.key}
            style={[{ gap: 10 }, col.key === 'sqb' ? { borderColor: colors.primary, borderWidth: 2 } : null]}
          >
            <Row gap={10}>
              <Icon name={col.icon} size={20} color={col.key === 'sqb' ? colors.primary : colors.textMedium} />
              <T weight="extrabold" size={16} style={{ flex: 1 }}>
                {col.label}
              </T>
              {col.badge ? (
                <View style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 }}>
                  <T weight="bold" size={11} color={colors.white}>
                    {col.badge}
                  </T>
                </View>
              ) : null}
            </Row>
            {t.compare.rows.map((row: Record<string, string>) => (
              <View key={row.label} style={{ gap: 1 }}>
                <T size={12} color={colors.textLight} weight="semibold">
                  {row.label}
                </T>
                <T size={14}>{row[col.key]}</T>
              </View>
            ))}
          </Card>
        ))}
        <Button label={t.compare.cta} onPress={() => goSignup()} />
        <T size={12} color={colors.textLight} align="center">
          {t.compare.ctaNote}
        </T>
      </View>

      {/* Explanations */}
      <View style={{ gap: 14 }}>
        <SectionHead pill={t.explain.pill} title={t.explain.title} body={t.explain.body} />
        {t.explain.points.map((point: { icon: string; title: string; desc: string }) => (
          <Row key={point.title} gap={12} align="flex-start">
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: radius.md,
                backgroundColor: colors.surfaceTint,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={point.icon} size={21} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <T weight="bold" size={15}>
                {point.title}
              </T>
              <T size={13} color={colors.textMedium}>
                {point.desc}
              </T>
            </View>
          </Row>
        ))}
        <Card style={{ gap: 8 }}>
          <Row gap={8}>
            <Icon name="lightbulb" size={16} color={colors.primary} />
            <T weight="bold" size={14} color={colors.primary}>
              {t.explain.sampleTitle}
            </T>
          </Row>
          <T ltr weight="bold" size={14}>
            {EXPLANATION_SAMPLE.stem}
          </T>
          {EXPLANATION_SAMPLE.blocks.map((block) => (
            <View key={block.label} style={{ gap: 2 }}>
              <T ltr weight="bold" size={13}>
                {block.label}
              </T>
              {block.lines.map((line) => (
                <Row key={line} gap={6} align="flex-start" ltr>
                  <T ltr size={13} color={colors.textMedium}>
                    •
                  </T>
                  <T ltr size={13} color={colors.textMedium} style={{ flex: 1 }}>
                    {line}
                  </T>
                </Row>
              ))}
            </View>
          ))}
        </Card>
        <Button label={t.explain.cta} onPress={() => goSignup()} />
        <T size={12} color={colors.textLight} align="center">
          {t.explain.ctaNote}
        </T>
      </View>

      {/* Flow */}
      <Card style={{ gap: 12 }}>
        <SectionHead pill={t.flow.pill} title={t.flow.title} body={t.flow.body} />
        {t.flow.steps.map((step: { label: string; hint: string }, index: number) => (
          <Row key={step.label} gap={12} align="flex-start">
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <T weight="extrabold" size={14} color={colors.white} ltr>
                {`0${index + 1}`}
              </T>
            </View>
            <View style={{ flex: 1 }}>
              <T weight="bold" size={15}>
                {step.label}
              </T>
              <T size={13} color={colors.textMedium}>
                {step.hint}
              </T>
            </View>
          </Row>
        ))}
        <Button label={t.flow.cta} onPress={() => goSignup()} />
        <T size={12} color={colors.textLight} align="center">
          {t.flow.ctaNote}
        </T>
      </Card>

      {/* Value and pricing */}
      <View style={{ gap: 14 }}>
        <SectionHead pill={t.value.pill} title={t.value.title} body={t.value.body} />
        <Row wrap gap={8}>
          {t.value.points.map((point: { icon: string; title: string }) => (
            <Row
              key={point.title}
              gap={6}
              style={{ backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 }}
            >
              <Icon name={point.icon} size={15} color={colors.primary} />
              <T size={12} weight="semibold" style={{ flexShrink: 1 }}>
                {point.title}
              </T>
            </Row>
          ))}
        </Row>

        <Card style={{ gap: 8 }}>
          <T size={13} color={colors.textLight} weight="semibold">
            {t.value.plan}
          </T>
          <Row gap={6} align="flex-end">
            <T weight="extrabold" size={40} color={colors.primary} ltr style={{ lineHeight: 48 }}>
              {t.value.amount}
            </T>
            <T weight="bold" size={14} color={colors.textMedium} style={{ marginBottom: 8 }}>
              {t.value.currency}
            </T>
          </Row>
          <T size={13} color={colors.textMedium}>
            {t.value.perMonth}
          </T>
          {t.value.included.map((item: string) => (
            <Row key={item} gap={8} align="flex-start">
              <Icon name="check" size={16} color={colors.success} strokeWidth={3} />
              <T size={13} style={{ flex: 1 }}>
                {item}
              </T>
            </Row>
          ))}
          <Button label={t.value.cta} onPress={() => goSignup()} />
          <T size={12} color={colors.textLight}>
            {t.value.note}
          </T>
        </Card>

        <Card style={{ gap: 10, borderColor: colors.primary, borderWidth: 2 }}>
          <View style={{ alignSelf: 'flex-start', backgroundColor: colors.successBg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
            <T weight="bold" size={12} color={colors.success}>
              {t.value.group.badge}
            </T>
          </View>
          <T weight="extrabold" size={17}>
            {t.value.group.title}
          </T>
          <T size={13} color={colors.textMedium}>
            {t.value.group.body}
          </T>
          {t.value.group.tiers.map((tier: { label: string; price: string; each: string }) => (
            <Row key={tier.label} justify="space-between" style={{ backgroundColor: colors.surface2, borderRadius: radius.md, padding: 12 }}>
              <View style={{ flex: 1 }}>
                <T weight="bold" size={14}>
                  {tier.label}
                </T>
                <T size={12} color={colors.textLight}>
                  {tier.each}
                </T>
              </View>
              <T weight="extrabold" size={16} color={colors.primary}>
                {tier.price}
              </T>
            </Row>
          ))}
          <Button label={t.value.group.cta} variant="secondary" onPress={() => router.push('/groups')} />
        </Card>
      </View>

      {/* Final call to action */}
      <View style={{ backgroundColor: colors.navy, borderRadius: radius.xl, padding: 22, gap: 12 }}>
        <T weight="bold" size={12} color="#93c5fd">
          {t.ctaBand.visitor.pill}
        </T>
        <T weight="extrabold" size={21} color={colors.white} style={{ lineHeight: 32 }}>
          {t.ctaBand.visitor.title}
        </T>
        <T size={14} color="#cbd5e1">
          {t.ctaBand.visitor.body}
        </T>
        <Button label={t.ctaBand.visitor.primary} onPress={() => goSignup()} size="lg" />
        <Button label={t.ctaBand.visitor.secondary} variant="secondary" onPress={() => router.push('/login')} size="lg" />
        <T size={12} color="#94a3b8">
          {t.ctaBand.visitor.note}
        </T>
      </View>

      <SiteFooter />
    </Screen>
  );
}
