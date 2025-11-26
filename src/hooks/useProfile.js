/**
 * useProfile Hook
 * Custom hook for profile operations using Zustand store
 */

import { useProfileStore } from '../stores/useProfileStore';

export const useProfile = () => {
  const {
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
  } = useProfileStore();

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

