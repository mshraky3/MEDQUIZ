import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import apiClient from '../../utils/apiClient.js';
import { calculateBestWorstTopics } from '../../utils/topicStats.js';
import BreakdownTable from './BreakdownTable.jsx';
import QuestionAttemptsTable from './QuestionAttemptsTable';
import LastQuizSummary from './LastQuizSummary';
import QuizHistory from './QuizHistory';
import FinalExams from './FinalExams';
import { UserContext } from '../../UserContext';
import { getTypeLabel } from '../../utils/typeLabels';
import { getSourceLabel } from '../../utils/sourceLabels';
import { userTrack, specialtiesOf, pick } from '../../utils/tracks.js';
import { readQuizMode } from '../../utils/quizMode.js';
import { useCopy, useLang, formatNumber } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './Analysis.css';
// The report panels' shared stylesheet (tables, session lists, reviews).
import './analysisPanels.css';

// Every quiz-start call site in the app (QUIZS.jsx, QuizLauncher.jsx) uses
// this same sentinel for "the unified bank, no specific monthly collection" —
// matching it here is what makes the "practise this" deep link land on a
// real, answerable quiz instead of an empty category.
const QUIZ_SOURCE_SENTINEL = 'MidgardGameBoy';

/** One accuracy palette, reused everywhere a percentage needs a color. */
function accuracyTone(pct) {
  if (pct == null || Number.isNaN(pct)) return 'neutral';
  if (pct >= 75) return 'high';
  if (pct >= 50) return 'mid';
  return 'low';
}

const SECTION_IDS = ['an-specialties', 'an-sources', 'an-activity', 'an-mocks', 'an-last'];

const Section = ({ id, title, count, hint, children }) => (
  <section className="an-sec" id={id} aria-labelledby={`${id}-title`}>
    <div className="an-sec-head">
      <h2 className="an-sec-title" id={`${id}-title`}>{title}</h2>
      {count != null && <span className="an-sec-count">{count}</span>}
      {hint && <p className="an-sec-hint">{hint}</p>}
    </div>
    {children}
  </section>
);

const Analysis = () => {
  const { user } = useContext(UserContext);
  const t = useCopy(analysisCopy);
  const { lang, dir } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const id = user?.id;
  const track = userTrack(user);
  const fmt = (n) => formatNumber(n, lang);
  // Result.jsx sends a finished final/mock quiz here wanting the mock exams in
  // view — the one surviving use of the old per-tab navigation state.
  const jumpToMocks = location.state?.activeTab === 'final-exams';

  // Same signal SummariesPage/AccountPage use — never a lockout, just what
  // gates the (paid, irreversible) "start over" button below.
  const isSubscriber = user?.accessAllowed !== false;

  const [userAnalysis, setUserAnalysis] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [topicAnalysis, setTopicAnalysis] = useState([]);
  const [progress, setProgress] = useState(null);
  const [lastQuizAttempts, setLastQuizAttempts] = useState([]);
  const [wrongCount, setWrongCount] = useState(null);
  const [examInfo, setExamInfo] = useState(null);
  // { topicsRead, topicsTotal } — how much of the summaries the student has
  // worked through. See the sync in components/summaries/SummariesPage.jsx.
  const [summaryCoverage, setSummaryCoverage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSec, setActiveSec] = useState(SECTION_IDS[0]);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState('');

  const fetchAll = useCallback(async (signal) => {
    try {
      const [uaRes, streakRes, topicsRes, wrongRes, examRes, sumRes, progRes] = await Promise.all([
        apiClient.get(`/user-analysis/${id}`, { signal }),
        apiClient.get(`/user-streaks/${id}`, { signal }),
        apiClient.get(`/topic-analysis/user/${id}`, { signal }),
        // limit=1: the count (`total`) is what this needs, not the rows.
        apiClient.get(`/wrong-questions/user/${id}`, { params: { limit: 1 }, signal }),
        apiClient.get('/api/exam-date', { signal }),
        // These two are not worth failing the page over — every other part of
        // the report still renders without them, so they resolve to null.
        apiClient.get('/api/summaries', { signal }).catch(() => null),
        apiClient.get(`/quiz-sessions/progress/${id}`, { signal }).catch(() => null),
      ]);

      setUserAnalysis(uaRes.data);
      setStreakData(streakRes.data);
      setTopicAnalysis(topicsRes.data || []);
      setWrongCount(wrongRes.data?.total ?? 0);
      setExamInfo(examRes.data?.exam || null);
      setProgress(progRes?.data || null);

      // page_count is only known for decks somebody has opened, so the
      // denominator fills in over time. Shown without one until then.
      const decks = sumRes?.data?.summaries || [];
      setSummaryCoverage(decks.length ? {
        topicsRead: decks.reduce((n, s) => n + (s.progress?.max_page_reached || 0), 0),
        topicsTotal: decks.reduce((n, s) => n + (s.page_count || 0), 0),
      } : null);

      const latestQuizId = uaRes.data?.latest_quiz?.id;
      if (latestQuizId) {
        const attemptsRes = await apiClient.get(`/question-attempts/session/${latestQuizId}`, { signal });
        setLastQuizAttempts(attemptsRes.data || []);
      } else {
        setLastQuizAttempts([]);
      }
      setLoadError(null);
    } catch (err) {
      if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') return;
      setLoadError(t.loadError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, t.loadError]);

  useEffect(() => {
    if (!id) {
      navigate('/login');
      return undefined;
    }
    const controller = new AbortController();
    fetchAll(controller.signal);
    return () => controller.abort();
    // fetchAll is intentionally left out — it already captures `id`, and its
    // identity changes with t.loadError, which would refetch on a language
    // toggle for no reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    fetchAll();
  }, [refreshing, fetchAll]);

  // Arriving from a finished mock exam: bring that section into view once the
  // report has rendered.
  useEffect(() => {
    if (loading || !jumpToMocks) return;
    document.getElementById('an-mocks')?.scrollIntoView({ block: 'start' });
  }, [loading, jumpToMocks]);

  // Desktop rail: highlight the section currently under the reading line.
  useEffect(() => {
    if (loading || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length) setActiveSec(visible[0].target.id);
    }, { rootMargin: '-20% 0px -70% 0px' });
    SECTION_IDS.forEach((sid) => {
      const el = document.getElementById(sid);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading]);

  const { worst } = useMemo(() => calculateBestWorstTopics(topicAnalysis), [topicAnalysis]);

  const overallAccuracy = useMemo(() => {
    const answered = userAnalysis?.total_questions_answered;
    const correct = userAnalysis?.total_correct_answers;
    if (!answered) return null;
    return (Number(correct || 0) / Number(answered)) * 100;
  }, [userAnalysis]);

  // Specialty rows: accuracy from topic analysis, coverage from the progress
  // breakdown — the two numbers that used to live in different accordions.
  const specialtyRows = useMemo(() => specialtiesOf(track).map((sp) => {
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
  }), [track, topicAnalysis, progress, lang]);

  // Source rows: only sources that still have questions in this track's bank.
  // Retired collections survive in old quiz sessions but have nothing left to
  // cover, so they would only ever show a permanent 0%.
  const sourceRows = useMemo(() => {
    const bySource = new Map((userAnalysis?.source_breakdown || []).map((s) => [s.source, s]));
    return Object.entries(progress?.sourceBreakdown || {})
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

  const practise = useCallback((types) => {
    navigate('/quiz/10', {
      state: { id, types, source: QUIZ_SOURCE_SENTINEL, timer: null, mode: readQuizMode() },
    });
  }, [id, navigate]);

  const handleResetAnalytics = async () => {
    setResetting(true);
    setResetError('');
    try {
      await apiClient.post(`/user-analysis/${id}/reset`);
      setShowResetModal(false);
      setResetConfirm('');
      window.location.reload(); // simplest way to guarantee every panel re-reads
    } catch (err) {
      setResetError(err?.response?.data?.message || t.reset.failed);
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="an-wrapper" dir={dir}>
        <Spinner fullScreen label={t.loading} />
      </div>
    );
  }

  if (loadError && !userAnalysis) {
    return (
      <div className="an-wrapper" dir={dir}>
        <div className="an-error-full">
          <p>{loadError}</p>
          <button type="button" className="primary-button" onClick={handleRefresh}>{t.retry}</button>
        </div>
      </div>
    );
  }

  const sc = t.scorecard;
  const hasAnswers = (userAnalysis?.total_questions_answered || 0) > 0;
  const worstLabel = worst ? getTypeLabel(worst.question_type, lang) : null;
  const coveragePct = progress?.totalQuestions > 0
    ? (progress.answeredQuestions / progress.totalQuestions) * 100
    : null;
  const examDays = examInfo && !examInfo.passed ? examInfo.daysRemaining : null;
  const examValue = examInfo == null ? sc.examNone
    : examInfo.passed ? sc.examPassed
      : examDays === 0 ? sc.examToday
        : `${fmt(examDays)} ${sc.day}`;

  const sections = [
    { id: 'an-specialties', label: t.sections.specialties },
    { id: 'an-sources', label: t.sections.sources },
    { id: 'an-activity', label: t.sections.activity },
    { id: 'an-mocks', label: t.sections.mockExams },
    { id: 'an-last', label: t.sections.lastQuiz },
  ];

  const minutes = (seconds) => (seconds ? (seconds / 60).toFixed(1) : 0);

  return (
    <div className="an-wrapper fade-in" dir={dir}>
      <div className="an-head">
        <h1 className="an-page-title">{t.title}</h1>
        <button type="button" className="an-refresh" onClick={handleRefresh} disabled={refreshing}>
          <Icon name="refresh" size={14} /> {refreshing ? t.actions.refreshing : t.actions.refresh}
        </button>
      </div>

      <div className="an-layout">
        <nav className="an-nav" aria-label={t.sections.jump}>
          <p className="an-nav-label">{t.sections.jump}</p>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`an-nav-link${activeSec === s.id ? ' is-on' : ''}`}
              aria-current={activeSec === s.id ? 'true' : undefined}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="an-main">
          <section className="an-score" aria-label={sc.accuracy}>
            {!hasAnswers ? (
              <div className="an-score-empty">
                <h2>{sc.emptyTitle}</h2>
                <p>{sc.emptyBody}</p>
                <button type="button" className="an-score-cta" onClick={() => navigate('/quizs', { state: { id } })}>
                  {sc.emptyCta}
                </button>
              </div>
            ) : (
              <>
                <div className="an-score-top">
                  <div className="an-score-main">
                    <span className={`an-score-pct tone-${accuracyTone(overallAccuracy)}`}>
                      <bdi>{overallAccuracy == null ? '—' : `${overallAccuracy.toFixed(0)}%`}</bdi>
                    </span>
                    <span className="an-score-cap">{sc.accuracy}</span>
                  </div>
                  <div className="an-score-side">
                    <div className="an-score-fig">
                      <span className="an-score-val"><bdi>{examValue}</bdi></span>
                      <span className="an-score-cap">{sc.exam}</span>
                    </div>
                    <div className="an-score-fig">
                      <span className="an-score-val"><bdi>{fmt(streakData?.current_streak ?? 0)}</bdi></span>
                      <span className="an-score-cap">{sc.streak}</span>
                    </div>
                  </div>
                </div>

                {coveragePct != null && (
                  <>
                    <div className="an-score-meter" role="img" aria-label={`${t.report.coverage} ${coveragePct.toFixed(0)}%`}>
                      <div className="an-score-meter-fill" style={{ width: `${Math.min(100, coveragePct)}%` }} />
                    </div>
                    <p className="an-score-cover">
                      <bdi>{t.report.covered(fmt(progress.answeredQuestions), fmt(progress.totalQuestions))}</bdi>
                      {' · '}<bdi>{coveragePct.toFixed(0)}%</bdi> {sc.coverage}
                    </p>
                  </>
                )}

                <div className="an-score-acts">
                  {worst && (
                    <div className="an-score-act">
                      <p>
                        {t.nextStep.weakestLabel}: <b>{worstLabel}</b>{' '}
                        <span className={`tone-${accuracyTone(worst.accuracy)}`}>
                          <bdi>{Number(worst.accuracy).toFixed(0)}%</bdi>
                        </span>
                      </p>
                      <button type="button" className="an-score-cta" onClick={() => practise(worst.question_type)}>
                        {t.nextStep.cta(worstLabel)}
                      </button>
                    </div>
                  )}
                  {wrongCount > 0 && (
                    <div className="an-score-act">
                      <p>{t.nextStep.wrongCount(wrongCount)}</p>
                      <button type="button" className="an-score-alt" onClick={() => navigate('/wrong-questions')}>
                        {t.actions.reviewWrong}
                      </button>
                    </div>
                  )}
                  {summaryCoverage != null && summaryCoverage.topicsRead > 0 && (
                    <div className="an-score-act">
                      <p>
                        {summaryCoverage.topicsTotal >= summaryCoverage.topicsRead && summaryCoverage.topicsTotal > 0
                          ? t.nextStep.summaryCoverage(summaryCoverage.topicsRead, summaryCoverage.topicsTotal)
                          : t.nextStep.summaryRead(summaryCoverage.topicsRead)}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>

          <Section id="an-specialties" title={t.sections.specialties} hint={t.sections.specialtiesHint}>
            <BreakdownTable rows={specialtyRows} onPractise={(row) => practise(row.key)} />
          </Section>

          {sourceRows.length > 0 && (
            <Section id="an-sources" title={t.sections.sources}>
              <BreakdownTable rows={sourceRows} />
            </Section>
          )}

          <Section id="an-activity" title={t.sections.activity}>
            {hasAnswers && (
              <div className="ap-strip an-activity-figs">
                <div className="ap-figures">
                  {[
                    { k: 'sessions', value: fmt(userAnalysis.total_quizzes ?? 0), label: t.activity.sessions },
                    { k: 'answered', value: fmt(userAnalysis.total_questions_answered ?? 0), label: t.activity.answered },
                    { k: 'time', value: `${minutes(userAnalysis.total_duration)} ${t.activity.minutes}`, label: t.activity.totalTime },
                    { k: 'avg', value: `${minutes(userAnalysis.avg_duration)} ${t.activity.minutes}`, label: t.activity.avgSession },
                    { k: 'longest', value: `${fmt(streakData?.longest_streak ?? 0)} ${t.activity.days}`, label: t.activity.longestStreak },
                  ].map((f) => (
                    <div className="ap-figure" key={f.k}>
                      <b><bdi>{f.value}</bdi></b>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <QuizHistory userId={id} />
          </Section>

          <Section id="an-mocks" title={t.sections.mockExams}>
            <FinalExams userId={id} />
          </Section>

          <Section id="an-last" title={t.sections.lastQuiz}>
            <LastQuizSummary latest_quiz={userAnalysis?.latest_quiz} onRefresh={handleRefresh} />
            {userAnalysis?.latest_quiz?.id && (
              <div className="an-last-reviews">
                <QuestionAttemptsTable questionAttempts={lastQuizAttempts} />
              </div>
            )}
          </Section>

          {loadError && (
            <div className="an-error-inline">
              <p>{loadError}</p>
              <button type="button" className="an-retry-btn" onClick={handleRefresh} aria-label={t.retry}>
                <Icon name="refresh" size={14} />
              </button>
            </div>
          )}

          <div className="button-bar">
            <button type="button" onClick={() => navigate('/wrong-questions')} className="secondary-button">
              <Icon name="book-open" size={15} /> {t.actions.reviewWrong}
            </button>
            <button type="button" onClick={() => navigate('/quizs', { state: { id } })} className="primary-button">
              {t.actions.newQuiz}
            </button>
          </div>

          {/* Danger zone — irreversible, so it sits apart from the normal
              actions. Subscribers only, matching the server (POST
              /user-analysis/:id/reset is behind subscriberOnly). */}
          {isSubscriber && (
            <div className="danger-zone">
              <div className="danger-zone-text">
                <strong>{t.reset.zoneTitle}</strong>
                <span>{t.reset.zoneBody}</span>
              </div>
              <button type="button" className="danger-button" onClick={() => { setResetError(''); setResetConfirm(''); setShowResetModal(true); }}>
                <Icon name="trash" size={15} /> {t.reset.zoneButton}
              </button>
            </div>
          )}
        </div>
      </div>

      {showResetModal && (
        <div className="reset-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
          <div className="reset-modal">
            <h2 id="reset-modal-title"><Icon name="alert-triangle" size={19} /> {t.reset.modalTitle}</h2>
            <p className="reset-modal-lead">{t.reset.lead}</p>
            <ul className="reset-modal-list">
              {t.reset.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="reset-modal-keep"><Icon name="check-circle" size={14} /> {t.reset.keep}</p>

            <label className="reset-modal-label" htmlFor="reset-confirm">
              {t.reset.confirmLabelBefore} <b>{t.reset.confirmWord}</b> {t.reset.confirmLabelAfter}
            </label>
            <input
              id="reset-confirm"
              className="reset-modal-input"
              value={resetConfirm}
              onChange={(e) => setResetConfirm(e.target.value)}
              autoComplete="off"
              disabled={resetting}
            />

            {resetError && <p className="reset-modal-error">{resetError}</p>}

            <div className="reset-modal-actions">
              <button type="button" className="secondary-button" onClick={() => setShowResetModal(false)} disabled={resetting}>
                {t.reset.cancel}
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={handleResetAnalytics}
                disabled={resetConfirm.trim() !== t.reset.confirmWord || resetting}
              >
                {resetting ? t.reset.deleting : t.reset.deleteAll}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
