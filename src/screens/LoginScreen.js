import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { Colors, Sizes, FontWeight, BorderRadius } from '../styles';
import { Input, Button, Link, HeaderLogo } from '../components';
import { loginSchema } from '../validations/authSchemas';
import { loginUser } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    try {
      setError(null);

      console.log('Attempting login to:', process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api');

      // Call login API
      const response = await loginUser(values.email, values.password);

      console.log('Login response:', response);

      // Extract user data and token from response
      // Response format could be: { user: {...}, token: "..." } or { ...userData, token: "..." }
      const userData = response.user || (response.token ? { ...response, token: undefined } : response);
      const token = response.token;

      if (!token) {
        throw new Error('No authentication token received');
      }

      // Update auth context
      await login(userData, token);

      console.log('Login successful, auth state updated');
      // Navigation will happen automatically via AuthContext
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        isNetworkError: error.isNetworkError,
        originalError: error.originalError,
      });

      // Handle specific error cases
      let errorMessage = error.message || 'Login failed. Please check your credentials.';

      // Provide more helpful message for network errors
      if (error.isNetworkError) {
        errorMessage = error.message;
      }

      setError(errorMessage);

      // Set field errors if available
      if (error.message?.includes('email') || error.message?.includes('password')) {
        setFieldError('password', errorMessage);
      } else {
        // Show general error alert
        Alert.alert('Login Failed', errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <HeaderLogo logoStyle={styles.logoStyle} />
          </View>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ handleSubmit, isSubmitting }) => (
              <View style={styles.form}>
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <Input
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  icon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Input
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  icon="lock-closed-outline"
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <View style={styles.forgotPasswordContainer}>
                  <Link
                    text="Forgot Password?"
                    onPress={() => navigation.replace('Forgot Password')}
                    variant="primary"
                    style={styles.forgotPassword}
                  />
                </View>

                <Button
                  title="Login"
                  onPress={handleSubmit}
                  variant="primary"
                  size="large"
                  loading={isSubmitting}
                  fullWidth
                  style={styles.loginButton}
                />

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Don't have an account? </Text>
                  <Link
                    text="Sign Up"
                    onPress={() => navigation.replace('Register')}
                    variant="primary"
                  />
                </View>
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Sizes.l,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Sizes.xl,
  },
  logoStyle: {
    height: Sizes.image.xs,
    width: Sizes.image.xs,
  },
  header: {
    marginBottom: Sizes.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: Sizes.fontSize.massive,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.s,
  },
  subtitle: {
    fontSize: Sizes.fontSize.l,
    color: Colors.text.secondary,
  },
  form: {
    width: '100%',
  },
  forgotPasswordContainer: {
    marginBottom: Sizes.xl,
    alignItems: 'flex-end',
  },
  loginButton: {
    marginBottom: Sizes.xl,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Sizes.xl,
  },
  registerText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  registerLink: {
    fontSize: Sizes.fontSize.m,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  errorContainer: {
    backgroundColor: Colors.error + '20',
    borderRadius: BorderRadius.m,
    padding: Sizes.m,
    marginBottom: Sizes.l,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: Sizes.fontSize.s,
    textAlign: 'center',
  },
});

