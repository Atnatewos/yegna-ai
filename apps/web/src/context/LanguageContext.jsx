/**
 * File: apps/web/src/context/LanguageContext.jsx
 * Yegna AI - Language Context
 * 
 * Provides language management throughout the app.
 */

import React, { createContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * Create language context
 */
export const LanguageContext = createContext(null);

/**
 * Language provider component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useLocalStorage('yegna_language', 'en');
  
  /**
   * Change the current language
   * 
   * @param {string} newLanguage - New language code
   */
  const changeLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
  }, [setLanguage]);
  
  const value = useMemo(() => ({
    language,
    changeLanguage,
    isAmharic: language === 'am',
    isEnglish: language === 'en'
  }), [language, changeLanguage]);
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}