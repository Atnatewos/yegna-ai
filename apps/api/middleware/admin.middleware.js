/**
 * File: apps/api/middleware/admin.middleware.js
 * Yegna AI - Admin Authorization Middleware
 * 
 * Verifies that the authenticated user has admin role.
 */

/**
 * Admin authorization middleware
 * Checks if the authenticated user has admin role.
 * Must be used after the authenticate middleware.
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authorization'
    });
  }
}

module.exports = {
  requireAdmin
};