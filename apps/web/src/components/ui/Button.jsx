/**
 * File: apps/web/src/components/ui/Button.jsx
 * Yegna AI - Button Component
 * 
 * Reusable button component with multiple variants and sizes.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button component
 * 
 * @param {object} props - Component props
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'outline', 'ghost', 'danger')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {object} props.props - Additional button props
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  /**
   * Button variant styles
   */
  const variantStyles = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    outline: 'button-outline',
    ghost: 'button-ghost',
    danger: 'button-danger'
  };
  
  /**
   * Button size styles
   */
  const sizeStyles = {
    sm: 'button-sm',
    md: 'button-md',
    lg: 'button-lg'
  };
  
  const classes = [
    'button',
    variantStyles[variant] || variantStyles.primary,
    sizeStyles[size] || sizeStyles.md,
    fullWidth ? 'button-full-width' : '',
    loading || disabled ? 'button-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="button-spinner" size={16} />
      )}
      {children}
    </button>
  );
}