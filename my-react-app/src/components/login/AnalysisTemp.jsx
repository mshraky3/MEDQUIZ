import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Import necessary components from the analysis folder
import GoogleAd from '../common/GoogleAd';
import OverallStats from '../analysis/OverallStats';
import StreakInfo from '../analysis/StreakInfo';
import TopicAnalysisTable from '../analysis/TopicAnalysisTable';
import QuestionAttemptsTable from '../analysis/QuestionAttemptsTable';
import LastQuizSummary from '../analysis/LastQuizSummary';

const AnalysisTemp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, answers, questions } = location.state || {};

  if (!answers || !questions) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>No quiz data found. Please complete the quiz first.</p>
        <button onClick={() => navigate(-1)} className="primary-button">Go Back</button>
      </div>
    );
  }

  const totalQuestions = answers.length;
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  const userAnalysis = {
    total_quizzes: 1,
    avg_accuracy: accuracy,
    total_questions_answered: totalQuestions,
    total_correct_answers: correctAnswers,
    latest_quiz: {
      id: 1,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      quiz_accuracy: accuracy,
      duration: 60,
      avg_time_per_question: (60 / totalQuestions).toFixed(2),
    }
  };


  const streakData = {
    current_streak: 1,
    longest_streak: 3,
  };

  const topicMap = {};
  answers.forEach((ans, index) => {
    const question = questions[index];
    const topic = question?.question_type || 'Other';

    if (!topicMap[topic]) {
      topicMap[topic] = { total: 0, correct: 0 };
    }
    topicMap[topic].total += 1;
    if (ans.isCorrect) {
      topicMap[topic].correct += 1;
    }
  });

  const topicAnalysis = Object.keys(topicMap).map(topic => ({
    question_type: topic,
    total_answered: topicMap[topic].total,
    total_correct: topicMap[topic].correct,
    accuracy: ((topicMap[topic].correct / topicMap[topic].total) * 100).toFixed(2),
    avg_time: (60 / totalQuestions).toFixed(2)
  }));

  const questionAttempts = answers.map((answer, index) => {
    const q = questions[index];
    return {
      id: q.id,
      question_id: q.id,
      selected_option: answer.selected,
      is_correct: answer.isCorrect,
      attempted_at: new Date().toISOString()
    };
  });

  const handleGetAccountClick = () => {
    window.open("https://wa.link/pzhg6j ", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="analysis-wrapper fade-in">
      <h2 className="screen-title">Quiz Health Report</h2>

      {/* === OverallStats Component === */}
      <OverallStats userAnalysis={userAnalysis} />

      {/* === StreakInfo Component === */}
      <StreakInfo streakData={streakData} />

      {/* === TopicAnalysisTable Component === */}
      <TopicAnalysisTable topicAnalysis={topicAnalysis} />

      {/* === LastQuizSummary Component === */}
      <LastQuizSummary latest_quiz={userAnalysis.latest_quiz} />

      {/* === QuestionAttemptsTable Component === */}
      <QuestionAttemptsTable questionAttempts={questionAttempts} questions={questions} />

      {/* Action Buttons */}
      <div className="button-bar">
        <button
          onClick={handleGetAccountClick}
          className="primary-button"
        >
          Get an Account
        </button>
      </div>
      <GoogleAd />
    </div>
  );
};

export default AnalysisTemp;