import React, { useCallback, useEffect, useState } from 'react';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import ExplanationPanel from '../common/ExplanationPanel.jsx';
import apiClient from '../../utils/apiClient.js';
import { getSourceLabel } from '../../utils/sourceLabels';
import { getTypeLabel } from '../../utils/typeLabels';
import { useCopy, useLang, formatDateTime } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import { formatDuration } from '../../utils/formatDuration';
import { SessionReviews, Pager } from './QuizHistory.jsx';
import './analysisPanels.css';

const PAGE_SIZE = 10;
const tone = (pct) => (pct >= 75 ? 'high' : pct >= 50 ? 'mid' : 'low');

/**
 * Mock exams (final review sessions). Same shape as QuizHistory: a session
 * list whose rows expand into question reviews — here with explanations,
 * since a mock exam is where a student reviews the reasoning.
 */
const FinalExams = ({ userId }) => {
  const t = useCopy(analysisCopy).finals;
  const { lang } = useLang();
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [questions, setQuestions] = useState({});

  const fetchSessions = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/final-quiz/sessions/${userId}`, { params: { page, limit: PAGE_SIZE }, signal });
      setSessions(res.data.sessions || []);
      setTotalPages(res.data.pagination?.total_pages || 1);
    } catch (err) {
      if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') return;
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }, [userId, page, t.error]);

  useEffect(() => {
    if (!userId) return undefined;
    const controller = new AbortController();
    fetchSessions(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, page]);

  const toggle = async (sessionId) => {
    if (openId === sessionId) {
      setOpenId(null);
      return;
    }
    setOpenId(sessionId);
    if (questions[sessionId]) return;
    try {
      const res = await apiClient.get(`/final-quiz/session/${sessionId}/questions`);
      setQuestions((prev) => ({ ...prev, [sessionId]: res.data.questions || [] }));
    } catch {
      setQuestions((prev) => ({ ...prev, [sessionId]: { failed: true } }));
    }
  };

  const formatDate = (d) => formatDateTime(d, lang, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading && sessions.length === 0) {
    return <div className="ap-inline-load"><Spinner size="sm" /><span>{t.loading}</span></div>;
  }

  if (error) {
    return (
      <div className="ap-inline-error">
        <p>{error}</p>
        <button type="button" className="ap-page-btn" onClick={() => fetchSessions()}>{t.retry}</button>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="ap-note">
        <Icon name="target" size={18} />
        <div><strong>{t.emptyTitle}</strong><p>{t.emptyBody} {t.emptyHint}</p></div>
      </div>
    );
  }

  return (
    <>
      <div className="ap-sess-list">
        {sessions.map((s) => {
          const score = Number(s.score) || 0;
          const open = openId === s.id;
          const qs = questions[s.id];
          const perMinute = s.time_taken > 0 ? (s.total_questions / (s.time_taken / 60)).toFixed(1) : null;
          return (
            <div className="ap-sess" key={s.id}>
              <div className="ap-sess-head">
                <span className="ap-sess-when">
                  <span className="ap-sess-title">
                    {getTypeLabel(s.question_type, lang)} — {getSourceLabel(s.source, lang)}
                  </span>
                  <span className="ap-sess-date">{formatDate(s.start_time)}</span>
                </span>
                <span className={`ap-acc tone-${tone(score)}`}><bdi>{score.toFixed(0)}%</bdi></span>
              </div>

              <div className="ap-sess-facts">
                <span className="ap-sess-fact">{t.questions} <b><bdi>{s.correct_answers}/{s.total_questions}</bdi></b></span>
                <span className="ap-sess-fact">{t.time} <b><bdi>{formatDuration(s.time_taken)}</bdi></b></span>
                {s.time_limit > 0 && (
                  <span className="ap-sess-fact">{t.timeLimit} <b><bdi>{formatDuration(s.time_limit)}</bdi></b></span>
                )}
                {perMinute && (
                  <span className="ap-sess-fact">{t.timeEfficiency} <b><bdi>{perMinute}</bdi></b> {t.perMinute}</span>
                )}
              </div>

              <div className="ap-sess-foot">
                <button type="button" className="ap-more" aria-expanded={open} onClick={() => toggle(s.id)}>
                  {open ? t.hideDetails : t.showDetails}
                </button>
              </div>

              {open && (
                <div className="ap-sess-body">
                  {!qs ? (
                    <div className="ap-inline-load"><Spinner size="sm" /><span>{t.loadingDetails}</span></div>
                  ) : qs.failed ? (
                    <p className="ap-empty">{t.error}</p>
                  ) : qs.length === 0 ? (
                    <div className="ap-note">
                      <Icon name="clipboard" size={18} />
                      <div><strong>{t.noQuestions}</strong></div>
                    </div>
                  ) : (
                    <>
                      <h4 className="ap-title">{t.quizQuestions(qs.length)}</h4>
                      <SessionReviews
                        t={t}
                        lang={lang}
                        items={qs.map((q) => ({
                          ...q,
                          answer: q.user_answer,
                          extra: <ExplanationPanel explanation={q.explanation} />,
                        }))}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Pager page={page} totalPages={totalPages} onPage={setPage} t={t} />
    </>
  );
};

export default FinalExams;
