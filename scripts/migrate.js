/**
 * File: scripts/migrate.js
 * Yegna AI - Database Migration Script
 * 
 * Runs SQL migration files in order.
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
 * Run migrations
 */
async function runMigrations() {
  const client = new Client(databaseConfig);
  const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
  
  try {
    await client.connect();
    console.log('Connected to database.');
    
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();
    
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`Running migration: ${file}`);
      
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`Migration completed: ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Migration failed: ${file}`);
        console.error(error.message);
        process.exit(1);
      }
    }
    
    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run migrations
runMigrations();
