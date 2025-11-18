/**
 * API Service
 * Handles HTTP requests to the backend API
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Get auth token from storage
 */
const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

/**
 * Set auth token in storage
 */
const setAuthToken = async (token) => {
    try {
        await AsyncStorage.setItem('authToken', token);
    } catch (error) {
        console.error('Error setting auth token:', error);
    }
};

/**
 * Remove auth token from storage
 */
const removeAuthToken = async () => {
    try {
        await AsyncStorage.removeItem('authToken');
    } catch (error) {
        console.error('Error removing auth token:', error);
    }
};

/**
 * Make API request
 */
const apiRequest = async (endpoint, options = {}) => {
    try {
        const token = await getAuthToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        // Handle body for POST/PUT/PATCH requests
        if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
            config.body = JSON.stringify(options.body);
        } else if (options.body) {
            config.body = options.body;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'An error occurred');
        }

        return data;
    } catch (error) {
        if (error.message) {
            throw error;
        }
        throw new Error('Network error. Please check your connection.');
    }
};

/**
 * Auth API
 */
export const authAPI = {
    register: async (userData) => {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: userData,
        });

        if (response.token) {
            await setAuthToken(response.token);
        }

        return response;
    },

    login: async (email, password) => {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: { email, password },
        });

        if (response.token) {
            await setAuthToken(response.token);
        }

        return response;
    },

    logout: async () => {
        await removeAuthToken();
    },

    getCurrentUser: async () => {
        return await apiRequest('/auth/me');
    },

    changePassword: async (currentPassword, newPassword) => {
        return await apiRequest('/auth/change-password', {
            method: 'POST',
            body: { currentPassword, newPassword },
        });
    },
};

/**
 * Profile API
 */
export const profileAPI = {
    getProfile: async () => {
        return await apiRequest('/profiles');
    },

    createOrUpdateProfile: async (profileData) => {
        return await apiRequest('/profiles', {
            method: 'POST',
            body: profileData,
        });
    },

    updateProfile: async (profileData) => {
        return await apiRequest('/profiles', {
            method: 'PUT',
            body: profileData,
        });
    },

    addAllergy: async (allergy) => {
        return await apiRequest('/profiles/allergies', {
            method: 'POST',
            body: allergy,
        });
    },

    removeAllergy: async (allergyName) => {
        return await apiRequest('/profiles/allergies', {
            method: 'DELETE',
            body: { name: allergyName },
        });
    },

    addPhysicalIssue: async (physicalIssue) => {
        return await apiRequest('/profiles/physical-issues', {
            method: 'POST',
            body: physicalIssue,
        });
    },

    removePhysicalIssue: async (issueName) => {
        return await apiRequest('/profiles/physical-issues', {
            method: 'DELETE',
            body: { name: issueName },
        });
    },

    updateWeightHeight: async (weight, height, weightUnit, heightUnit) => {
        return await apiRequest('/profiles/weight-height', {
            method: 'PUT',
            body: { weight, height, weightUnit, heightUnit },
        });
    },
};

/**
 * Food API
 */
export const foodAPI = {
    getFoods: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null) {
                if (Array.isArray(filters[key])) {
                    filters[key].forEach(val => queryParams.append(key, val));
                } else {
                    queryParams.append(key, filters[key]);
                }
            }
        });
        const queryString = queryParams.toString();
        return await apiRequest(`/foods${queryString ? `?${queryString}` : ''}`);
    },

    getFoodById: async (foodId) => {
        return await apiRequest(`/foods/${foodId}`);
    },

    searchFoods: async (searchTerm, limit = 20) => {
        return await apiRequest(`/foods/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`);
    },

    getFoodsForProfile: async () => {
        return await apiRequest('/foods/for-profile');
    },
};

/**
 * Diet Plan API
 */
export const dietPlanAPI = {
    createDietPlan: async (planData) => {
        return await apiRequest('/diet-plans', {
            method: 'POST',
            body: planData,
        });
    },

    getDietPlanById: async (planId) => {
        return await apiRequest(`/diet-plans/${planId}`);
    },

    getActiveDietPlan: async () => {
        return await apiRequest('/diet-plans/active');
    },

    getUserDietPlans: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null) {
                queryParams.append(key, filters[key]);
            }
        });
        const queryString = queryParams.toString();
        return await apiRequest(`/diet-plans${queryString ? `?${queryString}` : ''}`);
    },

    updateDietPlan: async (planId, updateData) => {
        return await apiRequest(`/diet-plans/${planId}`, {
            method: 'PUT',
            body: updateData,
        });
    },

    deactivateDietPlan: async (planId) => {
        return await apiRequest(`/diet-plans/${planId}/deactivate`, {
            method: 'PUT',
        });
    },

    generateDietPlanSuggestions: async () => {
        return await apiRequest('/diet-plans/generate-suggestions');
    },

    deleteDietPlan: async (planId) => {
        return await apiRequest(`/diet-plans/${planId}`, {
            method: 'DELETE',
        });
    },
};

/**
 * Meal API
 */
export const mealAPI = {
    createMeal: async (mealData) => {
        return await apiRequest('/meals', {
            method: 'POST',
            body: mealData,
        });
    },

    getMealById: async (mealId) => {
        return await apiRequest(`/meals/${mealId}`);
    },

    getUserMeals: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null) {
                if (key === 'date') {
                    queryParams.append(key, filters[key]);
                } else if (key === 'startDate' || key === 'endDate') {
                    queryParams.append(key, filters[key]);
                } else {
                    queryParams.append(key, filters[key]);
                }
            }
        });
        const queryString = queryParams.toString();
        return await apiRequest(`/meals${queryString ? `?${queryString}` : ''}`);
    },

    getMealsByDate: async (date) => {
        return await apiRequest(`/meals/date/${date}`);
    },

    getDailyNutrition: async (date) => {
        return await apiRequest(`/meals/nutrition/${date}`);
    },

    updateMeal: async (mealId, updateData) => {
        return await apiRequest(`/meals/${mealId}`, {
            method: 'PUT',
            body: updateData,
        });
    },

    deleteMeal: async (mealId) => {
        return await apiRequest(`/meals/${mealId}`, {
            method: 'DELETE',
        });
    },

    getNutritionSummary: async (startDate, endDate) => {
        return await apiRequest(`/meals/nutrition-summary?startDate=${startDate}&endDate=${endDate}`);
    },
};

/**
 * Fitness Data API
 */
export const fitnessDataAPI = {
    createOrUpdateFitnessData: async (date, fitnessData) => {
        return await apiRequest('/fitness-data', {
            method: 'POST',
            body: { date, ...fitnessData },
        });
    },

    getFitnessDataById: async (dataId) => {
        return await apiRequest(`/fitness-data/${dataId}`);
    },

    getFitnessDataByDate: async (date) => {
        return await apiRequest(`/fitness-data/date/${date}`);
    },

    getFitnessDataRange: async (startDate, endDate) => {
        return await apiRequest(`/fitness-data/range?startDate=${startDate}&endDate=${endDate}`);
    },

    updateSteps: async (date, steps) => {
        return await apiRequest('/fitness-data/steps', {
            method: 'PUT',
            body: { date, steps },
        });
    },

    addWorkout: async (date, workout) => {
        return await apiRequest('/fitness-data/workouts', {
            method: 'POST',
            body: { date, workout },
        });
    },

    updateWaterIntake: async (date, waterIntake, waterUnit = 'ml') => {
        return await apiRequest('/fitness-data/water', {
            method: 'PUT',
            body: { date, waterIntake, waterUnit },
        });
    },

    updateSleep: async (date, sleepHours, sleepQuality) => {
        return await apiRequest('/fitness-data/sleep', {
            method: 'PUT',
            body: { date, sleepHours, sleepQuality },
        });
    },

    getFitnessStats: async (startDate, endDate) => {
        return await apiRequest(`/fitness-data/stats?startDate=${startDate}&endDate=${endDate}`);
    },

    deleteFitnessData: async (dataId) => {
        return await apiRequest(`/fitness-data/${dataId}`, {
            method: 'DELETE',
        });
    },
};

/**
 * Weight API
 */
export const weightAPI = {
    addWeightEntry: async (weightData) => {
        return await apiRequest('/weights', {
            method: 'POST',
            body: weightData,
        });
    },

    getWeightById: async (weightId) => {
        return await apiRequest(`/weights/${weightId}`);
    },

    getWeightHistory: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null) {
                queryParams.append(key, filters[key]);
            }
        });
        const queryString = queryParams.toString();
        return await apiRequest(`/weights${queryString ? `?${queryString}` : ''}`);
    },

    getLatestWeight: async () => {
        return await apiRequest('/weights/latest');
    },

    getWeightStats: async (startDate, endDate) => {
        return await apiRequest(`/weights/stats?startDate=${startDate}&endDate=${endDate}`);
    },

    updateWeight: async (weightId, updateData) => {
        return await apiRequest(`/weights/${weightId}`, {
            method: 'PUT',
            body: updateData,
        });
    },

    deleteWeight: async (weightId) => {
        return await apiRequest(`/weights/${weightId}`, {
            method: 'DELETE',
        });
    },

    getWeightProgress: async (days = 30) => {
        return await apiRequest(`/weights/progress?days=${days}`);
    },
};

export default {
    apiRequest,
    getAuthToken,
    setAuthToken,
    removeAuthToken,
    authAPI,
    profileAPI,
    foodAPI,
    dietPlanAPI,
    mealAPI,
    fitnessDataAPI,
    weightAPI,
};
