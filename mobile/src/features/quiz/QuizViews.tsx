import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { formatNumber, useApp, useCopy, useLang } from '@/i18n';
import quizCopy from '@/i18n/copy/quiz.js';
import { api } from '@/lib/api';
import { getSourceLabel, getTypeLabel } from '@/lib/labels';
import { calculateBestWorstTopics, formatDuration, totalsFromTopics } from '@/lib/stats';
import { useAuth } from '@/lib/auth';
import { useLoad } from '@/lib/useLoad';
import { colors, radius } from '@/theme';
import { Button, Card, Dialog, Icon, Row, Screen, Spinner, T } from '@/ui';
import { ExplanationPanel } from '@/features/common/ExplanationPanel';
import type { AnswerRecord } from './quizLogic';
import type { SubmitState } from './useQuizSession';
import { StoryPrompt, useStoryPrompt } from './StoryPrompt';

export function LoadingView() {
  const t = useCopy(quizCopy).quiz;
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Spinner size="lg" />
        <T weight="bold" size={18} align="center">
          {t.loadingTitle}
        </T>
        <T color={colors.textLight} align="center">
          {t.loadingBody}
        </T>
      </View>
    </Screen>
  );
}

export function ErrorView({ message, onRetry, onBack }: { message: string; onRetry?: () => void; onBack: () => void }) {
  const t = useCopy(quizCopy).quiz;
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.errorBg, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="alert-triangle" size={30} color={colors.error} />
        </View>
        <T weight="bold" size={19} align="center">
          {t.errorTitle}
        </T>
        <T color={colors.textMedium} align="center">
          {message}
        </T>
        {onRetry ? <Button label={t.retry} icon="refresh" onPress={onRetry} /> : null}
        <Button label={t.back} variant="secondary" onPress={onBack} />
      </View>
    </Screen>
  );
}

/** Offered when an unfinished quiz of the same shape is found on the device. */
export function ResumeDialog({
  answered,
  total,
  onResume,
  onStartNew,
}: {
  answered: number;
  total: number;
  onResume: () => void;
  onStartNew: () => void;
}) {
  const app = useApp().quizApp;
  return (
    <Dialog visible blocking>
      <T weight="bold" size={18}>
        {app.resumeTitle}
      </T>
      <T color={colors.textMedium}>{app.resumeBody(answered, total)}</T>
      <Button label={app.resume} onPress={onResume} />
      <Button label={app.startNew} variant="secondary" onPress={onStartNew} />
    </Dialog>
  );
}

/** Shown when every question in the chosen category has been answered. */
export function CategoryCompleteView({
  sourceLabel,
  total,
  resetting,
  onRestart,
  onBack,
}: {
  sourceLabel: string;
  total: number;
  resetting: boolean;
  onRestart: () => void;
  onBack: () => void;
}) {
  const t = useCopy(quizCopy).complete;
  const { lang } = useLang();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card pad={22} style={{ alignItems: 'center', gap: 12 }}>
          <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: colors.warningBg, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="trophy" size={40} color={colors.warning} />
          </View>
          <T weight="extrabold" size={21} align="center">
            {t.title}
          </T>
          <T color={colors.textMedium} align="center">
            {t.bodyBefore} <T weight="bold">{sourceLabel}</T> {t.bodyAfter}
          </T>
          {total > 0 ? (
            <View style={{ alignItems: 'center' }}>
              <T weight="extrabold" size={34} color={colors.primary} ltr>
                {formatNumber(total, lang)}
              </T>
              <T size={13} color={colors.textLight}>
                {t.statLabel}
              </T>
            </View>
          ) : null}
          <Button label={resetting ? t.restarting : t.restart} icon="refresh" onPress={onRestart} loading={resetting} />
          <Button label={t.back} variant="secondary" onPress={onBack} disabled={resetting} />
        </Card>
      </View>
    </Screen>
  );
}

/**
 * The screen a student sees when their free questions run out: what they built
 * first (answered, accuracy, the specialty costing them marks, the wrong answers
 * waiting), then the ask. If the numbers cannot load, the ask renders on its own.
 */
export function AllowanceSpentView({ userId, onBack }: { userId?: number; onBack: () => void }) {
  const t = useCopy(quizCopy).quiz;
  const { lang } = useLang();
  const { data: stats, loading } = useLoad(
    async (signal) => {
      if (!userId) return null;
      const [topicsRes, wrongRes] = await Promise.all([
        api.get(`/topic-analysis/user/${userId}`, { signal }),
        api.get(`/wrong-questions/user/${userId}`, { params: { limit: 1 }, signal }).catch(() => null),
      ]);
      const topics = topicsRes || [];
      return {
        ...totalsFromTopics(topics),
        worst: calculateBestWorstTopics(topics).worst,
        wrongCount: wrongRes?.total ?? 0,
      };
    },
    [userId]
  );

  if (loading) {
    return (
      <Screen>
        <Spinner fullScreen />
      </Screen>
    );
  }
  const worstLabel = stats?.worst ? getTypeLabel(stats.worst.question_type, lang) : null;
  const hasProof = !!stats && stats.answered > 0;

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card pad={22} style={{ gap: 14 }}>
          {hasProof ? (
            <>
              <T weight="bold" size={12} color={colors.primary}>
                {t.spent.eyebrow}
              </T>
              <T weight="extrabold" size={22}>
                {t.spent.title}
              </T>
              <Row gap={12}>
                <Card flat style={{ flex: 1, alignItems: 'center' }} pad={12}>
                  <T weight="extrabold" size={26} color={colors.primary} ltr>
                    {stats!.answered}
                  </T>
                  <T size={12} color={colors.textLight}>
                    {t.spent.answered}
                  </T>
                </Card>
                <Card flat style={{ flex: 1, alignItems: 'center' }} pad={12}>
                  <T weight="extrabold" size={26} color={colors.primary} ltr>
                    {Math.round(stats!.accuracy)}%
                  </T>
                  <T size={12} color={colors.textLight}>
                    {t.spent.accuracy}
                  </T>
                </Card>
              </Row>
              {worstLabel ? (
                <Row gap={8} align="flex-start">
                  <Icon name="target" size={16} color={colors.warning} />
                  <T size={14} style={{ flex: 1 }}>
                    {t.spent.weakest(worstLabel, Math.round(stats!.worst!.accuracy))}
                  </T>
                </Row>
              ) : null}
              {stats!.wrongCount > 0 ? (
                <Row gap={8} align="flex-start">
                  <Icon name="alert-triangle" size={16} color={colors.warning} />
                  <T size={14} style={{ flex: 1 }}>
                    {t.spent.wrong(stats!.wrongCount)}
                  </T>
                </Row>
              ) : null}
              <T color={colors.textMedium}>{worstLabel ? t.spent.pitch(worstLabel) : t.spent.pitchGeneric}</T>
            </>
          ) : (
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Icon name="lock" size={38} color={colors.primary} />
              <T weight="extrabold" size={20} align="center">
                {t.paywallSpentTitle}
              </T>
              <T color={colors.textMedium} align="center">
                {t.paywallSpentBody}
              </T>
            </View>
          )}
          <Button label={t.paywallCta} size="lg" onPress={() => router.replace('/subscribe')} />
          {hasProof ? <Button label={t.spent.seeAnalysis} variant="secondary" onPress={() => router.replace('/(tabs)/analysis')} /> : null}
          <Button label={t.paywallBack} variant="ghost" onPress={onBack} />
        </Card>
      </View>
    </Screen>
  );
}

/** The other two 402s: an unanswered backlog (go finish it) or a subscriber-only quiz type. */
export function PaywallView({ backlog, onBack }: { backlog: boolean; onBack: () => void }) {
  const t = useCopy(quizCopy).quiz;
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card pad={22} style={{ alignItems: 'center', gap: 12 }}>
          <Icon name={backlog ? 'refresh' : 'lock'} size={40} color={colors.primary} />
          <T weight="extrabold" size={20} align="center">
            {backlog ? t.paywallBacklogTitle : t.paywallSubscriberTitle}
          </T>
          <T color={colors.textMedium} align="center">
            {backlog ? t.paywallBacklogBody : t.paywallSubscriberBody}
          </T>
          <Button label={backlog ? t.paywallBacklogCta : t.paywallCta} onPress={backlog ? onBack : () => router.replace('/subscribe')} />
          {!backlog ? <Button label={t.paywallBack} variant="secondary" onPress={onBack} /> : null}
        </Card>
      </View>
    </Screen>
  );
}

type ResultProps = {
  correctAnswers: number;
  totalQuestions: number;
  accuracy: string;
  duration: number;
  answers: AnswerRecord[];
  isFinalQuiz: boolean;
  completedTopics: { type: string; source: string }[];
  submitState: SubmitState;
  onRetrySubmit: () => void;
  onAnother: () => void;
  onHome: () => void;
};

/** The finished-quiz report: score, then a review of every question with its explanation. */
export function ResultView({
  correctAnswers,
  totalQuestions,
  accuracy,
  duration,
  answers,
  isFinalQuiz,
  completedTopics,
  submitState,
  onRetrySubmit,
  onAnother,
  onHome,
}: ResultProps) {
  const t = useCopy(quizCopy).result;
  const q = useCopy(quizCopy).quiz;
  const app = useApp().quizApp;
  const { lang, isRTL } = useLang();
  const { user } = useAuth();
  const wrongCount = answers.filter((a) => !a.isCorrect).length;
  // Asked at the top of a good result and nowhere else: goodwill is highest in
  // the seconds after someone does well. The bar is a strong score on a real quiz.
  const strong = totalQuestions >= 10 && Number(accuracy) >= 80;
  const story = useStoryPrompt({ username: user?.username, eligible: strong });
  // Students review mistakes first; fall back to everything on a perfect run.
  const [filter, setFilter] = useState<'wrong' | 'all'>(wrongCount > 0 ? 'wrong' : 'all');
  const visible = answers.map((answer, index) => ({ answer, index })).filter(({ answer }) => filter === 'all' || !answer.isCorrect);

  const pct = Number(accuracy);
  const tone = pct >= 75 ? colors.accuracyHigh : pct >= 50 ? colors.accuracyMid : colors.accuracyLow;

  return (
    <Screen contentStyle={{ gap: 14 }}>
      {completedTopics.length > 0 ? (
        <Row gap={10} style={{ backgroundColor: colors.warningBg, borderRadius: radius.lg, padding: 14 }} align="flex-start">
          <Icon name="trophy" size={20} color={colors.warning} />
          <T size={14} style={{ flex: 1 }} weight="semibold">
            {t.completedBannerBefore}{' '}
            {completedTopics.map((c) => `${getTypeLabel(c.type, lang)} · ${getSourceLabel(c.source, lang)}`).join(lang === 'ar' ? '، ' : ', ')}
          </T>
        </Row>
      ) : null}

      <Card pad={20} style={{ alignItems: 'center', gap: 6 }}>
        <T weight="extrabold" size={20}>
          {t.title}
        </T>
        <T weight="extrabold" size={44} color={tone} ltr style={{ lineHeight: 54 }}>
          {Math.round(pct)}%
        </T>
        <T color={colors.textMedium}>{t.score(correctAnswers, totalQuestions)}</T>
        <Row gap={6}>
          <T size={14} color={colors.textLight}>
            {t.accuracy}
          </T>
          <T weight="bold" size={14} ltr>
            {accuracy}%
          </T>
        </Row>
        <Row gap={6}>
          <T size={14} color={colors.textLight}>
            {t.duration}
          </T>
          <T weight="bold" size={14} ltr>
            {formatDuration(duration)}
          </T>
        </Row>
      </Card>

      {/* Saving status: a quiz the server never recorded must not look recorded. */}
      {submitState === 'sending' ? (
        <Row gap={8} justify="center">
          <Spinner size="sm" />
          <T size={13} color={colors.textLight}>
            {app.saving}
          </T>
        </Row>
      ) : submitState === 'failed' ? (
        <Card style={{ borderColor: colors.error, gap: 8 }} flat>
          <Row gap={8} align="flex-start">
            <Icon name="alert-triangle" size={17} color={colors.error} />
            <T size={13} color={colors.error} style={{ flex: 1 }}>
              {app.saveFailed}
            </T>
          </Row>
          <Button label={app.retrySave} icon="refresh" size="sm" onPress={onRetrySubmit} />
        </Card>
      ) : submitState === 'sent' ? (
        <Row gap={6} justify="center">
          <Icon name="check-circle" size={15} color={colors.success} />
          <T size={12} color={colors.textLight}>
            {app.saved}
          </T>
        </Row>
      ) : null}

      {story.show && user?.username ? <StoryPrompt username={user.username} onClose={story.dismiss} /> : null}

      <Button label={t.another} icon="rocket" size="lg" onPress={onAnother} />
      <Button
        label={t.viewAnalysis}
        variant="secondary"
        onPress={() =>
          router.replace(isFinalQuiz ? { pathname: '/(tabs)/analysis', params: { focus: 'mocks' } } : '/(tabs)/analysis')
        }
      />
      <Button label={q.paywallBack} variant="ghost" onPress={onHome} />

      {answers.length > 0 ? (
        <View style={{ gap: 12, marginTop: 6 }}>
          <T weight="extrabold" size={18}>
            {t.reviewTitle}
          </T>
          <Row gap={8} wrap accessibilityLabel={t.filterLabel}>
            {(['wrong', 'all'] as const).map((key) => {
              const on = filter === key;
              const disabled = key === 'wrong' && wrongCount === 0;
              return (
                <TouchableOpacity
                  key={key}
                  disabled={disabled}
                  onPress={() => setFilter(key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on, disabled }}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1.5,
                    borderColor: on ? colors.primary : colors.border,
                    backgroundColor: on ? colors.infoBg : colors.surface,
                    opacity: disabled ? 0.45 : 1,
                  }}
                >
                  <T weight="semibold" size={13} color={on ? colors.primary : colors.text}>
                    {key === 'wrong' ? t.filterWrong(wrongCount) : t.filterAll(answers.length)}
                  </T>
                </TouchableOpacity>
              );
            })}
          </Row>

          {visible.length === 0 ? (
            <Row gap={8} justify="center">
              <Icon name="sparkles" size={16} color={colors.success} />
              <T color={colors.textMedium}>{t.noWrong}</T>
            </Row>
          ) : (
            visible.map(({ answer, index }) => (
              <Card
                key={index}
                pad={14}
                style={[{ gap: 10 }, isRTL ? { borderRightWidth: 4, borderRightColor: answer.isCorrect ? colors.success : colors.error } : { borderLeftWidth: 4, borderLeftColor: answer.isCorrect ? colors.success : colors.error }]}
              >
                <Row gap={8} wrap>
                  <T weight="bold" size={12} color={colors.textLight}>
                    {t.questionNo(index + 1)}
                  </T>
                  <T size={12} color={colors.textMedium}>
                    {getTypeLabel(answer.topic, lang)}
                  </T>
                  <Row gap={4}>
                    <Icon name={answer.isCorrect ? 'check-circle' : 'x-circle'} size={14} color={answer.isCorrect ? colors.success : colors.error} />
                    <T weight="bold" size={12} color={answer.isCorrect ? colors.success : colors.error}>
                      {answer.isCorrect ? t.correct : t.wrong}
                    </T>
                  </Row>
                </Row>
                <T ltr size={15}>
                  {answer.question}
                </T>
                <View style={{ gap: 6 }}>
                  {answer.selected ? (
                    <View style={{ backgroundColor: answer.isCorrect ? colors.successBg : colors.errorBg, borderRadius: radius.md, padding: 10, gap: 2 }}>
                      <T size={11} weight="bold" color={answer.isCorrect ? colors.success : colors.error}>
                        {t.yourAnswer}
                      </T>
                      <T ltr size={14}>
                        {answer.selected}
                      </T>
                    </View>
                  ) : (
                    <View style={{ backgroundColor: colors.errorBg, borderRadius: radius.md, padding: 10 }}>
                      <T size={13} color={colors.error} weight="semibold">
                        {t.unanswered}
                      </T>
                    </View>
                  )}
                  {!answer.isCorrect ? (
                    <View style={{ backgroundColor: colors.successBg, borderRadius: radius.md, padding: 10, gap: 2 }}>
                      <T size={11} weight="bold" color={colors.success}>
                        {t.correctAnswer}
                      </T>
                      <T ltr size={14}>
                        {answer.correct}
                      </T>
                    </View>
                  ) : null}
                </View>
                <ExplanationPanel explanation={answer.explanation} />
              </Card>
            ))
          )}
        </View>
      ) : null}
    </Screen>
  );
}
