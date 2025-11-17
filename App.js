import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accelerometer } from 'expo-sensors';
import LottieView from 'lottie-react-native';
import stepCounterService from './service/stepCounter';

const CALORIES_PER_STEP = 0.05;


export default function App() {
  const [stepCount, setStepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  const animationRefRunning = useRef(null);
  const animationRefSitting = useRef(null);

  useEffect(() => {
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
        // Set update interval for accelerometer (optional, but recommended)
        Accelerometer.setUpdateInterval(100); // 100ms = 10Hz

        subscription = Accelerometer.addListener((acceleration) => {
          // Process acceleration data through step counter service
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
  }, []); // Empty dependency array - only run once on mount

  const handleResetCounting = () => {
    setStepCount(0);
    stepCounterService.reset();
    setIsTracking(false);
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
