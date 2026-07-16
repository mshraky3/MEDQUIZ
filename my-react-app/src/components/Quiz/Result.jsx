import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';

const TYPE_AR = {
  pediatric: 'الأطفال',
  'obstetrics and gynecology': 'النساء والولادة',
  medicine: 'الباطنة',
  surgery: 'الجراحة'
};

const Result = ({
  correctAnswers,
  totalQuestions,
  accuracy,
  duration,
  isFinalQuiz,
  onRetry,
  userId,
  completedTopics = []
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
      {completedTopics.length > 0 && (
        <div className="result-completion-banner" dir="rtl">
          <Icon name="trophy" size={20} />
          <span>
            🎉 مبروك! أنهيت جميع أسئلة{' '}
            {completedTopics
              .map(c => `${TYPE_AR[c.type] || c.type} · ${getSourceLabel(c.source)}`)
              .join('، ')}
          </span>
        </div>
      )}
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
