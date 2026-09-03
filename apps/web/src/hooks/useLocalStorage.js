/**
 * File: apps/web/src/hooks/useLocalStorage.js
 * Yegna AI - Local Storage Hook
 * 
 * Custom hook for managing localStorage state.
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * Local storage hook
 * Persists state to localStorage.
 * 
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {Array} [value, setValue] pair
 */
export function useLocalStorage(key, initialValue) {
  /**
   * Get initial value from localStorage or use provided default
   */
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  /**
   * Update localStorage when value changes
   */
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, value]);
  
  /**
   * Remove value from localStorage
   */
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);
  
  return [value, setValue, removeValue];
}