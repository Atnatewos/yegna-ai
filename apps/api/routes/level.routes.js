/**
 * File: apps/api/routes/level.routes.js
 * Yegna AI - Level Routes
 * 
 * Defines routes for membership level operations.
 */

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { queryOne, queryMany } = require('../utils/database');

const router = express.Router();

/**
 * GET /api/levels
 * Get all membership levels
 */
router.get(
  '/',
  authenticate,
  async (req, res) => {
    try {
      const levels = await queryMany(
        `SELECT 
           id,
           level_number,
           name,
           deposit_amount,
           tasks_per_day,
           income_per_task,
           daily_income,
           monthly_income,
           is_active
         FROM membership_levels
         WHERE is_active = true
         ORDER BY level_number ASC`
      );
      
      return res.status(200).json({
        success: true,
        data: levels
      });
    } catch (error) {
      console.error('Get levels error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch levels'
      });
    }
  }
);

/**
 * GET /api/levels/current
 * Get current user's level
 */
router.get(
  '/current',
  authenticate,
  async (req, res) => {
    try {
      const userLevel = await queryOne(
        `SELECT 
           ml.id,
           ml.level_number,
           ml.name,
           ml.deposit_amount,
           ml.tasks_per_day,
           ml.income_per_task,
           ml.daily_income,
           ml.monthly_income,
           um.activated_at
         FROM users u
         LEFT JOIN user_memberships um ON um.user_id = u.id AND um.is_active = true
         LEFT JOIN membership_levels ml ON ml.id = um.level_id
         WHERE u.id = $1`,
        [req.userId]
      );
      
      return res.status(200).json({
        success: true,
        data: userLevel || {
          level_number: 0,
          name: 'Intern',
          tasks_per_day: 5,
          income_per_task: 12,
          daily_income: 60,
          monthly_income: 180
        }
      });
    } catch (error) {
      console.error('Get current level error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch current level'
      });
    }
  }
);

module.exports = router;