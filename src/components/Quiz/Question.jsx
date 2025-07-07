import React from 'react';

const Question = ({ currentQuestion, currentIndex, totalQuestions, selectedAnswer, onSelectOption, onSubmitAnswer }) => (
  <div className="quiz-container">
    <div className="progress">Question <strong>{currentIndex + 1}</strong> of <strong>{totalQuestions}</strong></div>
    <h2 className="question-text">{currentQuestion.question_text}</h2>

    <div className="options">
      {['option1', 'option2', 'option3', 'option4'].map((optKey, index) => (
        <button
          key={index}
          className={`option-button ${selectedAnswer === currentQuestion[optKey] ? "selected" : ""}`}
          onClick={() => onSelectOption(currentQuestion[optKey])}
        >
          {currentQuestion[optKey]}
        </button>
      ))}
    </div>

    <div className="submit-section">
      <button
        className="submit-button"
        onClick={onSubmitAnswer}
        disabled={!selectedAnswer}
      >
        {currentIndex + 1 < totalQuestions ? "Next Question" : "Finish Quiz"}
      </button>
    </div>
  </div>
);

export default Question;
