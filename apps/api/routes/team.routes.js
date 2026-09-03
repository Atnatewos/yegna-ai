/**
 * File: apps/api/routes/team.routes.js
 * Yegna AI - Team Routes
 * 
 * Defines routes for team operations.
 */

const express = require('express');
const teamController = require('../controllers/team.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * GET /api/team/statistics
 * Get team statistics
 */
router.get(
  '/statistics',
  authenticate,
  teamController.getTeamStatistics
);

/**
 * GET /api/team/referrals
 * Get direct referrals
 */
router.get(
  '/referrals',
  authenticate,
  teamController.getDirectReferrals
);

/**
 * GET /api/team/tree
 * Get referral tree
 */
router.get(
  '/tree',
  authenticate,
  teamController.getReferralTree
);

/**
 * GET /api/team/commissions
 * Get commission history
 */
router.get(
  '/commissions',
  authenticate,
  teamController.getCommissionHistory
);

/**
 * GET /api/team/commission-summary
 * Get commission summary
 */
router.get(
  '/commission-summary',
  authenticate,
  teamController.getCommissionSummary
);

module.exports = router;