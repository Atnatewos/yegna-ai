/**
 * File: apps/api/services/commission.service.js
 * Yegna AI - Commission Service
 * 
 * Handles commission calculations and distribution.
 * Ensures atomic execution of multi-step financial operations
 * using database transactions to maintain data integrity.
 */

const { queryOne, queryMany, insertOne, transaction } = require('../utils/database');
const settingsService = require('./settings.service');

/**
 * Process direct referral commission
 * 
 * @param {string} referrerId - Referrer user ID
 * @param {string} newUserId - New user ID
 * @param {number} depositAmount - Deposit amount
 * @returns {Promise<object|null>} Commission transaction or null
 */
async function processDirectReferralCommission(referrerId, newUserId, depositAmount) {
  if (!referrerId || depositAmount <= 0) return null;
  
  const commissionSettings = await settingsService.getCommissionSettings();
  const directCommission = commissionSettings.direct_referral_commission || {
    enabled: true,
    percentage: 10,
    minimumLevel: 1
  };
  
  if (!directCommission.enabled) return null;
  
  const referrer = await queryOne(
    `SELECT 
       u.id,
       um.level_id,
       ml.level_number
     FROM users u
     LEFT JOIN user_memberships um ON um.user_id = u.id AND um.is_active = true
     LEFT JOIN membership_levels ml ON ml.id = um.level_id
     WHERE u.id = $1`,
    [referrerId]
  );
  
  if (!referrer || !referrer.level_number || referrer.level_number < directCommission.minimumLevel) {
    return null;
  }
  
  const commissionAmount = (depositAmount * directCommission.percentage) / 100;
  
  return await transaction(async (client) => {
    const commission = await client.query(
      `INSERT INTO commission_transactions (
         user_id,
         from_user_id,
         commission_type,
         amount,
         level,
         metadata
       ) VALUES ($1, $2, 'direct_referral', $3, 1, $4)
       RETURNING *`,
      [
        referrerId,
        newUserId,
        commissionAmount,
        JSON.stringify({ depositAmount, percentage: directCommission.percentage })
      ]
    );
    
    await client.query(
      `UPDATE wallets
       SET balance = balance + $1,
           total_earned = total_earned + $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [commissionAmount, referrerId]
    );
    
    return commission.rows[0];
  });
}

/**
 * Process team task commission
 * 
 * @param {string} userId - User who completed the task
 * @param {number} taskReward - Task reward amount
 * @returns {Promise<Array>} Array of commission transactions
 */
async function processTeamTaskCommission(userId, taskReward) {
  if (taskReward <= 0) return [];
  
  const commissionSettings = await settingsService.getCommissionSettings();
  const teamLevels = commissionSettings.team_level_commissions || [
    { level: 1, percentage: 10 },
    { level: 2, percentage: 5 },
    { level: 3, percentage: 3 },
    { level: 4, percentage: 2 },
    { level: 5, percentage: 1 }
  ];
  
  const uplineMembers = await queryMany(
    `SELECT 
       rt.referrer_id AS user_id,
       rt.level
     FROM referral_tree rt
     WHERE rt.user_id = $1
     ORDER BY rt.level ASC`,
    [userId]
  );
  
  const commissions = [];
  
  return await transaction(async (client) => {
    for (const upline of uplineMembers) {
      const commissionConfig = teamLevels.find((tl) => tl.level === upline.level);
      
      if (!commissionConfig || commissionConfig.percentage <= 0) continue;
      
      const commissionAmount = (taskReward * commissionConfig.percentage) / 100;
      
      const commission = await client.query(
        `INSERT INTO commission_transactions (
           user_id,
           from_user_id,
           commission_type,
           amount,
           level,
           metadata
         ) VALUES ($1, $2, 'team_task', $3, $4, $5)
         RETURNING *`,
        [
          upline.user_id,
          userId,
          commissionAmount,
          upline.level,
          JSON.stringify({ taskReward, percentage: commissionConfig.percentage })
        ]
      );
      
      await client.query(
        `UPDATE wallets
         SET balance = balance + $1,
             total_earned = total_earned + $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2`,
        [commissionAmount, upline.user_id]
      );
      
      const today = new Date().toISOString().split('T')[0];
      
      await client.query(
        `INSERT INTO daily_earnings (user_id, task_date, team_commission, total_earned)
         VALUES ($1, $2, $3, $3)
         ON CONFLICT (user_id, task_date)
         DO UPDATE SET
           team_commission = daily_earnings.team_commission + $3,
           total_earned = daily_earnings.total_earned + $3,
           updated_at = CURRENT_TIMESTAMP`,
        [upline.user_id, today, commissionAmount]
      );
      
      commissions.push(commission.rows[0]);
    }
    
    return commissions;
  });
}

/**
 * Get commission summary for a user
 * 
 * @param {string} userId - User ID
 * @param {string} period - Period ('today', 'week', 'month', 'all')
 * @returns {Promise<object>} Commission summary
 */
async function getCommissionSummary(userId, period = 'all') {
  let dateCondition = '';
  const params = [userId];
  
  switch (period) {
    case 'today':
      dateCondition = 'AND created_at >= CURRENT_DATE';
      break;
    case 'week':
      dateCondition = 'AND created_at >= CURRENT_DATE - INTERVAL \'7 days\'';
      break;
    case 'month':
      dateCondition = 'AND created_at >= CURRENT_DATE - INTERVAL \'30 days\'';
      break;
    case 'all':
    default:
      dateCondition = '';
      break;
  }
  
  const summary = await queryOne(
    `SELECT
       COALESCE(SUM(CASE WHEN commission_type = 'direct_referral' THEN amount ELSE 0 END), 0) AS direct_referral_total,
       COALESCE(SUM(CASE WHEN commission_type = 'team_task' THEN amount ELSE 0 END), 0) AS team_task_total,
       COALESCE(SUM(CASE WHEN commission_type = 'level_bonus' THEN amount ELSE 0 END), 0) AS level_bonus_total,
       COALESCE(SUM(amount), 0) AS total_commission,
       COUNT(*) AS total_transactions
     FROM commission_transactions
     WHERE user_id = $1
       ${dateCondition}`,
    params
  );
  
  return summary || {
    direct_referral_total: 0,
    team_task_total: 0,
    level_bonus_total: 0,
    total_commission: 0,
    total_transactions: 0
  };
}

module.exports = {
  processDirectReferralCommission,
  processTeamTaskCommission,
  getCommissionSummary
};