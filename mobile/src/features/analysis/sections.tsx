import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { formatDateTime, useCopy, useLang } from '@/i18n';
import analysisCopy from '@/i18n/copy/analysis.js';
import { api, isAborted } from '@/lib/api';
import { getSourceLabel, getTypeLabel } from '@/lib/labels';
import { formatDuration } from '@/lib/stats';
import { colors, radius } from '@/theme';
import { Button, Card, Icon, Row, Spinner, T } from '@/ui';
import { AccuracyPill, Badge2, Pager, ReviewCard } from './parts';
import { ExplanationPanel } from '@/features/common/ExplanationPanel';

const PAGE_SIZE = 10;
const tone = (pct: number) => (pct >= 75 ? 'high' : pct >= 50 ? 'mid' : 'low');

const Note = ({ icon, title, body }: { icon: string; title: string; body?: string }) => (
  <Row gap={10} align="flex-start" style={{ backgroundColor: colors.surface2, borderRadius: radius.md, padding: 12 }}>
    <Icon name={icon} size={18} color={colors.primary} />
    <View style={{ flex: 1 }}>
      <T weight="bold" size={14}>
        {title}
      </T>
      {body ? (
        <T size={13} color={colors.textMedium}>
          {body}
        </T>
      ) : null}
    </View>
  </Row>
);

const Fact = ({ label, value }: { label: string; value: string }) => (
  <Row gap={4}>
    <T size={12} color={colors.textLight}>
      {label}
    </T>
    <T size={12} weight="bold" ltr>
      {value}
    </T>
  </Row>
);

/** The per-quiz history: pages of sessions that expand into their question reviews. */
export function QuizHistory({ userId }: { userId: number }) {
  const t = useCopy(analysisCopy).history;
  const { lang } = useLang();
  const [sessions, setSessions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const [details, setDetails] = useState<Record<number, any>>({});

  const fetchSessions = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(false);
      try {
        const res = await api.get(`/quiz-sessions/history/${userId}`, { params: { page, limit: PAGE_SIZE }, signal });
        setSessions(res.sessions || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (err) {
        if (isAborted(err)) return;
        setError(true);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    },
    [userId, page]
  );

  useEffect(() => {
    if (!userId) return undefined;
    const controller = new AbortController();
    void fetchSessions(controller.signal);
    return () => controller.abort();
  }, [userId, fetchSessions]);

  const toggle = async (sessionId: number) => {
    if (openId === sessionId) return setOpenId(null);
    setOpenId(sessionId);
    if (details[sessionId]) return;
    try {
      const res = await api.get(`/quiz-sessions/${sessionId}`);
      setDetails((prev) => ({ ...prev, [sessionId]: res }));
    } catch {
      setDetails((prev) => ({ ...prev, [sessionId]: { failed: true } }));
    }
  };

  const when = (d: string) => formatDateTime(d, lang, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading && sessions.length === 0) {
    return (
      <Row gap={8} justify="center" style={{ paddingVertical: 14 }}>
        <Spinner size="sm" />
        <T color={colors.textLight}>{t.loading}</T>
      </Row>
    );
  }
  if (error) {
    return (
      <View style={{ gap: 8, alignItems: 'center' }}>
        <T color={colors.error}>{t.error}</T>
        <Button label={t.retry} variant="secondary" size="sm" full={false} onPress={() => void fetchSessions()} />
      </View>
    );
  }
  if (sessions.length === 0) return <T color={colors.textLight}>{t.empty}</T>;

  return (
    <View style={{ gap: 10 }}>
      {sessions.map((s) => {
        const acc = parseFloat(s.quiz_accuracy || 0);
        const open = openId === s.id;
        const d = details[s.id];
        return (
          <Card key={s.id} pad={14} style={{ gap: 10 }}>
            <Row justify="space-between" gap={10}>
              <View style={{ flex: 1 }}>
                <T weight="bold" size={15}>
                  {getSourceLabel(s.source, lang)}
                </T>
                <T size={12} color={colors.textLight}>
                  {when(s.start_time)}
                </T>
              </View>
              <AccuracyPill pct={acc} tone={tone(acc)} />
            </Row>
            <Row wrap gap={14}>
              <Fact label={t.questions} value={String(s.total_questions)} />
              <Fact label={t.correct} value={String(s.correct_answers)} />
              <Fact label={t.duration} value={formatDuration(s.duration)} />
              <Fact label={t.avgTime} value={`${parseFloat(s.avg_time_per_question || 0).toFixed(1)}s`} />
            </Row>
            <Button label={open ? t.hideDetails : t.showDetails} variant="ghost" size="sm" full={false} onPress={() => void toggle(s.id)} />
            {open ? (
              <View style={{ gap: 10 }}>
                {!d ? (
                  <Spinner size="sm" />
                ) : d.failed ? (
                  <T color={colors.error}>{t.error}</T>
                ) : d.is_old_session ? (
                  <Note icon="info" title={t.oldSession} body={t.oldSessionHint} />
                ) : !d.question_attempts?.length ? (
                  <Note icon="clipboard" title={t.noDetails} body={t.noDetailsHint} />
                ) : (
                  <>
                    <T weight="bold" size={14}>
                      {t.attemptsTitle}
                    </T>
                    {d.question_attempts.map((q: any, i: number) => (
                      <ReviewCard
                        key={q.id || i}
                        typeLabel={q.question_type ? getTypeLabel(q.question_type, lang) : undefined}
                        sourceLabel={q.source ? getSourceLabel(q.source, lang) : undefined}
                        result={{ correct: !!q.is_correct, label: q.is_correct ? t.correctBadge : t.wrongBadge }}
                        question={q.question_text}
                        yourAnswer={q.selected_option}
                        yourAnswerLabel={t.yourAnswer}
                        correctAnswer={q.correct_option}
                        correctAnswerLabel={t.correctAnswer}
                        isCorrect={!!q.is_correct}
                      />
                    ))}
                  </>
                )}
              </View>
            ) : null}
          </Card>
        );
      })}
      <Pager page={page} totalPages={totalPages} onPage={setPage} labels={{ previous: t.previous, next: t.next, pageOf: t.pageOf }} />
    </View>
  );
}

/**
 * Mock exams (final review sessions). Same shape as QuizHistory, but the
 * expanded reviews carry explanations, since a mock exam is where a student
 * reviews the reasoning.
 */
export function FinalExams({ userId }: { userId: number }) {
  const t = useCopy(analysisCopy).finals;
  const { lang } = useLang();
  const [sessions, setSessions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Record<number, any>>({});

  const fetchSessions = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(false);
      try {
        const res = await api.get(`/final-quiz/sessions/${userId}`, { params: { page, limit: PAGE_SIZE }, signal });
        setSessions(res.sessions || []);
        setTotalPages(res.pagination?.total_pages || 1);
      } catch (err) {
        if (isAborted(err)) return;
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [userId, page]
  );

  useEffect(() => {
    if (!userId) return undefined;
    const controller = new AbortController();
    void fetchSessions(controller.signal);
    return () => controller.abort();
  }, [userId, fetchSessions]);

  const toggle = async (sessionId: number) => {
    if (openId === sessionId) return setOpenId(null);
    setOpenId(sessionId);
    if (questions[sessionId]) return;
    try {
      const res = await api.get(`/final-quiz/session/${sessionId}/questions`);
      setQuestions((prev) => ({ ...prev, [sessionId]: res.questions || [] }));
    } catch {
      setQuestions((prev) => ({ ...prev, [sessionId]: { failed: true } }));
    }
  };

  const when = (d: string) => formatDateTime(d, lang, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading && sessions.length === 0) {
    return (
      <Row gap={8} justify="center" style={{ paddingVertical: 14 }}>
        <Spinner size="sm" />
        <T color={colors.textLight}>{t.loading}</T>
      </Row>
    );
  }
  if (error) {
    return (
      <View style={{ gap: 8, alignItems: 'center' }}>
        <T color={colors.error}>{t.error}</T>
        <Button label={t.retry} variant="secondary" size="sm" full={false} onPress={() => void fetchSessions()} />
      </View>
    );
  }
  if (sessions.length === 0) return <Note icon="target" title={t.emptyTitle} body={`${t.emptyBody} ${t.emptyHint}`} />;

  return (
    <View style={{ gap: 10 }}>
      {sessions.map((s) => {
        const score = Number(s.score) || 0;
        const open = openId === s.id;
        const qs = questions[s.id];
        const perMinute = s.time_taken > 0 ? (s.total_questions / (s.time_taken / 60)).toFixed(1) : null;
        return (
          <Card key={s.id} pad={14} style={{ gap: 10 }}>
            <Row justify="space-between" gap={10}>
              <View style={{ flex: 1 }}>
                <T weight="bold" size={15}>
                  {getTypeLabel(s.question_type, lang)} — {getSourceLabel(s.source, lang)}
                </T>
                <T size={12} color={colors.textLight}>
                  {when(s.start_time)}
                </T>
              </View>
              <AccuracyPill pct={score} tone={tone(score)} />
            </Row>
            <Row wrap gap={14}>
              <Fact label={t.questions} value={`${s.correct_answers}/${s.total_questions}`} />
              <Fact label={t.time} value={formatDuration(s.time_taken)} />
              {s.time_limit > 0 ? <Fact label={t.timeLimit} value={formatDuration(s.time_limit)} /> : null}
              {perMinute ? <Fact label={t.timeEfficiency} value={`${perMinute} ${t.perMinute}`} /> : null}
            </Row>
            <Button label={open ? t.hideDetails : t.showDetails} variant="ghost" size="sm" full={false} onPress={() => void toggle(s.id)} />
            {open ? (
              <View style={{ gap: 10 }}>
                {!qs ? (
                  <Row gap={8} justify="center">
                    <Spinner size="sm" />
                    <T color={colors.textLight}>{t.loadingDetails}</T>
                  </Row>
                ) : qs.failed ? (
                  <T color={colors.error}>{t.error}</T>
                ) : qs.length === 0 ? (
                  <Note icon="clipboard" title={t.noQuestions} />
                ) : (
                  <>
                    <T weight="bold" size={14}>
                      {t.quizQuestions(qs.length)}
                    </T>
                    {qs.map((q: any, i: number) => (
                      <ReviewCard
                        key={q.id || i}
                        typeLabel={q.question_type ? getTypeLabel(q.question_type, lang) : undefined}
                        sourceLabel={q.source ? getSourceLabel(q.source, lang) : undefined}
                        result={{ correct: !!q.is_correct, label: q.is_correct ? t.correctBadge : t.wrongBadge }}
                        question={q.question_text}
                        yourAnswer={q.user_answer || t.noAnswer}
                        yourAnswerLabel={t.yourAnswer}
                        correctAnswer={q.correct_option}
                        correctAnswerLabel={t.correctAnswer}
                        isCorrect={!!q.is_correct}
                        explanation={q.explanation}
                      />
                    ))}
                  </>
                )}
              </View>
            ) : null}
          </Card>
        );
      })}
      <Pager page={page} totalPages={totalPages} onPage={setPage} labels={{ previous: t.previous, next: t.next, pageOf: t.pageOf }} />
    </View>
  );
}

/** One quiz's numbers, laid out as figures. */
export function LastQuizSummary({ latest, onRefresh }: { latest: any; onRefresh: () => void }) {
  const t = useCopy(analysisCopy).lastQuiz;
  const { lang } = useLang();
  if (!latest?.id) return <T color={colors.textLight}>{t.noPrevious}</T>;

  const total = latest.total_questions ?? 0;
  const correct = latest.correct_answers ?? 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const topicsCovered =
    latest.topics_covered?.length > 0 ? latest.topics_covered.map((k: string) => getTypeLabel(k, lang)).join(lang === 'ar' ? '، ' : ', ') : null;

  const figures = [
    { k: 'total', value: String(total), label: t.figQuestions },
    { k: 'correct', value: String(correct), label: t.figCorrect },
    { k: 'accuracy', value: `${accuracy}%`, label: t.figAccuracy },
    { k: 'duration', value: latest.duration > 0 ? formatDuration(latest.duration) : t.notRecorded, label: t.figDuration },
    {
      k: 'per',
      value: latest.avg_time_per_question > 0 ? t.seconds(parseFloat(latest.avg_time_per_question).toFixed(1)) : t.notRecorded,
      label: t.figPerQuestion,
    },
  ];

  return (
    <Card style={{ gap: 12 }}>
      <Row gap={8} wrap>
        <Badge2 icon="book-open" label={getSourceLabel(latest.source, lang)} />
        {topicsCovered ? <Badge2 icon="book" label={topicsCovered} /> : null}
        <AccuracyPill pct={accuracy} tone={tone(accuracy)} />
      </Row>
      <Row wrap gap={10}>
        {figures.map((f) => (
          <View key={f.k} style={{ minWidth: '28%', flexGrow: 1, backgroundColor: colors.surface2, borderRadius: radius.md, padding: 10, alignItems: 'center' }}>
            <T weight="extrabold" size={16} ltr align="center">
              {f.value}
            </T>
            <T size={11} color={colors.textLight} align="center">
              {f.label}
            </T>
          </View>
        ))}
      </Row>
      <Button label={t.refresh} icon="refresh" variant="ghost" size="sm" full={false} onPress={onRefresh} />
    </Card>
  );
}

/** The attempts of the latest quiz, five at a time. */
export function AttemptsList({ attempts }: { attempts: any[] }) {
  const t = useCopy(analysisCopy).attempts;
  const { lang } = useLang();
  const [showAll, setShowAll] = useState(false);
  if (attempts.length === 0) {
    return (
      <View style={{ gap: 6 }}>
        <T weight="bold" size={14}>
          {t.title}
        </T>
        <T color={colors.textLight}>{t.empty}</T>
      </View>
    );
  }
  const shown = showAll ? attempts : attempts.slice(0, 5);
  return (
    <View style={{ gap: 10 }}>
      <T weight="bold" size={14}>
        {t.title}
      </T>
      {shown.map((a, i) => (
        <ReviewCard
          key={a.id || i}
          typeLabel={a.question_type ? getTypeLabel(a.question_type, lang) : undefined}
          sourceLabel={getSourceLabel(a.source, lang)}
          result={{ correct: !!a.is_correct, label: a.is_correct ? t.correct : t.wrong }}
          question={a.question_text || t.unknownQuestion}
          yourAnswer={a.selected_option}
          yourAnswerLabel={t.yourAnswer}
          correctAnswer={a.correct_option}
          correctAnswerLabel={t.correctAnswer}
          isCorrect={!!a.is_correct}
          explanation={a.explanation}
        />
      ))}
      {attempts.length > 5 ? (
        <Button label={showAll ? t.showLess : t.showAll(attempts.length)} variant="ghost" size="sm" full={false} onPress={() => setShowAll((v) => !v)} />
      ) : null}
    </View>
  );
}

// Re-exported for the analysis screen's convenience.
export { ExplanationPanel };
