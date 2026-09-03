/**
 * File: apps/web/src/components/feedback/Toast.jsx
 * Yegna AI - Toast Component
 * 
 * Individual toast notification component.
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast component
 * 
 * @param {object} props - Component props
 * @param {object} props.toast - Toast data
 * @param {string} props.toast.id - Toast ID
 * @param {string} props.toast.type - Toast type ('success', 'error', 'warning', 'info')
 * @param {string} props.toast.message - Toast message
 * @param {number} props.toast.duration - Display duration
 * @param {Function} props.onRemove - Remove handler
 */
export default function Toast({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  
  /**
   * Animate toast in on mount
   */
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 50);
    
    return () => clearTimeout(showTimer);
  }, []);
  
  /**
   * Handle close
   */
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };
  
  const toastConfig = {
    success: {
      icon: CheckCircle,
      className: 'toast-success'
    },
    error: {
      icon: XCircle,
      className: 'toast-error'
    },
    warning: {
      icon: AlertCircle,
      className: 'toast-warning'
    },
    info: {
      icon: Info,
      className: 'toast-info'
    }
  };
  
  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;
  
  return (
    <div className={`toast ${config.className} ${visible ? 'toast-visible' : 'toast-hidden'}`}>
      <div className="toast-icon">
        <Icon size={20} />
      </div>
      
      <div className="toast-content">
        <p className="toast-message">{toast.message}</p>
      </div>
      
      <button
        type="button"
        className="toast-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}