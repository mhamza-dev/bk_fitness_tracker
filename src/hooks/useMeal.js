/**
 * useMeal Hook
 * Custom hook for meal operations
 */

import { useState, useCallback } from 'react';
import { mealAPI } from '../services/api';

export const useMeal = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMeal = useCallback(async (mealData) => {
    try {
      setLoading(true);
      setError(null);
      return await mealAPI.createMeal(mealData);
    } catch (err) {
      const errorMessage = err.message || 'Failed to create meal.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMealById = useCallback(async (mealId) => {
    try {
      setLoading(true);
      setError(null);
      return await mealAPI.getMealById(mealId);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch meal.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserMeals = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await mealAPI.getUserMeals(filters);
      setMeals(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch meals.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMealsByDate = useCallback(async (date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await mealAPI.getMealsByDate(date);
      setMeals(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch meals for date.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDailyNutrition = useCallback(async (date) => {
    try {
      setLoading(true);
      setError(null);
      return await mealAPI.getDailyNutrition(date);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch daily nutrition.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMeal = useCallback(async (mealId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      return await mealAPI.updateMeal(mealId, updateData);
    } catch (err) {
      const errorMessage = err.message || 'Failed to update meal.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMeal = useCallback(async (mealId) => {
    try {
      setLoading(true);
      setError(null);
      await mealAPI.deleteMeal(mealId);
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete meal.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNutritionSummary = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      return await mealAPI.getNutritionSummary(startDate, endDate);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch nutrition summary.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    meals,
    loading,
    error,
    createMeal,
    getMealById,
    getUserMeals,
    getMealsByDate,
    getDailyNutrition,
    updateMeal,
    deleteMeal,
    getNutritionSummary,
  };
};

