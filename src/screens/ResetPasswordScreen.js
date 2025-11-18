import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, BorderRadius, FontWeight } from '../styles';
import { Input, Button, HeaderLogo } from '../components';
import { resetPasswordSchema } from '../validations/authSchemas';

export default function ResetPasswordScreen({ navigation, route }) {
  const handleResetPassword = async (values, { setSubmitting }) => {
    try {
      // TODO: Implement reset password logic
      console.log('Reset password:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Navigate to login after successful reset
      navigation.replace('Login');
    } catch (error) {
      console.error('Reset password error:', error);
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
              <Ionicons name="lock-closed-outline" size={Sizes.icon.huge} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your new password below. Make sure it's strong and secure.
            </Text>
          </View>

          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleResetPassword}
          >
            {({ handleSubmit, isSubmitting }) => (
              <View style={styles.form}>
                <Input
                  name="password"
                  label="New Password"
                  placeholder="Enter new password"
                  icon="lock-closed-outline"
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Input
                  name="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  icon="lock-closed-outline"
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <View style={styles.passwordRequirements}>
                  <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                  <Text style={styles.requirement}>• At least 6 characters</Text>
                  <Text style={styles.requirement}>• One uppercase letter</Text>
                  <Text style={styles.requirement}>• One lowercase letter</Text>
                  <Text style={styles.requirement}>• One number</Text>
                </View>

                <Button
                  title="Reset Password"
                  onPress={handleSubmit}
                  variant="primary"
                  size="large"
                  loading={isSubmitting}
                  fullWidth
                  style={styles.resetButton}
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
    marginBottom: Sizes.xxxl,
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
  passwordRequirements: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.card.s,
    padding: Sizes.l,
    marginBottom: Sizes.xl,
  },
  requirementsTitle: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Sizes.s,
  },
  requirement: {
    fontSize: Sizes.fontSize.s,
    color: Colors.text.secondary,
    marginBottom: Sizes.xs,
  },
  resetButton: {
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

