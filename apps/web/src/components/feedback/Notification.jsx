/**
 * File: apps/web/src/components/feedback/Notification.jsx
 * Yegna AI - Notification Component
 * 
 * Individual notification item for notification list.
 */

import React from 'react';
import { Bell, CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';

/**
 * Notification component
 * 
 * @param {object} props - Component props
 * @param {object} props.notification - Notification data
 * @param {string} props.notification.type - Notification type
 * @param {string} props.notification.title - Notification title
 * @param {string} props.notification.message - Notification message
 * @param {boolean} props.notification.isRead - Read state
 * @param {string} props.notification.createdAt - Creation date
 * @param {Function} props.onClick - Click handler
 */
export default function Notification({ notification, onClick }) {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      className: 'notification-success'
    },
    error: {
      icon: XCircle,
      className: 'notification-error'
    },
    warning: {
      icon: AlertCircle,
      className: 'notification-warning'
    },
    info: {
      icon: Info,
      className: 'notification-info'
    }
  };
  
  const config = typeConfig[notification.type] || typeConfig.info;
  const Icon = config.icon;
  
  return (
    <div
      className={`notification ${config.className} ${!notification.isRead ? 'notification-unread' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="notification-icon">
        <Icon size={18} />
      </div>
      
      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        <div className="notification-message">{notification.message}</div>
        {notification.createdAt && (
          <div className="notification-time">{notification.createdAt}</div>
        )}
      </div>
      
      {!notification.isRead && (
        <div className="notification-unread-dot" />
      )}
    </div>
  );
}