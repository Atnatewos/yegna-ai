/**
 * File: apps/web/src/components/ui/ProgressBar.jsx
 * Yegna AI - Progress Bar Component
 * 
 * Reusable progress bar component.
 */

import React from 'react';

/**
 * Progress bar component
 * 
 * @param {object} props - Component props
 * @param {number} props.value - Current progress value (0-100)
 * @param {number} props.max - Maximum value
 * @param {string} props.color - Progress bar color
 * @param {boolean} props.showLabel - Show percentage label
 * @param {string} props.className - Additional CSS classes
 */
export default function ProgressBar({
  value,
  max = 100,
  color = '#4F46E5',
  showLabel = false,
  className = ''
}) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  return (
    <div className={`progress-bar-wrapper ${className}`}>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span className="progress-bar-label">{percentage}%</span>
      )}
    </div>
  );
}