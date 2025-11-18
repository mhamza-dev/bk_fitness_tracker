import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AuthenticatedNavigator from './src/navigation/AuthenticatedNavigator';
import UnauthenticatedNavigator from './src/navigation/UnauthenticatedNavigator';
import { Colors } from './src/styles';

/**
 * Main Navigation Component
 * Switches between authenticated and unauthenticated navigators
 */
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Debug logging
  React.useEffect(() => {
    console.log('AppNavigator - Auth state changed:', { isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading]);

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Show appropriate navigator based on auth status
  console.log('AppNavigator rendering - isAuthenticated:', isAuthenticated);

  return (
    <NavigationContainer key={isAuthenticated ? 'authenticated' : 'unauthenticated'}>
      {isAuthenticated ? <AuthenticatedNavigator /> : <UnauthenticatedNavigator />}
    </NavigationContainer>
  );
};

/**
 * Root App Component
 */
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
});