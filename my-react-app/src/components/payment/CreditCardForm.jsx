import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { getPayPalOptions, getUSDPrice } from '../../config/paypal';
import './CreditCardForm.css';

const CreditCardForm = ({ amount = 1, description = "Premium Access", onSuccess, onError: onErrorCallback }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const paypalOptions = getPayPalOptions();

    // Function to hide only PayPal account buttons using JavaScript as backup
    const hidePayPalButtons = () => {
        // Hide only PayPal account buttons, not credit card buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const text = (button.textContent || button.innerText || '').toLowerCase();
            const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();
            const title = (button.getAttribute('title') || '').toLowerCase();
            
            // Only hide buttons that specifically mention PayPal account (not just PayPal)
            if (text.includes('pay with paypal account') || 
                text.includes('continue with paypal account') ||
                ariaLabel.includes('pay with paypal account') ||
                title.includes('pay with paypal account')) {
                button.style.display = 'none';
                button.style.visibility = 'hidden';
                button.style.opacity = '0';
            }
            
            // Ensure credit card buttons remain visible and prominent
            if (text.includes('credit card') || text.includes('debit card') || text.includes('card') ||
                ariaLabel.includes('credit card') || ariaLabel.includes('debit card') ||
                title.includes('credit card') || title.includes('debit card')) {
                button.style.display = 'block';
                button.style.visibility = 'visible';
                button.style.opacity = '1';
                button.style.background = 'linear-gradient(135deg, #0070ba 0%, #005ea6 100%)';
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.padding = '16px 24px';
                button.style.borderRadius = '8px';
                button.style.fontSize = '16px';
                button.style.fontWeight = '600';
                button.style.cursor = 'pointer';
                button.style.boxShadow = '0 4px 15px rgba(0, 112, 186, 0.3)';
                button.style.textTransform = 'uppercase';
                button.style.letterSpacing = '0.5px';
                button.style.margin = '10px 0';
                button.style.width = '100%';
            }
        });
    };

    // Run hiding function on component mount and periodically
    useEffect(() => {
        hidePayPalButtons();
        
        // Set up interval to catch dynamically loaded PayPal buttons
        const interval = setInterval(hidePayPalButtons, 500);
        
        // Also run when PayPal SDK loads
        const observer = new MutationObserver(() => {
            hidePayPalButtons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'id', 'data-testid']
        });
        
        // Cleanup interval and observer on unmount
        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, []);

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
                <h3>Pay 3.75 SAR ({description})</h3>
                <p>💳 Quick & Easy Payment Options</p>
                <p><small>Visa, Mastercard, American Express accepted</small></p>
                <p><small>💳 Guest checkout - No PayPal account needed</small></p>
                <p><small>⚡ Automatic payment methods enabled - Faster checkout</small></p>
                <p><small>Amount: 3.75 SAR</small></p>
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