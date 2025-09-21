import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { getPayPalOptions, getUSDPrice } from '../../config/paypal';
import './CreditCardForm.css';

const CreditCardForm = ({ amount = 15, description = "Premium Access", onSuccess, onError: onErrorCallback }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const paypalOptions = getPayPalOptions();

    // Timeout mechanism to prevent infinite loading
    useEffect(() => {
        let timeoutId;
        if (isLoading) {
            timeoutId = setTimeout(() => {
                console.log('⏰ Payment timeout - resetting loading state');
                setIsLoading(false);
                setError('Payment is taking too long. Please try again.');
            }, 30000); // 30 second timeout
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isLoading]);

    const createOrder = (data, actions) => {
        console.log('🔄 Creating PayPal order for amount:', amount, 'USD');
        setIsLoading(true);
        setError(null);
        
        return actions.order.create({
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: amount.toString()
                },
                description: description
            }],
            application_context: {
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
                landing_page: "NO_PREFERENCE"
            }
        }).then((order) => {
            console.log('✅ PayPal order created successfully:', order);
            setIsLoading(false); // Reset loading after order creation
            return order;
        }).catch((error) => {
            console.error('❌ PayPal order creation failed:', error);
            setError('Failed to create payment order. Please try again.');
            setIsLoading(false);
            throw error;
        });
    };

    const onApprove = (data, actions) => {
        console.log('🔄 Approving PayPal payment...', data);
        setIsLoading(true); // Set loading for payment processing
        
        return actions.order.capture().then((details) => {
            console.log('✅ Payment completed successfully:', details);
            setIsLoading(false);
            if (onSuccess) {
                onSuccess(details);
            }
        }).catch((err) => {
            console.error('❌ Payment capture failed:', err);
            setError('Payment failed. Please try again.');
            setIsLoading(false);
        });
    };

    const onError = (err) => {
        console.error('PayPal error:', err);
        setError('Payment error occurred. Please try again.');
        setIsLoading(false);
        if (onErrorCallback) {
            onErrorCallback(err);
        }
    };

    const onCancel = (data) => {
        console.log('Payment cancelled:', data);
        setIsLoading(false);
    };

    return (
        <div className="credit-card-form-container">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            <div className="payment-info">
                <h3>Pay ${amount} USD ({description})</h3>
                <p>💳 Quick & Easy Payment Options</p>
                <p><small>Visa, Mastercard, American Express accepted</small></p>
                <p><small>💳 Guest checkout - No PayPal account needed</small></p>
                <p><small>⚡ Automatic payment methods enabled - Faster checkout</small></p>
                <p><small>Amount: ${amount} USD</small></p>
                <div className="security-notice">
                    <p><small>🔒 Secure payment processing - All transactions are encrypted</small></p>
                </div>
            </div>

            <PayPalScriptProvider 
                options={paypalOptions}
                onLoadStart={() => console.log('🔄 PayPal SDK loading...')}
                onLoadSuccess={() => console.log('✅ PayPal SDK loaded successfully')}
                onLoadError={(err) => {
                    console.error('❌ PayPal SDK load error:', err);
                    setError('Payment system is temporarily unavailable. Please try again later.');
                }}
            >
                <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={onCancel}
                    style={{
                        layout: "vertical",
                        color: "blue",
                        shape: "rect",
                        label: "pay",
                        height: 55,
                        tagline: false
                    }}
                    disabled={isLoading}
                />
            </PayPalScriptProvider>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Processing payment...</p>
                    <button 
                        onClick={() => {
                            console.log('🛑 User cancelled payment');
                            setIsLoading(false);
                            setError('Payment cancelled by user.');
                        }}
                        className="cancel-button"
                    >
                        Cancel Payment
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreditCardForm;