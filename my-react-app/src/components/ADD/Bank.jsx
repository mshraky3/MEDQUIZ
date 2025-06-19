import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Bank.css";
import Globals from "../../global";

const Bank = () => {
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question_text: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    question_type: "",
    correct_option: ""
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const questionTypes = [
    "pediatric",
    "obstetrics and gynecology",
    "medicine",
    "surgery"
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${Globals.URL}/api/all-questions`);
      setQuestions(response.data.questions);
      setAllQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setQuestions(allQuestions);
    } else {
      const filtered = allQuestions.filter((q) =>
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setQuestions(filtered);
    }
  }, [searchTerm, allQuestions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditing = (question) => {
    setEditingQuestion(question.id);
    setFormData({
      question_text: question.question_text,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      question_type: question.question_type || "",
      correct_option: question.correct_option
    });
  };

  const cancelEditing = () => {
    setEditingQuestion(null);
    setFormData({
      question_text: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      question_type: "",
      correct_option: ""
    });
  };

  const saveQuestion = async () => {
    try {
      const response = await axios.put(
        `${Globals.URL}/questions/${editingQuestion}`,
        formData
      );

      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion ? response.data.question : q))
      );
      setAllQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion ? response.data.question : q))
      );

      cancelEditing();

      setSuccessMessage("✅ Question updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Question Bank</h1>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading questions, please wait...</p>
        </div>
      ) : (
        <>
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="question-list">
            {questions.length === 0 ? (
              <p>No questions found.</p>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="question-card">
                  {editingQuestion === q.id ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label>Question Text:</label>
                        <textarea
                          name="question_text"
                          value={formData.question_text}
                          onChange={handleInputChange}
                          rows="3"
                        />
                      </div>

                      <div className="form-group">
                        <label>Options:</label>
                        <input
                          name="option1"
                          value={formData.option1}
                          onChange={handleInputChange}
                        />
                        <input
                          name="option2"
                          value={formData.option2}
                          onChange={handleInputChange}
                        />
                        <input
                          name="option3"
                          value={formData.option3}
                          onChange={handleInputChange}
                        />
                        <input
                          name="option4"
                          value={formData.option4}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Question Type:</label>
                        <select
                          name="question_type"
                          value={formData.question_type}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Type</option>
                          {questionTypes.map((type, idx) => (
                            <option key={idx} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Correct Answer:</label>
                        <select
                          name="correct_option"
                          value={formData.correct_option}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Correct Option</option>
                          {[formData.option1, formData.option2, formData.option3, formData.option4].map((opt, idx) => (
                            <option key={idx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="button-group">
                        <button className="quiz-button" onClick={saveQuestion}>
                          Save
                        </button>
                        <button
                          className="analysis-button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="question-text">{q.question_text}</p>

                      <div className="options">
                        <p>1. {q.option1}</p>
                        <p>2. {q.option2}</p>
                        <p>3. {q.option3}</p>
                        <p>4. {q.option4}</p>
                      </div>

                      <p className="correct-answer">
                        <strong>Answer:</strong> {q.correct_option}
                      </p>
                      <p className="question-type">
                        <strong>Type:</strong> {q.question_type || "N/A"}
                      </p>

                      <button
                        className="quiz-button"
                        onClick={() => startEditing(q)}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bank;
