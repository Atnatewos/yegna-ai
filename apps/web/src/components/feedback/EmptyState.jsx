/**
 * File: apps/web/src/components/feedback/EmptyState.jsx
 * Yegna AI - Empty State Component
 * 
 * Displayed when no data is available.
 */

import React from 'react';
import { Inbox } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Empty state component
 * 
 * @param {object} props - Component props
 * @param {string} props.title - Empty state title
 * @param {string} props.description - Empty state description
 * @param {string} props.actionLabel - Action button label
 * @param {Function} props.onAction - Action button handler
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {string} props.className - Additional CSS classes
 */
export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = ''
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">
        {icon || <Inbox size={48} />}
      </div>
      
      {title && <h4 className="empty-state-title">{title}</h4>}
      {description && <p className="empty-state-description">{description}</p>}
      
      {actionLabel && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}