/**
 * File: apps/web/src/components/ui/Modal.jsx
 * Yegna AI - Modal Component
 * 
 * Reusable modal dialog component.
 */

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * Modal component
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer
 * @param {string} props.size - Modal size ('sm', 'md', 'lg', 'xl')
 * @param {boolean} props.closeOnOverlayClick - Close when overlay clicked
 * @param {string} props.className - Additional CSS classes
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  className = ''
}) {
  /**
   * Handle escape key press
   */
  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  
  /**
   * Add/remove escape key listener
   */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleEscapeKey]);
  
  /**
   * Handle overlay click
   */
  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  const sizeStyles = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal ${sizeStyles[size] || sizeStyles.md} ${className}`}>
        <div className="modal-header">
          {title && <h3 className="modal-title">{title}</h3>}
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}