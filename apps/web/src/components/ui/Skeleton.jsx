/**
 * File: apps/web/src/components/ui/Skeleton.jsx
 * Yegna AI - Skeleton Component
 * 
 * Loading skeleton placeholder component.
 */

import React from 'react';

/**
 * Skeleton component
 * 
 * @param {object} props - Component props
 * @param {string} props.variant - Skeleton variant ('text', 'circular', 'rectangular')
 * @param {number} props.width - Skeleton width
 * @param {number} props.height - Skeleton height
 * @param {string} props.className - Additional CSS classes
 */
export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = ''
}) {
  const variantStyles = {
    text: 'skeleton-text',
    circular: 'skeleton-circular',
    rectangular: 'skeleton-rectangular'
  };
  
  const style = {
    width: width || undefined,
    height: height || undefined
  };
  
  return (
    <div
      className={`skeleton ${variantStyles[variant] || variantStyles.text} ${className}`}
      style={style}
    />
  );
}