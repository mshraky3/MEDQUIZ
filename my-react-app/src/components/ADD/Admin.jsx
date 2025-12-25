import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import AdminNavbar from './AdminNavbar.jsx';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page-wrapper">
      <AdminNavbar />
      <div className="admin-container">
      
      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-icon">👤</div>
          <h3>User Management</h3>
          <p>Add new user accounts and manage existing users</p>
          <button
            className="admin-button"
            onClick={() => navigate('/ADD_ACCOUNT')}
          >
            Manage Users
          </button>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">❓</div>
          <h3>Question Bank</h3>
          <p>Add new questions and manage the question database</p>
          <button
            className="admin-button"
            onClick={() => navigate('/ADDQ')}
          >
            Add Questions
          </button>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">📚</div>
          <h3>Question Library</h3>
          <p>View and browse all questions in the database</p>
          <button
            className="admin-button"
            onClick={() => navigate('/Bank')}
          >
            View All Questions
          </button>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">🔗</div>
          <h3>Temporary Signup Links</h3>
          <p>Create and manage temporary signup links for free accounts</p>
          <button
            className="admin-button"
            onClick={() => navigate('/TEMP_LINKS')}
          >
            Manage Links
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h4>Quick Stats</h4>
          <p>• Manage user accounts and subscriptions</p>
          <p>• Add new medical questions</p>
          <p>• Monitor platform performance</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Admin;
