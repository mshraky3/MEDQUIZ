import React from 'react';
import Spinner from '../common/Spinner.jsx';
import './Loading.css';

const Loading = () => (
  <div className="quiz-container">
    <div className="loading-content">
      <Spinner size="lg" />
      <h2>جاري تحميل الأسئلة</h2>
      <p>جاري تجهيز الاختبار...</p>
      <div className="loading-bar">
        <div className="loading-bar-fill"></div>
      </div>
    </div>
  </div>
);

export default Loading;
