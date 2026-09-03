/**
 * File: apps/api/middleware/auth.middleware.js
 * Yegna AI - Authentication Middleware
 * 
 * Verifies JWT tokens and attaches user data to request object.
 */

const { verifyToken } = require('../utils/jwt');
const { queryOne } = require('../utils/database');

/**
 * Authentication middleware
 * Verifies the JWT token from Authorization header
 * and attaches the user to the request object.
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing'
      });
    }
    
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid or expired token'
      });
    }
    
    const user = await queryOne(
      `SELECT 
         id,
         username,
         email,
         full_name,
         phone,
         role,
         referral_code,
         is_active,
         is_verified
       FROM users
       WHERE id = $1
         AND is_active = true`,
      [decoded.userId]
    );
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it.
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = verifyToken(token);
        
        const user = await queryOne(
          `SELECT 
             id,
             username,
             email,
             full_name,
             phone,
             role,
             referral_code,
             is_active,
             is_verified
           FROM users
           WHERE id = $1
             AND is_active = true`,
          [decoded.userId]
        );
        
        if (user) {
          req.user = user;
          req.userId = user.id;
        }
      } catch (error) {
        // Token is invalid, continue without user
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    next();
  }
}

module.exports = {
  authenticate,
  optionalAuthenticate
};