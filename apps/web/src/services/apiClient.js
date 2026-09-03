/**
 * File: apps/web/src/services/apiClient.js
 * Yegna AI - API Client
 * 
 * Configures axios for making API requests to the backend.
 * Uses NEXT_PUBLIC_API_URL from environment.
 */

import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Determine API base URL
 * In development, the API runs on port 3001
 * In production, it's served from the same domain
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Create axios instance
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor - attaches auth token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('yegna_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - handles auth errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('yegna_access_token');
      Cookies.remove('yegna_refresh_token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;