/**
 * usePosts Hook
 * Custom hook for posts operations
 */

import { useState, useCallback } from 'react';
import { postsAPI } from '../services/api';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const getFeed = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = reset ? 1 : page;
      const data = await postsAPI.getFeed(currentPage, 20);
      
      if (reset) {
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setPage(2);
      } else {
        setPosts(prev => [...prev, ...(Array.isArray(data.posts) ? data.posts : [])]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(data.hasMore !== false && data.posts?.length > 0);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch feed.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [page]);

  const getUserPosts = useCallback(async (userId, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = reset ? 1 : page;
      const data = await postsAPI.getUserPosts(userId, currentPage, 20);
      
      if (reset) {
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setPage(2);
      } else {
        setPosts(prev => [...prev, ...(Array.isArray(data.posts) ? data.posts : [])]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(data.hasMore !== false && data.posts?.length > 0);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch user posts.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [page]);

  const getPostById = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);
      return await postsAPI.getPostById(postId);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch post.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsAPI.createPost(postData);
      // Add new post to the beginning of the list
      setPosts(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create post.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (postId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsAPI.updatePost(postId, updateData);
      // Update post in local state
      setPosts(prev => prev.map(post => 
        post._id === postId || post.id === postId ? { ...post, ...data } : post
      ));
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update post.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);
      await postsAPI.deletePost(postId);
      // Remove post from local state
      setPosts(prev => prev.filter(post => 
        (post._id !== postId && post.id !== postId)
      ));
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete post.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPagination = useCallback(() => {
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    posts,
    loading,
    error,
    hasMore,
    getFeed,
    getUserPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    resetPagination,
  };
};

