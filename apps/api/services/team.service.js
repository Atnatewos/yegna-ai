/**
 * File: apps/api/services/team.service.js
 * Yegna AI - Team Service
 * 
 * Handles team management and referral tree operations.
 */

const { queryOne, queryMany, insertOne } = require('../utils/database');

/**
 * Build referral tree for a user
 * 
 * @param {string} userId - User ID
 * @param {number} maxDepth - Maximum tree depth
 * @returns {Promise<Array>} Referral tree nodes
 */
async function buildReferralTree(userId, maxDepth = 5) {
  const tree = [];
  
  async function buildLevel(currentUserId, currentDepth, parentId = null) {
    if (currentDepth > maxDepth) return;
    
    const level = currentDepth;
    
    const directReferrals = await queryMany(
      `SELECT 
         u.id,
         u.username,
         u.full_name,
         u.profile_image_url,
         um.level_id,
         ml.level_number,
         u.is_active,
         u.created_at
       FROM users u
       LEFT JOIN user_memberships um ON um.user_id = u.id AND um.is_active = true
       LEFT JOIN membership_levels ml ON ml.id = um.level_id
       WHERE u.referrer_id = $1
       ORDER BY u.created_at DESC`,
      [currentUserId]
    );
    
    for (const referral of directReferrals) {
      const node = {
        id: referral.id,
        username: referral.username,
        fullName: referral.full_name,
        profileImageUrl: referral.profile_image_url,
        levelNumber: referral.level_number || 0,
        isActive: referral.is_active,
        createdAt: referral.created_at,
        level: level,
        parentId: parentId,
        children: []
      };
      
      tree.push(node);
      
      if (currentDepth < maxDepth) {
        await buildLevel(referral.id, currentDepth + 1, referral.id);
      }
    }
  }
  
  await buildLevel(userId, 1);
  
  return tree;
}

/**
 * Get direct referrals for a user
 * 
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Direct referrals with pagination
 */
async function getDirectReferrals(userId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  const referrals = await queryMany(
    `SELECT 
       u.id,
       u.username,
       u.full_name,
       u.profile_image_url,
       u.is_active,
       u.created_at,
       ml.level_number,
       ml.name AS level_name,
       COALESCE(
         (SELECT SUM(ct.amount)
          FROM commission_transactions ct
          WHERE ct.user_id = $1
            AND ct.from_user_id = u.id
            AND ct.commission_type = 'direct_referral'),
         0
       ) AS total_commission_earned
     FROM users u
     LEFT JOIN user_memberships um ON um.user_id = u.id AND um.is_active = true
     LEFT JOIN membership_levels ml ON ml.id = um.level_id
     WHERE u.referrer_id = $1
     ORDER BY u.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  
  const totalCount = await queryOne(
    `SELECT COUNT(*) AS count
     FROM users
     WHERE referrer_id = $1`,
    [userId]
  );
  
  return {
    referrals,
    pagination: {
      page,
      limit,
      total: parseInt(totalCount?.count || '0'),
      totalPages: Math.ceil(parseInt(totalCount?.count || '0') / limit)
    }
  };
}

/**
 * Get team statistics for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<object>} Team statistics
 */
async function getTeamStatistics(userId) {
  const stats = await queryOne(
    `SELECT
       COUNT(DISTINCT rt.user_id) AS total_team_members,
       COUNT(DISTINCT CASE WHEN rt.level = 1 THEN rt.user_id END) AS direct_referrals,
       COUNT(DISTINCT CASE WHEN rt.level = 2 THEN rt.user_id END) AS level2_members,
       COUNT(DISTINCT CASE WHEN rt.level = 3 THEN rt.user_id END) AS level3_members,
       COUNT(DISTINCT CASE WHEN rt.level = 4 THEN rt.user_id END) AS level4_members,
       COUNT(DISTINCT CASE WHEN rt.level = 5 THEN rt.user_id END) AS level5_members,
       COALESCE(SUM(ct.amount), 0) AS total_commission_earned
     FROM referral_tree rt
     LEFT JOIN commission_transactions ct ON ct.user_id = rt.referrer_id
       AND ct.from_user_id = rt.user_id
     WHERE rt.referrer_id = $1`,
    [userId]
  );
  
  return stats || {
    total_team_members: 0,
    direct_referrals: 0,
    level2_members: 0,
    level3_members: 0,
    level4_members: 0,
    level5_members: 0,
    total_commission_earned: 0
  };
}

/**
 * Get commission history for a user
 * 
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Commissions with pagination
 */
async function getCommissionHistory(userId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  const commissions = await queryMany(
    `SELECT 
       ct.id,
       ct.commission_type,
       ct.amount,
       ct.level,
       ct.created_at,
       u.username AS from_username,
       u.full_name AS from_full_name
     FROM commission_transactions ct
     JOIN users u ON u.id = ct.from_user_id
     WHERE ct.user_id = $1
     ORDER BY ct.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  
  const totalCount = await queryOne(
    `SELECT COUNT(*) AS count
     FROM commission_transactions
     WHERE user_id = $1`,
    [userId]
  );
  
  return {
    commissions,
    pagination: {
      page,
      limit,
      total: parseInt(totalCount?.count || '0'),
      totalPages: Math.ceil(parseInt(totalCount?.count || '0') / limit)
    }
  };
}

/**
 * Update referral tree when a new user registers
 * 
 * @param {string} newUserId - New user ID
 * @param {string} referrerId - Referrer user ID
 * @returns {Promise<void>}
 */
async function updateReferralTree(newUserId, referrerId) {
  if (!referrerId) return;
  
  // Get all ancestors of the referrer (up to 5 levels)
  const ancestors = await queryMany(
    `WITH RECURSIVE ancestor_tree AS (
       SELECT 
         referrer_id,
         1 AS level
       FROM users
       WHERE id = $1
         AND referrer_id IS NOT NULL
       
       UNION ALL
       
       SELECT 
         u.referrer_id,
         at.level + 1
       FROM users u
       JOIN ancestor_tree at ON u.id = at.referrer_id
       WHERE at.level < 5
         AND u.referrer_id IS NOT NULL
     )
     SELECT referrer_id, level
     FROM ancestor_tree`,
    [referrerId]
  );
  
  // Insert direct referral relationship
  await insertOne(
    `INSERT INTO referral_tree (user_id, referrer_id, level)
     VALUES ($1, $2, 1)
     ON CONFLICT (user_id, referrer_id, level) DO NOTHING`,
    [newUserId, referrerId]
  );
  
  // Insert ancestor relationships
  for (const ancestor of ancestors) {
    await insertOne(
      `INSERT INTO referral_tree (user_id, referrer_id, level)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, referrer_id, level) DO NOTHING`,
      [newUserId, ancestor.referrer_id, ancestor.level + 1]
    );
  }
}

module.exports = {
  buildReferralTree,
  getDirectReferrals,
  getTeamStatistics,
  getCommissionHistory,
  updateReferralTree
};