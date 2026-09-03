/**
 * File: packages/utils/src/formatters.js
 * Yegna AI - Formatting Utilities
 * 
 * Provides consistent formatting functions for currency,
 * dates, numbers, and text across the platform.
 */

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

/**
 * Format a number as Ethiopian Birr currency
 * 
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: ETB)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'ETB') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 ETB';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format a date to a readable string
 * 
 * @param {string|Date} date - Date to format
 * @param {string} format - Date format pattern
 * @returns {string} Formatted date string
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '';
  return dayjs(date).format(format);
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * 
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
function formatRelativeTime(date) {
  if (!date) return '';
  return dayjs(date).fromNow();
}

/**
 * Format a number with thousand separators
 * 
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(number) {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US').format(number);
}

/**
 * Format a percentage value
 * 
 * @param {number} value - Percentage value (e.g., 10 for 10%)
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  return `${value}%`;
}

/**
 * Truncate text to a specified length
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Convert string to title case
 * 
 * @param {string} text - Text to convert
 * @returns {string} Title case text
 */
function toTitleCase(text) {
  if (!text) return '';
  
  return text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
  );
}

/**
 * Format file size to human readable string
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, index)).toFixed(2))} ${sizes[index]}`;
}

module.exports = {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatPercentage,
  truncateText,
  toTitleCase,
  formatFileSize
};