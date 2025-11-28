/**
 * Profile Screen
 * Displays user profile, weight history, allergies, and physical issues
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useProfile, useWeight, useMediaPicker } from '../hooks';
import { uploadMediaToCloudinary } from '../services/cloudinaryService';
import { Button, Card } from '../components';
import EditProfileModal from '../components/modals/EditProfileModal';
import NotificationsModal from '../components/modals/NotificationsModal';
import ViewProfilePictureModal from '../components/modals/ViewProfilePictureModal';
import ProfilePictureOptionsModal from '../components/modals/ProfilePictureOptionsModal';
import UpdateProfilePictureModal from '../components/modals/UpdateProfilePictureModal';
import { Colors, Sizes, FontWeight, BorderRadius } from '../styles';
import moment from 'moment';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { profile, loading: profileLoading, fetchProfile, updateProfile } = useProfile();
  const { weights, latestWeight, loading: weightLoading, getWeightHistory, getLatestWeight } = useWeight();

  const [refreshing, setRefreshing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showViewPicture, setShowViewPicture] = useState(false);
  const [showPictureOptions, setShowPictureOptions] = useState(false);
  const [showUpdatePicture, setShowUpdatePicture] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  // Use media picker for avatar updates (same config as CreatePostModal)
  const {
    pickMedia,
    takePhoto,
    clearMedia,
  } = useMediaPicker({
    aspect: [1, 1],
    imageQuality: 0.8,
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      await Promise.all([
        fetchProfile(),
        getLatestWeight(),
        getWeightHistory({ limit: 10 }),
      ]);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

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

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleNotifications = () => {
    setShowNotifications(true);
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'Need help? Contact us:\n\n' +
      'Email: support@bkfitness.com\n' +
      'Phone: +92 300 1234567\n' +
      'Hours: Mon-Fri 9AM-6PM\n\n' +
      'Visit our website for FAQs and tutorials.',
      [
        {
          text: 'OK',
          style: 'default',
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

  const handleAvatarPress = () => {
    setShowPictureOptions(true);
  };

  const handleTakePhoto = async () => {
    setShowUpdatePicture(false);
    const result = await takePhoto();
    if (result) {
      await uploadAvatar(result.uri, 'image');
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const result = await pickMedia();
      if (result && result.type === 'image') {
        await uploadAvatar(result.uri, 'image');
      } else if (result && result.type === 'video') {
        Alert.alert('Invalid Selection', 'Profile pictures must be images, not videos.');
      }
    } catch (error) {
      console.error('Error choosing from gallery:', error);
      Alert.alert('Error', error.message || 'Failed to choose from gallery');
    } finally {
      setShowUpdatePicture(false);
    }
  };

  const handleSelectSticker = async (sticker) => {
    await updateAvatarSticker(sticker);
  };

  const updateAvatarSticker = async (sticker) => {
    try {
      setUpdatingAvatar(true);
      // Store sticker URL as avatar image (replaces avatar, not avatarEmoji)
      await updateProfile({
        avatar: sticker.url,
        avatarEmoji: undefined, // Clear emoji if sticker is set
      });
      await fetchProfile();
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error updating avatar sticker:', error);
      Alert.alert('Error', error.message || 'Failed to update profile picture');
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const uploadAvatar = async (uri, type) => {
    try {
      setUpdatingAvatar(true);
      const result = await uploadMediaToCloudinary(uri, type, { folder: 'bk-fitness/avatars' });

      // Update profile with new avatar
      await updateProfile({
        avatar: result.url,
        avatarEmoji: undefined, // Clear emoji if image is set
      });

      // Refresh profile data
      await fetchProfile();
      clearMedia();

      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', error.message || 'Failed to update profile picture');
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const isLoading = profileLoading || weightLoading;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleAvatarPress}
            disabled={updatingAvatar}
            activeOpacity={0.7}
          >
            <View style={[styles.avatar, { backgroundColor: profile?.avatar || profile?.avatarEmoji ? 'transparent' : Colors.primary }]}>
              {profile?.avatar && typeof profile.avatar === 'string' && profile.avatar.trim() ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
              ) : profile?.avatarEmoji && typeof profile.avatarEmoji === 'string' && profile.avatarEmoji.trim() ? (
                <Text style={styles.avatarEmoji}>{profile.avatarEmoji}</Text>
              ) : (
                <Text style={styles.avatarText}>{getUserInitials()}</Text>
              )}
            </View>
            {updatingAvatar ? (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : (
              <View style={styles.avatarEditIcon}>
                <Ionicons name="camera" size={Sizes.icon.m} color={Colors.text.inverse} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.name}>{user?.name || 'User Profile'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        </View>

        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <>
            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <Card variant="outlined" padding="medium" style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar" size={Sizes.icon.m} color={Colors.text.secondary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Date of Birth</Text>
                    <Text style={styles.infoValue}>
                      {profile?.dateOfBirth
                        ? moment(profile.dateOfBirth).format('MMMM Do, YYYY')
                        : 'Not set'}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="resize" size={Sizes.icon.m} color={Colors.text.secondary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Height</Text>
                    <Text style={styles.infoValue}>
                      {profile?.height
                        ? `${profile.height} ${profile.heightUnit || 'cm'}`
                        : 'Not set'}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="scale" size={Sizes.icon.m} color={Colors.text.secondary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Current Weight</Text>
                    <Text style={styles.infoValue}>
                      {latestWeight
                        ? `${latestWeight.weight} ${latestWeight.unit || 'kg'}`
                        : 'Not recorded'}
                    </Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* Weight History */}
            {weights && weights.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Weight History</Text>
                <Card variant="elevated" padding="medium" style={styles.weightCard}>
                  {weights.slice(0, 5).map((weight, index) => (
                    <View key={weight._id || weight.id || index} style={styles.weightItem}>
                      <View style={styles.weightItemLeft}>
                        <Text style={styles.weightValue}>
                          {weight.weight} {weight.unit || 'kg'}
                        </Text>
                        <Text style={styles.weightDate}>
                          {moment(weight.date).format('MMM Do, YYYY')}
                        </Text>
                      </View>
                      {index < weights.length - 1 && index < 4 && (
                        <View style={styles.weightChange}>
                          {weight.weight < (weights[index + 1]?.weight || weight.weight) && (
                            <Ionicons name="trending-down" size={Sizes.icon.s} color={Colors.success} />
                          )}
                          {weight.weight > (weights[index + 1]?.weight || weight.weight) && (
                            <Ionicons name="trending-up" size={Sizes.icon.s} color={Colors.error} />
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </Card>
              </View>
            )}

            {/* Allergies */}
            {profile?.allergies && profile.allergies.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Allergies</Text>
                <Card variant="outlined" padding="medium" style={styles.allergiesCard}>
                  {profile.allergies.map((allergy, index) => (
                    <View key={index} style={styles.allergyItem}>
                      <Ionicons name="warning" size={Sizes.icon.s} color={Colors.warning} />
                      <Text style={styles.allergyText}>
                        {typeof allergy === 'string' ? allergy : allergy.name}
                      </Text>
                    </View>
                  ))}
                </Card>
              </View>
            )}

            {/* Physical Issues */}
            {profile?.physicalIssues && profile.physicalIssues.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Physical Issues</Text>
                <Card variant="outlined" padding="medium" style={styles.issuesCard}>
                  {profile.physicalIssues.map((issue, index) => (
                    <View key={index} style={styles.issueItem}>
                      <Ionicons name="medical" size={Sizes.icon.s} color={Colors.text.secondary} />
                      <Text style={styles.issueText}>
                        {typeof issue === 'string' ? issue : issue.name}
                      </Text>
                    </View>
                  ))}
                </Card>
              </View>
            )}

            {/* Empty States */}
            {(!profile?.allergies || profile.allergies.length === 0) &&
              (!profile?.physicalIssues || profile.physicalIssues.length === 0) && (
                <View style={styles.section}>
                  <Card variant="outlined" padding="large" style={styles.emptyCard}>
                    <Ionicons
                      name="information-circle-outline"
                      size={Sizes.icon.xl}
                      color={Colors.text.secondary}
                    />
                    <Text style={styles.emptyText}>
                      No allergies or physical issues recorded
                    </Text>
                    <Text style={styles.emptySubtext}>
                      Update your profile to add this information for better diet suggestions
                    </Text>
                  </Card>
                </View>
              )}
          </>
        )}

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card variant="outlined" padding="none" style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
              <Ionicons name="person-outline" size={Sizes.icon.m} color={Colors.text.primary} />
              <Text style={styles.settingText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={Sizes.icon.s} color={Colors.text.secondary} />
            </TouchableOpacity>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingItem} onPress={handleNotifications}>
              <Ionicons name="notifications-outline" size={Sizes.icon.m} color={Colors.text.primary} />
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={Sizes.icon.s} color={Colors.text.secondary} />
            </TouchableOpacity>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingItem} onPress={handleHelpSupport}>
              <Ionicons name="help-circle-outline" size={Sizes.icon.m} color={Colors.text.primary} />
              <Text style={styles.settingText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={Sizes.icon.s} color={Colors.text.secondary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={showEditProfile}
        onClose={() => {
          setShowEditProfile(false);
          loadProfileData(); // Refresh profile data after editing
        }}
        profile={profile}
      />

      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <ViewProfilePictureModal
        visible={showViewPicture}
        onClose={() => setShowViewPicture(false)}
        avatar={profile?.avatar}
        avatarEmoji={profile?.avatarEmoji}
        userName={user?.name}
      />

      <ProfilePictureOptionsModal
        visible={showPictureOptions}
        onClose={() => setShowPictureOptions(false)}
        onView={() => setShowViewPicture(true)}
        onUpdate={() => setShowUpdatePicture(true)}
        avatar={profile?.avatar}
        avatarEmoji={profile?.avatarEmoji}
        userName={user?.name}
      />

      <UpdateProfilePictureModal
        visible={showUpdatePicture}
        onClose={() => setShowUpdatePicture(false)}
        onTakePhoto={handleTakePhoto}
        onChooseFromGallery={handleChooseFromGallery}
        onSelectSticker={handleSelectSticker}
        uploading={updatingAvatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Sizes.l,
  },
  loadingContainer: {
    padding: Sizes.xxxl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Sizes.m,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Sizes.xxxl,
    paddingTop: Sizes.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Sizes.l,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  avatarText: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.inverse,
  },
  avatarEmoji: {
    fontSize: Sizes.fontSize.giant,
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
    marginBottom: Sizes.xxxl,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.l,
  },
  infoCard: {
    backgroundColor: Colors.background.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.l,
  },
  infoContent: {
    marginLeft: Sizes.m,
    flex: 1,
  },
  infoLabel: {
    fontSize: Sizes.fontSize.s,
    color: Colors.text.secondary,
    marginBottom: Sizes.xs / 2,
  },
  infoValue: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  weightCard: {
    backgroundColor: Colors.background.secondary,
  },
  weightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.m,
    paddingBottom: Sizes.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  weightItemLeft: {
    flex: 1,
  },
  weightValue: {
    fontSize: Sizes.fontSize.l,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.xs / 2,
  },
  weightDate: {
    fontSize: Sizes.fontSize.s,
    color: Colors.text.secondary,
  },
  weightChange: {
    marginLeft: Sizes.m,
  },
  allergiesCard: {
    backgroundColor: Colors.background.secondary,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.m,
    padding: Sizes.m,
    backgroundColor: Colors.warning + '10',
    borderRadius: BorderRadius.m,
  },
  allergyText: {
    marginLeft: Sizes.s,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
  },
  issuesCard: {
    backgroundColor: Colors.background.secondary,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.m,
    padding: Sizes.m,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.m,
  },
  issueText: {
    marginLeft: Sizes.s,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
  },
  emptyCard: {
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: Sizes.m,
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Sizes.xs,
  },
  emptySubtext: {
    fontSize: Sizes.fontSize.s,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: Colors.background.secondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.l,
  },
  settingText: {
    flex: 1,
    marginLeft: Sizes.m,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
  },
  settingDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: Sizes.l + Sizes.icon.m + Sizes.m,
  },
  logoutContainer: {
    marginTop: Sizes.xxxl,
    marginBottom: Sizes.xxxl,
  },
});
