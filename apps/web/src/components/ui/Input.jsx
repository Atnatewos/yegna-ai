/**
 * File: apps/web/src/components/ui/Input.jsx
 * Yegna AI - Input Component
 * 
 * Reusable input component with label and error support.
 */

import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Input component
 * 
 * @param {object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.hint - Helper text
 * @param {React.ReactNode} props.icon - Input icon
 * @param {string} props.className - Additional CSS classes
 * @param {object} props.props - Additional input props
 */
const Input = forwardRef(function Input({
  label,
  error,
  hint,
  icon,
  className = '',
  id,
  required = false,
  ...props
}, ref) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const classes = [
    'input-wrapper',
    error ? 'input-wrapper-error' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-field-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${icon ? 'input-field-with-icon' : ''} ${error ? 'input-field-error' : ''}`}
          required={required}
          {...props}
        />
      </div>
      
      {error && (
        <div className="input-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
      
      {hint && !error && (
        <div className="input-hint">{hint}</div>
      )}
    </div>
  );
});

export default Input;