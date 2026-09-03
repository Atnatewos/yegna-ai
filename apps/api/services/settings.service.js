/**
 * File: apps/api/services/settings.service.js
 * Yegna AI - Platform Settings Service
 * 
 * Manages platform settings that can be controlled
 * from the admin panel. Utilizes in-memory caching
 * to reduce database load for frequently accessed configs.
 */

const { queryOne, queryMany, insertOne, update, invalidateCache } = require('../utils/database');

/**
 * Get all settings of a specific type with caching
 * 
 * @param {string} settingType - Type of settings to retrieve
 * @returns {Promise<Array>} Array of settings
 */
async function getSettingsByType(settingType) {
  const cacheKey = `settings_type_${settingType}`;
  const result = await queryMany(
    `SELECT 
       id,
       setting_key,
       setting_value,
       setting_type,
       description,
       is_active,
       updated_at
     FROM platform_settings
     WHERE setting_type = $1
       AND is_active = true
     ORDER BY setting_key ASC`,
    [settingType],
    cacheKey
  );
  
  return result;
}

/**
 * Get a specific setting by key with caching
 * 
 * @param {string} settingKey - Setting key to retrieve
 * @returns {Promise<object|null>} Setting object or null
 */
async function getSettingByKey(settingKey) {
  const cacheKey = `setting_key_${settingKey}`;
  const result = await queryOne(
    `SELECT 
       id,
       setting_key,
       setting_value,
       setting_type,
       description,
       is_active,
       updated_at
     FROM platform_settings
     WHERE setting_key = $1
       AND is_active = true`,
    [settingKey],
    cacheKey
  );
  
  return result;
}

/**
 * Get all payment settings
 * 
 * @returns {Promise<object>} Payment settings object
 */
async function getPaymentSettings() {
  const settings = await getSettingsByType('payment');
  
  const paymentConfig = {};
  for (const setting of settings) {
    paymentConfig[setting.setting_key] = setting.setting_value;
  }
  
  return paymentConfig;
}

/**
 * Get all withdrawal settings
 * 
 * @returns {Promise<object>} Withdrawal settings object
 */
async function getWithdrawalSettings() {
  const settings = await getSettingsByType('withdrawal');
  
  const withdrawalConfig = {};
  for (const setting of settings) {
    withdrawalConfig[setting.setting_key] = setting.setting_value;
  }
  
  return withdrawalConfig;
}

/**
 * Get all commission settings
 * 
 * @returns {Promise<object>} Commission settings object
 */
async function getCommissionSettings() {
  const settings = await getSettingsByType('commission');
  
  const commissionConfig = {};
  for (const setting of settings) {
    commissionConfig[setting.setting_key] = setting.setting_value;
  }
  
  return commissionConfig;
}

/**
 * Update a setting value and invalidate cache
 * 
 * @param {string} settingKey - Setting key to update
 * @param {object} settingValue - New setting value
 * @param {string} adminId - ID of admin making the change
 * @returns {Promise<object>} Updated setting
 */
async function updateSetting(settingKey, settingValue, adminId) {
  const result = await update(
    `UPDATE platform_settings
     SET setting_value = $1,
         updated_by = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE setting_key = $3`,
    [JSON.stringify(settingValue), adminId, settingKey]
  );
  
  if (result === 0) {
    throw new Error(`Setting not found: ${settingKey}`);
  }
  
  // Invalidate all settings caches on update to ensure consistency
  invalidateCache();
  
  return getSettingByKey(settingKey);
}

/**
 * Create a new setting and invalidate cache
 * 
 * @param {object} settingData - Setting data
 * @param {string} adminId - ID of admin creating the setting
 * @returns {Promise<object>} Created setting
 */
async function createSetting(settingData, adminId) {
  const result = await insertOne(
    `INSERT INTO platform_settings (
       setting_key,
       setting_value,
       setting_type,
       description,
       created_by,
       updated_by
     ) VALUES ($1, $2, $3, $4, $5, $5)
     RETURNING *`,
    [
      settingData.settingKey,
      JSON.stringify(settingData.settingValue),
      settingData.settingType,
      settingData.description || '',
      adminId
    ]
  );
  
  invalidateCache();
  
  return result;
}

/**
 * Delete a setting and invalidate cache
 * 
 * @param {string} settingKey - Setting key to delete
 * @returns {Promise<number>} Number of deleted rows
 */
async function deleteSetting(settingKey) {
  const result = await update(
    `UPDATE platform_settings
     SET is_active = false,
         updated_at = CURRENT_TIMESTAMP
     WHERE setting_key = $1`,
    [settingKey]
  );
  
  invalidateCache();
  
  return result;
}

/**
 * Get all settings for admin panel (uncached for admin view to ensure absolute freshness)
 * 
 * @returns {Promise<Array>} All settings
 */
async function getAllSettings() {
  const result = await queryMany(
    `SELECT 
       id,
       setting_key,
       setting_value,
       setting_type,
       description,
       is_active,
       created_at,
       updated_at
     FROM platform_settings
     ORDER BY setting_type ASC, setting_key ASC`
  );
  
  return result;
}

module.exports = {
  getSettingsByType,
  getSettingByKey,
  getPaymentSettings,
  getWithdrawalSettings,
  getCommissionSettings,
  updateSetting,
  createSetting,
  deleteSetting,
  getAllSettings
};