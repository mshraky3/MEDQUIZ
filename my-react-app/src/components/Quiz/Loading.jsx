import React from 'react';
import './Loading.css';

const Loading = () => (
  <div className="quiz-container">
    <div className="loading-content">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <h2>Loading Questions</h2>
      <p>Preparing your quiz...</p>
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
);

export default Loading;
