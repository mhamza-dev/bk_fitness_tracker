/**
 * Update Profile Picture Modal
 * Bottom modal for updating profile picture with camera, gallery, or emoji options
 */

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '../index';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';

const EMOJI_AVATARS = ['💪', '🏃‍♂️', '🏋️‍♀️', '🚴‍♂️', '🥦', '🔥'];

export default function UpdateProfilePictureModal({
    visible,
    onClose,
    onTakePhoto,
    onChooseFromGallery,
    onSelectEmoji,
    uploading,
}) {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Update Profile Picture"
            maxHeight="70%"
        >
            <View style={styles.container}>
                {/* Media Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Choose Photo</Text>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={onTakePhoto}
                        disabled={uploading}
                    >
                        <View style={styles.optionIconContainer}>
                            <Ionicons name="camera" size={Sizes.icon.l} color={Colors.primary} />
                        </View>
                        <Text style={styles.optionText}>Take Photo</Text>
                        {uploading && (
                            <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={onChooseFromGallery}
                        disabled={uploading}
                    >
                        <View style={styles.optionIconContainer}>
                            <Ionicons name="images-outline" size={Sizes.icon.l} color={Colors.primary} />
                        </View>
                        <Text style={styles.optionText}>Choose from Gallery</Text>
                        {uploading && (
                            <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Emoji Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Or Choose an Emoji</Text>
                    <View style={styles.emojiContainer}>
                        {EMOJI_AVATARS.map((emoji) => (
                            <TouchableOpacity
                                key={emoji}
                                style={styles.emojiOption}
                                onPress={() => {
                                    onSelectEmoji(emoji);
                                    onClose();
                                }}
                                disabled={uploading}
                            >
                                <Text style={styles.emojiText}>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Sizes.l,
    },
    section: {
        marginBottom: Sizes.xl,
    },
    sectionTitle: {
        fontSize: Sizes.fontSize.m,
        fontWeight: FontWeight.semibold,
        color: Colors.text.secondary,
        marginBottom: Sizes.m,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Sizes.l,
        backgroundColor: Colors.background.tertiary,
        borderRadius: BorderRadius.m,
        marginBottom: Sizes.m,
    },
    optionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Sizes.m,
    },
    optionText: {
        flex: 1,
        fontSize: Sizes.fontSize.m,
        fontWeight: FontWeight.medium,
        color: Colors.text.primary,
    },
    loader: {
        marginLeft: Sizes.m,
    },
    emojiContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Sizes.m,
    },
    emojiOption: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.background.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.border.light,
    },
    emojiText: {
        fontSize: 30,
    },
});

