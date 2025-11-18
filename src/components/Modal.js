/**
 * Generic Modal Component
 * Reusable modal component with backdrop and slide-up animation
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, BorderRadius, FontWeight } from '../styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const GenericModal = ({
  visible,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnBackdrop = true,
  maxHeight = '90%',
  scrollable = true,
}) => {
  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  // Calculate max height in pixels
  const maxHeightValue = typeof maxHeight === 'string'
    ? (parseFloat(maxHeight) / 100) * SCREEN_HEIGHT
    : maxHeight;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
          keyboardVerticalOffset={0}
        >
          <View style={[styles.modalContent, { maxHeight: maxHeightValue }]}>
            {/* Drag Handle */}
            <View style={styles.dragHandleContainer}>
              <View style={styles.headerDragHandle} />
            </View>

            {/* Header - Fixed at top */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {title && typeof title === 'string' && (
                  <Text style={styles.headerTitle}>{title}</Text>
                )}
                {title && typeof title !== 'string' && title}
              </View>
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={Sizes.icon.l} color={Colors.text.primary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Content - Scrollable area */}
            <View style={styles.contentWrapper}>
              <SafeAreaView edges={['bottom']} style={styles.safeAreaContent}>
                {scrollable ? (
                  <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    {children}
                  </ScrollView>
                ) : (
                  <View style={styles.content}>{children}</View>
                )}
              </SafeAreaView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  keyboardView: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: BorderRadius.card.xl,
    borderTopRightRadius: BorderRadius.card.xl,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'column',
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: Sizes.m,
    paddingBottom: Sizes.xs,
  },
  headerDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border.medium,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.l,
    paddingTop: Sizes.m,
    paddingBottom: Sizes.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.secondary,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Sizes.xs,
  },
  contentWrapper: {
    flexGrow: 1,
    flexShrink: 1,
    height: "60%",
  },
  safeAreaContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Sizes.l,
    paddingBottom: Sizes.xxxl,
  },
  content: {
    padding: Sizes.l,
    paddingBottom: Sizes.xxxl,
  },
});

export default GenericModal;
