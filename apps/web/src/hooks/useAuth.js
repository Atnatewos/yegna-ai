/**
 * File: apps/web/src/hooks/useAuth.js
 * Yegna AI - Authentication Hook
 * 
 * Custom hook for managing authentication state.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Authentication hook
 * Provides access to authentication state and methods.
 * 
 * @returns {object} Authentication context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}