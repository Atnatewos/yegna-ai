/**
 * File: apps/api/utils/validators.js
 * Yegna AI - API Validators
 * 
 * Provides validation functions for API requests.
 */

const { validators } = require('@yegna/utils');

/**
 * Validate registration input
 * 
 * @param {object} data - Registration data
 * @returns {object} Validation result
 */
function validateRegistration(data) {
  const errors = [];
  
  const missingFields = validators.getMissingFields(data, [
    'fullName',
    'email',
    'username',
    'password'
  ]);
  
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  if (data.email && !validators.isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.username && !validators.isValidUsername(data.username)) {
    errors.push('Username must be 3-20 characters (letters, numbers, underscore)');
  }
  
  if (data.password) {
    const passwordCheck = validators.validatePasswordStrength(data.password);
    if (!passwordCheck.isValid) {
      errors.push(passwordCheck.message);
    }
  }
  
  if (data.phone && !validators.isValidEthiopianPhone(data.phone)) {
    errors.push('Invalid Ethiopian phone number format');
  }
  
  if (data.referralCode && !validators.isValidReferralCode(data.referralCode)) {
    errors.push('Invalid referral code format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate login input
 * 
 * @param {object} data - Login data
 * @returns {object} Validation result
 */
function validateLogin(data) {
  const errors = [];
  
  if (!data.email || !validators.isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!data.password || data.password.length < 1) {
    errors.push('Password is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate deposit input
 * 
 * @param {object} data - Deposit data
 * @returns {object} Validation result
 */
function validateDeposit(data) {
  const errors = [];
  
  if (!data.levelId || isNaN(data.levelId)) {
    errors.push('Level ID is required');
  }
  
  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    errors.push('Valid amount is required');
  }
  
  if (!data.paymentMethod) {
    errors.push('Payment method is required');
  }
  
  if (!data.paymentProofUrl) {
    errors.push('Payment proof is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate withdrawal input
 * 
 * @param {object} data - Withdrawal data
 * @param {object} config - Withdrawal configuration
 * @returns {object} Validation result
 */
function validateWithdrawal(data, config) {
  const errors = [];
  
  if (!data.amount || isNaN(data.amount) || data.amount < config.minimum) {
    errors.push(`Amount must be at least ${config.minimum} ETB`);
  }
  
  if (data.amount > config.maximum) {
    errors.push(`Amount cannot exceed ${config.maximum} ETB`);
  }
  
  if (!data.paymentMethod) {
    errors.push('Payment method is required');
  }
  
  if (!data.accountDetails) {
    errors.push('Account details are required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate task submission
 * 
 * @param {object} data - Submission data
 * @param {string} taskType - Type of task
 * @returns {object} Validation result
 */
function validateTaskSubmission(data, taskType) {
  const errors = [];
  
  if (!data.taskId) {
    errors.push('Task ID is required');
  }
  
  if (taskType === 'text' && !data.submissionData?.content) {
    errors.push('Text content is required');
  }
  
  if (taskType === 'image' && !data.submissionData?.imageUrl) {
    errors.push('Image is required');
  }
  
  if (taskType === 'file' && !data.submissionData?.fileUrl) {
    errors.push('File is required');
  }
  
  if (taskType === 'voice' && !data.submissionData?.voiceUrl) {
    errors.push('Voice recording is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateDeposit,
  validateWithdrawal,
  validateTaskSubmission
};