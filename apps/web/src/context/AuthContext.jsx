/**
 * File: apps/web/src/context/AuthContext.jsx
 * Yegna AI - Authentication Context
 */
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { getCurrentUser, logout } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.data);
          setAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, []);
  
  const handleLogin = useCallback((userData) => {
    setUser(userData);
    setAuthenticated(true);
  }, []);
  
  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    setAuthenticated(false);
  }, []);
  
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