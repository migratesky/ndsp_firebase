'use client';

declare global {
  interface Window {
    __CONTAINER_ERROR__?: string;
  }
}

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Capture ContainerComponent errors specifically
    if (error.message.includes('ContainerComponent')) {
      window.__CONTAINER_ERROR__ = error.message;
    }
    
    // Call error callback if provided
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg" data-testid="error-boundary">
          <h2 className="text-lg font-medium text-red-800">Something went wrong.</h2>
          {this.state.error && (
            <div className="mt-2">
              <p className="text-sm text-red-700">{this.state.error.message}</p>
              {this.state.error.stack && (
                <details className="mt-2 text-xs text-red-600">
                  <summary>Stack trace</summary>
                  <pre className="mt-1 overflow-auto max-h-40">{this.state.error.stack}</pre>
                </details>
              )}
            </div>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
