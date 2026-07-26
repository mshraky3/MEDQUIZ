import React, { useState } from 'react';
import Icon from '../common/Icon.jsx';
import ReportModal from './ReportModal';
import './ReportModal.css';

const Question = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  onNextQuestion,
  onPreviousQuestion,
  onFinishQuiz,
  timeRemaining,
  timerMinutes,
  userId,
  userEmail,
}) => {
  const [showReport, setShowReport] = useState(false);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!timeRemaining) return '#333';
    if (timeRemaining <= 60) return '#dc3545'; // Red
    if (timeRemaining <= 300) return '#ffc107'; // Yellow
    return '#28a745'; // Green
  };

  const safeQuestionText = question?.question_text || 'محتوى السؤال غير متوفر.';
  const optionKeys = ['option1', 'option2', 'option3', 'option4'];

  return (
    <>
      <div className="quiz-container-card">
        {/* Timer Display */}
        {timerMinutes && (
          <div className="timer-display" style={{ color: getTimerColor() }}>
            <Icon name="clock" size={15} /> {formatTime(timeRemaining)}
          </div>
        )}

        {/* Question Card */}
        <div className="question-card">
          <div className="question-header">
            <div className="header-top">
              <h3>سؤال {questionNumber}</h3>
              <div className="progress-compact">{questionNumber}/{totalQuestions}</div>
            </div>
          </div>
          <div className="question-content">
            <div className="question-text">{safeQuestionText}</div>

            <div className="options">
              {optionKeys.map((optKey, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedAnswer === question?.[optKey] ? "selected" : ""}`}
                  onClick={() => question?.[optKey] && onSelectOption(question[optKey])}
                  disabled={!question?.[optKey]}
                >
                  {question?.[optKey] || 'الخيار غير متوفر'}
                </button>
              ))}
            </div>

            {/* Report button */}
            {userId && userEmail && (
              <div style={{ textAlign: 'right' }}>
                <button className="report-question-btn" onClick={() => setShowReport(true)}>
                  <Icon name="flag" size={15} /> الإبلاغ عن خطأ
                </button>
              </div>
            )}

            {/* Navigation Buttons inside question card */}
            <div className="navigation-section">
              <button
                className="nav-button prev-button"
                onClick={onPreviousQuestion}
                disabled={questionNumber === 1}
              >
                → السابق
              </button>

              <button
                className="nav-button next-button"
                onClick={questionNumber === totalQuestions ? onFinishQuiz : onNextQuestion}
                disabled={questionNumber === totalQuestions && !selectedAnswer}
              >
                {questionNumber === totalQuestions ? "إنهاء الاختبار" : "التالي ←"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showReport && (
        <ReportModal
          question={question}
          userId={userId}
          userEmail={userEmail}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
};

export default Question;
