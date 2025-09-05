import React, { useState, useEffect } from 'react';
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

  const { id, answers, questions, duration } = location.state || {};

  // Add Google AdSense script
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9286976335875618";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
    
    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

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
  const actualDuration = duration || 60; // Use actual duration or default to 60 seconds
  const avgTimePerQuestion = (actualDuration / totalQuestions).toFixed(2);

  const userAnalysis = {
    total_quizzes: 1,
    avg_accuracy: accuracy,
    total_questions_answered: totalQuestions,
    total_correct_answers: correctAnswers,
    total_duration: actualDuration,
    avg_duration: actualDuration,
    latest_quiz: {
      id: 1,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      quiz_accuracy: accuracy,
      duration: actualDuration,
      avg_time_per_question: avgTimePerQuestion,
      source: 'general',
      topics_covered: [selectedTopic]
    }
  };


  const streakData = {
    current_streak: 1,
    longest_streak: 3,
  };

  // Get the selected topic from the quiz data
  const selectedTopic = location.state?.types || 'surgery'; // Default to surgery if not specified
  
  const topicMap = {};
  answers.forEach((ans, index) => {
    const question = questions[index];
    const topic = question?.question_type || selectedTopic;

    if (!topicMap[topic]) {
      topicMap[topic] = { total: 0, correct: 0 };
    }
    topicMap[topic].total += 1;
    if (ans.isCorrect) {
      topicMap[topic].correct += 1;
    }
  });

  // Only show the topic that was actually selected for the quiz
  const topicAnalysis = Object.keys(topicMap)
    .filter(topic => topic === selectedTopic) // Only show the selected topic
    .map(topic => ({
      question_type: topic,
      total_answered: topicMap[topic].total,
      total_correct: topicMap[topic].correct,
      accuracy: ((topicMap[topic].correct / topicMap[topic].total) * 100).toFixed(2),
      avg_time: avgTimePerQuestion
    }));

  const questionAttempts = answers.map((answer, index) => {
    const q = questions[index];
    return {
      id: q.id,
      question_id: q.id,
      selected_option: answer.selected,
      is_correct: answer.isCorrect,
      attempted_at: new Date().toISOString(),
      quiz_session_id: 1 // Use the same ID as latest_quiz.id
    };
  });

  const handleGetAccountClick = () => {
    navigate('/payment');
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
      <QuestionAttemptsTable 
        questionAttempts={questionAttempts} 
        questions={questions} 
        latestQuiz={userAnalysis.latest_quiz}
        isTrial={true}
      />

      {/* Action Buttons */}
      <div className="button-bar">
        <button
          onClick={handleGetAccountClick}
          className="primary-button"
        >
          Subscribe Now
        </button>
      </div>
      <GoogleAd />
    </div>
  );
};

export default AnalysisTemp;