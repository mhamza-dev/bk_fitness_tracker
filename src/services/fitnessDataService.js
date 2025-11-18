/**
 * Fitness Data Service
 * Handles daily fitness tracking operations via API
 */

import { fitnessDataAPI } from './api.js';

/**
 * Create or update fitness data for a date
 */
export const createOrUpdateFitnessData = async (date, fitnessData) => {
  try {
    return await fitnessDataAPI.createOrUpdateFitnessData(date, fitnessData);
  } catch (error) {
    throw error;
  }
};

/**
 * Get fitness data by ID
 */
export const getFitnessDataById = async (dataId) => {
  try {
    return await fitnessDataAPI.getFitnessDataById(dataId);
  } catch (error) {
    throw error;
  }
};

/**
 * Get fitness data for a specific date
 */
export const getFitnessDataByDate = async (date) => {
  try {
    return await fitnessDataAPI.getFitnessDataByDate(date);
  } catch (error) {
    throw error;
  }
};

/**
 * Get fitness data for date range
 */
export const getFitnessDataRange = async (startDate, endDate) => {
  try {
    return await fitnessDataAPI.getFitnessDataRange(startDate, endDate);
  } catch (error) {
    throw error;
  }
};

/**
 * Update steps
 */
export const updateSteps = async (date, steps) => {
  try {
    return await fitnessDataAPI.updateSteps(date, steps);
  } catch (error) {
    throw error;
  }
};

/**
 * Add workout
 */
export const addWorkout = async (date, workout) => {
  try {
    return await fitnessDataAPI.addWorkout(date, workout);
  } catch (error) {
    throw error;
  }
};

/**
 * Update water intake
 */
export const updateWaterIntake = async (date, waterIntake, waterUnit = 'ml') => {
  try {
    return await fitnessDataAPI.updateWaterIntake(date, waterIntake, waterUnit);
  } catch (error) {
    throw error;
  }
};

/**
 * Update sleep data
 */
export const updateSleep = async (date, sleepHours, sleepQuality) => {
  try {
    return await fitnessDataAPI.updateSleep(date, sleepHours, sleepQuality);
  } catch (error) {
    throw error;
  }
};

/**
 * Get fitness statistics
 */
export const getFitnessStats = async (startDate, endDate) => {
  try {
    return await fitnessDataAPI.getFitnessStats(startDate, endDate);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete fitness data
 */
export const deleteFitnessData = async (dataId) => {
  try {
    return await fitnessDataAPI.deleteFitnessData(dataId);
  } catch (error) {
    throw error;
  }
};
