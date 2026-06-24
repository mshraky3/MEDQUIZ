const PRODUCTION_URL = 'https://medquiz.vercel.app';
const LOCAL_URL = 'http://localhost:3000';

// Auto-detect the API base from where the app is running, so a production build
// can NEVER accidentally ship pointing at localhost. Only a real localhost host
// uses the local backend; anything else (Vercel preview/prod, custom domain)
// uses production. Override with VITE_API_URL if you ever need to.
const isLocalHost =
    typeof window !== 'undefined' &&
    /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(window.location.hostname);

const Globals = {
    URL: import.meta.env?.VITE_API_URL || (isLocalHost ? LOCAL_URL : PRODUCTION_URL),

    // Payment enforcement ENABLED (test mode). Mirrors the backend
    // PAYMENT_ENFORCEMENT_ENABLED flag — this is only a UI hint; the server
    // (GET /api/payment/config and the /login response) is the source of truth.
    PAYMENT_ENFORCEMENT_ENABLED: true
};

export default Globals;