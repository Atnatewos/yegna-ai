/**
 * File: apps/web/src/services/walletService.js
 * Yegna AI - Wallet Service
 * 
 * Handles API calls for wallet operations.
 */

import apiClient from './apiClient';

/**
 * Get wallet balance
 * 
 * @returns {Promise<object>} Wallet data
 */
export async function getBalance() {
  try {
    const response = await apiClient.get('/wallet/balance');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get transaction history
 * 
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Transactions result
 */
export async function getTransactions(page = 1, limit = 10) {
  try {
    const response = await apiClient.get('/wallet/transactions', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Create a deposit request
 * 
 * @param {object} depositData - Deposit data
 * @returns {Promise<object>} Deposit result
 */
export async function createDeposit(depositData) {
  try {
    const response = await apiClient.post('/wallet/deposit', depositData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Create a withdrawal request
 * 
 * @param {object} withdrawalData - Withdrawal data
 * @returns {Promise<object>} Withdrawal result
 */
export async function createWithdrawal(withdrawalData) {
  try {
    const response = await apiClient.post('/wallet/withdraw', withdrawalData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get payment methods
 * 
 * @returns {Promise<object>} Payment methods
 */
export async function getPaymentMethods() {
  try {
    const response = await apiClient.get('/wallet/payment-methods');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get withdrawal settings
 * 
 * @returns {Promise<object>} Withdrawal settings
 */
export async function getWithdrawalSettings() {
  try {
    const response = await apiClient.get('/wallet/withdrawal-settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}