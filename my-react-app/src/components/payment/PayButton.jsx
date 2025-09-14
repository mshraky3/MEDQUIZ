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
        console.log('🚀 [PayButton] Payment initiation started');
        setLoading(true);
        setError('');

        try {
            // Step 1: Create pending user in backend
            console.log('📝 [PayButton] Creating pending user in backend...');
            const response = await axios.post(`${Globals.URL}/api/payment/create-user`);
            console.log('📝 [PayButton] Backend response:', response.data);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to create user');
            }

            const userId = response.data.userId;
            console.log('✅ [PayButton] User created successfully with ID:', userId);
            
            // Step 2: Save user ID to localStorage (for backup)
            localStorage.setItem('pendingUserId', userId);
            console.log('💾 [PayButton] User ID saved to localStorage:', userId);
            
            // Step 3: Redirect directly to Ko-fi
            const kofiUrl = `https://ko-fi.com/s/70aa809f3e?amount=${amount}`;
            console.log('🔗 [PayButton] Ko-fi URL constructed:', kofiUrl);
            console.log('🌐 [PayButton] Redirecting to Ko-fi payment page...');
            window.location.href = kofiUrl;
            
        } catch (error) {
            console.error('❌ [PayButton] Payment initiation error:', error);
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
                        
                        <span className="pay-text">
                            Pay {amount} SAR
                            <br />
                            <small>{description}</small>
                        </span>
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
