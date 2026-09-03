/**
 * File: apps/api/routes/task.routes.js
 * Yegna AI - Task Routes
 * 
 * Defines routes for task operations.
 */

const express = require('express');
const taskController = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireBody } = require('../middleware/validate.middleware');

const router = express.Router();

/**
 * GET /api/tasks
 * Get available tasks for the authenticated user
 */
router.get(
  '/',
  authenticate,
  taskController.getTasks
);

/**
 * GET /api/tasks/history
 * Get user's task submission history
 */
router.get(
  '/history',
  authenticate,
  taskController.getTaskHistory
);

/**
 * GET /api/tasks/progress
 * Get today's task progress
 */
router.get(
  '/progress',
  authenticate,
  taskController.getTodayProgress
);

/**
 * GET /api/tasks/:taskId
 * Get task by ID
 */
router.get(
  '/:taskId',
  authenticate,
  taskController.getTaskById
);

/**
 * POST /api/tasks/submit
 * Submit a task
 */
router.post(
  '/submit',
  authenticate,
  requireBody,
  taskController.submitTask
);

module.exports = router;