/**
 * Home Screen
 * Dashboard showing today's fitness stats, nutrition, and quick overview
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts';
import { useFitnessData, useWeight, useMeal, useProfile } from '../hooks';
import { Card } from '../components';
import { Colors, Sizes, FontWeight, BorderRadius, Shadows } from '../styles';
import moment from 'moment';

export default function HomeScreen() {
  const { user } = useAuth();
  const { profile, fetchProfile } = useProfile();
  const { getFitnessDataByDate, updateSteps } = useFitnessData();
  const { getLatestWeight, getWeightProgress } = useWeight();
  const { getDailyNutrition, getMealsByDate } = useMeal();

  const [todayData, setTodayData] = useState({
    steps: 0,
    calories: 0,
    distance: 0,
    waterIntake: 0,
    sleepHours: 0,
    sleepQuality: null,
    workouts: [],
  });
  const [nutrition, setNutrition] = useState(null);
  const [latestWeight, setLatestWeight] = useState(null);
  const [weightChange, setWeightChange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const today = moment().format('YYYY-MM-DD');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTodayFitnessData(),
        loadTodayNutrition(),
        loadWeightData(),
        loadProfile(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayFitnessData = async () => {
    try {
      const data = await getFitnessDataByDate(today);
      if (data) {
        setTodayData({
          steps: data.steps || 0,
          calories: ((data.steps || 0) * 0.05).toFixed(1),
          distance: ((data.steps || 0) * 0.762).toFixed(1),
          waterIntake: data.waterIntake || 0,
          waterUnit: data.waterUnit || 'ml',
          sleepHours: data.sleepHours || 0,
          sleepQuality: data.sleepQuality,
          workouts: data.workouts || [],
        });
      }
    } catch (error) {
      console.error('Error loading fitness data:', error);
    }
  };

  const loadTodayNutrition = async () => {
    try {
      const nutritionData = await getDailyNutrition(today);
      if (nutritionData) {
        setNutrition(nutritionData);
      }
    } catch (error) {
      console.error('Error loading nutrition:', error);
    }
  };

  const loadWeightData = async () => {
    try {
      const latest = await getLatestWeight();
      if (latest) {
        setLatestWeight(latest);
      }

      // Get weight progress for last 7 days
      const endDate = moment().format('YYYY-MM-DD');
      const startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
      const progress = await getWeightProgress(7);

      if (progress && progress.length >= 2) {
        const firstWeight = progress[0].weight;
        const lastWeight = progress[progress.length - 1].weight;
        const change = lastWeight - firstWeight;
        setWeightChange({
          value: Math.abs(change).toFixed(1),
          isPositive: change < 0, // Negative change means weight loss (positive)
        });
      }
    } catch (error) {
      console.error('Error loading weight data:', error);
    }
  };

  const loadProfile = async () => {
    try {
      await fetchProfile();
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ icon, label, value, unit, color = Colors.primary }) => (
    <Card variant="elevated" padding="medium" style={styles.statCard}>
      <View style={styles.statCardContent}>
        <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={Sizes.icon.l} color={color} />
        </View>
        <View style={styles.statTextContainer}>
          <Text style={styles.statValue}>
            {value} {unit && <Text style={styles.statUnit}>{unit}</Text>}
          </Text>
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      </View>
    </Card>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>
            {user?.name || user?.email?.split('@')[0] || 'User'}!
          </Text>
          <Text style={styles.dateText}>{moment().format('dddd, MMMM Do')}</Text>
        </View>

        {/* Today's Steps & Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Activity</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="footsteps"
              label="Steps"
              value={todayData.steps.toLocaleString()}
              color={Colors.primary}
            />
            <StatCard
              icon="flame"
              label="Calories"
              value={todayData.calories}
              unit="kcal"
              color="#FF6B6B"
            />
            <StatCard
              icon="walk"
              label="Distance"
              value={todayData.distance}
              unit="m"
              color="#4ECDC4"
            />
          </View>
        </View>

        {/* Health Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Metrics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="water"
              label="Water Intake"
              value={todayData.waterIntake}
              unit={todayData.waterUnit || 'ml'}
              color="#3498DB"
            />
            <StatCard
              icon="moon"
              label="Sleep"
              value={todayData.sleepHours || '0'}
              unit="hrs"
              color="#9B59B6"
            />
            {latestWeight && (
              <StatCard
                icon="scale"
                label="Weight"
                value={latestWeight.weight}
                unit={latestWeight.unit || 'kg'}
                color="#E67E22"
              />
            )}
          </View>
          {weightChange && (
            <Card variant="outlined" padding="medium" style={styles.weightChangeCard}>
              <View style={styles.weightChangeContent}>
                <Ionicons
                  name={weightChange.isPositive ? 'trending-down' : 'trending-up'}
                  size={Sizes.icon.m}
                  color={weightChange.isPositive ? Colors.success : Colors.error}
                />
                <Text style={styles.weightChangeText}>
                  {weightChange.isPositive ? 'Lost' : 'Gained'}{' '}
                  {weightChange.value} kg in the last 7 days
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Today's Nutrition */}
        {nutrition && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Nutrition</Text>
            <Card variant="elevated" padding="large" style={styles.nutritionCard}>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {nutrition.totalCalories?.toFixed(0) || '0'}
                  </Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {nutrition.totalProtein?.toFixed(1) || '0'}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {nutrition.totalCarbs?.toFixed(1) || '0'}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {nutrition.totalFats?.toFixed(1) || '0'}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Fats</Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Profile Info */}
        {profile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Info</Text>
            <Card variant="outlined" padding="medium" style={styles.profileCard}>
              <View style={styles.profileRow}>
                <Ionicons name="person" size={Sizes.icon.m} color={Colors.text.secondary} />
                <Text style={styles.profileText}>
                  {profile.height ? `${profile.height} ${profile.heightUnit || 'cm'}` : 'Height not set'}
                </Text>
              </View>
              {profile.allergies && profile.allergies.length > 0 && (
                <View style={styles.profileRow}>
                  <Ionicons name="warning" size={Sizes.icon.m} color={Colors.warning} />
                  <Text style={styles.profileText}>
                    {profile.allergies.length} Allerg{profile.allergies.length > 1 ? 'ies' : 'y'}
                  </Text>
                </View>
              )}
              {profile.physicalIssues && profile.physicalIssues.length > 0 && (
                <View style={styles.profileRow}>
                  <Ionicons name="medical" size={Sizes.icon.m} color={Colors.text.secondary} />
                  <Text style={styles.profileText}>
                    {profile.physicalIssues.length} Physical Issue{profile.physicalIssues.length > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </Card>
          </View>
        )}

        {/* Workouts */}
        {todayData.workouts && todayData.workouts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Workouts</Text>
            <Card variant="elevated" padding="medium" style={styles.workoutsCard}>
              {todayData.workouts.map((workout, index) => (
                <View key={index} style={styles.workoutItem}>
                  <Ionicons name="fitness" size={Sizes.icon.m} color={Colors.primary} />
                  <View style={styles.workoutDetails}>
                    <Text style={styles.workoutName}>{workout.type || 'Workout'}</Text>
                    <Text style={styles.workoutDuration}>
                      {workout.duration || 0} minutes
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Sizes.l,
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
  welcomeSection: {
    marginBottom: Sizes.xxxl,
  },
  welcomeText: {
    fontSize: Sizes.fontSize.l,
    color: Colors.text.secondary,
    marginBottom: Sizes.xs,
  },
  userName: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.xs,
  },
  dateText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.tertiary,
  },
  section: {
    marginBottom: Sizes.xxxl,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.l,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Sizes.m,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '48%',
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.m,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  statUnit: {
    fontSize: Sizes.fontSize.s,
    fontWeight: FontWeight.normal,
    color: Colors.text.secondary,
  },
  statLabel: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Sizes.xs / 2,
  },
  weightChangeCard: {
    marginTop: Sizes.m,
    backgroundColor: Colors.background.secondary,
  },
  weightChangeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightChangeText: {
    marginLeft: Sizes.s,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
  },
  nutritionCard: {
    backgroundColor: Colors.background.secondary,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Sizes.xs,
  },
  nutritionLabel: {
    fontSize: Sizes.fontSize.s,
    color: Colors.text.secondary,
  },
  profileCard: {
    backgroundColor: Colors.background.secondary,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.m,
  },
  profileText: {
    marginLeft: Sizes.s,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
  },
  workoutsCard: {
    backgroundColor: Colors.background.secondary,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.m,
  },
  workoutDetails: {
    marginLeft: Sizes.m,
    flex: 1,
  },
  workoutName: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Sizes.xs / 2,
  },
  workoutDuration: {
    fontSize: Sizes.fontSize.s,
    color: Colors.text.secondary,
  },
});
