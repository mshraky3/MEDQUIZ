import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import './WaitingForPayment.css';

const WaitingForPayment = () => {
    const [status, setStatus] = useState('checking');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleKoFiRedirect = async () => {
            console.log('🔄 [WaitingForPayment] Checking for Ko-fi redirect...');
            console.log('🌐 [WaitingForPayment] Current URL:', window.location.href);
            
            // Check for Ko-fi transaction ID
            const urlParams = new URLSearchParams(window.location.search);
            const txid = urlParams.get('txid');
            
            console.log('🔍 [WaitingForPayment] URL parameters:', Object.fromEntries(urlParams.entries()));
            
            if (txid) {
                console.log('🎉 [WaitingForPayment] Ko-fi redirect detected! Transaction ID:', txid);
                setStatus('processing');
                
                try {
                    // Create a new user for this Ko-fi payment
                    const response = await axios.post(`${Globals.URL}/api/payment/create-user`);
                    console.log('📝 [WaitingForPayment] Created new user:', response.data);
                    
                    if (response.data.success) {
                        const newUserId = response.data.userId;
                        
                        // Mark as paid immediately since they came from Ko-fi
                        await axios.post(`${Globals.URL}/api/payment/confirm`, {
                            userId: newUserId
                        });
                        console.log('💳 [WaitingForPayment] Payment confirmed');
                        
                        // Redirect to signup
                        console.log('🚀 [WaitingForPayment] Redirecting to signup...');
                        navigate('/signup', { 
                            state: { 
                                userId: newUserId,
                                paymentConfirmed: true,
                                fromKoFi: true
                            } 
                        });
                        return;
                    }
                } catch (error) {
                    console.error('❌ [WaitingForPayment] Error processing Ko-fi payment:', error);
                    setError('Unable to process payment. Please contact support.');
                    setStatus('error');
                    return;
                }
            }
            
            // No Ko-fi redirect detected
            console.log('❌ [WaitingForPayment] No Ko-fi redirect detected');
            setError('No payment found. Please start the payment process.');
            setStatus('error');
        };

        handleKoFiRedirect();
    }, [navigate]);

    const handleRetry = () => {
        navigate('/payment');
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="waiting-container">
            <div className="waiting-card">
                <div className="status-icon">
                    {status === 'checking' && <div className="spinner large"></div>}
                    {status === 'processing' && <div className="spinner large"></div>}
                    {status === 'error' && <div className="error-icon">❌</div>}
                </div>

                <h2 className="status-title">
                    {status === 'checking' && 'Processing Payment...'}
                    {status === 'processing' && 'Creating Your Account...'}
                    {status === 'error' && 'Payment Issue'}
                </h2>

                <p className="status-message">
                    {status === 'checking' && 'Please wait while we process your payment.'}
                    {status === 'processing' && 'Setting up your account, please wait...'}
                    {status === 'error' && error}
                </p>

                {status === 'error' && (
                    <div className="error-actions">
                        <button className="retry-button" onClick={handleRetry}>
                            Try Again
                        </button>
                        <button className="cancel-button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button 
                            className="contact-button" 
                            onClick={() => window.open('https://wa.link/pzhg6j', '_blank')}
                        >
                            Contact Support
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WaitingForPayment;
