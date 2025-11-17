import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, BorderRadius, FontWeight, Shadows, CommonStyles } from '../styles';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSendResetLink = () => {
    // TODO: Implement forgot password logic
    console.log('Send reset link to:', email);
    // Navigate to reset password screen after sending email
    navigation.navigate('Reset Password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-open-outline" size={Sizes.icon.huge} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Don't worry! Enter your email address and we'll send you a link to reset your password.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={Sizes.icon.m} color={Colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.text.tertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={handleSendResetLink}>
              <Text style={styles.sendButtonText}>Send Reset Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLogin}
              onPress={() => navigation.navigate('Login')}
            >
              <Ionicons name="arrow-back" size={Sizes.icon.s} color={Colors.primary} />
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    padding: Sizes.xl,
  },
  header: {
    marginTop: Sizes.xxxl,
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
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.input.m,
    borderWidth: Sizes.borderWidth.thin,
    borderColor: Colors.border.light,
    marginBottom: Sizes.xl,
    paddingHorizontal: Sizes.l,
    height: Sizes.input.m,
  },
  inputIcon: {
    marginRight: Sizes.m,
  },
  input: {
    flex: 1,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
  },
  sendButton: {
    ...CommonStyles.buttonBase,
    backgroundColor: Colors.primary,
    height: Sizes.button.m,
    marginBottom: Sizes.xl,
    ...Shadows.medium,
  },
  sendButtonText: {
    fontSize: Sizes.fontSize.l,
    fontWeight: FontWeight.bold,
    color: Colors.white,
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

