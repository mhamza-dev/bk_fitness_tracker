/**
 * Subscription Store
 * Zustand store for subscription state management
 */

import { create } from 'zustand';
import { subscriptionAPI } from '../services/api';

export const useSubscriptionStore = create((set, get) => ({
    subscription: null,
    loading: false,
    error: null,

    // Fetch subscription status
    fetchSubscription: async () => {
        try {
            set({ loading: true, error: null });
            const data = await subscriptionAPI.getSubscription();
            set({
                subscription: data,
                loading: false,
                error: null,
            });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch subscription.';
            set({ error: errorMessage, loading: false });
            // If subscription doesn't exist, set to null (not an error)
            if (err.status === 404) {
                set({ subscription: null, error: null });
            }
            throw err;
        }
    },

    // Check if user has active premium subscription
    // Returns false for free plan users (subscription is null or inactive)
    hasActiveSubscription: () => {
        const { subscription } = get();
        // If no subscription, user is on free plan
        if (!subscription) return false;

        // Check if subscription is active and not expired
        const now = new Date();
        const expiresAt = subscription.expiresAt ? new Date(subscription.expiresAt) : null;

        // Only return true if subscription is active and not expired
        return subscription.status === 'active' && (!expiresAt || expiresAt > now);
    },

    // Check if user is on free plan (no active subscription)
    isFreePlan: () => {
        return !get().hasActiveSubscription();
    },

    // Purchase subscription
    purchaseSubscription: async (planId) => {
        try {
            set({ loading: true, error: null });
            const data = await subscriptionAPI.purchaseSubscription(planId);
            set({
                subscription: data,
                loading: false,
                error: null,
            });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to purchase subscription.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Get available subscription plans
    getPlans: async () => {
        try {
            set({ loading: true, error: null });
            const data = await subscriptionAPI.getPlans();
            set({ loading: false, error: null });
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch subscription plans.';
            set({ error: errorMessage, loading: false });
            throw err;
        }
    },

    // Clear subscription (useful for logout)
    clearSubscription: () => {
        set({
            subscription: null,
            error: null,
        });
    },
}));

