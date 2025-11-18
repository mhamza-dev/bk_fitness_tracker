/**
 * Weight Service
 * Handles weight tracking operations via API
 */

import { weightAPI } from './api.js';

/**
 * Add weight entry
 */
export const addWeightEntry = async (weightData) => {
  try {
    return await weightAPI.addWeightEntry(weightData);
  } catch (error) {
    throw error;
  }
};

/**
 * Get weight entry by ID
 */
export const getWeightById = async (weightId) => {
  try {
    return await weightAPI.getWeightById(weightId);
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's weight history
 */
export const getWeightHistory = async (options = {}) => {
  try {
    return await weightAPI.getWeightHistory(options);
  } catch (error) {
    throw error;
  }
};

/**
 * Get latest weight entry
 */
export const getLatestWeight = async () => {
  try {
    return await weightAPI.getLatestWeight();
  } catch (error) {
    throw error;
  }
};

/**
 * Get weight statistics
 */
export const getWeightStats = async (startDate, endDate) => {
  try {
    return await weightAPI.getWeightStats(startDate, endDate);
  } catch (error) {
    throw error;
  }
};

/**
 * Update weight entry
 */
export const updateWeight = async (weightId, updateData) => {
  try {
    return await weightAPI.updateWeight(weightId, updateData);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete weight entry
 */
export const deleteWeight = async (weightId) => {
  try {
    return await weightAPI.deleteWeight(weightId);
  } catch (error) {
    throw error;
  }
};

/**
 * Get weight progress chart data
 */
export const getWeightProgress = async (days = 30) => {
  try {
    return await weightAPI.getWeightProgress(days);
  } catch (error) {
    throw error;
  }
};
