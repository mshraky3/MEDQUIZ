import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { getPayPalOptions, formatUSDAmount } from '../../config/paypal';
import './PayPalButton.css';

const PayPalButton = ({ amount = 15, description = "Premium Access", onSuccess, onError: onErrorCallback }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // PayPal configuration
    const paypalOptions = getPayPalOptions();

    const createOrder = (data, actions) => {
        setIsLoading(true);
        setError(null);
        
        return actions.order.create({
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: formatUSDAmount(amount)
                },
                description: description
            }],
            application_context: {
                shipping_preference: "NO_SHIPPING"
            }
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            console.log('Payment completed:', details);
            setIsLoading(false);
            
            // Call success callback if provided
            if (onSuccess) {
                onSuccess(details);
            }
        }).catch((err) => {
            console.error('Payment capture failed:', err);
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
        <div className="paypal-button-container">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
                <div className="payment-info">
                    <h3>Pay {amount} SAR ({description})</h3>
                    <p>Secure payment with credit card</p>
                    <p><small>Visa, Mastercard, American Express accepted</small></p>
                </div>

            <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={onCancel}
                    style={{
                        layout: "vertical",
                        color: "black",
                        shape: "rect",
                        label: "pay",
                        height: 50
                    }}
                    disabled={isLoading}
                />
            </PayPalScriptProvider>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Processing payment...</p>
                </div>
            )}
        </div>
    );
};

export default PayPalButton;
