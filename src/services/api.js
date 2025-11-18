/**
 * API Service
 * Handles HTTP requests to the backend API using Axios
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

console.log('API_BASE_URL:', API_BASE_URL);

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Get auth token from storage
 */
export const getAuthToken = async () => {
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
export const setAuthToken = async (token) => {
    try {
        await AsyncStorage.setItem('authToken', token);
        // Update axios default header
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error setting auth token:', error);
    }
};

/**
 * Remove auth token from storage
 */
export const removeAuthToken = async () => {
    try {
        await AsyncStorage.removeItem('authToken');
        // Remove axios default header
        delete apiClient.defaults.headers.common['Authorization'];
    } catch (error) {
        console.error('Error removing auth token:', error);
    }
};

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request for debugging (only in development)
        if (__DEV__) {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        // Log full error for debugging
        console.error('API Error Details:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status,
            request: error.request ? 'Request made but no response' : null,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                baseURL: error.config?.baseURL,
            },
        });

        // Handle network errors (common in React Native)
        if (
            error.message === 'Network Error' ||
            error.code === 'NETWORK_ERROR' ||
            error.code === 'ECONNREFUSED' ||
            error.message?.includes('Network request failed') ||
            error.message?.includes('Unable to resolve host')
        ) {
            const baseURL = API_BASE_URL;
            const isLocalhost = baseURL.includes('localhost') || baseURL.includes('127.0.0.1');

            let errorMessage = 'Unable to connect to server. ';
            if (isLocalhost) {
                errorMessage += 'If you\'re using a physical device, replace "localhost" with your computer\'s IP address (e.g., http://192.168.1.100:5001/api). ';
            }
            errorMessage += 'Please check your internet connection and ensure the backend is running.';

            const networkError = new Error(errorMessage);
            networkError.isNetworkError = true;
            networkError.originalError = error;
            return Promise.reject(networkError);
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            const timeoutError = new Error('Request timeout. The server is taking too long to respond.');
            timeoutError.isTimeout = true;
            timeoutError.originalError = error;
            return Promise.reject(timeoutError);
        }

        // Handle axios errors
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message || error.response.data?.error || `Request failed with status ${error.response.status}`;
            const apiError = new Error(message);
            apiError.status = error.response.status;
            apiError.data = error.response.data;
            return Promise.reject(apiError);
        } else if (error.request) {
            // Request was made but no response received
            const baseURL = API_BASE_URL;
            const isLocalhost = baseURL.includes('localhost') || baseURL.includes('127.0.0.1');

            let errorMessage = 'No response from server. ';
            if (isLocalhost) {
                errorMessage += 'If you\'re using a physical device, replace "localhost" with your computer\'s IP address. ';
            }
            errorMessage += 'Please check your connection and ensure the backend is running.';

            const requestError = new Error(errorMessage);
            requestError.isNetworkError = true;
            requestError.originalError = error;
            return Promise.reject(requestError);
        } else {
            // Something else happened
            return Promise.reject(error);
        }
    }
);

/**
 * Auth API
 */
export const authAPI = {
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        if (response.token) {
            await setAuthToken(response.token);
        }
        return response;
    },

    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.token) {
            await setAuthToken(response.token);
        }
        return response;
    },

    logout: async () => {
        await removeAuthToken();
    },

    getCurrentUser: async () => {
        return await apiClient.get('/auth/me');
    },

    changePassword: async (currentPassword, newPassword) => {
        return await apiClient.post('/auth/change-password', { currentPassword, newPassword });
    },
};

/**
 * Profile API
 */
export const profileAPI = {
    getProfile: async () => {
        return await apiClient.get('/profiles');
    },

    createOrUpdateProfile: async (profileData) => {
        return await apiClient.post('/profiles', profileData);
    },

    updateProfile: async (profileData) => {
        return await apiClient.put('/profiles', profileData);
    },

    addAllergy: async (allergy) => {
        return await apiClient.post('/profiles/allergies', allergy);
    },

    removeAllergy: async (allergyName) => {
        return await apiClient.delete('/profiles/allergies', { data: { name: allergyName } });
    },

    addPhysicalIssue: async (physicalIssue) => {
        return await apiClient.post('/profiles/physical-issues', physicalIssue);
    },

    removePhysicalIssue: async (issueName) => {
        return await apiClient.delete('/profiles/physical-issues', { data: { name: issueName } });
    },

    updateWeightHeight: async (weight, height, weightUnit, heightUnit) => {
        return await apiClient.put('/profiles/weight-height', { weight, height, weightUnit, heightUnit });
    },
};

/**
 * Food API
 */
export const foodAPI = {
    getFoods: async (filters = {}) => {
        return await apiClient.get('/foods', { params: filters });
    },

    getFoodById: async (foodId) => {
        return await apiClient.get(`/foods/${foodId}`);
    },

    searchFoods: async (searchTerm, limit = 20) => {
        return await apiClient.get('/foods/search', {
            params: { q: searchTerm, limit },
        });
    },

    getFoodsForProfile: async () => {
        return await apiClient.get('/foods/for-profile');
    },
};

/**
 * Diet Plan API
 */
export const dietPlanAPI = {
    createDietPlan: async (planData) => {
        return await apiClient.post('/diet-plans', planData);
    },

    getDietPlanById: async (planId) => {
        return await apiClient.get(`/diet-plans/${planId}`);
    },

    getActiveDietPlan: async () => {
        return await apiClient.get('/diet-plans/active');
    },

    getUserDietPlans: async (filters = {}) => {
        return await apiClient.get('/diet-plans', { params: filters });
    },

    updateDietPlan: async (planId, updateData) => {
        return await apiClient.put(`/diet-plans/${planId}`, updateData);
    },

    deactivateDietPlan: async (planId) => {
        return await apiClient.put(`/diet-plans/${planId}/deactivate`);
    },

    generateDietPlanSuggestions: async () => {
        return await apiClient.post('/diet-plans/generate-suggestions');
    },

    deleteDietPlan: async (planId) => {
        return await apiClient.delete(`/diet-plans/${planId}`);
    },
};

/**
 * Meal API
 */
export const mealAPI = {
    createMeal: async (mealData) => {
        return await apiClient.post('/meals', mealData);
    },

    getMealById: async (mealId) => {
        return await apiClient.get(`/meals/${mealId}`);
    },

    getUserMeals: async (filters = {}) => {
        return await apiClient.get('/meals', { params: filters });
    },

    getMealsByDate: async (date) => {
        return await apiClient.get(`/meals/date/${date}`);
    },

    getDailyNutrition: async (date) => {
        return await apiClient.get(`/meals/nutrition/${date}`);
    },

    updateMeal: async (mealId, updateData) => {
        return await apiClient.put(`/meals/${mealId}`, updateData);
    },

    deleteMeal: async (mealId) => {
        return await apiClient.delete(`/meals/${mealId}`);
    },

    getNutritionSummary: async (startDate, endDate) => {
        return await apiClient.get('/meals/nutrition-summary', {
            params: { startDate, endDate },
        });
    },
};

/**
 * Fitness Data API
 */
export const fitnessDataAPI = {
    createOrUpdateFitnessData: async (date, fitnessData) => {
        return await apiClient.post('/fitness-data', { date, ...fitnessData });
    },

    getFitnessDataById: async (dataId) => {
        return await apiClient.get(`/fitness-data/${dataId}`);
    },

    getFitnessDataByDate: async (date) => {
        return await apiClient.get(`/fitness-data/date/${date}`);
    },

    getFitnessDataRange: async (startDate, endDate) => {
        return await apiClient.get('/fitness-data/range', {
            params: { startDate, endDate },
        });
    },

    updateSteps: async (date, steps) => {
        return await apiClient.put('/fitness-data/steps', { date, steps });
    },

    addWorkout: async (date, workout) => {
        return await apiClient.post('/fitness-data/workouts', { date, workout });
    },

    updateWaterIntake: async (date, waterIntake, waterUnit = 'ml') => {
        return await apiClient.put('/fitness-data/water', { date, waterIntake, waterUnit });
    },

    updateSleep: async (date, sleepHours, sleepQuality) => {
        return await apiClient.put('/fitness-data/sleep', { date, sleepHours, sleepQuality });
    },

    getFitnessStats: async (startDate, endDate) => {
        return await apiClient.get('/fitness-data/stats', {
            params: { startDate, endDate },
        });
    },

    deleteFitnessData: async (dataId) => {
        return await apiClient.delete(`/fitness-data/${dataId}`);
    },
};

/**
 * Weight API
 */
export const weightAPI = {
    addWeightEntry: async (weightData) => {
        return await apiClient.post('/weights', weightData);
    },

    getWeightById: async (weightId) => {
        return await apiClient.get(`/weights/${weightId}`);
    },

    getWeightHistory: async (filters = {}) => {
        return await apiClient.get('/weights', { params: filters });
    },

    getLatestWeight: async () => {
        return await apiClient.get('/weights/latest');
    },

    getWeightStats: async (startDate, endDate) => {
        return await apiClient.get('/weights/stats', {
            params: { startDate, endDate },
        });
    },

    updateWeight: async (weightId, updateData) => {
        return await apiClient.put(`/weights/${weightId}`, updateData);
    },

    deleteWeight: async (weightId) => {
        return await apiClient.delete(`/weights/${weightId}`);
    },

    getWeightProgress: async (days = 30) => {
        return await apiClient.get('/weights/progress', { params: { days } });
    },
};

export default {
    apiClient,
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
