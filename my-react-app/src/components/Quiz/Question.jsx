import React from 'react';

const Question = ({ question, questionNumber, totalQuestions, selectedAnswer, onSelectOption, onSubmitAnswer, isTrial }) => (
  <div className="quiz-container">
    {/* Trial User Notice */}
    {isTrial && (
      <div className="trial-quiz-notice">
        <span className="trial-emoji">🎯</span>
        <span className="trial-text">Free Trial Mode</span>
      </div>
    )}
    
    <div className="progress">Question <strong>{questionNumber}</strong> of <strong>{totalQuestions}</strong></div>
    <div className="question-text" style={{textAlign: 'center', fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem', color: '#333', lineHeight: '1.5'}}>{question.question_text}</div>

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

    <div className="submit-section">
      <button
        className="submit-button"
        onClick={onSubmitAnswer}
        disabled={!selectedAnswer}
      >
        {questionNumber < totalQuestions ? "Next Question" : "Finish Quiz"}
      </button>
    </div>
  </div>
);

export default Question;
