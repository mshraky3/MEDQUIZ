/**
 * App configuration — mirrors my-react-app/src/global.js
 */

const Config = {
    API_URL: 'https://medquiz.vercel.app',
    APP_NAME: 'SQB',
    SESSION_TIMEOUT_MINUTES: 30,
    // Mirrors the backend PAYMENT_ENFORCEMENT_ENABLED flag, which has been true
    // in production since the paid rollout. UI hint only — the server is the
    // source of truth and answers 402 on its own. This was still `false` long
    // after the web app flipped, so the mobile build believed the platform was
    // free while the API was already charging for it.
    PAYMENT_ENFORCEMENT_ENABLED: true,
};

export default Config;
