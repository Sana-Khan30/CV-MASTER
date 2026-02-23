import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50 px-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 text-center">
            <div className="inline-flex p-4 bg-red-100 rounded-2xl text-red-600 mb-4">
              <AlertCircle size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Oops!</h1>
            <p className="text-slate-600 mb-6">Something went wrong. We're working on fixing it.</p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 p-4 bg-red-50 rounded-lg text-left text-sm text-red-700 mb-6 max-h-50 overflow-y-auto">
                <summary className="font-bold cursor-pointer">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap wrap-break-word text-xs">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.href = '/';
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl hover:bg-black transition-all font-bold"
              >
                <Home size={18} /> Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-200 transition-all font-bold"
              >
                <RefreshCw size={18} /> Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
