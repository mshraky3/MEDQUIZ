const Globals = {
    URL: 'https://medquiz.vercel.app',
    // Production: https://medquiz.vercel.app
    // Local dev: http://localhost:3000

    // Payment enforcement is DISABLED — all accounts are free. This mirrors the
    // backend PAYMENT_ENFORCEMENT_ENABLED flag and is only a UI hint; the server
    // (GET /api/payment/config) is the source of truth. Flip to true only when
    // the paid rollout is live.
    PAYMENT_ENFORCEMENT_ENABLED: false
};

export default Globals;
