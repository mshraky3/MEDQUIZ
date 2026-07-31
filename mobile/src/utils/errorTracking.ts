/**
 * Lightweight mobile error tracking — mirrors web errorTracking.js
 * Captures API errors, queues offline, flushes on reconnect.
 */

import { Platform } from 'react-native';
import axios from 'axios';
import Config from '../constants/config';
import { getErrorQueue, setErrorQueue, clearErrorQueue } from './storage';

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface ErrorReport {
    errorType: string;
    message: string;
    endpoint?: string;
    method?: string;
    statusCode?: number;
    page?: string;
    userAgent: string;
    userId?: number;
    timestamp: string;
    stackTrace?: string;
    requestData?: any;
    additionalInfo?: any;
}

function classifySeverity(status?: number): Severity {
    if (!status || status >= 500) return 'CRITICAL';
    if (status === 401 || status === 403) return 'HIGH';
    if (status >= 400) return 'MEDIUM';
    return 'LOW';
}

export function reportApiError(error: any, config?: any, response?: any) {
    const report: ErrorReport = {
        errorType: response ? `HTTP_${response.status}` : 'NETWORK_ERROR',
        message: error?.message || 'Unknown error',
        endpoint: config?.url,
        method: config?.method?.toUpperCase(),
        statusCode: response?.status,
        userAgent: `SQB-Mobile/${Platform.OS}/${Platform.Version}`,
        timestamp: new Date().toISOString(),
        stackTrace: error?.stack,
        requestData: config?.data,
        additionalInfo: {
            severity: classifySeverity(response?.status),
            platform: Platform.OS,
        },
    };

    sendOrQueue(report);
}

export function reportError(error: Error, context?: Record<string, any>) {
    const report: ErrorReport = {
        errorType: 'JS_ERROR',
        message: error.message,
        userAgent: `SQB-Mobile/${Platform.OS}/${Platform.Version}`,
        timestamp: new Date().toISOString(),
        stackTrace: error.stack,
        additionalInfo: { ...context, platform: Platform.OS },
    };

    sendOrQueue(report);
}

async function sendOrQueue(report: ErrorReport) {
    try {
        await axios.post(`${Config.API_URL}/api/error-report`, report, {
            timeout: 5000,
        });
    } catch {
        // Offline or failed — queue it
        try {
            const queue = await getErrorQueue();
            if (queue.length < 50) {
                queue.push(report);
                await setErrorQueue(queue);
            }
        } catch {
            // storage failure — drop error
        }
    }
}

export async function flushErrorQueue() {
    try {
        const queue = await getErrorQueue();
        if (queue.length === 0) return;

        await axios.post(`${Config.API_URL}/api/error-report/batch`, {
            errors: queue,
        }, { timeout: 10000 });

        await clearErrorQueue();
    } catch {
        // Will try again later
    }
}
