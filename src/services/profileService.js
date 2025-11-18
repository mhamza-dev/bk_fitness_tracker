/**
 * Profile Service
 * Handles user profile operations via API
 */

import { profileAPI } from './api.js';

/**
 * Create or update user profile
 */
export const createOrUpdateProfile = async (profileData) => {
  try {
    return await profileAPI.createOrUpdateProfile(profileData);
  } catch (error) {
    throw error;
  }
};

/**
 * Get user profile
 */
export const getProfile = async () => {
  try {
    return await profileAPI.getProfile();
  } catch (error) {
    throw error;
  }
};

/**
 * Get profile for diet suggestions
 */
export const getDietProfile = async () => {
  try {
    const profile = await profileAPI.getProfile();
    // The backend should return the formatted diet profile
    return profile;
  } catch (error) {
    throw error;
  }
};

/**
 * Update profile fields
 */
export const updateProfile = async (profileData) => {
  try {
    return await profileAPI.updateProfile(profileData);
  } catch (error) {
    throw error;
  }
};

/**
 * Add allergy to profile
 */
export const addAllergy = async (allergy) => {
  try {
    return await profileAPI.addAllergy(allergy);
  } catch (error) {
    throw error;
  }
};

/**
 * Remove allergy from profile
 */
export const removeAllergy = async (allergyName) => {
  try {
    return await profileAPI.removeAllergy(allergyName);
  } catch (error) {
    throw error;
  }
};

/**
 * Add physical issue to profile
 */
export const addPhysicalIssue = async (physicalIssue) => {
  try {
    return await profileAPI.addPhysicalIssue(physicalIssue);
  } catch (error) {
    throw error;
  }
};

/**
 * Remove physical issue from profile
 */
export const removePhysicalIssue = async (issueName) => {
  try {
    return await profileAPI.removePhysicalIssue(issueName);
  } catch (error) {
    throw error;
  }
};

/**
 * Update weight and height
 */
export const updateWeightHeight = async (weight, height, weightUnit, heightUnit) => {
  try {
    return await profileAPI.updateWeightHeight(weight, height, weightUnit, heightUnit);
  } catch (error) {
    throw error;
  }
};
