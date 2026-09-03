/**
 * File: packages/utils/src/validators.js
 * Yegna AI - Validation Utilities
 * 
 * Provides validation functions for common input types
 * used throughout the platform.
 */

/**
 * Validate email format
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (Ethiopian)
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid Ethiopian phone number
 */
function isValidEthiopianPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  
  // Ethiopian phone numbers: +251XXXXXXXXX or 09XXXXXXXX or 251XXXXXXXXX
  const phoneRegex = /^(\+?251|0)?[9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Validate password strength
 * 
 * @param {string} password - Password to validate
 * @returns {object} Validation result with status and message
 */
function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain number' };
  }
  
  return { isValid: true, message: 'Password is strong' };
}

/**
 * Validate username format
 * 
 * @param {string} username - Username to validate
 * @returns {boolean} True if valid username format
 */
function isValidUsername(username) {
  if (!username || typeof username !== 'string') return false;
  
  // Username: 3-20 characters, alphanumeric and underscore
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate required fields
 * 
 * @param {object} data - Object containing field values
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {Array<string>} Array of missing field names
 */
function getMissingFields(data, requiredFields) {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      missingFields.push(field);
    }
  }
  
  return missingFields;
}

/**
 * Sanitize string input (remove HTML tags and special characters)
 * 
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(input) {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script tags content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return sanitized.trim();
}

/**
 * Validate referral code format
 * 
 * @param {string} code - Referral code to validate
 * @returns {boolean} True if valid referral code format
 */
function isValidReferralCode(code) {
  if (!code || typeof code !== 'string') return false;
  
  // Referral code: 6-20 characters, alphanumeric
  const referralRegex = /^[A-Z0-9]{6,20}$/i;
  return referralRegex.test(code);
}

/**
 * Validate number is within range
 * 
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if number is within range
 */
function isNumberInRange(value, min, max) {
  const num = Number(value);
  
  if (isNaN(num)) return false;
  
  return num >= min && num <= max;
}

module.exports = {
  isValidEmail,
  isValidEthiopianPhone,
  validatePasswordStrength,
  isValidUsername,
  getMissingFields,
  sanitizeString,
  isValidReferralCode,
  isNumberInRange
};