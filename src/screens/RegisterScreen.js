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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    // TODO: Implement registration logic
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    console.log('Register:', { name, email, password });
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={Sizes.icon.m} color={Colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={Colors.text.tertiary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

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

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={Sizes.icon.m} color={Colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
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
                placeholder="Confirm Password"
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

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
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
  registerButton: {
    ...CommonStyles.buttonBase,
    backgroundColor: Colors.primary,
    height: Sizes.button.m,
    marginTop: Sizes.l,
    marginBottom: Sizes.xl,
    ...Shadows.medium,
  },
  registerButtonText: {
    fontSize: Sizes.fontSize.l,
    fontWeight: FontWeight.bold,
    color: Colors.white,
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
});

