/**
 * Subscription Screen
 * Screen for purchasing subscription to unlock feed features
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionStore } from '../stores';
import { Colors, Sizes, FontWeight, BorderRadius } from '../styles';
import { DEFAULT_SUBSCRIPTION_PLANS, SUBSCRIPTION_FEATURES, FREE_PLAN } from '../constants';
import { Button } from '../components';

export default function SubscriptionScreen({ navigation, route }) {
    const { getPlans, purchaseSubscription, fetchSubscription, hasActiveSubscription } = useSubscriptionStore();
    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const scrollViewRef = React.useRef(null);

    // Get feature from route params, default to 'this feature'
    const feature = route?.params?.feature || 'this feature';
    const isPremium = hasActiveSubscription();

    useEffect(() => {
        loadPlans();
        fetchSubscription();
    }, []);

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
                'Subscription purchased successfully! You now have access to all premium features including liking posts, commenting, creating posts, and personalized daily diet plans.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack();
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
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={Sizes.icon.l} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Unlock Feed Features</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerSection}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={isPremium ? "checkmark-circle" : "lock-closed"}
                            size={Sizes.icon.xxl}
                            color={isPremium ? Colors.success : Colors.primary}
                        />
                    </View>
                    <Text style={styles.title}>
                        {isPremium ? 'Manage Your Subscription' : 'Upgrade to Premium'}
                    </Text>
                    <Text style={styles.description}>
                        {isPremium
                            ? 'You currently have an active premium subscription. Upgrade to a different plan or manage your subscription below.'
                            : `You're currently on the free plan. Upgrade to premium to unlock all features including ${feature}.`
                        }
                    </Text>
                </View>

                {/* Current Plan Card - Show Free Plan for non-premium users */}
                {!isPremium && (
                    <View style={styles.currentPlanSection}>
                        <Text style={styles.currentPlanTitle}>Your Current Plan</Text>
                        <View style={[styles.planCard, styles.freePlanCard]}>
                            <View style={styles.planHeader}>
                                <View style={styles.currentPlanBadge}>
                                    <Ionicons name="checkmark-circle" size={Sizes.icon.s} color={Colors.text.inverse} />
                                    <Text style={styles.currentPlanText}>Current</Text>
                                </View>
                            </View>
                            <Text style={styles.planName}>{FREE_PLAN.name} Plan</Text>
                            <View style={styles.planPrice}>
                                <Text style={styles.priceAmount}>Free</Text>
                            </View>
                            <View style={styles.planFeatures}>
                                {FREE_PLAN.features.map((feature, index) => (
                                    <View key={index} style={styles.planFeatureItem}>
                                        <Ionicons name="checkmark" size={Sizes.icon.s} color={Colors.text.secondary} />
                                        <Text style={[styles.planFeatureText, styles.freePlanFeatureText]}>{feature}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.restrictionsSection}>
                                <Text style={styles.restrictionsTitle}>Restrictions:</Text>
                                {FREE_PLAN.restrictions.map((restriction, index) => (
                                    <View key={index} style={styles.restrictionItem}>
                                        <Ionicons name="close-circle" size={Sizes.icon.s} color={Colors.error} />
                                        <Text style={styles.restrictionText}>{restriction}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                {/* Upgrade to Premium Button - Only show for free plan users */}
                {!isPremium && (
                    <View style={styles.upgradeSection}>
                        <TouchableOpacity
                            style={styles.upgradeButton}
                            onPress={() => {
                                // Scroll to premium plans section
                                setTimeout(() => {
                                    scrollViewRef.current?.scrollToEnd({ animated: true });
                                }, 100);
                            }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="arrow-up-circle" size={Sizes.icon.l} color={Colors.text.inverse} />
                            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                            <Ionicons name="chevron-forward" size={Sizes.icon.m} color={Colors.text.inverse} />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.featuresSection}>
                    <Text style={styles.featuresTitle}>
                        {isPremium ? 'Your Premium Features:' : 'Unlock Premium Features:'}
                    </Text>
                    {SUBSCRIPTION_FEATURES.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={Sizes.icon.m} color={Colors.success} />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
                {loadingPlans ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Loading plans...</Text>
                    </View>
                ) : (
                    <View style={styles.plansContainer}>
                        {!isPremium && (
                            <Text style={styles.premiumPlansTitle}>Choose Your Premium Plan</Text>
                        )}
                        {plans.filter(plan => plan.id !== 'free' && plan.price > 0).map((plan) => (
                            <View
                                key={plan.id}
                                style={styles.planCard}
                            >
                                <View style={styles.planHeader}>
                                    <Text style={styles.planName}>{plan.name}</Text>
                                    {plan.name?.includes('Yearly') && (
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
                                        {plan.name?.includes('Yearly') ? '/year' : '/month'}
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
                                <Button
                                    title={plan.name?.includes('Yearly') ? 'Buy Yearly Plan' : 'Buy Monthly Plan'}
                                    onPress={() => handlePurchase(plan.id)}
                                    loading={purchasing}
                                    variant="primary"
                                    size="medium"
                                    fullWidth
                                    style={styles.purchaseButton}
                                />
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Free plan users can view the feed but cannot like, comment, create posts, or access personalized diet plans. Upgrade to premium to unlock all features.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Sizes.l,
        paddingVertical: Sizes.m,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.light,
    },
    backButton: {
        padding: Sizes.xs,
    },
    headerTitle: {
        fontSize: Sizes.fontSize.l,
        fontWeight: FontWeight.bold,
        color: Colors.text.primary,
    },
    headerSpacer: {
        width: Sizes.icon.l + Sizes.xs * 2,
    },
    content: {
        flex: 1,
    },
    headerSection: {
        alignItems: 'center',
        marginTop: Sizes.xl,
        marginBottom: Sizes.xl,
        paddingHorizontal: Sizes.l,
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
        marginHorizontal: Sizes.l,
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
        paddingHorizontal: Sizes.l,
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
        marginBottom: Sizes.xl,
    },
    footerText: {
        fontSize: Sizes.fontSize.xs,
        color: Colors.text.tertiary,
        textAlign: 'center',
        lineHeight: 18,
    },
    currentPlanSection: {
        marginBottom: Sizes.xl,
        paddingHorizontal: Sizes.l,
    },
    currentPlanTitle: {
        fontSize: Sizes.fontSize.l,
        fontWeight: FontWeight.bold,
        color: Colors.text.primary,
        marginBottom: Sizes.m,
    },
    freePlanCard: {
        borderColor: Colors.primary,
        borderWidth: 2,
        backgroundColor: Colors.primary + '10',
    },
    currentPlanBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Sizes.s,
        paddingVertical: Sizes.xs / 2,
        borderRadius: BorderRadius.s,
    },
    currentPlanText: {
        fontSize: Sizes.fontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.text.inverse,
        marginLeft: Sizes.xs / 2,
    },
    freePlanFeatureText: {
        color: Colors.text.secondary,
    },
    restrictionsSection: {
        marginTop: Sizes.m,
        paddingTop: Sizes.m,
        borderTopWidth: 1,
        borderTopColor: Colors.border.light,
    },
    restrictionsTitle: {
        fontSize: Sizes.fontSize.s,
        fontWeight: FontWeight.semibold,
        color: Colors.text.primary,
        marginBottom: Sizes.xs,
    },
    restrictionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Sizes.xs,
    },
    restrictionText: {
        fontSize: Sizes.fontSize.s,
        color: Colors.text.secondary,
        marginLeft: Sizes.xs,
    },
    upgradeSection: {
        paddingHorizontal: Sizes.l,
        marginBottom: Sizes.xl,
    },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: Sizes.m,
        paddingHorizontal: Sizes.l,
        borderRadius: BorderRadius.m,
        elevation: 2,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    upgradeButtonText: {
        fontSize: Sizes.fontSize.l,
        fontWeight: FontWeight.bold,
        color: Colors.text.inverse,
        marginHorizontal: Sizes.s,
    },
    premiumPlansTitle: {
        fontSize: Sizes.fontSize.l,
        fontWeight: FontWeight.bold,
        color: Colors.text.primary,
        marginBottom: Sizes.m,
        textAlign: 'center',
    },
    purchaseButton: {
        marginTop: Sizes.m,
    },
});

