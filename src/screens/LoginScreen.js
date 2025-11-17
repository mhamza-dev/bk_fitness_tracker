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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('Login:', { email, password });
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
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

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('Forgot Password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Sign Up</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Sizes.xl,
  },
  forgotPasswordText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  loginButton: {
    ...CommonStyles.buttonBase,
    backgroundColor: Colors.primary,
    height: Sizes.button.m,
    marginBottom: Sizes.xl,
    ...Shadows.medium,
  },
  loginButtonText: {
    fontSize: Sizes.fontSize.l,
    fontWeight: FontWeight.bold,
    color: Colors.white,
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

