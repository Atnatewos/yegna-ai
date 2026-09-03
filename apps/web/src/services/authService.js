/**
 * File: apps/web/src/services/authService.js
 * Yegna AI - Authentication Service
 */
import apiClient from './apiClient';

export async function register(userData) {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function login(email, password) {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function updateProfile(profileData) {
  try {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function validateReferralCode(referralCode) {
  try {
    const response = await apiClient.get(`/auth/validate-referral?referralCode=${referralCode}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return document.cookie.includes('yegna_session=active');
}