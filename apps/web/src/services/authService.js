/**
 * File: apps/web/src/services/authService.js
 * Yegna AI - Authentication Service
 * 
 * Handles API calls for authentication operations.
 */

import apiClient from './apiClient';
import Cookies from 'js-cookie';

/**
 * Register a new user
 * 
 * @param {object} userData - User registration data
 * @returns {Promise<object>} Registration result
 */
export async function register(userData) {
  try {
    const response = await apiClient.post('/auth/register', userData);
    
    if (response.data?.data?.tokens) {
      storeTokens(response.data.data.tokens);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Login a user
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} Login result
 */
export async function login(email, password) {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    
    if (response.data?.data?.tokens) {
      storeTokens(response.data.data.tokens);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get current authenticated user
 * 
 * @returns {Promise<object>} User data
 */
export async function getCurrentUser() {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Update user profile
 * 
 * @param {object} profileData - Profile data to update
 * @returns {Promise<object>} Updated user data
 */
export async function updateProfile(profileData) {
  try {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Validate a referral code
 * 
 * @param {string} referralCode - Referral code to validate
 * @returns {Promise<object>} Validation result
 */
export async function validateReferralCode(referralCode) {
  try {
    const response = await apiClient.get(`/auth/validate-referral?referralCode=${referralCode}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Logout a user
 */
export function logout() {
  Cookies.remove('yegna_access_token');
  Cookies.remove('yegna_refresh_token');
  
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * Check if user is authenticated
 * 
 * @returns {boolean} True if user has access token
 */
export function isAuthenticated() {
  return !!Cookies.get('yegna_access_token');
}

/**
 * Store authentication tokens
 * 
 * @param {object} tokens - Token object
 */
function storeTokens(tokens) {
  if (tokens.accessToken) {
    Cookies.set('yegna_access_token', tokens.accessToken, { expires: 7 });
  }
  
  if (tokens.refreshToken) {
    Cookies.set('yegna_refresh_token', tokens.refreshToken, { expires: 30 });
  }
}