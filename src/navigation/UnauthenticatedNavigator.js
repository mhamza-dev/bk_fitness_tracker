import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const Stack = createStackNavigator();

const UnauthenticatedNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Login" component={LoginScreen}
            />
            <Stack.Screen name="Register" component={RegisterScreen}
            />
            <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen}
            />
            <Stack.Screen name="Reset Password" component={ResetPasswordScreen} />
        </Stack.Navigator>
    );
};

export default UnauthenticatedNavigator;