/**
 * Update Profile Picture Modal
 * Bottom modal for updating profile picture with camera, gallery, or sticker options
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
import Modal from '../Modal';
import StickerPicker from '../StickerPicker';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';

export default function UpdateProfilePictureModal({
    visible,
    onClose,
    onTakePhoto,
    onChooseFromGallery,
    onSelectSticker,
    uploading,
}) {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Update Profile Picture"
            maxHeight="100%"
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

                {/* Sticker Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Or Choose a Sticker</Text>
                    <StickerPicker
                        onSelectSticker={(sticker) => {
                            if (onSelectSticker) {
                                onSelectSticker(sticker);
                            }
                            onClose();
                        }}
                        disabled={uploading}
                    />
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
});

