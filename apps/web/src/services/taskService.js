/**
 * File: apps/web/src/services/taskService.js
 * Yegna AI - Task Service
 * 
 * Handles API calls for task operations.
 */

import apiClient from './apiClient';

/**
 * Get available tasks
 * 
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Tasks result
 */
export async function getTasks(page = 1, limit = 10) {
  try {
    const response = await apiClient.get('/tasks', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get task by ID
 * 
 * @param {string} taskId - Task ID
 * @returns {Promise<object>} Task data
 */
export async function getTaskById(taskId) {
  try {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Submit a task
 * 
 * @param {object} submissionData - Task submission data
 * @returns {Promise<object>} Submission result
 */
export async function submitTask(submissionData) {
  try {
    const response = await apiClient.post('/tasks/submit', submissionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get task history
 * 
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Task history result
 */
export async function getTaskHistory(page = 1, limit = 10) {
  try {
    const response = await apiClient.get('/tasks/history', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get today's task progress
 * 
 * @returns {Promise<object>} Today's progress
 */
export async function getTodayProgress() {
  try {
    const response = await apiClient.get('/tasks/progress');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}