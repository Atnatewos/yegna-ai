/**
 * File: apps/web/src/components/feedback/ToastContainer.jsx
 * Yegna AI - Toast Container Component
 * 
 * Container for displaying multiple toast notifications.
 */

import React from 'react';
import Toast from './Toast';

/**
 * Toast container component
 * 
 * @param {object} props - Component props
 * @param {Array} props.toasts - Array of toast objects
 * @param {Function} props.onRemove - Remove handler
 * @param {string} props.position - Container position ('top-right', 'top-left', 'bottom-right', 'bottom-left')
 */
export default function ToastContainer({
  toasts,
  onRemove,
  position = 'top-right'
}) {
  if (!toasts || toasts.length === 0) return null;
  
  const positionStyles = {
    'top-right': 'toast-container-top-right',
    'top-left': 'toast-container-top-left',
    'bottom-right': 'toast-container-bottom-right',
    'bottom-left': 'toast-container-bottom-left'
  };
  
  return (
    <div className={`toast-container ${positionStyles[position] || positionStyles['top-right']}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}