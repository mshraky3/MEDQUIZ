import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <button
                style={{ margin: '1rem', padding: '1rem 2rem' }}
                onClick={() => navigate('/ADD_ACCOUNT')}
            >
                Add Account
            </button>
            <button
                style={{ margin: '1rem', padding: '1rem 2rem' }}
                onClick={() => navigate('/ADDQ')}
            >
                Add question
            </button>
            <button
                style={{ margin: '1rem', padding: '1rem 2rem' }}
                onClick={() => navigate('/Bank')}
                >
                show all questions
            </button>
        </div>
    );
};

export default Admin;