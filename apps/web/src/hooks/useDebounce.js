/**
 * File: apps/web/src/hooks/useDebounce.js
 * Yegna AI - Debounce Hook
 * 
 * Custom hook for debouncing values.
 */

import { useState, useEffect } from 'react';

/**
 * Debounce hook
 * Delays updating value until after delay period.
 * 
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} Debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}