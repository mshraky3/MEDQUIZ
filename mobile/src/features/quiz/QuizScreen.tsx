import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useApp, useCopy, useLang } from '@/i18n';
import quizCopy from '@/i18n/copy/quiz.js';
import { useAuth } from '@/lib/auth';
import { getSourceLabel } from '@/lib/labels';
import { colors } from '@/theme';
import { Button, Dialog, Icon, Row, T } from '@/ui';
import { QuestionView } from './QuestionView';
import {
  AllowanceSpentView,
  CategoryCompleteView,
  ErrorView,
  LoadingView,
  PaywallView,
  ResultView,
  ResumeDialog,
} from './QuizViews';
import { parseQuizParams } from './quizLogic';
import { useQuizSession } from './useQuizSession';

const goHome = () => router.replace('/(tabs)');

/**
 * /quiz: one screen that moves through loading, resume prompt, paywall, errors,
 * the question view and the result. All of the logic is in useQuizSession.
 */
export default function QuizScreen() {
  const raw = useLocalSearchParams();
  const params = useMemo(
    () => parseQuizParams(raw as Record<string, string | string[] | undefined>),
    // The route params are strings that do not change during a quiz.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [raw.count, raw.types, raw.source, raw.timer, raw.final, raw.mode]
  );
  const t = useCopy(quizCopy).quiz;
  const app = useApp();
  const { lang } = useLang();
  const { user } = useAuth();
  const quiz = useQuizSession(params);
  const [confirmExit, setConfirmExit] = useState(false);

  const inProgress = quiz.phase === 'question';

  // Android's back button must not silently drop a quiz in progress.
  useEffect(() => {
    if (!inProgress) return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setConfirmExit(true);
      return true;
    });
    return () => sub.remove();
  }, [inProgress]);

  const errorMessage = quiz.errorKey ? t[quiz.errorKey] : '';
  const onResetCategory = useCallback(async () => {
    const result = await quiz.resetCategory();
    if (result === 'subscribe') router.replace('/subscribe');
  }, [quiz]);

  if (quiz.phase === 'resume' && quiz.pendingResume) {
    return (
      <>
        <LoadingView />
        <ResumeDialog
          answered={Object.keys(quiz.pendingResume.questionAnswers || {}).length}
          total={quiz.pendingResume.questions.length}
          onResume={quiz.resume}
          onStartNew={() => void quiz.startNew()}
        />
      </>
    );
  }

  if (quiz.phase === 'loading') return <LoadingView />;

  if (quiz.phase === 'paywalled') {
    if (quiz.paywallReason === 'free_allowance_exhausted') return <AllowanceSpentView userId={user?.id} onBack={goHome} />;
    return <PaywallView backlog={quiz.paywallReason === 'unanswered_backlog'} onBack={goHome} />;
  }

  if (quiz.phase === 'categoryDone') {
    return (
      <CategoryCompleteView
        sourceLabel={getSourceLabel(params.source, lang)}
        total={quiz.categoryTotal}
        resetting={quiz.resettingCategory}
        onRestart={() => void onResetCategory()}
        onBack={() => router.replace('/launcher')}
      />
    );
  }

  if (quiz.phase === 'error') {
    return <ErrorView message={errorMessage} onRetry={quiz.retryFetch} onBack={goHome} />;
  }

  if (quiz.phase === 'finished') {
    return (
      <ResultView
        correctAnswers={quiz.score.correct}
        totalQuestions={quiz.score.total}
        accuracy={quiz.score.accuracy}
        duration={quiz.duration}
        answers={quiz.answerRecords}
        isFinalQuiz={params.isFinalQuiz}
        completedTopics={quiz.completedTopics}
        submitState={quiz.submitState}
        onRetrySubmit={quiz.retrySubmit}
        onAnother={quiz.startAnother}
        onHome={goHome}
      />
    );
  }

  if (!quiz.current) return <ErrorView message={t.errInvalidData} onRetry={quiz.retryFetch} onBack={goHome} />;

  return (
    <>
      <QuestionView
        // Remount per question so scroll position and the explanation reset.
        key={quiz.index}
        question={quiz.current}
        number={quiz.index + 1}
        total={quiz.total}
        selected={quiz.selected}
        revealed={quiz.isRevealed}
        timed={!!params.timerMinutes}
        timeRemaining={quiz.timeRemaining}
        onSelect={quiz.select}
        onNext={quiz.next}
        onPrevious={quiz.previous}
        onFinish={quiz.finish}
        onExit={() => setConfirmExit(true)}
      />

      <Dialog visible={quiz.showUnanswered} blocking scroll={false}>
        <Row gap={8}>
          <Icon name="alert-triangle" size={19} color={colors.warning} />
          <T weight="bold" size={16} style={{ flex: 1 }}>
            {t.unansweredTitle(quiz.unansweredCount)}
          </T>
        </Row>
        <T color={colors.textMedium}>
          {t.unansweredRedirectBefore} <T weight="extrabold" color={colors.primary} ltr>{quiz.countdown}</T>...
        </T>
      </Dialog>

      <Dialog visible={confirmExit} onClose={() => setConfirmExit(false)} scroll={false}>
        <T weight="bold" size={18}>
          {app.exit.title}
        </T>
        <T color={colors.textMedium}>{app.exit.body}</T>
        <View style={{ gap: 10 }}>
          <Button label={app.exit.stay} onPress={() => setConfirmExit(false)} />
          <Button
            label={app.exit.leave}
            variant="secondary"
            onPress={() => {
              setConfirmExit(false);
              goHome();
            }}
          />
        </View>
      </Dialog>
    </>
  );
}
