import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Globals from '../../global.js';
import './PayButton.css';

const PayButton = ({ amount = 14, description = "Premium Access" }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Step 1: Create pending user in backend
            const response = await axios.post(`${Globals.URL}/api/payment/create-user`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to create user');
            }

            const userId = response.data.userId;
            
            // Step 2: Save user ID to localStorage
            localStorage.setItem('pendingUserId', userId);
            
            // Step 3: Construct Ko-fi payment URL with user ID in metadata
            const kofiUrl = `https://ko-fi.com/s/70aa809f3e?amount=${amount}&metadata=${encodeURIComponent(JSON.stringify({ user_id: userId }))}`;
            
            // Step 4: Redirect directly to Ko-fi (Ko-fi will redirect back to waiting page)
            window.location.href = kofiUrl;
            
        } catch (error) {
            console.error('Payment initiation error:', error);
            setError(error.response?.data?.message || error.message || 'Failed to initiate payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pay-button-container">
            <button 
                className="pay-button"
                onClick={handlePayment}
                disabled={loading}
            >
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        Processing...
                    </div>
                ) : (
                    <>
                        <span className="pay-icon">💳</span>
                        Pay ${amount} - {description}
                    </>
                )}
            </button>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
};

export default PayButton;
