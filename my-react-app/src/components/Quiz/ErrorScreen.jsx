import React from 'react';

const ErrorScreen = ({ message, navigate, id, onRetry }) => (
  <div className="quiz-container">
    <div className="error-content">
      <div className="error-icon">⚠️</div>
      <h2>فشل التحميل</h2>
      <p>{message}</p>
      <div className="error-actions">
        {onRetry && (
          <button
            className="retry-button"
            onClick={onRetry}
          >
            🔄 إعادة المحاولة
          </button>
        )}
        <button
          className="back-button"
          onClick={() => navigate("/quizs", { state: { id } })}
          aria-label="رجوع"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export default ErrorScreen;
