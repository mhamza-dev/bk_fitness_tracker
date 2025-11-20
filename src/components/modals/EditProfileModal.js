/**
 * Edit Profile Modal
 * Modal for editing user profile information
 */

import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Formik } from 'formik';
import { useProfile } from '../../hooks';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';
import { Input, DateInput, Button, Modal, AllergyManager, PhysicalIssueManager } from '../index';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { editProfileSchema } from '../../validations/profileSchemas';
import {
    GENDER_OPTIONS,
    ACTIVITY_LEVELS,
    DIETARY_PREFERENCES,
    HEALTH_GOALS,
    WEIGHT_UNITS,
    HEIGHT_UNITS,
} from '../../constants/profileConstants';

export default function EditProfileModal({ visible, onClose, profile }) {
    const { updateProfile, loading } = useProfile();
    const [initialValues, setInitialValues] = useState({
        dateOfBirth: profile?.dateOfBirth ? moment(profile.dateOfBirth).format('YYYY-MM-DD') : '',
        gender: profile?.gender || '',
        weight: profile?.weight?.toString() || '',
        weightUnit: profile?.weightUnit || 'kg',
        height: profile?.height?.toString() || '',
        heightUnit: profile?.heightUnit || 'cm',
        activityLevel: profile?.activityLevel || 'moderately_active',
        dietaryPreferences: profile?.dietaryPreferences || [],
        healthGoals: profile?.healthGoals || [],
        allergies: profile?.allergies || [],
        physicalIssues: profile?.physicalIssues || [],
    });

    useEffect(() => {
        if (profile) {
            setInitialValues({
                dateOfBirth: profile.dateOfBirth ? moment(profile.dateOfBirth).format('YYYY-MM-DD') : '',
                gender: profile.gender || '',
                weight: profile.weight?.toString() || '',
                weightUnit: profile.weightUnit || 'kg',
                height: profile.height?.toString() || '',
                heightUnit: profile.heightUnit || 'cm',
                activityLevel: profile.activityLevel || 'moderately_active',
                dietaryPreferences: profile.dietaryPreferences || [],
                healthGoals: profile.healthGoals || [],
                allergies: profile.allergies || [],
                physicalIssues: profile.physicalIssues || [],
            });
        }
    }, [profile]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const updateData = {
                dateOfBirth: values.dateOfBirth || undefined,
                gender: values.gender || undefined,
                weight: values.weight ? parseFloat(values.weight) : undefined,
                weightUnit: values.weightUnit,
                height: values.height ? parseFloat(values.height) : undefined,
                heightUnit: values.heightUnit,
                activityLevel: values.activityLevel,
                dietaryPreferences: values.dietaryPreferences || [],
                healthGoals: values.healthGoals || [],
                allergies: values.allergies || [],
                physicalIssues: values.physicalIssues || [],
            };

            await updateProfile(updateData);
            Alert.alert('Success', 'Profile updated successfully!');
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Edit Profile"
            maxHeight="90%"
        >
            <Formik
                initialValues={initialValues}
                validationSchema={editProfileSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                    <View style={styles.form}>
                        {/* Personal Information Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Personal Information</Text>

                            <DateInput
                                name="dateOfBirth"
                                label="Date of Birth"
                                placeholder="Select date of birth"
                                mode="date"
                                format="YYYY-MM-DD"
                                maximumDate={new Date()}
                            />

                            {/* Gender Selector */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>Gender</Text>
                                <View style={styles.selectContainer}>
                                    {GENDER_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.value}
                                            style={[
                                                styles.selectOption,
                                                values.gender === option.value && styles.selectOptionActive,
                                            ]}
                                            onPress={() => setFieldValue('gender', option.value)}
                                        >
                                            <Text
                                                style={[
                                                    styles.selectOptionText,
                                                    values.gender === option.value && styles.selectOptionTextActive,
                                                ]}
                                            >
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Weight */}
                            <View style={styles.heightContainer}>
                                <View style={styles.heightInput}>
                                    <Input
                                        name="weight"
                                        label="Weight"
                                        placeholder="Enter weight"
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                                <View style={styles.unitSelector}>
                                    <Text style={styles.unitLabel}>Unit</Text>
                                    <View style={styles.unitButtons}>
                                        {WEIGHT_UNITS.map((unit) => (
                                            <TouchableOpacity
                                                key={unit}
                                                style={[
                                                    styles.unitButton,
                                                    values.weightUnit === unit && styles.unitButtonActive,
                                                ]}
                                                onPress={() => setFieldValue('weightUnit', unit)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.unitButtonText,
                                                        values.weightUnit === unit && styles.unitButtonTextActive,
                                                    ]}
                                                >
                                                    {unit}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            {/* Height */}
                            <View style={styles.heightContainer}>
                                <View style={styles.heightInput}>
                                    <Input
                                        name="height"
                                        label="Height"
                                        placeholder="Enter height"
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                                <View style={styles.unitSelector}>
                                    <Text style={styles.unitLabel}>Unit</Text>
                                    <View style={styles.unitButtons}>
                                        {HEIGHT_UNITS.map((unit) => (
                                            <TouchableOpacity
                                                key={unit}
                                                style={[
                                                    styles.unitButton,
                                                    values.heightUnit === unit && styles.unitButtonActive,
                                                ]}
                                                onPress={() => setFieldValue('heightUnit', unit)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.unitButtonText,
                                                        values.heightUnit === unit && styles.unitButtonTextActive,
                                                    ]}
                                                >
                                                    {unit}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Activity Level Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Activity Level</Text>
                            <View style={styles.fieldContainer}>
                                <View style={styles.selectContainer}>
                                    {ACTIVITY_LEVELS.map((option) => (
                                        <TouchableOpacity
                                            key={option.value}
                                            style={[
                                                styles.selectOption,
                                                values.activityLevel === option.value && styles.selectOptionActive,
                                            ]}
                                            onPress={() => setFieldValue('activityLevel', option.value)}
                                        >
                                            <Text
                                                style={[
                                                    styles.selectOptionText,
                                                    values.activityLevel === option.value && styles.selectOptionTextActive,
                                                ]}
                                            >
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Dietary Preferences Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
                            <View style={styles.multiSelectContainer}>
                                {DIETARY_PREFERENCES.map((option) => {
                                    const isSelected = values.dietaryPreferences?.includes(option.value);
                                    return (
                                        <TouchableOpacity
                                            key={option.value}
                                            style={[
                                                styles.multiSelectOption,
                                                isSelected && styles.multiSelectOptionActive,
                                            ]}
                                            onPress={() => {
                                                const current = values.dietaryPreferences || [];
                                                if (isSelected) {
                                                    setFieldValue('dietaryPreferences', current.filter(v => v !== option.value));
                                                } else {
                                                    // Handle 'none' option - if selected, clear all others
                                                    if (option.value === 'none') {
                                                        setFieldValue('dietaryPreferences', ['none']);
                                                    } else {
                                                        // If selecting any other option, remove 'none' if present
                                                        const filtered = current.filter(v => v !== 'none');
                                                        setFieldValue('dietaryPreferences', [...filtered, option.value]);
                                                    }
                                                }
                                            }}
                                        >
                                            <Ionicons
                                                name={isSelected ? 'checkbox' : 'checkbox-outline'}
                                                size={Sizes.icon.m}
                                                color={isSelected ? Colors.text.inverse : Colors.text.secondary}
                                            />
                                            <Text
                                                style={[
                                                    styles.multiSelectOptionText,
                                                    isSelected && styles.multiSelectOptionTextActive,
                                                ]}
                                            >
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Health Goals Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Health Goals</Text>
                            <View style={styles.multiSelectContainer}>
                                {HEALTH_GOALS.map((option) => {
                                    const isSelected = values.healthGoals?.includes(option.value);
                                    return (
                                        <TouchableOpacity
                                            key={option.value}
                                            style={[
                                                styles.multiSelectOption,
                                                isSelected && styles.multiSelectOptionActive,
                                            ]}
                                            onPress={() => {
                                                const current = values.healthGoals || [];
                                                if (isSelected) {
                                                    setFieldValue('healthGoals', current.filter(v => v !== option.value));
                                                } else {
                                                    setFieldValue('healthGoals', [...current, option.value]);
                                                }
                                            }}
                                        >
                                            <Ionicons
                                                name={isSelected ? 'checkbox' : 'checkbox-outline'}
                                                size={Sizes.icon.m}
                                                color={isSelected ? Colors.text.inverse : Colors.text.secondary}
                                            />
                                            <Text
                                                style={[
                                                    styles.multiSelectOptionText,
                                                    isSelected && styles.multiSelectOptionTextActive,
                                                ]}
                                            >
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Allergies Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Allergies</Text>
                            <AllergyManager
                                allergies={values.allergies || []}
                                onUpdate={(allergies) => setFieldValue('allergies', allergies)}
                            />
                        </View>

                        {/* Physical Issues Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Physical Issues</Text>
                            <PhysicalIssueManager
                                physicalIssues={values.physicalIssues || []}
                                onUpdate={(issues) => setFieldValue('physicalIssues', issues)}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                title={isSubmitting || loading ? 'Saving...' : 'Save Changes'}
                                onPress={handleSubmit}
                                disabled={isSubmitting || loading}
                                fullWidth
                                size="large"
                            />
                        </View>
                    </View>
                )}
            </Formik>
        </Modal>
    );
}


const styles = StyleSheet.create({
    form: {
        gap: Sizes.l,
    },
    section: {
        marginBottom: Sizes.xxl,
    },
    sectionTitle: {
        fontSize: Sizes.fontSize.l,
        fontWeight: FontWeight.bold,
        color: Colors.text.primary,
        marginBottom: Sizes.m,
    },
    fieldContainer: {
        marginBottom: Sizes.l,
    },
    label: {
        fontSize: Sizes.fontSize.m,
        fontWeight: FontWeight.medium,
        color: Colors.text.primary,
        marginBottom: Sizes.s,
    },
    heightContainer: {
        flexDirection: 'row',
        gap: Sizes.m,
        marginBottom: Sizes.l,
    },
    heightInput: {
        flex: 1,
    },
    unitSelector: {
        width: 120,
    },
    unitLabel: {
        fontSize: Sizes.fontSize.m,
        fontWeight: FontWeight.medium,
        color: Colors.text.primary,
        marginBottom: Sizes.s,
    },
    unitButtons: {
        flexDirection: 'row',
        backgroundColor: Colors.background.tertiary,
        borderRadius: BorderRadius.m,
        overflow: 'hidden',
        height: Sizes.input.m,
        alignItems: 'stretch',
    },
    unitButton: {
        flex: 1,
        paddingHorizontal: Sizes.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unitButtonActive: {
        backgroundColor: Colors.primary,
    },
    unitButtonText: {
        fontSize: Sizes.fontSize.s,
        color: Colors.text.secondary,
        fontWeight: FontWeight.medium,
    },
    unitButtonTextActive: {
        color: Colors.text.inverse,
        fontWeight: FontWeight.bold,
    },
    selectContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Sizes.s,
    },
    selectOption: {
        paddingHorizontal: Sizes.l,
        paddingVertical: Sizes.m,
        backgroundColor: Colors.background.tertiary,
        borderRadius: BorderRadius.m,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    selectOptionActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    selectOptionText: {
        fontSize: Sizes.fontSize.m,
        color: Colors.text.secondary,
        fontWeight: FontWeight.medium,
    },
    selectOptionTextActive: {
        color: Colors.text.inverse,
        fontWeight: FontWeight.bold,
    },
    multiSelectContainer: {
        gap: Sizes.s,
    },
    multiSelectOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Sizes.m,
        backgroundColor: Colors.background.tertiary,
        borderRadius: BorderRadius.m,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    multiSelectOptionActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    multiSelectOptionText: {
        marginLeft: Sizes.m,
        fontSize: Sizes.fontSize.m,
        color: Colors.text.secondary,
        fontWeight: FontWeight.medium,
    },
    multiSelectOptionTextActive: {
        color: Colors.text.inverse,
        fontWeight: FontWeight.bold,
    },
    buttonContainer: {
        marginTop: Sizes.xl,
        marginBottom: Sizes.xxxl,
    },
});
