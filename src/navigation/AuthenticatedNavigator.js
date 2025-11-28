import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../hooks';
import { useProfileStore } from '../stores';
import HomeScreen from '../screens/HomeScreen';
import StepTrackerScreen from '../screens/StepTrackerScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OnboardingNavigator from './OnboardingNavigator';
import HeaderLogo from '../components/HeaderLogo';
import { Colors, Sizes, FontWeight } from '../styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.navigation.headerBackground,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.border.light,
                },
                headerTintColor: Colors.navigation.headerText,
                headerTitleStyle: {
                    fontWeight: FontWeight.bold,
                    color: Colors.navigation.headerText,
                    fontSize: Sizes.fontSize.xl,
                },
                headerTitleContainerStyle: {
                    paddingBottom: Sizes.s,
                },
                headerLeft: () => <HeaderLogo logoStyle={{ width: Sizes.image.xxxs, height: Sizes.image.xxxs }} />,
                headerLeftContainerStyle: {
                    paddingLeft: Sizes.m,
                },
                tabBarActiveTintColor: Colors.navigation.tabActive,
                tabBarInactiveTintColor: Colors.navigation.tabInactive,
                tabBarStyle: {
                    backgroundColor: Colors.background.primary,
                    borderTopWidth: 1,
                    borderTopColor: Colors.border.light,
                    paddingBottom: Sizes.s,
                    paddingTop: Sizes.s,
                    height: Sizes.bottomBar.height,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    fontSize: Sizes.fontSize.xs,
                    fontWeight: FontWeight.medium,
                    marginTop: Sizes.xs,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size || Sizes.tabBar.iconSize} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="StepTracker"
                component={StepTrackerScreen}
                options={{
                    title: 'Tracker',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="walk" size={size || Sizes.tabBar.iconSize} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    title: 'Feed',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid" size={size || Sizes.tabBar.iconSize} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size || Sizes.tabBar.iconSize} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const AuthenticatedNavigator = () => {
    // Subscribe to profile store to get real-time updates
    const profile = useProfileStore((state) => state.profile);
    const loading = useProfileStore((state) => state.loading);
    const fetchProfile = useProfileStore((state) => state.fetchProfile);
    const [checkingProfile, setCheckingProfile] = useState(true);

    useEffect(() => {
        checkProfile();
    }, []);

    const checkProfile = async () => {
        try {
            await fetchProfile(true); // Force fetch to bypass cache
        } catch (error) {
            console.error('Error fetching profile:', error);
            // If profile doesn't exist (404), that's okay - user needs onboarding
        } finally {
            setCheckingProfile(false);
        }
    };

    // Show loading only during initial profile check (not during updates)
    // This prevents navigation reset when profile is updated
    if (checkingProfile || (loading && !profile)) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // If no profile exists, show onboarding
    if (!profile) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
            </Stack.Navigator>
        );
    }

    // Profile exists, show main app
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background.primary,
    },
});

export default AuthenticatedNavigator;
