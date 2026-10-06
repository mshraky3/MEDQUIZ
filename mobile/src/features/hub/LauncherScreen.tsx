import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { formatNumber, useCopy, useLang } from '@/i18n';
import quizCopy from '@/i18n/copy/quiz.js';
import { ApiError, api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { getSourceLabel, getTypeLabel } from '@/lib/labels';
import { EXAM, STUDY, useQuizMode } from '@/lib/quizMode';
import { examLabel, specialtyKeys, trackLabel, userTrack } from '@/lib/tracks';
import { useLoad } from '@/lib/useLoad';
import { colors, radius } from '@/theme';
import { Button, Card, Chip, Chevron, Dialog, Icon, Input, ProgressBar, Row, Screen, ScreenHeader, Spinner, T } from '@/ui';
import { WHOLE_BANK } from './HubScreen';

const COUNT_PRESETS = [10, 25, 50];
const MAX_QUESTIONS = 500;
const FEATURED_SOURCE = 'MedicalSeptemberRecall';

type SourceInfo = { key: string; total: number; priority?: number; completedPct?: number };
type ContentStatus = {
  hasQuestions?: boolean;
  selectableSources?: SourceInfo[];
  progressByType?: Record<string, number>;
};

const pctOf = (s: SourceInfo) => Math.min(100, Math.max(0, s.completedPct || 0));

/**
 * "Choose your quiz": one form where every choice is visible at once (source,
 * specialties, mode, size, timer) and the summary says what pressing start will
 * do. The mock exam keeps its own two-step dialog: it is a different activity
 * with its own question-count lookup rather than another setting on this one.
 */
export default function LauncherScreen() {
  const copy = useCopy(quizCopy);
  const t = copy.launcher;
  const { lang } = useLang();
  const { user } = useAuth();
  const id = user?.id;
  const fmt = (n: number) => formatNumber(n, lang);
  const myTrack = userTrack(user);
  const availableTypes = useMemo(() => specialtyKeys(myTrack), [myTrack]);

  const status = useLoad<ContentStatus>((signal) => api.get('/api/track-content-status', { signal }), []);
  const sources = Array.isArray(status.data?.selectableSources) ? status.data!.selectableSources! : [];
  const progressByType = status.data?.progressByType || {};
  const bankEmpty = status.data ? !status.data.hasQuestions : false;
  const totalSourceQuestions = sources.reduce((sum, s) => sum + (s.total || 0), 0);

  const [mode, setMode] = useQuizMode();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const activeSource = selectedSource || WHOLE_BANK;
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [numQuestions, setNumQuestions] = useState<string>(String(COUNT_PRESETS[0]));
  const [customCount, setCustomCount] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState<number | 'custom' | null>(null);
  const [customMinutes, setCustomMinutes] = useState('15');

  // Final (mock) exam flow.
  const [finalStep, setFinalStep] = useState<'closed' | 'type' | 'time'>('closed');
  const [finalType, setFinalType] = useState('');
  const [finalCount, setFinalCount] = useState(0);
  const [finalLoading, setFinalLoading] = useState(false);
  const [finalMinutes, setFinalMinutes] = useState('30');

  // Completion congratulations.
  const [congrats, setCongrats] = useState<{ type: string; source: string } | null>(null);
  const [restarting, setRestarting] = useState(false);

  const resolvedCount = Math.min(MAX_QUESTIONS, Math.max(1, Number(numQuestions) || COUNT_PRESETS[0]));
  const timerMinutes =
    selectedTimer === 'custom' ? Math.min(180, Math.max(1, Number(customMinutes) || 15)) : selectedTimer;

  // When the screen (or the chosen source) is ready, see whether a category has
  // just been completed; at most one popup at a time.
  useEffect(() => {
    if (!id || bankEmpty || !status.data) return undefined;
    let cancelled = false;
    (async () => {
      for (const type of availableTypes) {
        try {
          const r = await api.get(`/api/check-completion/${id}`, { params: { type, source: activeSource } });
          if (cancelled) return;
          if (r?.isCompleted && r.total > 0) {
            await api
              .post('/api/award-achievement', {
                userId: id,
                achievementType: 'cardinality_completion',
                achievementKey: `${type}_${activeSource}`,
                achievementName: t.achievementName(getTypeLabel(type, lang), getSourceLabel(activeSource, lang)),
                achievementDescription: t.achievementDesc(getTypeLabel(type, lang), getSourceLabel(activeSource, lang)),
              })
              .catch(() => {});
            if (!cancelled) setCongrats({ type, source: activeSource });
            return;
          }
        } catch {
          /* completion is a nicety: never block the launcher on it */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // `t` and `lang` only change the wording of an achievement we may award.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, activeSource, bankEmpty, !!status.data]);

  const restartCategory = async () => {
    if (!congrats || !id) return;
    setRestarting(true);
    try {
      await api.post('/api/reset-progress', { userId: id, type: congrats.type, source: congrats.source });
      setCongrats(null);
      void status.reload();
    } catch (err) {
      // Subscriber-only: send a lapsed account to the paywall rather than looking broken.
      if (err instanceof ApiError && err.status === 402) {
        setCongrats(null);
        router.push('/subscribe');
      }
    } finally {
      setRestarting(false);
    }
  };

  const toggleType = (type: string) =>
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((x) => x !== type) : [...prev, type]));

  const typesStr = selectedTypes.length > 0 ? selectedTypes.join(',') : 'mix';

  const start = () =>
    router.push({
      pathname: '/quiz',
      params: {
        count: String(resolvedCount),
        types: typesStr,
        source: activeSource,
        mode,
        ...(timerMinutes ? { timer: String(timerMinutes) } : {}),
      },
    });

  const pickFinalType = async (type: string) => {
    setFinalType(type);
    setFinalStep('time');
    setFinalCount(0);
    setFinalLoading(true);
    try {
      const r = await api.get('/final-quiz/questions-count', { params: { questionType: type, source: activeSource } });
      setFinalCount(r?.totalQuestions || 0);
    } catch {
      setFinalCount(0);
    } finally {
      setFinalLoading(false);
    }
  };

  const startFinal = (minutes: number) => {
    if (!finalCount || finalCount < 1) return; // never navigate to a quiz of zero
    setFinalStep('closed');
    router.push({
      pathname: '/quiz',
      params: { count: String(finalCount), types: finalType, source: activeSource, timer: String(minutes), final: '1', mode: EXAM },
    });
  };

  const featured = sources.find((s) => s.key === FEATURED_SOURCE) || null;
  const rest = sources.filter((s) => s !== featured);

  const summaryRows = [
    { label: t.modeLegend, value: mode === STUDY ? t.modeStudy : t.modeExam },
    ...(sources.length > 1 ? [{ label: t.sourceLegend, value: selectedSource ? getSourceLabel(selectedSource, lang) : t.sourceAll }] : []),
    {
      label: t.typesLegend,
      value: selectedTypes.length > 0 ? selectedTypes.map((x) => getTypeLabel(x, lang)).join('، ') : t.typesAll,
    },
    { label: t.countLegend, value: fmt(resolvedCount) },
    { label: t.timerLegend, value: timerMinutes ? `${fmt(timerMinutes)} ${t.minutes}` : t.noTimer },
  ];

  const header = <ScreenHeader title={t.title} subtitle={t.subtitleShort} />;

  if (status.loading) {
    return (
      <Screen header={header}>
        <Spinner fullScreen />
      </Screen>
    );
  }

  if (bankEmpty) {
    return (
      <Screen header={header}>
        <Card style={{ gap: 12, alignItems: 'center' }}>
          <T weight="extrabold" size={19} align="center">
            {t.emptyTitle(trackLabel(myTrack, lang))}
          </T>
          <T color={colors.textMedium} align="center">
            {t.emptyBody(examLabel(myTrack, lang))}
          </T>
          <Button label={t.emptyBack} onPress={() => router.replace('/(tabs)')} />
        </Card>
      </Screen>
    );
  }

  const sectionTitle = (icon: string, label: string) => (
    <Row gap={8}>
      <Icon name={icon} size={16} color={colors.primary} />
      <T weight="extrabold" size={15}>
        {label}
      </T>
    </Row>
  );

  return (
    <Screen
      header={header}
      footer={
        <View style={{ padding: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Button label={t.startQuiz} icon="rocket" size="lg" onPress={start} />
        </View>
      }
    >
      {/* Collections, when the track has more than one. */}
      {sources.length > 1 ? (
        <Card style={{ gap: 10 }}>
          {sectionTitle('book-open', t.sourceLegend)}
          {featured ? (
            <TouchableOpacity activeOpacity={0.85} onPress={() => setSelectedSource(featured.key)} accessibilityRole="radio" accessibilityState={{ selected: selectedSource === featured.key }}>
              <View
                style={{
                  borderRadius: radius.lg,
                  borderWidth: 2,
                  borderColor: selectedSource === featured.key ? colors.primary : colors.border,
                  backgroundColor: selectedSource === featured.key ? colors.infoBg : colors.surface2,
                  padding: 14,
                  gap: 6,
                }}
              >
                <Row gap={8}>
                  <T weight="extrabold" size={15} style={{ flexShrink: 1 }}>
                    {getSourceLabel(featured.key, lang)}
                  </T>
                  <View style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 }}>
                    <T weight="bold" size={10} color={colors.white}>
                      {t.newTag}
                    </T>
                  </View>
                </Row>
                <T size={12} color={colors.textMedium}>
                  {t.featuredDesc}
                </T>
                <Row justify="space-between">
                  <T size={12} color={colors.textMedium}>
                    {fmt(featured.total)} {t.questionsUnit}
                  </T>
                  <T size={12} weight="semibold" color={colors.textMedium}>
                    {t.sourceDone(pctOf(featured))}
                  </T>
                </Row>
                <ProgressBar pct={pctOf(featured)} />
              </View>
            </TouchableOpacity>
          ) : null}

          {[{ key: '__all', total: totalSourceQuestions, all: true } as SourceInfo & { all?: boolean }, ...rest].map((s) => {
            const isAll = (s as { all?: boolean }).all;
            const selected = isAll ? selectedSource === null : selectedSource === s.key;
            return (
              <TouchableOpacity
                key={s.key}
                activeOpacity={0.85}
                onPress={() => setSelectedSource(isAll ? null : s.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <Row
                  gap={12}
                  style={{
                    borderRadius: radius.md,
                    borderWidth: 1.5,
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? colors.infoBg : colors.surface,
                    padding: 12,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: selected ? colors.primary : colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selected ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <T weight="bold" size={14}>
                      {isAll ? t.sourceAll : getSourceLabel(s.key, lang)}
                    </T>
                    <T size={12} color={colors.textLight}>
                      {fmt(s.total)} {t.questionsUnit}
                      {!isAll && s.priority ? ` · ${t.sourcePriorityBadge(s.priority)}` : ''}
                    </T>
                  </View>
                  {!isAll ? (
                    <T size={12} weight="semibold" color={colors.textMedium}>
                      {t.sourceDone(pctOf(s))}
                    </T>
                  ) : null}
                </Row>
              </TouchableOpacity>
            );
          })}
          <T size={12} color={colors.textLight}>
            {t.sourceRepeatHint}
          </T>
        </Card>
      ) : null}

      <Card style={{ gap: 10 }}>
        {sectionTitle('clipboard', t.typesLegend)}
        <Row wrap gap={8}>
          <Chip label={t.typesAll} selected={selectedTypes.length === 0} onPress={() => setSelectedTypes([])} />
          {availableTypes.map((type) => (
            <Chip
              key={type}
              label={getTypeLabel(type, lang)}
              sub={t.sourceDone(progressByType[type] || 0)}
              selected={selectedTypes.includes(type)}
              onPress={() => toggleType(type)}
            />
          ))}
        </Row>
      </Card>

      <Card style={{ gap: 16 }}>
        <View style={{ gap: 8 }}>
          {sectionTitle('lightbulb', t.modeLegend)}
          <Row wrap gap={8}>
            <Chip label={t.modeStudy} selected={mode === STUDY} onPress={() => setMode(STUDY)} />
            <Chip label={t.modeExam} selected={mode === EXAM} onPress={() => setMode(EXAM)} />
          </Row>
          <T size={12} color={colors.textLight}>
            {mode === STUDY ? t.modeStudyHint : t.modeExamHint}
          </T>
        </View>

        <View style={{ gap: 8 }}>
          {sectionTitle('pen', t.countLegend)}
          <Row wrap gap={8}>
            {COUNT_PRESETS.map((n) => (
              <Chip
                key={n}
                label={fmt(n)}
                selected={!customCount && Number(numQuestions) === n}
                onPress={() => {
                  setCustomCount(false);
                  setNumQuestions(String(n));
                }}
              />
            ))}
            <Chip label={t.customCount} selected={customCount} onPress={() => setCustomCount(true)} />
          </Row>
          {customCount ? (
            <Input
              label={t.customQuestionsLabel}
              value={numQuestions}
              onChangeText={(v) => setNumQuestions(v.replace(/\D/g, '').slice(0, 3))}
              keyboardType="number-pad"
              ltr
            />
          ) : null}
        </View>

        <View style={{ gap: 8 }}>
          {sectionTitle('clock', t.timerLegend)}
          <Row wrap gap={8}>
            <Chip label={t.noTimer} selected={selectedTimer === null} onPress={() => setSelectedTimer(null)} />
            {(t.timerOptions as { value: number | 'custom'; label: string }[]).map((timer) => (
              <Chip key={String(timer.value)} label={timer.label} selected={selectedTimer === timer.value} onPress={() => setSelectedTimer(timer.value)} />
            ))}
          </Row>
          {selectedTimer === 'custom' ? (
            <Input
              label={t.customMinutesLabel}
              value={customMinutes}
              onChangeText={(v) => setCustomMinutes(v.replace(/\D/g, '').slice(0, 3))}
              keyboardType="number-pad"
              ltr
            />
          ) : null}
        </View>
      </Card>

      <Card style={{ gap: 8, borderColor: colors.primary, borderWidth: 2 }}>
        {sectionTitle('rocket', t.yourQuiz)}
        {summaryRows.map((row) => (
          <Row key={row.label} justify="space-between" gap={12} align="flex-start">
            <T size={13} color={colors.textLight}>
              {row.label}
            </T>
            <T size={13} weight="bold" style={{ flexShrink: 1 }} align="end">
              {row.value}
            </T>
          </Row>
        ))}
      </Card>

      {user ? (
        <TouchableOpacity activeOpacity={0.85} onPress={() => setFinalStep('type')} accessibilityRole="button">
          <Row gap={12} style={{ backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: 14 }}>
            <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.warningBg, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="target" size={20} color={colors.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <T weight="bold" size={15}>
                {t.finalQuiz}
              </T>
              <T size={12} color={colors.textLight}>
                {t.finalTypeDesc}
              </T>
            </View>
            <Chevron />
          </Row>
        </TouchableOpacity>
      ) : null}

      {/* Mock exam: pick the specialty ... */}
      <Dialog visible={finalStep === 'type'} onClose={() => setFinalStep('closed')}>
        <Row gap={8}>
          <Icon name="target" size={19} color={colors.primary} />
          <T weight="bold" size={17} style={{ flex: 1 }}>
            {t.finalTypeTitle}
          </T>
        </Row>
        <T color={colors.textMedium}>{t.finalTypeDesc}</T>
        {availableTypes.map((type) => (
          <Button key={type} label={getTypeLabel(type, lang)} variant="secondary" onPress={() => void pickFinalType(type)} />
        ))}
        <Button label={t.cancel} variant="ghost" onPress={() => setFinalStep('closed')} />
      </Dialog>

      {/* ... then the time limit. */}
      <Dialog visible={finalStep === 'time'} onClose={() => setFinalStep('closed')}>
        <Row gap={8}>
          <Icon name="target" size={19} color={colors.primary} />
          <T weight="bold" size={17} style={{ flex: 1 }}>
            {t.finalTimeTitle}
          </T>
        </Row>
        <T color={colors.textMedium}>
          {finalLoading ? t.finalCounting : t.finalAvailable(finalCount, getTypeLabel(finalType, lang))}
        </T>
        {!finalLoading && finalCount < 1 ? (
          <>
            <T size={13} color={colors.warning}>
              {t.finalNotEnough}
            </T>
            <Button
              label={t.finalPickOther}
              variant="secondary"
              onPress={() => {
                setFinalStep('type');
              }}
            />
          </>
        ) : (
          <>
            <T size={13} color={colors.textLight}>
              {t.finalIncludesAll}
            </T>
            <Row wrap gap={8}>
              {[
                [30, t.final30],
                [60, t.final60],
                [90, t.final90],
                [120, t.final120],
              ].map(([m, label]) => (
                <Chip key={m as number} label={label as string} disabled={finalLoading} onPress={() => startFinal(m as number)} />
              ))}
            </Row>
            <Input
              label={t.finalCustomLabel}
              placeholder={t.finalCustomPlaceholder}
              value={finalMinutes}
              onChangeText={(v) => setFinalMinutes(v.replace(/\D/g, '').slice(0, 3))}
              keyboardType="number-pad"
              ltr
              trailing={
                <T size={13} color={colors.textLight}>
                  {t.minutes}
                </T>
              }
            />
            <Button
              label={t.startFinal}
              disabled={finalLoading}
              onPress={() => startFinal(Math.min(300, Math.max(30, parseInt(finalMinutes, 10) || 30)))}
            />
            <Button label={t.cancel} variant="ghost" onPress={() => setFinalStep('closed')} />
          </>
        )}
      </Dialog>

      {/* Category completed. */}
      <Dialog visible={!!congrats} onClose={() => setCongrats(null)}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Icon name="sparkles" size={34} color={colors.warning} />
          <T weight="extrabold" size={22}>
            {copy.congrats.title}
          </T>
          <Icon name="trophy" size={30} color={colors.warning} />
          {congrats ? (
            <>
              <T weight="bold" size={16} align="center">
                {t.achievementName(getTypeLabel(congrats.type, lang), getSourceLabel(congrats.source, lang))}
              </T>
              <T size={13} color={colors.textMedium} align="center">
                {t.achievementDesc(getTypeLabel(congrats.type, lang), getSourceLabel(congrats.source, lang))}
              </T>
              <T size={13} color={colors.textLight} align="center">
                {copy.congrats.completedAll}
              </T>
              <Row gap={8} wrap justify="center">
                <View style={{ backgroundColor: colors.infoBg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                  <T size={12} weight="bold" color={colors.primary}>
                    {getTypeLabel(congrats.type, lang)}
                  </T>
                </View>
                <View style={{ backgroundColor: colors.infoBg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                  <T size={12} weight="bold" color={colors.primary}>
                    {getSourceLabel(congrats.source, lang)}
                  </T>
                </View>
              </Row>
            </>
          ) : null}
        </View>
        <Button label={copy.congrats.restart} icon="refresh" onPress={() => void restartCategory()} loading={restarting} />
        <Button label={copy.congrats.close} icon="x" variant="secondary" onPress={() => setCongrats(null)} disabled={restarting} />
      </Dialog>
    </Screen>
  );
}
