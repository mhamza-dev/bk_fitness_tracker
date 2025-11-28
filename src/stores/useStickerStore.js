/**
 * Sticker Store
 * Zustand store for sticker state management with AsyncStorage persistence
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchResourcesFromFolder } from '../services/cloudinaryService';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = '@bk_fitness_stickers';

export const useStickerStore = create((set, get) => ({
    stickers: [],
    loading: false,
    error: null,
    lastFetched: null,

    // Check if cache is still valid
    isCacheValid: () => {
        const { lastFetched } = get();
        if (!lastFetched) return false;
        return Date.now() - lastFetched < CACHE_DURATION;
    },

    // Load stickers from AsyncStorage
    loadStickersFromStorage: async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                set({
                    stickers: data.stickers || [],
                    lastFetched: data.lastFetched || null,
                });
                return data.stickers || [];
            }
        } catch (error) {
            console.error('Error loading stickers from storage:', error);
        }
        return [];
    },

    // Save stickers to AsyncStorage
    saveStickersToStorage: async (stickers, lastFetched) => {
        try {
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    stickers,
                    lastFetched,
                })
            );
        } catch (error) {
            console.error('Error saving stickers to storage:', error);
        }
    },

    // Fetch stickers from API (only if cache is invalid)
    fetchStickers: async (force = false) => {
        const { isCacheValid, stickers, loadStickersFromStorage } = get();

        // Try to load from storage first if not already loaded
        if (stickers.length === 0) {
            const storedStickers = await loadStickersFromStorage();
            if (storedStickers.length > 0 && !force && isCacheValid()) {
                return storedStickers;
            }
        }

        // Return cached data if valid and not forcing refresh
        if (!force && isCacheValid() && stickers.length > 0) {
            return stickers;
        }

        try {
            set({ loading: true, error: null });
            // Fetch stickers directly from Cloudinary folder
            const data = await fetchResourcesFromFolder('bk-fitness/stickers');
            const stickerArray = Array.isArray(data) ? data : [];
            
            const now = Date.now();
            set({
                stickers: stickerArray,
                loading: false,
                lastFetched: now,
                error: null,
            });

            // Save to AsyncStorage
            await get().saveStickersToStorage(stickerArray, now);

            return stickerArray;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch stickers.';
            set({ error: errorMessage, loading: false });
            
            // If fetch fails, return cached stickers if available
            if (stickers.length > 0) {
                return stickers;
            }
            throw err;
        }
    },

    // Clear stickers (useful for logout or reset)
    clearStickers: async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing stickers from storage:', error);
        }
        set({
            stickers: [],
            lastFetched: null,
            error: null,
        });
    },
}));

