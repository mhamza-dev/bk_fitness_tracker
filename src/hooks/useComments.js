/**
 * useComments Hook
 * Custom hook for comments operations
 */

import { useState, useCallback } from 'react';
import { commentsAPI } from '../services/api';

export const useComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPostComments = useCallback(async (postId, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentsAPI.getPostComments(postId, page, 50);
      setComments(Array.isArray(data.comments) ? data.comments : []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch comments.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCommentReplies = useCallback(async (commentId, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      return await commentsAPI.getCommentReplies(commentId, page, 20);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch comment replies.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createComment = useCallback(async (commentData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentsAPI.createComment(commentData);
      // Add comment to local state
      setComments(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create comment.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateComment = useCallback(async (commentId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentsAPI.updateComment(commentId, updateData);
      // Update comment in local state
      setComments(prev => prev.map(comment => 
        (comment._id === commentId || comment.id === commentId) ? { ...comment, ...data } : comment
      ));
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update comment.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (commentId) => {
    try {
      setLoading(true);
      setError(null);
      await commentsAPI.deleteComment(commentId);
      // Remove comment from local state
      setComments(prev => prev.filter(comment => 
        (comment._id !== commentId && comment.id !== commentId)
      ));
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete comment.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearComments = useCallback(() => {
    setComments([]);
  }, []);

  return {
    comments,
    loading,
    error,
    getPostComments,
    getCommentReplies,
    createComment,
    updateComment,
    deleteComment,
    clearComments,
  };
};

