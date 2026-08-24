/**
 * Frontend Error Tracking Utility
 * Captures and reports errors to backend for email notifications
 */

import { isStaleChunkError } from './staleChunkReload.js';
import Globals from '../global.js';

const ERROR_REPORT_ENDPOINT = '/api/error-report';
const BATCH_ENDPOINT = '/api/error-report/batch';

// Configuration
const CONFIG = {
    // Was 1 minute, and held only in a module-level Map — so it reset on every
    // page load. A route that throws on mount therefore mailed a fresh CRITICAL
    // on each reload, and a user retrying a broken page half a dozen times sent
    // half a dozen alerts for one fault. The window is now long enough to cover
    // a retry loop, and persisted per-tab (see loadCooldowns) so reloading no
    // longer resets it.
    cooldownMinutes: 15,
    maxQueueSize: 50,   // Maximum offline queue size
    enableConsoleLog: true
};

// Where the persisted cooldown map lives. sessionStorage, not localStorage:
// per-tab and cleared when the tab closes, which keeps a stale suppression from
// hiding a fault in a browsing session days later.
const COOLDOWN_STORAGE_KEY = 'errorCooldowns';

// Error severity levels
const SEVERITY = {
    CRITICAL: 'CRITICAL',
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW'
};

// Browser notices that surface as window 'error'/'unhandledrejection' events
// but are not faults in this app. Every one of these stamps a fake 500 and
// pages the admin, and the alert inbox only has ONE shared 100/day Resend
// allowance — noise here is quota a real outage can't use.
//
//   ResizeObserver loop ...   fired when a ResizeObserver callback changes
//                             layout and the browser defers the rest to the
//                             next frame. Nothing breaks, the user sees
//                             nothing, and lineno/colno are always 0.
//
//   Object Not Found Matching Id:N, MethodName:update, ParamCount:4
//                             NOT ours. This is a browser EXTENSION talking to
//                             its own disconnected message port (the Edge/Chrome
//                             autofill and password-manager extensions are the
//                             usual sources). It rejects with a raw string
//                             rather than an Error, arrives on pages with form
//                             fields — which is why every instance recorded so
//                             far landed on /signup — and there is nothing in
//                             this codebase to fix. See isExtensionNoise below
//                             for the structural version of this check.
//
//   Script error.             the cross-origin placeholder the browser
//                             substitutes when a script from another origin
//                             throws. No message, no file, no line, no stack:
//                             literally zero actionable information.
const IGNORED_ERROR_PATTERNS = [
    'resizeobserver loop completed with undelivered notifications',
    'resizeobserver loop limit exceeded',
    'object not found matching id',
    'script error.',
];

function isIgnorableBrowserError(message) {
    if (!message) return false;
    const msg = String(message).toLowerCase();
    return IGNORED_ERROR_PATTERNS.some((p) => msg.includes(p));
}

/**
 * Structural companion to the message list above, for unhandled rejections.
 *
 * Application code rejects with an Error — that is what `throw` inside an
 * async function produces, what axios rejects with, and what every rejection
 * this app creates on purpose looks like. A rejection carrying a bare string,
 * or a plain object with no message, essentially always came from an injected
 * extension content script sharing the page's event loop.
 *
 * Matching on shape rather than wording is what makes this hold up: extensions
 * update and reword their messages, and each new wording would otherwise be a
 * fresh burst of CRITICALs before anyone added it to the list above.
 */
function isExtensionNoise(reason) {
    if (reason instanceof Error) return false;
    if (typeof reason === 'string') return true;
    // A rejection with no usable message is unactionable regardless of source.
    return !reason || typeof reason.message !== 'string' || reason.message === '';
}

/**
 * Requests the CLIENT gave up on, which say nothing about server health.
 *
 * A user who taps a link mid-request, or whose phone drops off wifi, aborts
 * every in-flight XHR. Axios surfaces those as ERR_CANCELED / AbortError and as
 * the generic "Network Error", all of which classifyErrorSeverity() below rates
 * CRITICAL or HIGH — so ordinary navigation was paging the admin.
 *
 * Cancellation is dropped unconditionally: it is deliberate, by definition.
 * "Network Error" is dropped only with corroboration that the client, not the
 * server, is the one that went away — navigator.onLine is false, or the page is
 * already unloading. A genuine backend outage leaves the browser online and the
 * page loaded, so it still alerts.
 */
function isClientAbortedRequest(error) {
    const code = error?.code;
    const name = error?.name;
    if (code === 'ERR_CANCELED' || name === 'CanceledError' || name === 'AbortError') return true;

    const msg = String(error?.message || '').toLowerCase();
    if (msg === 'canceled' || msg === 'cancelled') return true;

    if (msg.includes('network error')) {
        if (isBrowser && navigator.onLine === false) return true;
        if (isPageUnloading) return true;
    }
    return false;
}

// Track sent errors for client-side rate limiting
const errorCooldowns = new Map();

// Offline queue for errors when network fails
let offlineQueue = [];

// Re-entrancy guard to prevent recursive error handling
let _isReportingError = false;

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Set once the browser has committed to leaving the page. Every request still
// in flight is about to be aborted through no fault of the server, so
// isClientAbortedRequest() uses this to tell "the user navigated away" apart
// from "the backend is unreachable". Registered in initErrorTracking().
let isPageUnloading = false;

/**
 * Get API base URL.
 *
 * Deliberately the same resolver the rest of the app uses. This used to hold a
 * second, simpler copy that always fell back to the production host, so errors
 * thrown while developing locally were reported into the production inbox.
 */
function getApiBaseUrl() {
    return Globals.URL;
}

/**
 * Classify error severity based on status code and error type
 */
function classifyErrorSeverity(statusCode, errorType, message) {
    // Database errors are critical
    if (errorType?.includes('DATABASE') || message?.toLowerCase().includes('database')) {
        return SEVERITY.CRITICAL;
    }

    // Connection failures are critical
    if (errorType?.includes('CONNECTION') || message?.toLowerCase().includes('connection')) {
        return SEVERITY.CRITICAL;
    }

    // Network errors might be critical
    if (errorType === 'NETWORK_ERROR' || message?.toLowerCase().includes('network')) {
        return SEVERITY.CRITICAL;
    }

    // 500+ errors are critical
    if (statusCode >= 500) {
        return SEVERITY.CRITICAL;
    }

    // Auth failures (401/403) are a NORMAL client condition, not a system
    // fault: sessions expire, and logging in on another device overwrites the
    // single session_token, invalidating older tabs. Their background polls
    // then 401 — which the app already handles by redirecting to login. These
    // must NOT page the admin as a HIGH-severity system error (that's just
    // noise). Classify below the reporting threshold so they're skipped.
    // A genuine auth outage surfaces as widespread 500s/DB errors instead.
    if (statusCode === 401 || statusCode === 403) {
        return SEVERITY.LOW;
    }

    // Unknown errors are high
    if (errorType?.includes('UNKNOWN') || !errorType) {
        return SEVERITY.HIGH;
    }

    // 4xx errors are medium
    if (statusCode >= 400 && statusCode < 500) {
        return SEVERITY.MEDIUM;
    }

    return SEVERITY.LOW;
}

/**
 * Generate unique error key for rate limiting
 */
function getErrorKey(errorData) {
    return `${errorData.errorType || 'UNKNOWN'}_${errorData.endpoint || 'unknown'}_${errorData.statusCode || 0}`;
}

/**
 * Rehydrate the cooldown map for this tab. Called once at init so a reload
 * cannot re-send an alert the previous page load already sent.
 */
function loadCooldowns() {
    if (!isBrowser) return;
    try {
        const raw = sessionStorage.getItem(COOLDOWN_STORAGE_KEY);
        if (!raw) return;
        const cutoff = Date.now() - CONFIG.cooldownMinutes * 60 * 1000;
        for (const [key, at] of Object.entries(JSON.parse(raw))) {
            if (at > cutoff) errorCooldowns.set(key, at);
        }
    } catch (e) {
        // Unparseable or unavailable (private mode) — the in-memory map still
        // works for this page load, which is the old behaviour.
    }
}

function persistCooldowns() {
    if (!isBrowser) return;
    try {
        sessionStorage.setItem(COOLDOWN_STORAGE_KEY, JSON.stringify(Object.fromEntries(errorCooldowns)));
    } catch (e) {
        // Storage full or unavailable — suppression degrades to in-memory only.
    }
}

/**
 * Check if we can report this error (client-side rate limiting).
 *
 * Every reporting path goes through here now. It used to guard only
 * reportApiError, which left the three paths that fire on their own
 * (unhandled rejections, global errors, render errors) completely unthrottled —
 * and those are exactly the ones a broken render loop repeats fastest.
 */
function canReportError(errorKey) {
    const now = Date.now();
    const lastReported = errorCooldowns.get(errorKey);

    if (lastReported && (now - lastReported) < (CONFIG.cooldownMinutes * 60 * 1000)) {
        if (CONFIG.enableConsoleLog) {
            console.log(`[ErrorTracking] Cooldown active for: ${errorKey}`);
        }
        return false;
    }

    return true;
}

/** Mark an error key as just-reported, in memory and for the rest of the tab. */
function markReported(errorKey) {
    errorCooldowns.set(errorKey, Date.now());
    persistCooldowns();
}

/**
 * Cooldown key for the paths that carry no endpoint.
 *
 * getErrorKey() keys on errorType + endpoint + statusCode, which is right for
 * API errors but collapses to a single constant for render errors, rejections
 * and global errors — they all have a null endpoint and a hardcoded 500, so
 * every distinct React bug would share one key and the first one reported would
 * mute the rest. Keying on the message keeps unrelated bugs independent; it is
 * truncated so a message with an embedded id or timestamp still groups.
 */
function getContentErrorKey(errorType, message, page) {
    return `${errorType}_${page || ''}_${String(message || '').slice(0, 120)}`;
}

/**
 * Extract user info from localStorage/JWT token
 */
function getUserInfo() {
    if (!isBrowser) return {};

    try {
        // Try to get user from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return {
                userId: user.id || user.userId,
                username: user.username || user.name || user.email,
                branchId: user.branchId
            };
        }

        // Try to decode JWT token
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                userId: payload.id || payload.userId || payload.sub,
                username: payload.username || payload.name || payload.email,
                branchId: payload.branchId
            };
        }
    } catch (e) {
        // Ignore parsing errors
    }

    return {};
}

/**
 * Get current page URL
 */
function getCurrentPage() {
    if (!isBrowser) return '';
    return window.location.pathname + window.location.search;
}

/**
 * Get user agent string
 */
function getUserAgent() {
    if (!isBrowser) return '';
    return navigator.userAgent;
}

/**
 * Determine error type from error object or response
 */
function determineErrorType(error, response) {
    // Check for specific error types
    if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return 'NETWORK_ERROR';
    }

    if (error?.name === 'AbortError') {
        return 'REQUEST_ABORTED';
    }

    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('ECONNREFUSED')) {
        return 'CONNECTION_REFUSED';
    }

    // Check response for hints
    if (response?.data?.error) {
        const errorMsg = response.data.error.toLowerCase();
        if (errorMsg.includes('database') || errorMsg.includes('db')) {
            return 'DATABASE_ERROR';
        }
        if (errorMsg.includes('auth') || errorMsg.includes('token')) {
            return 'AUTHENTICATION_ERROR';
        }
        if (errorMsg.includes('permission') || errorMsg.includes('forbidden')) {
            return 'AUTHORIZATION_ERROR';
        }
        if (errorMsg.includes('validation')) {
            return 'VALIDATION_ERROR';
        }
    }

    // Determine by status code
    const statusCode = response?.status || error?.response?.status;
    if (statusCode >= 500) {
        return 'SERVER_ERROR';
    }
    if (statusCode === 401) {
        return 'UNAUTHORIZED';
    }
    if (statusCode === 403) {
        return 'FORBIDDEN';
    }
    if (statusCode === 404) {
        return 'NOT_FOUND';
    }
    if (statusCode >= 400) {
        return 'CLIENT_ERROR';
    }

    return 'UNKNOWN_ERROR';
}

/**
 * Send error report to backend
 */
async function sendErrorReport(errorData) {
    try {
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}${ERROR_REPORT_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(errorData)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (CONFIG.enableConsoleLog) {
            console.log('[ErrorTracking] Error report sent:', result);
        }

        return result;

    } catch (error) {
        if (CONFIG.enableConsoleLog) {
            console.error('[ErrorTracking] Failed to send error report:', error);
        }

        // Add to offline queue
        addToOfflineQueue(errorData);

        return { success: false, queued: true };
    }
}

/**
 * Add error to offline queue
 */
function addToOfflineQueue(errorData) {
    if (offlineQueue.length >= CONFIG.maxQueueSize) {
        offlineQueue.shift(); // Remove oldest
    }
    offlineQueue.push(errorData);

    // Save to localStorage
    if (isBrowser) {
        try {
            localStorage.setItem('errorQueue', JSON.stringify(offlineQueue));
        } catch (e) {
            // Storage might be full
        }
    }
}

/**
 * Flush offline queue when back online
 */
async function flushOfflineQueue() {
    if (offlineQueue.length === 0) return;

    try {
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}${BATCH_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ errors: offlineQueue })
        });

        if (response.ok) {
            offlineQueue = [];
            if (isBrowser) {
                localStorage.removeItem('errorQueue');
            }
            if (CONFIG.enableConsoleLog) {
                console.log('[ErrorTracking] Offline queue flushed successfully');
            }
        }
    } catch (error) {
        if (CONFIG.enableConsoleLog) {
            console.error('[ErrorTracking] Failed to flush offline queue:', error);
        }
    }
}

/**
 * Report an API error
 * @param {Error} error - The error object
 * @param {Object} config - Request configuration (url, method, data)
 * @param {Object} response - Response object if available
 */
export function reportApiError(error, config = {}, response = null) {
    // A request the client itself abandoned (navigation, offline, explicit
    // abort) is not a server fault — see isClientAbortedRequest.
    if (isClientAbortedRequest(error)) {
        if (CONFIG.enableConsoleLog) {
            console.log('[ErrorTracking] Skipping client-aborted request:', error?.message);
        }
        return Promise.resolve({ success: false, message: 'Skipped: client aborted' });
    }

    const userInfo = getUserInfo();
    const statusCode = response?.status || error?.response?.status || 0;
    const errorType = determineErrorType(error, response);

    const errorData = {
        errorType,
        message: error?.message || response?.data?.message || response?.data?.error || 'Unknown error',
        endpoint: config.url || error?.config?.url,
        method: config.method?.toUpperCase() || error?.config?.method?.toUpperCase() || 'GET',
        statusCode,
        page: getCurrentPage(),
        userAgent: getUserAgent(),
        ...userInfo,
        timestamp: new Date().toISOString(),
        stackTrace: error?.stack,
        requestData: config.data || error?.config?.data,
        responseData: response?.data || error?.response?.data,
        additionalInfo: {
            errorName: error?.name,
            errorCode: error?.code
        }
    };

    // Check client-side rate limiting
    const errorKey = getErrorKey(errorData);
    if (!canReportError(errorKey)) {
        return Promise.resolve({ success: false, message: 'Rate limited' });
    }

    // Check severity - only report CRITICAL and HIGH
    const severity = classifyErrorSeverity(statusCode, errorType, errorData.message);
    if (severity !== SEVERITY.CRITICAL && severity !== SEVERITY.HIGH) {
        if (CONFIG.enableConsoleLog) {
            console.log(`[ErrorTracking] Skipping ${severity} severity error`);
        }
        return Promise.resolve({ success: false, message: `Skipped: ${severity} severity` });
    }

    // Update cooldown
    markReported(errorKey);

    return sendErrorReport(errorData);
}

/**
 * Report a React render error (from ErrorBoundary)
 * @param {Error} error - The error object
 * @param {Object} errorInfo - React error info with componentStack
 */
export function reportRenderError(error, errorInfo = {}) {
    // Stale-chunk errors after a deploy self-heal with a page reload
    // (see staleChunkReload.js) — not a system fault, don't page the admin.
    if (isStaleChunkError(error?.message)) {
        if (CONFIG.enableConsoleLog) {
            console.log('[ErrorTracking] Skipping stale-chunk error (self-healing)');
        }
        return Promise.resolve({ success: false, message: 'Skipped: stale chunk' });
    }

    // A render error repeats on every remount, and React remounts an error
    // boundary's subtree on each retry — so one broken route could mail an
    // alert per retry. Throttle on the message, not the route alone.
    const cooldownKey = getContentErrorKey('REACT_RENDER_ERROR', error?.message, getCurrentPage());
    if (!canReportError(cooldownKey)) {
        return Promise.resolve({ success: false, message: 'Rate limited' });
    }
    markReported(cooldownKey);

    const userInfo = getUserInfo();

    const errorData = {
        errorType: 'REACT_RENDER_ERROR',
        message: error?.message || 'React render error',
        endpoint: null,
        method: null,
        statusCode: 500,
        page: getCurrentPage(),
        userAgent: getUserAgent(),
        ...userInfo,
        timestamp: new Date().toISOString(),
        stackTrace: error?.stack,
        additionalInfo: {
            componentStack: errorInfo?.componentStack,
            errorName: error?.name
        }
    };

    return sendErrorReport(errorData);
}

/**
 * Report an unhandled promise rejection
 * @param {PromiseRejectionEvent} event
 */
export function reportUnhandledRejection(event) {
    if (_isReportingError) return;
    _isReportingError = true;
    try {
        const error = event.reason;
        if (isStaleChunkError(error?.message)) return;
        // Injected extension scripts share this page's event loop, and their
        // rejections land on our window. They are not this app's to fix, and
        // they arrived in enough volume to crowd out real alerts.
        if (isExtensionNoise(error) || isIgnorableBrowserError(error?.message)) {
            if (CONFIG.enableConsoleLog) {
                console.log('[ErrorTracking] Skipping non-application rejection:', error);
            }
            return;
        }
        if (isClientAbortedRequest(error)) {
            if (CONFIG.enableConsoleLog) {
                console.log('[ErrorTracking] Skipping client-aborted request rejection');
            }
            return;
        }
        const cooldownKey = getContentErrorKey('UNHANDLED_PROMISE_REJECTION', error?.message, getCurrentPage());
        if (!canReportError(cooldownKey)) return;
        markReported(cooldownKey);

        const userInfo = getUserInfo();

        const errorData = {
            errorType: 'UNHANDLED_PROMISE_REJECTION',
            message: error?.message || String(error) || 'Unhandled promise rejection',
            endpoint: null,
            method: null,
            statusCode: 500,
            page: getCurrentPage(),
            userAgent: getUserAgent(),
            ...userInfo,
            timestamp: new Date().toISOString(),
            stackTrace: error?.stack,
            additionalInfo: {
                errorName: error?.name,
                promiseType: typeof error
            }
        };

        sendErrorReport(errorData);
    } finally {
        _isReportingError = false;
    }
}

/**
 * Report a global JavaScript error
 * @param {ErrorEvent} event
 */
export function reportGlobalError(event) {
    if (_isReportingError) return;
    _isReportingError = true;
    try {
        if (isStaleChunkError(event.message)) return;
        if (isIgnorableBrowserError(event.message)) {
            if (CONFIG.enableConsoleLog) {
                console.log('[ErrorTracking] Skipping benign browser notice:', event.message);
            }
            return;
        }
        // The window 'error' event fires for failed RESOURCE loads too (an
        // <img>, <script> or <link> that 404s), not just thrown exceptions.
        // Those events carry no .message at all, so they were being mailed as
        // "JavaScript error" with every useful field blank. A missing asset is
        // a real problem, but it is not one this alert can describe — and it is
        // caught properly by the stale-chunk path when it matters.
        if (!event.message && event.target && event.target !== window) {
            if (CONFIG.enableConsoleLog) {
                console.log('[ErrorTracking] Skipping resource load error:', event.target?.src || event.target?.href);
            }
            return;
        }

        const cooldownKey = getContentErrorKey('GLOBAL_JS_ERROR', event.message, getCurrentPage());
        if (!canReportError(cooldownKey)) return;
        markReported(cooldownKey);

        const userInfo = getUserInfo();

        const errorData = {
            errorType: 'GLOBAL_JS_ERROR',
            message: event.message || 'JavaScript error',
            endpoint: null,
            method: null,
            statusCode: 500,
            page: getCurrentPage(),
            userAgent: getUserAgent(),
            ...userInfo,
            timestamp: new Date().toISOString(),
            stackTrace: event.error?.stack,
            additionalInfo: {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                errorName: event.error?.name
            }
        };

        sendErrorReport(errorData);
    } finally {
        _isReportingError = false;
    }
}

/**
 * Create Axios interceptor for automatic error reporting
 * @param {Object} axiosInstance - Axios instance to attach interceptor to
 */
export function setupAxiosInterceptor(axiosInstance) {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Report the error
            reportApiError(error, error.config, error.response);

            // Re-throw to let the application handle it
            return Promise.reject(error);
        }
    );

    if (CONFIG.enableConsoleLog) {
        console.log('[ErrorTracking] Axios interceptor set up');
    }
}

/**
 * Initialize global error handlers
 * Call this once when the app starts
 */
export function initErrorTracking() {
    if (!isBrowser) return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', reportUnhandledRejection);

    // Handle global JavaScript errors
    window.addEventListener('error', reportGlobalError);

    // Handle online/offline for queue flushing
    window.addEventListener('online', flushOfflineQueue);

    // Mark the page as leaving so requests aborted by the navigation are not
    // mistaken for the backend being unreachable (see isClientAbortedRequest).
    // 'pagehide' fires where 'beforeunload' does not on mobile Safari, which is
    // precisely where mid-request navigation is most common.
    window.addEventListener('pagehide', () => { isPageUnloading = true; });
    window.addEventListener('beforeunload', () => { isPageUnloading = true; });

    // Restore this tab's suppression window so a reload cannot re-send an alert
    // the previous page load already sent.
    loadCooldowns();

    // Load offline queue from localStorage
    try {
        const savedQueue = localStorage.getItem('errorQueue');
        if (savedQueue) {
            offlineQueue = JSON.parse(savedQueue);
            // Try to flush if online
            if (navigator.onLine) {
                flushOfflineQueue();
            }
        }
    } catch (e) {
        // Ignore parsing errors
    }

    if (CONFIG.enableConsoleLog) {
        console.log('[ErrorTracking] Initialized global error handlers');
    }
}

/**
 * Manual error report function
 * Use this for custom error reporting
 */
export function reportError(errorType, message, additionalData = {}) {
    const userInfo = getUserInfo();

    const errorData = {
        errorType,
        message,
        endpoint: additionalData.endpoint || null,
        method: additionalData.method || null,
        statusCode: additionalData.statusCode || 500,
        page: getCurrentPage(),
        userAgent: getUserAgent(),
        ...userInfo,
        timestamp: new Date().toISOString(),
        stackTrace: additionalData.stackTrace || new Error().stack,
        requestData: additionalData.requestData,
        responseData: additionalData.responseData,
        additionalInfo: additionalData.additionalInfo
    };

    return sendErrorReport(errorData);
}

// Export everything
export default {
    reportApiError,
    reportRenderError,
    reportUnhandledRejection,
    reportGlobalError,
    setupAxiosInterceptor,
    initErrorTracking,
    reportError,
    SEVERITY
};
