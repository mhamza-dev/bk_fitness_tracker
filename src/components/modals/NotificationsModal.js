/**
 * Notifications Modal
 * Modal for managing notification settings
 */

import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Switch,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';
import { Card, Modal, Button } from '../index';
import { useNotificationPreferences } from '../../hooks';
import { notificationPreferencesSchema } from '../../validations/notificationSchemas';

const defaultPreferences = {
    pushNotifications: true,
    emailNotifications: false,
    stepReminders: true,
    mealReminders: true,
    workoutReminders: true,
    weightReminders: false,
    socialUpdates: true,
};

export default function NotificationsModal({ visible, onClose }) {
    const {
        preferences,
        loading: preferencesLoading,
        fetchPreferences,
        createNotificationPreferences,
        updateNotificationPreferences,
    } = useNotificationPreferences();

    const [initialValues, setInitialValues] = useState(defaultPreferences);

    useEffect(() => {
        if (visible) {
            loadPreferences();
        }
    }, [visible]);

    const loadPreferences = async () => {
        try {
            const data = await fetchPreferences();
            if (data) {
                setInitialValues({
                    pushNotifications: data.pushNotifications ?? defaultPreferences.pushNotifications,
                    emailNotifications: data.emailNotifications ?? defaultPreferences.emailNotifications,
                    stepReminders: data.stepReminders ?? defaultPreferences.stepReminders,
                    mealReminders: data.mealReminders ?? defaultPreferences.mealReminders,
                    workoutReminders: data.workoutReminders ?? defaultPreferences.workoutReminders,
                    weightReminders: data.weightReminders ?? defaultPreferences.weightReminders,
                    socialUpdates: data.socialUpdates ?? defaultPreferences.socialUpdates,
                });
            } else {
                setInitialValues(defaultPreferences);
            }
        } catch (error) {
            // If preferences don't exist, use defaults
            setInitialValues(defaultPreferences);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            if (preferences) {
                await updateNotificationPreferences(values);
            } else {
                await createNotificationPreferences(values);
            }
            Alert.alert('Success', 'Notification settings saved!');
            onClose();
        } catch (error) {
            console.error('Error saving notification preferences:', error);
            Alert.alert('Error', error.message || 'Failed to save notification settings. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const NotificationItem = ({ icon, label, description, value, onToggle }) => (
        <View style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
                <Ionicons name={icon} size={Sizes.icon.m} color={Colors.primary} />
            </View>
            <View style={styles.notificationContent}>
                <Text style={styles.notificationLabel}>{label}</Text>
                {description && (
                    <Text style={styles.notificationDescription}>{description}</Text>
                )}
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: Colors.border.light, true: Colors.primary + '80' }}
                thumbColor={value ? Colors.primary : Colors.text.secondary}
            />
        </View>
    );

    if (preferencesLoading && !preferences) {
        return (
            <Modal
                visible={visible}
                onClose={onClose}
                title="Notifications"
                maxHeight="85%"
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading preferences...</Text>
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Notifications"
            maxHeight="85%"
        >
            <Formik
                initialValues={initialValues}
                validationSchema={notificationPreferencesSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                    <>
                        <Card variant="outlined" padding="medium" style={styles.settingsCard}>
                            <NotificationItem
                                icon="notifications"
                                label="Push Notifications"
                                description="Receive push notifications on your device"
                                value={values.pushNotifications}
                                onToggle={() => setFieldValue('pushNotifications', !values.pushNotifications)}
                            />

                            <View style={styles.divider} />

                            <NotificationItem
                                icon="mail"
                                label="Email Notifications"
                                description="Receive notifications via email"
                                value={values.emailNotifications}
                                onToggle={() => setFieldValue('emailNotifications', !values.emailNotifications)}
                            />

                            <View style={styles.divider} />

                            <Text style={styles.sectionTitle}>Reminders</Text>

                            <NotificationItem
                                icon="footsteps"
                                label="Step Reminders"
                                description="Remind me to reach my daily step goal"
                                value={values.stepReminders}
                                onToggle={() => setFieldValue('stepReminders', !values.stepReminders)}
                            />

                            <View style={styles.divider} />

                            <NotificationItem
                                icon="restaurant"
                                label="Meal Reminders"
                                description="Remind me to log my meals"
                                value={values.mealReminders}
                                onToggle={() => setFieldValue('mealReminders', !values.mealReminders)}
                            />

                            <View style={styles.divider} />

                            <NotificationItem
                                icon="fitness"
                                label="Workout Reminders"
                                description="Remind me to do my workouts"
                                value={values.workoutReminders}
                                onToggle={() => setFieldValue('workoutReminders', !values.workoutReminders)}
                            />

                            <View style={styles.divider} />

                            <NotificationItem
                                icon="scale"
                                label="Weight Reminders"
                                description="Remind me to log my weight"
                                value={values.weightReminders}
                                onToggle={() => setFieldValue('weightReminders', !values.weightReminders)}
                            />

                            <View style={styles.divider} />

                            <Text style={styles.sectionTitle}>Social</Text>

                            <NotificationItem
                                icon="people"
                                label="Social Updates"
                                description="Notifications about likes, comments, and follows"
                                value={values.socialUpdates}
                                onToggle={() => setFieldValue('socialUpdates', !values.socialUpdates)}
                            />
                        </Card>

                        <View style={styles.buttonContainer}>
                            <Button
                                title={isSubmitting || preferencesLoading ? 'Saving...' : 'Save Settings'}
                                onPress={handleSubmit}
                                disabled={isSubmitting || preferencesLoading}
                                fullWidth
                                size="large"
                            />
                        </View>
                    </>
                )}
            </Formik>
        </Modal>
    );
}

const styles = StyleSheet.create({
    settingsCard: {
        backgroundColor: Colors.background.tertiary,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Sizes.m,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Sizes.m,
    },
    notificationContent: {
        flex: 1,
    },
    notificationLabel: {
        fontSize: Sizes.fontSize.m,
        fontWeight: FontWeight.semibold,
        color: Colors.text.primary,
        marginBottom: Sizes.xs / 2,
    },
    notificationDescription: {
        fontSize: Sizes.fontSize.s,
        color: Colors.text.secondary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border.light,
        marginVertical: Sizes.s,
    },
    sectionTitle: {
        fontSize: Sizes.fontSize.l,
        fontWeight: FontWeight.bold,
        color: Colors.text.primary,
        marginTop: Sizes.m,
        marginBottom: Sizes.s,
    },
    buttonContainer: {
        marginTop: Sizes.xl,
        marginBottom: Sizes.xxxl,
    },
    loadingContainer: {
        padding: Sizes.xxxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: Sizes.m,
        fontSize: Sizes.fontSize.m,
        color: Colors.text.secondary,
    },
});
