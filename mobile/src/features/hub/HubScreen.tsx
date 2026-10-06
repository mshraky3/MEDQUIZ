import React, { useCallback, useRef, useState } from 'react';
import { TouchableOpacity, View, Linking } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { TELEGRAM_CHANNEL_URL } from '@/config';
import { formatNumber, useCopy, useLang } from '@/i18n';
import quizCopy from '@/i18n/copy/quiz.js';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { getSourceLabel, getTypeLabel } from '@/lib/labels';
import { readQuizMode } from '@/lib/quizMode';
import { accuracyTone } from '@/lib/stats';
import { bankLabel, examLabel, normalizeTrack, specialtiesOf, trackLabel, userTrack } from '@/lib/tracks';
import { colors, radius, toneColor } from '@/theme';
import { Button, Card, Chevron, Icon, Notice, Row, T } from '@/ui';
import { TabScreen } from '@/features/common/TabScreen';
import { AchievementBadges } from './AchievementBadges';

// Single unified bank: the backend resolves this sentinel to the whole of the
// account's own track.
export const WHOLE_BANK = 'MidgardGameBoy';
// The collection promoted on the Questions panel while it is the freshest.
const FEATURED_SOURCE = 'MedicalSeptemberRecall';
// Ten discrete blocks always light at least one, so "barely started" looks
// deliberate rather than like a broken sliver of a progress bar.
const METER_BLOCKS = 10;
// Below this many answers an accuracy figure is noise: shown, but not coloured
// and never nominated as the weakest specialty.
const MIN_ACCURACY_SAMPLE = 10;
const STRUGGLING_ACCURACY = 50;
const REPORT_WORTH_READING = 100;

type SourceInfo = { key: string; total: number; priority?: number; completedPct?: number };
type ContentStatus = {
  hasQuestions?: boolean;
  hasSummaries?: boolean;
  track?: string;
  questionsByType?: Record<string, number>;
  selectableSources?: SourceInfo[];
  progressByType?: Record<string, number>;
};
type Stats = { total_quizzes: number; total_questions_answered: number; avg_accuracy: number };
type TopicRow = { question_type: string; total_answered: number | string; accuracy: number | string };

function SegMeter({ blocks }: { blocks: number }) {
  const { isRTL } = useLang();
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 3, flex: 1 }}>
      {Array.from({ length: METER_BLOCKS }, (_, i) => (
        <View
          key={i}
          style={{ flex: 1, height: 8, borderRadius: 3, backgroundColor: i < blocks ? colors.primary : colors.surfaceTint }}
        />
      ))}
    </View>
  );
}

/**
 * The post-login home, built as a study dashboard: headline stats, a one-tap
 * quick start, the question collections, and per-specialty mastery. All four
 * requests run through allSettled, so a stats failure never stops anyone
 * starting a quiz.
 */
export default function HubScreen() {
  const { user, updateUser } = useAuth();
  const t = useCopy(quizCopy).hub;
  const { lang } = useLang();
  const id = user?.id;
  const myTrack = userTrack(user);
  const specialties = specialtiesOf(myTrack);
  const fmt = (n: number) => formatNumber(n, lang);

  const [stats, setStats] = useState<Stats | null>(null);
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [wrongCount, setWrongCount] = useState<number | null>(null);
  const [content, setContent] = useState<ContentStatus | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const loadedOnce = useRef(false);

  const load = useCallback(async () => {
    if (!id) {
      setState('error');
      return;
    }
    if (!loadedOnce.current) setState('loading');
    const [analysisRes, topicRes, contentRes, wrongRes] = await Promise.allSettled([
      api.get(`/user-analysis/${id}`),
      api.get(`/topic-analysis/user/${id}`),
      api.get<ContentStatus>('/api/track-content-status'),
      // limit=1: this only wants the total the endpoint reports.
      api.get(`/wrong-questions/user/${id}`, { params: { limit: 1 } }),
    ]);
    if (contentRes.status === 'fulfilled') {
      setContent(contentRes.value);
      // The server is the authority on which track this account is on: an admin
      // can move an account at any time, and the stored session would otherwise
      // keep labelling the UI with the old track.
      const serverTrack = contentRes.value.track;
      if (serverTrack && normalizeTrack(user?.track) !== serverTrack) updateUser({ track: serverTrack });
    }
    if (analysisRes.status === 'fulfilled') {
      const d = analysisRes.value;
      setStats({
        total_quizzes: d.total_quizzes || 0,
        total_questions_answered: d.total_questions_answered || 0,
        avg_accuracy: d.avg_accuracy || 0,
      });
    }
    if (topicRes.status === 'fulfilled' && Array.isArray(topicRes.value)) setTopics(topicRes.value);
    if (wrongRes.status === 'fulfilled') setWrongCount(wrongRes.value?.total ?? null);
    setState(analysisRes.status === 'fulfilled' ? 'ready' : 'error');
    loadedOnce.current = true;
  }, [id, user?.track, updateUser]);

  // Reload whenever the tab is focused, so a finished quiz shows up straight away.
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const startQuiz = async (types: string, source: string = WHOLE_BANK) => {
    const mode = await readQuizMode();
    router.push({ pathname: '/quiz', params: { count: '10', types, source, mode } });
  };

  const firstName = user?.username ? String(user.username).split('@')[0].split(/[ _.]/).filter(Boolean)[0] || '' : '';
  const hasHistory = !!stats && stats.total_quizzes > 0;
  const loading = state === 'loading';

  const rows = specialties.map(({ key, icon }) => {
    const hit = topics.find((x) => x.question_type === key);
    const answered = hit ? parseInt(String(hit.total_answered), 10) || 0 : 0;
    const accuracy = hit ? Math.round(parseFloat(String(hit.accuracy)) || 0) : 0;
    const total = content?.questionsByType?.[key] || 0;
    const available = !content || total > 0;
    const coverage = total > 0 ? (answered / total) * 100 : 0;
    const blocks = answered > 0 ? Math.max(1, Math.min(METER_BLOCKS, Math.round((coverage / 100) * METER_BLOCKS))) : 0;
    return { key, icon, label: getTypeLabel(key, lang), answered, accuracy, available, total, blocks, solidSample: answered >= MIN_ACCURACY_SAMPLE };
  });

  const bankEmpty = content ? !content.hasQuestions : false;
  const summariesEmpty = content ? !content.hasSummaries : false;
  const bankTotal = rows.reduce((n, r) => n + r.total, 0);
  const bankAnswered = rows.reduce((n, r) => n + r.answered, 0);
  const bankRemaining = Math.max(0, bankTotal - bankAnswered);

  // Where to send them next. Accuracy only nominates a weakest specialty once at
  // least two carry a real sample; otherwise the least-covered one is suggested,
  // which is always true and always actionable.
  const rated = rows.filter((r) => r.solidSample);
  const weakestKey = rated.length >= 2 ? rated.reduce((a, b) => (a.accuracy <= b.accuracy ? a : b)).key : null;
  const startable = rows.filter((r) => r.available && r.total > 0);
  const leastCoveredKey =
    !weakestKey && startable.length > 0
      ? startable.reduce((a, b) => (a.answered / a.total <= b.answered / b.total ? a : b)).key
      : null;
  const suggestKey = weakestKey || leastCoveredKey;

  const accuracyNow = hasHistory ? Math.round(stats!.avg_accuracy) : null;
  const nextStep: 'summaries' | 'quiz' | 'analysis' | null =
    bankEmpty && summariesEmpty
      ? null
      : summariesEmpty
        ? 'quiz'
        : !hasHistory
          ? 'summaries'
          : accuracyNow! < STRUGGLING_ACCURACY
            ? 'summaries'
            : bankAnswered >= REPORT_WORTH_READING
              ? 'analysis'
              : 'quiz';

  const tiles = [
    { k: 'q', value: hasHistory ? fmt(stats!.total_questions_answered) : '—', label: t.kpiQuestions },
    { k: 'quiz', value: hasHistory ? fmt(stats!.total_quizzes) : '—', label: t.kpiQuizzes },
    { k: 'acc', value: hasHistory ? `${Math.round(stats!.avg_accuracy)}%` : '—', label: t.kpiAccuracy },
    { k: 'left', value: bankTotal > 0 ? fmt(bankRemaining) : '—', label: t.kpiRemaining },
  ];

  const sources = Array.isArray(content?.selectableSources) ? content!.selectableSources! : [];
  const featured = sources.find((s) => s.key === FEATURED_SOURCE) || null;
  const otherSources = sources.filter((s) => s !== featured);
  const pctOf = (s: SourceInfo) => Math.min(100, Math.max(0, s.completedPct || 0));

  const quizStat = bankEmpty ? t.inPreparation : hasHistory ? t.stepQuizStat(fmt(stats!.total_quizzes)) : t.stepQuizNotStarted;
  const summariesStat = summariesEmpty ? t.inPreparation : specialties.map((sp) => getTypeLabel(sp.key, lang)).join(' · ');
  const analysisStat = hasHistory ? t.stepAnalysisStat(Math.round(stats!.avg_accuracy)) : t.stepAnalysisEmpty;

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const sideCard = (key: 'summaries' | 'analysis', icon: string, title: string, stat: string, onPress: () => void) => (
    <TouchableOpacity key={key} activeOpacity={0.8} onPress={onPress} accessibilityRole="button">
      <Card
        style={[{ borderColor: nextStep === key ? colors.primary : colors.border, borderWidth: nextStep === key ? 2 : 1 }]}
        pad={14}
      >
        <Row gap={12}>
          <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surfaceTint, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Row gap={8} wrap>
              <T weight="bold" size={15}>
                {title}
              </T>
              {nextStep === key ? (
                <View style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 }}>
                  <T weight="bold" size={10} color={colors.white}>
                    {t.startHere}
                  </T>
                </View>
              ) : null}
            </Row>
            <T size={12} color={colors.textLight} numberOfLines={2}>
              {stat}
            </T>
          </View>
          <Chevron />
        </Row>
      </Card>
    </TouchableOpacity>
  );

  return (
    <TabScreen onRefresh={onRefresh} refreshing={refreshing}>
      <View style={{ gap: 4 }}>
        <T weight="extrabold" size={24}>
          {firstName ? (
            <>
              {t.greetingNamePrefix}
              <T weight="extrabold" size={24} ltr>
                {firstName}
              </T>
              {t.greetingNameSuffix}
            </>
          ) : (
            t.greeting
          )}
        </T>
        <T color={colors.textLight}>{t.subtitle}</T>
      </View>

      <Row wrap gap={10}>
        {tiles.map((tile) => (
          <Card key={tile.k} pad={12} style={{ width: '48%', flexGrow: 1, alignItems: 'center', gap: 2 }}>
            <T weight="extrabold" size={22} color={colors.primary} ltr align="center">
              {loading ? ' ' : tile.value}
            </T>
            <T size={12} color={colors.textLight} align="center">
              {tile.label}
            </T>
          </Card>
        ))}
      </Row>

      {bankEmpty || summariesEmpty ? (
        <Notice kind="info">
          <T weight="bold" size={14} color={colors.primary}>
            {bankEmpty && summariesEmpty
              ? t.noticeBoth(trackLabel(myTrack, lang))
              : bankEmpty
                ? t.noticeBank(trackLabel(myTrack, lang))
                : t.noticeSummaries(trackLabel(myTrack, lang))}
          </T>
          <T size={13} color={colors.primary}>
            {t.noticeBody(examLabel(myTrack, lang))}
            {!bankEmpty && t.noticeQuestionsReady}
            {!summariesEmpty && t.noticeSummariesReady}
            {bankEmpty && summariesEmpty && t.noticeWillEmail}
          </T>
        </Notice>
      ) : null}

      {/* Questions come first and biggest: it is where students spend most of their time. */}
      <Card
        pad={16}
        style={{ gap: 12, borderColor: nextStep === 'quiz' ? colors.primary : colors.border, borderWidth: nextStep === 'quiz' ? 2 : 1 }}
      >
        <Row gap={12} align="flex-start">
          <View style={{ width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="clipboard" size={26} color={colors.white} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Row gap={8} wrap>
              <T weight="extrabold" size={18}>
                {t.stepQuizTitle}
              </T>
              {nextStep === 'quiz' ? (
                <View style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 }}>
                  <T weight="bold" size={10} color={colors.white}>
                    {t.startHere}
                  </T>
                </View>
              ) : null}
            </Row>
            <T size={13} color={colors.textMedium}>
              {t.stepQuizDesc(bankLabel(myTrack, lang))}
            </T>
            <T size={12} weight="semibold" color={colors.primary}>
              {quizStat}
            </T>
          </View>
        </Row>
        <Button
          label={t.quickStart}
          icon="rocket"
          size="lg"
          disabled={bankEmpty}
          onPress={() => void startQuiz('mix')}
        />
        <T size={12} color={colors.textLight} align="center" style={{ marginTop: -6 }}>
          {bankEmpty ? t.unavailable : t.quickStartHint}
        </T>
        <Button label={t.customize} icon="settings" variant="secondary" disabled={bankEmpty} onPress={() => router.push('/launcher')} />

        {sources.length > 1 && !bankEmpty ? (
          <View style={{ gap: 8, marginTop: 4 }}>
            <T weight="bold" size={14}>
              {t.pickCollection}
            </T>
            {featured ? (
              <TouchableOpacity activeOpacity={0.85} onPress={() => void startQuiz('mix', featured.key)} accessibilityRole="button">
                <View style={{ backgroundColor: colors.infoBg, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.primary, padding: 14, gap: 4 }}>
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
                      {fmt(featured.total)} {t.questionsUnit} · {t.doneShort(pctOf(featured))}
                    </T>
                    <Row gap={2}>
                      <T weight="bold" size={12} color={colors.primary}>
                        {t.startShort}
                      </T>
                      <Chevron size={15} color={colors.primary} />
                    </Row>
                  </Row>
                </View>
              </TouchableOpacity>
            ) : null}
            {otherSources.map((s) => (
              <TouchableOpacity key={s.key} activeOpacity={0.85} onPress={() => void startQuiz('mix', s.key)} accessibilityRole="button">
                <Row
                  gap={10}
                  style={{ backgroundColor: colors.surface2, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 12 }}
                >
                  <View style={{ flex: 1 }}>
                    <T weight="bold" size={14}>
                      {getSourceLabel(s.key, lang)}
                    </T>
                    <T size={12} color={colors.textLight}>
                      {fmt(s.total)} {t.questionsUnit} · {t.doneShort(pctOf(s))}
                    </T>
                  </View>
                  <Chevron size={16} />
                </Row>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </Card>

      {/* The specialty ledger: how much of each pool is used up, the accuracy on
          what was answered, and one button to practise it. */}
      <View style={{ gap: 10 }}>
        <Row justify="space-between" wrap>
          <T weight="extrabold" size={17}>
            {t.performanceTitle}
          </T>
          {bankTotal > 0 ? (
            <T size={12} color={colors.textLight}>
              {t.bankNote(fmt(bankAnswered), fmt(bankTotal))}
            </T>
          ) : null}
        </Row>

        {state === 'error' ? (
          <Card style={{ gap: 10, alignItems: 'center' }}>
            <T color={colors.textMedium} align="center">
              {t.loadError}
            </T>
            <Button label={t.retry} icon="refresh" variant="secondary" size="sm" full={false} onPress={() => void load()} />
          </Card>
        ) : (
          rows.map((r) => {
            const isNext = r.key === suggestKey;
            const started = r.answered > 0;
            return (
              <Card
                key={r.key}
                pad={14}
                style={{ gap: 10, borderColor: isNext ? colors.primary : colors.border, borderWidth: isNext ? 2 : 1 }}
              >
                <Row gap={10}>
                  <View style={{ width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.surfaceTint, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={r.icon} size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <T weight="bold" size={15}>
                      {r.label}
                    </T>
                    {isNext ? (
                      <View style={{ alignSelf: 'flex-start', backgroundColor: colors.warningBg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 }}>
                        <T weight="bold" size={10} color={colors.warning}>
                          {r.key === weakestKey ? t.weakest : t.leastCovered}
                        </T>
                      </View>
                    ) : null}
                  </View>
                  <Button
                    label={!r.available ? t.soon : started ? t.practise : t.start}
                    size="sm"
                    full={false}
                    variant={isNext ? 'primary' : 'secondary'}
                    disabled={!r.available}
                    onPress={() => void startQuiz(r.key)}
                  />
                </Row>
                <Row gap={10}>
                  <SegMeter blocks={r.blocks} />
                </Row>
                <Row justify="space-between">
                  <T size={12} color={colors.textLight}>
                    {loading ? ' ' : r.total > 0 ? t.specCoverage(fmt(r.answered), fmt(r.total)) : t.specNotStarted}
                  </T>
                  <Row gap={4}>
                    <T
                      weight="extrabold"
                      size={14}
                      ltr
                      color={started && r.solidSample ? toneColor[accuracyTone(r.accuracy)] : colors.textLight}
                    >
                      {loading ? '' : started ? `${r.accuracy}%` : '—'}
                    </T>
                    <T size={11} color={colors.textLight}>
                      {started ? t.specAccuracyOf(fmt(r.answered)) : t.specNotStarted}
                    </T>
                  </Row>
                </Row>
              </Card>
            );
          })
        )}
        {!loading && state !== 'error' && !hasHistory ? (
          <T size={13} color={colors.textLight} align="center">
            {t.noHistory}
          </T>
        ) : null}
      </View>

      {sideCard('summaries', 'book-open', t.stepSummariesTitle, summariesStat, () => router.push('/(tabs)/summaries'))}
      {sideCard('analysis', 'bar-chart', t.stepAnalysisTitle, analysisStat, () => router.push('/(tabs)/analysis'))}

      {/* The wrong-answer review list, with how many are waiting. Hidden when there are none. */}
      {wrongCount && wrongCount > 0 ? (
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/(tabs)/review')} accessibilityRole="button">
          <Row gap={12} style={{ backgroundColor: colors.warningBg, borderRadius: radius.lg, padding: 14 }}>
            <Icon name="alert-triangle" size={22} color={colors.warning} />
            <View style={{ flex: 1 }}>
              <T weight="bold" size={15}>
                {t.reviewTitle}
              </T>
              <T size={13} color={colors.textMedium}>
                {t.reviewBody(fmt(wrongCount))}
              </T>
            </View>
            <Chevron />
          </Row>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity activeOpacity={0.85} onPress={() => Linking.openURL(TELEGRAM_CHANNEL_URL).catch(() => {})} accessibilityRole="link">
        <Row gap={12} style={{ backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: 14 }}>
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#229ED9', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="send" size={18} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <T weight="bold" size={14}>
              {t.telegramCtaTitle}
            </T>
            <T size={12} color={colors.textLight}>
              {t.telegramCtaSubtitle}
            </T>
          </View>
          <T weight="bold" size={12} color={colors.primary}>
            {t.telegramCtaButton}
          </T>
        </Row>
      </TouchableOpacity>

      {id ? <AchievementBadges userId={id} /> : null}
    </TabScreen>
  );
}
