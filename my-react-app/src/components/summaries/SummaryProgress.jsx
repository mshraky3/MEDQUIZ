import React from 'react';
import Icon from '../common/Icon.jsx';

/**
 * Student-facing progress panel ("تتبع تقدمك"): how far they've read the deck,
 * how many of the topic's questions they've completed, and their topic accuracy.
 * Data comes from the /api/summaries/:slug response (reading progress +
 * user_question_progress + user_topic_analysis).
 */
const pct = (n, d) => (d > 0 ? Math.min(100, Math.round((n / d) * 100)) : 0);

const SummaryProgress = ({ pageCount = 0, progress, stats, isHtml = false }) => {
    const read = progress?.max_page_reached || 0;
    // HTML decks store a scroll percentage directly; image decks store a page number.
    const readPct = isHtml ? Math.min(100, Math.max(0, read)) : pct(read, pageCount);
    const totalQ = stats?.total_questions || 0;
    const doneQ = stats?.completed_questions || 0;
    const qPct = pct(doneQ, totalQ);
    const accuracy = stats?.topic?.accuracy != null ? Number(stats.topic.accuracy) : null;

    return (
        <div className="summary-progress-panel">
            <div className="summary-stat-card">
                <p className="summary-stat-label"><Icon name="book" size={14} /> تقدّم القراءة</p>
                <p className="summary-stat-value">
                    {readPct}<span className="unit">%</span>
                </p>
                <div className="summary-progress-bar">
                    <div className="summary-progress-fill" style={{ width: `${readPct}%` }} />
                </div>
                {pageCount > 0 && (
                    <p className="summary-stat-label" style={{ margin: '8px 0 0' }}>
                        {read} من {pageCount} صفحة
                    </p>
                )}
            </div>

            <div className="summary-stat-card">
                <p className="summary-stat-label"><Icon name="check-circle" size={14} /> أسئلة الموضوع المنجزة</p>
                <p className="summary-stat-value">
                    {doneQ}<span className="unit"> / {totalQ}</span>
                </p>
                <div className="summary-progress-bar">
                    <div className="summary-progress-fill" style={{ width: `${qPct}%` }} />
                </div>
            </div>

            <div className="summary-stat-card">
                <p className="summary-stat-label"><Icon name="target" size={14} /> دقتك في الموضوع</p>
                <p className="summary-stat-value">
                    {accuracy != null ? <>{accuracy.toFixed(1)}<span className="unit">%</span></> : '—'}
                </p>
                <p className="summary-stat-label" style={{ margin: 0 }}>
                    {stats?.topic?.total_answered ? `${stats.topic.total_answered} إجابة` : 'لم تبدأ بعد'}
                </p>
            </div>
        </div>
    );
};

export default SummaryProgress;
