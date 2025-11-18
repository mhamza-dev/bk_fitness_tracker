/**
 * Food Service
 * Handles food database operations via API
 */

import { foodAPI } from './api.js';

/**
 * Get all foods with optional filters
 */
export const getFoods = async (filters = {}) => {
  try {
    return await foodAPI.getFoods(filters);
  } catch (error) {
    throw error;
  }
};

/**
 * Get food by ID
 */
export const getFoodById = async (foodId) => {
  try {
    return await foodAPI.getFoodById(foodId);
  } catch (error) {
    throw error;
  }
};

/**
 * Get foods by name
 */
export const getFoodsByName = async (name) => {
  try {
    return await foodAPI.searchFoods(name);
  } catch (error) {
    throw error;
  }
};

/**
 * Get foods suitable for user profile
 */
export const getFoodsForProfile = async () => {
  try {
    return await foodAPI.getFoodsForProfile();
  } catch (error) {
    throw error;
  }
};

/**
 * Get foods by category
 */
export const getFoodsByCategory = async (category) => {
  try {
    return await foodAPI.getFoods({ category });
  } catch (error) {
    throw error;
  }
};

/**
 * Get foods by meal type
 */
export const getFoodsByMealType = async (mealType) => {
  try {
    return await foodAPI.getFoods({ mealType });
  } catch (error) {
    throw error;
  }
};

/**
 * Search foods
 */
export const searchFoods = async (searchTerm, limit = 20) => {
  try {
    return await foodAPI.searchFoods(searchTerm, limit);
  } catch (error) {
    throw error;
  }
};
