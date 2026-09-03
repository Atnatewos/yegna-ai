/**
 * File: apps/api/controllers/admin.controller.js
 * Yegna AI - Admin Controller
 * 
 * Handles HTTP requests for admin operations.
 */

const walletService = require('../services/wallet.service');
const settingsService = require('../services/settings.service');
const taskService = require('../services/task.service');
const { queryMany, queryOne } = require('../utils/database');

/**
 * Get platform statistics
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getPlatformStats(req, res) {
  try {
    const stats = await queryOne(
      `SELECT
         (SELECT COUNT(*) FROM users) AS total_users,
         (SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE) AS new_users_today,
         (SELECT COUNT(*) FROM tasks WHERE status = 'active') AS active_tasks,
         (SELECT COUNT(*) FROM deposit_transactions WHERE status = 'pending') AS pending_deposits,
         (SELECT COUNT(*) FROM withdrawal_requests WHERE status = 'pending') AS pending_withdrawals,
         (SELECT COALESCE(SUM(amount), 0) FROM deposit_transactions WHERE status = 'approved') AS total_deposits,
         (SELECT COALESCE(SUM(net_amount), 0) FROM withdrawal_requests WHERE status = 'completed') AS total_withdrawals`
    );
    
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get platform stats controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch platform statistics'
    });
  }
}

/**
 * Get pending deposits
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getPendingDeposits(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const deposits = await queryMany(
      `SELECT 
         dt.id,
         dt.amount,
         dt.payment_method,
         dt.payment_proof_url,
         dt.status,
         dt.created_at,
         u.id AS user_id,
         u.username,
         u.full_name,
         u.email,
         ml.level_number,
         ml.name AS level_name
       FROM deposit_transactions dt
       JOIN users u ON u.id = dt.user_id
       JOIN membership_levels ml ON ml.id = dt.level_id
       WHERE dt.status = 'pending'
       ORDER BY dt.created_at ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const totalCount = await queryOne(
      `SELECT COUNT(*) AS count
       FROM deposit_transactions
       WHERE status = 'pending'`
    );
    
    return res.status(200).json({
      success: true,
      data: {
        deposits,
        pagination: {
          page,
          limit,
          total: parseInt(totalCount?.count || '0'),
          totalPages: Math.ceil(parseInt(totalCount?.count || '0') / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get pending deposits controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pending deposits'
    });
  }
}

/**
 * Approve a deposit
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function approveDeposit(req, res) {
  try {
    const { depositId } = req.params;
    const { notes } = req.body;
    
    const deposit = await walletService.approveDeposit(depositId, req.userId, notes || '');
    
    return res.status(200).json({
      success: true,
      message: 'Deposit approved successfully',
      data: deposit
    });
  } catch (error) {
    console.error('Approve deposit controller error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to approve deposit'
    });
  }
}

/**
 * Reject a deposit
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function rejectDeposit(req, res) {
  try {
    const { depositId } = req.params;
    const { notes } = req.body;
    
    const deposit = await walletService.rejectDeposit(depositId, req.userId, notes || '');
    
    return res.status(200).json({
      success: true,
      message: 'Deposit rejected',
      data: deposit
    });
  } catch (error) {
    console.error('Reject deposit controller error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to reject deposit'
    });
  }
}

/**
 * Get pending withdrawals
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getPendingWithdrawals(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const withdrawals = await queryMany(
      `SELECT 
         wr.id,
         wr.amount,
         wr.fee,
         wr.net_amount,
         wr.payment_method,
         wr.account_details,
         wr.status,
         wr.created_at,
         u.id AS user_id,
         u.username,
         u.full_name,
         u.email
       FROM withdrawal_requests wr
       JOIN users u ON u.id = wr.user_id
       WHERE wr.status = 'pending'
       ORDER BY wr.created_at ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const totalCount = await queryOne(
      `SELECT COUNT(*) AS count
       FROM withdrawal_requests
       WHERE status = 'pending'`
    );
    
    return res.status(200).json({
      success: true,
      data: {
        withdrawals,
        pagination: {
          page,
          limit,
          total: parseInt(totalCount?.count || '0'),
          totalPages: Math.ceil(parseInt(totalCount?.count || '0') / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get pending withdrawals controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pending withdrawals'
    });
  }
}

/**
 * Process a withdrawal
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function processWithdrawal(req, res) {
  try {
    const { withdrawalId } = req.params;
    const { transactionReference } = req.body;
    
    const withdrawal = await walletService.processWithdrawal(
      withdrawalId,
      req.userId,
      transactionReference || ''
    );
    
    return res.status(200).json({
      success: true,
      message: 'Withdrawal processed successfully',
      data: withdrawal
    });
  } catch (error) {
    console.error('Process withdrawal controller error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to process withdrawal'
    });
  }
}

/**
 * Reject a withdrawal
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function rejectWithdrawal(req, res) {
  try {
    const { withdrawalId } = req.params;
    
    const withdrawal = await walletService.rejectWithdrawal(withdrawalId, req.userId);
    
    return res.status(200).json({
      success: true,
      message: 'Withdrawal rejected',
      data: withdrawal
    });
  } catch (error) {
    console.error('Reject withdrawal controller error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to reject withdrawal'
    });
  }
}

/**
 * Get all users
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getAllUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const users = await queryMany(
      `SELECT 
         u.id,
         u.username,
         u.email,
         u.full_name,
         u.phone,
         u.role,
         u.referral_code,
         u.is_active,
         u.is_verified,
         u.created_at,
         ml.level_number,
         ml.name AS level_name,
         w.balance
       FROM users u
       LEFT JOIN user_memberships um ON um.user_id = u.id AND um.is_active = true
       LEFT JOIN membership_levels ml ON ml.id = um.level_id
       LEFT JOIN wallets w ON w.user_id = u.id
       ORDER BY u.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const totalCount = await queryOne(
      `SELECT COUNT(*) AS count FROM users`
    );
    
    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: parseInt(totalCount?.count || '0'),
          totalPages: Math.ceil(parseInt(totalCount?.count || '0') / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
}

/**
 * Update platform settings
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function updateSettings(req, res) {
  try {
    const { settingKey, settingValue, settingType, description } = req.body;
    
    if (!settingKey || !settingValue) {
      return res.status(400).json({
        success: false,
        message: 'Setting key and value are required'
      });
    }
    
    const updatedSetting = await settingsService.updateSetting(
      settingKey,
      settingValue,
      req.userId
    );
    
    return res.status(200).json({
      success: true,
      message: 'Setting updated successfully',
      data: updatedSetting
    });
  } catch (error) {
    console.error('Update settings controller error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update setting'
    });
  }
}

/**
 * Get all platform settings
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getAllSettings(req, res) {
  try {
    const settings = await settingsService.getAllSettings();
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get all settings controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
}

module.exports = {
  getPlatformStats,
  getPendingDeposits,
  approveDeposit,
  rejectDeposit,
  getPendingWithdrawals,
  processWithdrawal,
  rejectWithdrawal,
  getAllUsers,
  updateSettings,
  getAllSettings
};