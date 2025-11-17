// Step Counter Service - Highly Sensitive & Precision Tuned
// Uses Dynamic Magnitude, Low-Pass Filtering, Adaptive Thresholding, and Rhythm Confidence.

// Configuration constants
const INITIAL_ACCELERATION_THRESHOLD = 0.7; // Lowered, working purely on dynamic acceleration magnitude
const MIN_STEP_INTERVAL = 250; // Minimum time between steps (ms)
const MAX_STEP_INTERVAL = 1100; // Maximum time between steps (ms)
const INACTIVITY_TIMEOUT = 4000; // Increased inactivity detection time (4s)
const PEAK_DETECTION_WINDOW = 5; // Readings to check for local max/min
const STEP_HISTORY_SIZE = 10; // Increased history for better rhythm analysis

// --- FILTER & THRESHOLD TUNING FOR Leniency & Precision ---
const GRAVITY_ALPHA = 0.05; // Very LOW alpha for slow, stable gravity estimation (Kalman approximation)
const MAGNITUDE_ALPHA = 0.3; // Low-Pass Alpha for the movement signal (faster response)
const MIN_PEAK_HEIGHT_FACTOR = 1.4; // ADJUSTED: Peak must be 1.4x the average recent valley (Signal-to-Noise). Lowered from 1.8 for sensitivity.
const CONFIDENCE_THRESHOLD = 0.55;  // ADJUSTED: Lowered from 0.7 to accept less consistent rhythms (e.g., holding phone still).
const MIN_DYNAMIC_MAGNITUDE_FOR_ACTIVITY = 0.05; // ADJUSTED: CRITICAL FIX. Lowered from 0.15 to process very small movements.

class StepCounterService {
    constructor() {
        // Internal state
        this.lastStepTime = 0;
        this.isInitialized = false;
        this.accelerationHistory = []; // Filtered DYNAMIC magnitude history for peak detection
        this.lastAccelerationMagnitude = 0; // Last DYNAMIC magnitude
        this.inactivityTimeout = null;

        // Pattern recognition and validation
        this.stepIntervals = [];
        this.baselineGravity = { x: 0, y: 0, z: 0 };
        this.gravityEstablished = false;

        // Enhanced features
        this.adaptiveThreshold = INITIAL_ACCELERATION_THRESHOLD;
        this.recentPeaks = [];
        this.recentValleys = []; // Track valleys for noise floor estimation
        this.filteredMagnitude = 0;
        this.gravitySamples = null; // For gravity initialization

        // Callbacks
        this.onStepDetected = null;
        this.onTrackingStateChanged = null;
        this.onInactivityDetected = null;
        this.isTracking = false;
    }

    // --- Core Math Functions ---

    /**
     * Calculate dynamic acceleration (remove gravity component) using estimated gravity.
     */
    calculateDynamicAcceleration(acceleration) {
        if (!this.gravityEstablished) {
            // Until gravity is stable, we cannot accurately calculate dynamic acceleration
            return { x: 0, y: 0, z: 0 };
        }
        return {
            x: acceleration.x - this.baselineGravity.x,
            y: acceleration.y - this.baselineGravity.y,
            z: acceleration.z - this.baselineGravity.z
        };
    }

    /**
     * Calculate DYNAMIC acceleration magnitude.
     */
    calculateDynamicMagnitude(acceleration) {
        const dynamic = this.calculateDynamicAcceleration(acceleration);
        return Math.sqrt(
            dynamic.x * dynamic.x +
            dynamic.y * dynamic.y +
            dynamic.z * dynamic.z
        );
    }

    /**
     * Estimate gravity using a slow Low-Pass Filter (LPF) for stability.
     */
    estimateGravity(acceleration) {
        if (!this.gravityEstablished) {
            // Initialize gravity properly - need to track samples
            if (!this.gravitySamples) {
                this.gravitySamples = [];
            }
            this.gravitySamples.push(acceleration);

            const samplesNeeded = 10; // Need more samples for stable gravity estimate
            if (this.gravitySamples.length >= samplesNeeded) {
                // Calculate average of samples
                this.baselineGravity.x = this.gravitySamples.reduce((sum, a) => sum + a.x, 0) / samplesNeeded;
                this.baselineGravity.y = this.gravitySamples.reduce((sum, a) => sum + a.y, 0) / samplesNeeded;
                this.baselineGravity.z = this.gravitySamples.reduce((sum, a) => sum + a.z, 0) / samplesNeeded;
                this.gravityEstablished = true;
                this.gravitySamples = null; // Clear samples after initialization
            }
            return;
        }

        // Apply slow LPF for gravity separation
        this.baselineGravity.x = (GRAVITY_ALPHA * acceleration.x) + (1 - GRAVITY_ALPHA) * this.baselineGravity.x;
        this.baselineGravity.y = (GRAVITY_ALPHA * acceleration.y) + (1 - GRAVITY_ALPHA) * this.baselineGravity.y;
        this.baselineGravity.z = (GRAVITY_ALPHA * acceleration.z) + (1 - GRAVITY_ALPHA) * this.baselineGravity.z;
    }

    /**
     * Apply LPF to smooth the DYNAMIC magnitude signal.
     */
    applyLowPassFilter(magnitude) {
        if (this.filteredMagnitude === 0) {
            this.filteredMagnitude = magnitude;
        } else {
            this.filteredMagnitude = MAGNITUDE_ALPHA * magnitude + (1 - MAGNITUDE_ALPHA) * this.filteredMagnitude;
        }
        return this.filteredMagnitude;
    }

    // --- Adaptive Threshold & Peak Detection ---

    /**
     * Update adaptive threshold based on recent noise floor (valleys).
     */
    updateAdaptiveThreshold() {
        if (this.recentValleys.length === 0) {
            return;
        }

        // Calculate median valley magnitude (robust to outliers)
        this.recentValleys.sort((a, b) => a - b);
        const mid = Math.floor(this.recentValleys.length / 2);
        const medianValley = this.recentValleys.length % 2 !== 0
            ? this.recentValleys[mid]
            : (this.recentValleys[mid - 1] + this.recentValleys[mid]) / 2;

        // New threshold = Median Noise Floor * Minimum Required Peak Height Factor
        const newThreshold = medianValley * MIN_PEAK_HEIGHT_FACTOR;

        // Smooth threshold updates
        this.adaptiveThreshold = 0.7 * this.adaptiveThreshold + 0.3 * newThreshold;
        this.adaptiveThreshold = Math.max(INITIAL_ACCELERATION_THRESHOLD, this.adaptiveThreshold);
    }

    /**
     * Detect if current reading is a valley (local minimum) and update the noise floor history.
     * Checks if the current magnitude is a local minimum in the recent history.
     */
    detectValley(magnitude) {
        // Need at least PEAK_DETECTION_WINDOW samples in history (excluding current)
        if (this.accelerationHistory.length < PEAK_DETECTION_WINDOW - 1) return false;

        // Get recent history (excluding current magnitude which hasn't been added yet)
        const windowSize = Math.min(this.accelerationHistory.length, PEAK_DETECTION_WINDOW - 1);
        const recentHistory = this.accelerationHistory.slice(-windowSize);

        // Check if current magnitude is less than all values in the window
        // This indicates a local minimum
        const isLocalMin = recentHistory.every(value => magnitude < value);

        if (isLocalMin) {
            this.recentValleys.push(magnitude);
            if (this.recentValleys.length > STEP_HISTORY_SIZE) {
                this.recentValleys.shift();
            }
        }
        return isLocalMin;
    }

    /**
     * Calculate confidence score based on rhythm consistency (deviation from median).
     */
    calculateRhythmConfidence(timeSinceLastStep) {
        // First check time window - if invalid, return low confidence immediately
        if (timeSinceLastStep < MIN_STEP_INTERVAL || timeSinceLastStep > MAX_STEP_INTERVAL) {
            return 0.2; // Very low confidence for invalid timing
        }

        if (this.stepIntervals.length < 2) {
            return 0.6; // Moderate confidence for first few steps
        }

        // Calculate median interval for rhythm reference
        const sortedIntervals = [...this.stepIntervals].sort((a, b) => a - b);
        const mid = Math.floor(sortedIntervals.length / 2);
        const medianInterval = sortedIntervals.length % 2 !== 0
            ? sortedIntervals[mid]
            : (sortedIntervals[mid - 1] + sortedIntervals[mid]) / 2;

        // Calculate deviation and normalize
        const deviation = Math.abs(timeSinceLastStep - medianInterval);
        const normalizedDeviation = deviation / medianInterval;

        // Max allowed deviation for high confidence (e.g., 50%)
        const maxAllowedDeviation = 0.5;

        // Confidence calculation: 1.0 when deviation is 0, decreases linearly to 0.1 at maxAllowedDeviation
        // Clamp normalizedDeviation to maxAllowedDeviation for calculation
        const clampedDeviation = Math.min(normalizedDeviation, maxAllowedDeviation);
        let confidence = 1.0 - (clampedDeviation / maxAllowedDeviation) * 0.9; // Scale from 1.0 to 0.1

        return Math.max(0.1, Math.min(1.0, confidence));
    }

    // --- Core Processing Loop ---

    /**
     * Process accelerometer data and detect steps.
     */
    processAcceleration(acceleration) {
        const currentTimestamp = Date.now();

        // 1. Estimate Gravity
        this.estimateGravity(acceleration);

        // 2. Calculate Dynamic Magnitude
        const rawDynamicMagnitude = this.calculateDynamicMagnitude(acceleration);

        // Filter out very small movements (CRITICAL for noise rejection while standing still)
        if (rawDynamicMagnitude < MIN_DYNAMIC_MAGNITUDE_FOR_ACTIVITY) {
            // Check for inactivity if currently tracking
            if (this.isTracking && currentTimestamp - this.lastStepTime >= INACTIVITY_TIMEOUT) {
                this.handleInactivity();
            }
            return { stepDetected: false, isTracking: this.isTracking };
        }

        // 3. Apply Low-Pass Filter
        const magnitude = this.applyLowPassFilter(rawDynamicMagnitude);

        if (!this.isInitialized) {
            this.lastAccelerationMagnitude = magnitude;
            this.accelerationHistory.push(magnitude);
            this.isInitialized = true;
            return { stepDetected: false, isTracking: false };
        }

        // Calculate time since last step (handle first step case)
        const timeSinceLastStep = this.lastStepTime > 0
            ? currentTimestamp - this.lastStepTime
            : MAX_STEP_INTERVAL; // For first step, use max interval to allow it

        // 4. Detect Valley (tracks noise floor and updates adaptive threshold)
        // Check BEFORE adding to history for proper local minimum detection
        this.detectValley(magnitude);
        this.updateAdaptiveThreshold();

        // 5. Detect Peak Conditions
        // Check if current magnitude is a local maximum BEFORE adding to history
        let isLocalMax = false;
        if (this.accelerationHistory.length >= PEAK_DETECTION_WINDOW - 1) {
            // Get recent history (excluding current magnitude)
            const recentHistory = this.accelerationHistory.slice(-(PEAK_DETECTION_WINDOW - 1));
            // Current magnitude is a local max if it's greater than all values in the window
            isLocalMax = recentHistory.every(value => magnitude > value);
        }

        // Add current magnitude to history AFTER peak/valley detection
        this.accelerationHistory.push(magnitude);
        if (this.accelerationHistory.length > 20) {
            this.accelerationHistory.shift();
        }

        const isSignificantMovement = magnitude > this.adaptiveThreshold;

        let stepDetected = false;

        // Step Detection: Local Max + Significant Movement + Valid Timing + High Confidence
        if (isLocalMax && isSignificantMovement) {

            // Check Timing
            const timeWindowValid = timeSinceLastStep >= MIN_STEP_INTERVAL && timeSinceLastStep <= MAX_STEP_INTERVAL;

            if (timeWindowValid) {
                // Check Confidence (Rhythm)
                const rhythmConfidence = this.calculateRhythmConfidence(timeSinceLastStep);

                if (rhythmConfidence >= CONFIDENCE_THRESHOLD) {
                    stepDetected = true;
                }
            }
        }

        // Update last magnitude for next comparison
        this.lastAccelerationMagnitude = magnitude;

        // 6. Handle Step Detection
        if (stepDetected) {
            // Recalculate and push interval
            if (this.lastStepTime > 0) {
                const interval = currentTimestamp - this.lastStepTime;
                this.stepIntervals.push(interval);
                if (this.stepIntervals.length > STEP_HISTORY_SIZE) {
                    this.stepIntervals.shift();
                }
            }

            // Step detected!
            this.lastStepTime = currentTimestamp;
            // Don't reset valleys completely - keep some history for threshold calculation
            // Only clear if we have too many, but keep at least 2-3 recent valleys
            if (this.recentValleys.length > 5) {
                this.recentValleys = this.recentValleys.slice(-3);
            }

            if (!this.isTracking) this.isTracking = true;

            this.clearInactivityTimeout();
            this.setInactivityTimeout();

            if (this.onStepDetected) this.onStepDetected();
            if (this.onTrackingStateChanged && this.isTracking) this.onTrackingStateChanged(true);

            return { stepDetected: true, isTracking: this.isTracking };
        } else {
            // Handle Inactivity
            if (this.isTracking && currentTimestamp - this.lastStepTime >= INACTIVITY_TIMEOUT) {
                this.handleInactivity();
                return { stepDetected: false, isTracking: false };
            }
        }

        return { stepDetected: false, isTracking: this.isTracking };
    }

    // --- Utility Methods (Inactivity, Reset, Callbacks) ---

    setInactivityTimeout() {
        this.clearInactivityTimeout();
        this.inactivityTimeout = setTimeout(() => {
            this.handleInactivity();
        }, INACTIVITY_TIMEOUT);
    }

    clearInactivityTimeout() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
            this.inactivityTimeout = null;
        }
    }

    handleInactivity() {
        this.isTracking = false;
        this.clearInactivityTimeout();

        if (this.onTrackingStateChanged) {
            this.onTrackingStateChanged(false);
        }
        if (this.onInactivityDetected) {
            this.onInactivityDetected();
        }
    }

    reset() {
        this.lastStepTime = 0;
        this.lastAccelerationMagnitude = 0;
        this.accelerationHistory = [];
        this.isInitialized = false;
        this.isTracking = false;
        this.stepIntervals = [];
        this.baselineGravity = { x: 0, y: 0, z: 0 };
        this.gravityEstablished = false;
        this.adaptiveThreshold = INITIAL_ACCELERATION_THRESHOLD;
        this.recentPeaks = [];
        this.recentValleys = [];
        this.filteredMagnitude = 0;
        this.gravitySamples = null;
        this.clearInactivityTimeout();
    }

    setOnStepDetected(callback) {
        this.onStepDetected = callback;
    }

    setOnTrackingStateChanged(callback) {
        this.onTrackingStateChanged = callback;
    }

    setOnInactivityDetected(callback) {
        this.onInactivityDetected = callback;
    }

    getTrackingState() {
        return this.isTracking;
    }

    cleanup() {
        this.clearInactivityTimeout();
        this.reset();
    }
}

// Export singleton instance
export default new StepCounterService();