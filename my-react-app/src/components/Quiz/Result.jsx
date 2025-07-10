import React from 'react';
import { useNavigate } from 'react-router-dom';

const Result = ({ 
  correctAnswers, 
  totalQuestions, 
  accuracy, 
  duration, 
  answers, 
  isTrial, 
  onRetry, 
  onBackToQuizs,
  userId 
}) => {
  const navigate = useNavigate();

  const handleViewAnalysis = () => {
    if (isTrial) {
      // Verify trial data is saved before navigating
      const trialAnswers = window.sessionStorage.getItem('trialAnswers');
      if (!trialAnswers) {
        console.error('No trial data found, cannot navigate to analysis');
        alert('Trial data not found. Please try again.');
        return;
      }
      
      // For trial users, navigate to separate trial analysis page
      navigate('/trial-analysis', { state: { id: userId } });
    } else {
      // For regular users, navigate to analysis with user ID
      navigate('/analysis', { state: { id: userId } });
    }
  };

  return (
    <div className="quiz-result">
      {/* Trial User Notice */}
      {isTrial && (
        <div className="trial-result-notice">
          <span className="trial-emoji">🎯</span>
          <span className="trial-text">Free Trial Completed!</span>
        </div>
      )}
      
      <h2>Quiz Completed!</h2>
      <p>You got <strong>{correctAnswers}</strong> out of <strong>{totalQuestions}</strong> correct.</p>
      <p>Accuracy: <strong>{accuracy}%</strong></p>
      <p>Time taken: <strong>{Math.floor(duration / 60)}m {duration % 60}s</strong></p>
      
      <div className="result-buttons">
        {/* Only show analysis button for non-trial users */}
        {!isTrial && (
          <>
            <button onClick={onRetry} className="restart-button">
              Take another quiz
            </button>
            <button onClick={handleViewAnalysis} className="home-button">
              View Analysis
            </button>
          </>
        )}
        {/* For trial users, show contact and free analysis buttons */}
        {isTrial && (
          <>
            <button 
              onClick={() => window.open('https://wa.link/pzhg6j', '_blank')} 
              className="upgrade-button"
            >
              Contact Us
            </button>
            <button 
              onClick={handleViewAnalysis} 
              className="home-button"
            >
              View Free Analysis
            </button>
          </>
        )}
      </div>
      
      {/* Trial completion message */}
      {isTrial && (
        <div className="trial-completion-message">
          <p>🎉 Great job! You've completed your free trial.</p>
          <p>Ready for the full experience? Get access to all 5,000+ questions and detailed analytics!</p>
        </div>
      )}
    </div>
  );
};

export default Result;
