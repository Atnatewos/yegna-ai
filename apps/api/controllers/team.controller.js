/**
 * File: apps/api/controllers/team.controller.js
 * Yegna AI - Team Controller
 * 
 * Handles HTTP requests for team operations.
 */

const teamService = require('../services/team.service');
const commissionService = require('../services/commission.service');

/**
 * Get team statistics
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getTeamStatistics(req, res) {
  try {
    const stats = await teamService.getTeamStatistics(req.userId);
    
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get team statistics controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch team statistics'
    });
  }
}

/**
 * Get direct referrals
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getDirectReferrals(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await teamService.getDirectReferrals(req.userId, page, limit);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get direct referrals controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch direct referrals'
    });
  }
}

/**
 * Get referral tree
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getReferralTree(req, res) {
  try {
    const maxDepth = parseInt(req.query.depth) || 5;
    
    const tree = await teamService.buildReferralTree(req.userId, maxDepth);
    
    return res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    console.error('Get referral tree controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch referral tree'
    });
  }
}

/**
 * Get commission history
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getCommissionHistory(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await teamService.getCommissionHistory(req.userId, page, limit);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get commission history controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch commission history'
    });
  }
}

/**
 * Get commission summary
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getCommissionSummary(req, res) {
  try {
    const period = req.query.period || 'all';
    
    const summary = await commissionService.getCommissionSummary(req.userId, period);
    
    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get commission summary controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch commission summary'
    });
  }
}

module.exports = {
  getTeamStatistics,
  getDirectReferrals,
  getReferralTree,
  getCommissionHistory,
  getCommissionSummary
};