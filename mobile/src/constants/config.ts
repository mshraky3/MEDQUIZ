/**
 * App configuration — mirrors my-react-app/src/global.js
 */

const Config = {
    API_URL: 'https://medquiz.vercel.app',
    APP_NAME: 'SQB',
    SESSION_TIMEOUT_MINUTES: 30,
    // Payment enforcement is DISABLED — all accounts are free. This mirrors the
    // backend PAYMENT_ENFORCEMENT_ENABLED flag and is only a UI hint; the server
    // is the source of truth. Flip to true only when the paid rollout is live.
    PAYMENT_ENFORCEMENT_ENABLED: false,
};

export default Config;
