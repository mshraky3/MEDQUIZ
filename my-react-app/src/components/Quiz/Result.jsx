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
      <h2>اكتمل الاختبار!</h2>
      <p>أجبت على <strong>{correctAnswers}</strong> من أصل <strong>{totalQuestions}</strong> بشكل صحيح.</p>
      <p>الدقة: <strong>{accuracy}%</strong></p>
      <p>الوقت المستغرق: <strong>{Math.floor(duration / 60)}د {duration % 60}ث</strong></p>

      <div className="result-buttons">
        <button onClick={onRetry} className="restart-button">
          اختبار آخر
        </button>
        <button onClick={handleViewAnalysis} className="home-button">
          عرض التحليل
        </button>
      </div>
    </div>
  );
};

export default Result;
