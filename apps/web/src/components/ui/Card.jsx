/**
 * File: apps/web/src/components/ui/Card.jsx
 * Yegna AI - Card Component
 * 
 * Reusable card container component.
 */

import React from 'react';

/**
 * Card component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {React.ReactNode} props.headerAction - Header action element
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.padding - Whether to apply padding
 * @param {boolean} props.hoverable - Hover effect
 * @param {object} props.props - Additional div props
 */
export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  className = '',
  padding = true,
  hoverable = false,
  ...props
}) {
  const classes = [
    'card',
    padding ? 'card-padding' : '',
    hoverable ? 'card-hoverable' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes} {...props}>
      {(title || headerAction) && (
        <div className="card-header">
          <div className="card-header-text">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="card-header-action">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}