/**
 * useWeight Hook
 * Custom hook for weight operations using Zustand store
 */

import { useWeightStore } from '../stores/useWeightStore';

export const useWeight = () => {
  const {
    weights,
    latestWeight,
    loading,
    error,
    addWeightEntry,
    getWeightById,
    fetchWeightHistory,
    fetchLatestWeight,
    getWeightStats,
    updateWeight,
    deleteWeight,
    getWeightProgress,
  } = useWeightStore();

  // Wrapper functions to maintain API compatibility
  const getWeightHistory = async (filters = {}, force = false) => {
    return await fetchWeightHistory(filters, force);
  };

  const getLatestWeight = async (force = false) => {
    return await fetchLatestWeight(force);
  };

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

