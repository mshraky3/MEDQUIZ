import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import './WaitingForPayment.css';

const WaitingForPayment = () => {
    const [status, setStatus] = useState('checking');
    const [error, setError] = useState('');
    const [pollCount, setPollCount] = useState(0);
    const [showManualConfirm, setShowManualConfirm] = useState(false);
    const [manualConfirmLoading, setManualConfirmLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('🔄 [WaitingForPayment] Component mounted, checking for pending payment...');
        const userId = localStorage.getItem('pendingUserId');
        console.log('🔍 [WaitingForPayment] User ID from localStorage:', userId);
        
        if (!userId) {
            // Check if user came from Ko-fi redirect (URL might contain user info)
            const urlParams = new URLSearchParams(window.location.search);
            const kofiUserId = urlParams.get('user_id');
            console.log('🔍 [WaitingForPayment] Checking URL parameters for user ID:', kofiUserId);
            
            if (kofiUserId) {
                // User came from Ko-fi redirect, save the user ID
                console.log('✅ [WaitingForPayment] User ID found in URL, saving to localStorage:', kofiUserId);
                localStorage.setItem('pendingUserId', kofiUserId);
                // Remove the parameter from URL for cleaner look
                window.history.replaceState({}, document.title, window.location.pathname);
                console.log('🧹 [WaitingForPayment] URL cleaned up');
            } else {
                console.log('❌ [WaitingForPayment] No pending payment found');
                setError('No pending payment found. Please start the payment process again.');
                setStatus('error');
                return;
            }
        }

        // Start polling for payment status
        const pollPaymentStatus = async () => {
            try {
                const currentUserId = localStorage.getItem('pendingUserId');
                console.log(`🔍 [WaitingForPayment] Polling attempt ${pollCount + 1} for user ID:`, currentUserId);
                
                const response = await axios.get(`${Globals.URL}/api/payment/status/${currentUserId}`);
                console.log('📊 [WaitingForPayment] Payment status response:', response.data);
                
                if (response.data.success) {
                    const { paymentStatus } = response.data;
                    console.log('📋 [WaitingForPayment] Current payment status:', paymentStatus);
                    
                    if (paymentStatus === 'paid') {
                        console.log('🎉 [WaitingForPayment] Payment confirmed! Redirecting to signup...');
                        // Payment successful - redirect to signup
                        const currentUserId = localStorage.getItem('pendingUserId');
                        localStorage.removeItem('pendingUserId');
                        console.log('🧹 [WaitingForPayment] localStorage cleared, navigating to signup');
                        navigate('/signup', { 
                            state: { 
                                userId: currentUserId,
                                paymentConfirmed: true 
                            } 
                        });
                        return;
                    } else if (paymentStatus === 'failed') {
                        console.log('❌ [WaitingForPayment] Payment failed');
                        setError('Payment failed. Please try again.');
                        setStatus('error');
                        return;
                    }
                    // Still pending, continue polling
                    console.log('⏳ [WaitingForPayment] Payment still pending, continuing to poll...');
                    setStatus('waiting');
                } else {
                    console.log('❌ [WaitingForPayment] Failed to check payment status:', response.data.message);
                    setError(response.data.message || 'Failed to check payment status');
                    setStatus('error');
                }
            } catch (error) {
                console.error('❌ [WaitingForPayment] Error checking payment status:', error);
                console.error('❌ [WaitingForPayment] Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                setPollCount(prev => prev + 1);
                
                // If we've tried too many times, show manual confirmation option
                if (pollCount >= 20) { // 20 attempts = ~2 minutes
                    console.log('⏰ [WaitingForPayment] Polling timeout reached, showing manual confirmation option');
                    setError('Payment verification is taking longer than expected. If you have completed the payment, you can manually confirm it below.');
                    setStatus('error');
                    setShowManualConfirm(true);
                }
            }
        };

        // Poll immediately, then every 6 seconds
        console.log('🔄 [WaitingForPayment] Starting payment status polling...');
        pollPaymentStatus();
        const interval = setInterval(pollPaymentStatus, 6000);
        console.log('⏰ [WaitingForPayment] Polling interval set to 6 seconds');

        // Cleanup interval on unmount
        return () => {
            console.log('🧹 [WaitingForPayment] Component unmounting, clearing polling interval');
            clearInterval(interval);
        };
    }, [navigate, pollCount]);

    const handleRetry = () => {
        localStorage.removeItem('pendingUserId');
        navigate('/payment');
    };

    const handleCancel = () => {
        localStorage.removeItem('pendingUserId');
        navigate('/');
    };

    const handleManualConfirm = async () => {
        console.log('🔧 [WaitingForPayment] Manual payment confirmation started');
        setManualConfirmLoading(true);
        try {
            const userId = localStorage.getItem('pendingUserId');
            console.log('🔍 [WaitingForPayment] User ID for manual confirmation:', userId);
            
            if (!userId) {
                console.log('❌ [WaitingForPayment] No pending payment found for manual confirmation');
                setError('No pending payment found. Please start the payment process again.');
                return;
            }

            console.log('📤 [WaitingForPayment] Sending manual confirmation request to backend...');
            const response = await axios.post(`${Globals.URL}/api/payment/confirm`, {
                userId: userId
            });
            console.log('📥 [WaitingForPayment] Manual confirmation response:', response.data);

            if (response.data.success) {
                console.log('✅ [WaitingForPayment] Manual confirmation successful! Redirecting to signup...');
                // Payment confirmed - redirect to signup
                localStorage.removeItem('pendingUserId');
                console.log('🧹 [WaitingForPayment] localStorage cleared after manual confirmation');
                navigate('/signup', { 
                    state: { 
                        userId: userId,
                        paymentConfirmed: true 
                    } 
                });
            } else {
                console.log('❌ [WaitingForPayment] Manual confirmation failed:', response.data.message);
                setError(response.data.message || 'Failed to confirm payment');
            }
        } catch (error) {
            console.error('❌ [WaitingForPayment] Error during manual confirmation:', error);
            console.error('❌ [WaitingForPayment] Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setError(error.response?.data?.message || 'Failed to confirm payment. Please contact support.');
        } finally {
            setManualConfirmLoading(false);
            console.log('🏁 [WaitingForPayment] Manual confirmation process completed');
        }
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
                        {showManualConfirm && (
                            <button 
                                className="manual-confirm-button" 
                                onClick={handleManualConfirm}
                                disabled={manualConfirmLoading}
                            >
                                {manualConfirmLoading ? 'Confirming...' : 'I Have Paid - Confirm Payment'}
                            </button>
                        )}
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
