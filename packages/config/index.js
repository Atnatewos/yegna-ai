/**
 * File: packages/config/index.js
 * Yegna AI - Configuration Package Entry Point
 * 
 * This module serves as the main entry point for accessing
 * all platform configurations. It loads JSON config files
 * and provides a unified interface for accessing them.
 */

const configLoader = require('./src/configLoader');
const levelsConfig = require('./src/levels.config.json');
const commissionConfig = require('./src/commission.config.json');
const tasksConfig = require('./src/tasks.config.json');
const paymentConfig = require('./src/payment.config.json');
const navigationConfig = require('./src/navigation.config.json');
const breadcrumbsConfig = require('./src/breadcrumbs.config.json');

/**
 * Export all configurations as a single object
 */
module.exports = {
  levels: levelsConfig,
  commission: commissionConfig,
  tasks: tasksConfig,
  payment: paymentConfig,
  navigation: navigationConfig,
  breadcrumbs: breadcrumbsConfig,
  
  /**
   * Load a custom configuration file
   * @param {string} configName - Name of the config file
   * @returns {object} Parsed configuration object
   */
  loadConfig: configLoader.loadConfig,
  
  /**
   * Reload a configuration at runtime
   * @param {string} configName - Name of the config file
   * @returns {object} Fresh configuration object
   */
  reloadConfig: configLoader.reloadConfig
};