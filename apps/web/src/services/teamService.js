/**
 * File: apps/web/src/services/teamService.js
 * Yegna AI - Team Service
 * 
 * Handles API calls for team operations.
 */

import apiClient from './apiClient';

/**
 * Get team statistics
 * 
 * @returns {Promise<object>} Team statistics
 */
export async function getTeamStatistics() {
  try {
    const response = await apiClient.get('/team/statistics');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get direct referrals
 * 
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Referrals result
 */
export async function getDirectReferrals(page = 1, limit = 10) {
  try {
    const response = await apiClient.get('/team/referrals', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get referral tree
 * 
 * @param {number} depth - Tree depth
 * @returns {Promise<object>} Referral tree
 */
export async function getReferralTree(depth = 5) {
  try {
    const response = await apiClient.get('/team/tree', {
      params: { depth }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get commission history
 * 
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Commissions result
 */
export async function getCommissionHistory(page = 1, limit = 10) {
  try {
    const response = await apiClient.get('/team/commissions', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get commission summary
 * 
 * @param {string} period - Period ('today', 'week', 'month', 'all')
 * @returns {Promise<object>} Commission summary
 */
export async function getCommissionSummary(period = 'all') {
  try {
    const response = await apiClient.get('/team/commission-summary', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}