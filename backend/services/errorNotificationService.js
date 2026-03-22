/**
 * Error Notification Service
 * Sends beautifully formatted HTML emails for critical errors
 */

import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    tls: true,
    secure: false,
    auth: {
        user: "alshrakynodeapp@gmail.com",
        pass: "ssjpnctdsyqxylxd"
    }
});

// Developer emails to notify
const DEVELOPER_EMAILS = process.env.DEVELOPER_EMAILS?.split(',') || ['muhmodalshraky3@gmail.com'];

// Rate limiting configuration
const RATE_LIMIT = {
    maxEmailsPerHour: 20,
    cooldownMinutes: 5
};

// Track sent emails for rate limiting
const emailTracker = {
    hourlyCount: 0,
    hourlyResetTime: Date.now() + 3600000,
    errorCooldowns: new Map(), // errorKey -> lastSentTime
    errorFrequency: new Map()  // errorKey -> count in last hour
};

// Severity levels
const SEVERITY = {
    CRITICAL: { level: 'CRITICAL', color: '#dc2626', emoji: '🚨', bgGradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' },
    HIGH: { level: 'HIGH', color: '#ea580c', emoji: '⚠️', bgGradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' },
    MEDIUM: { level: 'MEDIUM', color: '#ca8a04', emoji: '⚡', bgGradient: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)' },
    LOW: { level: 'LOW', color: '#2563eb', emoji: 'ℹ️', bgGradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
};

/**
 * Classify error severity based on status code and error type
 */
function classifyErrorSeverity(errorData) {
    const { statusCode, errorType, message } = errorData;

    // Database errors are always critical
    if (errorType?.includes('DATABASE') || message?.toLowerCase().includes('database')) {
        return SEVERITY.CRITICAL;
    }

    // Connection failures are critical
    if (errorType?.includes('CONNECTION') || message?.toLowerCase().includes('connection')) {
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
 * Check if we can send an email (rate limiting)
 */
function canSendEmail(errorKey) {
    const now = Date.now();

    // Reset hourly counter if needed
    if (now > emailTracker.hourlyResetTime) {
        emailTracker.hourlyCount = 0;
        emailTracker.hourlyResetTime = now + 3600000;
        emailTracker.errorFrequency.clear();
    }

    // Check hourly limit
    if (emailTracker.hourlyCount >= RATE_LIMIT.maxEmailsPerHour) {
        console.log('[ErrorNotification] Hourly email limit reached');
        return false;
    }

    // Check cooldown for same error type
    const lastSent = emailTracker.errorCooldowns.get(errorKey);
    if (lastSent && (now - lastSent) < (RATE_LIMIT.cooldownMinutes * 60 * 1000)) {
        console.log(`[ErrorNotification] Cooldown active for error: ${errorKey}`);
        return false;
    }

    return true;
}

/**
 * Update rate limiting trackers
 */
function updateTrackers(errorKey) {
    const now = Date.now();
    emailTracker.hourlyCount++;
    emailTracker.errorCooldowns.set(errorKey, now);

    // Update frequency
    const currentFreq = emailTracker.errorFrequency.get(errorKey) || 0;
    emailTracker.errorFrequency.set(errorKey, currentFreq + 1);
}

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

/**
 * Generate unique error ID
 */
function generateErrorId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `${timestamp}-${random}`;
}

/**
 * Get status code badge color
 */
function getStatusColor(statusCode) {
    if (statusCode >= 500) return '#dc2626';
    if (statusCode >= 400) return '#ca8a04';
    if (statusCode >= 300) return '#2563eb';
    return '#16a34a';
}

/**
 * Escape HTML to prevent XSS in emails
 */
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Format JSON for display
 */
function formatJson(data) {
    if (!data) return 'N/A';
    try {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        return escapeHtml(JSON.stringify(data, null, 2));
    } catch {
        return escapeHtml(String(data));
    }
}

/**
 * Generate beautiful HTML email template
 */
function generateEmailHtml(errorData, severity, errorId, frequency) {
    const isProduction = process.env.NODE_ENV === 'production';
    const envBadge = isProduction
        ? '<span style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 6px 16px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);">🔴 Production</span>'
        : '<span style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 6px 16px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(22, 163, 74, 0.4);">🟢 Development</span>';

    const frequencyBadge = frequency > 1
        ? `<span style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; margin-left: 8px; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);">🔄 ×${frequency}</span>`
        : '';

    const hourlyCount = emailTracker.hourlyCount;
    const hourlyBadge = hourlyCount > 5
        ? `<span style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; margin-left: 8px; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);">📊 ${hourlyCount}/hr</span>`
        : '';

    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const pageUrl = errorData.page ? `${appUrl}${errorData.page}` : appUrl;

    // Get severity-specific styles
    const severityStyles = {
        CRITICAL: {
            gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)',
            glow: 'rgba(220, 38, 38, 0.3)',
            icon: '🚨',
            accent: '#fca5a5'
        },
        HIGH: {
            gradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #9a3412 100%)',
            glow: 'rgba(234, 88, 12, 0.3)',
            icon: '⚠️',
            accent: '#fdba74'
        },
        MEDIUM: {
            gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 50%, #a16207 100%)',
            glow: 'rgba(234, 179, 8, 0.3)',
            icon: '⚡',
            accent: '#fde047'
        },
        LOW: {
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
            glow: 'rgba(59, 130, 246, 0.3)',
            icon: 'ℹ️',
            accent: '#93c5fd'
        }
    };

    const style = severityStyles[severity.level] || severityStyles.HIGH;

    return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Error Report - MEDQIZE</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); min-height: 100vh;">
  
  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Email Card -->
        <table width="640" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);">
          
          <!-- Animated Header with Gradient -->
          <tr>
            <td style="background: ${style.gradient}; padding: 0; position: relative;">
              <!-- Decorative Elements -->
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2220%22 cy=%2230%22 r=%2240%22 fill=%22rgba(255,255,255,0.05)%22/><circle cx=%2280%22 cy=%2270%22 r=%2260%22 fill=%22rgba(255,255,255,0.03)%22/></svg>');"></div>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 48px 40px 40px 40px; text-align: center;">
                    <!-- Error Icon -->
                    <div style="display: inline-block; width: 80px; height: 80px; background: rgba(255,255,255,0.15); border-radius: 50%; line-height: 80px; font-size: 40px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2);">
                      ${style.icon}
                    </div>
                    
                    <!-- Title -->
                    <h1 style="margin: 0 0 8px 0; color: white; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                      System Error Detected
                    </h1>
                    <p style="margin: 0 0 24px 0; color: rgba(255,255,255,0.8); font-size: 15px; font-weight: 500;">
                      MEDQIZE Monitoring System
                    </p>
                    
                    <!-- Severity & Status Badges -->
                    <div style="display: inline-block;">
                      <span style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); color: white; padding: 10px 24px; border-radius: 50px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 4px 16px rgba(0,0,0,0.2);">
                        ${severity.level}
                      </span>
                      ${frequencyBadge}
                      ${hourlyBadge}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Error Type Banner -->
          <tr>
            <td style="background: linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%); padding: 24px 40px; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background: ${severity.color}; color: white; padding: 4px 12px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                      Error Type
                    </span>
                    <h2 style="margin: 8px 0 0 0; color: #0f172a; font-size: 22px; font-weight: 700; font-family: 'Consolas', 'Monaco', 'Courier New', monospace;">
                      ${escapeHtml(errorData.errorType) || 'UNKNOWN_ERROR'}
                    </h2>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Error Message -->
          <tr>
            <td style="padding: 32px 40px; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid ${severity.color}; border-radius: 0 12px 12px 0; padding: 20px 24px;">
                    <p style="margin: 0; color: #991b1b; font-size: 15px; line-height: 1.6; font-weight: 500;">
                      💬 "${escapeHtml(errorData.message) || 'No error message provided'}"
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Error Details Grid -->
          <tr>
            <td style="padding: 32px 40px;">
              <h3 style="margin: 0 0 20px 0; color: #0f172a; font-size: 16px; font-weight: 700; display: flex; align-items: center;">
                <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-radius: 8px; text-align: center; line-height: 32px; margin-right: 12px; font-size: 16px;">📋</span>
                Error Details
              </h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <!-- Time -->
                <tr>
                  <td style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; width: 140px;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">🕐 Time</span>
                  </td>
                  <td style="padding: 16px 20px; background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #0f172a; font-size: 14px; font-weight: 600;">${formatTimestamp(errorData.timestamp || new Date())}</span>
                  </td>
                </tr>
                
                <!-- Page -->
                <tr>
                  <td style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📍 Page</span>
                  </td>
                  <td style="padding: 16px 20px; background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                    <a href="${pageUrl}" style="color: #2563eb; font-size: 14px; font-weight: 600; text-decoration: none;">${escapeHtml(errorData.page) || 'N/A'}</a>
                  </td>
                </tr>
                
                <!-- Endpoint -->
                <tr>
                  <td style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">🔗 Endpoint</span>
                  </td>
                  <td style="padding: 16px 20px; background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                    <span style="display: inline-block; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1e40af; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; font-family: monospace; margin-right: 8px;">${escapeHtml(errorData.method) || 'GET'}</span>
                    <span style="color: #0f172a; font-size: 13px; font-family: 'Consolas', monospace;">${escapeHtml(errorData.endpoint) || 'N/A'}</span>
                  </td>
                </tr>
                
                <!-- Status Code -->
                <tr>
                  <td style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📊 Status</span>
                  </td>
                  <td style="padding: 16px 20px; background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                    <span style="display: inline-block; background: ${getStatusColor(errorData.statusCode)}; color: white; padding: 6px 16px; border-radius: 50px; font-size: 13px; font-weight: 700; box-shadow: 0 2px 8px ${getStatusColor(errorData.statusCode)}40;">
                      ${errorData.statusCode || 'N/A'}
                    </span>
                  </td>
                </tr>
                
                <!-- User -->
                <tr>
                  <td style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">👤 User</span>
                  </td>
                  <td style="padding: 16px 20px; background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #0f172a; font-size: 14px; font-weight: 600;">
                      ${errorData.username ? `${escapeHtml(errorData.username)} <span style="color: #64748b; font-weight: 400;">(ID: ${errorData.userId || 'N/A'})</span>` : '<span style="color: #94a3b8;">Anonymous</span>'}
                    </span>
                    ${errorData.branchId ? `<br><span style="color: #64748b; font-size: 12px;">Branch: ${errorData.branchId}</span>` : ''}
                  </td>
                </tr>
                
                <!-- Browser -->
                <tr>
                  <td style="padding: 16px 20px; background: #f8fafc;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">🌐 Browser</span>
                  </td>
                  <td style="padding: 16px 20px; background: #ffffff;">
                    <span style="color: #64748b; font-size: 12px; line-height: 1.5;">${escapeHtml(errorData.userAgent)?.substring(0, 100) || 'N/A'}${errorData.userAgent?.length > 100 ? '...' : ''}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Request Data -->
          ${errorData.requestData && Object.keys(errorData.requestData).length > 0 ? `
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 8px; text-align: center; line-height: 32px; margin-right: 12px; font-size: 16px;">📤</span>
                Request Data
              </h3>
              <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px; padding: 20px; overflow-x: auto; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);">
                <pre style="margin: 0; color: #a5f3fc; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 12px; line-height: 1.6; white-space: pre-wrap; word-break: break-all;">${formatJson(errorData.requestData)}</pre>
              </div>
            </td>
          </tr>
          ` : ''}
          
          <!-- Response Data -->
          ${errorData.responseData ? `
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; text-align: center; line-height: 32px; margin-right: 12px; font-size: 16px;">📥</span>
                Response Data
              </h3>
              <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px; padding: 20px; overflow-x: auto; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);">
                <pre style="margin: 0; color: #fde68a; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 12px; line-height: 1.6; white-space: pre-wrap; word-break: break-all;">${formatJson(errorData.responseData)}</pre>
              </div>
            </td>
          </tr>
          ` : ''}
          
          <!-- Stack Trace -->
          ${errorData.stackTrace ? `
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 8px; text-align: center; line-height: 32px; margin-right: 12px; font-size: 16px;">🔍</span>
                Stack Trace
              </h3>
              <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px; padding: 20px; max-height: 300px; overflow: auto; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);">
                <pre style="margin: 0; color: #fca5a5; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 11px; line-height: 1.7; white-space: pre-wrap; word-break: break-all;">${escapeHtml(errorData.stackTrace)}</pre>
              </div>
            </td>
          </tr>
          ` : ''}
          
          <!-- Additional Info -->
          ${errorData.additionalInfo && Object.keys(errorData.additionalInfo).length > 0 ? `
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 8px; text-align: center; line-height: 32px; margin-right: 12px; font-size: 16px;">ℹ️</span>
                Additional Info
              </h3>
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #7dd3fc; border-radius: 12px; padding: 20px;">
                <pre style="margin: 0; color: #0369a1; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 12px; line-height: 1.6; white-space: pre-wrap; word-break: break-all;">${formatJson(errorData.additionalInfo)}</pre>
              </div>
            </td>
          </tr>
          ` : ''}
          
          <!-- Quick Actions -->
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <h3 style="margin: 0 0 20px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%); border-radius: 8px; text-align: center; line-height: 32px; margin-right: 12px; font-size: 16px;">⚡</span>
                Quick Actions
              </h3>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right: 12px;">
                    <a href="${pageUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); transition: transform 0.2s;">
                      🌐 Open Page
                    </a>
                  </td>
                  <td style="padding-right: 12px;">
                    <a href="${appUrl}/admin" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);">
                      📋 Admin Panel
                    </a>
                  </td>
                  <td>
                    <a href="https://vercel.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(71, 85, 105, 0.4);">
                      📊 Vercel Logs
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Environment & Error ID Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 24px 40px; border-top: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: left;">
                    ${envBadge}
                  </td>
                  <td style="text-align: right;">
                    <span style="color: #94a3b8; font-size: 11px; font-family: monospace;">
                      Error ID: <strong style="color: #64748b;">${errorId}</strong>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Brand Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: rgba(255,255,255,0.6); font-size: 12px;">
                Auto-generated by <strong style="color: #22d3ee;">MEDQIZE</strong> Error Monitoring System
              </p>
              <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 11px;">
                📧 This is an automated message • ${new Date().getFullYear()} SMLE Question Bank
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `;
}

/**
 * Generate email subject
 */
function generateSubject(errorData, severity, frequency) {
    const repeatText = frequency > 1 ? ` (×${frequency})` : '';
    return `${severity.emoji} [${severity.level}] System Error: ${errorData.errorType || 'UNKNOWN_ERROR'}${repeatText}`;
}

/**
 * Send error notification email
 * @param {Object} errorData - Error details
 * @returns {Promise<{success: boolean, errorId?: string, message?: string}>}
 */
export async function sendErrorNotification(errorData) {
    try {
        // Classify severity
        const severity = classifyErrorSeverity(errorData);

        // Only send emails for CRITICAL and HIGH severity
        if (severity.level !== 'CRITICAL' && severity.level !== 'HIGH') {
            console.log(`[ErrorNotification] Skipping email for ${severity.level} severity error`);
            return { success: false, message: `Skipped: ${severity.level} severity` };
        }

        // Check rate limiting
        const errorKey = getErrorKey(errorData);
        if (!canSendEmail(errorKey)) {
            return { success: false, message: 'Rate limited' };
        }

        // Get error frequency
        const frequency = (emailTracker.errorFrequency.get(errorKey) || 0) + 1;

        // Generate error ID
        const errorId = generateErrorId();

        // Generate email content
        const htmlContent = generateEmailHtml(errorData, severity, errorId, frequency);
        const subject = generateSubject(errorData, severity, frequency);

        // Send email
        const mailOptions = {
            from: '"MEDQIZE Error Monitor" <alshrakynodeapp@gmail.com>',
            to: DEVELOPER_EMAILS.join(', '),
            subject: subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);

        // Update trackers
        updateTrackers(errorKey);

        console.log(`[ErrorNotification] Email sent successfully. Error ID: ${errorId}`);

        return { success: true, errorId };

    } catch (error) {
        console.error('[ErrorNotification] Failed to send email:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Send error notification for backend errors
 * @param {Error} error - The error object
 * @param {Object} req - Express request object (optional)
 * @param {Object} additionalInfo - Additional context (optional)
 */
export async function notifyBackendError(error, req = null, additionalInfo = {}) {
    const errorData = {
        errorType: error.name || 'BACKEND_ERROR',
        message: error.message,
        endpoint: req?.originalUrl || req?.url,
        method: req?.method,
        statusCode: error.statusCode || error.status || 500,
        page: req?.headers?.referer || req?.headers?.origin,
        userAgent: req?.headers?.['user-agent'],
        userId: req?.user?.id,
        username: req?.user?.username,
        branchId: req?.user?.branchId,
        timestamp: new Date().toISOString(),
        stackTrace: error.stack,
        requestData: {
            body: req?.body,
            params: req?.params,
            query: req?.query
        },
        additionalInfo
    };

    return sendErrorNotification(errorData);
}

/**
 * Get current rate limiting status
 */
export function getRateLimitStatus() {
    return {
        hourlyCount: emailTracker.hourlyCount,
        maxPerHour: RATE_LIMIT.maxEmailsPerHour,
        cooldownMinutes: RATE_LIMIT.cooldownMinutes,
        activeErrors: emailTracker.errorCooldowns.size
    };
}

export default {
    sendErrorNotification,
    notifyBackendError,
    getRateLimitStatus,
    SEVERITY
};
