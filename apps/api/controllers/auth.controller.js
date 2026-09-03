/**
 * File: apps/api/controllers/auth.controller.js
 * Yegna AI - Authentication Controller
 * 
 * Handles HTTP requests for authentication operations.
 */

const authService = require('../services/auth.service');
const teamService = require('../services/team.service');
const commissionService = require('../services/commission.service');
const { validators } = require('../utils/validators');

/**
 * Register a new user
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function register(req, res) {
  try {
    const validation = validators.validateRegistration(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    const result = await authService.registerUser(req.body);
    
    // Update referral tree if referrer exists
    if (result.user.referrer_id) {
      await teamService.updateReferralTree(result.user.id, result.user.referrer_id);
    }
    
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result
    });
  } catch (error) {
    console.error('Register controller error:', error);
    
    const statusCode = error.message.includes('already') ? 409 : 500;
    
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
}

/**
 * Login a user
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function login(req, res) {
  try {
    const validation = validators.validateLogin(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    const { email, password } = req.body;
    
    const result = await authService.loginUser(email, password);
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    console.error('Login controller error:', error);
    
    const statusCode = error.message.includes('Invalid') ? 401 : 500;
    
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
}

/**
 * Get current authenticated user
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getCurrentUser(req, res) {
  try {
    const user = await authService.getUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
}

/**
 * Update user profile
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function updateProfile(req, res) {
  try {
    const updatedUser = await authService.updateUserProfile(req.userId, req.body);
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
}

/**
 * Validate a referral code
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function validateReferralCode(req, res) {
  try {
    const { referralCode } = req.query;
    
    if (!referralCode || !validators.isValidReferralCode(referralCode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid referral code format'
      });
    }
    
    const { queryOne } = require('../utils/database');
    
    const referrer = await queryOne(
      `SELECT 
         id,
         username,
         full_name,
         profile_image_url
       FROM users
       WHERE referral_code = $1
         AND is_active = true`,
      [referralCode]
    );
    
    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Referral code not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Valid referral code',
      data: {
        referrerUsername: referrer.username,
        referrerFullName: referrer.full_name
      }
    });
  } catch (error) {
    console.error('Validate referral code controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate referral code'
    });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  validateReferralCode
};