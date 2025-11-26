/**
 * Profile Validation Schemas
 * Yup validation schemas for profile-related forms
 */

import * as Yup from 'yup';
import {
    GENDER_VALUES,
    ACTIVITY_LEVEL_VALUES,
    WEIGHT_UNITS,
    HEIGHT_UNITS,
} from '../constants/profileConstants';

// Edit Profile validation schema
export const editProfileSchema = Yup.object().shape({
    dateOfBirth: Yup.string().nullable(),
    gender: Yup.string().oneOf(GENDER_VALUES).nullable(),
    weight: Yup.number().min(1, 'Weight must be greater than 0').max(500, 'Weight must be less than 500 kg').nullable(),
    weightUnit: Yup.string().oneOf(WEIGHT_UNITS).nullable(),
    height: Yup.number().min(50, 'Height must be greater than 50 cm').max(300, 'Height must be less than 300 cm').nullable(),
    heightUnit: Yup.string().oneOf(HEIGHT_UNITS).nullable(),
    activityLevel: Yup.string().oneOf(ACTIVITY_LEVEL_VALUES).nullable(),
    dietaryPreferences: Yup.array().of(Yup.string()).nullable(),
    healthGoals: Yup.array().of(Yup.string()).nullable(),
});

// Dynamic validation schema that adjusts based on selected units
export const getDynamicProfileSchema = (values) => {
    const weightUnit = values?.weightUnit || 'kg';
    const heightUnit = values?.heightUnit || 'cm';

    // Weight validation based on unit
    let weightMin = 1;
    let weightMax = 500;
    let weightMinMessage = 'Weight must be greater than 0';
    let weightMaxMessage = 'Weight must be less than 500 kg';

    if (weightUnit === 'lbs') {
        weightMin = 2.2; // ~1 kg in lbs
        weightMax = 1102.3; // ~500 kg in lbs
        weightMinMessage = 'Weight must be greater than 2.2 lbs';
        weightMaxMessage = 'Weight must be less than 1102 lbs';
    }

    // Height validation based on unit
    let heightMin = 50;
    let heightMax = 300;
    let heightMinMessage = 'Height must be greater than 50 cm';
    let heightMaxMessage = 'Height must be less than 300 cm';

    if (heightUnit === 'ft') {
        heightMin = 1.64; // ~50 cm in feet
        heightMax = 9.84; // ~300 cm in feet
        heightMinMessage = 'Height must be greater than 1.64 ft';
        heightMaxMessage = 'Height must be less than 9.84 ft';
    }

    return Yup.object().shape({
        dateOfBirth: Yup.string().nullable(),
        gender: Yup.string().oneOf(GENDER_VALUES).nullable(),
        weight: Yup.number()
            .min(weightMin, weightMinMessage)
            .max(weightMax, weightMaxMessage)
            .nullable(),
        weightUnit: Yup.string().oneOf(WEIGHT_UNITS).nullable(),
        height: Yup.number()
            .min(heightMin, heightMinMessage)
            .max(heightMax, heightMaxMessage)
            .nullable(),
        heightUnit: Yup.string().oneOf(HEIGHT_UNITS).nullable(),
        activityLevel: Yup.string().oneOf(ACTIVITY_LEVEL_VALUES).nullable(),
        dietaryPreferences: Yup.array().of(Yup.string()).nullable(),
        healthGoals: Yup.array().of(Yup.string()).nullable(),
    });
};

