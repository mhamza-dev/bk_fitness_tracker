/**
 * useNotificationPreferences Hook
 * Custom hook for notification preferences operations using Zustand store
 */

import { useNotificationPreferencesStore } from '../stores/useNotificationPreferencesStore';

export const useNotificationPreferences = () => {
    const {
        preferences,
        loading,
        error,
        fetchPreferences,
        createPreferences,
        updatePreferences,
        deletePreferences,
    } = useNotificationPreferencesStore();

    return {
        preferences,
        loading,
        error,
        fetchPreferences,
        createNotificationPreferences: createPreferences,
        updateNotificationPreferences: updatePreferences,
        deleteNotificationPreferences: deletePreferences,
    };
};

