import React from 'react';
import './Loading.css';

const Loading = () => (
  <div className="quiz-container">
    <div className="loading-content">
      <div className="loading-orbital">
        <div className="orbital-ring orbital-ring-1"></div>
        <div className="orbital-ring orbital-ring-2"></div>
        <div className="orbital-ring orbital-ring-3"></div>
        <div className="orbital-core"></div>
      </div>
      <h2>جاري تحميل الأسئلة</h2>
      <p>جاري تجهيز الاختبار...</p>
      <div className="loading-bar">
        <div className="loading-bar-fill"></div>
      </div>
    </div>
  </div>
);

export default Loading;
