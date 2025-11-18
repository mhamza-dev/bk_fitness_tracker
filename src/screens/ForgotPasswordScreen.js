import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, BorderRadius, FontWeight } from '../styles';
import { Input, Button, HeaderLogo } from '../components';
import { forgotPasswordSchema } from '../validations/authSchemas';

export default function ForgotPasswordScreen({ navigation }) {
  const handleSendResetLink = async (values, { setSubmitting }) => {
    try {
      // TODO: Implement forgot password logic
      console.log('Send reset link to:', values.email);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Navigate to reset password screen after sending email
      navigation.replace('Reset Password', { email: values.email });
    } catch (error) {
      console.error('Forgot password error:', error);
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
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-open-outline" size={Sizes.icon.huge} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Don't worry! Enter your email address and we'll send you a link to reset your password.
            </Text>
          </View>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSendResetLink}
          >
            {({ handleSubmit, isSubmitting }) => (
              <View style={styles.form}>
                <Input
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  icon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Button
                  title="Send Reset Link"
                  onPress={handleSubmit}
                  variant="primary"
                  size="large"
                  loading={isSubmitting}
                  fullWidth
                  style={styles.sendButton}
                />

                <TouchableOpacity
                  style={styles.backToLogin}
                  onPress={() => navigation.replace('Login')}
                >
                  <Ionicons name="arrow-back" size={Sizes.icon.s} color={Colors.primary} />
                  <Text style={styles.backToLoginText}>Back to Login</Text>
                </TouchableOpacity>
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
  header: {
    marginBottom: Sizes.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: Sizes.massive,
    height: Sizes.massive,
    borderRadius: BorderRadius.avatar.xl,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.xl,
  },
  title: {
    fontSize: Sizes.fontSize.massive,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.m,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Sizes.fontSize.l * 1.5,
    paddingHorizontal: Sizes.l,
  },
  form: {
    width: '100%',
  },
  sendButton: {
    marginBottom: Sizes.xl,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizes.xl,
  },
  backToLoginText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
    marginLeft: Sizes.xs,
  },
});

