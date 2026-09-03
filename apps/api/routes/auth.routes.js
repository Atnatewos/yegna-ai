/**
 * File: apps/api/routes/auth.routes.js
 * Yegna AI - Authentication Routes
 * 
 * Defines routes for authentication operations.
 */

const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authRateLimiter } = require('../middleware/rateLimit.middleware');
const { requireBody } = require('../middleware/validate.middleware');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  authRateLimiter,
  requireBody,
  authController.register
);

/**
 * POST /api/auth/login
 * Login a user
 */
router.post(
  '/login',
  authRateLimiter,
  requireBody,
  authController.login
);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get(
  '/me',
  authenticate,
  authController.getCurrentUser
);

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put(
  '/profile',
  authenticate,
  requireBody,
  authController.updateProfile
);

/**
 * GET /api/auth/validate-referral
 * Validate a referral code
 */
router.get(
  '/validate-referral',
  authController.validateReferralCode
);

module.exports = router;