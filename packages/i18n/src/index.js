/**
 * File: packages/i18n/src/index.js
 * Yegna AI - Internationalization Setup
 * 
 * Configures and initializes i18next for multi-language support
 * across the platform (English and Amharic).
 */

const i18n = require('i18next');
const { initReactI18next } = require('react-i18next');

// Import translation files
const enCommon = require('./locales/en/common.json');
const enAuth = require('./locales/en/auth.json');
const enDashboard = require('./locales/en/dashboard.json');
const enTasks = require('./locales/en/tasks.json');
const enTeam = require('./locales/en/team.json');
const enWallet = require('./locales/en/wallet.json');
const enLevels = require('./locales/en/levels.json');
const enNavigation = require('./locales/en/navigation.json');
const enPayment = require('./locales/en/payment.json');
const enCommission = require('./locales/en/commission.json');
const enAdmin = require('./locales/en/admin.json');

const amCommon = require('./locales/am/common.json');
const amAuth = require('./locales/am/auth.json');
const amDashboard = require('./locales/am/dashboard.json');
const amTasks = require('./locales/am/tasks.json');
const amTeam = require('./locales/am/team.json');
const amWallet = require('./locales/am/wallet.json');
const amLevels = require('./locales/am/levels.json');
const amNavigation = require('./locales/am/navigation.json');
const amPayment = require('./locales/am/payment.json');
const amCommission = require('./locales/am/commission.json');
const amAdmin = require('./locales/am/admin.json');

/**
 * Supported languages
 */
const SUPPORTED_LANGUAGES = Object.freeze({
  EN: 'en',
  AM: 'am'
});

/**
 * Default language
 */
const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.EN;

/**
 * Initialize i18next with translations
 */
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard,
        tasks: enTasks,
        team: enTeam,
        wallet: enWallet,
        levels: enLevels,
        navigation: enNavigation,
        payment: enPayment,
        commission: enCommission,
        admin: enAdmin
      },
      am: {
        common: amCommon,
        auth: amAuth,
        dashboard: amDashboard,
        tasks: amTasks,
        team: amTeam,
        wallet: amWallet,
        levels: amLevels,
        navigation: amNavigation,
        payment: amPayment,
        commission: amCommission,
        admin: amAdmin
      }
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: Object.values(SUPPORTED_LANGUAGES),
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

/**
 * Change the current language
 * 
 * @param {string} language - Language code ('en' or 'am')
 */
function changeLanguage(language) {
  if (!Object.values(SUPPORTED_LANGUAGES).includes(language)) {
    throw new Error(`Unsupported language: ${language}`);
  }
  
  return i18n.changeLanguage(language);
}

/**
 * Get the current language
 * 
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
  return i18n.language || DEFAULT_LANGUAGE;
}

/**
 * Check if a language is supported
 * 
 * @param {string} language - Language code to check
 * @returns {boolean} True if language is supported
 */
function isSupportedLanguage(language) {
  return Object.values(SUPPORTED_LANGUAGES).includes(language);
}

/**
 * Translate a key
 * 
 * @param {string} key - Translation key
 * @param {object} options - Translation options
 * @returns {string} Translated text
 */
function translate(key, options = {}) {
  return i18n.t(key, options);
}

module.exports = {
  i18n,
  changeLanguage,
  getCurrentLanguage,
  isSupportedLanguage,
  translate,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE
};