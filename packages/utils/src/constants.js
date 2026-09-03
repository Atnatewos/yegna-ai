/**
 * File: packages/utils/src/constants.js
 * Yegna AI - Shared Constants
 * 
 * Contains platform-wide constant values used across
 * both frontend and backend applications.
 */

/**
 * User roles in the platform
 */
const USER_ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin'
});

/**
 * User status values
 */
const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
});

/**
 * Task types supported by the platform
 */
const TASK_TYPES = Object.freeze({
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  VOICE: 'voice'
});

/**
 * Task submission status values
 */
const TASK_SUBMISSION_STATUS = Object.freeze({
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected'
});

/**
 * Deposit transaction status values
 */
const DEPOSIT_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
});

/**
 * Withdrawal request status values
 */
const WITHDRAWAL_STATUS = Object.freeze({
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
});

/**
 * Commission types
 */
const COMMISSION_TYPES = Object.freeze({
  DIRECT_REFERRAL: 'direct_referral',
  TEAM_TASK: 'team_task',
  LEVEL_BONUS: 'level_bonus'
});

/**
 * Maximum team levels for commission calculation
 */
const MAX_TEAM_LEVELS = 5;

/**
 * Default pagination values
 */
const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
});

/**
 * JWT token types
 */
const TOKEN_TYPES = Object.freeze({
  ACCESS: 'access',
  REFRESH: 'refresh'
});

/**
 * File size limits (in bytes)
 */
const FILE_SIZE_LIMITS = Object.freeze({
  IMAGE: 5 * 1024 * 1024,      // 5 MB
  FILE: 10 * 1024 * 1024,      // 10 MB
  VOICE: 15 * 1024 * 1024      // 15 MB
});

/**
 * Allowed file formats
 */
const ALLOWED_FORMATS = Object.freeze({
  IMAGE: ['jpg', 'jpeg', 'png', 'webp'],
  FILE: ['pdf', 'doc', 'docx', 'txt'],
  VOICE: ['mp3', 'wav', 'm4a']
});

module.exports = {
  USER_ROLES,
  USER_STATUS,
  TASK_TYPES,
  TASK_SUBMISSION_STATUS,
  DEPOSIT_STATUS,
  WITHDRAWAL_STATUS,
  COMMISSION_TYPES,
  MAX_TEAM_LEVELS,
  PAGINATION,
  TOKEN_TYPES,
  FILE_SIZE_LIMITS,
  ALLOWED_FORMATS
};