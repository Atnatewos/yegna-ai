/**
 * File: apps/api/services/task.service.js
 * Yegna AI - Task Service
 * 
 * Handles task management, generation, and submissions.
 */

const { queryOne, queryMany, insertOne, update, transaction } = require('../utils/database');
const { validators } = require('@yegna/utils');

/**
 * Get available tasks for a user
 * 
 * @param {string} userId - User ID
 * @param {number} userLevel - User's membership level
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Tasks with pagination
 */
async function getAvailableTasks(userId, userLevel, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  const tasks = await queryMany(
    `SELECT 
       t.id,
       t.title,
       t.description,
       t.task_type,
       t.reward_amount,
       t.required_level,
       t.status,
       t.max_completions,
       t.completion_count,
       t.created_at,
       t.expires_at,
       CASE 
         WHEN ts.id IS NOT NULL THEN 'submitted'
         ELSE 'available'
       END AS user_status
     FROM tasks t
     LEFT JOIN task_submissions ts ON ts.task_id = t.id AND ts.user_id = $1
     WHERE t.status = 'active'
       AND t.required_level <= $2
       AND ts.id IS NULL
       AND (t.expires_at IS NULL OR t.expires_at > CURRENT_TIMESTAMP)
     ORDER BY t.reward_amount DESC, t.created_at ASC
     LIMIT $3 OFFSET $4`,
    [userId, userLevel, limit, offset]
  );
  
  const totalCount = await queryOne(
    `SELECT COUNT(*) AS count
     FROM tasks t
     LEFT JOIN task_submissions ts ON ts.task_id = t.id AND ts.user_id = $1
     WHERE t.status = 'active'
       AND t.required_level <= $2
       AND ts.id IS NULL
       AND (t.expires_at IS NULL OR t.expires_at > CURRENT_TIMESTAMP)`,
    [userId, userLevel]
  );
  
  return {
    tasks,
    pagination: {
      page,
      limit,
      total: parseInt(totalCount?.count || '0'),
      totalPages: Math.ceil(parseInt(totalCount?.count || '0') / limit)
    }
  };
}

/**
 * Get task by ID
 * 
 * @param {string} taskId - Task ID
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} Task object or null
 */
async function getTaskById(taskId, userId = null) {
  const task = await queryOne(
    `SELECT 
       t.id,
       t.title,
       t.description,
       t.task_type,
       t.reward_amount,
       t.required_level,
       t.status,
       t.max_completions,
       t.completion_count,
       t.created_at,
       t.expires_at,
       CASE 
         WHEN ts.id IS NOT NULL THEN 'submitted'
         ELSE 'available'
       END AS user_status
     FROM tasks t
     LEFT JOIN task_submissions ts ON ts.task_id = t.id AND ts.user_id = $2
     WHERE t.id = $1`,
    [taskId, userId]
  );
  
  return task;
}

/**
 * Submit a task
 * 
 * @param {string} userId - User ID
 * @param {object} submissionData - Task submission data
 * @returns {Promise<object>} Created submission
 */
async function submitTask(userId, submissionData) {
  const { taskId, content, attachments } = submissionData;
  
  return await transaction(async (client) => {
    // Get task and check availability
    const task = await client.query(
      `SELECT * FROM tasks
       WHERE id = $1
         AND status = 'active'
       FOR UPDATE`,
      [taskId]
    );
    
    if (!task.rows[0]) {
      throw new Error('Task not found or no longer available');
    }
    
    const taskData = task.rows[0];
    
    // Check if task is expired
    if (taskData.expires_at && new Date(taskData.expires_at) < new Date()) {
      throw new Error('Task has expired');
    }
    
    // Check if max completions reached
    if (taskData.completion_count >= taskData.max_completions) {
      throw new Error('Task has reached maximum completions');
    }
    
    // Check if user already submitted
    const existingSubmission = await client.query(
      `SELECT id FROM task_submissions
       WHERE task_id = $1 AND user_id = $2`,
      [taskId, userId]
    );
    
    if (existingSubmission.rows[0]) {
      throw new Error('You have already submitted this task');
    }
    
    // Build submission data based on task type
    let submissionPayload = {};
    
    switch (taskData.task_type) {
      case 'text':
        submissionPayload = {
          content: validators.sanitizeString(content || '')
        };
        
        if (submissionPayload.content.length < 50) {
          throw new Error('Text content must be at least 50 characters');
        }
        break;
        
      case 'image':
        submissionPayload = {
          imageUrl: content?.imageUrl || content || ''
        };
        
        if (!submissionPayload.imageUrl) {
          throw new Error('Image is required');
        }
        break;
        
      case 'file':
        submissionPayload = {
          fileUrl: content?.fileUrl || content || ''
        };
        
        if (!submissionPayload.fileUrl) {
          throw new Error('File is required');
        }
        break;
        
      case 'voice':
        submissionPayload = {
          voiceUrl: content?.voiceUrl || content || ''
        };
        
        if (!submissionPayload.voiceUrl) {
          throw new Error('Voice recording is required');
        }
        break;
        
      default:
        throw new Error('Invalid task type');
    }
    
    // Create submission
    const submission = await client.query(
      `INSERT INTO task_submissions (
         task_id,
         user_id,
         submission_data,
         attachments,
         status,
         reward_amount
       ) VALUES ($1, $2, $3, $4, 'submitted', $5)
       RETURNING *`,
      [
        taskId,
        userId,
        JSON.stringify(submissionPayload),
        JSON.stringify(attachments || []),
        taskData.reward_amount
      ]
    );
    
    // Update task completion count
    await client.query(
      `UPDATE tasks
       SET completion_count = completion_count + 1
       WHERE id = $1`,
      [taskId]
    );
    
    return submission.rows[0];
  });
}

/**
 * Approve a task submission
 * 
 * @param {string} submissionId - Submission ID
 * @returns {Promise<object>} Updated submission
 */
async function approveSubmission(submissionId) {
  return await transaction(async (client) => {
    const submission = await client.query(
      `SELECT * FROM task_submissions
       WHERE id = $1
         AND status = 'submitted'
       FOR UPDATE`,
      [submissionId]
    );
    
    if (!submission.rows[0]) {
      throw new Error('Submission not found or already processed');
    }
    
    const submissionData = submission.rows[0];
    
    // Update submission status
    const updatedSubmission = await client.query(
      `UPDATE task_submissions
       SET status = 'approved',
           reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [submissionId]
    );
    
    // Credit wallet
    await client.query(
      `UPDATE wallets
       SET balance = balance + $1,
           total_earned = total_earned + $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [submissionData.reward_amount, submissionData.user_id]
    );
    
    // Update daily earnings
    const today = new Date().toISOString().split('T')[0];
    
    await client.query(
      `INSERT INTO daily_earnings (user_id, task_date, tasks_completed, daily_income)
       VALUES ($1, $2, 1, $3)
       ON CONFLICT (user_id, task_date)
       DO UPDATE SET
         tasks_completed = daily_earnings.tasks_completed + 1,
         daily_income = daily_earnings.daily_income + $3,
         total_earned = daily_earnings.total_earned + $3,
         updated_at = CURRENT_TIMESTAMP`,
      [submissionData.user_id, today, submissionData.reward_amount]
    );
    
    return updatedSubmission.rows[0];
  });
}

/**
 * Reject a task submission
 * 
 * @param {string} submissionId - Submission ID
 * @returns {Promise<object>} Updated submission
 */
async function rejectSubmission(submissionId) {
  const submission = await queryOne(
    `UPDATE task_submissions
     SET status = 'rejected',
         reviewed_at = CURRENT_TIMESTAMP
     WHERE id = $1
       AND status = 'submitted'
     RETURNING *`,
    [submissionId]
  );
  
  if (!submission) {
    throw new Error('Submission not found or already processed');
  }
  
  return submission;
}

/**
 * Get user's task history
 * 
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Submissions with pagination
 */
async function getUserTaskHistory(userId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  const submissions = await queryMany(
    `SELECT 
       ts.id,
       ts.task_id,
       ts.status,
       ts.reward_amount,
       ts.submitted_at,
       ts.reviewed_at,
       t.title AS task_title,
       t.task_type
     FROM task_submissions ts
     JOIN tasks t ON t.id = ts.task_id
     WHERE ts.user_id = $1
     ORDER BY ts.submitted_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  
  const totalCount = await queryOne(
    `SELECT COUNT(*) AS count
     FROM task_submissions
     WHERE user_id = $1`,
    [userId]
  );
  
  return {
    submissions,
    pagination: {
      page,
      limit,
      total: parseInt(totalCount?.count || '0'),
      totalPages: Math.ceil(parseInt(totalCount?.count || '0') / limit)
    }
  };
}

/**
 * Get today's task progress for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<object>} Daily earnings object
 */
async function getTodayProgress(userId) {
  const today = new Date().toISOString().split('T')[0];
  
  const progress = await queryOne(
    `SELECT 
       tasks_completed,
       daily_income,
       team_commission,
       total_earned
     FROM daily_earnings
     WHERE user_id = $1
       AND task_date = $2`,
    [userId, today]
  );
  
  return progress || {
    tasks_completed: 0,
    daily_income: 0,
    team_commission: 0,
    total_earned: 0
  };
}

module.exports = {
  getAvailableTasks,
  getTaskById,
  submitTask,
  approveSubmission,
  rejectSubmission,
  getUserTaskHistory,
  getTodayProgress
};