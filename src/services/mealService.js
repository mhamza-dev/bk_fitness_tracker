/**
 * Meal Service
 * Handles meal tracking operations via API
 */

import { mealAPI } from './api.js';

/**
 * Create a meal entry
 */
export const createMeal = async (mealData) => {
  try {
    return await mealAPI.createMeal(mealData);
  } catch (error) {
    throw error;
  }
};

/**
 * Get meal by ID
 */
export const getMealById = async (mealId) => {
  try {
    return await mealAPI.getMealById(mealId);
  } catch (error) {
    throw error;
  }
};

/**
 * Get meals for a user
 */
export const getUserMeals = async (filters = {}) => {
  try {
    return await mealAPI.getUserMeals(filters);
  } catch (error) {
    throw error;
  }
};

/**
 * Get meals for a specific date
 */
export const getMealsByDate = async (date) => {
  try {
    return await mealAPI.getMealsByDate(date);
  } catch (error) {
    throw error;
  }
};

/**
 * Get daily nutrition summary
 */
export const getDailyNutrition = async (date) => {
  try {
    return await mealAPI.getDailyNutrition(date);
  } catch (error) {
    throw error;
  }
};

/**
 * Update meal
 */
export const updateMeal = async (mealId, updateData) => {
  try {
    return await mealAPI.updateMeal(mealId, updateData);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete meal
 */
export const deleteMeal = async (mealId) => {
  try {
    return await mealAPI.deleteMeal(mealId);
  } catch (error) {
    throw error;
  }
};

/**
 * Get nutrition summary for date range
 */
export const getNutritionSummary = async (startDate, endDate) => {
  try {
    return await mealAPI.getNutritionSummary(startDate, endDate);
  } catch (error) {
    throw error;
  }
};
