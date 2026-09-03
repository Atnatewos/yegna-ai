/**
 * File: apps/web/src/hooks/useConfig.js
 * Yegna AI - Configuration Hook
 * 
 * Custom hook for accessing platform configuration.
 */

import { useContext } from 'react';
import { ConfigContext } from '../context/ConfigContext';

/**
 * Configuration hook
 * Provides access to platform configuration values.
 * 
 * @returns {object} Configuration context value
 */
export function useConfig() {
  const context = useContext(ConfigContext);
  
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  
  return context;
}