/**
 * Notification Validation Schemas
 * Yup validation schemas for notification preferences
 */

import * as Yup from 'yup';

// Notification Preferences validation schema
export const notificationPreferencesSchema = Yup.object().shape({
    pushNotifications: Yup.boolean(),
    emailNotifications: Yup.boolean(),
    stepReminders: Yup.boolean(),
    mealReminders: Yup.boolean(),
    workoutReminders: Yup.boolean(),
    weightReminders: Yup.boolean(),
    socialUpdates: Yup.boolean(),
});

