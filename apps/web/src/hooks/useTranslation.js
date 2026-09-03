/**
 * File: apps/web/src/hooks/useTranslation.js
 * Yegna AI - Translation Hook
 * 
 * Custom hook for translation functionality.
 */

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback } from 'react';

/**
 * Translation hook
 * Provides translation function and language management.
 * 
 * @param {string} namespace - Translation namespace
 * @returns {object} Translation utilities
 */
export function useTranslation(namespace = 'common') {
  const { t, i18n } = useI18nTranslation(namespace);
  
  /**
   * Change the current language
   * 
   * @param {string} language - Language code ('en' or 'am')
   */
  const changeLanguage = useCallback((language) => {
    i18n.changeLanguage(language);
    
    // Store language preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('yegna_language', language);
    }
  }, [i18n]);
  
  /**
   * Get current language
   * 
   * @returns {string} Current language code
   */
  const getCurrentLanguage = useCallback(() => {
    return i18n.language || 'en';
  }, [i18n.language]);
  
  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage
  };
}