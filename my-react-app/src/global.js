const PRODUCTION_URL = 'https://medquiz.vercel.app';
const LOCAL_URL = 'http://localhost:3000';

const Globals = {
    // Switch this to PRODUCTION_URL when you are ready to deploy
    URL: LOCAL_URL, 

    // Payment enforcement is DISABLED — all accounts are free. This mirrors the
    // backend PAYMENT_ENFORCEMENT_ENABLED flag and is only a UI hint; the server
    // (GET /api/payment/config) is the source of truth. Flip to true only when
    // the paid rollout is live.
    PAYMENT_ENFORCEMENT_ENABLED: false
};

export default Globals;