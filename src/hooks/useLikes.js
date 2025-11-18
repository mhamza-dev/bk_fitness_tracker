/**
 * useLikes Hook
 * Custom hook for likes operations
 */

import { useState, useCallback } from 'react';
import { likesAPI } from '../services/api';

export const useLikes = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPostLikes = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await likesAPI.getPostLikes(postId);
      setLikes(Array.isArray(data.likes) ? data.likes : []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch likes.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const likePost = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await likesAPI.likePost(postId);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to like post.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const likeComment = useCallback(async (commentId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await likesAPI.likeComment(commentId);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to like comment.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikePost = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);
      await likesAPI.unlikePost(postId);
    } catch (err) {
      const errorMessage = err.message || 'Failed to unlike post.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikeComment = useCallback(async (commentId) => {
    try {
      setLoading(true);
      setError(null);
      await likesAPI.unlikeComment(commentId);
    } catch (err) {
      const errorMessage = err.message || 'Failed to unlike comment.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    likes,
    loading,
    error,
    getPostLikes,
    likePost,
    likeComment,
    unlikePost,
    unlikeComment,
  };
};

