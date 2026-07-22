/**
 * Error Report API Routes
 * Receives error reports from frontend and sends email notifications
 */

import express from 'express';
import { sendErrorNotification, getRateLimitStatus } from '../services/errorNotificationService.js';

const router = express.Router();

/**
 * POST /api/error-report
 * Receive error reports from frontend
 */
router.post('/', async (req, res) => {
    try {
        const errorData = req.body;

        // Validate required fields
        if (!errorData || !errorData.message) {
            return res.status(400).json({
                success: false,
                message: 'Error data with message is required'
            });
        }

        // Add server-side timestamp if not provided
        if (!errorData.timestamp) {
            errorData.timestamp = new Date().toISOString();
        }

        // Add IP address for tracking
        errorData.ipAddress = req.ip || req.connection?.remoteAddress;

        // Send notification
        const result = await sendErrorNotification(errorData);

        if (result.success) {
            console.log(`[ErrorReport] Processed error report. ID: ${result.errorId}`);
            return res.status(200).json({
                success: true,
                errorId: result.errorId,
                message: 'Error report received and notification sent'
            });
        } else {
            console.log(`[ErrorReport] Error report received but notification skipped: ${result.message}`);
            return res.status(200).json({
                success: true,
                message: `Error report received. Notification: ${result.message}`
            });
        }

    } catch (error) {
        console.error('[ErrorReport] Failed to process error report:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process error report'
        });
    }
});

/**
 * POST /api/error-report/batch
 * Receive multiple error reports at once (for offline queue flush)
 */
router.post('/batch', async (req, res) => {
    try {
        const { errors } = req.body;

        if (!Array.isArray(errors) || errors.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Array of errors is required'
            });
        }

        const results = [];

        // Process errors sequentially to respect rate limiting
        for (const errorData of errors) {
            if (errorData && errorData.message) {
                if (!errorData.timestamp) {
                    errorData.timestamp = new Date().toISOString();
                }
                errorData.ipAddress = req.ip || req.connection?.remoteAddress;

                const result = await sendErrorNotification(errorData);
                results.push({
                    errorType: errorData.errorType,
                    ...result
                });
            }
        }

        console.log(`[ErrorReport] Processed ${results.length} batch error reports`);

        return res.status(200).json({
            success: true,
            processed: results.length,
            results
        });

    } catch (error) {
        console.error('[ErrorReport] Failed to process batch error reports:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process batch error reports'
        });
    }
});

/**
 * GET /api/error-report/status
 * Get rate limiting status (for debugging/monitoring)
 */
router.get('/status', (req, res) => {
    const status = getRateLimitStatus();
    return res.status(200).json({
        success: true,
        ...status
    });
});

export default router;
