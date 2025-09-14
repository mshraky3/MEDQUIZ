import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import './Signup.css';

const Signup = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user came from payment confirmation
        const { userId, paymentConfirmed, fromKoFi } = location.state || {};
        
        if (!paymentConfirmed || !userId) {
            // If not from payment flow, redirect to payment page
            navigate('/payment');
            return;
        }

        // Store the paid user ID for account creation
        localStorage.setItem('paidUserId', userId);
        
        // Log the source for debugging
        if (fromKoFi) {
            console.log('🎉 [Signup] User came from Ko-fi redirect - payment assumed completed');
        } else {
            console.log('✅ [Signup] User came from payment confirmation');
        }
    }, [location.state, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!form.username || !form.password || !form.confirmPassword) {
            setError('All fields are required');
            return false;
        }

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const paidUserId = localStorage.getItem('paidUserId');
            
            if (!paidUserId) {
                throw new Error('Payment verification not found. Please complete payment first.');
            }

            // Create account with the paid user ID
            const response = await axios.post(`${Globals.URL}/api/payment/create-account`, {
                userId: paidUserId,
                username: form.username,
                password: form.password
            });

            if (response.data.success) {
                setSuccess(true);
                localStorage.removeItem('paidUserId');
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login', { 
                        state: { 
                            message: 'Account created successfully! Please log in.',
                            username: form.username 
                        } 
                    });
                }, 2000);
            } else {
                throw new Error(response.data.message || 'Failed to create account');
            }

        } catch (error) {
            console.error('Signup error:', error);
            setError(error.response?.data?.message || error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="signup-container">
                <div className="signup-card success">
                    <div className="success-icon">✅</div>
                    <h2>Account Created Successfully!</h2>
                    <p>Your account has been created. Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create Your Account</h2>
                <p className="signup-subtitle">Complete your account setup after payment</p>
                
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={form.username}
                            onChange={handleInputChange}
                            placeholder="Choose a username"
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleInputChange}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="signup-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    <div className="contact-support">
                        <p>Having trouble creating your account?</p>
                        <button 
                            className="contact-button"
                            onClick={() => window.open('https://wa.link/pzhg6j', '_blank')}
                        >
                            Contact Support
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
