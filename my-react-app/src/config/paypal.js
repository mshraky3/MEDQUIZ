// PayPal Configuration
export const PAYPAL_CONFIG = {
    // Your PayPal Live Client ID (Public Key) - PRODUCTION
    CLIENT_ID: "BAAdvgbPBZdxM0-yidbc3OgdPJS92H4klQ5UqbnMhNCr-JO3zOU3NHDQNfFgHeJr-oQCQ1KJ4_am0ivFrA",
    
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

// PayPal SDK Options - Ultra minimal configuration
export const getPayPalOptions = () => ({
    "client-id": PAYPAL_CONFIG.CLIENT_ID,
    currency: PAYPAL_CONFIG.CURRENCY,
    intent: PAYPAL_CONFIG.INTENT
});

// Get USD price directly
export const getUSDPrice = () => {
    return PAYPAL_CONFIG.USD_PRICE;
};

// Format USD amount
export const formatUSDAmount = (usdAmount) => {
    return usdAmount.toFixed(2);
};
