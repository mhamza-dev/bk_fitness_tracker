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

export default function ResetPasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = () => {
    // TODO: Implement reset password logic
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      console.log('Password must be at least 6 characters');
      return;
    }
    console.log('Reset password:', { password });
    // Navigate to login after successful reset
    navigation.navigate('Login');
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
              <Ionicons name="lock-closed-outline" size={Sizes.icon.huge} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your new password below. Make sure it's strong and secure.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={Sizes.icon.m} color={Colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor={Colors.text.tertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={Sizes.icon.m}
                  color={Colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={Sizes.icon.m} color={Colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor={Colors.text.tertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={Sizes.icon.m}
                  color={Colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={styles.requirement}>• At least 6 characters</Text>
              <Text style={styles.requirement}>• Mix of letters and numbers</Text>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
              <Text style={styles.resetButtonText}>Reset Password</Text>
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
    marginBottom: Sizes.l,
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
  eyeIcon: {
    padding: Sizes.xs,
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
    ...CommonStyles.buttonBase,
    backgroundColor: Colors.primary,
    height: Sizes.button.m,
    marginBottom: Sizes.xl,
    ...Shadows.medium,
  },
  resetButtonText: {
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

