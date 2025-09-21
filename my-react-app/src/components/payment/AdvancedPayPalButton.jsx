import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, PayPalHostedFieldsProvider, PayPalHostedField } from '@paypal/react-paypal-js';
import { getPayPalOptions, formatUSDAmount } from '../../config/paypal';
import './PayPalButton.css';

const AdvancedPayPalButton = ({ amount = 1, description = "Premium Access", onSuccess, onError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('paypal'); // 'paypal' or 'card'

    // PayPal configuration with your API keys
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
            
            if (onSuccess) {
                onSuccess(details);
            }
            
            alert('Payment successful! Thank you for your purchase.');
        }).catch((err) => {
            console.error('Payment capture failed:', err);
            setError('Payment failed. Please try again.');
            setIsLoading(false);
        });
    };

    const handleError = (err) => {
        console.error('PayPal error:', err);
        setError('Payment error occurred. Please try again.');
        setIsLoading(false);
        
        if (onError) {
            onError(err);
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
                <p>Secure payment powered by PayPal</p>
            </div>

            {/* Payment Method Selection */}
            <div className="payment-method-selector">
                <button 
                    className={`method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('paypal')}
                >
                    PayPal
                </button>
                <button 
                    className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                >
                    Credit/Debit Card
                </button>
            </div>

            <PayPalScriptProvider options={paypalOptions}>
                {paymentMethod === 'paypal' ? (
                    <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={handleError}
                        onCancel={onCancel}
                        style={{
                            layout: "vertical",
                            color: "blue",
                            shape: "rect",
                            label: "paypal",
                            height: 50
                        }}
                        disabled={isLoading}
                    />
                ) : (
                    <div className="card-payment-section">
                        <PayPalHostedFieldsProvider
                            createOrder={createOrder}
                            notEligibleError="PayPal is not available in your region"
                        >
                            <div className="card-fields">
                                <div className="field-group">
                                    <label>Card Number</label>
                                    <PayPalHostedField
                                        id="card-number"
                                        hostedFieldType="number"
                                        options={{
                                            selector: '#card-number',
                                            placeholder: '1234 5678 9012 3456'
                                        }}
                                    />
                                </div>
                                
                                <div className="field-row">
                                    <div className="field-group">
                                        <label>Expiry Date</label>
                                        <PayPalHostedField
                                            id="expiration-date"
                                            hostedFieldType="expirationDate"
                                            options={{
                                                selector: '#expiration-date',
                                                placeholder: 'MM/YY'
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="field-group">
                                        <label>CVV</label>
                                        <PayPalHostedField
                                            id="cvv"
                                            hostedFieldType="cvv"
                                            options={{
                                                selector: '#cvv',
                                                placeholder: '123'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={handleError}
                                onCancel={onCancel}
                                style={{
                                    layout: "vertical",
                                    color: "blue",
                                    shape: "rect",
                                    label: "pay",
                                    height: 50
                                }}
                                disabled={isLoading}
                            />
                        </PayPalHostedFieldsProvider>
                    </div>
                )}
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

export default AdvancedPayPalButton;
