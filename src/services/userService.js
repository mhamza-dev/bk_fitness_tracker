/**
 * User Service
 * Handles user authentication and user management operations via API
 */

import { authAPI } from './api.js';

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  try {
    return await authAPI.register(userData);
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  try {
    return await authAPI.login(email, password);
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    return await authAPI.getCurrentUser();
  } catch (error) {
    throw error;
  }
};

/**
 * Change user password
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    return await authAPI.changePassword(currentPassword, newPassword);
  } catch (error) {
    throw error;
  }
};
