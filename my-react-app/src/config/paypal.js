// PayPal Configuration
export const PAYPAL_CONFIG = {
    // Your PayPal Live Client ID (Public Key) - PRODUCTION
    CLIENT_ID: "AZMa7GfT8kGHL63ilv1KwON3Z0rlOSbYWWdj6Rv2lYHeKwmSXcKy-nsXh4IgdB-cqAzipDedgh3Kg4q9",
    
    // Currency settings - Using USD directly for simplicity
    CURRENCY: "USD",

    INTENT: "capture",
    
    // Components to enable - Credit card only
    COMPONENTS: "buttons",
    
    // Funding options - Allow both PayPal and credit cards
    ENABLE_FUNDING: "card,paypal",
    DISABLE_FUNDING: "venmo,paylater",
    
    // Integration source
    INTEGRATION_SOURCE: "integrationbuilder_ac",
    
    // Fixed USD pricing - no conversion needed
    USD_PRICE: 1, // $1 USD for premium access
    
    // Environment - LIVE for production
    ENVIRONMENT: "live"
};

// PayPal SDK Options - Guest checkout with automatic payment methods
export const getPayPalOptions = () => ({
    "client-id": PAYPAL_CONFIG.CLIENT_ID,
    currency: PAYPAL_CONFIG.CURRENCY,
    intent: PAYPAL_CONFIG.INTENT,
    components: "buttons",
    "enable-funding": "card,paypal,venmo,paylater",
    "disable-funding": "credit,sepa,sofort,giropay,ideal,bancontact,eps,mybank,p24",
    "data-sdk-integration-source": "integrationbuilder_ac",
    "vault": false,
    "commit": true
});

// Get USD price directly
export const getUSDPrice = () => {
    return PAYPAL_CONFIG.USD_PRICE;
};

// Format USD amount
export const formatUSDAmount = (usdAmount) => {
    return usdAmount.toFixed(2);
};
