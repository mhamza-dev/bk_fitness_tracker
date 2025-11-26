/**
 * Personal Details Onboarding Screen
 * First step of onboarding - collects personal information
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { useProfile } from '../../hooks';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';
import { Input, DateInput, SelectInput, MultiSelectInput, UnitSelector, Button } from '../../components';
import { getDynamicProfileSchema } from '../../validations/profileSchemas';
import {
    GENDER_OPTIONS,
    ACTIVITY_LEVELS,
    DIETARY_PREFERENCES,
    HEALTH_GOALS,
    WEIGHT_UNITS,
    HEIGHT_UNITS,
} from '../../constants/profileConstants';

export default function PersonalDetailsScreen({ navigation, route }) {
    const { createOrUpdateProfile, loading } = useProfile();
    const { profileData = {} } = route.params || {};

    const initialValues = {
        dateOfBirth: profileData.dateOfBirth || '',
        gender: profileData.gender || '',
        weight: profileData.weight?.toString() || '',
        weightUnit: profileData.weightUnit || 'kg',
        height: profileData.height?.toString() || '',
        heightUnit: profileData.heightUnit || 'cm',
        activityLevel: profileData.activityLevel || 'moderately_active',
        dietaryPreferences: profileData.dietaryPreferences || [],
        healthGoals: profileData.healthGoals || [],
    };

    const handleNext = async (values, { setSubmitting }) => {
        try {
            const profileData = {
                dateOfBirth: values.dateOfBirth || undefined,
                gender: values.gender || undefined,
                weight: values.weight ? parseFloat(values.weight) : undefined,
                weightUnit: values.weightUnit,
                height: values.height ? parseFloat(values.height) : undefined,
                heightUnit: values.heightUnit,
                activityLevel: values.activityLevel,
                dietaryPreferences: values.dietaryPreferences || [],
                healthGoals: values.healthGoals || [],
            };

            // Navigate to next screen with data
            navigation.navigate('Allergies', { profileData });
        } catch (error) {
            console.error('Error saving personal details:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Personal Details</Text>
                        <Text style={styles.subtitle}>Step 1 of 3</Text>

                        {/* Step Indicator */}
                        <View style={styles.stepIndicatorContainer}>
                            <View style={styles.stepIndicator}>
                                <View style={[styles.stepBar, styles.stepBarFilled]} />
                                <View style={[styles.stepBar, styles.stepBarEmpty]} />
                                <View style={[styles.stepBar, styles.stepBarEmpty]} />
                            </View>
                        </View>
                    </View>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={(values) => getDynamicProfileSchema(values)}
                        onSubmit={handleNext}
                    >
                        {({ handleSubmit, isSubmitting, values, setFieldValue }) => {
                            // Handle unit changes with value conversion
                            const handleWeightUnitChange = (newUnit) => {
                                const currentWeight = parseFloat(values.weight);
                                if (!isNaN(currentWeight) && currentWeight > 0 && values.weightUnit) {
                                    let convertedWeight;
                                    if (values.weightUnit === 'kg' && newUnit === 'lbs') {
                                        convertedWeight = (currentWeight * 2.20462).toFixed(2);
                                    } else if (values.weightUnit === 'lbs' && newUnit === 'kg') {
                                        convertedWeight = (currentWeight / 2.20462).toFixed(2);
                                    } else {
                                        convertedWeight = currentWeight.toString();
                                    }
                                    setFieldValue('weight', convertedWeight);
                                }
                                setFieldValue('weightUnit', newUnit);
                            };

                            const handleHeightUnitChange = (newUnit) => {
                                const currentHeight = parseFloat(values.height);
                                if (!isNaN(currentHeight) && currentHeight > 0 && values.heightUnit) {
                                    let convertedHeight;
                                    if (values.heightUnit === 'cm' && newUnit === 'ft') {
                                        convertedHeight = (currentHeight / 30.48).toFixed(2);
                                    } else if (values.heightUnit === 'ft' && newUnit === 'cm') {
                                        convertedHeight = (currentHeight * 30.48).toFixed(2);
                                    } else {
                                        convertedHeight = currentHeight.toString();
                                    }
                                    setFieldValue('height', convertedHeight);
                                }
                                setFieldValue('heightUnit', newUnit);
                            };

                            return (
                                <View style={styles.form}>
                                    <DateInput
                                        name="dateOfBirth"
                                        label="Date of Birth"
                                        placeholder="Select date of birth"
                                        mode="date"
                                        format="YYYY-MM-DD"
                                        maximumDate={new Date()}
                                    />

                                    {/* Gender */}
                                    <SelectInput
                                        name="gender"
                                        label="Gender"
                                        options={GENDER_OPTIONS}
                                    />

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
                                        <UnitSelector
                                            name="weightUnit"
                                            label="Unit"
                                            options={WEIGHT_UNITS}
                                            width={150}
                                            onChange={handleWeightUnitChange}
                                        />
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
                                        <UnitSelector
                                            name="heightUnit"
                                            label="Unit"
                                            options={HEIGHT_UNITS}
                                            width={150}
                                            onChange={handleHeightUnitChange}
                                        />
                                    </View>

                                    {/* Activity Level */}
                                    <SelectInput
                                        name="activityLevel"
                                        label="Activity Level"
                                        options={ACTIVITY_LEVELS}
                                    />

                                    {/* Dietary Preferences */}
                                    <MultiSelectInput
                                        name="dietaryPreferences"
                                        label="Dietary Preferences"
                                        options={DIETARY_PREFERENCES}
                                        exclusiveValue="none"
                                    />

                                    {/* Health Goals */}
                                    <MultiSelectInput
                                        name="healthGoals"
                                        label="Health Goals"
                                        options={HEALTH_GOALS}
                                    />

                                    <Button
                                        title="Next"
                                        onPress={handleSubmit}
                                        disabled={isSubmitting || loading}
                                        size="large"
                                        variant="primary"
                                        style={styles.nextButton}
                                    />
                                </View>
                            );
                        }}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: Sizes.l,
    },
    header: {
        marginBottom: Sizes.xxxl,
        alignItems: 'center',
    },
    title: {
        fontSize: Sizes.fontSize.xxxl,
        fontWeight: FontWeight.bold,
        color: Colors.text.primary,
        marginBottom: Sizes.s,
    },
    subtitle: {
        fontSize: Sizes.fontSize.m,
        color: Colors.text.secondary,
    },
    form: {
        gap: Sizes.l,
    },
    heightContainer: {
        flexDirection: 'row',
        gap: Sizes.m,
        marginBottom: Sizes.l,
    },
    heightInput: {
        flex: 1,
    },
    nextButton: {
        marginTop: Sizes.xl,
        marginBottom: Sizes.xxxl,
    },
    stepIndicatorContainer: {
        marginTop: Sizes.l,
        width: '100%',
        alignItems: 'center',
    },
    stepIndicator: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 200,
        gap: Sizes.xs,
    },
    stepBar: {
        flex: 1,
        height: 4,
        borderRadius: BorderRadius.s,
    },
    stepBarFilled: {
        backgroundColor: Colors.primary,
    },
    stepBarEmpty: {
        backgroundColor: Colors.background.tertiary,
    },
});


