import React from 'react';
import './PayButton.css';

const PayButton = ({ amount = 14, description = "Premium Access" }) => {

    const handlePayment = () => {
        // Just redirect to Ko-fi - that's it!
        const kofiUrl = `https://ko-fi.com/s/70aa809f3e`;
        window.location.href = kofiUrl;
    };

    return (
        <div className="pay-button-container">
            <button 
                className="pay-button"
                onClick={handlePayment}
            >
                <span className="pay-text">
                    Pay {amount} SAR
                    <br />
                    <small>{description}</small>
                </span>
            </button>
        </div>
    );
};

export default PayButton;
