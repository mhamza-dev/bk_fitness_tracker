/**
 * useFollow Hook
 * Custom hook for follow operations
 */

import { useState, useCallback } from 'react';
import { followAPI } from '../services/api';

export const useFollow = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFollowStatus = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await followAPI.getFollowStatus(userId);
      setIsFollowing(data.isFollowing || false);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to check follow status.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFollowers = useCallback(async (userId, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await followAPI.getFollowers(userId, page, 20);
      setFollowers(Array.isArray(data.followers) ? data.followers : []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch followers.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFollowing = useCallback(async (userId, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await followAPI.getFollowing(userId, page, 20);
      setFollowing(Array.isArray(data.following) ? data.following : []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch following.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const followUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      await followAPI.followUser(userId);
      setIsFollowing(true);
    } catch (err) {
      const errorMessage = err.message || 'Failed to follow user.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unfollowUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      await followAPI.unfollowUser(userId);
      setIsFollowing(false);
    } catch (err) {
      const errorMessage = err.message || 'Failed to unfollow user.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    followers,
    following,
    isFollowing,
    loading,
    error,
    getFollowStatus,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
  };
};

