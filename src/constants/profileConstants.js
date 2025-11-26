/**
 * Profile Constants
 * Constants used for profile-related forms and data
 */

export const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export const ACTIVITY_LEVELS = [
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'lightly_active', label: 'Lightly Active' },
    { value: 'moderately_active', label: 'Moderately Active' },
    { value: 'very_active', label: 'Very Active' },
    { value: 'extremely_active', label: 'Extremely Active' },
];

export const DIETARY_PREFERENCES = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten_free', label: 'Gluten Free' },
    { value: 'dairy_free', label: 'Dairy Free' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'none', label: 'None' },
];

export const HEALTH_GOALS = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'weight_gain', label: 'Weight Gain' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'improve_health', label: 'Improve Health' },
    { value: 'manage_condition', label: 'Manage Condition' },
];

export const ALLERGY_SEVERITIES = ['mild', 'moderate', 'severe'];

export const PHYSICAL_ISSUE_TYPES = ['chronic', 'temporary', 'condition'];

export const WEIGHT_UNITS = ['kg', 'lbs'];

export const HEIGHT_UNITS = ['cm', 'ft'];

export const GENDER_VALUES = GENDER_OPTIONS.map(option => option.value);

export const ACTIVITY_LEVEL_VALUES = ACTIVITY_LEVELS.map(level => level.value);

export const DIETARY_PREFERENCE_VALUES = DIETARY_PREFERENCES.map(pref => pref.value);

export const HEALTH_GOAL_VALUES = HEALTH_GOALS.map(goal => goal.value);

