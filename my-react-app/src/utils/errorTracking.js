/**
 * Frontend Error Tracking Utility
 * Captures and reports errors to backend for email notifications
 */

const ERROR_REPORT_ENDPOINT = '/api/error-report';
const BATCH_ENDPOINT = '/api/error-report/batch';

// Configuration
const CONFIG = {
    cooldownMinutes: 1, // Client-side cooldown for same error
    maxQueueSize: 50,   // Maximum offline queue size
    enableConsoleLog: true
};

// Error severity levels
const SEVERITY = {
    CRITICAL: 'CRITICAL',
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW'
};

// Track sent errors for client-side rate limiting
const errorCooldowns = new Map();

// Offline queue for errors when network fails
let offlineQueue = [];

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Get API base URL
 */
function getApiBaseUrl() {
    // Check for environment variable or use default
    return import.meta.env?.VITE_API_URL || 'https://medquiz.vercel.app';
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

    // Authentication errors are high
    if (statusCode === 401 || statusCode === 403) {
        return SEVERITY.HIGH;
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
 * Check if we can report this error (client-side rate limiting)
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
    errorCooldowns.set(errorKey, Date.now());

    return sendErrorReport(errorData);
}

/**
 * Report a React render error (from ErrorBoundary)
 * @param {Error} error - The error object
 * @param {Object} errorInfo - React error info with componentStack
 */
export function reportRenderError(error, errorInfo = {}) {
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
    const error = event.reason;
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
}

/**
 * Report a global JavaScript error
 * @param {ErrorEvent} event
 */
export function reportGlobalError(event) {
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
