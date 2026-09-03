/**
 * File: apps/api/routes/wallet.routes.js
 * Yegna AI - Wallet Routes
 */
const express = require('express');
const walletController = require('../controllers/wallet.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { financialRateLimiter } = require('../middleware/rateLimit.middleware');
const { requireBody } = require('../middleware/validate.middleware');

const router = express.Router();

router.get('/balance', authenticate, walletController.getBalance);
router.get('/transactions', authenticate, walletController.getTransactions);
router.post('/deposit', authenticate, requireBody, walletController.createDeposit);

router.post(
  '/withdraw',
  authenticate,
  financialRateLimiter,
  requireBody,
  walletController.createWithdrawal
);

router.get('/payment-methods', authenticate, walletController.getPaymentMethods);
router.get('/withdrawal-settings', authenticate, walletController.getWithdrawalSettings);

module.exports = router;