/**
 * Subscription Constants
 */

/**
 * Free plan - default plan for all users
 * Free plan users have restricted access to premium features
 */
export const FREE_PLAN = {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'PKR',
    duration: null, // Unlimited
    features: [
        'View feed posts',
        'Basic fitness tracking',
    ],
    restrictions: [
        'Cannot like posts',
        'Cannot comment on posts',
        'Cannot create or share posts',
        'Cannot access personalized diet plans',
    ],
};

/**
 * Premium subscription features available with active subscription
 */
export const SUBSCRIPTION_FEATURES = [
    'Like posts',
    'Comment on posts',
    'Create and share posts',
    'Personalized daily diet plan (breakfast, lunch, dinner, snacks, cheat-day meals)',
    'Track and monitor diet plan progress',
];


/**
 * Premium subscription plans available for purchase
 * Default plans used as fallback when API fails
 */
export const DEFAULT_SUBSCRIPTION_PLANS = [
    {
        id: 'monthly',
        name: 'Monthly',
        price: 4999,
        currency: 'PKR',
        duration: 30,
        features: SUBSCRIPTION_FEATURES,
    },
    {
        id: 'yearly',
        name: 'Yearly',
        price: 49999,
        currency: 'PKR',
        duration: 365,
        features: [...SUBSCRIPTION_FEATURES, 'Save 17%'],
    },
];
