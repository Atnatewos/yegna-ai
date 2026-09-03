/**
 * File: apps/web/src/components/ui/Alert.jsx
 * Yegna AI - Alert Component
 * 
 * Reusable alert component for displaying messages.
 */

import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

/**
 * Alert component
 * 
 * @param {object} props - Component props
 * @param {string} props.type - Alert type ('success', 'error', 'warning', 'info')
 * @param {string} props.title - Alert title
 * @param {string} props.message - Alert message
 * @param {boolean} props.dismissible - Whether alert can be dismissed
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {string} props.className - Additional CSS classes
 */
export default function Alert({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className = ''
}) {
  const [visible, setVisible] = React.useState(true);
  
  /**
   * Handle dismiss
   */
  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };
  
  if (!visible) return null;
  
  const alertConfig = {
    success: {
      icon: CheckCircle,
      className: 'alert-success'
    },
    error: {
      icon: XCircle,
      className: 'alert-error'
    },
    warning: {
      icon: AlertCircle,
      className: 'alert-warning'
    },
    info: {
      icon: Info,
      className: 'alert-info'
    }
  };
  
  const config = alertConfig[type] || alertConfig.info;
  const Icon = config.icon;
  
  return (
    <div className={`alert ${config.className} ${className}`}>
      <div className="alert-icon">
        <Icon size={20} />
      </div>
      
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        {message && <div className="alert-message">{message}</div>}
      </div>
      
      {dismissible && (
        <button
          type="button"
          className="alert-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}