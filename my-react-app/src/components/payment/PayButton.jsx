import React from 'react';
import './PayButton.css';

const PayButton = ({ amount = 14, description = "Premium Access" }) => {

    const handlePayment = () => {
        // Direct PayPal link - this may allow guest checkout
        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VDRXK89HZQKXS`;
        window.open(paypalUrl, '_blank');
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


