import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accelerometer } from 'expo-sensors';
import LottieView from 'lottie-react-native';
import { stepCounterService } from '../services/index';
import { useFitnessData } from '../hooks';
import { Colors, Sizes, FontWeight, BorderRadius } from '../styles';
import moment from 'moment';

const CALORIES_PER_STEP = 0.05;
const SAVE_INTERVAL = 30000; // Save to API every 30 seconds

export default function StepTrackerScreen() {
    const [stepCount, setStepCount] = useState(0);
    const [savedStepCount, setSavedStepCount] = useState(0);
    const [isTracking, setIsTracking] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const { getFitnessDataByDate, updateSteps } = useFitnessData();
    const animationRefRunning = useRef(null);
    const animationRefSitting = useRef(null);
    const saveIntervalRef = useRef(null);
    const today = moment().format('YYYY-MM-DD');

    useEffect(() => {
        loadTodaySteps();
        const stepCounterCleanup = setupStepCounter();
        const autoSaveCleanup = setupAutoSave();

        return () => {
            if (autoSaveCleanup) autoSaveCleanup();
            if (stepCounterCleanup) stepCounterCleanup();
            // Clear interval on unmount
            if (saveIntervalRef.current) {
                clearInterval(saveIntervalRef.current);
            }
        };
    }, []);

    const loadTodaySteps = async () => {
        try {
            setIsLoading(true);
            const data = await getFitnessDataByDate(today);
            if (data && data.steps) {
                setStepCount(data.steps);
                setSavedStepCount(data.steps);
            }
        } catch (error) {
            console.error('Error loading today\'s steps:', error);
            // Continue with step tracking even if loading fails
        } finally {
            setIsLoading(false);
        }
    };

    const setupStepCounter = () => {
        let subscription;

        // Set up step counter service callbacks
        stepCounterService.setOnStepDetected(() => {
            setStepCount(prev => prev + 1);
        });

        stepCounterService.setOnTrackingStateChanged((tracking) => {
            setIsTracking(tracking);
        });

        Accelerometer.isAvailableAsync().then((result) => {
            if (result) {
                Accelerometer.setUpdateInterval(100); // 100ms = 10Hz

                subscription = Accelerometer.addListener((acceleration) => {
                    stepCounterService.processAcceleration(acceleration);
                });
            }
        });

        return () => {
            if (subscription) {
                subscription.remove();
            }
            stepCounterService.cleanup();
        };
    };

    const setupAutoSave = () => {
        // Auto-save steps every 30 seconds
        saveIntervalRef.current = setInterval(() => {
            if (stepCount > savedStepCount && !isSaving) {
                saveSteps();
            }
        }, SAVE_INTERVAL);

        return () => {
            if (saveIntervalRef.current) {
                clearInterval(saveIntervalRef.current);
            }
        };
    };

    const saveSteps = async () => {
        if (isSaving || stepCount === savedStepCount) return;

        try {
            setIsSaving(true);
            await updateSteps(today, stepCount);
            setSavedStepCount(stepCount);
        } catch (error) {
            console.error('Error saving steps:', error);
            Alert.alert('Error', 'Failed to save steps. They will be saved automatically later.');
        } finally {
            setIsSaving(false);
        }
    };


    const handleResetCounting = async () => {
        Alert.alert(
            'Reset Steps',
            'Are you sure you want to reset today\'s step count? This cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        setStepCount(0);
                        setSavedStepCount(0);
                        stepCounterService.reset();
                        setIsTracking(false);
                        try {
                            await updateSteps(today, 0);
                        } catch (error) {
                            console.error('Error resetting steps:', error);
                        }
                    },
                },
            ]
        );
    }

    const calculation = {
        caloriesBurned: (stepCount * CALORIES_PER_STEP).toFixed(2),
        distance: (stepCount * 0.762).toFixed(2),
        time: (stepCount * 800).toFixed(2),
        speed: (stepCount * 0.762 / 800).toFixed(2),
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading step data...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.animationContainer}>
                {isTracking ? (
                    <LottieView
                        ref={animationRefRunning}
                        source={require('../../assets/running.json')}
                        style={styles.animation}
                        autoPlay={true}
                        loop={true}
                    />
                ) : (
                    <LottieView
                        ref={animationRefSitting}
                        source={require('../../assets/sitting.json')}
                        style={styles.animation}
                        autoPlay={true}
                        loop={true}
                    />
                )}
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerSection}>
                    <Text style={styles.dateText}>{moment().format('MMMM Do, YYYY')}</Text>
                    {isSaving && (
                        <View style={styles.savingIndicator}>
                            <ActivityIndicator size="small" color={Colors.primary} />
                            <Text style={styles.savingText}>Saving...</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.stepCountText}>{stepCount.toLocaleString()}</Text>
                <Text style={styles.stepLabel}>Steps</Text>

                <View style={styles.calculationContainer}>
                    <View style={styles.calculationRow}>
                        <View style={styles.calculationItem}>
                            <Text style={styles.calculationValue}>{calculation.caloriesBurned}</Text>
                            <Text style={styles.calculationLabel}>Calories</Text>
                        </View>
                        <View style={styles.calculationItem}>
                            <Text style={styles.calculationValue}>{calculation.distance}</Text>
                            <Text style={styles.calculationLabel}>Distance (m)</Text>
                        </View>
                    </View>
                    <View style={styles.calculationRow}>
                        <View style={styles.calculationItem}>
                            <Text style={styles.calculationValue}>{calculation.time}</Text>
                            <Text style={styles.calculationLabel}>Time (s)</Text>
                        </View>
                        <View style={styles.calculationItem}>
                            <Text style={styles.calculationValue}>{calculation.speed}</Text>
                            <Text style={styles.calculationLabel}>Speed (m/s)</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleResetCounting}
                    style={styles.resetButton}
                    disabled={isSaving}
                >
                    <Text style={styles.resetButtonText}>Reset Steps</Text>
                </TouchableOpacity>

                {stepCount > savedStepCount && (
                    <TouchableOpacity
                        onPress={saveSteps}
                        style={styles.saveButton}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color={Colors.text.inverse} />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Steps Now</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
        alignItems: 'center',
        justifyContent: 'center',
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
    headerSection: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Sizes.m,
    },
    dateText: {
        fontSize: Sizes.fontSize.m,
        color: Colors.text.secondary,
    },
    savingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    savingText: {
        marginLeft: Sizes.xs,
        fontSize: Sizes.fontSize.xs,
        color: Colors.text.secondary,
    },
    stepCountText: {
        fontSize: Sizes.fontSize.giant,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        marginBottom: Sizes.xs,
    },
    stepLabel: {
        fontSize: Sizes.fontSize.l,
        color: Colors.text.secondary,
        marginBottom: Sizes.xxxl,
    },
    resetButton: {
        marginTop: Sizes.xl,
        backgroundColor: Colors.primary,
        paddingHorizontal: Sizes.xl,
        paddingVertical: Sizes.m,
        borderRadius: BorderRadius.button.m,
        minWidth: 150,
        alignItems: 'center',
    },
    saveButton: {
        marginTop: Sizes.m,
        backgroundColor: Colors.background.secondary,
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingHorizontal: Sizes.xl,
        paddingVertical: Sizes.m,
        borderRadius: BorderRadius.button.m,
        minWidth: 150,
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: Sizes.l,
    },
    resetButtonText: {
        fontSize: Sizes.fontSize.m,
        fontWeight: FontWeight.bold,
        color: Colors.text.inverse,
    },
    saveButtonText: {
        fontSize: Sizes.fontSize.m,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
    calculationContainer: {
        marginTop: Sizes.xl,
        padding: Sizes.xl,
        borderWidth: 1,
        borderColor: Colors.border.light,
        borderRadius: BorderRadius.card.m,
        backgroundColor: Colors.background.secondary,
        width: '100%',
    },
    calculationRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Sizes.l,
    },
    calculationItem: {
        alignItems: 'center',
        flex: 1,
    },
    calculationValue: {
        fontSize: Sizes.fontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        marginBottom: Sizes.xs,
    },
    calculationLabel: {
        fontSize: Sizes.fontSize.s,
        color: Colors.text.secondary,
    },
    animationContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        marginBottom: Sizes.xl,
    },
    animation: {
        width: 200,
        height: 200,
    },
});

