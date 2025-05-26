let captureException: (error: Error, context?: any) => void = (error) => {
  console.error('Sentry not available:', error);
};

try {
  const sentry = require('@sentry/nextjs');
  if (sentry.captureException) {
    captureException = sentry.captureException;
  }
} catch (e) {
  console.log('Sentry not configured');
}

export function logClientError(error: Error, context?: Record<string, unknown>) {
  console.error('Client error:', error, context);
  
  if (process.env.NODE_ENV === 'production') {
    captureException(error, { contexts: { client: context } });
  }
}

export function setupErrorHandling() {
  if (typeof window !== 'undefined') {
    // Store original console.error
    const originalConsoleError = console.error;
    
    // Override console.error to catch React warnings
    console.error = (...args) => {
      if (args.some(arg => 
        typeof arg === 'string' && 
        arg.includes('A props object containing a "key" prop')
      )) {
        logClientError(new Error('React key spread warning'), { 
          message: args[0], 
          stack: new Error().stack 
        });
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('error', (event) => {
      logClientError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      logClientError(new Error('Unhandled promise rejection'), { 
        reason: event.reason 
      });
    });
  }
}
