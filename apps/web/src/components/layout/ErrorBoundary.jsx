/**
 * File: apps/web/src/components/layout/ErrorBoundary.jsx
 * Yegna AI - Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 */

import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('Uncaught application error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <div className="ethiopian-flag-bar absolute top-0 left-0 w-full" />
          
          <div className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-red-200 shadow-xl p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Something Went Wrong</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                We encountered an unexpected error. Our team has been notified. Please try refreshing the page.
              </p>
            </div>
            
            <div className="pt-4">
              <button 
                onClick={this.handleReload}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Page</span>
              </button>
            </div>
          </div>
          
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;