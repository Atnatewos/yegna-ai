/**
 * File: apps/api/middleware/error.middleware.js
 * Yegna AI - Error Handling Middleware
 * 
 * Centralized error handling for all API routes.
 */

/**
 * Not found handler
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    path: req.originalUrl
  });
}

/**
 * Global error handler
 * 
 * @param {Error} error - Error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function errorHandler(error, req, res, next) {
  console.error('Unhandled error:', {
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method
  });
  
  const statusCode = error.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};