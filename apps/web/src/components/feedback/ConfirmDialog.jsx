/**
 * File: apps/web/src/components/feedback/ConfirmDialog.jsx
 * Yegna AI - Confirm Dialog Component
 * 
 * Confirmation dialog for destructive actions.
 */

import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

/**
 * Confirm dialog component
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Dialog open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onConfirm - Confirm handler
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} props.confirmLabel - Confirm button label
 * @param {string} props.cancelLabel - Cancel button label
 * @param {boolean} props.loading - Loading state
 * @param {string} props.variant - Confirm button variant ('danger', 'primary')
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'danger'
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
    >
      <div className="confirm-dialog">
        <div className="confirm-dialog-icon">
          <AlertTriangle size={32} />
        </div>
        
        <div className="confirm-dialog-content">
          {title && <h4 className="confirm-dialog-title">{title}</h4>}
          {message && <p className="confirm-dialog-message">{message}</p>}
        </div>
        
        <div className="confirm-dialog-actions">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}