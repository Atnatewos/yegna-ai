/**
 * File: apps/api/middleware/auth.middleware.js
 * Yegna AI - Authentication Middleware
 */
const { verifyToken } = require('../utils/jwt');
const { queryOne } = require('../utils/database');

async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.yegna_access_token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
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
      `SELECT id, username, email, full_name, phone, role, referral_code, is_active, is_verified
       FROM users
       WHERE id = $1 AND is_active = true`,
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

async function optionalAuthenticate(req, res, next) {
  try {
    const token = req.cookies?.yegna_access_token;
    
    if (token) {
      try {
        const decoded = verifyToken(token);
        const user = await queryOne(
          `SELECT id, username, email, full_name, phone, role, referral_code, is_active, is_verified
           FROM users
           WHERE id = $1 AND is_active = true`,
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