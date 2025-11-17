import React from 'react';
// import AuthenticatedNavigator from './src/navigation/AuthenticatedNavigator.js';
import UnauthenticatedNavigator from './src/navigation/UnauthenticatedNavigator.js';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <UnauthenticatedNavigator />
    </NavigationContainer>
  );
}