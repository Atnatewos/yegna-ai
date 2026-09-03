/**
 * File: apps/web/src/context/AuthContext.jsx
 * Yegna AI - Authentication Context
 * 
 * Provides authentication state and methods throughout the app.
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, logout } from '../services/authService';
import Cookies from 'js-cookie';

/**
 * Create authentication context
 */
export const AuthContext = createContext(null);

/**
 * Authentication provider component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  /**
   * Fetch current user data on mount
   */
  useEffect(() => {
    async function fetchUser() {
      if (isAuthenticated()) {
        try {
          const response = await getCurrentUser();
          
          if (response.success) {
            setUser(response.data);
            setAuthenticated(true);
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          logout();
        }
      }
      
      setLoading(false);
    }
    
    fetchUser();
  }, []);
  
  /**
   * Login handler
   * 
   * @param {object} userData - User data after login
   */
  const handleLogin = useCallback((userData) => {
    setUser(userData);
    setAuthenticated(true);
  }, []);
  
  /**
   * Logout handler
   */
  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    setAuthenticated(false);
  }, []);
  
  /**
   * Update user data
   * 
   * @param {object} userData - Updated user data
   */
  const updateUser = useCallback((userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData
    }));
  }, []);
  
  const value = {
    user,
    loading,
    authenticated,
    login: handleLogin,
    logout: handleLogout,
    updateUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}