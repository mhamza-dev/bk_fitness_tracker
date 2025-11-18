/**
 * useFitnessData Hook
 * Custom hook for fitness data operations
 */

import { useState, useCallback } from 'react';
import { fitnessDataAPI } from '../services/api';

export const useFitnessData = () => {
  const [fitnessData, setFitnessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrUpdateFitnessData = useCallback(async (date, fitnessData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fitnessDataAPI.createOrUpdateFitnessData(date, fitnessData);
      setFitnessData(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to save fitness data.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFitnessDataById = useCallback(async (dataId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fitnessDataAPI.getFitnessDataById(dataId);
      setFitnessData(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch fitness data.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFitnessDataByDate = useCallback(async (date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fitnessDataAPI.getFitnessDataByDate(date);
      setFitnessData(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch fitness data for date.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFitnessDataRange = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      return await fitnessDataAPI.getFitnessDataRange(startDate, endDate);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch fitness data range.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSteps = useCallback(async (date, steps) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fitnessDataAPI.updateSteps(date, steps);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update steps.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addWorkout = useCallback(async (date, workout) => {
    try {
      setLoading(true);
      setError(null);
      return await fitnessDataAPI.addWorkout(date, workout);
    } catch (err) {
      const errorMessage = err.message || 'Failed to add workout.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWaterIntake = useCallback(async (date, waterIntake, waterUnit = 'ml') => {
    try {
      setLoading(true);
      setError(null);
      return await fitnessDataAPI.updateWaterIntake(date, waterIntake, waterUnit);
    } catch (err) {
      const errorMessage = err.message || 'Failed to update water intake.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSleep = useCallback(async (date, sleepHours, sleepQuality) => {
    try {
      setLoading(true);
      setError(null);
      return await fitnessDataAPI.updateSleep(date, sleepHours, sleepQuality);
    } catch (err) {
      const errorMessage = err.message || 'Failed to update sleep data.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFitnessStats = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      return await fitnessDataAPI.getFitnessStats(startDate, endDate);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch fitness stats.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFitnessData = useCallback(async (dataId) => {
    try {
      setLoading(true);
      setError(null);
      await fitnessDataAPI.deleteFitnessData(dataId);
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete fitness data.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fitnessData,
    loading,
    error,
    createOrUpdateFitnessData,
    getFitnessDataById,
    getFitnessDataByDate,
    getFitnessDataRange,
    updateSteps,
    addWorkout,
    updateWaterIntake,
    updateSleep,
    getFitnessStats,
    deleteFitnessData,
  };
};

