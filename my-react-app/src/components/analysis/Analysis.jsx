import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import apiClient from '../../utils/apiClient.js';
import OverallStats from './OverallStats';
import TopicAnalysisTable from './TopicAnalysisTable';
import QuestionAttemptsTable from './QuestionAttemptsTable';
import LastQuizSummary from './LastQuizSummary';
import QuizHistory from './QuizHistory';
import Progress from './Progress';
import FinalExams from './FinalExams';
import { UserContext } from '../../UserContext';
import { getTypeLabel } from '../../utils/typeLabels';
import { userTrack } from '../../utils/tracks.js';
import { readQuizMode } from '../../utils/quizMode.js';
import { useCopy, useLang } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './Analysis.css';

// Every quiz-start call site in the app (QUIZS.jsx, QuizLauncher.jsx) uses
// this same sentinel for "the unified bank, no specific monthly collection" —
// matching it here is what makes the "practise this" deep link land on a
// real, answerable quiz instead of an empty category.
const QUIZ_SOURCE_SENTINEL = 'MidgardGameBoy';

// Module scope, not declared inside the component body — a component
// declared inline gets a new identity every render, and React tears down and
// rebuilds it (flicker, lost state) instead of just re-rendering it in place.
const SectionLoader = ({ label }) => (
  <div className="an-loader"><Spinner size="sm" />{label && <span>{label}</span>}</div>
);

const ErrorRetry = ({ message, onRetry }) => (
  <div className="an-error-inline">
    <p>{message}</p>
    <button type="button" className="an-retry-btn" onClick={onRetry}>
      <Icon name="refresh" size={14} />
    </button>
  </div>
);

/** One accuracy palette, reused everywhere a percentage needs a color. */
function accuracyTone(pct) {
  if (pct == null || Number.isNaN(pct)) return 'neutral';
  if (pct >= 75) return 'high';
  if (pct >= 50) return 'mid';
  return 'low';
}

const CollapsibleSection = ({ title, icon, badge, defaultOpen, children }) => {
  const t = useCopy(analysisCopy).drill;
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <section className={`an-drill${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="an-drill-head"
        aria-expanded={open}
        aria-label={open ? t.collapse : t.expand}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="an-drill-icon" aria-hidden="true"><Icon name={icon} size={17} /></span>
        <span className="an-drill-title">{title}</span>
        {badge != null && badge !== '' && <span className="an-drill-badge">{badge}</span>}
        <span className="an-drill-chev" aria-hidden="true"><Icon name="chevron-down" size={17} /></span>
      </button>
      {open && <div className="an-drill-body">{children}</div>}
    </section>
  );
};

/** Same logic the page always had for finding a student's best/worst subject. */
function calculateBestWorstTopics(topicAnalysis) {
  if (!Array.isArray(topicAnalysis) || topicAnalysis.length === 0) return { best: null, worst: null };
  const valid = topicAnalysis.filter((t) => t.total_answered > 0 && t.total_correct !== undefined);
  if (valid.length === 0) return { best: null, worst: null };
  const withAccuracy = valid
    .map((t) => ({ ...t, accuracy: (t.total_correct / t.total_answered) * 100 }))
    .sort((a, b) => b.accuracy - a.accuracy);
  return { best: withAccuracy[0], worst: withAccuracy[withAccuracy.length - 1] };
}

const Analysis = () => {
  const { user, sessionToken } = useContext(UserContext);
  const t = useCopy(analysisCopy);
  const { lang, dir } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const id = user?.id;
  // Result.jsx sends a finished final/mock quiz here wanting the mock-exams
  // drill-down open, not the collapsed default — the one surviving use of
  // the old per-tab navigation state.
  const openMockExams = location.state?.activeTab === 'final-exams';

  // Same signal SummariesPage/AccountPage use — never a lockout, just what
  // gates the (paid, irreversible) "start over" button below.
  const isSubscriber = user?.accessAllowed !== false;

  const [userAnalysis, setUserAnalysis] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [topicAnalysis, setTopicAnalysis] = useState([]);
  const [lastQuizAttempts, setLastQuizAttempts] = useState([]);
  const [wrongCount, setWrongCount] = useState(null);
  const [examInfo, setExamInfo] = useState(null);
  // { topicsRead, topicsTotal } — how much of the summaries the student has
  // actually worked through. Until now this was unanswerable: reading progress
  // lived only in the reader's localStorage, so 868 minutes of it were
  // invisible here. See the sync in components/summaries/SummariesPage.jsx.
  const [summaryCoverage, setSummaryCoverage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState('');

  const fetchAll = useCallback(async (signal) => {
    try {
      const [uaRes, streakRes, topicsRes, wrongRes, examRes, sumRes] = await Promise.all([
        apiClient.get(`/user-analysis/${id}`, { signal }),
        apiClient.get(`/user-streaks/${id}`, { signal }),
        apiClient.get(`/topic-analysis/user/${id}`, { signal }),
        // limit=1: the count (`total`) is what this needs, not the rows —
        // the full wrong-question list is fetched by /wrong-questions itself.
        apiClient.get(`/wrong-questions/user/${id}`, { params: { limit: 1 }, signal }),
        apiClient.get('/api/exam-date', { signal }),
        // Failure is not worth failing the page over — every other card here
        // still renders without it, so this one resolves to null instead.
        apiClient.get('/api/summaries', { signal }).catch(() => null),
      ]);

      setUserAnalysis(uaRes.data);
      setStreakData(streakRes.data);
      setTopicAnalysis(topicsRes.data || []);
      setWrongCount(wrongRes.data?.total ?? 0);
      setExamInfo(examRes.data?.exam || null);

      // page_count is only known for decks somebody has opened (the catalog is
      // authored client-side), so the denominator fills in over time rather
      // than being right on day one. Shown without one until then — a total
      // that is quietly too small would be worse than no total.
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
    // fetchAll is intentionally the only other dependency — it already
    // captures `id`, and re-running this effect on every fetchAll identity
    // change (which happens whenever t.loadError's object reference changes)
    // would refetch on language toggle for no reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    fetchAll();
  }, [refreshing, fetchAll]);

  const { best, worst } = useMemo(() => calculateBestWorstTopics(topicAnalysis), [topicAnalysis]);

  const overallAccuracy = useMemo(() => {
    const answered = userAnalysis?.total_questions_answered;
    const correct = userAnalysis?.total_correct_options;
    if (!answered) return null;
    return (Number(correct || 0) / Number(answered)) * 100;
  }, [userAnalysis]);

  const currentStreak = streakData?.current_streak ?? 0;

  const practiceWeakest = useCallback(() => {
    if (!worst) {
      navigate('/quizs');
      return;
    }
    navigate('/quiz/10', {
      state: { id, types: worst.question_type, source: QUIZ_SOURCE_SENTINEL, timer: null, mode: readQuizMode() },
    });
  }, [worst, id, navigate]);

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

  const worstLabel = worst ? getTypeLabel(worst.question_type, lang) : null;
  const examDays = examInfo && !examInfo.passed ? examInfo.daysRemaining : null;

  return (
    <div className="an-wrapper fade-in" dir={dir}>
      <h1 className="an-page-title">{t.title}</h1>

      {/* .an-hero only changes layout at the desktop breakpoint (side by side
          instead of stacked) — see Analysis.css. Below it, both children
          render exactly as before. */}
      <div className="an-hero">
        {/* "Do this next" — the only thing meant to be read above the fold. */}
        <section className="an-next-card">
          <span className="an-next-eyebrow">{t.nextStep.eyebrow}</span>

          {worst ? (
            <>
              <div className="an-next-row">
                <span className="an-next-label">{t.nextStep.weakestLabel}</span>
                <span className={`an-next-pct tone-${accuracyTone(worst.accuracy)}`}>
                  {Number(worst.accuracy).toFixed(0)}%
                </span>
              </div>
              <p className="an-next-topic">{worstLabel}</p>
            </>
          ) : (
            <p className="an-next-topic">{t.nextStep.noDataYet}</p>
          )}

          <ul className="an-next-facts">
            {wrongCount != null && wrongCount > 0 && (
              <li><Icon name="alert-triangle" size={14} /> {t.nextStep.wrongCount(wrongCount)}</li>
            )}
            {summaryCoverage != null && summaryCoverage.topicsRead > 0 && (
              <li>
                <Icon name="book-open" size={14} />{' '}
                {summaryCoverage.topicsTotal >= summaryCoverage.topicsRead
                  && summaryCoverage.topicsTotal > 0
                  ? t.nextStep.summaryCoverage(summaryCoverage.topicsRead, summaryCoverage.topicsTotal)
                  : t.nextStep.summaryRead(summaryCoverage.topicsRead)}
              </li>
            )}
            <li>
              <Icon name="calendar" size={14} />{' '}
              {examInfo == null
                ? t.nextStep.noExam
                : examInfo.passed
                  ? t.nextStep.examPassed
                  : examDays === 0
                    ? t.nextStep.examToday
                    : t.nextStep.examIn(examDays)}
            </li>
          </ul>

          <button type="button" className="an-next-cta" onClick={practiceWeakest}>
            {worst ? t.nextStep.cta(worstLabel) : t.nextStep.ctaGeneric}
          </button>
        </section>

        {/* Readiness + streak — replaces the old floating streak badge and the
            overview tab's headline numbers with one glanceable row. */}
        <div className="an-stat-row">
          <div className="an-stat-pill">
            <span className="an-stat-label">{t.nextStep.readiness}</span>
            <span className={`an-stat-value tone-${accuracyTone(overallAccuracy)}`}>
              {overallAccuracy == null ? '—' : `${overallAccuracy.toFixed(0)}%`}
            </span>
          </div>
          <div className="an-stat-pill">
            <span className="an-stat-label"><Icon name="flame" size={13} /></span>
            <span className="an-stat-value">
              {currentStreak > 0 ? t.nextStep.streakDays(currentStreak) : t.nextStep.noStreak}
            </span>
          </div>
        </div>
      </div>

      {/* Drill-downs replace the six-tab strip — no more horizontal
          scroller hiding tabs off-screen on a 360px phone, and no more
          landing on the LAST tab (old default: 'overview', 6th of 6). */}
      <div className="an-drills">
        <CollapsibleSection title={t.drill.overview} icon="bar-chart" defaultOpen>
          <OverallStats userAnalysis={userAnalysis} />
          {(best || worst) && (
            <div className="questions-grid an-bestworst-grid">
              {best && (
                <div className="question-card">
                  <div className="question-header">
                    <span className="type-badge tone-high"><Icon name="trophy" size={14} /> {t.bestWorst.best}</span>
                  </div>
                  <div className="question-content">
                    <p className="topic-performance-text">{getTypeLabel(best.question_type, lang)}</p>
                    <span className={`an-stat-value tone-${accuracyTone(best.accuracy)}`}>{best.accuracy.toFixed(0)}%</span>
                  </div>
                </div>
              )}
              {worst && (
                <div className="question-card">
                  <div className="question-header">
                    <span className="type-badge tone-low"><Icon name="trending-down" size={14} /> {t.bestWorst.needsWork}</span>
                  </div>
                  <div className="question-content">
                    <p className="topic-performance-text">{getTypeLabel(worst.question_type, lang)}</p>
                    <span className={`an-stat-value tone-${accuracyTone(worst.accuracy)}`}>{worst.accuracy.toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CollapsibleSection>

        <CollapsibleSection title={t.drill.bySpecialty} icon="book-open" badge={topicAnalysis.length || null}>
          <TopicAnalysisTable topicAnalysis={topicAnalysis} />
        </CollapsibleSection>

        <CollapsibleSection title={t.drill.progress} icon="target">
          <Progress userId={id} username={user?.username} sessionToken={sessionToken} track={userTrack(user)} />
        </CollapsibleSection>

        <CollapsibleSection title={t.drill.quizHistory} icon="trending-up">
          <QuizHistory userId={id} username={user?.username} sessionToken={sessionToken} />
        </CollapsibleSection>

        <CollapsibleSection title={t.drill.mockExams} icon="graduation-cap" defaultOpen={openMockExams}>
          {user?.username && sessionToken ? (
            <FinalExams userId={id} username={user.username} sessionToken={sessionToken} />
          ) : (
            <SectionLoader label={t.loadingUser} />
          )}
        </CollapsibleSection>

        <CollapsibleSection title={t.drill.lastQuizReview} icon="clock">
          <LastQuizSummary latest_quiz={userAnalysis?.latest_quiz} onRefresh={handleRefresh} />
          <QuestionAttemptsTable questionAttempts={lastQuizAttempts} />
        </CollapsibleSection>
      </div>

      {loadError && (
        <ErrorRetry message={loadError} onRetry={handleRefresh} />
      )}

      <div className="button-bar">
        <button type="button" onClick={() => navigate('/wrong-questions')} className="secondary-button">
          <Icon name="book-open" size={15} /> {t.actions.reviewWrong}
        </button>
        <button type="button" onClick={handleRefresh} className="secondary-button" disabled={refreshing}>
          <Icon name="refresh" size={14} /> {refreshing ? t.actions.refreshing : t.actions.refresh}
        </button>
        <button type="button" onClick={() => navigate('/quizs', { state: { id } })} className="primary-button">
          {t.actions.newQuiz}
        </button>
      </div>

      {/* Danger zone — irreversible, so it sits apart from the normal actions.
          Subscribers only, matching the server (POST /user-analysis/:id/reset
          is behind subscriberOnly): starting over is a paid convenience, and a
          free account's single run at 40 questions has nothing worth clearing. */}
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
