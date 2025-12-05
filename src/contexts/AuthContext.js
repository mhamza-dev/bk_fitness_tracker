/**
 * Auth Context
 * Manages authentication state across the app
 */

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getAuthToken, removeAuthToken, setAuthToken, authAPI, getAuthEventEmitter, initializeAuthToken } from '../services/api.js';
import {
  useProfileStore,
  useNotificationPreferencesStore,
  useWeightStore
} from '../stores';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);


  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      // Initialize token in axios headers from AsyncStorage
      await initializeAuthToken();
      const token = await getAuthToken();

      if (token) {
        // Ensure token is set in axios defaults
        await setAuthToken(token);

        // Verify token by fetching current user
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData.user || userData);
          setIsAuthenticated(true);
        } catch (_error) {
          await removeAuthToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // Ensure axios defaults are cleared if no token
        await removeAuthToken();
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (userData, token) => {
    try {
      // Ensure token is stored (it should already be stored by API service, but double-check)
      if (token) {
        await setAuthToken(token);
      }

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      // Call logout API (optional - backend may handle token invalidation)
      try {
        await authAPI.logout();
      } catch (error) {
        console.error('Logout API error:', error);
        // Continue with local logout even if API fails
      }

      // Clear all Zustand stores
      useProfileStore.getState().clearProfile();
      useNotificationPreferencesStore.getState().clearPreferences();
      useWeightStore.getState().clearWeight();

      // Remove token and clear state
      await removeAuthToken();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if API call fails
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  /**
   * Update user data
   */
  const updateUser = (userData) => {
    setUser(userData);
  };

  /**
   * Check if user is authenticated on app start
   */
  useEffect(() => {
    checkAuthStatus();

    // Listen for unauthorized events from API service
    const authEventEmitter = getAuthEventEmitter();
    const handleUnauthorized = () => {
      console.log('Unauthorized event received, logging out user');
      logout();
    };

    authEventEmitter.on('unauthorized', handleUnauthorized);

    // Cleanup listener on unmount
    return () => {
      authEventEmitter.off('unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

