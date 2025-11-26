/**
 * Weight Store
 * Zustand store for weight state management with caching
 */

import { create } from 'zustand';
import { weightAPI } from '../services/api';

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (shorter for weight data)

export const useWeightStore = create((set, get) => ({
    weights: [],
    latestWeight: null,
    loading: false,
    error: null,
    lastFetched: null,

    // Check if cache is still valid
    isCacheValid: () => {
        const { lastFetched } = get();
        if (!lastFetched) return false;
        return Date.now() - lastFetched < CACHE_DURATION;
    },

    // Fetch weight history (only if cache is invalid)
    fetchWeightHistory: async (filters = {}, force = false) => {
        const { isCacheValid, weights } = get();
        
        // Return cached data if valid and not forcing refresh
        if (!force && isCacheValid() && weights.length > 0) {
            return weights;
        }

        try {
            set({ loading: true, error: null });
            const data = await weightAPI.getWeightHistory(filters);
            const weightArray = Array.isArray(data) ? data : [];
            set({ 
                weights: weightArray, 
                loading: false, 
                lastFetched: Date.now(),
                error: null 
            });
            return weightArray;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch weight history.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Fetch latest weight (only if cache is invalid)
    fetchLatestWeight: async (force = false) => {
        const { isCacheValid, latestWeight } = get();
        
        // Return cached data if valid and not forcing refresh
        if (!force && isCacheValid() && latestWeight) {
            return latestWeight;
        }

        try {
            set({ loading: true, error: null });
            const data = await weightAPI.getLatestWeight();
            set({ 
                latestWeight: data, 
                loading: false, 
                lastFetched: Date.now(),
                error: null 
            });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch latest weight.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Add weight entry
    addWeightEntry: async (weightData) => {
        try {
            set({ loading: true, error: null });
            const data = await weightAPI.addWeightEntry(weightData);
            // Invalidate cache and refresh
            await get().fetchLatestWeight(true);
            await get().fetchWeightHistory({}, true);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to add weight entry.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Get weight by ID (no caching for individual entries)
    getWeightById: async (weightId) => {
        try {
            set({ loading: true, error: null });
            const data = await weightAPI.getWeightById(weightId);
            set({ loading: false, error: null });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch weight entry.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Get weight stats (no caching)
    getWeightStats: async (startDate, endDate) => {
        try {
            set({ loading: true, error: null });
            const data = await weightAPI.getWeightStats(startDate, endDate);
            set({ loading: false, error: null });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch weight stats.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Update weight entry
    updateWeight: async (weightId, updateData) => {
        try {
            set({ loading: true, error: null });
            const data = await weightAPI.updateWeight(weightId, updateData);
            // Invalidate cache and refresh
            await get().fetchLatestWeight(true);
            await get().fetchWeightHistory({}, true);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to update weight entry.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Delete weight entry
    deleteWeight: async (weightId) => {
        try {
            set({ loading: true, error: null });
            await weightAPI.deleteWeight(weightId);
            // Invalidate cache and refresh
            await get().fetchLatestWeight(true);
            await get().fetchWeightHistory({}, true);
        } catch (err) {
            const errorMessage = err.message || 'Failed to delete weight entry.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Get weight progress (no caching)
    getWeightProgress: async (days = 30) => {
        try {
            set({ loading: true, error: null });
            const data = await weightAPI.getWeightProgress(days);
            set({ loading: false, error: null });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch weight progress.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Clear weight data (useful for logout)
    clearWeight: () => {
        set({ 
            weights: [], 
            latestWeight: null,
            lastFetched: null, 
            error: null 
        });
    },
}));

