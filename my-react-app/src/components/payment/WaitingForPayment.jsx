import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import './WaitingForPayment.css';

const WaitingForPayment = () => {
    const [status, setStatus] = useState('checking');
    const [error, setError] = useState('');
    const [pollCount, setPollCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('pendingUserId');
        
        if (!userId) {
            // Check if user came from Ko-fi redirect (URL might contain user info)
            const urlParams = new URLSearchParams(window.location.search);
            const kofiUserId = urlParams.get('user_id');
            
            if (kofiUserId) {
                // User came from Ko-fi redirect, save the user ID
                localStorage.setItem('pendingUserId', kofiUserId);
                // Remove the parameter from URL for cleaner look
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                setError('No pending payment found. Please start the payment process again.');
                setStatus('error');
                return;
            }
        }

        // Start polling for payment status
        const pollPaymentStatus = async () => {
            try {
                const currentUserId = localStorage.getItem('pendingUserId');
                const response = await axios.get(`${Globals.URL}/api/payment/status/${currentUserId}`);
                
                if (response.data.success) {
                    const { paymentStatus } = response.data;
                    
                    if (paymentStatus === 'paid') {
                        // Payment successful - redirect to signup
                        const currentUserId = localStorage.getItem('pendingUserId');
                        localStorage.removeItem('pendingUserId');
                        navigate('/signup', { 
                            state: { 
                                userId: currentUserId,
                                paymentConfirmed: true 
                            } 
                        });
                        return;
                    } else if (paymentStatus === 'failed') {
                        setError('Payment failed. Please try again.');
                        setStatus('error');
                        return;
                    }
                    // Still pending, continue polling
                    setStatus('waiting');
                } else {
                    setError(response.data.message || 'Failed to check payment status');
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                setPollCount(prev => prev + 1);
                
                // If we've tried too many times, show error
                if (pollCount >= 20) { // 20 attempts = ~2 minutes
                    setError('Payment verification is taking longer than expected. Please contact support if payment was completed.');
                    setStatus('error');
                }
            }
        };

        // Poll immediately, then every 6 seconds
        pollPaymentStatus();
        const interval = setInterval(pollPaymentStatus, 6000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [navigate, pollCount]);

    const handleRetry = () => {
        localStorage.removeItem('pendingUserId');
        navigate('/payment');
    };

    const handleCancel = () => {
        localStorage.removeItem('pendingUserId');
        navigate('/');
    };

    return (
        <div className="waiting-container">
            <div className="waiting-card">
                <div className="status-icon">
                    {status === 'checking' && <div className="spinner large"></div>}
                    {status === 'waiting' && <div className="pulse-icon">⏳</div>}
                    {status === 'error' && <div className="error-icon">❌</div>}
                </div>

                <h2 className="status-title">
                    {status === 'checking' && 'Verifying Payment...'}
                    {status === 'waiting' && 'Waiting for Payment'}
                    {status === 'error' && 'Payment Issue'}
                </h2>

                <p className="status-message">
                    {status === 'checking' && 'Please wait while we verify your payment status.'}
                    {status === 'waiting' && 'We\'re waiting for your payment to be processed. This page will automatically update when payment is confirmed.'}
                    {status === 'error' && error}
                </p>

                {status === 'waiting' && (
                    <div className="waiting-details">
                        <p>• Complete your payment on Ko-fi</p>
                        <p>• This page will automatically redirect you once payment is confirmed</p>
                        <p>• You can safely close this tab and return later</p>
                    </div>
                )}

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

                {status === 'waiting' && (
                    <div className="polling-info">
                        <small>Checking payment status every 6 seconds...</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WaitingForPayment;
