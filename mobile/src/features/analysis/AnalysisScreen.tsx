import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { formatNumber, useCopy, useLang } from '@/i18n';
import analysisCopy from '@/i18n/copy/analysis.js';
import { api, errorMessage, isAborted } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { getSourceLabel, getTypeLabel } from '@/lib/labels';
import { readQuizMode } from '@/lib/quizMode';
import { accuracyTone, calculateBestWorstTopics } from '@/lib/stats';
import { pick, specialtiesOf, userTrack } from '@/lib/tracks';
import { colors, radius, toneColor } from '@/theme';
import { Button, Card, Dialog, Icon, Input, ProgressBar, Row, Screen, Spinner, T } from '@/ui';
import { AppBar } from '@/features/common/chrome';
import { AttemptsList, FinalExams, LastQuizSummary, QuizHistory } from './sections';
import { BreakdownRow, BreakdownTable } from './parts';

// The sentinel every quiz-start call site uses for "the unified bank": it is
// what makes the "practise this" link land on a real, answerable quiz.
const QUIZ_SOURCE_SENTINEL = 'MidgardGameBoy';

const SECTION_IDS = ['an-specialties', 'an-sources', 'an-activity', 'an-mocks', 'an-last'] as const;
type SectionId = (typeof SECTION_IDS)[number];

function Section({ id, title, hint, onLayout, children }: { id: string; title: string; hint?: string; onLayout: (id: string, y: number) => void; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }} onLayout={(e: LayoutChangeEvent) => onLayout(id, e.nativeEvent.layout.y)}>
      <View style={{ gap: 2 }}>
        <T weight="extrabold" size={18}>
          {title}
        </T>
        {hint ? (
          <T size={12} color={colors.textLight}>
            {hint}
          </T>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/**
 * The performance report: one scorecard, then specialties, sources, activity,
 * mock exams and the last quiz's review. Every section opens in place.
 */
export default function AnalysisScreen() {
  const { user } = useAuth();
  const t = useCopy(analysisCopy);
  const { lang } = useLang();
  const params = useLocalSearchParams<{ focus?: string }>();
  const id = user?.id;
  const track = userTrack(user);
  const fmt = (n: number) => formatNumber(n, lang);
  const isSubscriber = user?.accessAllowed !== false;

  const [userAnalysis, setUserAnalysis] = useState<any>(null);
  const [streakData, setStreakData] = useState<any>(null);
  const [topicAnalysis, setTopicAnalysis] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [lastAttempts, setLastAttempts] = useState<any[]>([]);
  const [wrongCount, setWrongCount] = useState<number | null>(null);
  const [examInfo, setExamInfo] = useState<any>(null);
  const [summaryCoverage, setSummaryCoverage] = useState<{ topicsRead: number; topicsTotal: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bump, setBump] = useState(0); // remounts the paged panels after a reset

  const [showReset, setShowReset] = useState(false);
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState('');

  const scrollRef = useRef<ScrollView>(null);
  const offsets = useRef<Record<string, number>>({});
  const onSectionLayout = useCallback((sid: string, y: number) => {
    offsets.current[sid] = y;
  }, []);

  const fetchAll = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) return;
      try {
        const [ua, streak, topics, wrong, exam, sum, prog] = await Promise.all([
          api.get(`/user-analysis/${id}`, { signal }),
          api.get(`/user-streaks/${id}`, { signal }),
          api.get(`/topic-analysis/user/${id}`, { signal }),
          // limit=1: the count (`total`) is what this needs, not the rows.
          api.get(`/wrong-questions/user/${id}`, { params: { limit: 1 }, signal }),
          api.get('/api/exam-date', { signal }),
          // These two are not worth failing the page over.
          api.get('/api/summaries', { signal }).catch(() => null),
          api.get(`/quiz-sessions/progress/${id}`, { signal }).catch(() => null),
        ]);
        setUserAnalysis(ua);
        setStreakData(streak);
        setTopicAnalysis(topics || []);
        setWrongCount(wrong?.total ?? 0);
        setExamInfo(exam?.exam || null);
        setProgress(prog || null);

        // page_count is only known for decks somebody has opened, so the
        // denominator fills in over time.
        const decks: any[] = sum?.summaries || [];
        setSummaryCoverage(
          decks.length
            ? {
                topicsRead: decks.reduce((n, s) => n + (s.progress?.max_page_reached || 0), 0),
                topicsTotal: decks.reduce((n, s) => n + (s.page_count || 0), 0),
              }
            : null
        );

        const latestId = ua?.latest_quiz?.id;
        setLastAttempts(latestId ? (await api.get(`/question-attempts/session/${latestId}`, { signal })) || [] : []);
        setLoadError(null);
      } catch (err) {
        if (isAborted(err)) return;
        setLoadError(t.loadError);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id, t.loadError]
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchAll(controller.signal);
    return () => controller.abort();
    // fetchAll's identity changes with the language; a toggle must not refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    setBump((n) => n + 1);
  }, [fetchAll]);

  // Arriving from a finished mock exam: bring that section into view.
  useEffect(() => {
    if (loading || params.focus !== 'mocks') return;
    const handle = setTimeout(() => scrollRef.current?.scrollTo({ y: Math.max(0, (offsets.current['an-mocks'] || 0) - 8), animated: true }), 350);
    return () => clearTimeout(handle);
  }, [loading, params.focus]);

  const { worst } = useMemo(() => calculateBestWorstTopics(topicAnalysis), [topicAnalysis]);

  const overallAccuracy = useMemo(() => {
    const answered = userAnalysis?.total_questions_answered;
    const correct = userAnalysis?.total_correct_answers;
    return answered ? (Number(correct || 0) / Number(answered)) * 100 : null;
  }, [userAnalysis]);

  const specialtyRows: BreakdownRow[] = useMemo(
    () =>
      specialtiesOf(track).map((sp) => {
        const topic = topicAnalysis.find((r) => r.question_type === sp.key);
        const answered = Number(topic?.total_answered) || 0;
        const cov = progress?.typeBreakdown?.[sp.key] || { answered: 0, total: 0 };
        return {
          key: sp.key,
          label: pick(sp.label, lang),
          icon: sp.icon,
          accuracy: answered > 0 ? (Number(topic.total_correct) / answered) * 100 : null,
          covered: cov.answered,
          total: cov.total,
        };
      }),
    [track, topicAnalysis, progress, lang]
  );

  // Only sources that still have questions in this track's bank: retired
  // collections survive in old quiz sessions but would show a permanent 0%.
  const sourceRows: BreakdownRow[] = useMemo(() => {
    const bySource = new Map<string, any>((userAnalysis?.source_breakdown || []).map((s: any) => [s.source, s]));
    return (Object.entries(progress?.sourceBreakdown || {}) as [string, any][])
      .filter(([, cov]) => cov.total > 0)
      .map(([key, cov]) => {
        const acc = bySource.get(key);
        const answered = Number(acc?.total_questions) || 0;
        return {
          key,
          label: getSourceLabel(key, lang),
          icon: 'book-open',
          accuracy: answered > 0 ? (Number(acc.total_correct) / answered) * 100 : null,
          covered: cov.answered,
          total: cov.total,
        };
      });
  }, [userAnalysis, progress, lang]);

  const practise = useCallback(async (types: string) => {
    const mode = await readQuizMode();
    router.push({ pathname: '/quiz', params: { count: '10', types, source: QUIZ_SOURCE_SENTINEL, mode } });
  }, []);

  const handleReset = async () => {
    setResetting(true);
    setResetError('');
    try {
      await api.post(`/user-analysis/${id}/reset`);
      setShowReset(false);
      setResetConfirm('');
      setResetting(false);
      setLoading(true);
      await fetchAll();
      setBump((n) => n + 1);
    } catch (err) {
      setResetError(errorMessage(err, t.reset.failed));
      setResetting(false);
    }
  };

  const header = <AppBar title={t.title} />;

  if (loading) {
    return (
      <Screen header={header}>
        <Spinner fullScreen label={t.loading} />
      </Screen>
    );
  }
  if (loadError && !userAnalysis) {
    return (
      <Screen header={header}>
        <Card style={{ gap: 12, alignItems: 'center' }}>
          <T color={colors.textMedium} align="center">
            {loadError}
          </T>
          <Button label={t.retry} onPress={() => void handleRefresh()} />
        </Card>
      </Screen>
    );
  }

  const sc = t.scorecard;
  const hasAnswers = (userAnalysis?.total_questions_answered || 0) > 0;
  const worstLabel = worst ? getTypeLabel(worst.question_type, lang) : null;
  const coveragePct = progress?.totalQuestions > 0 ? (progress.answeredQuestions / progress.totalQuestions) * 100 : null;
  const examDays = examInfo && !examInfo.passed ? examInfo.daysRemaining : null;
  const examValue =
    examInfo == null ? sc.examNone : examInfo.passed ? sc.examPassed : examDays === 0 ? sc.examToday : `${fmt(examDays)} ${sc.day}`;
  const minutes = (seconds: number) => (seconds ? (seconds / 60).toFixed(1) : '0');
  const sectionLabels: Record<SectionId, string> = {
    'an-specialties': t.sections.specialties,
    'an-sources': t.sections.sources,
    'an-activity': t.sections.activity,
    'an-mocks': t.sections.mockExams,
    'an-last': t.sections.lastQuiz,
  };

  return (
    <Screen
      header={header}
      scrollRef={scrollRef}
      contentStyle={{ gap: 22 }}
    >
      <Row justify="space-between">
        <T weight="extrabold" size={22}>
          {t.title}
        </T>
        <Button
          label={refreshing ? t.actions.refreshing : t.actions.refresh}
          icon="refresh"
          variant="secondary"
          size="sm"
          full={false}
          disabled={refreshing}
          onPress={() => void handleRefresh()}
        />
      </Row>

      {/* Jump chips: the section list the website shows as a side rail. */}
      <Row wrap gap={8} accessibilityLabel={t.sections.jump}>
        {SECTION_IDS.filter((sid) => sid !== 'an-sources' || sourceRows.length > 0).map((sid) => (
          <TouchableOpacity
            key={sid}
            accessibilityRole="button"
            onPress={() => scrollRef.current?.scrollTo({ y: Math.max(0, (offsets.current[sid] || 0) - 8), animated: true })}
            style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface }}
          >
            <T size={12} weight="semibold" color={colors.textMedium}>
              {sectionLabels[sid]}
            </T>
          </TouchableOpacity>
        ))}
      </Row>

      {/* Scorecard */}
      <Card pad={18} style={{ gap: 14 }}>
        {!hasAnswers ? (
          <View style={{ gap: 8, alignItems: 'center' }}>
            <T weight="extrabold" size={18} align="center">
              {sc.emptyTitle}
            </T>
            <T color={colors.textMedium} align="center">
              {sc.emptyBody}
            </T>
            <Button label={sc.emptyCta} onPress={() => router.replace('/(tabs)')} />
          </View>
        ) : (
          <>
            <Row justify="space-between" align="flex-start" gap={12}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <T weight="extrabold" size={44} ltr color={toneColor[accuracyTone(overallAccuracy)]} style={{ lineHeight: 54 }}>
                  {overallAccuracy == null ? '—' : `${overallAccuracy.toFixed(0)}%`}
                </T>
                <T size={12} color={colors.textLight}>
                  {sc.accuracy}
                </T>
              </View>
              <View style={{ gap: 10, flex: 1 }}>
                <View>
                  <T weight="extrabold" size={17} ltr>
                    {examValue}
                  </T>
                  <T size={12} color={colors.textLight}>
                    {sc.exam}
                  </T>
                </View>
                <View>
                  <T weight="extrabold" size={17} ltr>
                    {fmt(streakData?.current_streak ?? 0)}
                  </T>
                  <T size={12} color={colors.textLight}>
                    {sc.streak}
                  </T>
                </View>
              </View>
            </Row>

            {coveragePct != null ? (
              <View style={{ gap: 4 }}>
                <ProgressBar pct={coveragePct} />
                <T size={12} color={colors.textLight}>
                  {t.report.covered(fmt(progress.answeredQuestions), fmt(progress.totalQuestions))} · {coveragePct.toFixed(0)}% {sc.coverage}
                </T>
              </View>
            ) : null}

            {worst ? (
              <View style={{ gap: 8, backgroundColor: colors.surface2, borderRadius: radius.md, padding: 12 }}>
                <T size={13}>
                  {t.nextStep.weakestLabel}: <T weight="bold" size={13}>{worstLabel}</T>{' '}
                  <T weight="bold" size={13} ltr color={toneColor[accuracyTone(worst.accuracy)]}>
                    {Number(worst.accuracy).toFixed(0)}%
                  </T>
                </T>
                <Button label={t.nextStep.cta(worstLabel)} size="sm" onPress={() => void practise(worst.question_type)} />
              </View>
            ) : null}
            {wrongCount && wrongCount > 0 ? (
              <View style={{ gap: 8, backgroundColor: colors.surface2, borderRadius: radius.md, padding: 12 }}>
                <T size={13}>{t.nextStep.wrongCount(wrongCount)}</T>
                <Button label={t.actions.reviewWrong} variant="secondary" size="sm" onPress={() => router.push('/(tabs)/review')} />
              </View>
            ) : null}
            {summaryCoverage != null && summaryCoverage.topicsRead > 0 ? (
              <T size={13} color={colors.textMedium}>
                {summaryCoverage.topicsTotal >= summaryCoverage.topicsRead && summaryCoverage.topicsTotal > 0
                  ? t.nextStep.summaryCoverage(summaryCoverage.topicsRead, summaryCoverage.topicsTotal)
                  : t.nextStep.summaryRead(summaryCoverage.topicsRead)}
              </T>
            ) : null}
          </>
        )}
      </Card>

      <Section id="an-specialties" title={t.sections.specialties} hint={t.sections.specialtiesHint} onLayout={onSectionLayout}>
        <BreakdownTable rows={specialtyRows} onPractise={(row) => void practise(row.key)} />
      </Section>

      {sourceRows.length > 0 ? (
        <Section id="an-sources" title={t.sections.sources} onLayout={onSectionLayout}>
          <BreakdownTable rows={sourceRows} />
        </Section>
      ) : null}

      <Section id="an-activity" title={t.sections.activity} onLayout={onSectionLayout}>
        {hasAnswers ? (
          <Row wrap gap={10}>
            {[
              { k: 'sessions', value: fmt(userAnalysis.total_quizzes ?? 0), label: t.activity.sessions },
              { k: 'answered', value: fmt(userAnalysis.total_questions_answered ?? 0), label: t.activity.answered },
              { k: 'time', value: `${minutes(userAnalysis.total_duration)} ${t.activity.minutes}`, label: t.activity.totalTime },
              { k: 'avg', value: `${minutes(userAnalysis.avg_duration)} ${t.activity.minutes}`, label: t.activity.avgSession },
              { k: 'longest', value: `${fmt(streakData?.longest_streak ?? 0)} ${t.activity.days}`, label: t.activity.longestStreak },
            ].map((f) => (
              <Card key={f.k} flat pad={10} style={{ minWidth: '30%', flexGrow: 1, alignItems: 'center' }}>
                <T weight="extrabold" size={15} ltr align="center">
                  {f.value}
                </T>
                <T size={11} color={colors.textLight} align="center">
                  {f.label}
                </T>
              </Card>
            ))}
          </Row>
        ) : null}
        {id ? <QuizHistory key={`h${bump}`} userId={id} /> : null}
      </Section>

      <Section id="an-mocks" title={t.sections.mockExams} onLayout={onSectionLayout}>
        {id ? <FinalExams key={`f${bump}`} userId={id} /> : null}
      </Section>

      <Section id="an-last" title={t.sections.lastQuiz} onLayout={onSectionLayout}>
        <LastQuizSummary latest={userAnalysis?.latest_quiz} onRefresh={() => void handleRefresh()} />
        {userAnalysis?.latest_quiz?.id ? <AttemptsList attempts={lastAttempts} /> : null}
      </Section>

      {loadError ? (
        <Row gap={8} justify="space-between" style={{ backgroundColor: colors.errorBg, borderRadius: radius.md, padding: 12 }}>
          <T size={13} color={colors.error} style={{ flex: 1 }}>
            {loadError}
          </T>
          <TouchableOpacity onPress={() => void handleRefresh()} accessibilityLabel={t.retry} accessibilityRole="button">
            <Icon name="refresh" size={18} color={colors.error} />
          </TouchableOpacity>
        </Row>
      ) : null}

      <View style={{ gap: 10 }}>
        <Button label={t.actions.reviewWrong} icon="book-open" variant="secondary" onPress={() => router.push('/(tabs)/review')} />
        <Button label={t.actions.newQuiz} onPress={() => router.replace('/(tabs)')} />
      </View>

      {/* Danger zone: irreversible, so it sits apart. Subscribers only, matching the server. */}
      {isSubscriber ? (
        <Card style={{ gap: 10, borderColor: colors.error }} flat>
          <T weight="bold" size={14} color={colors.error}>
            {t.reset.zoneTitle}
          </T>
          <T size={13} color={colors.textMedium}>
            {t.reset.zoneBody}
          </T>
          <Button
            label={t.reset.zoneButton}
            icon="trash"
            variant="danger"
            size="sm"
            full={false}
            onPress={() => {
              setResetError('');
              setResetConfirm('');
              setShowReset(true);
            }}
          />
        </Card>
      ) : null}

      <Dialog visible={showReset} onClose={() => !resetting && setShowReset(false)}>
        <Row gap={8}>
          <Icon name="alert-triangle" size={19} color={colors.error} />
          <T weight="bold" size={17} style={{ flex: 1 }}>
            {t.reset.modalTitle}
          </T>
        </Row>
        <T color={colors.textMedium}>{t.reset.lead}</T>
        {(t.reset.items as string[]).map((item) => (
          <Row key={item} gap={8} align="flex-start">
            <T color={colors.error}>•</T>
            <T size={13} style={{ flex: 1 }}>
              {item}
            </T>
          </Row>
        ))}
        <Row gap={6} align="flex-start">
          <Icon name="check-circle" size={14} color={colors.success} />
          <T size={13} color={colors.success} style={{ flex: 1 }}>
            {t.reset.keep}
          </T>
        </Row>
        <Input
          label={`${t.reset.confirmLabelBefore} "${t.reset.confirmWord}" ${t.reset.confirmLabelAfter}`}
          value={resetConfirm}
          onChangeText={setResetConfirm}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!resetting}
        />
        {resetError ? <T size={13} color={colors.error}>{resetError}</T> : null}
        <Row gap={10}>
          <View style={{ flex: 1 }}>
            <Button label={t.reset.cancel} variant="secondary" onPress={() => setShowReset(false)} disabled={resetting} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label={resetting ? t.reset.deleting : t.reset.deleteAll}
              variant="danger"
              onPress={() => void handleReset()}
              loading={resetting}
              disabled={resetConfirm.trim() !== t.reset.confirmWord || resetting}
            />
          </View>
        </Row>
      </Dialog>
    </Screen>
  );
}
