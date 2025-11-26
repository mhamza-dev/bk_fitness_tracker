/**
 * Create Post Modal
 * Modal for creating new posts with image, caption, location, tags
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePosts, useMediaPicker } from '../../hooks';
import { uploadMediaToCloudinary, deleteFromCloudinary } from '../../services/uploadService';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';
import { Input } from '../index';

export default function CreatePostModal({ visible, onClose, onPostCreated }) {
  const { createPost, loading } = usePosts();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);

  // Use media picker hook
  const {
    media,
    mediaType,
    showMediaPicker,
    clearMedia,
  } = useMediaPicker({
    aspect: [1, 1],
    imageQuality: 0.8,
    videoQuality: 0.5,
    videoMaxDuration: 60,
  });

  const handleSubmit = async () => {
    if (!media && !caption.trim()) {
      Alert.alert('Error', 'Please add media or caption');
      return;
    }

    let uploadedPublicId = null;
    let uploadedResourceType = null;

    try {
      let mediaUrl = null;

      if (media) {
        setUploading(true);
        const result = await uploadMediaToCloudinary(media, mediaType, { folder: 'bk-fitness/posts' });
        mediaUrl = result.url;
        uploadedPublicId = result.publicId;
        uploadedResourceType = mediaType;
      }

      const payload = {};

      if (mediaUrl) {
        // Send postMedia array with mediaUrl and mediaType
        payload.postMedia = [{
          mediaUrl: mediaUrl,
          mediaType: mediaType,
        }];
      }

      if (caption.trim()) {
        payload.caption = caption.trim();
      }

      if (location.trim()) {
        payload.location = location.trim();
      }

      if (tags.trim()) {
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
        payload.tags = tagArray;
      }

      await createPost(payload);

      // Reset form
      setCaption('');
      setLocation('');
      setTags('');
      clearMedia();

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);

      // If post creation failed and we uploaded media, delete it from Cloudinary
      if (uploadedPublicId && uploadedResourceType) {
        try {
          await deleteFromCloudinary(uploadedPublicId, uploadedResourceType);
          console.log('Deleted uploaded media after post creation failure');
        } catch (deleteError) {
          console.error('Failed to delete uploaded media:', deleteError);
        }
      }

      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !uploading) {
      setCaption('');
      setLocation('');
      setTags('');
      clearMedia();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={loading || uploading}>
            <Text style={[styles.cancelButton, (loading || uploading) && styles.disabled]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Post</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading || uploading}>
            {loading || uploading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={[styles.postButton, (loading || uploading) && styles.disabled]}>
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {/* Media Section */}
          <View style={styles.imageSection}>
            {media ? (
              <View style={styles.imageContainer}>
                {mediaType === 'video' ? (
                  <View style={styles.videoPreview}>
                    <Ionicons name="videocam" size={Sizes.icon.xxl} color={Colors.text.secondary} />
                    <Text style={styles.videoPreviewText}>Video Selected</Text>
                  </View>
                ) : (
                  <Image source={{ uri: media }} style={styles.image} />
                )}
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={clearMedia}
                >
                  <Ionicons name="close-circle" size={Sizes.icon.l} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={() => showMediaPicker()}
              >
                <Ionicons name="camera" size={Sizes.icon.xxl} color={Colors.text.secondary} />
                <Text style={styles.addImageText}>Add Photo/Video</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <Input
              label="Caption"
              placeholder="Write a caption..."
              value={caption}
              onChangeText={setCaption}
              multiline
              numberOfLines={4}
              containerStyle={styles.inputContainer}
              inputStyle={styles.textArea}
            />

            <Input
              label="Location"
              placeholder="Add location"
              value={location}
              onChangeText={setLocation}
              icon="location-outline"
              containerStyle={styles.inputContainer}
            />

            <Input
              label="Tags (comma separated)"
              placeholder="e.g., fitness, workout, health"
              value={tags}
              onChangeText={setTags}
              icon="pricetag-outline"
              containerStyle={styles.inputContainer}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizes.l,
    paddingVertical: Sizes.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  cancelButton: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  postButton: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: Sizes.fontSize.l,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    padding: Sizes.l,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.m,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: Sizes.m,
    right: Sizes.m,
    backgroundColor: Colors.background.primary + '80',
    borderRadius: BorderRadius.round,
  },
  addImageButton: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.m,
    borderWidth: 2,
    borderColor: Colors.border.light,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    marginTop: Sizes.m,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPreviewText: {
    marginTop: Sizes.m,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  form: {
    padding: Sizes.l,
  },
  inputContainer: {
    marginBottom: Sizes.l,
  },
  textArea: {
    minHeight: Sizes.input.l * 2,
    textAlignVertical: 'top',
  },
});

