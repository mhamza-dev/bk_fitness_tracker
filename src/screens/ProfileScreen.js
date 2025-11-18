import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components';
import { Colors, Sizes, FontWeight } from '../styles';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'BK';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getUserInitials()}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'User Profile'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Text style={styles.sectionText}>Profile settings coming soon...</Text>
        </View>
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            size="large"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    padding: Sizes.l,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Sizes.xxxl,
    paddingTop: Sizes.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.l,
  },
  avatarText: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.inverse,
  },
  name: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.xs,
  },
  email: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  section: {
    marginTop: Sizes.xl,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.m,
  },
  sectionText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  logoutContainer: {
    marginTop: Sizes.xxxl,
  },
});

