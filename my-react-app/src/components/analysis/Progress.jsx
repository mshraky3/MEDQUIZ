import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon.jsx';
import axios from 'axios';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';
import './Progress.css';

const Progress = ({ userId, username, sessionToken }) => {
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
      setError('فشل في تحميل بيانات التقدم');
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
        <Spinner fullScreen label="جاري تحميل بيانات التقدم..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-container">
        <div className="error-message">
          <p><Icon name="x-circle" size={15} /> {error}</p>
          <button onClick={fetchProgressData} className="retry-button">
            <Icon name="refresh" size={15} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="progress-container">
        <div className="no-data">
          <p><Icon name="bar-chart" size={15} /> لا توجد بيانات تقدم متاحة</p>
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

  const sources = [
    { key: 'MidgardGameBoy', label: 'Midgard & GameBoy', color: '#10b981' },
    { key: 'October25', label: '2025 تجميعات اكتوبر', color: '#a855f7' },
    { key: 'November25', label: '2025 تجميعات نوفمبر', color: '#ec4899' },
    { key: 'December25', label: '2025 تجميعات ديسمبر', color: '#14b8a6' },
    { key: 'January25', label: '2026 تجميعات يناير', color: '#6366f1' },
    { key: 'FebMarApr25', label: '2026 تجميعات فبراير-مارس-ابريل', color: '#f43f5e' },
    { key: 'May26', label: '2026 تجميعات مايو', color: '#0ea5e9' },
    { key: 'June26', label: '2026 تجميعات يونيو', color: '#22c55e' },
    // legacy sources kept for historical sessions
    { key: 'general', label: 'عام', color: '#3b82f6' },
    { key: 'Midgard', label: 'Midgard', color: '#84cc16' },
    { key: 'GameBoy', label: 'GameBoy', color: '#f59e0b' }
  ];

  const questionTypes = [
    { key: 'pediatric', label: 'Pediatric', color: '#8b5cf6' },
    { key: 'obstetrics and gynecology', label: 'OB/GYN', color: '#06b6d4' },
    { key: 'medicine', label: 'Internal Medicine', color: '#f97316' },
    { key: 'surgery', label: 'Surgery', color: '#ef4444' },
  ];

  return (
    <div className="progress-container">
      {/* Overall Progress */}
      <div className="progress-section">
        <h3 className="section-title"><Icon name="bar-chart" size={15} /> التقدم العام</h3>
        <div className="progress-overview">
          <div className="progress-card main-progress">
            <div className="progress-header">
              <h4>التقدم الكلي</h4>
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
                <span className="stat-label">تمت الإجابة:</span>
                <span className="stat-value answered">{answeredQuestions.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">المتبقي:</span>
                <span className="stat-value remaining">{remainingQuestions.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">الإجمالي:</span>
                <span className="stat-value total">{totalQuestions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Source Breakdown */}
      <div className="progress-section">
        <h3 className="section-title"><Icon name="book-open" size={15} /> التقدم حسب المصدر</h3>
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
                    <span className="breakdown-label">تمت الإجابة:</span>
                    <span className="breakdown-value">{sourceData.answered.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-stat">
                    <span className="breakdown-label">الإجمالي:</span>
                    <span className="breakdown-value">{sourceData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Type Breakdown */}
      <div className="progress-section">
        <h3 className="section-title"><Icon name="target" size={15} /> التقدم حسب التخصص</h3>
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
                    <span className="breakdown-label">تمت الإجابة:</span>
                    <span className="breakdown-value">{typeData.answered.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-stat">
                    <span className="breakdown-label">الإجمالي:</span>
                    <span className="breakdown-value">{typeData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Insights */}
      <div className="progress-section">
        <h3 className="section-title"><Icon name="lightbulb" size={15} /> ملاحظات التقدم</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon"><Icon name="target" size={26} /></div>
            <div className="insight-content">
              <h4>مجالات التركيز</h4>
              <p>
                {Object.entries(sourceBreakdown).map(([key, data]) => {
                  const percentage = data.total > 0 ? (data.answered / data.total) * 100 : 0;
                  return percentage < 50 ? sources.find(s => s.key === key)?.label : null;
                }).filter(Boolean).join(', ') || 'جميع المصادر مغطاة بشكل جيد!'}
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon"><Icon name="trending-up" size={26} /></div>
            <div className="insight-content">
              <h4>نسبة الإكمال</h4>
              <p>
                لقد أكملت {percentageCompleted.toFixed(1)}% من جميع الأسئلة المتاحة.
                {remainingQuestions > 0 ? ` ${remainingQuestions.toLocaleString()} سؤال متبقي.` : ' مبروك! لقد أكملت جميع الأسئلة!'}
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon"><Icon name="trophy" size={26} /></div>
            <div className="insight-content">
              <h4>الإنجاز</h4>
              <p>
                {percentageCompleted >= 100 ? <><Icon name="sparkles" size={14} /> ممتاز! لقد أكملت جميع الأسئلة!</> :
                  percentageCompleted >= 75 ? <><Icon name="flame" size={14} /> تقدم رائع! أنت قريب من النهاية!</> :
                    percentageCompleted >= 50 ? <><Icon name="book-open" size={14} /> تقدم جيد! استمر في المذاكرة!</> :
                      <><Icon name="rocket" size={14} /> بداية رائعة! استمر في التدريب لتحسين تقدمك!</>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
