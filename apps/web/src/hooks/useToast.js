/**
 * File: apps/web/src/hooks/useToast.js
 * Yegna AI - Toast Hook
 * 
 * Custom hook for displaying toast notifications.
 */

import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Toast hook
 * Provides methods for showing toast notifications.
 * 
 * @returns {object} Toast context value with showToast method
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}