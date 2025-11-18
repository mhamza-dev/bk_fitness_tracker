/**
 * useWeight Hook
 * Custom hook for weight operations
 */

import { useState, useCallback } from 'react';
import { weightAPI } from '../services/api';

export const useWeight = () => {
  const [weights, setWeights] = useState([]);
  const [latestWeight, setLatestWeight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addWeightEntry = useCallback(async (weightData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await weightAPI.addWeightEntry(weightData);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to add weight entry.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeightById = useCallback(async (weightId) => {
    try {
      setLoading(true);
      setError(null);
      return await weightAPI.getWeightById(weightId);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch weight entry.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeightHistory = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await weightAPI.getWeightHistory(filters);
      setWeights(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch weight history.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLatestWeight = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weightAPI.getLatestWeight();
      setLatestWeight(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch latest weight.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeightStats = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      return await weightAPI.getWeightStats(startDate, endDate);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch weight stats.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWeight = useCallback(async (weightId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      return await weightAPI.updateWeight(weightId, updateData);
    } catch (err) {
      const errorMessage = err.message || 'Failed to update weight entry.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteWeight = useCallback(async (weightId) => {
    try {
      setLoading(true);
      setError(null);
      await weightAPI.deleteWeight(weightId);
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete weight entry.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeightProgress = useCallback(async (days = 30) => {
    try {
      setLoading(true);
      setError(null);
      return await weightAPI.getWeightProgress(days);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch weight progress.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    weights,
    latestWeight,
    loading,
    error,
    addWeightEntry,
    getWeightById,
    getWeightHistory,
    getLatestWeight,
    getWeightStats,
    updateWeight,
    deleteWeight,
    getWeightProgress,
  };
};

