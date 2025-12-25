import React from 'react';
import { useNavigate } from 'react-router-dom';

const Result = ({ 
  correctAnswers, 
  totalQuestions, 
  accuracy, 
  duration, 
  answers, 
  isFinalQuiz,
  onRetry, 
  onBackToQuizs,
  userId 
}) => {
  const navigate = useNavigate();

  const handleViewAnalysis = () => {
    if (isFinalQuiz) {
      // For final quiz, navigate to analysis with Final Exams tab
      navigate('/analysis', { state: { id: userId, activeTab: 'final-exams' } });
    } else {
      // For regular users, navigate to analysis with user ID
      navigate('/analysis', { state: { id: userId } });
    }
  };

  return (
    <div className="quiz-result">
      <h2>Quiz Completed!</h2>
      <p>You got <strong>{correctAnswers}</strong> out of <strong>{totalQuestions}</strong> correct.</p>
      <p>Accuracy: <strong>{accuracy}%</strong></p>
      <p>Time taken: <strong>{Math.floor(duration / 60)}m {duration % 60}s</strong></p>
      
      <div className="result-buttons">
        <button onClick={onRetry} className="restart-button">
          Take another quiz
        </button>
        <button onClick={handleViewAnalysis} className="home-button">
          View Analysis
        </button>
      </div>
    </div>
  );
};

export default Result;
