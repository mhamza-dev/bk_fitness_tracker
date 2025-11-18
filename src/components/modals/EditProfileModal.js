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
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useProfile } from '../../hooks';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';
import { Input, DateInput, Button, Modal } from '../index';
import moment from 'moment';

const editProfileSchema = Yup.object().shape({
    dateOfBirth: Yup.string().nullable(),
    height: Yup.number().min(50).max(300).nullable(),
    heightUnit: Yup.string().oneOf(['cm', 'ft']).nullable(),
});

export default function EditProfileModal({ visible, onClose, profile }) {
    const { updateProfile, loading } = useProfile();
    const [initialValues, setInitialValues] = useState({
        dateOfBirth: profile?.dateOfBirth ? moment(profile.dateOfBirth).format('YYYY-MM-DD') : '',
        height: profile?.height?.toString() || '',
        heightUnit: profile?.heightUnit || 'cm',
    });

    useEffect(() => {
        if (profile) {
            setInitialValues({
                dateOfBirth: profile.dateOfBirth ? moment(profile.dateOfBirth).format('YYYY-MM-DD') : '',
                height: profile.height?.toString() || '',
                heightUnit: profile.heightUnit || 'cm',
            });
        }
    }, [profile]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const updateData = {
                dateOfBirth: values.dateOfBirth || undefined,
                height: values.height ? parseFloat(values.height) : undefined,
                heightUnit: values.heightUnit,
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
            maxHeight="85%"
        >
            <Formik
                initialValues={initialValues}
                validationSchema={editProfileSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                    <View style={styles.form}>
                        <DateInput
                            name="dateOfBirth"
                            label="Date of Birth"
                            placeholder="Select date of birth"
                            mode="date"
                            format="YYYY-MM-DD"
                            maximumDate={new Date()}
                        />

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
                                    <TouchableOpacity
                                        style={[
                                            styles.unitButton,
                                            values.heightUnit === 'cm' && styles.unitButtonActive,
                                        ]}
                                        onPress={() => setFieldValue('heightUnit', 'cm')}
                                    >
                                        <Text
                                            style={[
                                                styles.unitButtonText,
                                                values.heightUnit === 'cm' && styles.unitButtonTextActive,
                                            ]}
                                        >
                                            cm
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.unitButton,
                                            values.heightUnit === 'ft' && styles.unitButtonActive,
                                        ]}
                                        onPress={() => setFieldValue('heightUnit', 'ft')}
                                    >
                                        <Text
                                            style={[
                                                styles.unitButtonText,
                                                values.heightUnit === 'ft' && styles.unitButtonTextActive,
                                            ]}
                                        >
                                            ft
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
    heightContainer: {
        flexDirection: 'row',
        gap: Sizes.m,
    },
    heightInput: {
        flex: 1,
    },
    unitSelector: {
        width: 100,
        // justifyContent: 'flex-end',
        // paddingBottom: Sizes.s, // Match label marginBottom
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
        height: Sizes.input.m, // Match input height
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
    buttonContainer: {
        marginTop: Sizes.xl,
    },
});
