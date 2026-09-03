/**
 * File: apps/api/controllers/task.controller.js
 * Yegna AI - Task Controller
 * 
 * Handles HTTP requests for task operations.
 */

const taskService = require('../services/task.service');
const commissionService = require('../services/commission.service');
const { validators } = require('../utils/validators');
const { queryOne } = require('../utils/database');

/**
 * Get available tasks
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getTasks(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Get user's level
    const userLevel = await queryOne(
      `SELECT COALESCE(ml.level_number, 0) AS level_number
       FROM users u
       LEFT JOIN user_memberships um ON um.user_id = u.id AND um.is_active = true
       LEFT JOIN membership_levels ml ON ml.id = um.level_id
       WHERE u.id = $1`,
      [req.userId]
    );
    
    const result = await taskService.getAvailableTasks(
      req.userId,
      userLevel?.level_number || 0,
      page,
      limit
    );
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get tasks controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
}

/**
 * Get task by ID
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getTaskById(req, res) {
  try {
    const { taskId } = req.params;
    
    const task = await taskService.getTaskById(taskId, req.userId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task by ID controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch task'
    });
  }
}

/**
 * Submit a task
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function submitTask(req, res) {
  try {
    const { taskId, content, attachments } = req.body;
    
    const validation = validators.validateTaskSubmission(
      { taskId, content, attachments },
      req.body.taskType || 'text'
    );
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    const submission = await taskService.submitTask(req.userId, {
      taskId,
      content,
      attachments
    });
    
    return res.status(201).json({
      success: true,
      message: 'Task submitted successfully',
      data: submission
    });
  } catch (error) {
    console.error('Submit task controller error:', error);
    
    const statusCode = error.message.includes('already') ? 409 : 400;
    
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to submit task'
    });
  }
}

/**
 * Get user's task history
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getTaskHistory(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await taskService.getUserTaskHistory(req.userId, page, limit);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get task history controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch task history'
    });
  }
}

/**
 * Get today's progress
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getTodayProgress(req, res) {
  try {
    const progress = await taskService.getTodayProgress(req.userId);
    
    return res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get today progress controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch today progress'
    });
  }
}

module.exports = {
  getTasks,
  getTaskById,
  submitTask,
  getTaskHistory,
  getTodayProgress
};