/**
 * Diet Plan Service
 * Handles diet plan operations via API
 */

import { dietPlanAPI } from './api.js';

/**
 * Create a new diet plan
 */
export const createDietPlan = async (planData) => {
    try {
        return await dietPlanAPI.createDietPlan(planData);
    } catch (error) {
        throw error;
    }
};

/**
 * Get diet plan by ID
 */
export const getDietPlanById = async (planId) => {
    try {
        return await dietPlanAPI.getDietPlanById(planId);
    } catch (error) {
        throw error;
    }
};

/**
 * Get user's active diet plan
 */
export const getActiveDietPlan = async () => {
    try {
        return await dietPlanAPI.getActiveDietPlan();
    } catch (error) {
        throw error;
    }
};

/**
 * Get all diet plans for a user
 */
export const getUserDietPlans = async (options = {}) => {
    try {
        return await dietPlanAPI.getUserDietPlans(options);
    } catch (error) {
        throw error;
    }
};

/**
 * Update diet plan
 */
export const updateDietPlan = async (planId, updateData) => {
    try {
        return await dietPlanAPI.updateDietPlan(planId, updateData);
    } catch (error) {
        throw error;
    }
};

/**
 * Deactivate diet plan
 */
export const deactivateDietPlan = async (planId) => {
    try {
        return await dietPlanAPI.deactivateDietPlan(planId);
    } catch (error) {
        throw error;
    }
};

/**
 * Generate diet plan suggestions based on user profile
 */
export const generateDietPlanSuggestions = async () => {
    try {
        return await dietPlanAPI.generateDietPlanSuggestions();
    } catch (error) {
        throw error;
    }
};

/**
 * Delete diet plan
 */
export const deleteDietPlan = async (planId) => {
    try {
        return await dietPlanAPI.deleteDietPlan(planId);
    } catch (error) {
        throw error;
    }
};
