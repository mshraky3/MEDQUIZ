import React, { useCallback, useEffect, useState } from 'react';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import apiClient from '../../utils/apiClient.js';
import { getSourceLabel } from '../../utils/sourceLabels';
import { getTypeLabel } from '../../utils/typeLabels';
import { useCopy, useLang, formatDateTime } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import { formatDuration } from '../../utils/formatDuration';
import './analysisPanels.css';

const PAGE_SIZE = 10;
const tone = (pct) => (pct >= 75 ? 'high' : pct >= 50 ? 'mid' : 'low');

/** The question reviews inside an expanded session — shared shape with FinalExams. */
export const SessionReviews = ({ items, t, lang }) => (
  <div className="ap-reviews">
    {items.map((q, index) => (
      <article key={q.id || index} className="ap-review">
        <div className="ap-review-head">
          {q.question_type && (
            <span className="ap-badge"><Icon name="book" size={14} /> {getTypeLabel(q.question_type, lang)}</span>
          )}
          {q.source && (
            <span className="ap-badge"><Icon name="book-open" size={14} /> {getSourceLabel(q.source, lang)}</span>
          )}
          <span className={`ap-result ${q.is_correct ? 'is-correct' : 'is-wrong'}`}>
            <Icon name={q.is_correct ? 'check-circle' : 'x-circle'} size={13} />
            {q.is_correct ? t.correctBadge : t.wrongBadge}
          </span>
        </div>
        <div className="ap-review-body">
          <p className="ap-question">{q.question_text}</p>
          <div className="ap-answers">
            <div className={`ap-answer ${q.is_correct ? 'is-correct' : 'is-wrong'}`}>
              <span className="ap-answer-label">{t.yourAnswer}</span>
              <span className="ap-answer-value">{q.answer || t.noAnswer || '—'}</span>
            </div>
            {!q.is_correct && (
              <div className="ap-answer is-correct">
                <span className="ap-answer-label">{t.correctAnswer}</span>
                <span className="ap-answer-value">{q.correct_option || '—'}</span>
              </div>
            )}
          </div>
          {q.extra}
        </div>
      </article>
    ))}
  </div>
);

export const Pager = ({ page, totalPages, onPage, t }) => (
  totalPages > 1 ? (
    <div className="ap-page">
      <button type="button" className="ap-page-btn" onClick={() => onPage(page - 1)} disabled={page <= 1}>
        {t.previous}
      </button>
      <span className="ap-page-info">{t.pageOf(page, totalPages)}</span>
      <button type="button" className="ap-page-btn" onClick={() => onPage(page + 1)} disabled={page >= totalPages}>
        {t.next}
      </button>
    </div>
  ) : null
);

const QuizHistory = ({ userId }) => {
  const t = useCopy(analysisCopy).history;
  const { lang } = useLang();
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [details, setDetails] = useState({});

  const fetchSessions = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/quiz-sessions/history/${userId}`, { params: { page, limit: PAGE_SIZE }, signal });
      setSessions(res.data.sessions || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') return;
      setError(t.error);
      setSessions([]);
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
    if (details[sessionId]) return;
    try {
      // The route is /quiz-sessions/:id — there has never been a /details
      // suffix on the server, which is why this panel used to open empty.
      const res = await apiClient.get(`/quiz-sessions/${sessionId}`);
      setDetails((prev) => ({ ...prev, [sessionId]: res.data }));
    } catch {
      setDetails((prev) => ({ ...prev, [sessionId]: { failed: true } }));
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
    return <p className="ap-empty">{t.empty}</p>;
  }

  return (
    <>
      <div className="ap-sess-list">
        {sessions.map((s) => {
          const acc = parseFloat(s.quiz_accuracy || 0);
          const open = openId === s.id;
          const d = details[s.id];
          return (
            <div className="ap-sess" key={s.id}>
              <div className="ap-sess-head">
                <span className="ap-sess-when">
                  <span className="ap-sess-title">{getSourceLabel(s.source, lang)}</span>
                  <span className="ap-sess-date">{formatDate(s.start_time)}</span>
                </span>
                <span className={`ap-acc tone-${tone(acc)}`}><bdi>{acc.toFixed(0)}%</bdi></span>
              </div>

              <div className="ap-sess-facts">
                <span className="ap-sess-fact">{t.questions} <b><bdi>{s.total_questions}</bdi></b></span>
                <span className="ap-sess-fact">{t.correct} <b><bdi>{s.correct_answers}</bdi></b></span>
                <span className="ap-sess-fact">{t.duration} <b><bdi>{formatDuration(s.duration)}</bdi></b></span>
                <span className="ap-sess-fact">{t.avgTime} <b><bdi>{parseFloat(s.avg_time_per_question || 0).toFixed(1)}s</bdi></b></span>
              </div>

              <div className="ap-sess-foot">
                <button type="button" className="ap-more" aria-expanded={open} onClick={() => toggle(s.id)}>
                  {open ? t.hideDetails : t.showDetails}
                </button>
              </div>

              {open && (
                <div className="ap-sess-body">
                  {!d ? (
                    <div className="ap-inline-load"><Spinner size="sm" /></div>
                  ) : d.failed ? (
                    <p className="ap-empty">{t.error}</p>
                  ) : d.is_old_session ? (
                    <div className="ap-note">
                      <Icon name="info" size={18} />
                      <div><strong>{t.oldSession}</strong><p>{t.oldSessionHint}</p></div>
                    </div>
                  ) : !d.question_attempts?.length ? (
                    <div className="ap-note">
                      <Icon name="clipboard" size={18} />
                      <div><strong>{t.noDetails}</strong><p>{t.noDetailsHint}</p></div>
                    </div>
                  ) : (
                    <>
                      <h4 className="ap-title">{t.attemptsTitle}</h4>
                      <SessionReviews
                        t={t}
                        lang={lang}
                        items={d.question_attempts.map((a) => ({ ...a, answer: a.selected_option }))}
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

export default QuizHistory;
