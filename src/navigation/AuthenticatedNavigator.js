import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import StepTrackerScreen from '../screens/StepTrackerScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HeaderLogo from '../components/HeaderLogo';
import { Colors, Sizes, FontWeight } from '../styles';

const Tab = createBottomTabNavigator();

const AuthenticatedNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.navigation.headerBackground,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: Colors.navigation.headerText,
                headerTitleStyle: {
                    fontWeight: FontWeight.bold,
                    color: Colors.navigation.headerText,
                    fontSize: Sizes.fontSize.xl,
                },
                headerLeft: () => <HeaderLogo />,
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
                name="Stats"
                component={StatsScreen}
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart" size={size || Sizes.tabBar.iconSize} color={color} />
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

export default AuthenticatedNavigator;

