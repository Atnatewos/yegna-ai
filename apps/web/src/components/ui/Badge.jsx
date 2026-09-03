/**
 * File: apps/web/src/components/ui/Badge.jsx
 * Yegna AI - Badge Component
 * 
 * Reusable badge component for status and labels.
 */

import React from 'react';

/**
 * Badge component
 * 
 * @param {object} props - Component props
 * @param {string} props.variant - Badge variant ('success', 'error', 'warning', 'info', 'neutral')
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 */
export default function Badge({
  variant = 'neutral',
  children,
  className = ''
}) {
  const variantStyles = {
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    info: 'badge-info',
    neutral: 'badge-neutral'
  };
  
  const classes = [
    'badge',
    variantStyles[variant] || variantStyles.neutral,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
}