/**
 * File: apps/web/src/components/ui/Tooltip.jsx
 * Yegna AI - Tooltip Component
 * 
 * Reusable tooltip component.
 */

import React, { useState, useRef, useCallback } from 'react';

/**
 * Tooltip component
 * 
 * @param {object} props - Component props
 * @param {string} props.content - Tooltip content
 * @param {string} props.position - Tooltip position ('top', 'bottom', 'left', 'right')
 * @param {React.ReactNode} props.children - Trigger element
 * @param {string} props.className - Additional CSS classes
 */
export default function Tooltip({
  content,
  position = 'top',
  children,
  className = ''
}) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef(null);
  
  /**
   * Show tooltip
   */
  const showTooltip = useCallback(() => setVisible(true), []);
  
  /**
   * Hide tooltip
   */
  const hideTooltip = useCallback(() => setVisible(false), []);
  
  const positionStyles = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-left',
    right: 'tooltip-right'
  };
  
  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      ref={tooltipRef}
    >
      {children}
      {visible && content && (
        <div className={`tooltip ${positionStyles[position] || positionStyles.top} ${className}`}>
          {content}
        </div>
      )}
    </div>
  );
}