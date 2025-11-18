/**
 * Auth Context
 * Manages authentication state across the app
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken, removeAuthToken, setAuthToken, authAPI } from '../services/api.js';

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

  /**
   * Check if user is authenticated on app start
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken();

      if (token) {
        // Ensure token is set in axios defaults
        await setAuthToken(token);

        // Verify token by fetching current user
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData.user || userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, remove it
          console.error('Token validation failed:', error);
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
      console.log('AuthContext.login called with:', { userData, hasToken: !!token });

      // Ensure token is stored (it should already be stored by API service, but double-check)
      if (token) {
        await setAuthToken(token);
        console.log('Token stored successfully');
      }

      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      console.log('Auth state updated - isAuthenticated set to true');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Call logout API (optional - backend may handle token invalidation)
      try {
        await authAPI.logout();
      } catch (error) {
        console.error('Logout API error:', error);
        // Continue with local logout even if API fails
      }

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
  };

  /**
   * Update user data
   */
  const updateUser = (userData) => {
    setUser(userData);
  };

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

