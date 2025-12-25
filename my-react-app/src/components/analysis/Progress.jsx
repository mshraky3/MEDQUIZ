import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Globals from '../../global.js';
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
      setError('Failed to load progress data');
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
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-container">
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={fetchProgressData} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="progress-container">
        <div className="no-data">
          <p>📊 No progress data available</p>
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
    { key: 'general', label: 'General', color: '#3b82f6' },
    { key: 'Midgard', label: 'Midgard', color: '#10b981' },
    { key: 'GameBoy', label: 'GameBoy', color: '#f59e0b' }
  ];

  const questionTypes = [
    { key: 'pediatric', label: 'Pediatric', color: '#8b5cf6' },
    { key: 'obstetrics and gynecology', label: 'Obstetrics & Gynecology', color: '#06b6d4' },
    { key: 'medicine', label: 'Medicine', color: '#f97316' },
    { key: 'surgery', label: 'Surgery', color: '#ef4444' },
  ];

  return (
    <div className="progress-container">
      {/* Overall Progress */}
      <div className="progress-section">
        <h3 className="section-title">📊 Overall Progress</h3>
        <div className="progress-overview">
          <div className="progress-card main-progress">
            <div className="progress-header">
              <h4>Total Progress</h4>
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
                <span className="stat-label">Answered:</span>
                <span className="stat-value answered">{answeredQuestions.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Remaining:</span>
                <span className="stat-value remaining">{remainingQuestions.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value total">{totalQuestions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Source Breakdown */}
      <div className="progress-section">
        <h3 className="section-title">📚 Progress by Source</h3>
        <div className="breakdown-grid">
          {sources.map(source => {
            const sourceData = sourceBreakdown[source.key] || { answered: 0, total: 0 };
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
                    <span className="breakdown-label">Answered:</span>
                    <span className="breakdown-value">{sourceData.answered.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-stat">
                    <span className="breakdown-label">Total:</span>
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
        <h3 className="section-title">🎯 Progress by Question Type</h3>
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
                    <span className="breakdown-label">Answered:</span>
                    <span className="breakdown-value">{typeData.answered.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-stat">
                    <span className="breakdown-label">Total:</span>
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
        <h3 className="section-title">💡 Progress Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Focus Areas</h4>
              <p>
                {Object.entries(sourceBreakdown).map(([key, data]) => {
                  const percentage = data.total > 0 ? (data.answered / data.total) * 100 : 0;
                  return percentage < 50 ? sources.find(s => s.key === key)?.label : null;
                }).filter(Boolean).join(', ') || 'All sources are well covered!'}
              </p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h4>Completion Rate</h4>
              <p>
                You've completed {percentageCompleted.toFixed(1)}% of all available questions. 
                {remainingQuestions > 0 ? ` ${remainingQuestions.toLocaleString()} questions remaining.` : ' Congratulations! You\'ve completed all questions!'}
              </p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🏆</div>
            <div className="insight-content">
              <h4>Achievement</h4>
              <p>
                {percentageCompleted >= 100 ? '🎉 Perfect! You\'ve completed all questions!' :
                 percentageCompleted >= 75 ? '🔥 Excellent progress! You\'re almost there!' :
                 percentageCompleted >= 50 ? '📚 Good progress! Keep up the momentum!' :
                 '🚀 Great start! Keep practicing to improve your progress!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
