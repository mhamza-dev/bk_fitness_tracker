/**
 * Notifications Modal
 * Modal for managing notification settings
 */

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';
import { Card, Modal } from '../index';

export default function NotificationsModal({ visible, onClose }) {
    const [settings, setSettings] = useState({
        pushNotifications: true,
        emailNotifications: false,
        stepReminders: true,
        mealReminders: true,
        workoutReminders: true,
        weightReminders: false,
        socialUpdates: true,
    });

    const toggleSetting = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = () => {
        // TODO: Save notification settings to backend
        // For now, just show success message
        Alert.alert('Success', 'Notification settings saved!');
        onClose();
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

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Notifications"
            maxHeight="85%"
        >
            <Card variant="outlined" padding="medium" style={styles.settingsCard}>
                <NotificationItem
                    icon="notifications"
                    label="Push Notifications"
                    description="Receive push notifications on your device"
                    value={settings.pushNotifications}
                    onToggle={() => toggleSetting('pushNotifications')}
                />

                <View style={styles.divider} />

                <NotificationItem
                    icon="mail"
                    label="Email Notifications"
                    description="Receive notifications via email"
                    value={settings.emailNotifications}
                    onToggle={() => toggleSetting('emailNotifications')}
                />

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Reminders</Text>

                <NotificationItem
                    icon="footsteps"
                    label="Step Reminders"
                    description="Remind me to reach my daily step goal"
                    value={settings.stepReminders}
                    onToggle={() => toggleSetting('stepReminders')}
                />

                <View style={styles.divider} />

                <NotificationItem
                    icon="restaurant"
                    label="Meal Reminders"
                    description="Remind me to log my meals"
                    value={settings.mealReminders}
                    onToggle={() => toggleSetting('mealReminders')}
                />

                <View style={styles.divider} />

                <NotificationItem
                    icon="fitness"
                    label="Workout Reminders"
                    description="Remind me to do my workouts"
                    value={settings.workoutReminders}
                    onToggle={() => toggleSetting('workoutReminders')}
                />

                <View style={styles.divider} />

                <NotificationItem
                    icon="scale"
                    label="Weight Reminders"
                    description="Remind me to log my weight"
                    value={settings.weightReminders}
                    onToggle={() => toggleSetting('weightReminders')}
                />

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Social</Text>

                <NotificationItem
                    icon="people"
                    label="Social Updates"
                    description="Notifications about likes, comments, and follows"
                    value={settings.socialUpdates}
                    onToggle={() => toggleSetting('socialUpdates')}
                />
            </Card>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
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
    saveButton: {
        marginTop: Sizes.xl,
        backgroundColor: Colors.primary,
        paddingVertical: Sizes.m,
        paddingHorizontal: Sizes.xl,
        borderRadius: BorderRadius.button.m,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: Sizes.fontSize.m,
        fontWeight: FontWeight.bold,
        color: Colors.text.inverse,
    },
});
