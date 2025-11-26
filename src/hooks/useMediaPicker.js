/**
 * useMediaPicker Hook
 * Reusable hook for picking media (images/videos) from gallery or camera
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * Custom hook for media picking functionality
 * @param {Object} options - Configuration options
 * @param {number} options.aspect - Aspect ratio [width, height] (default: [1, 1])
 * @param {number} options.imageQuality - Image quality 0-1 (default: 0.8)
 * @param {number} options.videoQuality - Video quality 0-1 (default: 0.5)
 * @param {number} options.videoMaxDuration - Max video duration in seconds (default: 60)
 * @returns {Object} - Media picker functions and state
 */
export const useMediaPicker = (options = {}) => {
    const {
        aspect = [1, 1],
        imageQuality = 0.8,
        videoQuality = 0.5,
        videoMaxDuration = 60,
    } = options;

    const [media, setMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null); // 'image' or 'video'

    /**
     * Pick media from gallery (images or videos)
     */
    const pickMedia = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera roll permissions to upload media.');
                return null;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'videos'], // Allow both images and videos
                allowsEditing: true,
                aspect,
                quality: imageQuality,
                videoMaxDuration,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const type = asset.type === 'video' ? 'video' : 'image';
                setMedia(asset.uri);
                setMediaType(type);
                return { uri: asset.uri, type };
            }
            return null;
        } catch (error) {
            console.error('Error picking media:', error);
            Alert.alert('Error', 'Failed to pick media');
            return null;
        }
    };

    /**
     * Take a photo using the camera
     */
    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
                return null;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect,
                quality: imageQuality,
            });

            if (!result.canceled && result.assets[0]) {
                setMedia(result.assets[0].uri);
                setMediaType('image');
                return { uri: result.assets[0].uri, type: 'image' };
            }
            return null;
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo');
            return null;
        }
    };

    /**
     * Record a video using the camera
     */
    const takeVideo = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera permissions to record videos.');
                return null;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: "videos",
                allowsEditing: true,
                aspect,
                quality: videoQuality,
                videoMaxDuration,
            });

            if (!result.canceled && result.assets[0]) {
                setMedia(result.assets[0].uri);
                setMediaType('video');
                return { uri: result.assets[0].uri, type: 'video' };
            }
            return null;
        } catch (error) {
            console.error('Error taking video:', error);
            Alert.alert('Error', 'Failed to take video');
            return null;
        }
    };

    /**
     * Show media picker options alert
     * If no callbacks provided, uses internal state management
     * @param {Function} onPhotoSelected - Optional callback when photo is selected
     * @param {Function} onVideoSelected - Optional callback when video is selected
     * @param {Function} onMediaSelected - Optional callback when media is selected from gallery
     */
    const showMediaPicker = (onPhotoSelected, onVideoSelected, onMediaSelected) => {
        Alert.alert(
            'Add Media',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: async () => {
                        const result = await takePhoto();
                        if (result) {
                            if (onPhotoSelected) {
                                onPhotoSelected(result);
                            }
                            // State is already updated by takePhoto
                        }
                    },
                },
                {
                    text: 'Record Video',
                    onPress: async () => {
                        const result = await takeVideo();
                        if (result) {
                            if (onVideoSelected) {
                                onVideoSelected(result);
                            }
                            // State is already updated by takeVideo
                        }
                    },
                },
                {
                    text: 'Choose from Gallery',
                    onPress: async () => {
                        const result = await pickMedia();
                        if (result) {
                            if (onMediaSelected) {
                                onMediaSelected(result);
                            }
                            // State is already updated by pickMedia
                        }
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    /**
     * Clear selected media
     */
    const clearMedia = () => {
        setMedia(null);
        setMediaType(null);
    };

    return {
        media,
        mediaType,
        pickMedia,
        takePhoto,
        takeVideo,
        showMediaPicker,
        clearMedia,
        setMedia,
        setMediaType,
    };
};

