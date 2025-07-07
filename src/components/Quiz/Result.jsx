import React from 'react';

const Result = ({ answers, navigate, id }) => {
  const totalQuestions = answers.length;
  const correctCount = answers.filter(a => a.isCorrect).length;

  return (
    <div className="quiz-result">
      <h2>Quiz Completed!</h2>
      <p>You got <strong>{correctCount}</strong> out of <strong>{totalQuestions}</strong> correct.</p>
      <button onClick={() => navigate("/quizs", { state: { id } })} className="restart-button">Take another quiz</button>
      <button onClick={() => navigate("/analysis", { state: { id } })} className="home-button">View Analysis</button>
    </div>
  );
};

export default Result;
