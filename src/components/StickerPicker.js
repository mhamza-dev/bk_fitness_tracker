/**
 * Sticker Picker Component
 * WhatsApp-style sticker picker with scrollable grid
 */

import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStickerStore } from '../stores';
import { Colors, Sizes, FontWeight, BorderRadius } from '../styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Calculate sticker size for 4 per row:
// Screen width - container padding (left + right) - item margins (4 items * 2 sides each)
const STICKER_SIZE = (SCREEN_WIDTH - (Sizes.m * 2) - (Sizes.m * 8)) / 4;

export default function StickerPicker({ onSelectSticker, disabled = false }) {
    const { stickers, loading, error, fetchStickers, loadStickersFromStorage } = useStickerStore();
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [loadingStickers, setLoadingStickers] = useState({});
    const [errorStickers, setErrorStickers] = useState({});

    // Fetch stickers when component mounts (lazy load)
    useEffect(() => {
        const loadStickers = async () => {
            await loadStickersFromStorage();
            try {
                await fetchStickers();
            } catch (err) {
                // Error is handled by store
            }
        };
        loadStickers();
    }, []);

    const handleStickerPress = (sticker) => {
        if (disabled) return;
        setSelectedSticker(sticker.id);
        if (onSelectSticker) {
            onSelectSticker(sticker);
        }
    };

    const handleImageLoadStart = (stickerId) => {
        setLoadingStickers(prev => ({ ...prev, [stickerId]: true }));
        setErrorStickers(prev => {
            const newState = { ...prev };
            delete newState[stickerId];
            return newState;
        });
        // Timeout: if image doesn't load in 10 seconds, show it anyway
        setTimeout(() => {
            setLoadingStickers(prev => {
                if (prev[stickerId]) {
                    const newState = { ...prev };
                    delete newState[stickerId];
                    return newState;
                }
                return prev;
            });
        }, 10000);
    };

    const handleImageLoadEnd = (stickerId) => {
        setLoadingStickers(prev => {
            const newState = { ...prev };
            delete newState[stickerId];
            return newState;
        });
    };

    const handleImageError = (stickerId) => {
        setLoadingStickers(prev => {
            const newState = { ...prev };
            delete newState[stickerId];
            return newState;
        });
        setErrorStickers(prev => ({ ...prev, [stickerId]: true }));
    };

    // Show loading state while fetching
    if (loading && stickers.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingStateContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading stickers...</Text>
                </View>
            </View>
        );
    }

    // Show error state if fetch failed and no cached stickers
    if (error && stickers.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.errorStateContainer}>
                    <Ionicons name="alert-circle-outline" size={Sizes.icon.l} color={Colors.error} />
                    <Text style={styles.errorText}>Failed to load stickers</Text>
                    <Text style={styles.errorSubtext}>{error}</Text>
                </View>
            </View>
        );
    }

    // Show empty state if no stickers
    if (stickers.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyStateContainer}>
                    <Ionicons name="image-outline" size={Sizes.icon.xl} color={Colors.text.secondary} />
                    <Text style={styles.emptyText}>No stickers available</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.stickerGrid}>
                    {stickers.map((sticker) => (
                        <TouchableOpacity
                            key={sticker.id}
                            style={[
                                styles.stickerItem,
                                selectedSticker === sticker.id && styles.stickerItemSelected,
                            ]}
                            onPress={() => handleStickerPress(sticker)}
                            disabled={disabled}
                            activeOpacity={0.7}
                        >
                            {loadingStickers[sticker.id] && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color={Colors.primary} />
                                </View>
                            )}
                            {errorStickers[sticker.id] ? (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="image-outline" size={Sizes.icon.m} color={Colors.text.secondary} />
                                </View>
                            ) : (
                                <Image
                                    source={{ uri: sticker.url }}
                                    style={styles.stickerImage}
                                    resizeMode="contain"
                                    onLoadStart={() => handleImageLoadStart(sticker.id)}
                                    onLoadEnd={() => handleImageLoadEnd(sticker.id)}
                                    onError={() => handleImageError(sticker.id)}
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 200,
        maxHeight: 400,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: Sizes.m,
    },
    stickerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    stickerItem: {
        width: STICKER_SIZE,
        height: STICKER_SIZE,
        margin: Sizes.xs,
        borderRadius: BorderRadius.m,
        backgroundColor: Colors.background.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.border.light,
        overflow: 'hidden',
    },
    stickerItemSelected: {
        borderColor: Colors.primary,
        borderWidth: 3,
        backgroundColor: Colors.primary + '10',
    },
    stickerImage: {
        width: STICKER_SIZE,
        height: STICKER_SIZE,
    },
    loadingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background.secondary,
    },
    loadingStateContainer: {
        padding: Sizes.xxxl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    loadingText: {
        marginTop: Sizes.m,
        fontSize: Sizes.fontSize.m,
        color: Colors.text.secondary,
    },
    errorStateContainer: {
        padding: Sizes.xxxl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    errorText: {
        marginTop: Sizes.m,
        fontSize: Sizes.fontSize.m,
        fontWeight: FontWeight.semibold,
        color: Colors.error,
        textAlign: 'center',
    },
    errorSubtext: {
        marginTop: Sizes.xs,
        fontSize: Sizes.fontSize.s,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
    emptyStateContainer: {
        padding: Sizes.xxxl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    emptyText: {
        marginTop: Sizes.m,
        fontSize: Sizes.fontSize.m,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
});

