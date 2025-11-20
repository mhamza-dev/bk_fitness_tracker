/**
 * useNotificationPreferences Hook
 * Custom hook for notification preferences operations
 */

import { useState, useCallback, useEffect } from 'react';
import { notificationPreferencesAPI } from '../services/api';

export const useNotificationPreferences = () => {
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPreferences = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await notificationPreferencesAPI.getNotificationPreferences();
            setPreferences(data);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch notification preferences.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createNotificationPreferences = useCallback(async (preferencesData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await notificationPreferencesAPI.createNotificationPreferences(preferencesData);
            setPreferences(data);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to create notification preferences.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateNotificationPreferences = useCallback(async (preferencesData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await notificationPreferencesAPI.updateNotificationPreferences(preferencesData);
            setPreferences(data);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to update notification preferences.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteNotificationPreferences = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            await notificationPreferencesAPI.deleteNotificationPreferences();
            setPreferences(null);
        } catch (err) {
            const errorMessage = err.message || 'Failed to delete notification preferences.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        preferences,
        loading,
        error,
        fetchPreferences,
        createNotificationPreferences,
        updateNotificationPreferences,
        deleteNotificationPreferences,
    };
};

