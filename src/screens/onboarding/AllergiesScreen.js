/**
 * Allergies Onboarding Screen
 * Second step of onboarding - collects allergy information
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
import { useProfile } from '../../hooks';
import { Colors, Sizes, FontWeight } from '../../styles';
import { Button } from '../../components';
import { AllergyManager } from '../../components';

export default function AllergiesScreen({ navigation, route }) {
    const { profileData = {} } = route.params || {};
    const [allergies, setAllergies] = React.useState(profileData.allergies || []);

    const handleNext = () => {
        const updatedProfileData = {
            ...profileData,
            allergies,
        };
        navigation.navigate('PhysicalIssues', { profileData: updatedProfileData });
    };

    const handleSkip = () => {
        const updatedProfileData = {
            ...profileData,
            allergies: [],
        };
        navigation.navigate('PhysicalIssues', { profileData: updatedProfileData });
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
                        <Text style={styles.title}>Allergies</Text>
                        <Text style={styles.subtitle}>Step 2 of 3</Text>
                        <Text style={styles.description}>
                            Add any allergies you have. This helps us provide better diet recommendations.
                        </Text>
                    </View>

                    <AllergyManager
                        allergies={allergies}
                        onUpdate={setAllergies}
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Next"
                            onPress={handleNext}
                            fullWidth
                            size="large"
                            style={styles.nextButton}
                        />
                        <Button
                            title="Skip"
                            onPress={handleSkip}
                            variant="secondary"
                            fullWidth
                            size="large"
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
    nextButton: {
        marginBottom: 0,
    },
});


