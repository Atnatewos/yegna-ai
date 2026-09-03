/**
 * File: apps/api/controllers/wallet.controller.js
 * Yegna AI - Wallet Controller
 * 
 * Handles HTTP requests for wallet operations.
 */

const walletService = require('../services/wallet.service');
const settingsService = require('../services/settings.service');
const { validators } = require('../utils/validators');

/**
 * Get wallet balance
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getBalance(req, res) {
  try {
    const wallet = await walletService.getWalletBalance(req.userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    console.error('Get balance controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet balance'
    });
  }
}

/**
 * Get transaction history
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getTransactions(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await walletService.getTransactionHistory(req.userId, page, limit);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get transactions controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
}

/**
 * Create a deposit request
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function createDeposit(req, res) {
  try {
    const validation = validators.validateDeposit(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    const deposit = await walletService.createDeposit(req.userId, req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Deposit request submitted for review',
      data: deposit
    });
  } catch (error) {
    console.error('Create deposit controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create deposit'
    });
  }
}

/**
 * Create a withdrawal request
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function createWithdrawal(req, res) {
  try {
    const withdrawalConfig = await settingsService.getWithdrawalSettings();
    const config = withdrawalConfig.withdrawal_config || {
      minimum: 100,
      maximum: 10000,
      feePercentage: 2
    };
    
    const validation = validators.validateWithdrawal(req.body, config);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    const withdrawal = await walletService.createWithdrawal(req.userId, req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted',
      data: withdrawal
    });
  } catch (error) {
    console.error('Create withdrawal controller error:', error);
    
    const statusCode = error.message.includes('Insufficient') ? 400 : 500;
    
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to create withdrawal'
    });
  }
}

/**
 * Get payment methods
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getPaymentMethods(req, res) {
  try {
    const paymentSettings = await settingsService.getPaymentSettings();
    
    return res.status(200).json({
      success: true,
      data: paymentSettings
    });
  } catch (error) {
    console.error('Get payment methods controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods'
    });
  }
}

/**
 * Get withdrawal settings
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getWithdrawalSettings(req, res) {
  try {
    const withdrawalSettings = await settingsService.getWithdrawalSettings();
    
    return res.status(200).json({
      success: true,
      data: withdrawalSettings
    });
  } catch (error) {
    console.error('Get withdrawal settings controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawal settings'
    });
  }
}

module.exports = {
  getBalance,
  getTransactions,
  createDeposit,
  createWithdrawal,
  getPaymentMethods,
  getWithdrawalSettings
};