/**
 * Physical Issues Onboarding Screen
 * Third step of onboarding - collects physical issues information
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../../hooks';
import { useProfileStore } from '../../stores';
import { Colors, Sizes, FontWeight } from '../../styles';
import { Button } from '../../components';
import { PhysicalIssueManager } from '../../components';

export default function PhysicalIssuesScreen({ navigation, route }) {
    const { profileData = {} } = route.params || {};
    const { createOrUpdateProfile, loading } = useProfile();
    const [physicalIssues, setPhysicalIssues] = React.useState(profileData.physicalIssues || []);

    const handleComplete = async () => {
        try {
            const finalProfileData = {
                ...profileData,
                physicalIssues,
            };

            await createOrUpdateProfile(finalProfileData);

            // Force refresh profile in store to trigger navigation update
            await useProfileStore.getState().fetchProfile(true);

            // Profile created successfully - AuthenticatedNavigator will automatically
            // detect the profile and navigate to main app
            Alert.alert('Success', 'Profile created successfully!');
        } catch (error) {
            console.error('Error creating profile:', error);
            Alert.alert('Error', error.message || 'Failed to create profile. Please try again.');
        }
    };

    const handleSkip = async () => {
        try {
            const finalProfileData = {
                ...profileData,
                physicalIssues: [],
            };

            await createOrUpdateProfile(finalProfileData);

            // Force refresh profile in store to trigger navigation update
            await useProfileStore.getState().fetchProfile(true);

            // Profile created successfully - AuthenticatedNavigator will automatically
            // detect the profile and navigate to main app
            Alert.alert('Success', 'Profile created successfully!');
        } catch (error) {
            console.error('Error creating profile:', error);
            Alert.alert('Error', error.message || 'Failed to create profile. Please try again.');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Creating your profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                        <Text style={styles.title}>Physical Issues</Text>
                        <Text style={styles.subtitle}>Step 3 of 3</Text>
                        <Text style={styles.description}>
                            Add any physical issues or conditions you have. This helps us provide better health recommendations.
                        </Text>
                    </View>

                    <PhysicalIssueManager
                        physicalIssues={physicalIssues}
                        onUpdate={setPhysicalIssues}
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Complete Setup"
                            onPress={handleComplete}
                            fullWidth
                            size="large"
                            style={styles.completeButton}
                            loading={loading}
                        />
                        <Button
                            title="Skip"
                            onPress={handleSkip}
                            variant="secondary"
                            fullWidth
                            size="large"
                            disabled={loading}
                        />
                    </View>
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
        marginBottom: Sizes.m,
    },
    description: {
        fontSize: Sizes.fontSize.m,
        color: Colors.text.secondary,
        textAlign: 'center',
        paddingHorizontal: Sizes.l,
    },
    buttonContainer: {
        marginTop: Sizes.xl,
        gap: Sizes.m,
        marginBottom: Sizes.xxxl,
    },
    completeButton: {
        marginBottom: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: Sizes.m,
        fontSize: Sizes.fontSize.m,
        color: Colors.text.secondary,
    },
});

