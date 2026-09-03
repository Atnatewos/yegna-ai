/**
 * File: apps/api/middleware/validate.middleware.js
 * Yegna AI - Validation Middleware
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

function requireBody(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body is required'
    });
  }
  next();
}

module.exports = { validate, requireBody };
