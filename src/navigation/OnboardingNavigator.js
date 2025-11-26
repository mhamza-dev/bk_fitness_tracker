/**
 * Onboarding Navigator
 * Stack navigator for the onboarding flow
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PersonalDetailsScreen from '../screens/onboarding/PersonalDetailsScreen';
import AllergiesScreen from '../screens/onboarding/AllergiesScreen';
import PhysicalIssuesScreen from '../screens/onboarding/PhysicalIssuesScreen';
import { Colors, Sizes, FontWeight } from '../styles';

const Stack = createStackNavigator();

const OnboardingNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="PersonalDetails"
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
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen
                name="PersonalDetails"
                component={PersonalDetailsScreen}
                options={{
                    title: 'Personal Details',
                    headerLeft: null, // Prevent going back
                }}
            />
            <Stack.Screen
                name="Allergies"
                component={AllergiesScreen}
                options={{
                    title: 'Allergies',
                }}
            />
            <Stack.Screen
                name="PhysicalIssues"
                component={PhysicalIssuesScreen}
                options={{
                    title: 'Physical Issues',
                }}
            />
        </Stack.Navigator>
    );
};

export default OnboardingNavigator;


