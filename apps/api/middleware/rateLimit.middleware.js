/**
 * File: apps/api/middleware/rateLimit.middleware.js
 * Yegna AI - Rate Limiting Middleware
 * 
 * Implements rate limiting to prevent abuse.
 */

const rateLimit = require('express-rate-limit');

/**
 * Create a rate limiter middleware
 * Configuration is read from environment variables.
 */
const apiRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Stricter rate limiter for authentication endpoints
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiRateLimiter,
  authRateLimiter
};