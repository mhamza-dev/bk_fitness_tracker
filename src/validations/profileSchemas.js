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

