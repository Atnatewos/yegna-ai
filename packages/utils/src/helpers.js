/**
 * File: packages/utils/src/helpers.js
 * Yegna AI - Helper Utilities
 * 
 * Provides general helper functions used across the platform.
 */

const crypto = require('crypto');

/**
 * Generate a random referral code
 * 
 * @param {number} length - Length of the code (default: 8)
 * @returns {string} Generated referral code
 */
function generateReferralCode(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    code += characters[randomIndex];
  }
  
  return code;
}

/**
 * Generate a random token
 * 
 * @param {number} length - Length of the token (default: 32)
 * @returns {string} Generated token
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a unique ID
 * 
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Generated unique ID
 */
function generateUniqueId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  return `${prefix}${timestamp}${random}`;
}

/**
 * Deep clone an object
 * 
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (obj instanceof Date) return new Date(obj.getTime());
  
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }
  
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

/**
 * Sleep/delay function
 * 
 * @param {number} milliseconds - Delay in milliseconds
 * @returns {Promise} Promise that resolves after delay
 */
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Retry a function with exponential backoff
 * 
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Result of the function
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

/**
 * Chunk an array into smaller arrays
 * 
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
function chunkArray(array, size) {
  const chunks = [];
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
}

/**
 * Remove sensitive fields from an object
 * 
 * @param {object} obj - Object to sanitize
 * @param {Array<string>} sensitiveFields - Fields to remove
 * @returns {object} Sanitized object
 */
function removeSensitiveFields(obj, sensitiveFields = ['password', 'password_hash']) {
  const sanitized = deepClone(obj);
  
  for (const field of sensitiveFields) {
    delete sanitized[field];
  }
  
  return sanitized;
}

module.exports = {
  generateReferralCode,
  generateToken,
  generateUniqueId,
  deepClone,
  sleep,
  retryWithBackoff,
  chunkArray,
  removeSensitiveFields
};