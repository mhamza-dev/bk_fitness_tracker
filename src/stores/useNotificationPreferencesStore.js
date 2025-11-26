/**
 * Notification Preferences Store
 * Zustand store for notification preferences state management with caching
 */

import { create } from 'zustand';
import { notificationPreferencesAPI } from '../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useNotificationPreferencesStore = create((set, get) => ({
    preferences: null,
    loading: false,
    error: null,
    lastFetched: null,

    // Check if cache is still valid
    isCacheValid: () => {
        const { lastFetched } = get();
        if (!lastFetched) return false;
        return Date.now() - lastFetched < CACHE_DURATION;
    },

    // Fetch preferences (only if cache is invalid)
    fetchPreferences: async (force = false) => {
        const { isCacheValid, preferences } = get();
        
        // Return cached data if valid and not forcing refresh
        if (!force && isCacheValid() && preferences) {
            return preferences;
        }

        try {
            set({ loading: true, error: null });
            const data = await notificationPreferencesAPI.getNotificationPreferences();
            set({ 
                preferences: data, 
                loading: false, 
                lastFetched: Date.now(),
                error: null 
            });
            return data;
        } catch (err) {
            // If 404, preferences don't exist yet - that's okay
            if (err.response?.status === 404) {
                set({ 
                    preferences: null, 
                    loading: false, 
                    lastFetched: Date.now(),
                    error: null 
                });
                return null;
            }
            const errorMessage = err.message || 'Failed to fetch notification preferences.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Create preferences
    createPreferences: async (preferencesData) => {
        try {
            set({ loading: true, error: null });
            const data = await notificationPreferencesAPI.createNotificationPreferences(preferencesData);
            set({ 
                preferences: data, 
                loading: false, 
                lastFetched: Date.now(),
                error: null 
            });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to create notification preferences.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Update preferences
    updatePreferences: async (preferencesData) => {
        try {
            set({ loading: true, error: null });
            const data = await notificationPreferencesAPI.updateNotificationPreferences(preferencesData);
            set({ 
                preferences: data, 
                loading: false, 
                lastFetched: Date.now(),
                error: null 
            });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to update notification preferences.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Delete preferences
    deletePreferences: async () => {
        try {
            set({ loading: true, error: null });
            await notificationPreferencesAPI.deleteNotificationPreferences();
            set({ 
                preferences: null, 
                loading: false, 
                lastFetched: null,
                error: null 
            });
        } catch (err) {
            const errorMessage = err.message || 'Failed to delete notification preferences.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Clear preferences (useful for logout)
    clearPreferences: () => {
        set({ 
            preferences: null, 
            lastFetched: null, 
            error: null 
        });
    },
}));

