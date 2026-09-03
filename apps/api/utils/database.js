/**
 * File: apps/api/utils/database.js
 * Yegna AI - Database Connection Utility
 * 
 * Manages PostgreSQL connection pool and query execution
 * with parameterized queries for security.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env') });
const { Pool } = require('pg');

/**
 * Create PostgreSQL connection pool
 * Configuration is read from environment variables
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : { rejectUnauthorized: false },
  max: parseInt(process.env.DATABASE_POOL_MAX || '20'),
  idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '2000')
});

/**
 * Handle pool errors
 */
pool.on('error', (error) => {
  console.error('Unexpected error on idle PostgreSQL client', error);
});

/**
 * Execute a parameterized query
 * 
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<object>} Query result
 */
async function query(text, params = []) {
  const client = await pool.connect();
  
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw new Error(`Database query failed: ${error.message}`);
  } finally {
    client.release();
  }
}

/**
 * Execute a transaction with multiple queries
 */
async function transaction(callback) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get a single row by query
 */
async function queryOne(text, params = []) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Get multiple rows by query
 */
async function queryMany(text, params = []) {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Insert a row and return it
 */
async function insertOne(text, params = []) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Update rows and return affected count
 */
async function update(text, params = []) {
  const result = await query(text, params);
  return result.rowCount;
}

/**
 * Delete rows and return affected count
 */
async function remove(text, params = []) {
  const result = await query(text, params);
  return result.rowCount;
}

/**
 * Close the database pool
 */
async function close() {
  await pool.end();
}

module.exports = {
  query,
  queryOne,
  queryMany,
  insertOne,
  update,
  remove,
  transaction,
  close,
  pool
};
