/**
 * useProfile Hook
 * Custom hook for profile operations
 */

import { useState, useCallback, useEffect } from 'react';
import { profileAPI } from '../services/api';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.getProfile();
      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch profile.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrUpdateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.createOrUpdateProfile(profileData);
      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to save profile.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.updateProfile(profileData);
      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addAllergy = useCallback(async (allergy) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.addAllergy(allergy);
      await fetchProfile(); // Refresh profile
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to add allergy.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const removeAllergy = useCallback(async (allergyName) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.removeAllergy(allergyName);
      await fetchProfile(); // Refresh profile
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove allergy.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const addPhysicalIssue = useCallback(async (physicalIssue) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.addPhysicalIssue(physicalIssue);
      await fetchProfile(); // Refresh profile
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to add physical issue.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const removePhysicalIssue = useCallback(async (issueName) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.removePhysicalIssue(issueName);
      await fetchProfile(); // Refresh profile
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove physical issue.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const updateWeightHeight = useCallback(async (weight, height, weightUnit, heightUnit) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.updateWeightHeight(weight, height, weightUnit, heightUnit);
      await fetchProfile(); // Refresh profile
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update weight and height.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createOrUpdateProfile,
    updateProfile,
    addAllergy,
    removeAllergy,
    addPhysicalIssue,
    removePhysicalIssue,
    updateWeightHeight,
  };
};

