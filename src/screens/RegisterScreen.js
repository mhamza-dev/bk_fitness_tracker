import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { Colors, Sizes, FontWeight, BorderRadius } from '../styles';
import { Input, Button, Link, HeaderLogo } from '../components';
import { registerSchema } from '../validations/authSchemas';
import { authAPI } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [error, setError] = useState(null);

  const handleRegister = async (values, { setSubmitting, setFieldError }) => {
    try {
      setError(null);

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = values;

      // Call registration API
      const response = await authAPI.register(userData);

      // Show success message
      Alert.alert(
        'Success',
        'Account created successfully! Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login on success
              navigation.replace('Login');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);

      // Handle specific error cases
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);

      // Set field errors if available
      if (error.message?.includes('email')) {
        setFieldError('email', errorMessage);
      } else {
        // Show general error alert
        Alert.alert('Registration Failed', errorMessage);
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
          >
            {({ handleSubmit, isSubmitting }) => (
              <View style={styles.form}>
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <Input
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  icon="person-outline"
                  autoCapitalize="words"
                  autoCorrect={false}
                />

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

                <Input
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  icon="lock-closed-outline"
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Button
                  title="Sign Up"
                  onPress={handleSubmit}
                  variant="primary"
                  size="large"
                  loading={isSubmitting}
                  fullWidth
                  style={styles.registerButton}
                />

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <Link
                    text="Sign In"
                    onPress={() => navigation.replace('Login')}
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
  registerButton: {
    marginTop: Sizes.l,
    marginBottom: Sizes.xl,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Sizes.xl,
  },
  loginText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  loginLink: {
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

