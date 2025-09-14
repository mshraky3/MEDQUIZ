import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';

// Add CSS animation for spinner
const spinnerStyle = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

const WaitingForPayment = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKoFiRedirect = async () => {
            // Create a new user and redirect to signup - no checking needed
            try {
                const response = await axios.post(`${Globals.URL}/api/payment/create-user`);
                if (response.data.success) {
                    const userId = response.data.userId;
                    
                    // Mark as paid
                    await axios.post(`${Globals.URL}/api/payment/confirm`, {
                        userId: userId
                    });
                    
                    // Go to signup
                                navigate('/signup', { 
                                    state: { 
                                        userId: userId,
                                        paymentConfirmed: true,
                                        fromKoFi: true
                                    } 
                                });
                }
            } catch (error) {
                console.error('Error:', error);
                navigate('/payment');
            }
        };

        handleKoFiRedirect();
    }, [navigate]);

    return (
        <>
            <style>{spinnerStyle}</style>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: '#f8fafc'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h2>Processing Payment...</h2>
                    <p>Please wait while we set up your account.</p>
                </div>
            </div>
        </>
    );
};

export default WaitingForPayment;
