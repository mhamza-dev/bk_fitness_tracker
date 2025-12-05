/**
 * Subscription Modal
 * Modal for purchasing subscription to unlock feed features
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from '../Modal';
import { useSubscriptionStore } from '../../stores';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';
import { DEFAULT_SUBSCRIPTION_PLANS } from '../../constants';

export default function SubscriptionModal({ visible, onClose, feature = 'this feature' }) {
  const { subscription, loading, getPlans, purchaseSubscription, fetchSubscription } = useSubscriptionStore();
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (visible) {
      loadPlans();
      fetchSubscription();
    }
  }, [visible]);

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      const data = await getPlans();
      // If API returns data, use it; otherwise fall back to constants
      const fetchedPlans = Array.isArray(data) ? data : (data?.plans || []);
      setPlans(fetchedPlans.length > 0 ? fetchedPlans : DEFAULT_SUBSCRIPTION_PLANS);
    } catch (error) {
      console.error('Error loading plans from API, using default plans:', error);
      // Use default plans from constants if API fails
      setPlans(DEFAULT_SUBSCRIPTION_PLANS);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handlePurchase = async (planId) => {
    try {
      setPurchasing(true);
      await purchaseSubscription(planId);
      Alert.alert(
        'Success',
        'Subscription purchased successfully! You can now like, comment, and post on the feed.',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to purchase subscription. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Unlock Feed Features"
      maxHeight="80%"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={Sizes.icon.xxl} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Subscribe to Unlock</Text>
          <Text style={styles.description}>
            To {feature}, you need an active subscription. Choose a plan below to get started.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What you'll get:</Text>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={Sizes.icon.m} color={Colors.success} />
            <Text style={styles.featureText}>Like posts</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={Sizes.icon.m} color={Colors.success} />
            <Text style={styles.featureText}>Comment on posts</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={Sizes.icon.m} color={Colors.success} />
            <Text style={styles.featureText}>Create and share posts</Text>
          </View>
        </View>

        {loadingPlans ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading plans...</Text>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.planCard}
                onPress={() => handlePurchase(plan.id)}
                disabled={purchasing}
                activeOpacity={0.7}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.features?.includes('Save 17%') && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Best Value</Text>
                    </View>
                  )}
                </View>
                <View style={styles.planPrice}>
                  <Text style={styles.priceAmount}>
                    {plan.currency || 'PKR'} {typeof plan.price === 'number' ? plan.price.toLocaleString() : plan.price}
                  </Text>
                  <Text style={styles.pricePeriod}>
                    {plan.duration === 30 ? '/month' : plan.duration === 365 ? '/year' : `/${plan.duration} days`}
                  </Text>
                </View>
                {plan.features && (
                  <View style={styles.planFeatures}>
                    {plan.features
                      .filter(f => f !== 'Save 17%')
                      .map((feature, index) => (
                        <View key={index} style={styles.planFeatureItem}>
                          <Ionicons name="checkmark" size={Sizes.icon.s} color={Colors.primary} />
                          <Text style={styles.planFeatureText}>{feature}</Text>
                        </View>
                      ))}
                  </View>
                )}
                {purchasing && (
                  <View style={styles.purchasingOverlay}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can view the feed without a subscription. Subscription is required for interactive features.
          </Text>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: Sizes.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.m,
  },
  title: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.s,
    textAlign: 'center',
  },
  description: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Sizes.m,
  },
  featuresSection: {
    marginBottom: Sizes.xl,
    padding: Sizes.m,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.m,
  },
  featuresTitle: {
    fontSize: Sizes.fontSize.l,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Sizes.m,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.s,
  },
  featureText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
    marginLeft: Sizes.s,
  },
  loadingContainer: {
    padding: Sizes.xxxl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Sizes.m,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  plansContainer: {
    marginBottom: Sizes.xl,
  },
  planCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.m,
    padding: Sizes.l,
    marginBottom: Sizes.m,
    borderWidth: 2,
    borderColor: Colors.border.light,
    position: 'relative',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.m,
  },
  planName: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  badge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Sizes.s,
    paddingVertical: Sizes.xs / 2,
    borderRadius: BorderRadius.s,
  },
  badgeText: {
    fontSize: Sizes.fontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text.inverse,
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Sizes.m,
  },
  priceAmount: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  pricePeriod: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
    marginLeft: Sizes.xs,
  },
  planFeatures: {
    marginTop: Sizes.m,
  },
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.xs,
  },
  planFeatureText: {
    fontSize: Sizes.fontSize.s,
    color: Colors.text.primary,
    marginLeft: Sizes.xs,
  },
  purchasingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background.primary + 'CC',
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: Sizes.m,
    marginTop: Sizes.m,
  },
  footerText: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

