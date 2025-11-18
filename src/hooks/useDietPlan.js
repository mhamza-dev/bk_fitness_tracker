/**
 * useDietPlan Hook
 * Custom hook for diet plan operations
 */

import { useState, useCallback } from 'react';
import { dietPlanAPI } from '../services/api';

export const useDietPlan = () => {
    const [dietPlans, setDietPlans] = useState([]);
    const [activeDietPlan, setActiveDietPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createDietPlan = useCallback(async (planData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await dietPlanAPI.createDietPlan(planData);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to create diet plan.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getDietPlanById = useCallback(async (planId) => {
        try {
            setLoading(true);
            setError(null);
            return await dietPlanAPI.getDietPlanById(planId);
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch diet plan.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getActiveDietPlan = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dietPlanAPI.getActiveDietPlan();
            setActiveDietPlan(data);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch active diet plan.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserDietPlans = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await dietPlanAPI.getUserDietPlans(filters);
            setDietPlans(Array.isArray(data) ? data : []);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch diet plans.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDietPlan = useCallback(async (planId, updateData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await dietPlanAPI.updateDietPlan(planId, updateData);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to update diet plan.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deactivateDietPlan = useCallback(async (planId) => {
        try {
            setLoading(true);
            setError(null);
            const data = await dietPlanAPI.deactivateDietPlan(planId);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to deactivate diet plan.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const generateDietPlanSuggestions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await dietPlanAPI.generateDietPlanSuggestions();
        } catch (err) {
            const errorMessage = err.message || 'Failed to generate diet plan suggestions.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteDietPlan = useCallback(async (planId) => {
        try {
            setLoading(true);
            setError(null);
            await dietPlanAPI.deleteDietPlan(planId);
        } catch (err) {
            const errorMessage = err.message || 'Failed to delete diet plan.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        dietPlans,
        activeDietPlan,
        loading,
        error,
        createDietPlan,
        getDietPlanById,
        getActiveDietPlan,
        getUserDietPlans,
        updateDietPlan,
        deactivateDietPlan,
        generateDietPlanSuggestions,
        deleteDietPlan,
    };
};

