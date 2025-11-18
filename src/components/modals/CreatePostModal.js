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
import * as ImagePicker from 'expo-image-picker';
import { usePosts } from '../../hooks';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';
import { Input, Button } from '../index';

export default function CreatePostModal({ visible, onClose, onPostCreated }) {
  const { createPost, loading } = usePosts();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!image && !caption.trim()) {
      Alert.alert('Error', 'Please add an image or caption');
      return;
    }

    try {
      const formData = new FormData();
      
      if (image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('image', {
          uri: image,
          name: filename,
          type,
        });
      }
      
      if (caption.trim()) {
        formData.append('caption', caption.trim());
      }
      
      if (location.trim()) {
        formData.append('location', location.trim());
      }
      
      if (tags.trim()) {
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
        formData.append('tags', JSON.stringify(tagArray));
      }

      await createPost(formData);
      
      // Reset form
      setCaption('');
      setLocation('');
      setTags('');
      setImage(null);
      
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create post');
    }
  };

  const handleClose = () => {
    if (!loading) {
      setCaption('');
      setLocation('');
      setTags('');
      setImage(null);
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
          <TouchableOpacity onPress={handleClose} disabled={loading}>
            <Text style={[styles.cancelButton, loading && styles.disabled]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Post</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={[styles.postButton, loading && styles.disabled]}>
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {/* Image Section */}
          <View style={styles.imageSection}>
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close-circle" size={Sizes.icon.l} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={showImagePicker}
              >
                <Ionicons name="camera" size={Sizes.icon.xxl} color={Colors.text.secondary} />
                <Text style={styles.addImageText}>Add Photo</Text>
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

