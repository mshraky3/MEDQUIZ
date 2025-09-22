import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import GoogleAd from '../common/GoogleAd';
import trialQuestions from '../ADD/datafortrile.js';

const TempQUIZ = () => {
  const { numQuestions } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id || 'trial_user';
  const selectedTypes = location.state?.types;
  const selectedSource = location.state?.source;

  // Filter questions based on selected types and source
  const getFilteredQuestions = () => {
    let filtered = trialQuestions;
    
    // Filter by types if specified
    if (selectedTypes && selectedTypes !== 'mix') {
      const typesArray = selectedTypes.split(',');
      filtered = filtered.filter(q => typesArray.includes(q.question_type));
    }
    
    // Filter by source if specified
    if (selectedSource) {
      filtered = filtered.filter(q => q.source === selectedSource);
    }
    
    return filtered;
  };

  const [questions] = useState(() => {
    const filtered = getFilteredQuestions();
    const requestedCount = parseInt(numQuestions) || 10;
    // If we have fewer questions than requested, use all available
    const count = Math.min(filtered.length, requestedCount);
    return filtered.slice(0, count);
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizStartTime] = useState(Date.now());

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

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectOption = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_option;

    setAnswers(prev => [...prev, {
      question: currentQuestion.question_text,
      selected: selectedAnswer,
      correct: currentQuestion.correct_option,
      isCorrect
    }]);

    setSelectedAnswer(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) return <Loading />;
  if (quizFinished) return <Result answers={answers} navigate={navigate} id={id} quizStartTime={quizStartTime} questions={questions} selectedTypes={selectedTypes} selectedSource={selectedSource} />;

  return (
    <Question
      currentQuestion={questions[currentQuestionIndex]}
      currentIndex={currentQuestionIndex}
      totalQuestions={questions.length}
      selectedAnswer={selectedAnswer}
      onSelectOption={handleSelectOption}
      onSubmitAnswer={handleSubmitAnswer}
    />
  );
};

// Question Component
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
    <GoogleAd />
  </div>
);

// Loading Component
const Loading = () => (
  <div className="quiz-container">
    <h2>Loading questions...</h2>
  </div>
);

// Result Component
const Result = ({ answers, navigate, id, quizStartTime, questions, selectedTypes, selectedSource }) => {
  const totalQuestions = answers.length;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const duration = Math.floor((Date.now() - quizStartTime) / 1000); // Duration in seconds

  const handleGetAccountClick = () => {
    navigate('/payment');
  };

  const handleContactUs = () => {
    // Open email client or contact form
    window.location.href = 'mailto:support@medquiz.com?subject=Free Trial Inquiry&body=Hi, I completed the free trial and would like to know more about the full version.';
  };

  return (
    <div className="quiz-result">
      <h2>Quiz Completed!</h2>
      <p>You got <strong>{correctCount}</strong> out of <strong>{totalQuestions}</strong> correct.</p>
      <p>Accuracy: <strong>{((correctCount / totalQuestions) * 100).toFixed(1)}%</strong></p>
      <p>Time taken: <strong>{Math.floor(duration / 60)}m {duration % 60}s</strong></p>
      
      <div className="trial-result-info">
        <p>🎯 <strong>Free Trial Complete!</strong></p>
        <p>You've experienced {totalQuestions} sample questions from our collection.</p>
        {selectedTypes && selectedTypes !== 'mix' && (
          <p>Topics covered: <strong>{selectedTypes.replace(/,/g, ', ')}</strong></p>
        )}
        {selectedSource && (
          <p>Source: <strong>{selectedSource}</strong></p>
        )}
      </div>

      <div className="result-buttons">
        <button onClick={handleGetAccountClick} className="subscribe-button">
          🚀 Subscribe Now - Full Access
        </button>
        
        <button className="contact-button" onClick={handleContactUs}>
          📧 Contact Us
        </button>

        <button className="analysis-button" onClick={() => navigate("/analysis-temp", { 
          state: { 
            id, 
            answers, 
            questions, 
            duration,
            types: selectedTypes,
            source: selectedSource
          } 
        })}>
          📊 View Analysis
        </button>
      </div>
    </div>
  );
};

// ErrorScreen Component
const ErrorScreen = ({ message, navigate, id }) => (
  <div className="quiz-container">
    <h2>Error</h2>
    <p>{message}</p>
    <button onClick={() => navigate("/quizs", { state: { id } })}>Go Back</button>
  </div>
);

export default TempQUIZ;