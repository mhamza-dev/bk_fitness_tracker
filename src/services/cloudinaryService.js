/**
 * Cloudinary Service
 * Handles image and video uploads, deletions, and resource fetching from Cloudinary
 */

import 'react-native-url-polyfill/auto';

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const API_KEY = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY;
const API_SECRET = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET;
const CLOUDINARY_IMAGE_UPLOAD_URL = CLOUD_NAME
    ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    : null;
const CLOUDINARY_VIDEO_UPLOAD_URL = CLOUD_NAME
    ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
    : null;
const CLOUDINARY_DELETE_URL = CLOUD_NAME
    ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources`
    : null;
const CLOUDINARY_RESOURCES_BY_FOLDER_URL = CLOUD_NAME
    ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/by_asset_folder`
    : null;

/**
 * Generic function to upload media (image or video) to Cloudinary.
 *
 * @param {string} uri - Local media URI (from ImagePicker or camera)
 * @param {string} mediaType - 'image' or 'video'
 * @param {Object} options - Optional Cloudinary options (e.g. folder, quality)
 * @returns {Promise<{url: string, publicId: string}>} - The secure URL and public_id of the uploaded media
 */
export const uploadMediaToCloudinary = async (uri, mediaType = 'image', options = {}) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error(
            'Cloudinary is not configured. Please set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET.'
        );
    }

    if (!uri) {
        throw new Error(`No ${mediaType} URI provided for upload.`);
    }

    // Determine upload URL based on media type
    const uploadUrl = mediaType === 'video'
        ? CLOUDINARY_VIDEO_UPLOAD_URL
        : CLOUDINARY_IMAGE_UPLOAD_URL;

    if (!uploadUrl) {
        throw new Error('Cloudinary upload URL is not configured.');
    }

    const formData = new FormData();

    // Determine file type and name based on media type
    let fileType, fileName;
    if (mediaType === 'video') {
        const filename = uri.split('/').pop() || 'upload.mp4';
        const match = /\.(\w+)$/.exec(filename);
        fileType = match ? `video/${match[1]}` : 'video/mp4';
        fileName = filename;
    } else {
        fileType = 'image/jpeg';
        fileName = 'upload.jpg';
    }

    formData.append('file', {
        uri,
        type: fileType,
        name: fileName,
    });

    formData.append('upload_preset', UPLOAD_PRESET);

    // Add quality for videos (default 0.5% if not specified)
    if (mediaType === 'video') {
        formData.append('quality', options.quality || '0.5');
    }

    if (options.folder) {
        formData.append('folder', options.folder);
    }

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        const json = await response.json();

        if (!response.ok) {
            const message =
                json?.error?.message || json?.message || `${mediaType} upload failed.`;
            throw new Error(message);
        }

        if (!json.secure_url) {
            throw new Error('Upload succeeded but no URL returned from Cloudinary.');
        }

        return {
            url: json.secure_url,
            publicId: json.public_id,
        };
    } catch (error) {
        console.error(`Cloudinary ${mediaType} upload error:`, error);
        throw error;
    }
};

/**
 * Upload an image to Cloudinary and return the secure URL and public_id.
 *
 * @param {string} uri - Local image URI (from ImagePicker or camera)
 * @param {Object} options - Optional Cloudinary options (e.g. folder)
 * @returns {Promise<{url: string, publicId: string}>} - The secure URL and public_id of the uploaded image
 */
export const uploadImageToCloudinary = async (uri, options = {}) => {
    return uploadMediaToCloudinary(uri, 'image', options);
};

/**
 * Upload a video to Cloudinary with 0.5% quality and return the secure URL and public_id.
 *
 * @param {string} uri - Local video URI (from ImagePicker or camera)
 * @param {Object} options - Optional Cloudinary options (e.g. folder, quality)
 * @returns {Promise<{url: string, publicId: string}>} - The secure URL and public_id of the uploaded video
 */
export const uploadVideoToCloudinary = async (uri, options = {}) => {
    // Default quality to 0.5% for videos if not specified
    return uploadMediaToCloudinary(uri, 'video', { quality: '0.5', ...options });
};

/**
 * Delete an uploaded media file from Cloudinary using its public_id.
 *
 * @param {string} publicId - The public_id of the media to delete
 * @param {string} resourceType - 'image' or 'video' (default: 'image')
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    if (!CLOUD_NAME || !UPLOAD_PRESET || !CLOUDINARY_DELETE_URL) {
        console.warn('Cloudinary is not configured. Cannot delete media.');
        return;
    }

    if (!publicId) {
        console.warn('No public_id provided for deletion.');
        return;
    }

    try {
        // Cloudinary delete endpoint requires signature for authenticated requests
        // For unsigned uploads, we can use the destroy endpoint with the upload preset
        // Note: This may require additional configuration on Cloudinary side
        const deleteUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/destroy`;

        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(deleteUrl, {
            method: 'POST',
            body: formData,
        });

        const json = await response.json();

        if (!response.ok || json.result !== 'ok') {
            console.warn('Failed to delete from Cloudinary:', json);
            // Don't throw - deletion failure shouldn't break the flow
        } else {
            console.log('Successfully deleted media from Cloudinary:', publicId);
        }
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        // Don't throw - deletion failure shouldn't break the flow
    }
};

/**
 * Fetch resources (images) from a Cloudinary folder using asset_folder API
 * 
 * @param {string} folder - Folder path in Cloudinary (e.g., 'bk-fitness/stickers')
 * @param {Object} options - Optional parameters (max_results, etc.)
 * @returns {Promise<Array>} - Array of sticker objects with { id, url, name, category }
 */
export const fetchResourcesFromFolder = async (folder = 'bk-fitness/stickers', options = {}) => {
    if (!CLOUD_NAME) {
        throw new Error(
            'Cloudinary is not configured. Please set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME.'
        );
    }

    if (!CLOUDINARY_RESOURCES_BY_FOLDER_URL) {
        throw new Error('Cloudinary resources by folder URL is not configured.');
    }

    try {
        // Helper function to create authenticated fetch options
        const createFetchOptions = () => {
            const fetchOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (API_KEY && API_SECRET) {
                const credentials = `${API_KEY}:${API_SECRET}`;
                let base64Credentials = '';
                if (typeof btoa !== 'undefined') {
                    base64Credentials = btoa(credentials);
                } else {
                    // Manual base64 encoding for React Native
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                    let result = '';
                    let i = 0;
                    while (i < credentials.length) {
                        const a = credentials.charCodeAt(i++);
                        const b = i < credentials.length ? credentials.charCodeAt(i++) : 0;
                        const c = i < credentials.length ? credentials.charCodeAt(i++) : 0;
                        const bitmap = (a << 16) | (b << 8) | c;
                        result += chars.charAt((bitmap >> 18) & 63);
                        result += chars.charAt((bitmap >> 12) & 63);
                        result += i - 2 < credentials.length ? chars.charAt((bitmap >> 6) & 63) : '=';
                        result += i - 1 < credentials.length ? chars.charAt(bitmap & 63) : '=';
                    }
                    base64Credentials = result;
                }
                if (base64Credentials) {
                    fetchOptions.headers['Authorization'] = `Basic ${base64Credentials}`;
                }
            }
            return fetchOptions;
        };

        // Use asset_folder API (for dynamic folder mode)
        const params = new URLSearchParams({
            asset_folder: folder,
            max_results: options.maxResults || 500,
        });
        const url = `${CLOUDINARY_RESOURCES_BY_FOLDER_URL}?${params.toString()}`;

        const fetchOptions = createFetchOptions();
        const response = await fetch(url, fetchOptions);
        const json = await response.json();

        if (!response.ok) {
            let errorMessage = json?.error?.message || json?.message || 'Failed to fetch resources from Cloudinary.';
            if (response.status === 401 || response.status === 403) {
                errorMessage += ' Authentication required.';
            }
            throw new Error(errorMessage);
        }

        const resources = json.resources || [];

        if (resources.length === 0) {
            throw new Error(`No resources found in folder "${folder}"`);
        }

        const stickers = resources.map((resource, index) => {
            // Extract name from public_id (remove folder path and extension)
            const publicIdParts = resource.public_id.split('/');
            const fileName = publicIdParts[publicIdParts.length - 1];
            const name = fileName
                .replace(/[-_]/g, ' ')
                .replace(/\.[^/.]+$/, '') // Remove extension
                .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words

            return {
                id: resource.public_id || `sticker-${index + 1}`,
                url: resource.secure_url || resource.url,
                name: name || `Sticker ${index + 1}`,
                category: 'fitness',
            };
        });

        return stickers;
    } catch (error) {
        console.error('Cloudinary fetch resources error:', error);
        throw error;
    }
};

export default {
    uploadMediaToCloudinary,
    uploadImageToCloudinary,
    uploadVideoToCloudinary,
    deleteFromCloudinary,
    fetchResourcesFromFolder,
};


