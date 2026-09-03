/**
 * File: apps/api/middleware/validate.middleware.js
 * Yegna AI - Validation Middleware
 * 
 * Provides request validation middleware functions.
 */

/**
 * Create a validation middleware
 * 
 * @param {Function} validatorFn - Validation function
 * @returns {Function} Express middleware function
 */
function validate(validatorFn) {
  return (req, res, next) => {
    try {
      const validationResult = validatorFn(req.body);
      
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.errors
        });
      }
      
      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation'
      });
    }
  };
}

/**
 * Validate request body is not empty
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function requireBody(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body is required'
    });
  }
  
  next();
}

module.exports = {
  validate,
  requireBody
};