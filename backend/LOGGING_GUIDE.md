# Backend Logging Configuration Guide

## Overview

The backend now uses a structured logging system to reduce console noise and provide better control over what information is displayed.

## Log Levels

### DEBUG

- Shows all logs including detailed debugging information
- Only works in development mode (NODE_ENV !== 'production')
- Use for troubleshooting specific issues

### INFO (Default)

- Shows important information like successful operations
- Shows warnings and errors
- Good for normal development

### WARN

- Shows only warnings and errors
- Good for production-like environments

### ERROR

- Shows only errors
- Minimal logging for production

## How to Control Logging

### Method 1: Environment Variable

Set the `LOG_LEVEL` environment variable in your `.env` file:

```
LOG_LEVEL=INFO
```

### Method 2: Command Line

Run the server with a specific log level:

```bash
LOG_LEVEL=WARN node app.js
```

### Method 3: Production Mode

Set `NODE_ENV=production` to automatically reduce logging:

```bash
NODE_ENV=production node app.js
```

## What's Been Cleaned Up

### Before (117+ console.log statements):

- Verbose login debugging
- Detailed query logging
- Step-by-step transaction logs
- Raw data dumps
- Performance metrics for every request

### After (Structured logging):

- Only important information by default
- Debug info only when LOG_LEVEL=DEBUG
- Warnings for slow requests (>1000ms) or errors
- Clean, structured log messages with emojis
- Production-ready logging levels

## Recommended Settings

### Development

```
LOG_LEVEL=INFO
NODE_ENV=development
```

### Production

```
LOG_LEVEL=ERROR
NODE_ENV=production
```

### Debugging Issues

```
LOG_LEVEL=DEBUG
NODE_ENV=development
```

## Log Message Examples

### INFO Level

```
ℹ️  [INFO] Login request received {"username":"testuser"}
ℹ️  [INFO] Email sent successfully {"messageId":"<message-id>"}
ℹ️  [INFO] Quiz session created {"id":123,"session_id":"uuid"}
```

### WARN Level

```
⚠️  [WARN] Slow request: POST /quiz-sessions - 200 - 1500ms
⚠️  [WARN] No user found for username: invaliduser
```

### ERROR Level

```
❌ [ERROR] Error fetching questions Error: Connection timeout
❌ [ERROR] Failed to record quiz session Error: Database constraint violation
```

## Benefits

1. **Reduced Noise**: No more overwhelming console output
2. **Better Debugging**: Easy to enable detailed logs when needed
3. **Production Ready**: Clean logs in production
4. **Structured Data**: JSON objects for easy parsing
5. **Performance**: Only logs what's necessary
