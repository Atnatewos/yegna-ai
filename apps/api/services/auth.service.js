/**
 * File: apps/api/services/auth.service.js
 * Yegna AI - Authentication Service
 * 
 * Handles user registration, login, and authentication logic.
 */

const bcrypt = require('bcryptjs');
const { queryOne, insertOne, update } = require('../utils/database');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { helpers } = require('@yegna/utils');

/**
 * Register a new user
 * 
 * @param {object} userData - User registration data
 * @returns {Promise<object>} Registered user and tokens
 */
async function registerUser(userData) {
  const {
    fullName,
    email,
    phone,
    username,
    password,
    referralCode
  } = userData;
  
  // Check if email already exists
  const existingEmail = await queryOne(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  
  if (existingEmail) {
    throw new Error('Email already registered');
  }
  
  // Check if username already exists
  const existingUsername = await queryOne(
    'SELECT id FROM users WHERE username = $1',
    [username]
  );
  
  if (existingUsername) {
    throw new Error('Username already taken');
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Generate unique referral code
  let generatedReferralCode = helpers.generateReferralCode(8);
  let referralCodeExists = await queryOne(
    'SELECT id FROM users WHERE referral_code = $1',
    [generatedReferralCode]
  );
  
  while (referralCodeExists) {
    generatedReferralCode = helpers.generateReferralCode(8);
    referralCodeExists = await queryOne(
      'SELECT id FROM users WHERE referral_code = $1',
      [generatedReferralCode]
    );
  }
  
  // Find referrer if referral code provided
  let referrerId = null;
  if (referralCode) {
    const referrer = await queryOne(
      'SELECT id FROM users WHERE referral_code = $1',
      [referralCode]
    );
    
    if (referrer) {
      referrerId = referrer.id;
    }
  }
  
  // Create new user
  const newUser = await insertOne(
    `INSERT INTO users (
       full_name,
       email,
       phone,
       username,
       password_hash,
       referral_code,
       referrer_id
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING 
       id,
       username,
       email,
       full_name,
       phone,
       role,
       referral_code,
       referrer_id,
       is_active,
       is_verified`,
    [
      fullName,
      email.toLowerCase(),
      phone || null,
      username,
      passwordHash,
      generatedReferralCode,
      referrerId
    ]
  );
  
  // Create wallet for new user
  await insertOne(
    `INSERT INTO wallets (user_id)
     VALUES ($1)`,
    [newUser.id]
  );
  
  // Generate tokens
  const tokens = generateTokens(newUser);
  
  return {
    user: newUser,
    tokens
  };
}

/**
 * Login a user
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} Logged in user and tokens
 */
async function loginUser(email, password) {
  // Find user by email
  const user = await queryOne(
    `SELECT 
       id,
       username,
       email,
       full_name,
       phone,
       password_hash,
       role,
       referral_code,
       is_active,
       is_verified
     FROM users
     WHERE email = $1`,
    [email.toLowerCase()]
  );
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  if (!user.is_active) {
    throw new Error('Account is inactive. Please contact support.');
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  // Remove password hash from user object
  delete user.password_hash;
  
  // Generate tokens
  const tokens = generateTokens(user);
  
  return {
    user,
    tokens
  };
}

/**
 * Generate access and refresh tokens
 * 
 * @param {object} user - User object
 * @returns {object} Tokens
 */
function generateTokens(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  return {
    accessToken,
    refreshToken
  };
}

/**
 * Get user by ID
 * 
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} User object or null
 */
async function getUserById(userId) {
  const user = await queryOne(
    `SELECT 
       id,
       username,
       email,
       full_name,
       phone,
       profile_image_url,
       role,
       referral_code,
       is_active,
       is_verified,
       created_at,
       updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );
  
  return user;
}

/**
 * Update user profile
 * 
 * @param {string} userId - User ID
 * @param {object} updateData - Data to update
 * @returns {Promise<object>} Updated user
 */
async function updateUserProfile(userId, updateData) {
  const allowedFields = ['full_name', 'phone', 'profile_image_url'];
  const updates = [];
  const values = [];
  let paramIndex = 1;
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      updates.push(`${field} = $${paramIndex}`);
      values.push(updateData[field]);
      paramIndex++;
    }
  }
  
  if (updates.length === 0) {
    return getUserById(userId);
  }
  
  values.push(userId);
  
  const result = await queryOne(
    `UPDATE users
     SET ${updates.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING 
       id,
       username,
       email,
       full_name,
       phone,
       profile_image_url,
       role,
       referral_code,
       is_active,
       is_verified`,
    values
  );
  
  return result;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  generateTokens
};