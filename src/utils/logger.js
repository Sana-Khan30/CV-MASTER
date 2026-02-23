/**
 * Production-grade logging and error tracking utility
 * Configured for Firebase Cloud Logging integration
 */

const LOG_LEVELS = {
  DEBUG: { level: 0, color: '#7c3aed', label: 'DEBUG' },
  INFO: { level: 1, color: '#0ea5e9', label: 'INFO' },
  WARN: { level: 2, color: '#f59e0b', label: 'WARN' },
  ERROR: { level: 3, color: '#ef4444', label: 'ERROR' },
};

class Logger {
  constructor() {
    this.minLevel = import.meta.env.DEV ? 0 : 2;
    this.history = [];
    this.maxHistory = 100;
  }

  log(level, message, data = null) {
    if (LOG_LEVELS[level].level < this.minLevel) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Store in memory for debugging
    this.history.push(logEntry);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Console output with styling
    const { color, label } = LOG_LEVELS[level];
    const style = `color: ${color}; font-weight: bold; font-size: 12px;`;
    
    if (data) {
      console.log(`%c[${label}] ${timestamp}`, style, message, data);
    } else {
      console.log(`%c[${label}] ${timestamp}`, style, message);
    }

    // Send to backend in production
    if (!import.meta.env.DEV && level !== 'DEBUG') {
      this.sendToServer(logEntry);
    }
  }

  debug(message, data) {
    this.log('DEBUG', message, data);
  }

  info(message, data) {
    this.log('INFO', message, data);
  }

  warn(message, data) {
    this.log('WARN', message, data);
  }

  error(message, error) {
    const errorData = {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    };
    this.log('ERROR', message, errorData);
  }

  sendToServer(logEntry) {
    // Implement server logging here
    // Example: send to Firebase Cloud Logging, Sentry, datadog, etc.
    try {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      }).catch(() => {
        // Silently fail - don't disrupt app
      });
    } catch {
      // Ignore errors
    }
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }

  exportLogs() {
    const logsJson = JSON.stringify(this.history, null, 2);
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const logger = new Logger();

// Global error handler
window.addEventListener('error', (event) => {
  logger.error('Uncaught Error', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', event.reason);
});
