import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Sizes, FontWeight, BorderRadius, Shadows } from '../styles';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Statistics</Text>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Steps</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Calories Burned</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>0 m</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Time</Text>
          <Text style={styles.statValue}>0 min</Text>
        </View>
      </ScrollView>
    </View>
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
  title: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: FontWeight.bold,
    marginBottom: Sizes.xl,
    color: Colors.text.primary,
  },
  statCard: {
    backgroundColor: Colors.background.secondary,
    padding: Sizes.xl,
    borderRadius: BorderRadius.card.m,
    marginBottom: Sizes.l,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.small,
  },
  statLabel: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
    marginBottom: Sizes.s,
  },
  statValue: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
});

