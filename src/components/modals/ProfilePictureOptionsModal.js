/**
 * Profile Picture Options Modal
 * Bottom modal for viewing or updating profile picture
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from '../Modal';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';

export default function ProfilePictureOptionsModal({
  visible,
  onClose,
  onView,
  onUpdate,
  avatar,
  avatarEmoji,
  userName,
}) {
  const getUserInitials = () => {
    if (userName) {
      return userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'BK';
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Profile Picture"
      maxHeight="50%"
    >
      <View style={styles.container}>
        {/* Avatar Preview */}
        <View style={styles.avatarPreviewContainer}>
          <View style={styles.avatarPreview}>
            {avatar && typeof avatar === 'string' && avatar.trim() ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : avatarEmoji && typeof avatarEmoji === 'string' && avatarEmoji.trim() ? (
              <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getUserInitials()}</Text>
              </View>
            )}
          </View>
          {userName && (
            <Text style={styles.userName}>{userName}</Text>
          )}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onView();
              onClose();
            }}
          >
            <Ionicons name="eye-outline" size={Sizes.icon.l} color={Colors.text.primary} />
            <Text style={styles.optionText}>View Profile Picture</Text>
            <Ionicons name="chevron-forward" size={Sizes.icon.s} color={Colors.text.secondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onUpdate();
              onClose();
            }}
          >
            <Ionicons name="camera-outline" size={Sizes.icon.l} color={Colors.text.primary} />
            <Text style={styles.optionText}>Update Profile Picture</Text>
            <Ionicons name="chevron-forward" size={Sizes.icon.s} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Sizes.l,
  },
  avatarPreviewContainer: {
    alignItems: 'center',
    marginBottom: Sizes.xl,
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.m,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarEmoji: {
    fontSize: 60,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.inverse,
  },
  userName: {
    fontSize: Sizes.fontSize.l,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  optionsContainer: {
    gap: Sizes.xs,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.l,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.m,
  },
  optionText: {
    flex: 1,
    marginLeft: Sizes.m,
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Sizes.xs,
  },
});

