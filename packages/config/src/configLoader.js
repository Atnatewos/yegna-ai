/**
 * File: packages/config/src/configLoader.js
 * Yegna AI - Configuration Loader
 * 
 * Provides utilities for loading and managing configuration
 * files from the config package.
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * Configuration cache to prevent repeated file reads
 */
const configCache = new Map();

/**
 * Load a configuration file from the config directory
 * 
 * @param {string} configName - Name of the config file (without .json extension)
 * @returns {object} Parsed configuration object
 * 
 * @throws {Error} If config file is not found or invalid JSON
 */
function loadConfig(configName) {
  try {
    // Check cache first
    if (configCache.has(configName)) {
      return configCache.get(configName);
    }
    
    // Build file path
    const configPath = path.join(__dirname, `${configName}.json`);
    
    // Check if file exists
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configName}.json`);
    }
    
    // Read and parse config file
    const rawConfig = fs.readFileSync(configPath, 'utf8');
    const parsedConfig = JSON.parse(rawConfig);
    
    // Store in cache
    configCache.set(configName, parsedConfig);
    
    return parsedConfig;
  } catch (error) {
    throw new Error(`Failed to load configuration '${configName}': ${error.message}`);
  }
}

/**
 * Reload a configuration file (bypasses cache)
 * 
 * @param {string} configName - Name of the config file
 * @returns {object} Fresh configuration object
 */
function reloadConfig(configName) {
  // Clear from cache
  configCache.delete(configName);
  
  // Load fresh config
  return loadConfig(configName);
}

/**
 * Clear entire configuration cache
 */
function clearConfigCache() {
  configCache.clear();
}

module.exports = {
  loadConfig,
  reloadConfig,
  clearConfigCache
};