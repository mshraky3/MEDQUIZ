const PRODUCTION_URL = 'https://medquiz.vercel.app';
const LOCAL_URL = 'http://localhost:3000';

const Globals = {
    // Switch this to PRODUCTION_URL when you are ready to deploy
    URL: PRODUCTION_URL, 

    // Payment enforcement is ENABLED — subscription required at 99SAR/year.
    // This mirrors the backend PAYMENT_ENFORCEMENT_ENABLED flag and is only
    // a UI hint; the server (GET /api/payment/config) is the source of truth.
    PAYMENT_ENFORCEMENT_ENABLED: true
};

export default Globals;
