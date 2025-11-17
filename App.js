import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accelerometer } from 'expo-sensors';
import { Constants } from 'expo-constants';
import LottieView from 'lottie-react-native';

const CALORIES_PER_STEP = 0.05;
const STEP_DETECTION_THRESHOLD = 0.1;
const INACTIVITY_TIMEOUT = 1500; // 1.5 seconds


export default function App() {
  const [stepCount, setStepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const animationRefRunning = useRef(null);
  const animationRefSitting = useRef(null);
  const timeoutRef = useRef(null);
  const lastStepTimeRef = useRef(0);

  useEffect(() => {
    let subscription;

    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((acceleration) => {
          const currentTimestamp = new Date().getTime();

          // Detect step
          if (Math.abs(acceleration.y - lastY) > STEP_DETECTION_THRESHOLD && (currentTimestamp - lastTimestamp > 800)) {
            setIsTracking(true);
            setLastY(acceleration.y);
            setLastTimestamp(currentTimestamp);
            setStepCount(prev => prev + 1);
            lastStepTimeRef.current = currentTimestamp;

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }

            // Reset isTracking to false after 1.5 seconds of no movement
            // This timeout gets reset every time a step is detected
            timeoutRef.current = setTimeout(() => {
              setIsTracking(false);
              timeoutRef.current = null;
            }, INACTIVITY_TIMEOUT);
          } else if (isTracking && lastStepTimeRef.current > 0) {
            // Check if enough time has passed since last step
            const timeSinceLastStep = currentTimestamp - lastStepTimeRef.current;
            if (timeSinceLastStep >= INACTIVITY_TIMEOUT) {
              // Clear any existing timeout
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              // Switch to sitting immediately
              setIsTracking(false);
              timeoutRef.current = null;
            }
          }
        })
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [lastY, lastTimestamp, isTracking]);

  const handleResetCounting = () => {
    setStepCount(0);
  }

  const calculation = {
    caloriesBurned: (stepCount * CALORIES_PER_STEP).toFixed(2),
    distance: (stepCount * 0.762).toFixed(2),
    time: (stepCount * 800).toFixed(2),
    speed: (stepCount * 0.762 / 800).toFixed(2),
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.animationContainer}>
        {isTracking ? (
          <LottieView
            ref={animationRefRunning}
            source={require('./assets/running.json')}
            style={styles.animation}
            autoPlay
            loop={true}
          />
        ) : (
          <LottieView
            ref={animationRefSitting}
            source={require('./assets/sitting.json')}
            style={styles.animation}
            autoPlay
            loop={true}
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.stepCountText}>Step Count: {stepCount}</Text>
        <TouchableOpacity onPress={handleResetCounting} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset Counting</Text>
        </TouchableOpacity>
        <View style={styles.calculationContainer}>
          <Text style={styles.calculationText}>Calories Burned: {calculation.caloriesBurned}</Text>
          <Text style={styles.calculationText}>Distance(m): {calculation.distance}</Text>
          <Text style={styles.calculationText}>Time(s): {calculation.time}</Text>
          <Text style={styles.calculationText}>Speed(m/s): {calculation.speed}</Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCountText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resetButton: {
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  calculationContainer: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  calculationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  animation: {
    width: 200,
    height: 200,
  },
});
