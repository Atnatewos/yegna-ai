/**
 * File: apps/web/src/hooks/useMediaQuery.js
 * Yegna AI - Media Query Hook
 * 
 * Custom hook for responsive design detection.
 */

import { useState, useEffect } from 'react';

/**
 * Media query hook
 * Detects if a media query matches the current viewport.
 * 
 * @param {string} query - CSS media query string
 * @returns {boolean} True if media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    const mediaQueryList = window.matchMedia(query);
    
    /**
     * Update state when media query changes
     */
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    
    // Set initial value
    setMatches(mediaQueryList.matches);
    
    // Listen for changes
    mediaQueryList.addEventListener('change', handleChange);
    
    // Cleanup listener
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);
  
  return matches;
}