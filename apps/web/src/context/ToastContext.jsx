/**
 * File: apps/web/src/context/ToastContext.jsx
 * Yegna AI - Toast Context
 * 
 * Provides toast notification functionality throughout the app.
 */

import React, { createContext, useState, useCallback, useMemo } from 'react';
import ToastContainer from '../components/feedback/ToastContainer';

/**
 * Create toast context
 */
export const ToastContext = createContext(null);

/**
 * Toast provider component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  
  /**
   * Remove a toast by ID
   * 
   * @param {string} toastId - Toast ID to remove
   */
  const removeToast = useCallback((toastId) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
  }, []);
  
  /**
   * Show a toast notification
   * 
   * @param {object} toastData - Toast data
   * @param {string} toastData.type - Toast type ('success', 'error', 'warning', 'info')
   * @param {string} toastData.message - Toast message
   * @param {number} toastData.duration - Display duration in milliseconds
   */
  const showToast = useCallback((toastData) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const toast = {
      id,
      type: toastData.type || 'info',
      message: toastData.message || '',
      duration: toastData.duration || 5000
    };
    
    setToasts((prevToasts) => [...prevToasts, toast]);
    
    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);
  }, [removeToast]);
  
  /**
   * Show success toast
   */
  const showSuccessToast = useCallback((message, duration) => {
    showToast({ type: 'success', message, duration });
  }, [showToast]);
  
  /**
   * Show error toast
   */
  const showErrorToast = useCallback((message, duration) => {
    showToast({ type: 'error', message, duration });
  }, [showToast]);
  
  /**
   * Show warning toast
   */
  const showWarningToast = useCallback((message, duration) => {
    showToast({ type: 'warning', message, duration });
  }, [showToast]);
  
  /**
   * Show info toast
   */
  const showInfoToast = useCallback((message, duration) => {
    showToast({ type: 'info', message, duration });
  }, [showToast]);
  
  const value = useMemo(() => ({
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast
  }), [showToast, showSuccessToast, showErrorToast, showWarningToast, showInfoToast]);
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}