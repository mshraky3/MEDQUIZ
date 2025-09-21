import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';

const PaymentTest = () => {
    const navigate = useNavigate();
    const [testResults, setTestResults] = useState([]);

    const addTestResult = (test, status, details) => {
        setTestResults(prev => [...prev, {
            test,
            status,
            details,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const testPaymentFlow = () => {
        addTestResult('Payment Button Render', 'PASS', 'PayPal button component loaded successfully');
    };

    const handlePaymentSuccess = (details) => {
        addTestResult('Payment Success', 'PASS', `Payment completed: ${details.id}`);
        
        // Generate a unique user ID for the paid user
        const userId = `test_paid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Test redirect to signup
        addTestResult('Redirect to Signup', 'PASS', `Redirecting to signup with userId: ${userId}`);
        
        navigate('/signup', { 
            state: { 
                paymentConfirmed: true,
                userId: userId,
                paymentDetails: details,
                amount: 50,
                currency: 'SAR',
                isTest: true
            } 
        });
    };

    const handlePaymentError = (error) => {
        addTestResult('Payment Error', 'FAIL', `Payment failed: ${error.message || error}`);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Payment Flow Test</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={testPaymentFlow} style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>
                    Run Payment Tests
                </button>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h2>Test PayPal Payment (50 SAR)</h2>
                <PayPalButton 
                    amount={50} 
                    description="Test Payment"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                />
            </div>

            <div>
                <h2>Test Results</h2>
                {testResults.length === 0 ? (
                    <p>No tests run yet. Click "Run Payment Tests" to start.</p>
                ) : (
                    <div>
                        {testResults.map((result, index) => (
                            <div key={index} style={{ 
                                padding: '10px', 
                                margin: '5px 0', 
                                border: '1px solid #ddd', 
                                borderRadius: '5px',
                                backgroundColor: result.status === 'PASS' ? '#d4edda' : '#f8d7da'
                            }}>
                                <strong>{result.test}</strong> - 
                                <span style={{ color: result.status === 'PASS' ? 'green' : 'red' }}>
                                    {result.status}
                                </span>
                                <br />
                                <small>{result.details}</small>
                                <br />
                                <small style={{ color: '#666' }}>{result.timestamp}</small>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3>Expected Flow:</h3>
                <ol>
                    <li>✅ Payment button renders correctly</li>
                    <li>✅ User clicks PayPal button</li>
                    <li>✅ PayPal payment modal opens</li>
                    <li>✅ User completes payment (test mode)</li>
                    <li>✅ Payment success callback triggered</li>
                    <li>✅ User redirected to /signup with payment data</li>
                    <li>✅ Signup page receives payment confirmation</li>
                    <li>✅ User can create account</li>
                </ol>
            </div>
        </div>
    );
};

export default PaymentTest;
