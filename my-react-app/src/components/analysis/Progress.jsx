import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon.jsx';
import axios from 'axios';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';
import { specialtiesOf, pick } from '../../utils/tracks.js';
import { getSourceLabel } from '../../utils/sourceLabels';
import { useCopy, useLang, formatNumber } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './Progress.css';

// Series colours, applied by position so any track's specialty list is covered.
const TYPE_COLORS = ['#8b5cf6', '#06b6d4', '#f97316', '#ef4444', '#16a34a', '#eab308'];

const Progress = ({ userId, username, sessionToken, track }) => {
  const t = useCopy(analysisCopy).progress;
  const { lang, dir } = useLang();
  const fmt = (n) => formatNumber(n, lang);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch progress data
  const fetchProgressData = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('username', username);
      queryParams.append('sessionToken', sessionToken);

      const url = `${Globals.URL}/quiz-sessions/progress/${userId}?${queryParams.toString()}`;
      const response = await axios.get(url);

      setProgressData(response.data);
    } catch (err) {
      console.error('Error fetching progress data:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && username && sessionToken) {
      fetchProgressData();
    }
  }, [userId, username, sessionToken]);

  if (loading) {
    return (
      <div className="progress-container">
        <Spinner fullScreen label={t.loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-container">
        <div className="error-message">
          <p><Icon name="x-circle" size={15} /> {error}</p>
          <button onClick={fetchProgressData} className="retry-button">
            <Icon name="refresh" size={15} /> {t.retry}
          </button>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="progress-container">
        <div className="no-data">
          <p><Icon name="bar-chart" size={15} /> {t.noData}</p>
        </div>
      </div>
    );
  }

  const {
    totalQuestions = 0,
    answeredQuestions = 0,
    percentageCompleted = 0,
    remainingQuestions = 0,
    sourceBreakdown = {},
    typeBreakdown = {}
  } = progressData;

  // Labels come from the shared source map so the names here can never drift
  // from the ones the launcher and the history view use.
  const sources = [
    { key: 'MidgardGameBoy', color: '#10b981' },
    { key: 'October25', color: '#a855f7' },
    { key: 'November25', color: '#ec4899' },
    { key: 'December25', color: '#14b8a6' },
    { key: 'January25', color: '#6366f1' },
    { key: 'FebMarApr25', color: '#f43f5e' },
    { key: 'May26', color: '#0ea5e9' },
    { key: 'June26', color: '#22c55e' },
    // nursing track
    { key: 'NursingMostRepeated', color: '#10b981' },
    { key: 'NursingConfirmed', color: '#0ea5e9' },
    // legacy sources kept for historical sessions
    { key: 'NursingEMS', color: '#6366f1' },
    { key: 'general', color: '#3b82f6' },
    { key: 'Midgard', color: '#84cc16' },
    { key: 'GameBoy', color: '#f59e0b' }
  ].map((s) => ({ ...s, label: getSourceLabel(s.key, lang) }));

  // The breakdown covers this student's own specialties. The backend already
  // scopes the totals to their track, so the two always line up.
  const questionTypes = specialtiesOf(track).map((sp, i) => ({
    key: sp.key,
    label: pick(sp.label, lang),
    color: TYPE_COLORS[i % TYPE_COLORS.length],
  }));

  return (
    <div className="progress-container" dir={dir}>
      {/* Overall Progress */}
      <div className="progress-section">
        <h3 className="section-title"><Icon name="bar-chart" size={15} /> {t.overallTitle}</h3>
        <div className="progress-overview">
          <div className="progress-card main-progress">
            <div className="progress-header">
              <h4>{t.overallCard}</h4>
              <span className="progress-percentage">{percentageCompleted.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${percentageCompleted}%` }}
              ></div>
            </div>
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">{t.answered}</span>
                <span className="stat-value answered">{fmt(answeredQuestions)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t.remaining}</span>
                <span className="stat-value remaining">{fmt(remainingQuestions)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t.total}</span>
                <span className="stat-value total">{fmt(totalQuestions)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Source Breakdown */}
      <div className="progress-section">
        <h3 className="section-title"><Icon name="book-open" size={15} /> {t.bySource}</h3>
        <div className="breakdown-grid">
          {/* Only show sources that still have questions — this hides the
              retired general/Midgard/GameBoy sources (0 questions after the
              2026 bank swap) while keeping their labels available above for
              rendering historical quiz sessions. */}
          {sources.filter(source => (sourceBreakdown[source.key]?.total || 0) > 0).map(source => {
            const sourceData = sourceBreakdown[source.key];
            const percentage = sourceData.total > 0 ? (sourceData.answered / sourceData.total) * 100 : 0;

            return (
              <div key={source.key} className="breakdown-card">
                <div className="breakdown-header">
                  <h4 style={{ color: source.color }}>{source.label}</h4>
                  <span className="breakdown-percentage">{percentage.toFixed(1)}%</span>
                </div>
                <div className="breakdown-progress-bar">
                  <div
                    className="breakdown-progress-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: source.color
                    }}
                  ></div>
                </div>
                <div className="breakdown-stats">
                  <div className="breakdown-stat">
                    <span className="breakdown-label">{t.answered}</span>
                    <span className="breakdown-value">{fmt(sourceData.answered)}</span>
                  </div>
                  <div className="breakdown-stat">
                    <span className="breakdown-label">{t.total}</span>
                    <span className="breakdown-value">{fmt(sourceData.total)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Type Breakdown */}
      <div className="progress-section">
        <h3 className="section-title"><Icon name="target" size={15} /> {t.bySpecialty}</h3>
        <div className="breakdown-grid">
          {questionTypes.map(type => {
            const typeData = typeBreakdown[type.key] || { answered: 0, total: 0 };
            const percentage = typeData.total > 0 ? (typeData.answered / typeData.total) * 100 : 0;

            return (
              <div key={type.key} className="breakdown-card">
                <div className="breakdown-header">
                  <h4 style={{ color: type.color }}>{type.label}</h4>
                  <span className="breakdown-percentage">{percentage.toFixed(1)}%</span>
                </div>
                <div className="breakdown-progress-bar">
                  <div
                    className="breakdown-progress-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: type.color
                    }}
                  ></div>
                </div>
                <div className="breakdown-stats">
                  <div className="breakdown-stat">
                    <span className="breakdown-label">{t.answered}</span>
                    <span className="breakdown-value">{fmt(typeData.answered)}</span>
                  </div>
                  <div className="breakdown-stat">
                    <span className="breakdown-label">{t.total}</span>
                    <span className="breakdown-value">{fmt(typeData.total)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Insights */}
      <div className="progress-section">
        <h3 className="section-title"><Icon name="lightbulb" size={15} /> {t.insightsTitle}</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon"><Icon name="target" size={26} /></div>
            <div className="insight-content">
              <h4>{t.focusAreas}</h4>
              <p>
                {Object.entries(sourceBreakdown).map(([key, data]) => {
                  const percentage = data.total > 0 ? (data.answered / data.total) * 100 : 0;
                  return percentage < 50 ? sources.find(s => s.key === key)?.label : null;
                }).filter(Boolean).join(', ') || t.allCovered}
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon"><Icon name="trending-up" size={26} /></div>
            <div className="insight-content">
              <h4>{t.completionRate}</h4>
              <p>
                {t.completionBody(percentageCompleted.toFixed(1))}
                {remainingQuestions > 0 ? t.remainingBody(fmt(remainingQuestions)) : t.allDone}
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon"><Icon name="trophy" size={26} /></div>
            <div className="insight-content">
              <h4>{t.achievement}</h4>
              <p>
                {percentageCompleted >= 100 ? <><Icon name="sparkles" size={14} /> {t.achieve100}</> :
                  percentageCompleted >= 75 ? <><Icon name="flame" size={14} /> {t.achieve75}</> :
                    percentageCompleted >= 50 ? <><Icon name="book-open" size={14} /> {t.achieve50}</> :
                      <><Icon name="rocket" size={14} /> {t.achieve0}</>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
