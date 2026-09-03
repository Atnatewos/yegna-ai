/**
 * File: apps/api/routes/wallet.routes.js
 * Yegna AI - Wallet Routes
 * 
 * Defines routes for wallet operations.
 */

const express = require('express');
const walletController = require('../controllers/wallet.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireBody } = require('../middleware/validate.middleware');

const router = express.Router();

/**
 * GET /api/wallet/balance
 * Get wallet balance
 */
router.get(
  '/balance',
  authenticate,
  walletController.getBalance
);

/**
 * GET /api/wallet/transactions
 * Get transaction history
 */
router.get(
  '/transactions',
  authenticate,
  walletController.getTransactions
);

/**
 * POST /api/wallet/deposit
 * Create a deposit request
 */
router.post(
  '/deposit',
  authenticate,
  requireBody,
  walletController.createDeposit
);

/**
 * POST /api/wallet/withdraw
 * Create a withdrawal request
 */
router.post(
  '/withdraw',
  authenticate,
  requireBody,
  walletController.createWithdrawal
);

/**
 * GET /api/wallet/payment-methods
 * Get available payment methods
 */
router.get(
  '/payment-methods',
  authenticate,
  walletController.getPaymentMethods
);

/**
 * GET /api/wallet/withdrawal-settings
 * Get withdrawal settings
 */
router.get(
  '/withdrawal-settings',
  authenticate,
  walletController.getWithdrawalSettings
);

module.exports = router;