/**
 * File: apps/api/middleware/rateLimit.middleware.js
 * Yegna AI - Rate Limiting Middleware
 */
const rateLimit = require('express-rate-limit');

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

const financialRateLimiter = rateLimit({
  windowMs: parseInt(process.env.FINANCIAL_RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.FINANCIAL_RATE_LIMIT_MAX_REQUESTS || '5'),
  message: {
    success: false,
    message: 'Too many requests, please wait before trying again'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiRateLimiter,
  authRateLimiter,
  financialRateLimiter
};