/**
 * Profile Store
 * Zustand store for profile state management with caching
 */

import { create } from 'zustand';
import { profileAPI } from '../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProfileStore = create((set, get) => ({
    profile: null,
    loading: false,
    error: null,
    lastFetched: null,

    // Check if cache is still valid
    isCacheValid: () => {
        const { lastFetched } = get();
        if (!lastFetched) return false;
        return Date.now() - lastFetched < CACHE_DURATION;
    },

    // Fetch profile (only if cache is invalid)
    fetchProfile: async (force = false) => {
        const { isCacheValid, profile } = get();

        // Return cached data if valid and not forcing refresh
        if (!force && isCacheValid() && profile) {
            return profile;
        }

        try {
            set({ loading: true, error: null });
            const data = await profileAPI.getProfile();
            set({
                profile: data,
                loading: false,
                lastFetched: Date.now(),
                error: null
            });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch profile.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Update profile (optimistically updates store)
    updateProfile: async (profileData) => {
        try {
            set({ loading: true, error: null });
            const data = await profileAPI.updateProfile(profileData);
            set({
                profile: data,
                loading: false,
                lastFetched: Date.now(),
                error: null
            });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to update profile.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Create or update profile
    createOrUpdateProfile: async (profileData) => {
        try {
            set({ loading: true, error: null });
            const data = await profileAPI.createOrUpdateProfile(profileData);
            set({
                profile: data,
                loading: false,
                lastFetched: Date.now(),
                error: null
            });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to save profile.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Add allergy
    addAllergy: async (allergy) => {
        try {
            set({ loading: true, error: null });
            const data = await profileAPI.addAllergy(allergy);
            // Refresh profile after adding allergy
            await get().fetchProfile(true);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to add allergy.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Remove allergy
    removeAllergy: async (allergyName) => {
        try {
            set({ loading: true, error: null });
            const data = await profileAPI.removeAllergy(allergyName);
            // Refresh profile after removing allergy
            await get().fetchProfile(true);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to remove allergy.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Add physical issue
    addPhysicalIssue: async (physicalIssue) => {
        try {
            set({ loading: true, error: null });
            const data = await profileAPI.addPhysicalIssue(physicalIssue);
            // Refresh profile after adding physical issue
            await get().fetchProfile(true);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to add physical issue.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Remove physical issue
    removePhysicalIssue: async (issueName) => {
        try {
            set({ loading: true, error: null });
            const data = await profileAPI.removePhysicalIssue(issueName);
            // Refresh profile after removing physical issue
            await get().fetchProfile(true);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to remove physical issue.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Update weight and height
    updateWeightHeight: async (weight, height, weightUnit, heightUnit) => {
        try {
            set({ loading: true, error: null });
            const data = await profileAPI.updateWeightHeight(weight, height, weightUnit, heightUnit);
            // Refresh profile after updating weight/height
            await get().fetchProfile(true);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to update weight and height.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Clear profile (useful for logout)
    clearProfile: () => {
        set({
            profile: null,
            lastFetched: null,
            error: null
        });
    },
}));

