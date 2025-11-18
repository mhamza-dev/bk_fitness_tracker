import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Sizes } from '../styles';

const Container = ({
  children,
  safeArea = true,
  scrollable = false,
  keyboardAvoiding = false,
  padding = 'medium', // none, small, medium, large
  backgroundColor,
  style,
  contentContainerStyle,
  ...props
}) => {
  const getPaddingStyle = () => {
    if (padding === 'none') return styles.paddingNone;
    if (padding === 'small') return styles.paddingSmall;
    if (padding === 'medium') return styles.paddingMedium;
    if (padding === 'large') return styles.paddingLarge;
    return styles.paddingMedium;
  };

  const containerStyle = [
    styles.container,
    { backgroundColor: backgroundColor || Colors.background.primary },
    getPaddingStyle(),
    style,
  ];

  const content = (
    <>
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={containerStyle} {...props}>
          {children}
        </View>
      )}
    </>
  );

  if (keyboardAvoiding) {
    return (
      <>
        {safeArea ? (
          <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              {content}
            </KeyboardAvoidingView>
          </SafeAreaView>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            {content}
          </KeyboardAvoidingView>
        )}
      </>
    );
  }

  if (safeArea) {
    return <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>;
  }

  return content;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Sizes.m,
  },
  paddingMedium: {
    padding: Sizes.xl,
  },
  paddingLarge: {
    padding: Sizes.xxl,
  },
});

export default Container;

