/**
 * useAuthAPI Hook
 * Custom hook for authentication API operations
 * Note: This wraps the auth API calls and integrates with AuthContext
 */

import { useState, useCallback } from 'react';
import { authAPI } from '../services/api';
import { useAuth as useAuthContext } from '../contexts';

export const useAuthAPI = () => {
  const { login: loginContext, logout: logoutContext, user, isAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(email, password);
      
      // Extract user data and token from response
      const userData = response.user || (response.token ? { ...response, token: undefined } : response);
      const token = response.token;
      
      if (!token) {
        throw new Error('No authentication token received');
      }
      
      // Update auth context
      await loginContext(userData, token);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loginContext]);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      
      // If token is returned, automatically log in the user
      if (response.token && (response.user || response)) {
        const userDataFromResponse = response.user || response;
        await loginContext(userDataFromResponse, response.token);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loginContext]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await authAPI.logout();
      await logoutContext();
    } catch (err) {
      const errorMessage = err.message || 'Logout failed.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logoutContext]);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await authAPI.getCurrentUser();
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch user data.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      return await authAPI.changePassword(currentPassword, newPassword);
    } catch (err) {
      const errorMessage = err.message || 'Failed to change password.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    login,
    register,
    logout,
    getCurrentUser,
    changePassword,
    loading,
    error,
    user,
    isAuthenticated,
  };
};

