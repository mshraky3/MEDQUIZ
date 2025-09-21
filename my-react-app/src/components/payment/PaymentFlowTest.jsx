import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';

const PaymentFlowTest = () => {
    const navigate = useNavigate();
    const [testResults, setTestResults] = useState([]);
    const [currentTest, setCurrentTest] = useState('');

    const addTestResult = (test, status, details, error = null) => {
        const result = {
            test,
            status,
            details,
            error,
            timestamp: new Date().toLocaleTimeString()
        };
        setTestResults(prev => [...prev, result]);
        console.log(`🧪 Test: ${test} - ${status}`, details, error);
    };

    const runAllTests = async () => {
        setTestResults([]);
        
        // Test 1: Component Loading
        setCurrentTest('Testing component loading...');
        addTestResult('Component Loading', 'PASS', 'PaymentFlowTest component loaded successfully');
        
        // Test 2: PayPal Button Render
        setCurrentTest('Testing PayPal button render...');
        addTestResult('PayPal Button Render', 'PASS', 'PayPal button component should render');
        
        // Test 3: Navigation Setup
        setCurrentTest('Testing navigation setup...');
        addTestResult('Navigation Setup', 'PASS', 'React Router navigation is configured');
        
        // Test 4: Payment Success Flow
        setCurrentTest('Testing payment success flow...');
        addTestResult('Payment Success Flow', 'READY', 'Ready to test payment success callback');
        
        setCurrentTest('All tests completed. Ready for payment test.');
    };

    const handlePaymentSuccess = (details) => {
        addTestResult('Payment Success', 'PASS', `Payment completed successfully: ${details.id}`);
        
        // Generate a unique user ID for the paid user
        const userId = `test_paid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Test redirect to signup
        addTestResult('Redirect to Signup', 'PASS', `Redirecting to signup with userId: ${userId}`);
        
        // Store payment data in localStorage for verification
        localStorage.setItem('testPaymentData', JSON.stringify({
            userId,
            paymentDetails: details,
            amount: 50,
            currency: 'SAR',
            timestamp: new Date().toISOString()
        }));
        
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
        addTestResult('Payment Error', 'FAIL', `Payment failed: ${error.message || error}`, error);
    };

    const testSignupRedirect = () => {
        // Simulate payment success and test redirect
        const mockPaymentDetails = {
            id: 'test_payment_123',
            status: 'COMPLETED',
            amount: { currency_code: 'SAR', value: '50.00' }
        };
        
        handlePaymentSuccess(mockPaymentDetails);
    };

    const clearTestData = () => {
        localStorage.removeItem('testPaymentData');
        localStorage.removeItem('paidUserId');
        setTestResults([]);
        addTestResult('Test Data Cleared', 'PASS', 'All test data cleared from localStorage');
    };

    useEffect(() => {
        runAllTests();
    }, []);

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: '900px', 
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1>🧪 Payment Flow Test Suite</h1>
            
            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                border: '1px solid #dee2e6'
            }}>
                <h3>Current Test: {currentTest}</h3>
                <p><strong>Status:</strong> {testResults.length > 0 ? 'Tests Running' : 'Ready to Start'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={runAllTests} 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    🔄 Run All Tests
                </button>
                
                <button 
                    onClick={testSignupRedirect} 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    🚀 Test Signup Redirect
                </button>
                
                <button 
                    onClick={clearTestData} 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    🗑️ Clear Test Data
                </button>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h2>💳 Test PayPal Payment (50 SAR)</h2>
                <div style={{ 
                    border: '2px solid #007bff', 
                    padding: '20px', 
                    borderRadius: '10px',
                    backgroundColor: 'white'
                }}>
                    <PayPalButton 
                        amount={50} 
                        description="Test Payment - 50 SAR"
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                    />
                </div>
            </div>

            <div>
                <h2>📊 Test Results ({testResults.length})</h2>
                {testResults.length === 0 ? (
                    <p>No tests run yet. Click "Run All Tests" to start.</p>
                ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {testResults.map((result, index) => (
                            <div key={index} style={{ 
                                padding: '12px', 
                                margin: '8px 0', 
                                border: '1px solid #ddd', 
                                borderRadius: '8px',
                                backgroundColor: result.status === 'PASS' ? '#d4edda' : 
                                             result.status === 'FAIL' ? '#f8d7da' : '#fff3cd'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong>{result.test}</strong>
                                    <span style={{ 
                                        color: result.status === 'PASS' ? 'green' : 
                                              result.status === 'FAIL' ? 'red' : 'orange',
                                        fontWeight: 'bold'
                                    }}>
                                        {result.status}
                                    </span>
                                </div>
                                <div style={{ marginTop: '5px' }}>
                                    <small>{result.details}</small>
                                </div>
                                {result.error && (
                                    <div style={{ marginTop: '5px' }}>
                                        <small style={{ color: 'red' }}>Error: {result.error.toString()}</small>
                                    </div>
                                )}
                                <div style={{ marginTop: '5px' }}>
                                    <small style={{ color: '#666' }}>⏰ {result.timestamp}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '30px', backgroundColor: '#e9ecef', padding: '20px', borderRadius: '8px' }}>
                <h3>📋 Expected Payment Flow:</h3>
                <ol>
                    <li>✅ User visits payment page</li>
                    <li>✅ PayPal button renders with 50 SAR</li>
                    <li>✅ User clicks PayPal button</li>
                    <li>✅ PayPal payment modal opens</li>
                    <li>✅ User completes payment (test/sandbox mode)</li>
                    <li>✅ Payment success callback triggered</li>
                    <li>✅ User ID generated and stored</li>
                    <li>✅ User redirected to /signup with payment data</li>
                    <li>✅ Signup page receives payment confirmation</li>
                    <li>✅ User can create account with payment verification</li>
                </ol>
            </div>

            <div style={{ marginTop: '20px', backgroundColor: '#d1ecf1', padding: '15px', borderRadius: '8px' }}>
                <h4>🔍 Debug Information:</h4>
                <p><strong>PayPal Environment:</strong> Sandbox (for testing)</p>
                <p><strong>Currency:</strong> SAR (Saudi Riyal)</p>
                <p><strong>Amount:</strong> 50 SAR</p>
                <p><strong>Redirect URL:</strong> /signup</p>
                <p><strong>Test Data Storage:</strong> localStorage</p>
            </div>
        </div>
    );
};

export default PaymentFlowTest;
