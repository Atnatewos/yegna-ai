/**
 * File: apps/api/routes/admin.routes.js
 * Yegna AI - Admin Routes
 * 
 * Defines routes for admin operations.
 */

const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');
const { requireBody } = require('../middleware/validate.middleware');

const router = express.Router();

// Apply authentication and admin authorization to all admin routes
router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/stats
 * Get platform statistics
 */
router.get(
  '/stats',
  adminController.getPlatformStats
);

/**
 * GET /api/admin/deposits/pending
 * Get pending deposits
 */
router.get(
  '/deposits/pending',
  adminController.getPendingDeposits
);

/**
 * POST /api/admin/deposits/:depositId/approve
 * Approve a deposit
 */
router.post(
  '/deposits/:depositId/approve',
  requireBody,
  adminController.approveDeposit
);

/**
 * POST /api/admin/deposits/:depositId/reject
 * Reject a deposit
 */
router.post(
  '/deposits/:depositId/reject',
  requireBody,
  adminController.rejectDeposit
);

/**
 * GET /api/admin/withdrawals/pending
 * Get pending withdrawals
 */
router.get(
  '/withdrawals/pending',
  adminController.getPendingWithdrawals
);

/**
 * POST /api/admin/withdrawals/:withdrawalId/process
 * Process a withdrawal
 */
router.post(
  '/withdrawals/:withdrawalId/process',
  requireBody,
  adminController.processWithdrawal
);

/**
 * POST /api/admin/withdrawals/:withdrawalId/reject
 * Reject a withdrawal
 */
router.post(
  '/withdrawals/:withdrawalId/reject',
  adminController.rejectWithdrawal
);

/**
 * GET /api/admin/users
 * Get all users
 */
router.get(
  '/users',
  adminController.getAllUsers
);

/**
 * GET /api/admin/settings
 * Get all platform settings
 */
router.get(
  '/settings',
  adminController.getAllSettings
);

/**
 * PUT /api/admin/settings
 * Update platform settings
 */
router.put(
  '/settings',
  requireBody,
  adminController.updateSettings
);

module.exports = router;