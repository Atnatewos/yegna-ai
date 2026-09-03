/**
 * File: scripts/seed.js
 * Yegna AI - Database Seeding Script
 * 
 * Seeds the database with initial data.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const fs = require('fs');
const { Client } = require('pg');

/**
 * Database connection configuration from environment
 */
const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
};

/**
 * Run seeds
 */
async function runSeeds() {
  const client = new Client(databaseConfig);
  const seedsDir = path.join(__dirname, '..', 'database', 'seeds');
  
  try {
    await client.connect();
    console.log('Connected to database.');
    
    const seedFiles = fs.readdirSync(seedsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();
    
    for (const file of seedFiles) {
      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`Running seed: ${file}`);
      
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`Seed completed: ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Seed failed: ${file}`);
        console.error(error.message);
        process.exit(1);
      }
    }
    
    console.log('All seeds completed successfully.');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run seeds
runSeeds();
