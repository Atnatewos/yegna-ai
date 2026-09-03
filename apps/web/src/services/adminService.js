/**
 * File: apps/web/src/services/adminService.js
 * Yegna AI - Admin Service
 * 
 * Handles API calls for admin operations.
 */

import apiClient from './apiClient';

/**
 * Get platform statistics
 * 
 * @returns {Promise<object>} Platform statistics
 */
export async function getPlatformStats() {
  try {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get pending deposits
 * 
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Pending deposits
 */
export async function getPendingDeposits(page = 1, limit = 20) {
  try {
    const response = await apiClient.get('/admin/deposits/pending', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Approve a deposit
 * 
 * @param {string} depositId - Deposit ID
 * @param {string} notes - Review notes
 * @returns {Promise<object>} Result
 */
export async function approveDeposit(depositId, notes = '') {
  try {
    const response = await apiClient.post(`/admin/deposits/${depositId}/approve`, { notes });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Reject a deposit
 * 
 * @param {string} depositId - Deposit ID
 * @param {string} notes - Rejection notes
 * @returns {Promise<object>} Result
 */
export async function rejectDeposit(depositId, notes = '') {
  try {
    const response = await apiClient.post(`/admin/deposits/${depositId}/reject`, { notes });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get pending withdrawals
 * 
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Pending withdrawals
 */
export async function getPendingWithdrawals(page = 1, limit = 20) {
  try {
    const response = await apiClient.get('/admin/withdrawals/pending', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Process a withdrawal
 * 
 * @param {string} withdrawalId - Withdrawal ID
 * @param {string} transactionReference - Transaction reference
 * @returns {Promise<object>} Result
 */
export async function processWithdrawal(withdrawalId, transactionReference = '') {
  try {
    const response = await apiClient.post(`/admin/withdrawals/${withdrawalId}/process`, {
      transactionReference
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Reject a withdrawal
 * 
 * @param {string} withdrawalId - Withdrawal ID
 * @returns {Promise<object>} Result
 */
export async function rejectWithdrawal(withdrawalId) {
  try {
    const response = await apiClient.post(`/admin/withdrawals/${withdrawalId}/reject`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get all users
 * 
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Users list
 */
export async function getAllUsers(page = 1, limit = 20) {
  try {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get all platform settings
 * 
 * @returns {Promise<object>} Platform settings
 */
export async function getAllSettings() {
  try {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Update platform settings
 * 
 * @param {object} settingData - Setting data
 * @returns {Promise<object>} Updated setting
 */
export async function updateSettings(settingData) {
  try {
    const response = await apiClient.put('/admin/settings', settingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}