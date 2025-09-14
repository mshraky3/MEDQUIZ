import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Globals from '../../global.js';
import './PayButton.css';

const PayButton = ({ amount = 14, description = "Premium Access" }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    // Test mode - set to true to skip real payment and go directly to waiting page
    const TEST_MODE = process.env.NODE_ENV === 'development' && false; // Set to true for testing

    const handlePayment = async () => {
        console.log('🚀 [PayButton] Payment initiation started');
        console.log('🧪 [PayButton] Test mode:', TEST_MODE);
        setLoading(true);
        setError('');

        try {
            // Step 1: Create pending user in backend
            console.log('📝 [PayButton] Step 1: Creating pending user in backend...');
            const response = await axios.post(`${Globals.URL}/api/payment/create-user`);
            console.log('📝 [PayButton] Backend response:', response.data);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to create user');
            }

            const userId = response.data.userId;
            console.log('✅ [PayButton] User created successfully with ID:', userId);
            
            // Step 2: Save user ID to localStorage
            localStorage.setItem('pendingUserId', userId);
            console.log('💾 [PayButton] User ID saved to localStorage:', userId);
            
            if (TEST_MODE) {
                console.log('🧪 [PayButton] TEST MODE: Skipping Ko-fi payment, going directly to waiting page');
                navigate('/waiting-for-payment');
                return;
            }
            
            // Step 3: Construct Ko-fi payment URL with user ID in metadata
            const metadata = { user_id: userId };
            const kofiUrl = `https://ko-fi.com/s/70aa809f3e?amount=${amount}&metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
            console.log('🔗 [PayButton] Ko-fi URL constructed:', kofiUrl);
            console.log('📦 [PayButton] Metadata being sent:', metadata);
            
            console.log('🧭 [PayButton] Navigating to waiting page...');
            navigate('/waiting-for-payment');
            
            // Small delay to ensure navigation completes, then redirect to Ko-fi
            setTimeout(() => {
                console.log('🌐 [PayButton] Redirecting to Ko-fi payment page...');
                window.location.href = kofiUrl;
            }, 100);
            
        } catch (error) {
            console.error('❌ [PayButton] Payment initiation error:', error);
            console.error('❌ [PayButton] Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setError(error.response?.data?.message || error.message || 'Failed to initiate payment');
        } finally {
            setLoading(false);
            console.log('🏁 [PayButton] Payment initiation process completed');
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
