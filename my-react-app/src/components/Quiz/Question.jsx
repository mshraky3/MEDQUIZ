import React from 'react';

const Question = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedAnswer, 
  onSelectOption, 
  onNextQuestion, 
  onPreviousQuestion, 
  onFinishQuiz, 
  isTrial,
  timeRemaining,
  timerMinutes
}) => {
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

  return (
    <div className="quiz-container-card">
      {/* Trial User Notice */}
      {isTrial && (
        <div className="trial-quiz-notice">
          <span className="trial-emoji">🎯</span>
          <span className="trial-text">Free Trial Mode</span>
        </div>
      )}
      
      {/* Timer Display */}
      {timerMinutes && (
        <div className="timer-display" style={{ color: getTimerColor() }}>
          ⏰ {formatTime(timeRemaining)}
        </div>
      )}
      
      {/* Question Card */}
      <div className="question-card">
        <div className="question-header">
          <div className="header-top">
            <h3>Question {questionNumber}</h3>
            <div className="progress-compact">Q{questionNumber}/{totalQuestions}</div>
          </div>
        </div>
        <div className="question-content">
          <div className="question-text">{question.question_text}</div>
          
          <div className="options">
            {['option1', 'option2', 'option3', 'option4'].map((optKey, index) => (
              <button
                key={index}
                className={`option-button ${selectedAnswer === question[optKey] ? "selected" : ""}`}
                onClick={() => onSelectOption(question[optKey])}
              >
                {question[optKey]}
              </button>
            ))}
          </div>
          
          {/* Navigation Buttons inside question card */}
          <div className="navigation-section">
            <button
              className="nav-button prev-button"
              onClick={onPreviousQuestion}
              disabled={questionNumber === 1}
            >
              ← Previous
            </button>
            
            <button
              className="nav-button next-button"
              onClick={questionNumber === totalQuestions ? onFinishQuiz : onNextQuestion}
              disabled={questionNumber === totalQuestions && !selectedAnswer}
            >
              {questionNumber === totalQuestions ? "Finish Quiz" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
