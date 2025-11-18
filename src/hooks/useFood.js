/**
 * useFood Hook
 * Custom hook for food operations
 */

import { useState, useCallback } from 'react';
import { foodAPI } from '../services/api';

export const useFood = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFoods = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await foodAPI.getFoods(filters);
      setFoods(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch foods.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFoodById = useCallback(async (foodId) => {
    try {
      setLoading(true);
      setError(null);
      return await foodAPI.getFoodById(foodId);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch food.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFoods = useCallback(async (searchTerm, limit = 20) => {
    try {
      setLoading(true);
      setError(null);
      const data = await foodAPI.searchFoods(searchTerm, limit);
      setFoods(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to search foods.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFoodsForProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await foodAPI.getFoodsForProfile();
      setFoods(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch foods for profile.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    foods,
    loading,
    error,
    getFoods,
    getFoodById,
    searchFoods,
    getFoodsForProfile,
  };
};

