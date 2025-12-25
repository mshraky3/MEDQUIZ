import React from 'react';

const ErrorScreen = ({ message, navigate, id, onRetry }) => (
  <div className="quiz-container">
    <div className="error-content">
      <div className="error-icon">⚠️</div>
      <h2>Loading Failed</h2>
      <p>{message}</p>
      <div className="error-actions">
        {onRetry && (
          <button 
            className="retry-button" 
            onClick={onRetry}
          >
            🔄 Try Again
          </button>
        )}
        <button 
          className="back-button" 
          onClick={() => navigate("/quizs", { state: { id } })}
        >
          ← Go Back
        </button>
      </div>
    </div>
  </div>
);

export default ErrorScreen;
