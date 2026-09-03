/**
 * File: apps/api/utils/database.js
 * Yegna AI - Database Connection Utility
 * 
 * Manages PostgreSQL connection using Neon serverless driver
 * to prevent connection exhaustion in Vercel serverless environments.
 * Includes a secure, time-bound in-memory cache for frequently accessed data.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const { neon, neonConfig } = require('@neondatabase/serverless');

// Enable connection caching for serverless environments
neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL);

// In-memory cache for frequently accessed, low-volatility data (e.g., platform settings)
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

/**
 * Execute a parameterized query with optional caching
 * 
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @param {string|null} cacheKey - Optional cache key
 * @returns {Promise<object>} Query result
 */
async function query(text, params = [], cacheKey = null) {
  if (cacheKey && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return { rows: cached.result, rowCount: cached.result.length };
    }
  }

  try {
    const result = await sql(text, params);
    const formattedResult = { rows: result, rowCount: result.length };
    
    if (cacheKey) {
      cache.set(cacheKey, { result, timestamp: Date.now() });
    }
    
    return formattedResult;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

/**
 * Execute a transaction with multiple queries
 * 
 * @param {Function} callback - Function containing transaction queries
 * @returns {Promise<any>} Transaction result
 */
async function transaction(callback) {
  try {
    await sql`BEGIN`;
    const result = await callback({
      query: async (text, params) => {
        const res = await sql(text, params);
        return { rows: res, rowCount: res.length };
      }
    });
    await sql`COMMIT`;
    return result;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
}

/**
 * Get a single row by query
 * 
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @param {string|null} cacheKey - Optional cache key
 * @returns {Promise<object|null>} Single row or null
 */
async function queryOne(text, params = [], cacheKey = null) {
  const result = await query(text, params, cacheKey);
  return result.rows[0] || null;
}

/**
 * Get multiple rows by query
 * 
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @param {string|null} cacheKey - Optional cache key
 * @returns {Promise<Array>} Array of rows
 */
async function queryMany(text, params = [], cacheKey = null) {
  const result = await query(text, params, cacheKey);
  return result.rows;
}

/**
 * Insert a row and return it
 * 
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<object|null>} Inserted row or null
 */
async function insertOne(text, params = []) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Update rows and return affected count
 * 
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<number>} Affected row count
 */
async function update(text, params = []) {
  const result = await query(text, params);
  return result.rowCount;
}

/**
 * Delete rows and return affected count
 * 
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<number>} Affected row count
 */
async function remove(text, params = []) {
  const result = await query(text, params);
  return result.rowCount;
}

/**
 * Invalidate a specific cache key or clear all cache
 * 
 * @param {string|null} cacheKey - Optional cache key to clear. If null, clears all.
 */
function invalidateCache(cacheKey = null) {
  if (cacheKey) {
    cache.delete(cacheKey);
  } else {
    cache.clear();
  }
}

module.exports = {
  query,
  queryOne,
  queryMany,
  insertOne,
  update,
  remove,
  transaction,
  invalidateCache
};