import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';  // import the CSS file

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <button
        className="admin-button"
        onClick={() => navigate('/ADD_ACCOUNT')}
      >
        Add Account
      </button>
      <button
        className="admin-button"
        onClick={() => navigate('/ADDQ')}
      >
        Add Question
      </button>
      <button
        className="admin-button"
        onClick={() => navigate('/Bank')}
      >
        Show All Questions
      </button>
    </div>
  );
};

export default Admin;
