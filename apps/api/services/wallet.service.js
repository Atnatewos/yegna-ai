/**
 * File: apps/api/services/wallet.service.js
 * Yegna AI - Wallet Service
 * 
 * Handles wallet operations including balance, deposits, and withdrawals.
 * Implements strict row-level locking (FOR UPDATE) to prevent race conditions
 * and double-spending vulnerabilities during concurrent financial mutations.
 */

const { queryOne, queryMany, insertOne, update, transaction } = require('../utils/database');
const settingsService = require('./settings.service');

/**
 * Get wallet balance for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<object>} Wallet object
 */
async function getWalletBalance(userId) {
  const wallet = await queryOne(
    `SELECT 
       id,
       user_id,
       balance,
       total_earned,
       total_withdrawn,
       updated_at
     FROM wallets
     WHERE user_id = $1`,
    [userId]
  );
  
  return wallet;
}

/**
 * Get transaction history for a user
 * 
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Transactions with pagination
 */
async function getTransactionHistory(userId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  const transactions = await queryMany(
    `SELECT 
       id,
       type,
       amount,
       description,
       metadata,
       created_at
     FROM (
       SELECT 
         id,
         'deposit' AS type,
         amount,
         'Deposit' AS description,
         jsonb_build_object('status', status) AS metadata,
         created_at
       FROM deposit_transactions
       WHERE user_id = $1
       
       UNION ALL
       
       SELECT 
         id,
         'withdrawal' AS type,
         net_amount AS amount,
         'Withdrawal' AS description,
         jsonb_build_object('status', status) AS metadata,
         created_at
       FROM withdrawal_requests
       WHERE user_id = $1
       
       UNION ALL
       
       SELECT 
         id,
         'commission' AS type,
         amount,
         'Commission' AS description,
         metadata,
         created_at
       FROM commission_transactions
       WHERE user_id = $1
       
       UNION ALL
       
       SELECT 
         id,
         'earning' AS type,
         reward_amount AS amount,
         'Task Earning' AS description,
         jsonb_build_object('status', status) AS metadata,
         submitted_at AS created_at
       FROM task_submissions
       WHERE user_id = $1
         AND status = 'approved'
     ) AS combined_transactions
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  
  const totalCount = await queryOne(
    `SELECT COUNT(*) AS count FROM (
       SELECT id FROM deposit_transactions WHERE user_id = $1
       UNION ALL
       SELECT id FROM withdrawal_requests WHERE user_id = $1
       UNION ALL
       SELECT id FROM commission_transactions WHERE user_id = $1
       UNION ALL
       SELECT id FROM task_submissions WHERE user_id = $1 AND status = 'approved'
     ) AS total_transactions`,
    [userId]
  );
  
  return {
    transactions,
    pagination: {
      page,
      limit,
      total: parseInt(totalCount?.count || '0'),
      totalPages: Math.ceil(parseInt(totalCount?.count || '0') / limit)
    }
  };
}

/**
 * Create a deposit request
 * 
 * @param {string} userId - User ID
 * @param {object} depositData - Deposit data
 * @returns {Promise<object>} Created deposit transaction
 */
async function createDeposit(userId, depositData) {
  const { levelId, amount, paymentMethod, paymentProofUrl } = depositData;
  
  const deposit = await insertOne(
    `INSERT INTO deposit_transactions (
       user_id,
       level_id,
       amount,
       payment_method,
       payment_proof_url,
       status
     ) VALUES ($1, $2, $3, $4, $5, 'pending')
     RETURNING *`,
    [userId, levelId, amount, paymentMethod, paymentProofUrl]
  );
  
  return deposit;
}

/**
 * Approve a deposit transaction
 * 
 * @param {string} depositId - Deposit transaction ID
 * @param {string} adminId - Admin user ID
 * @param {string} notes - Review notes
 * @returns {Promise<object>} Updated deposit
 */
async function approveDeposit(depositId, adminId, notes = '') {
  return await transaction(async (client) => {
    // Acquire exclusive row lock to prevent concurrent approval of the same deposit
    const deposit = await client.query(
      `SELECT * FROM deposit_transactions
       WHERE id = $1
         AND status = 'pending'
       FOR UPDATE`,
      [depositId]
    );
    
    if (!deposit.rows[0]) {
      throw new Error('Deposit not found or already processed');
    }
    
    const updatedDeposit = await client.query(
      `UPDATE deposit_transactions
       SET status = 'approved',
           reviewed_by = $1,
           review_notes = $2,
           reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [adminId, notes, depositId]
    );
    
    await client.query(
      `UPDATE wallets
       SET balance = balance + $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [deposit.rows[0].amount, deposit.rows[0].user_id]
    );
    
    await client.query(
      `INSERT INTO user_memberships (user_id, level_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         level_id = $2,
         is_active = true,
         activated_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP`,
      [deposit.rows[0].user_id, deposit.rows[0].level_id]
    );
    
    return updatedDeposit.rows[0];
  });
}

/**
 * Reject a deposit transaction
 * 
 * @param {string} depositId - Deposit transaction ID
 * @param {string} adminId - Admin user ID
 * @param {string} notes - Rejection notes
 * @returns {Promise<object>} Updated deposit
 */
async function rejectDeposit(depositId, adminId, notes = '') {
  const deposit = await queryOne(
    `UPDATE deposit_transactions
     SET status = 'rejected',
         reviewed_by = $1,
         review_notes = $2,
         reviewed_at = CURRENT_TIMESTAMP
     WHERE id = $3
       AND status = 'pending'
     RETURNING *`,
    [adminId, notes, depositId]
  );
  
  if (!deposit) {
    throw new Error('Deposit not found or already processed');
  }
  
  return deposit;
}

/**
 * Create a withdrawal request
 * 
 * @param {string} userId - User ID
 * @param {object} withdrawalData - Withdrawal data
 * @returns {Promise<object>} Created withdrawal request
 */
async function createWithdrawal(userId, withdrawalData) {
  const { amount, paymentMethod, accountDetails } = withdrawalData;
  
  const withdrawalConfig = await settingsService.getWithdrawalSettings();
  const config = withdrawalConfig.withdrawal_config || {
    minimum: 100,
    maximum: 10000,
    feePercentage: 2
  };
  
  if (amount < config.minimum) {
    throw new Error(`Minimum withdrawal amount is ${config.minimum} ETB`);
  }
  
  if (amount > config.maximum) {
    throw new Error(`Maximum withdrawal amount is ${config.maximum} ETB`);
  }
  
  const fee = (amount * config.feePercentage) / 100;
  const netAmount = amount - fee;
  
  return await transaction(async (client) => {
    // CRITICAL: Acquire exclusive row lock on wallet to prevent double-spending race conditions
    const wallet = await client.query(
      `SELECT balance FROM wallets
       WHERE user_id = $1
       FOR UPDATE`,
      [userId]
    );
    
    if (!wallet.rows[0] || wallet.rows[0].balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    await client.query(
      `UPDATE wallets
       SET balance = balance - $1,
           total_withdrawn = total_withdrawn + $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3`,
      [amount, amount, userId]
    );
    
    const withdrawal = await client.query(
      `INSERT INTO withdrawal_requests (
         user_id,
         amount,
         fee,
         net_amount,
         payment_method,
         account_details,
         status
       ) VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [userId, amount, fee, netAmount, paymentMethod, JSON.stringify(accountDetails)]
    );
    
    return withdrawal.rows[0];
  });
}

/**
 * Process a withdrawal request
 * 
 * @param {string} withdrawalId - Withdrawal request ID
 * @param {string} adminId - Admin user ID
 * @param {string} transactionReference - Payment reference
 * @returns {Promise<object>} Updated withdrawal
 */
async function processWithdrawal(withdrawalId, adminId, transactionReference = '') {
  const withdrawal = await queryOne(
    `UPDATE withdrawal_requests
     SET status = 'completed',
         processed_by = $1,
         transaction_reference = $2,
         processed_at = CURRENT_TIMESTAMP
     WHERE id = $3
       AND status = 'pending'
     RETURNING *`,
    [adminId, transactionReference, withdrawalId]
  );
  
  if (!withdrawal) {
    throw new Error('Withdrawal not found or already processed');
  }
  
  return withdrawal;
}

/**
 * Reject a withdrawal request
 * 
 * @param {string} withdrawalId - Withdrawal request ID
 * @param {string} adminId - Admin user ID
 * @returns {Promise<object>} Updated withdrawal
 */
async function rejectWithdrawal(withdrawalId, adminId) {
  return await transaction(async (client) => {
    // Acquire exclusive row lock to prevent concurrent rejection/processing
    const withdrawal = await client.query(
      `SELECT * FROM withdrawal_requests
       WHERE id = $1
         AND status = 'pending'
       FOR UPDATE`,
      [withdrawalId]
    );
    
    if (!withdrawal.rows[0]) {
      throw new Error('Withdrawal not found or already processed');
    }
    
    // Refund wallet atomically
    await client.query(
      `UPDATE wallets
       SET balance = balance + $1,
           total_withdrawn = total_withdrawn - $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [withdrawal.rows[0].amount, withdrawal.rows[0].user_id]
    );
    
    const updatedWithdrawal = await client.query(
      `UPDATE withdrawal_requests
       SET status = 'rejected',
           processed_by = $1,
           processed_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [adminId, withdrawalId]
    );
    
    return updatedWithdrawal.rows[0];
  });
}

module.exports = {
  getWalletBalance,
  getTransactionHistory,
  createDeposit,
  approveDeposit,
  rejectDeposit,
  createWithdrawal,
  processWithdrawal,
  rejectWithdrawal
};