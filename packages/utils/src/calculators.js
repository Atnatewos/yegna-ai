/**
 * File: packages/utils/src/calculators.js
 * Yegna AI - Calculation Utilities
 * 
 * Provides calculation functions for earnings, commissions,
 * and other financial computations.
 */

/**
 * Calculate daily income for a level
 * 
 * @param {number} tasksPerDay - Number of tasks per day
 * @param {number} incomePerTask - Income per task
 * @returns {number} Total daily income
 */
function calculateDailyIncome(tasksPerDay, incomePerTask) {
  return tasksPerDay * incomePerTask;
}

/**
 * Calculate monthly income for a level
 * 
 * @param {number} dailyIncome - Daily income amount
 * @returns {number} Total monthly income (30 days)
 */
function calculateMonthlyIncome(dailyIncome) {
  return dailyIncome * 30;
}

/**
 * Calculate direct referral commission
 * 
 * @param {number} depositAmount - Amount deposited by referral
 * @param {number} commissionPercentage - Commission percentage
 * @returns {number} Commission amount
 */
function calculateDirectReferralCommission(depositAmount, commissionPercentage) {
  return (depositAmount * commissionPercentage) / 100;
}

/**
 * Calculate team task commission
 * 
 * @param {number} taskReward - Reward amount from task
 * @param {number} commissionPercentage - Commission percentage
 * @returns {number} Commission amount
 */
function calculateTeamTaskCommission(taskReward, commissionPercentage) {
  return (taskReward * commissionPercentage) / 100;
}

/**
 * Calculate withdrawal fee
 * 
 * @param {number} amount - Withdrawal amount
 * @param {number} feePercentage - Fee percentage
 * @returns {number} Fee amount
 */
function calculateWithdrawalFee(amount, feePercentage) {
  return (amount * feePercentage) / 100;
}

/**
 * Calculate net withdrawal amount (after fee)
 * 
 * @param {number} amount - Withdrawal amount
 * @param {number} feePercentage - Fee percentage
 * @returns {number} Net amount after fee
 */
function calculateNetWithdrawal(amount, feePercentage) {
  const fee = calculateWithdrawalFee(amount, feePercentage);
  return amount - fee;
}

/**
 * Calculate total team commission from all levels
 * 
 * @param {Array<object>} levelCommissions - Array of level commission data
 * @returns {number} Total commission amount
 */
function calculateTotalTeamCommission(levelCommissions) {
  return levelCommissions.reduce((total, level) => {
    return total + (level.amount || 0);
  }, 0);
}

/**
 * Calculate percentage of a number
 * 
 * @param {number} value - Base value
 * @param {number} percentage - Percentage to calculate
 * @returns {number} Percentage value
 */
function calculatePercentage(value, percentage) {
  return (value * percentage) / 100;
}

/**
 * Calculate progress percentage
 * 
 * @param {number} completed - Completed amount
 * @param {number} total - Total amount
 * @returns {number} Progress percentage (0-100)
 */
function calculateProgressPercentage(completed, total) {
  if (total === 0) return 0;
  
  return Math.min(Math.round((completed / total) * 100), 100);
}

module.exports = {
  calculateDailyIncome,
  calculateMonthlyIncome,
  calculateDirectReferralCommission,
  calculateTeamTaskCommission,
  calculateWithdrawalFee,
  calculateNetWithdrawal,
  calculateTotalTeamCommission,
  calculatePercentage,
  calculateProgressPercentage
};