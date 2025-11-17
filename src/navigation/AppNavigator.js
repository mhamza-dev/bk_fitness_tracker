import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StepTrackerScreen from '../screens/StepTrackerScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="StepTracker"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#2196F3',
                },
                headerTintColor: '#fff',
            }}
        >
            <Stack.Screen
                name="StepTracker"
                component={StepTrackerScreen}
                options={{
                    title: 'Step Tracker',
                }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;