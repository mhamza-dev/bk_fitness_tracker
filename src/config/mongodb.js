/**
 * MongoDB Configuration
 * This file contains MongoDB connection settings and utilities
 */

// MongoDB connection URI - should be stored in environment variables
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bk_fitness_tracker';

// MongoDB connection options
export const MONGODB_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

// Database name
export const DB_NAME = 'bk_fitness_tracker';

// Collections
export const COLLECTIONS = {
    USERS: 'users',
    PROFILES: 'profiles',
    DIET_PLANS: 'diet_plans',
    FITNESS_DATA: 'fitness_data',
    MEALS: 'meals',
    WEIGHTS: 'weights',
    FOODS: 'foods',
};

