import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './PayPalSuccess.css';
import Globals from '../../global.js';

const PayPalSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });

  useEffect(() => {
    // Check if we have PayPal payment parameters
    const token = searchParams.get('token');
    const payerId = searchParams.get('PayerID');
    const paymentId = searchParams.get('paymentId');
    
    if (!token || !payerId) {
      setError('Invalid payment information. Please try again.');
      return;
    }

    // Verify the payment with the backend
    verifyPayment(token, payerId, paymentId);
  }, [searchParams]);

  const verifyPayment = async (token, payerId, paymentId) => {
    try {
      const response = await axios.post(`${Globals.URL}/api/verify-paypal-payment`, {
        token,
        payerId,
        paymentId
      });

      if (response.data.verified) {
        setPaymentVerified(true);
        // Store payment info for account creation
        sessionStorage.setItem('paypal_payment', JSON.stringify({
          token,
          payerId,
          paymentId
        }));
      } else {
        setError('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Payment verification failed. Please contact support.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Get stored payment information
    const paymentInfo = JSON.parse(sessionStorage.getItem('paypal_payment') || '{}');

    try {
      // Create account using the backend endpoint with payment info
      const response = await axios.post(`${Globals.URL}/api/paypal-create-account`, {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        token: paymentInfo.token,
        payerId: paymentInfo.payerId,
        paymentId: paymentInfo.paymentId
      });

      setSuccess('Account created successfully! Redirecting to login...');
      
      // Clear stored payment info
      sessionStorage.removeItem('paypal_payment');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Error creating account:', error);
      setError(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!paymentVerified) {
    return (
      <div className="paypal-success-body">
        <div className="paypal-success-wrapper">
          <div className="paypal-success-header">
            <div className="loading-icon">⏳</div>
            <h1>Verifying Payment...</h1>
            <p>Please wait while we verify your PayPal payment.</p>
          </div>
          {error && <div className="paypal-error">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="paypal-success-body">
      <div className="paypal-success-wrapper">
        <div className="paypal-success-header">
          <div className="success-icon">✅</div>
          <h1>Payment Successful!</h1>
          <p>Your PayPal payment has been verified. Please create your account to get started.</p>
        </div>

        {error && <div className="paypal-error">{error}</div>}
        {success && <div className="paypal-success">{success}</div>}

        <form onSubmit={handleSubmit} className="paypal-form">
          <div className="form-group">
            <label htmlFor="username">Choose Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Create a password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="paypal-submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="paypal-info">
          <h3>What's included in your subscription:</h3>
          <ul>
            <li>✓ Access to all 5,000+ questions</li>
            <li>✓ Detailed performance analytics</li>
            <li>✓ Topic-wise practice sessions</li>
            <li>✓ 24/7 unlimited access</li>
            <li>✓ Mobile-friendly platform</li>
            <li>✓ 1-year full access</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PayPalSuccess; 