/**
 * View Profile Picture Modal
 * Modal for viewing profile picture in full size
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, FontWeight } from '../../styles';

export default function ViewProfilePictureModal({ visible, onClose, avatar, avatarEmoji, userName }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.content} onStartShouldSetResponder={() => true}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={Sizes.icon.l} color={Colors.text.primary} />
            </TouchableOpacity>

            {/* Profile Picture */}
            <View style={styles.avatarContainer}>
              {avatar && typeof avatar === 'string' && avatar.trim() ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} resizeMode="cover" />
              ) : avatarEmoji && typeof avatarEmoji === 'string' && avatarEmoji.trim() ? (
                <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={Sizes.icon.xxl} color={Colors.text.secondary} />
                </View>
              )}
            </View>

            {/* User Name */}
            {userName && (
              <Text style={styles.userName}>{userName}</Text>
            )}
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.l,
  },
  closeButton: {
    position: 'absolute',
    top: Sizes.xxxl,
    right: Sizes.l,
    zIndex: 1,
    padding: Sizes.m,
    backgroundColor: Colors.background.secondary + '80',
    borderRadius: Sizes.icon.l / 2,
  },
  avatarContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarEmoji: {
    fontSize: 120,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.tertiary,
  },
  userName: {
    marginTop: Sizes.xl,
    fontSize: Sizes.fontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
});

