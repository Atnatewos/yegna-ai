/**
 * File: apps/api/utils/jwt.js
 * Yegna AI - JWT Utility
 * 
 * Handles JWT token generation and verification.
 */

const jwt = require('jsonwebtoken');

/**
 * Generate an access token
 * 
 * @param {object} payload - Token payload
 * @returns {string} JWT access token
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

/**
 * Generate a refresh token
 * 
 * @param {object} payload - Token payload
 * @returns {string} JWT refresh token
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  });
}

/**
 * Verify a JWT token
 * 
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 * 
 * @throws {Error} Token verification error
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Decode a JWT token without verification
 * 
 * @param {string} token - JWT token to decode
 * @returns {object|null} Decoded token payload
 */
function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken
};