import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import { Colors, Sizes, FontWeight } from '../styles';

const Stack = createStackNavigator();

const UnauthenticatedNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.navigation.headerBackground,
                },
                headerTintColor: Colors.navigation.headerText,
                headerTitleStyle: {
                    fontWeight: FontWeight.bold,
                },
                tabBarActiveTintColor: Colors.navigation.tabActive,
                tabBarInactiveTintColor: Colors.navigation.tabInactive,
                tabBarStyle: {
                    paddingBottom: Sizes.xs,
                    paddingTop: Sizes.xs,
                    height: Sizes.tabBar.height,
                },
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    title: 'Login',
                }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                    title: 'Register',
                }}
            />
            <Stack.Screen
                name="Forgot Password"
                component={ForgotPasswordScreen}
                options={{
                    title: 'Forgot Password',
                }}
            />
            <Stack.Screen
                name="Reset Password"
                component={ResetPasswordScreen}
                options={{
                    title: 'Reset Password',
                }}
            />
        </Stack.Navigator>
    );
};

export default UnauthenticatedNavigator;