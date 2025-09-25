import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
    const [tempLinkInfo, setTempLinkInfo] = useState(null);
    const [isTempLink, setIsTempLink] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useParams();

    useEffect(() => {
        // Check if this is a temporary link signup
        if (token) {
            validateTempLink();
            return;
        }

        // Check if user came from payment confirmation
        const { userId, paymentConfirmed, fromKoFi, isTest } = location.state || {};
        
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
        } else if (isTest) {
            console.log('🧪 [Signup] User came from payment test - test mode');
        } else {
            console.log('✅ [Signup] User came from payment confirmation');
        }
    }, [location.state, navigate, token]);

    const validateTempLink = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${Globals.URL}/api/validate-temp-link/${token}`);
            
            if (response.data.valid) {
                setTempLinkInfo(response.data.link);
                setIsTempLink(true);
                setError('');
            } else {
                setError('❌ Invalid or expired temporary link');
                setTimeout(() => {
                    navigate('/payment');
                }, 3000);
            }
        } catch (err) {
            setError('❌ Invalid or expired temporary link');
            setTimeout(() => {
                navigate('/payment');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value.toLowerCase()
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
            if (isTempLink) {
                // Create account from temporary link
                const response = await axios.post(`${Globals.URL}/api/signup/temp-link`, {
                    token: token,
                    username: form.username,
                    password: form.password
                });

                if (response.data.success) {
                    setSuccess(true);
                    
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
            } else {
                // Regular payment flow
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

    if (loading && isTempLink) {
        return (
            <div className="signup-container">
                <div className="signup-card">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        Validating temporary link...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create Your Account</h2>
                <p className="signup-subtitle">
                    {isTempLink ? "Create your free account" : "Complete your account setup after payment"}
                </p>
                
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

                    {success && (
                        <div className="success-message">
                            <h3>✅ Account Created Successfully!</h3>
                            <p>Your account has been created. Redirecting to login page...</p>
                        </div>
                    )}

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
                            onClick={() => window.location.href = 'mailto:alshraky3@gmail.com?subject=Account Support&body=Hi, I need help creating my account.'}
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
