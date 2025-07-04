import React from 'react';

const ErrorScreen = ({ message, navigate, id }) => (
  <div className="quiz-container">
    <h2>Error</h2>
    <p>{message}</p>
    <button onClick={() => navigate("/quizs", { state: { id } })}>Go Back</button>
  </div>
);

export default ErrorScreen;
