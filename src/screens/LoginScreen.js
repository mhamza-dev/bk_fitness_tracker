import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { Colors, Sizes, FontWeight } from '../styles';
import { Input, Button, Link, HeaderLogo } from '../components';
import { loginSchema } from '../validations/authSchemas';

export default function LoginScreen({ navigation }) {
  const handleLogin = async (values, { setSubmitting }) => {
    try {
      // TODO: Implement login logic
      console.log('Login:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Login error:', error);
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
});

