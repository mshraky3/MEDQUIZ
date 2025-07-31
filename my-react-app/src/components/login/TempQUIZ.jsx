import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import GoogleAd from '../common/GoogleAd';

const STATIC_QUESTIONS = [
  {
    id: 479,
    question_text: "Where is basal cell carcinoma most commonly located?",
    option1: "Face",
    option2: "Breast",
    option3: "Lower limb",
    option4: "Upper limb",
    question_type: "surgery",
    correct_option: "Face"
  },
  {
    id: 1993,
    question_text: "A 60-year-old man with new HTN and DM. HbA1c = 6.9%, proteinuria present. Best antihypertensive?",
    option1: "Lisinopril",
    option2: "Atenolol",
    option3: "Amlodipine",
    option4: "Hydrochlorothiazide",
    question_type: "medicine",
    correct_option: "Lisinopril"
  },
  {
    id: 1802,
    question_text: "A 56-year-old man with epigastric pain, bloating, weight loss. Gastroscopy shows antral mass; biopsy confirms MALToma. H. pylori positive. Next step?",
    option1: "H. pylori eradication therapy",
    option2: "Referral for gastrectomy",
    option3: "Chemotherapy",
    option4: "Radiotherapy",
    question_type: "medicine",
    correct_option: "H. pylori eradication therapy"
  },
  {
    id: 581,
    question_text: "A 15-year-old girl, 7 days post appendectomy, remains febrile and develops respiratory distress requiring ventilation. CT followed by contrast shows bleeding from multiple sites including mouth and IV punctures. Most likely diagnosis?",
    option1: "Haemophilia",
    option2: "Anaphylactic contrast reaction",
    option3: "Idiopathic thrombocytopenic purpura",
    option4: "Disseminated intravascular coagulation",
    question_type: "surgery",
    correct_option: "Disseminated intravascular coagulation"
  },
  {
    id: 1349,
    question_text: "A 35-year-old P2002 presents with secondary amenorrhea for 8 months. Most appropriate first diagnostic step?",
    option1: "Pregnancy test",
    option2: "Pelvic ultrasound",
    option3: "Full history",
    option4: "Clinical examination",
    question_type: "obstetrics and gynecology",
    correct_option: "Pregnancy test"
  },
  {
    id: 2670,
    question_text: "A 12-year-old boy brought to clinic; mother concerned he is the shortest in class. Bone age 10 years, mother 155 cm, father 178 cm, boy 145 cm (5th–10th percentile). What is his target height range?",
    option1: "135–150 cm",
    option2: "151–165 cm",
    option3: "166–180 cm",
    option4: "181–195 cm",
    question_type: "pediatric",
    correct_option: "166–180 cm"
  },
  {
    id: 1435,
    question_text: "A 56-year-old diabetic presents with cough, fever, cavitary lesion in left upper lobe. Best isolation precaution?",
    option1: "Droplet",
    option2: "Contact",
    option3: "Airborne",
    option4: "Standard",
    question_type: "medicine",
    correct_option: "Airborne"
  },
  {
    id: 2800,
    question_text: "A 2-week-old full-term infant with mild jaundice for 6 days, normal ultrasound. Labs: indirect bilirubin = 20 µmol/L. Best initial management?",
    option1: "Observation",
    option2: "Phototherapy",
    option3: "Exchange transfusion",
    option4: "Phenobarbital",
    question_type: "pediatric",
    correct_option: "Observation"
  },
  {
    id: 2513,
    question_text: "Which is the most causative factor for retinopathy of prematurity?",
    option1: "Acidosis",
    option2: "Hyperoxemia",
    option3: "Apnea of prematurity",
    option4: "Gram-negative sepsis",
    question_type: "pediatric",
    correct_option: "Hyperoxemia"
  },
  {
    id: 134,
    question_text: "A 35-year-old man severe RUQ pain, cholecystectomy 7 days prior. CBD 9mm. Most likely diagnosis?",
    option1: "Retained stone",
    option2: "CBD injury",
    option3: "Biloma",
    option4: "Cholangitis",
    question_type: "surgery",
    correct_option: "Retained stone"
  }
];

const TempQUIZ = () => {
  const { numQuestions } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id || 'trial_user';

  const [questions] = useState(STATIC_QUESTIONS.slice(0, parseInt(numQuestions) || 10));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizStartTime] = useState(Date.now());

  // Add Google AdSense script (only in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
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
    }
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
  if (quizFinished) return <Result answers={answers} navigate={navigate} id={id} quizStartTime={quizStartTime} />;

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
const Result = ({ answers, navigate, id, quizStartTime }) => {
  const totalQuestions = answers.length;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const duration = Math.floor((Date.now() - quizStartTime) / 1000); // Duration in seconds

  const handleGetAccountClick = () => {
    window.open("https://wa.link/pzhg6j ", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="quiz-result">
      <h2>Quiz Completed!</h2>
      <p>You got <strong>{correctCount}</strong> out of <strong>{totalQuestions}</strong> correct.</p>
      <p>Time taken: <strong>{Math.floor(duration / 60)}m {duration % 60}s</strong></p>

      <button onClick={handleGetAccountClick} className="restart-button">Get an Account</button>

      <button className="restart-button"  onClick={() => navigate("/analysis-temp", { state: { id, answers, questions: STATIC_QUESTIONS, duration } })}>
        View Analysis
      </button>    </div>
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